using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ApartmentsController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public ApartmentsController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Apartment>>> GetAll()
    {
        return await _db.Apartments
            .Include(a => a.ResidentHistory)
            .Include(a => a.MaintenanceHistory)
            .ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Apartment>> GetById(string id)
    {
        var apt = await _db.Apartments
            .Include(a => a.ResidentHistory)
            .Include(a => a.MaintenanceHistory)
            .FirstOrDefaultAsync(a => a.Id == id);
        return apt is null ? NotFound() : Ok(apt);
    }

    [HttpPost]
    public async Task<ActionResult<Apartment>> Create(Apartment apartment)
    {
        if (string.IsNullOrEmpty(apartment.Id))
            apartment.Id = $"apt-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";

        _db.Apartments.Add(apartment);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = apartment.Id }, apartment);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Apartment apartment)
    {
        if (id != apartment.Id) return BadRequest();
        _db.Entry(apartment).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateStatusRequest req)
    {
        var apt = await _db.Apartments.FindAsync(id);
        if (apt is null) return NotFound();
        apt.Status = req.Status;
        await _db.SaveChangesAsync();
        return Ok(apt);
    }

    [HttpPatch("{id}/assign-resident")]
    public async Task<IActionResult> AssignResident(string id, [FromBody] AssignResidentRequest req)
    {
        var apt = await _db.Apartments.FindAsync(id);
        if (apt is null) return NotFound();

        apt.Status = "occupied";
        apt.CurrentResidentId = $"res-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        apt.CurrentResidentName = req.ResidentName;
        apt.CurrentResidentPhone = req.Phone;
        apt.CurrentResidentEmail = req.Email;
        apt.CurrentResidentIsOwner = req.IsOwner;

        await _db.SaveChangesAsync();
        return Ok(apt);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var apt = await _db.Apartments.FindAsync(id);
        if (apt is null) return NotFound();
        _db.Apartments.Remove(apt);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record UpdateStatusRequest(string Status);
public record AssignResidentRequest(string ResidentName, string Phone, string Email, bool IsOwner = false);
