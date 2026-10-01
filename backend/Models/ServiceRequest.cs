using System.ComponentModel.DataAnnotations;

namespace EZCondoAPI.Models;

public class ServiceRequest
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string RequestCode { get; set; } = string.Empty;
    public string ApartmentCode { get; set; } = string.Empty;
    public string ResidentName { get; set; } = string.Empty;
    public string ResidentPhone { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string StartDate { get; set; } = string.Empty;
    public string? EndDate { get; set; }
    public string Status { get; set; } = "Chờ duyệt"; // Chờ duyệt, Đã phê duyệt, Từ chối, Đã hoàn tất
    public string Details { get; set; } = string.Empty;
    public string CreatedAt { get; set; } = string.Empty;
}
