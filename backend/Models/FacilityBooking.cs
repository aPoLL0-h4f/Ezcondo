using System.ComponentModel.DataAnnotations;

namespace EZCondoAPI.Models;

public class FacilityBooking
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string FacilityName { get; set; } = string.Empty;
    public string ApartmentCode { get; set; } = string.Empty;
    public string ResidentName { get; set; } = string.Empty;
    public string BookingDate { get; set; } = string.Empty;
    public string TimeSlot { get; set; } = string.Empty;
    public int GuestCount { get; set; }
    public string Status { get; set; } = string.Empty; // Đã xác nhận, Chờ duyệt, Đã hủy
}
