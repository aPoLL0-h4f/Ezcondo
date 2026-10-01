using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class InvoicesController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public InvoicesController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Invoice>>> GetAll()
    {
        return await _db.Invoices.Include(i => i.Items).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Invoice>> GetById(string id)
    {
        var inv = await _db.Invoices.Include(i => i.Items).FirstOrDefaultAsync(i => i.Id == id);
        return inv is null ? NotFound() : Ok(inv);
    }

    [HttpPost]
    public async Task<ActionResult<Invoice>> Create(Invoice invoice)
    {
        if (string.IsNullOrEmpty(invoice.Id))
            invoice.Id = $"inv-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";

        foreach (var item in invoice.Items)
        {
            if (string.IsNullOrEmpty(item.Id))
                item.Id = $"ii-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{Guid.NewGuid().ToString()[..4]}";
            item.InvoiceId = invoice.Id;
        }

        _db.Invoices.Add(invoice);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = invoice.Id }, invoice);
    }

    [HttpPatch("{id}/pay")]
    public async Task<IActionResult> Pay(string id, [FromBody] PayInvoiceRequest req)
    {
        var inv = await _db.Invoices.FindAsync(id);
        if (inv is null) return NotFound();

        inv.Status = "paid";
        inv.PaidDate = DateTime.Now.ToString("yyyy-MM-dd");
        inv.PaymentMethod = req.PaymentMethod;
        inv.TransactionId = $"FT-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString()[^8..]}";
        await _db.SaveChangesAsync();
        return Ok(inv);
    }

    [HttpPost("batch-generate")]
    public async Task<ActionResult<List<Invoice>>> BatchGenerate()
    {
        var apartments = await _db.Apartments.ToListAsync();
        var newInvoices = new List<Invoice>();

        foreach (var apt in apartments)
        {
            var invId = $"inv-{apt.Code}-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
            var amount = (long)Math.Round(apt.Area * 16000);
            var inv = new Invoice
            {
                Id = invId,
                InvoiceCode = $"HD-202610-{apt.Code.Replace("-", "")}",
                ApartmentCode = apt.Code,
                ResidentName = apt.CurrentResidentName ?? "Chủ hộ căn hộ",
                Month = "10/2026",
                IssueDate = "2026-10-01",
                DueDate = "2026-10-10",
                Status = "unpaid",
                TotalAmount = amount,
            };
            inv.Items.Add(new InvoiceItem
            {
                Id = $"ii-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{Guid.NewGuid().ToString()[..4]}",
                Description = $"Phí quản lý diện tích {apt.Area} m²",
                Quantity = apt.Area,
                Unit = "m²",
                UnitPrice = 16000,
                Amount = amount,
                InvoiceId = invId
            });
            newInvoices.Add(inv);
        }

        _db.Invoices.AddRange(newInvoices);
        await _db.SaveChangesAsync();
        return Ok(newInvoices);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Invoice invoice)
    {
        if (id != invoice.Id) return BadRequest();
        _db.Entry(invoice).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var inv = await _db.Invoices.FindAsync(id);
        if (inv is null) return NotFound();
        _db.Invoices.Remove(inv);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record PayInvoiceRequest(string PaymentMethod);
