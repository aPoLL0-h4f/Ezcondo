using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParcelsController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public ParcelsController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<ParcelItem>>> GetAll()
    {
        return await _db.Parcels.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ParcelItem>> GetById(string id)
    {
        var parcel = await _db.Parcels.FindAsync(id);
        return parcel is null ? NotFound() : Ok(parcel);
    }

    [HttpPost]
    public async Task<ActionResult<ParcelItem>> Create(ParcelItem parcel)
    {
        if (string.IsNullOrEmpty(parcel.Id))
            parcel.Id = $"par-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        if (string.IsNullOrEmpty(parcel.TrackingCode))
            parcel.TrackingCode = $"VN-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds().ToString()[^6..]}";

        _db.Parcels.Add(parcel);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = parcel.Id }, parcel);
    }

    [HttpPatch("{id}/received")]
    public async Task<IActionResult> MarkReceived(string id)
    {
        var parcel = await _db.Parcels.FindAsync(id);
        if (parcel is null) return NotFound();
        parcel.Status = "Đã nhận";
        parcel.ReceivedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm");
        await _db.SaveChangesAsync();
        return Ok(parcel);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, ParcelItem parcel)
    {
        if (id != parcel.Id) return BadRequest();
        _db.Entry(parcel).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var parcel = await _db.Parcels.FindAsync(id);
        if (parcel is null) return NotFound();
        _db.Parcels.Remove(parcel);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
