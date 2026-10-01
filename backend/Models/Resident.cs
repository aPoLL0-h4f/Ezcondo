using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EZCondoAPI.Models;

public class Resident
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ApartmentCode { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string IdCard { get; set; } = string.Empty;
    public string Status { get; set; } = "active"; // active, pending_activation, suspended
    public string Role { get; set; } = string.Empty; // Chủ hộ, Thành viên, Khách thuê
    public string MoveInDate { get; set; } = string.Empty;
    public string? InternalNotes { get; set; }

    public string? TenantId { get; set; }
    [ForeignKey("TenantId")]
    public TenantCondo? Tenant { get; set; }

    public ICollection<Vehicle> Vehicles { get; set; } = [];
}

public class Vehicle
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Xe máy, Ô tô, Xe đạp điện
    public string Plate { get; set; } = string.Empty;

    public string ResidentId { get; set; } = string.Empty;
    [ForeignKey("ResidentId")]
    public Resident? Resident { get; set; }
}
