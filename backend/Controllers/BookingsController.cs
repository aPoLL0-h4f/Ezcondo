using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BookingsController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public BookingsController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<FacilityBooking>>> GetAll()
    {
        return await _db.FacilityBookings.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FacilityBooking>> GetById(string id)
    {
        var booking = await _db.FacilityBookings.FindAsync(id);
        return booking is null ? NotFound() : Ok(booking);
    }

    [HttpPost]
    public async Task<ActionResult<FacilityBooking>> Create(FacilityBooking booking)
    {
        if (string.IsNullOrEmpty(booking.Id))
            booking.Id = $"bk-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";

        _db.FacilityBookings.Add(booking);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = booking.Id }, booking);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, FacilityBooking booking)
    {
        if (id != booking.Id) return BadRequest();
        _db.Entry(booking).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var booking = await _db.FacilityBookings.FindAsync(id);
        if (booking is null) return NotFound();
        _db.FacilityBookings.Remove(booking);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
