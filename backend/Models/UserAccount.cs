using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EZCondoAPI.Models;

public class UserAccount
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty; // owner, manager, staff, resident, superadmin
    public string? ApartmentCode { get; set; }
    public string? Avatar { get; set; }
    public string CreatedAt { get; set; } = string.Empty;

    public string TenantId { get; set; } = string.Empty;
    [ForeignKey("TenantId")]
    public TenantCondo? Tenant { get; set; }
}
