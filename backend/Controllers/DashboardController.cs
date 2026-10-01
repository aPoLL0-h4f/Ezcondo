using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Data;

namespace EZCondoAPI.Controllers;

/// <summary>
/// Dashboard statistics API - aggregated data for the main dashboard view
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly EZCondoDbContext _db;
    public DashboardController(EZCondoDbContext db) => _db = db;

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats([FromQuery] string? tenantId)
    {
        var totalApartments = await _db.Apartments.CountAsync(a => tenantId == null || a.TenantId == tenantId);
        var occupiedApartments = await _db.Apartments.CountAsync(a => (tenantId == null || a.TenantId == tenantId) && a.Status == "occupied");
        var vacantApartments = await _db.Apartments.CountAsync(a => (tenantId == null || a.TenantId == tenantId) && a.Status == "vacant");
        var maintenanceApartments = await _db.Apartments.CountAsync(a => (tenantId == null || a.TenantId == tenantId) && a.Status == "maintenance");

        var totalResidents = await _db.Residents.CountAsync(r => tenantId == null || r.TenantId == tenantId);
        var activeResidents = await _db.Residents.CountAsync(r => (tenantId == null || r.TenantId == tenantId) && r.Status == "active");

        var totalInvoices = await _db.Invoices.CountAsync();
        var paidInvoices = await _db.Invoices.CountAsync(i => i.Status == "paid");
        var unpaidInvoices = await _db.Invoices.CountAsync(i => i.Status == "unpaid");
        var overdueInvoices = await _db.Invoices.CountAsync(i => i.Status == "overdue");
        var totalRevenue = await _db.Invoices.Where(i => i.Status == "paid").SumAsync(i => i.TotalAmount);
        var totalOutstanding = await _db.Invoices.Where(i => i.Status == "overdue" || i.Status == "unpaid").SumAsync(i => i.TotalAmount);

        var openComplaints = await _db.Complaints.CountAsync(c => c.Status == "new" || c.Status == "in_progress" || c.Status == "waiting_resident");
        var resolvedComplaints = await _db.Complaints.CountAsync(c => c.Status == "resolved" || c.Status == "closed");
        var totalComplaints = await _db.Complaints.CountAsync();

        var totalStaff = await _db.StaffMembers.CountAsync(s => tenantId == null || s.TenantId == tenantId);
        var activeStaff = await _db.StaffMembers.CountAsync(s => (tenantId == null || s.TenantId == tenantId) && s.Status == "active");

        var pendingParcels = await _db.Parcels.CountAsync(p => p.Status == "Chờ nhận tại lễ tân");
        var pendingRequests = await _db.ServiceRequests.CountAsync(r => r.Status == "Chờ duyệt");

        return Ok(new
        {
            apartments = new { total = totalApartments, occupied = occupiedApartments, vacant = vacantApartments, maintenance = maintenanceApartments },
            residents = new { total = totalResidents, active = activeResidents },
            billing = new { totalInvoices, paid = paidInvoices, unpaid = unpaidInvoices, overdue = overdueInvoices, totalRevenue, totalOutstanding },
            complaints = new { total = totalComplaints, open = openComplaints, resolved = resolvedComplaints },
            staff = new { total = totalStaff, active = activeStaff },
            services = new { pendingParcels, pendingRequests }
        });
    }
}
