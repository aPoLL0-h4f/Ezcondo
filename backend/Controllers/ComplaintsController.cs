using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ComplaintsController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public ComplaintsController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Complaint>>> GetAll()
    {
        return await _db.Complaints.Include(c => c.Messages).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Complaint>> GetById(string id)
    {
        var cmp = await _db.Complaints.Include(c => c.Messages).FirstOrDefaultAsync(c => c.Id == id);
        return cmp is null ? NotFound() : Ok(cmp);
    }

    [HttpPost]
    public async Task<ActionResult<Complaint>> Create(Complaint complaint)
    {
        if (string.IsNullOrEmpty(complaint.Id))
            complaint.Id = $"cmp-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        if (string.IsNullOrEmpty(complaint.TicketCode))
            complaint.TicketCode = $"KN-2026-{Random.Shared.Next(1000, 9999)}";
        if (string.IsNullOrEmpty(complaint.Status))
            complaint.Status = "new";
        if (string.IsNullOrEmpty(complaint.CreatedAt))
        {
            var now = DateTime.Now;
            complaint.CreatedAt = now.ToString("yyyy-MM-dd HH:mm");
        }
        complaint.UpdatedAt = "Vừa xong";

        _db.Complaints.Add(complaint);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = complaint.Id }, complaint);
    }

    [HttpPatch("{id}/status")]
    public async Task<IActionResult> UpdateStatus(string id, [FromBody] UpdateComplaintStatusRequest req)
    {
        var cmp = await _db.Complaints.FindAsync(id);
        if (cmp is null) return NotFound();
        cmp.Status = req.Status;
        cmp.UpdatedAt = "Vừa xong";
        await _db.SaveChangesAsync();
        return Ok(cmp);
    }

    [HttpPost("{id}/messages")]
    public async Task<IActionResult> AddMessage(string id, [FromBody] AddMessageRequest req)
    {
        var cmp = await _db.Complaints.FindAsync(id);
        if (cmp is null) return NotFound();

        var msg = new ComplaintMessage
        {
            Id = $"msg-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}",
            SenderName = req.SenderName,
            SenderRole = req.SenderRole,
            Content = req.Content,
            Timestamp = DateTime.Now.ToString("HH:mm"),
            ComplaintId = id
        };

        _db.ComplaintMessages.Add(msg);
        cmp.UpdatedAt = "Vừa xong";
        await _db.SaveChangesAsync();
        return Ok(msg);
    }

    [HttpPatch("{id}/assign")]
    public async Task<IActionResult> AssignStaff(string id, [FromBody] AssignStaffRequest req)
    {
        var cmp = await _db.Complaints.FindAsync(id);
        if (cmp is null) return NotFound();
        cmp.AssignedTo = req.StaffName;
        cmp.Deadline = req.Deadline;
        cmp.Status = "in_progress";
        cmp.UpdatedAt = "Vừa xong";
        await _db.SaveChangesAsync();
        return Ok(cmp);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Complaint complaint)
    {
        if (id != complaint.Id) return BadRequest();
        _db.Entry(complaint).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var cmp = await _db.Complaints.FindAsync(id);
        if (cmp is null) return NotFound();
        _db.Complaints.Remove(cmp);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}

public record UpdateComplaintStatusRequest(string Status);
public record AddMessageRequest(string SenderName, string SenderRole, string Content);
public record AssignStaffRequest(string StaffName, string Deadline);
