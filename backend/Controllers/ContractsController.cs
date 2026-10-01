using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;
using EZCondoAPI.Models;

namespace EZCondoAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ContractsController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public ContractsController(EZCondoDbContext db) => _db = db;

    [HttpGet]
    public async Task<ActionResult<List<Contract>>> GetAll()
    {
        return await _db.Contracts.ToListAsync();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Contract>> GetById(string id)
    {
        var contract = await _db.Contracts.FindAsync(id);
        return contract is null ? NotFound() : Ok(contract);
    }

    [HttpPost]
    public async Task<ActionResult<Contract>> Create(Contract contract)
    {
        if (string.IsNullOrEmpty(contract.Id))
            contract.Id = $"con-{DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()}";

        _db.Contracts.Add(contract);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = contract.Id }, contract);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(string id, Contract contract)
    {
        if (id != contract.Id) return BadRequest();
        _db.Entry(contract).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var contract = await _db.Contracts.FindAsync(id);
        if (contract is null) return NotFound();
        _db.Contracts.Remove(contract);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}
