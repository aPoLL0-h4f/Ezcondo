using System.ComponentModel.DataAnnotations;

namespace EZCondoAPI.Models;

public class Contract
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string ContractNumber { get; set; } = string.Empty;
    public string ApartmentCode { get; set; } = string.Empty;
    public string ResidentName { get; set; } = string.Empty;
    public string ResidentPhone { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // Hợp đồng thuê, Hợp đồng mua bán / Sở hữu
    public string StartDate { get; set; } = string.Empty;
    public string EndDate { get; set; } = string.Empty;
    public long? MonthlyRent { get; set; }
    public long? Deposit { get; set; }
    public string Status { get; set; } = "active"; // active, expiring_soon, expired, terminated
    public string? FileUrl { get; set; }
}
