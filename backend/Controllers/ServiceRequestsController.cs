using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceRequestsController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public ServiceRequestsController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<ServiceRequest>>> GetAll()
    {
        return await _db.ServiceRequests.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ServiceRequest>> GetById(string id)
    {
        var req = await _db.ServiceRequests.FindAsync(id);
        return req is null ? NotFound() : Ok(req);
    }

    [HttpPost]
    public async Task<ActionResult<ServiceRequest>> Create(ServiceRequest request)
    {
        if (string.IsNullOrEmpty(request.Id))
            request.Id = $"req-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        if (string.IsNullOrEmpty(request.RequestCode))
            request.RequestCode = $"YC-2026-{Random.Shared.Next(100, 999)}";
        if (string.IsNullOrEmpty(request.CreatedAt))
            request.CreatedAt = DateTime.Now.ToString("yyyy-MM-dd");

        _db.ServiceRequests.Add(request);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = request.Id }, request);
    }

    [HttpPatch("{id}/approve")]
    public async Task<IActionResult> Approve(string id)
    {
        var req = await _db.ServiceRequests.FindAsync(id);
        if (req is null) return NotFound();
        req.Status = "Đã phê duyệt";
        await _db.SaveChangesAsync();
        return Ok(req);
    }

    [HttpPatch("{id}/reject")]
    public async Task<IActionResult> Reject(string id)
    {
        var req = await _db.ServiceRequests.FindAsync(id);
        if (req is null) return NotFound();
        req.Status = "Từ chối";
        await _db.SaveChangesAsync();
        return Ok(req);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, ServiceRequest request)
    {
        if (id != request.Id) return BadRequest();
        _db.Entry(request).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var req = await _db.ServiceRequests.FindAsync(id);
        if (req is null) return NotFound();
        _db.ServiceRequests.Remove(req);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
