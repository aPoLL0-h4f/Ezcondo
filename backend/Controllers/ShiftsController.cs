using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ShiftsController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public ShiftsController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<ShiftSchedule>>> GetAll()
    {
        return await _db.ShiftSchedules.Include(s => s.StaffAssigned).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ShiftSchedule>> GetById(string id)
    {
        var shift = await _db.ShiftSchedules.Include(s => s.StaffAssigned).FirstOrDefaultAsync(s => s.Id == id);
        return shift is null ? NotFound() : Ok(shift);
    }

    [HttpPost]
    public async Task<ActionResult<ShiftSchedule>> Create(ShiftSchedule shift)
    {
        if (string.IsNullOrEmpty(shift.Id))
            shift.Id = $"sh-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";

        foreach (var assignment in shift.StaffAssigned)
        {
            if (string.IsNullOrEmpty(assignment.Id))
                assignment.Id = $"sa-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{Guid.NewGuid().ToString()[..4]}";
            assignment.ShiftScheduleId = shift.Id;
        }

        _db.ShiftSchedules.Add(shift);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = shift.Id }, shift);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, ShiftSchedule shift)
    {
        if (id != shift.Id) return BadRequest();
        _db.Entry(shift).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var shift = await _db.ShiftSchedules.FindAsync(id);
        if (shift is null) return NotFound();
        _db.ShiftSchedules.Remove(shift);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
