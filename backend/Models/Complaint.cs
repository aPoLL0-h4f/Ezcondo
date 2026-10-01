using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EZCondoAPI.Models;

public class Complaint
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string TicketCode { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string ApartmentCode { get; set; } = string.Empty;
    public string ResidentName { get; set; } = string.Empty;
    public string ResidentPhone { get; set; } = string.Empty;
    public string Priority { get; set; } = "medium"; // urgent, high, medium, low
    public string Status { get; set; } = "new"; // new, in_progress, waiting_resident, resolved, closed
    public string CreatedAt { get; set; } = string.Empty;
    public string UpdatedAt { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? AssignedTo { get; set; }
    public string? Deadline { get; set; }
    public List<string> Images { get; set; } = [];

    // AI Analysis (embedded JSON)
    public string? AiDiagnosis { get; set; }
    public string? AiSuggestedResponse { get; set; }
    public List<string>? AiActionSteps { get; set; }
    public string? AiEstimatedCost { get; set; }
    public string? AiTargetTime { get; set; }

    public ICollection<ComplaintMessage> Messages { get; set; } = [];
}

public class ComplaintMessage
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string SenderName { get; set; } = string.Empty;
    public string SenderRole { get; set; } = string.Empty; // Cư dân, Nhân viên kỹ thuật, Ban Quản lý, AI Assistant
    public string Content { get; set; } = string.Empty;
    public string Timestamp { get; set; } = string.Empty;
    public bool IsAI { get; set; }

    public string ComplaintId { get; set; } = string.Empty;
    [ForeignKey("ComplaintId")]
    public Complaint? Complaint { get; set; }
}
