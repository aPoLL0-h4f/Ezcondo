using System.ComponentModel.DataAnnotations;

namespace EZCondoAPI.Models;

public class ParcelItem
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string TrackingCode { get; set; } = string.Empty;
    public string ApartmentCode { get; set; } = string.Empty;
    public string RecipientName { get; set; } = string.Empty;
    public string Courier { get; set; } = string.Empty;
    public string ArrivedAt { get; set; } = string.Empty;
    public string Status { get; set; } = "Chờ nhận tại lễ tân"; // Chờ nhận tại lễ tân, Đã nhận
    public string? ReceivedAt { get; set; }
    public string? LockerNumber { get; set; }
}
