using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public UsersController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<UserAccount>>> GetAll()
    {
        return await _db.UserAccounts.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<UserAccount>> GetById(string id)
    {
        var user = await _db.UserAccounts.FindAsync(id);
        return user is null ? NotFound() : Ok(user);
    }

    [HttpPost]
    public async Task<ActionResult<UserAccount>> Create(UserAccount user)
    {
        if (string.IsNullOrEmpty(user.Id))
            user.Id = $"usr-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";
        if (string.IsNullOrEmpty(user.CreatedAt))
            user.CreatedAt = DateTime.Now.ToString("yyyy-MM-dd");

        _db.UserAccounts.Add(user);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = user.Id }, user);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, UserAccount user)
    {
        if (id != user.Id) return BadRequest();
        _db.Entry(user).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var user = await _db.UserAccounts.FindAsync(id);
        if (user is null) return NotFound();
        _db.UserAccounts.Remove(user);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
