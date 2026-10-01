using System.ComponentModel.DataAnnotations;

namespace EZCondoAPI.Models;

public class TenantCondo
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public int TotalApartments { get; set; }
    public double OccupancyRate { get; set; }
    public int ActiveResidents { get; set; }
    public string ManagerName { get; set; } = string.Empty;
    public string Status { get; set; } = "active"; // active, trial, suspended
    public string Package { get; set; } = "Standard"; // Standard, Professional, Enterprise
    public long MonthlyFee { get; set; }
    public string CreatedAt { get; set; } = string.Empty;

    // Navigation
    public ICollection<Apartment> Apartments { get; set; } = [];
    public ICollection<Resident> Residents { get; set; } = [];
    public ICollection<StaffMember> Staff { get; set; } = [];
    public ICollection<UserAccount> Users { get; set; } = [];
}
