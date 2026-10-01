using Microsoft.EntityFrameworkCore;
using EZCondoAPI.Models;

namespace EZCondoAPI.Data;

public class EZCondoDbContext : DbContext
{
    public EZCondoDbContext(DbContextOptions<EZCondoDbContext> options) : base(options) { }

    public DbSet<TenantCondo> Tenants { get; set; }
    public DbSet<Apartment> Apartments { get; set; }
    public DbSet<ResidentHistory> ResidentHistories { get; set; }
    public DbSet<MaintenanceRecord> MaintenanceRecords { get; set; }
    public DbSet<Resident> Residents { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<Contract> Contracts { get; set; }
    public DbSet<Invoice> Invoices { get; set; }
    public DbSet<InvoiceItem> InvoiceItems { get; set; }
    public DbSet<Complaint> Complaints { get; set; }
    public DbSet<ComplaintMessage> ComplaintMessages { get; set; }
    public DbSet<StaffMember> StaffMembers { get; set; }
    public DbSet<ShiftSchedule> ShiftSchedules { get; set; }
    public DbSet<ShiftAssignment> ShiftAssignments { get; set; }
    public DbSet<FacilityBooking> FacilityBookings { get; set; }
    public DbSet<ServiceRequest> ServiceRequests { get; set; }
    public DbSet<ParcelItem> Parcels { get; set; }
    public DbSet<UserAccount> UserAccounts { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure cascade delete
        modelBuilder.Entity<Apartment>()
            .HasMany(a => a.ResidentHistory)
            .WithOne(r => r.Apartment)
            .HasForeignKey(r => r.ApartmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Apartment>()
            .HasMany(a => a.MaintenanceHistory)
            .WithOne(m => m.Apartment)
            .HasForeignKey(m => m.ApartmentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Resident>()
            .HasMany(r => r.Vehicles)
            .WithOne(v => v.Resident)
            .HasForeignKey(v => v.ResidentId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Invoice>()
            .HasMany(i => i.Items)
            .WithOne(it => it.Invoice)
            .HasForeignKey(it => it.InvoiceId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Complaint>()
            .HasMany(c => c.Messages)
            .WithOne(m => m.Complaint)
            .HasForeignKey(m => m.ComplaintId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<ShiftSchedule>()
            .HasMany(s => s.StaffAssigned)
            .WithOne(a => a.ShiftSchedule)
            .HasForeignKey(a => a.ShiftScheduleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
