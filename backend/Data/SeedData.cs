using EZCondoAPI.Models;

namespace EZCondoAPI.Data;

public static class SeedData
{
    public static async Task Initialize(EZCondoDbContext db)
    {
        if (db.Tenants.Any()) return; // Already seeded

        // === TENANTS ===
        var tenants = new List<TenantCondo>
        {
            new() { Id = "tenant-1", Name = "Masteri Thảo Điền", Code = "MTD", Address = "159 Xa Lộ Hà Nội, P. Thảo Điền, TP. Thủ Đức, TP. Hồ Chí Minh", TotalApartments = 450, OccupancyRate = 94.2, ActiveResidents = 1320, ManagerName = "Nguyễn Hoàng Long", Status = "active", Package = "Enterprise", MonthlyFee = 15000000, CreatedAt = "2024-03-15" },
            new() { Id = "tenant-2", Name = "Vinhomes Central Park - Park 6", Code = "VCP-P6", Address = "208 Nguyễn Hữu Cảnh, Phường 22, Q. Bình Thạnh, TP. Hồ Chí Minh", TotalApartments = 520, OccupancyRate = 97.5, ActiveResidents = 1680, ManagerName = "Trần Thị Mai Phương", Status = "active", Package = "Enterprise", MonthlyFee = 18000000, CreatedAt = "2024-01-10" },
            new() { Id = "tenant-3", Name = "The Sun Avenue - Tháp 4", Code = "TSA-T4", Address = "28 Mai Chí Thọ, P. An Phú, TP. Thủ Đức, TP. Hồ Chí Minh", TotalApartments = 380, OccupancyRate = 89.4, ActiveResidents = 990, ManagerName = "Lê Văn Cường", Status = "active", Package = "Professional", MonthlyFee = 11000000, CreatedAt = "2024-06-20" },
            new() { Id = "tenant-4", Name = "Landmark Plus Residence", Code = "LMP", Address = "720A Điện Biên Phủ, Phường 22, Q. Bình Thạnh, TP. Hồ Chí Minh", TotalApartments = 310, OccupancyRate = 91.8, ActiveResidents = 850, ManagerName = "Phạm Minh Trí", Status = "active", Package = "Professional", MonthlyFee = 11000000, CreatedAt = "2024-08-01" },
            new() { Id = "tenant-5", Name = "Sky Center Saigon", Code = "SCS", Address = "10 Phổ Quang, Phường 2, Q. Tân Bình, TP. Hồ Chí Minh", TotalApartments = 280, OccupancyRate = 88.0, ActiveResidents = 720, ManagerName = "Võ Thị Bích Ngọc", Status = "trial", Package = "Standard", MonthlyFee = 6500000, CreatedAt = "2026-09-01" },
        };
        db.Tenants.AddRange(tenants);

        // === APARTMENTS ===
        var apartments = new List<Apartment>
        {
            new() { Id = "apt-101", Code = "A-1204", Block = "Tháp A", Floor = 12, Area = 78.5, Type = "2PN", Status = "occupied", Bedrooms = 2, Bathrooms = 2, Direction = "Đông Nam", Furnished = "Đầy đủ nội thất", MonthlyManagementFee = 1250000, ContractId = "HD-2024-088", ContractExpiry = "2027-12-31", CurrentResidentId = "res-01", CurrentResidentName = "Nguyễn Văn Minh", CurrentResidentPhone = "0908 123 456", CurrentResidentEmail = "minh.nguyen@example.com", CurrentResidentIsOwner = true, TenantId = "tenant-1", Images = ["https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80"] },
            new() { Id = "apt-102", Code = "A-1205", Block = "Tháp A", Floor = 12, Area = 54.0, Type = "1PN", Status = "vacant", Bedrooms = 1, Bathrooms = 1, Direction = "Tây Bắc", Furnished = "Cơ bản", MonthlyManagementFee = 850000, TenantId = "tenant-1", Images = ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80"] },
            new() { Id = "apt-103", Code = "B-0802", Block = "Tháp B", Floor = 8, Area = 92.0, Type = "3PN", Status = "occupied", Bedrooms = 3, Bathrooms = 2, Direction = "Đông Bắc", Furnished = "Đầy đủ nội thất", MonthlyManagementFee = 1480000, ContractId = "HD-2025-112", ContractExpiry = "2026-11-15", CurrentResidentId = "res-02", CurrentResidentName = "Trần Thị Thu Hà", CurrentResidentPhone = "0983 456 789", CurrentResidentEmail = "thuha.tran@example.com", CurrentResidentIsOwner = false, TenantId = "tenant-1", Images = ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"] },
            new() { Id = "apt-104", Code = "B-0803", Block = "Tháp B", Floor = 8, Area = 72.0, Type = "2PN", Status = "maintenance", Bedrooms = 2, Bathrooms = 2, Direction = "Tây Nam", Furnished = "Cơ bản", MonthlyManagementFee = 1150000, ContractId = "HD-2024-045", ContractExpiry = "2029-05-20", CurrentResidentId = "res-03", CurrentResidentName = "Lê Hoàng Phong", CurrentResidentPhone = "0977 334 556", CurrentResidentEmail = "phong.le@example.com", CurrentResidentIsOwner = true, TenantId = "tenant-1", Images = ["https://images.unsplash.com/photo-1502005229762-ee1b2da973e6?auto=format&fit=crop&w=800&q=80"] },
            new() { Id = "apt-105", Code = "C-2101", Block = "Tháp C", Floor = 21, Area = 145.0, Type = "Penthouse", Status = "occupied", Bedrooms = 4, Bathrooms = 4, Direction = "Đông Nam", Furnished = "Đầy đủ nội thất", MonthlyManagementFee = 2600000, ContractId = "HD-2023-012", ContractExpiry = "2030-01-01", CurrentResidentId = "res-04", CurrentResidentName = "Hoàng Kim Sang", CurrentResidentPhone = "0903 999 111", CurrentResidentEmail = "sang.hoang@investcorp.vn", CurrentResidentIsOwner = true, TenantId = "tenant-1", Images = ["https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"] },
            new() { Id = "apt-106", Code = "SH-01", Block = "Khối đế Shophouse", Floor = 1, Area = 110.0, Type = "Shophouse", Status = "for_sale", Bedrooms = 1, Bathrooms = 2, Direction = "Mặt tiền Đại lộ", Furnished = "Nhà thô", MonthlyManagementFee = 2200000, TenantId = "tenant-1", Images = ["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80"] },
            new() { Id = "apt-107", Code = "A-0504", Block = "Tháp A", Floor = 5, Area = 68.0, Type = "2PN", Status = "occupied", Bedrooms = 2, Bathrooms = 1, Direction = "Đông", Furnished = "Đầy đủ nội thất", MonthlyManagementFee = 1100000, ContractId = "HD-2026-019", ContractExpiry = "2027-02-28", CurrentResidentId = "res-05", CurrentResidentName = "Phạm Thu Thủy", CurrentResidentPhone = "0938 777 222", CurrentResidentEmail = "thuthuy.pham@gmail.com", CurrentResidentIsOwner = false, TenantId = "tenant-1", Images = ["https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80"] },
            new() { Id = "apt-108", Code = "B-1502", Block = "Tháp B", Floor = 15, Area = 42.0, Type = "Studio", Status = "vacant", Bedrooms = 1, Bathrooms = 1, Direction = "Nam", Furnished = "Đầy đủ nội thất", MonthlyManagementFee = 700000, TenantId = "tenant-1", Images = ["https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80"] },
        };
        db.Apartments.AddRange(apartments);

        // === RESIDENT HISTORY ===
        db.ResidentHistories.AddRange(
            new ResidentHistory { Id = "rh-1", ResidentName = "Nguyễn Văn Minh", Phone = "0908 123 456", Role = "Chủ hộ", StartDate = "2024-01-15", Active = true, ApartmentId = "apt-101" },
            new ResidentHistory { Id = "rh-2", ResidentName = "Đặng Tuấn Anh", Phone = "0912 888 999", Role = "Khách thuê", StartDate = "2025-02-01", EndDate = "2026-08-31", Active = false, ApartmentId = "apt-102" },
            new ResidentHistory { Id = "rh-3", ResidentName = "Trần Thị Thu Hà", Phone = "0983 456 789", Role = "Khách thuê", StartDate = "2025-11-15", Active = true, ApartmentId = "apt-103" }
        );

        // === MAINTENANCE RECORDS ===
        db.MaintenanceRecords.AddRange(
            new MaintenanceRecord { Id = "mt-1", Title = "Bảo dưỡng điều hòa multi Daikin định kỳ", Technician = "KTV Phạm Văn Tuấn", Cost = 450000, Date = "2026-07-12", Status = "Đã hoàn thành", Notes = "Vệ sinh lưới lọc, bổ sung ga R32, hệ thống lạnh sâu ổn định.", ApartmentId = "apt-101" },
            new MaintenanceRecord { Id = "mt-2", Title = "Thay gioăng cao su vòi sen phòng tắm master", Technician = "KTV Lê Văn Hùng", Cost = 150000, Date = "2026-04-18", Status = "Đã hoàn thành", Notes = "Đã kiểm tra không còn hiện tượng rò rỉ áp lực nước.", ApartmentId = "apt-101" },
            new MaintenanceRecord { Id = "mt-3", Title = "Sơn dặm lại tường phòng khách sau khi khách thuê trả căn", Technician = "Đội thi công hoàn thiện", Cost = 1200000, Date = "2026-09-05", Status = "Đã hoàn thành", Notes = "Sơn nước Dulux màu trắng sứ, kiểm tra hệ thống đèn LED tốt.", ApartmentId = "apt-102" },
            new MaintenanceRecord { Id = "mt-4", Title = "Sửa chữa chống thấm hộp gen khu vực vệ sinh ban công", Technician = "KTV Vũ Quốc Bảo", Cost = 2800000, Date = "2026-09-28", Status = "Đang xử lý", Notes = "Đang lột gạch sàn xử lý sika chống thấm 3 lớp, dự kiến nghiệm thu ngày 03/10.", ApartmentId = "apt-104" }
        );

        // === RESIDENTS ===
        var residents = new List<Resident>
        {
            new() { Id = "res-01", Name = "Nguyễn Văn Minh", ApartmentCode = "A-1204", Phone = "0908 123 456", Email = "minh.nguyen@example.com", IdCard = "079088001234", Status = "active", Role = "Chủ hộ", MoveInDate = "2024-01-15", InternalNotes = "Cư dân thân thiện, luôn thanh toán phí quản lý đúng hạn trước ngày 5.", TenantId = "tenant-1" },
            new() { Id = "res-02", Name = "Trần Thị Thu Hà", ApartmentCode = "B-0802", Phone = "0983 456 789", Email = "thuha.tran@example.com", IdCard = "001192004812", Status = "active", Role = "Khách thuê", MoveInDate = "2025-11-15", InternalNotes = "Hợp đồng thuê 1 năm, sắp đến hạn gia hạn vào tháng 11.", TenantId = "tenant-1" },
            new() { Id = "res-03", Name = "Lê Hoàng Phong", ApartmentCode = "B-0803", Phone = "0977 334 556", Email = "phong.le@example.com", IdCard = "038090009821", Status = "active", Role = "Chủ hộ", MoveInDate = "2024-05-20", InternalNotes = "Đang theo dõi tiến độ sửa chữa chống thấm ban công.", TenantId = "tenant-1" },
            new() { Id = "res-04", Name = "Hoàng Kim Sang", ApartmentCode = "C-2101", Phone = "0903 999 111", Email = "sang.hoang@investcorp.vn", IdCard = "079075003344", Status = "active", Role = "Chủ hộ", MoveInDate = "2023-01-01", InternalNotes = "Thành viên Ban đại diện cư dân (Trưởng ban công tác kiểm toán).", TenantId = "tenant-1" },
            new() { Id = "res-05", Name = "Phạm Thu Thủy", ApartmentCode = "A-0504", Phone = "0938 777 222", Email = "thuthuy.pham@gmail.com", IdCard = "031195007712", Status = "active", Role = "Khách thuê", MoveInDate = "2026-03-01", InternalNotes = "Gia đình có 1 con nhỏ, đã đăng ký thẻ bơi cư dân.", TenantId = "tenant-1" },
            new() { Id = "res-06", Name = "Vũ Đức Thịnh", ApartmentCode = "A-1502", Phone = "0919 666 555", Email = "thinh.vu@techhub.io", IdCard = "001091008822", Status = "pending_activation", Role = "Khách thuê", MoveInDate = "2026-10-05", InternalNotes = "Mới nộp hồ sơ đăng ký tạm trú, chờ đối soát giấy tờ để cấp quyền mở cổng.", TenantId = "tenant-1" },
        };
        db.Residents.AddRange(residents);

        // === VEHICLES ===
        db.Vehicles.AddRange(
            new Vehicle { Id = "v-1", Type = "Ô tô", Plate = "51K-892.34", ResidentId = "res-01" },
            new Vehicle { Id = "v-2", Type = "Xe máy", Plate = "59P1-482.19", ResidentId = "res-01" },
            new Vehicle { Id = "v-3", Type = "Xe máy", Plate = "29B2-311.90", ResidentId = "res-02" },
            new Vehicle { Id = "v-4", Type = "Ô tô", Plate = "51H-778.12", ResidentId = "res-03" },
            new Vehicle { Id = "v-5", Type = "Ô tô", Plate = "51F-999.99", ResidentId = "res-04" },
            new Vehicle { Id = "v-6", Type = "Ô tô", Plate = "51K-555.68", ResidentId = "res-04" },
            new Vehicle { Id = "v-7", Type = "Xe máy", Plate = "59S3-812.33", ResidentId = "res-05" },
            new Vehicle { Id = "v-8", Type = "Xe máy", Plate = "59E1-998.11", ResidentId = "res-06" }
        );

        // === CONTRACTS ===
        db.Contracts.AddRange(
            new Contract { Id = "con-1", ContractNumber = "HD-2024-088", ApartmentCode = "A-1204", ResidentName = "Nguyễn Văn Minh", ResidentPhone = "0908 123 456", Type = "Hợp đồng mua bán / Sở hữu", StartDate = "2024-01-15", EndDate = "2027-12-31", Status = "active" },
            new Contract { Id = "con-2", ContractNumber = "HD-2025-112", ApartmentCode = "B-0802", ResidentName = "Trần Thị Thu Hà", ResidentPhone = "0983 456 789", Type = "Hợp đồng thuê", StartDate = "2025-11-15", EndDate = "2026-11-15", MonthlyRent = 16500000, Deposit = 33000000, Status = "expiring_soon" },
            new Contract { Id = "con-3", ContractNumber = "HD-2024-045", ApartmentCode = "B-0803", ResidentName = "Lê Hoàng Phong", ResidentPhone = "0977 334 556", Type = "Hợp đồng mua bán / Sở hữu", StartDate = "2024-05-20", EndDate = "2029-05-20", Status = "active" },
            new Contract { Id = "con-4", ContractNumber = "HD-2026-019", ApartmentCode = "A-0504", ResidentName = "Phạm Thu Thủy", ResidentPhone = "0938 777 222", Type = "Hợp đồng thuê", StartDate = "2026-03-01", EndDate = "2027-02-28", MonthlyRent = 14000000, Deposit = 28000000, Status = "active" },
            new Contract { Id = "con-5", ContractNumber = "HD-2025-072", ApartmentCode = "A-1205", ResidentName = "Đặng Tuấn Anh", ResidentPhone = "0912 888 999", Type = "Hợp đồng thuê", StartDate = "2025-02-01", EndDate = "2026-08-31", MonthlyRent = 12000000, Deposit = 24000000, Status = "expired" }
        );

        // === INVOICES ===
        var inv1 = new Invoice { Id = "inv-101", InvoiceCode = "HD-202610-1204", ApartmentCode = "A-1204", ResidentName = "Nguyễn Văn Minh", Month = "10/2026", IssueDate = "2026-10-01", DueDate = "2026-10-10", Status = "unpaid", TotalAmount = 2885000 };
        var inv2 = new Invoice { Id = "inv-102", InvoiceCode = "HD-202609-1204", ApartmentCode = "A-1204", ResidentName = "Nguyễn Văn Minh", Month = "09/2026", IssueDate = "2026-09-01", DueDate = "2026-09-10", PaidDate = "2026-09-04", Status = "paid", PaymentMethod = "VietQR / Chuyển khoản Techcombank", TransactionId = "FT262489128391", TotalAmount = 2848000 };
        var inv3 = new Invoice { Id = "inv-103", InvoiceCode = "HD-202609-0802", ApartmentCode = "B-0802", ResidentName = "Trần Thị Thu Hà", Month = "09/2026", IssueDate = "2026-09-01", DueDate = "2026-09-10", PaidDate = "2026-09-08", Status = "paid", PaymentMethod = "Thẻ ATM Napas", TransactionId = "NP998231002", TotalAmount = 1777000 };
        var inv4 = new Invoice { Id = "inv-104", InvoiceCode = "HD-202608-0803", ApartmentCode = "B-0803", ResidentName = "Lê Hoàng Phong", Month = "08/2026", IssueDate = "2026-08-01", DueDate = "2026-08-10", Status = "overdue", TotalAmount = 2698000 };
        var inv5 = new Invoice { Id = "inv-105", InvoiceCode = "HD-202609-0803", ApartmentCode = "B-0803", ResidentName = "Lê Hoàng Phong", Month = "09/2026", IssueDate = "2026-09-01", DueDate = "2026-09-10", Status = "overdue", TotalAmount = 2679500 };
        var inv6 = new Invoice { Id = "inv-106", InvoiceCode = "HD-202610-2101", ApartmentCode = "C-2101", ResidentName = "Hoàng Kim Sang", Month = "10/2026", IssueDate = "2026-10-01", DueDate = "2026-10-10", PaidDate = "2026-10-01", Status = "paid", PaymentMethod = "VietQR / MB Bank", TransactionId = "MBB202610010891", TotalAmount = 5628000 };
        db.Invoices.AddRange(inv1, inv2, inv3, inv4, inv5, inv6);

        // === INVOICE ITEMS ===
        db.InvoiceItems.AddRange(
            new InvoiceItem { Id = "ii-1", Description = "Phí quản lý vận hành (78.5 m² x 16.000 đ)", Quantity = 78.5, Unit = "m²", UnitPrice = 16000, Amount = 1256000, InvoiceId = "inv-101" },
            new InvoiceItem { Id = "ii-2", Description = "Phí gửi xe ô tô (51K-892.34)", Quantity = 1, Unit = "xe", UnitPrice = 1250000, Amount = 1250000, InvoiceId = "inv-101" },
            new InvoiceItem { Id = "ii-3", Description = "Phí gửi xe máy (59P1-482.19)", Quantity = 1, Unit = "xe", UnitPrice = 120000, Amount = 120000, InvoiceId = "inv-101" },
            new InvoiceItem { Id = "ii-4", Description = "Tiền nước sinh hoạt tháng 09 (14 m³)", Quantity = 14, Unit = "m³", UnitPrice = 18500, Amount = 259000, InvoiceId = "inv-101" },
            new InvoiceItem { Id = "ii-5", Description = "Phí quản lý vận hành", Quantity = 78.5, Unit = "m²", UnitPrice = 16000, Amount = 1256000, InvoiceId = "inv-102" },
            new InvoiceItem { Id = "ii-6", Description = "Phí giữ xe 1 ô tô + 1 xe máy", Quantity = 1, Unit = "gói", UnitPrice = 1370000, Amount = 1370000, InvoiceId = "inv-102" },
            new InvoiceItem { Id = "ii-7", Description = "Tiền nước sinh hoạt tháng 08", Quantity = 12, Unit = "m³", UnitPrice = 18500, Amount = 222000, InvoiceId = "inv-102" },
            new InvoiceItem { Id = "ii-8", Description = "Phí quản lý căn hộ 92 m²", Quantity = 92, Unit = "m²", UnitPrice = 16000, Amount = 1472000, InvoiceId = "inv-103" },
            new InvoiceItem { Id = "ii-9", Description = "Phí giữ xe máy", Quantity = 1, Unit = "xe", UnitPrice = 120000, Amount = 120000, InvoiceId = "inv-103" },
            new InvoiceItem { Id = "ii-10", Description = "Tiền nước sinh hoạt", Quantity = 10, Unit = "m³", UnitPrice = 18500, Amount = 185000, InvoiceId = "inv-103" },
            new InvoiceItem { Id = "ii-11", Description = "Phí quản lý tòa nhà tháng 08", Quantity = 72, Unit = "m²", UnitPrice = 16000, Amount = 1152000, InvoiceId = "inv-104" },
            new InvoiceItem { Id = "ii-12", Description = "Phí gửi xe ô tô", Quantity = 1, Unit = "xe", UnitPrice = 1250000, Amount = 1250000, InvoiceId = "inv-104" },
            new InvoiceItem { Id = "ii-13", Description = "Tiền nước sinh hoạt", Quantity = 16, Unit = "m³", UnitPrice = 18500, Amount = 296000, InvoiceId = "inv-104" },
            new InvoiceItem { Id = "ii-14", Description = "Phí quản lý tòa nhà tháng 09", Quantity = 72, Unit = "m²", UnitPrice = 16000, Amount = 1152000, InvoiceId = "inv-105" },
            new InvoiceItem { Id = "ii-15", Description = "Phí gửi xe ô tô", Quantity = 1, Unit = "xe", UnitPrice = 1250000, Amount = 1250000, InvoiceId = "inv-105" },
            new InvoiceItem { Id = "ii-16", Description = "Tiền nước sinh hoạt", Quantity = 15, Unit = "m³", UnitPrice = 18500, Amount = 277500, InvoiceId = "inv-105" },
            new InvoiceItem { Id = "ii-17", Description = "Phí quản lý Penthouse 145 m²", Quantity = 145, Unit = "m²", UnitPrice = 18000, Amount = 2610000, InvoiceId = "inv-106" },
            new InvoiceItem { Id = "ii-18", Description = "Phí gửi 2 xe ô tô định danh", Quantity = 2, Unit = "xe", UnitPrice = 1250000, Amount = 2500000, InvoiceId = "inv-106" },
            new InvoiceItem { Id = "ii-19", Description = "Tiền nước sinh hoạt", Quantity = 28, Unit = "m³", UnitPrice = 18500, Amount = 518000, InvoiceId = "inv-106" }
        );

        // === COMPLAINTS ===
        var cmp1 = new Complaint { Id = "cmp-01", TicketCode = "KN-2026-1042", Title = "Áp lực nước yếu vào khung giờ cao điểm 18:00 - 20:00", Category = "Kỹ thuật - Nước", ApartmentCode = "A-1204", ResidentName = "Nguyễn Văn Minh", ResidentPhone = "0908 123 456", Priority = "high", Status = "in_progress", CreatedAt = "2026-09-30 19:40", UpdatedAt = "2026-10-01 08:15", Description = "Nước chảy rất yếu vào giờ tắm buổi tối, vòi sen và bồn rửa tầng 12 không đủ áp lực để máy nước nóng hoạt động.", AssignedTo = "KTV Phạm Văn Tuấn", Deadline = "2026-10-01 11:30", Images = ["https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80"], AiDiagnosis = "Nghi ngờ van giảm áp (PRV) trục đứng Block A tại tầng 12 bị kẹt cặn bẩn.", AiSuggestedResponse = "Kính gửi cư dân Nguyễn Văn Minh, BQL đã phân công KTV Tuấn kiểm tra van giảm áp tầng 12.", AiActionSteps = ["Đo áp kế đầu vào/đầu ra cụm van PRV tầng 12", "Vệ sinh lưới lọc Y-Strainer trục cấp nước tháp A", "Kiểm tra rò rỉ ngầm và tái cân chỉnh áp suất"], AiEstimatedCost = "Miễn phí bảo dưỡng định kỳ", AiTargetTime = "Xử lý hoàn tất trong 2 giờ" };
        var cmp2 = new Complaint { Id = "cmp-02", TicketCode = "KN-2026-1039", Title = "Tiếng ồn thi công khoan tường ngoài giờ quy định", Category = "An ninh - Trật tự", ApartmentCode = "B-0802", ResidentName = "Trần Thị Thu Hà", ResidentPhone = "0983 456 789", Priority = "medium", Status = "new", CreatedAt = "2026-10-01 07:15", UpdatedAt = "2026-10-01 07:15", Description = "Căn hộ tầng 9 có tiếng búa và khoan đục tường từ lúc 6h45 sáng.", AssignedTo = "Đội An ninh Ca 1", Deadline = "2026-10-01 08:00", Images = [] };
        var cmp3 = new Complaint { Id = "cmp-03", TicketCode = "KN-2026-1031", Title = "Thang máy P1 Tháp B có tiếng kêu rít khi dừng tầng 14", Category = "Thang máy", ApartmentCode = "B-1405", ResidentName = "Hoàng Quốc Việt", ResidentPhone = "0918 223 344", Priority = "urgent", Status = "waiting_resident", CreatedAt = "2026-09-29 14:10", UpdatedAt = "2026-09-30 16:30", Description = "Thang P1 mỗi khi phanh dừng tầng 14 bị rung nhẹ và có tiếng cọ xát cơ khí khá to.", AssignedTo = "Kỹ sư Schindler / Nguyễn Tiến Dũng", Deadline = "2026-09-30 18:00", Images = [] };
        var cmp4 = new Complaint { Id = "cmp-04", TicketCode = "KN-2026-1025", Title = "Đèn chiếu sáng hành lang tầng 5 bị nhấp nháy", Category = "Kỹ thuật - Điện", ApartmentCode = "A-0504", ResidentName = "Phạm Thu Thủy", ResidentPhone = "0938 777 222", Priority = "low", Status = "resolved", CreatedAt = "2026-09-27 10:00", UpdatedAt = "2026-09-27 11:45", Description = "Bóng đèn LED gần cửa thang thoát hiểm số 2 nhấp nháy liên tục vào ban đêm.", AssignedTo = "KTV Lê Văn Hùng", Deadline = "2026-09-27 12:00", Images = [] };
        var cmp5 = new Complaint { Id = "cmp-05", TicketCode = "KN-2026-1011", Title = "Khói thuốc lá bay vào ban công từ căn bên cạnh", Category = "Vệ sinh môi trường", ApartmentCode = "C-2101", ResidentName = "Hoàng Kim Sang", ResidentPhone = "0903 999 111", Priority = "medium", Status = "closed", CreatedAt = "2026-09-20 21:00", UpdatedAt = "2026-09-22 09:00", Description = "Ban công căn bên hút thuốc lá mùi rất nồng bay sang phòng trẻ nhỏ.", AssignedTo = "Trưởng BQL / Nguyễn Hoàng Long", Deadline = "2026-09-21 17:00", Images = [] };
        db.Complaints.AddRange(cmp1, cmp2, cmp3, cmp4, cmp5);

        // === COMPLAINT MESSAGES ===
        db.ComplaintMessages.AddRange(
            new ComplaintMessage { Id = "msg-1", SenderName = "Nguyễn Văn Minh", SenderRole = "Cư dân", Content = "Chào BQL, nước yếu 2 hôm nay rồi, nhà có trẻ nhỏ rất bất tiện.", Timestamp = "2026-09-30 19:42", ComplaintId = "cmp-01" },
            new ComplaintMessage { Id = "msg-2", SenderName = "Lễ tân Tòa nhà", SenderRole = "Ban Quản lý", Content = "Dạ chào anh Minh, BQL đã ghi nhận thông tin.", Timestamp = "2026-09-30 20:05", ComplaintId = "cmp-01" },
            new ComplaintMessage { Id = "msg-3", SenderName = "KTV Phạm Văn Tuấn", SenderRole = "Nhân viên kỹ thuật", Content = "Chào anh Minh, 09:30 sáng nay tôi sẽ lên đo áp lực van đồng hồ.", Timestamp = "2026-10-01 08:15", ComplaintId = "cmp-01" },
            new ComplaintMessage { Id = "msg-4", SenderName = "Trần Thị Thu Hà", SenderRole = "Cư dân", Content = "Nhà có người ốm nghỉ ngơi mà khoan ầm ĩ từ sáng sớm.", Timestamp = "2026-10-01 07:15", ComplaintId = "cmp-02" },
            new ComplaintMessage { Id = "msg-5", SenderName = "Kỹ sư Schindler / Nguyễn Tiến Dũng", SenderRole = "Nhân viên kỹ thuật", Content = "Đã cùng hãng Schindler bôi trơn ray dẫn hướng và thay guốc trượt cáp đối trọng.", Timestamp = "2026-09-30 16:30", ComplaintId = "cmp-03" },
            new ComplaintMessage { Id = "msg-6", SenderName = "KTV Lê Văn Hùng", SenderRole = "Nhân viên kỹ thuật", Content = "Đã thay thế bóng LED Rạng Đông 18W mới và kiểm tra nguồn driver.", Timestamp = "2026-09-27 11:45", ComplaintId = "cmp-04" },
            new ComplaintMessage { Id = "msg-7", SenderName = "Trưởng BQL / Nguyễn Hoàng Long", SenderRole = "Ban Quản lý", Content = "BQL đã gửi thư ngỏ nhắc nhở toàn thể cư dân tầng 21 về văn minh ban công.", Timestamp = "2026-09-22 09:00", ComplaintId = "cmp-05" }
        );

        // === STAFF ===
        db.StaffMembers.AddRange(
            new StaffMember { Id = "st-01", Name = "Nguyễn Hoàng Long", Role = "Giám đốc Vận hành Tòa nhà", Department = "Vận hành", Phone = "0912 345 678", Email = "long.nh@ezcondo.vn", Status = "active", CompletedTasks = 184, Rating = 4.95, TenantId = "tenant-1" },
            new StaffMember { Id = "st-02", Name = "Phạm Văn Tuấn", Role = "Kỹ sư trưởng Cơ điện (MEP)", Department = "Kỹ thuật", Phone = "0988 112 233", Email = "tuan.pv@ezcondo.vn", Status = "active", CompletedTasks = 142, Rating = 4.9, TenantId = "tenant-1" },
            new StaffMember { Id = "st-03", Name = "Lê Thị Mỹ Hạnh", Role = "Trưởng nhóm Chăm sóc Cư dân", Department = "Dịch vụ cư dân", Phone = "0977 445 566", Email = "hanh.ltm@ezcondo.vn", Status = "active", CompletedTasks = 210, Rating = 4.98, TenantId = "tenant-1" },
            new StaffMember { Id = "st-04", Name = "Vũ Quốc Bảo", Role = "Kỹ thuật viên Điện nước", Department = "Kỹ thuật", Phone = "0933 667 788", Email = "bao.vq@ezcondo.vn", Status = "active", CompletedTasks = 98, Rating = 4.82, TenantId = "tenant-1" },
            new StaffMember { Id = "st-05", Name = "Đặng Đình Khoa", Role = "Đội trưởng An ninh", Department = "An ninh", Phone = "0944 889 900", Email = "khoa.dd@ezcondo.vn", Status = "active", CompletedTasks = 165, Rating = 4.88, TenantId = "tenant-1" },
            new StaffMember { Id = "st-06", Name = "Nguyễn Thị Minh Châu", Role = "Kế toán Trưởng thu phí", Department = "Tài chính", Phone = "0909 223 311", Email = "chau.ntm@ezcondo.vn", Status = "active", CompletedTasks = 115, Rating = 4.92, TenantId = "tenant-1" }
        );

        // === SHIFTS ===
        var sh1 = new ShiftSchedule { Id = "sh-1", Date = "2026-10-01", ShiftName = "Ca 1 (06:00 - 14:00)", Notes = "Trực xử lý sự cố áp lực nước Block B." };
        var sh2 = new ShiftSchedule { Id = "sh-2", Date = "2026-10-01", ShiftName = "Ca 2 (14:00 - 22:00)", Notes = "Bàn giao mặt bằng bảo dưỡng quạt gió B1-B2." };
        var sh3 = new ShiftSchedule { Id = "sh-3", Date = "2026-10-01", ShiftName = "Ca 3 (22:00 - 06:00)", Notes = "Giám sát camera an ninh và tuần tra." };
        db.ShiftSchedules.AddRange(sh1, sh2, sh3);

        db.ShiftAssignments.AddRange(
            new ShiftAssignment { Id = "sa-1", StaffId = "st-02", StaffName = "Phạm Văn Tuấn", Department = "Kỹ thuật", ShiftScheduleId = "sh-1" },
            new ShiftAssignment { Id = "sa-2", StaffId = "st-03", StaffName = "Lê Thị Mỹ Hạnh", Department = "Lễ tân / Dịch vụ", ShiftScheduleId = "sh-1" },
            new ShiftAssignment { Id = "sa-3", StaffId = "st-05", StaffName = "Đặng Đình Khoa", Department = "An ninh", ShiftScheduleId = "sh-1" },
            new ShiftAssignment { Id = "sa-4", StaffId = "st-04", StaffName = "Vũ Quốc Bảo", Department = "Kỹ thuật", ShiftScheduleId = "sh-2" },
            new ShiftAssignment { Id = "sa-5", StaffId = "st-01", StaffName = "Nguyễn Hoàng Long", Department = "Vận hành", ShiftScheduleId = "sh-2" },
            new ShiftAssignment { Id = "sa-6", StaffId = "st-05", StaffName = "Đặng Đình Khoa", Department = "An ninh", ShiftScheduleId = "sh-3" },
            new ShiftAssignment { Id = "sa-7", StaffId = "st-04", StaffName = "Vũ Quốc Bảo", Department = "Kỹ thuật trực khẩn cấp", ShiftScheduleId = "sh-3" }
        );

        // === BOOKINGS ===
        db.FacilityBookings.AddRange(
            new FacilityBooking { Id = "bk-1", FacilityName = "Khu tiệc nướng BBQ", ApartmentCode = "A-1204", ResidentName = "Nguyễn Văn Minh", BookingDate = "2026-10-03", TimeSlot = "18:00 - 21:00", GuestCount = 8, Status = "Đã xác nhận" },
            new FacilityBooking { Id = "bk-2", FacilityName = "Sân Tennis", ApartmentCode = "C-2101", ResidentName = "Hoàng Kim Sang", BookingDate = "2026-10-02", TimeSlot = "06:00 - 08:00", GuestCount = 4, Status = "Đã xác nhận" },
            new FacilityBooking { Id = "bk-3", FacilityName = "Hồ bơi vô cực", ApartmentCode = "A-0504", ResidentName = "Phạm Thu Thủy", BookingDate = "2026-10-02", TimeSlot = "16:00 - 18:00", GuestCount = 2, Status = "Đã xác nhận" }
        );

        // === SERVICE REQUESTS ===
        db.ServiceRequests.AddRange(
            new ServiceRequest { Id = "req-01", RequestCode = "YC-2026-089", ApartmentCode = "A-1204", ResidentName = "Nguyễn Văn Minh", ResidentPhone = "0908 123 456", Type = "Đăng ký thang máy hàng (Chuyển đồ)", StartDate = "2026-10-03 09:00", EndDate = "2026-10-03 12:00", Status = "Đã phê duyệt", Details = "Chuyển bàn ghế sofa phòng khách và tủ lạnh mới qua thang P3 tháp A.", CreatedAt = "2026-09-30" },
            new ServiceRequest { Id = "req-02", RequestCode = "YC-2026-085", ApartmentCode = "B-0803", ResidentName = "Lê Hoàng Phong", ResidentPhone = "0977 334 556", Type = "Đăng ký thi công nội thất", StartDate = "2026-10-05", EndDate = "2026-10-20", Status = "Chờ duyệt", Details = "Thay thế sàn gỗ phòng ngủ master và lắp tủ bếp âm tường.", CreatedAt = "2026-09-29" },
            new ServiceRequest { Id = "req-03", RequestCode = "YC-2026-078", ApartmentCode = "A-0504", ResidentName = "Phạm Thu Thủy", ResidentPhone = "0938 777 222", Type = "Đăng ký cấp thẻ xe", StartDate = "2026-10-01", Status = "Đã hoàn tất", Details = "Cấp mới thẻ xe máy Honda Vision biển số 59S3-812.33.", CreatedAt = "2026-09-27" }
        );

        // === PARCELS ===
        db.Parcels.AddRange(
            new ParcelItem { Id = "par-01", TrackingCode = "SPX-VN269988112", ApartmentCode = "A-1204", RecipientName = "Nguyễn Văn Minh", Courier = "Shopee Xpress", ArrivedAt = "2026-10-01 09:15", Status = "Chờ nhận tại lễ tân", LockerNumber = "Kệ A - Ô 12" },
            new ParcelItem { Id = "par-02", TrackingCode = "GHTK-981240091", ApartmentCode = "A-1204", RecipientName = "Nguyễn Văn Minh", Courier = "Giao Hàng Tiết Kiệm", ArrivedAt = "2026-09-29 14:30", Status = "Đã nhận", ReceivedAt = "2026-09-29 18:20", LockerNumber = "Kệ A - Ô 12" },
            new ParcelItem { Id = "par-03", TrackingCode = "VTP-778901234", ApartmentCode = "B-0802", RecipientName = "Trần Thị Thu Hà", Courier = "Viettel Post", ArrivedAt = "2026-10-01 10:00", Status = "Chờ nhận tại lễ tân", LockerNumber = "Kệ B - Ô 08" }
        );

        // === USER ACCOUNTS ===
        db.UserAccounts.AddRange(
            new UserAccount { Id = "usr-01", Name = "Nguyễn Văn Minh", Phone = "0908123456", Email = "minh.nguyen@example.com", Role = "resident", TenantId = "tenant-1", ApartmentCode = "A-1204", CreatedAt = "2024-01-15" },
            new UserAccount { Id = "usr-02", Name = "Nguyễn Hoàng Long", Phone = "0912345678", Email = "long.nh@ezcondo.vn", Role = "manager", TenantId = "tenant-1", CreatedAt = "2024-01-01" },
            new UserAccount { Id = "usr-03", Name = "Phạm Văn Tuấn", Phone = "0988112233", Email = "tuan.pv@ezcondo.vn", Role = "staff", TenantId = "tenant-1", CreatedAt = "2024-03-01" },
            new UserAccount { Id = "usr-04", Name = "Hoàng Kim Sang", Phone = "0903999111", Email = "sang.hoang@investcorp.vn", Role = "owner", TenantId = "tenant-1", ApartmentCode = "C-2101", CreatedAt = "2023-01-01" },
            new UserAccount { Id = "usr-05", Name = "Quản Trị Viên Hệ Thống", Phone = "0900000000", Email = "admin@ezcondo.vn", Role = "superadmin", TenantId = "tenant-1", CreatedAt = "2023-01-01" }
        );

        await db.SaveChangesAsync();
    }
}
