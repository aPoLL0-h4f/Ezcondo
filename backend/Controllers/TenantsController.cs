using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TenantsController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public TenantsController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<TenantCondo>>> GetAll()
    {
        return await _db.Tenants.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TenantCondo>> GetById(string id)
    {
        var tenant = await _db.Tenants.FindAsync(id);
        return tenant is null ? NotFound() : Ok(tenant);
    }

    [HttpPost]
    public async Task<ActionResult<TenantCondo>> Create(TenantCondo tenant)
    {
        if (string.IsNullOrEmpty(tenant.Id))
            tenant.Id = $"tenant-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        if (string.IsNullOrEmpty(tenant.CreatedAt))
            tenant.CreatedAt = DateTime.Now.ToString("yyyy-MM-dd");

        _db.Tenants.Add(tenant);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = tenant.Id }, tenant);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, TenantCondo tenant)
    {
        if (id != tenant.Id) return BadRequest();
        _db.Entry(tenant).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var tenant = await _db.Tenants.FindAsync(id);
        if (tenant is null) return NotFound();
        _db.Tenants.Remove(tenant);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
