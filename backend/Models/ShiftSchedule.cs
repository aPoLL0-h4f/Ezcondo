using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EZCondoAPI.Models;

public class ShiftSchedule
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string ShiftName { get; set; } = string.Empty; // Ca 1, Ca 2, Ca 3
    public string? Notes { get; set; }

    public ICollection<ShiftAssignment> StaffAssigned { get; set; } = [];
}

public class ShiftAssignment
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string StaffId { get; set; } = string.Empty;
    public string StaffName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;

    public string ShiftScheduleId { get; set; } = string.Empty;
    [ForeignKey("ShiftScheduleId")]
    public ShiftSchedule? ShiftSchedule { get; set; }
}
