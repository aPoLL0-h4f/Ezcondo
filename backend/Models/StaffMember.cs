using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EZCondoAPI.Models;

public class StaffMember
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty; // Kỹ thuật, Dịch vụ cư dân, An ninh, Tài chính, Vận hành
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = "active"; // active, on_leave, inactive
    public int CompletedTasks { get; set; }
    public double Rating { get; set; }
    public string? Avatar { get; set; }

    public string? TenantId { get; set; }
    [ForeignKey("TenantId")]
    public TenantCondo? Tenant { get; set; }
}
