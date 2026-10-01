using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EZCondoAPI.Models;

public class Apartment
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Block { get; set; } = string.Empty;
    public int Floor { get; set; }
    public double Area { get; set; }
    public string Type { get; set; } = string.Empty; // Studio, 1PN, 2PN, 3PN, Penthouse, Shophouse
    public string Status { get; set; } = "vacant"; // vacant, occupied, maintenance, for_sale
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public string Direction { get; set; } = string.Empty;
    public string Furnished { get; set; } = string.Empty; // Cơ bản, Đầy đủ nội thất, Nhà thô
    public long MonthlyManagementFee { get; set; }
    public string? ContractId { get; set; }
    public string? ContractExpiry { get; set; }
    public List<string> Images { get; set; } = [];

    // Current Resident (embedded)
    public string? CurrentResidentId { get; set; }
    public string? CurrentResidentName { get; set; }
    public string? CurrentResidentPhone { get; set; }
    public string? CurrentResidentEmail { get; set; }
    public bool? CurrentResidentIsOwner { get; set; }

    // Foreign key
    public string? TenantId { get; set; }
    [ForeignKey("TenantId")]
    public TenantCondo? Tenant { get; set; }

    // Navigation
    public ICollection<ResidentHistory> ResidentHistory { get; set; } = [];
    public ICollection<MaintenanceRecord> MaintenanceHistory { get; set; } = [];
}

public class ResidentHistory
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string ResidentName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // Chủ hộ, Khách thuê
    public string StartDate { get; set; } = string.Empty;
    public string? EndDate { get; set; }
    public bool Active { get; set; }

    public string ApartmentId { get; set; } = string.Empty;
    [ForeignKey("ApartmentId")]
    public Apartment? Apartment { get; set; }
}

public class MaintenanceRecord
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Technician { get; set; } = string.Empty;
    public long Cost { get; set; }
    public string Date { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty; // Đã hoàn thành, Đang xử lý
    public string Notes { get; set; } = string.Empty;

    public string ApartmentId { get; set; } = string.Empty;
    [ForeignKey("ApartmentId")]
    public Apartment? Apartment { get; set; }
}
