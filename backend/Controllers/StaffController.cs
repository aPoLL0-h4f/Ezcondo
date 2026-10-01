using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StaffController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public StaffController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<StaffMember>>> GetAll()
    {
        return await _db.StaffMembers.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StaffMember>> GetById(string id)
    {
        var staff = await _db.StaffMembers.FindAsync(id);
        return staff is null ? NotFound() : Ok(staff);
    }

    [HttpPost]
    public async Task<ActionResult<StaffMember>> Create(StaffMember staff)
    {
        if (string.IsNullOrEmpty(staff.Id))
            staff.Id = $"st-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";

        _db.StaffMembers.Add(staff);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = staff.Id }, staff);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, StaffMember staff)
    {
        if (id != staff.Id) return BadRequest();
        _db.Entry(staff).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var staff = await _db.StaffMembers.FindAsync(id);
        if (staff is null) return NotFound();
        _db.StaffMembers.Remove(staff);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
