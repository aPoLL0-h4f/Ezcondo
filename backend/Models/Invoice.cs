using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EZCondoAPI.Models;

public class Invoice
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string InvoiceCode { get; set; } = string.Empty;
    public string ApartmentCode { get; set; } = string.Empty;
    public string ResidentName { get; set; } = string.Empty;
    public string Month { get; set; } = string.Empty; // "10/2026"
    public string IssueDate { get; set; } = string.Empty;
    public string DueDate { get; set; } = string.Empty;
    public string? PaidDate { get; set; }
    public long TotalAmount { get; set; }
    public string Status { get; set; } = "unpaid"; // paid, unpaid, overdue
    public string? PaymentMethod { get; set; }
    public string? TransactionId { get; set; }

    public ICollection<InvoiceItem> Items { get; set; } = [];
}

public class InvoiceItem
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public double Quantity { get; set; }
    public string Unit { get; set; } = string.Empty;
    public long UnitPrice { get; set; }
    public long Amount { get; set; }

    public string InvoiceId { get; set; } = string.Empty;
    [ForeignKey("InvoiceId")]
    public Invoice? Invoice { get; set; }
}
