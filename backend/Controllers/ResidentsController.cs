using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ResidentsController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public ResidentsController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Resident>>> GetAll()
    {
        return await _db.Residents.Include(r => r.Vehicles).ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Resident>> GetById(string id)
    {
        var res = await _db.Residents.Include(r => r.Vehicles).FirstOrDefaultAsync(r => r.Id == id);
        return res is null ? NotFound() : Ok(res);
    }

    [HttpPost]
    public async Task<ActionResult<Resident>> Create(Resident resident)
    {
        if (string.IsNullOrEmpty(resident.Id))
            resident.Id = $"res-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        if (string.IsNullOrEmpty(resident.MoveInDate))
            resident.MoveInDate = DateTime.Now.ToString("yyyy-MM-dd");

        // Auto-generate vehicle IDs
        foreach (var v in resident.Vehicles)
        {
            if (string.IsNullOrEmpty(v.Id))
                v.Id = $"v-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}-{Guid.NewGuid().ToString()[..4]}";
            v.ResidentId = resident.Id;
        }

        _db.Residents.Add(resident);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = resident.Id }, resident);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Resident resident)
    {
        if (id != resident.Id) return BadRequest();
        _db.Entry(resident).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpPatch("{id}/activate")]
    public async Task<IActionResult> Activate(string id)
    {
        var res = await _db.Residents.FindAsync(id);
        if (res is null) return NotFound();
        res.Status = "active";
        await _db.SaveChangesAsync();
        return Ok(res);
    }

    [HttpPatch("{id}/suspend")]
    public async Task<IActionResult> Suspend(string id)
    {
        var res = await _db.Residents.FindAsync(id);
        if (res is null) return NotFound();
        res.Status = "suspended";
        await _db.SaveChangesAsync();
        return Ok(res);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var res = await _db.Residents.FindAsync(id);
        if (res is null) return NotFound();
        _db.Residents.Remove(res);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
