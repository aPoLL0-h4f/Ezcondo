import React, { useState, useEffect, useCallback } from 'react';
import {
  TenantCondo,
  UserRole,
  UserAccount,
  Apartment,
  Resident,
  Contract,
  Invoice,
  Complaint,
  StaffMember,
  ShiftSchedule,
  FacilityBooking,
  ApartmentStatus,
  ComplaintStatus,
  ServiceRequest,
  ParcelItem,
} from './types';
import {
  TENANTS_DATA,
  DEFAULT_ACCOUNTS,
} from './data/mockData';
import {
  tenantsApi,
  apartmentsApi,
  residentsApi,
  contractsApi,
  invoicesApi,
  complaintsApi,
  staffApi,
  shiftsApi,
  bookingsApi,
  serviceRequestsApi,
  parcelsApi,
  usersApi,
} from './services/api';
import { Sidebar, NavTab } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { DashboardView } from './components/dashboard/DashboardView';
import { ApartmentManagement } from './components/apartments/ApartmentManagement';
import { ResidentManagement } from './components/residents/ResidentManagement';
import { BillingManagement } from './components/billing/BillingManagement';
import { ComplaintKanban } from './components/complaints/ComplaintKanban';
import { ServiceRequestsView } from './components/services/ServiceRequestsView';
import { ResidentHandbook } from './components/handbook/ResidentHandbook';
import { StaffManagement } from './components/staff/StaffManagement';
import { ReportsView } from './components/reports/ReportsView';
import { ResidentPortal } from './components/resident-portal/ResidentPortal';
import { SuperAdminView } from './components/super-admin/SuperAdminView';
import { AIChatDrawer } from './components/ai/AIChatDrawer';
import { AuthModal } from './components/auth/AuthModal';
import { AccountSettingsModal } from './components/settings/AccountSettingsModal';
import { MessageCircle } from 'lucide-react';

export default function App() {
  // Tenancy state
  const [tenants, setTenants] = useState<TenantCondo[]>(TENANTS_DATA);
  const [currentTenant, setCurrentTenant] = useState<TenantCondo>(TENANTS_DATA[0]);

  // Auth User state
  const [currentUser, setCurrentUser] = useState<UserAccount>(DEFAULT_ACCOUNTS[1] as UserAccount); // Ban Quản lý by default
  const [currentRole, setCurrentRole] = useState<UserRole>('manager');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');

  // Modals state
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Core Data State — loaded from C# Backend API
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [shifts, setShifts] = useState<ShiftSchedule[]>([]);
  const [bookings, setBookings] = useState<FacilityBooking[]>([]);
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
  const [parcels, setParcels] = useState<ParcelItem[]>([]);

  // Loading & Error state
  const [isLoading, setIsLoading] = useState(true);

  // Global search & UI
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // ============================================================
  // FETCH ALL DATA FROM C# BACKEND API ON MOUNT
  // ============================================================
  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        tenantsData,
        apartmentsData,
        residentsData,
        contractsData,
        invoicesData,
        complaintsData,
        staffData,
        shiftsData,
        bookingsData,
        serviceRequestsData,
        parcelsData,
      ] = await Promise.all([
        tenantsApi.getAll(),
        apartmentsApi.getAll(),
        residentsApi.getAll(),
        contractsApi.getAll(),
        invoicesApi.getAll(),
        complaintsApi.getAll(),
        staffApi.getAll(),
        shiftsApi.getAll(),
        bookingsApi.getAll(),
        serviceRequestsApi.getAll(),
        parcelsApi.getAll(),
      ]);

      // Map backend response to frontend format
      const mappedApartments: Apartment[] = apartmentsData.map((a: any) => ({
        ...a,
        currentResident: a.currentResidentId
          ? {
              id: a.currentResidentId,
              name: a.currentResidentName,
              phone: a.currentResidentPhone,
              email: a.currentResidentEmail,
              isOwner: a.currentResidentIsOwner,
            }
          : undefined,
        residentHistory: a.residentHistory || [],
        maintenanceHistory: a.maintenanceHistory || [],
        images: a.images || [],
      }));

      const mappedComplaints: Complaint[] = complaintsData.map((c: any) => ({
        ...c,
        images: c.images || [],
        messages: (c.messages || []).map((m: any) => ({
          id: m.id,
          senderName: m.senderName,
          senderRole: m.senderRole,
          content: m.content,
          timestamp: m.timestamp,
          isAI: m.isAI,
        })),
        aiAnalysis: c.aiDiagnosis
          ? {
              diagnosis: c.aiDiagnosis,
              suggestedResponse: c.aiSuggestedResponse,
              actionSteps: c.aiActionSteps || [],
              estimatedCost: c.aiEstimatedCost,
              targetTime: c.aiTargetTime,
            }
          : undefined,
      }));

      const mappedResidents: Resident[] = residentsData.map((r: any) => ({
        ...r,
        vehicles: (r.vehicles || []).map((v: any) => ({ type: v.type, plate: v.plate })),
      }));

      const mappedInvoices: Invoice[] = invoicesData.map((i: any) => ({
        ...i,
        items: (i.items || []).map((it: any) => ({
          description: it.description,
          quantity: it.quantity,
          unit: it.unit,
          unitPrice: it.unitPrice,
          amount: it.amount,
        })),
      }));

      const mappedShifts: ShiftSchedule[] = shiftsData.map((s: any) => ({
        ...s,
        staffAssigned: (s.staffAssigned || []).map((sa: any) => ({
          staffId: sa.staffId,
          staffName: sa.staffName,
          department: sa.department,
        })),
      }));

      setTenants(tenantsData);
      if (tenantsData.length > 0) setCurrentTenant(tenantsData[0]);
      setApartments(mappedApartments);
      setResidents(mappedResidents);
      setContracts(contractsData);
      setInvoices(mappedInvoices);
      setComplaints(mappedComplaints);
      setStaff(staffData);
      setShifts(mappedShifts);
      setBookings(bookingsData);
      setServiceRequests(serviceRequestsData);
      setParcels(parcelsData);
    } catch (error) {
      console.error('Failed to fetch data from backend:', error);
      // Fallback: keep using current state (mock data if first load)
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Role switch handler
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    // Find matching demo user for the role
    const matched = DEFAULT_ACCOUNTS.find((a) => a.role === newRole);
    if (matched) {
      setCurrentUser(matched as UserAccount);
    }
    if (newRole === 'resident') {
      setActiveTab('resident_portal');
    } else if (newRole === 'superadmin') {
      setActiveTab('super_admin');
    } else if (activeTab === 'resident_portal' || activeTab === 'super_admin') {
      setActiveTab('dashboard');
    }
  };

  // Auth Handlers
  const handleLoginSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    setCurrentRole(user.role);
    if (user.role === 'resident') {
      setActiveTab('resident_portal');
    } else if (user.role === 'superadmin') {
      setActiveTab('super_admin');
    } else {
      setActiveTab('dashboard');
    }
  };

  const handleRegisterTenantSuccess = async (newTenant: Partial<TenantCondo>, user: UserAccount) => {
    const fullTenant: TenantCondo = {
      id: `tenant-${Date.now()}`,
      name: newTenant.name || 'Dự án mới',
      code: newTenant.code || 'NEW',
      address: newTenant.address || 'TP. Hồ Chí Minh',
      totalApartments: newTenant.totalApartments || 300,
      occupancyRate: 90.0,
      activeResidents: Math.round((newTenant.totalApartments || 300) * 2.5),
      managerName: newTenant.managerName || user.name,
      package: newTenant.package || 'Professional',
      monthlyFee: newTenant.monthlyFee || 11000000,
      status: 'trial',
      createdAt: new Date().toISOString().split('T')[0],
    };
    try {
      const created = await tenantsApi.create(fullTenant);
      setTenants((prev) => [created, ...prev]);
      setCurrentTenant(created);
    } catch {
      setTenants((prev) => [fullTenant, ...prev]);
      setCurrentTenant(fullTenant);
    }
    setCurrentUser(user);
    setCurrentRole(user.role);
    setActiveTab('dashboard');
  };

  const handleUpdateProfile = (updated: Partial<UserAccount>) => {
    setCurrentUser((prev) => ({ ...prev, ...updated }));
  };

  const handleLogout = () => {
    setShowAuthModal(true);
  };

  // ============================================================
  // APARTMENT HANDLERS — call C# API
  // ============================================================
  const handleUpdateApartmentStatus = async (aptId: string, newStatus: ApartmentStatus) => {
    try {
      await apartmentsApi.updateStatus(aptId, newStatus);
      setApartments((prev) =>
        prev.map((a) => (a.id === aptId ? { ...a, status: newStatus } : a))
      );
    } catch (error) {
      console.error('Failed to update apartment status:', error);
    }
  };

  const handleAssignResident = async (
    aptCode: string,
    residentName: string,
    phone: string,
    email: string
  ) => {
    const apt = apartments.find((a) => a.code === aptCode);
    if (!apt) return;
    try {
      await apartmentsApi.assignResident(apt.id, { residentName, phone, email });
      setApartments((prev) =>
        prev.map((a) =>
          a.code === aptCode
            ? {
                ...a,
                status: 'occupied',
                currentResident: {
                  id: `res-${Date.now()}`,
                  name: residentName,
                  phone,
                  email,
                  isOwner: false,
                },
              }
            : a
        )
      );
    } catch (error) {
      console.error('Failed to assign resident:', error);
    }
  };

  const handleCreateInvoiceForApt = async (
    aptCode: string,
    residentName: string,
    amount: number
  ) => {
    const newInv: any = {
      invoiceCode: `HD-202610-${aptCode.replace('-', '')}`,
      apartmentCode: aptCode,
      residentName,
      month: '10/2026',
      issueDate: '2026-10-01',
      dueDate: '2026-10-10',
      status: 'unpaid',
      totalAmount: amount,
      items: [
        {
          description: 'Phí dịch vụ & vận hành theo quy chuẩn tòa nhà',
          quantity: 1,
          unit: 'tháng',
          unitPrice: amount,
          amount,
        },
      ],
    };
    try {
      const created = await invoicesApi.create(newInv);
      setInvoices((prev) => [{ ...created, items: created.items || newInv.items }, ...prev]);
    } catch (error) {
      console.error('Failed to create invoice:', error);
    }
  };

  // ============================================================
  // RESIDENT HANDLERS — call C# API
  // ============================================================
  const handleActivateResident = async (resId: string) => {
    try {
      await residentsApi.activate(resId);
      setResidents((prev) =>
        prev.map((r) => (r.id === resId ? { ...r, status: 'active' } : r))
      );
    } catch (error) {
      console.error('Failed to activate resident:', error);
    }
  };

  const handleAddNewResident = async (newRes: Partial<Resident>) => {
    const resident: any = {
      name: newRes.name || '',
      apartmentCode: newRes.apartmentCode || '',
      phone: newRes.phone || '',
      email: newRes.email || '',
      idCard: newRes.idCard || '079099887766',
      status: 'active',
      role: newRes.role || 'Khách thuê',
      moveInDate: newRes.moveInDate || new Date().toISOString().split('T')[0],
      vehicles: (newRes.vehicles || []).map((v) => ({ type: v.type, plate: v.plate })),
      tenantId: currentTenant.id,
    };
    try {
      const created = await residentsApi.create(resident);
      setResidents((prev) => [{ ...created, vehicles: created.vehicles || resident.vehicles }, ...prev]);
      // Also update apartment status
      setApartments((prev) =>
        prev.map((a) =>
          a.code === resident.apartmentCode
            ? {
                ...a,
                status: 'occupied',
                currentResident: {
                  id: created.id,
                  name: created.name,
                  phone: created.phone,
                  email: created.email,
                  isOwner: created.role === 'Chủ hộ',
                },
              }
            : a
        )
      );
    } catch (error) {
      console.error('Failed to add resident:', error);
    }
  };

  // ============================================================
  // BILLING HANDLERS — call C# API
  // ============================================================
  const handlePayInvoice = async (invId: string, method: string) => {
    try {
      const updated = await invoicesApi.pay(invId, method);
      setInvoices((prev) =>
        prev.map((inv) =>
          inv.id === invId
            ? {
                ...inv,
                status: 'paid',
                paidDate: updated.paidDate || new Date().toISOString().split('T')[0],
                paymentMethod: method,
                transactionId: updated.transactionId || `FT-${Date.now().toString().slice(-8)}`,
              }
            : inv
        )
      );
    } catch (error) {
      console.error('Failed to pay invoice:', error);
    }
  };

  const handleGenerateBatchInvoices = async () => {
    try {
      const newBatch = await invoicesApi.batchGenerate();
      setInvoices((prev) => [...newBatch.map((inv: any) => ({ ...inv, items: inv.items || [] })), ...prev]);
    } catch (error) {
      console.error('Failed to generate batch invoices:', error);
    }
  };

  // ============================================================
  // COMPLAINT HANDLERS — call C# API
  // ============================================================
  const handleUpdateComplaintStatus = async (ticketId: string, nextStatus: ComplaintStatus) => {
    try {
      await complaintsApi.updateStatus(ticketId, nextStatus);
      setComplaints((prev) =>
        prev.map((c) => (c.id === ticketId ? { ...c, status: nextStatus, updatedAt: 'Vừa xong' } : c))
      );
    } catch (error) {
      console.error('Failed to update complaint status:', error);
    }
  };

  const handleAddMessage = async (ticketId: string, content: string, senderRole: any) => {
    const senderName =
      senderRole === 'Cư dân'
        ? currentUser.name
        : senderRole === 'Nhân viên kỹ thuật'
        ? 'KTV Trực ban'
        : 'Ban Quản trị';

    try {
      const newMsg = await complaintsApi.addMessage(ticketId, { senderName, senderRole, content });
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === ticketId
            ? {
                ...c,
                messages: [...c.messages, { id: newMsg.id, senderName, senderRole, content, timestamp: newMsg.timestamp }],
                updatedAt: 'Vừa xong',
              }
            : c
        )
      );
    } catch (error) {
      console.error('Failed to add message:', error);
    }
  };

  const handleCreateComplaint = async (newComp: Partial<Complaint>) => {
    const complaintData: any = {
      title: newComp.title || 'Sự cố',
      category: newComp.category || 'Kỹ thuật - Nước',
      apartmentCode: newComp.apartmentCode || 'A-1204',
      residentName: newComp.residentName || currentUser.name,
      residentPhone: newComp.residentPhone || currentUser.phone,
      priority: newComp.priority || 'high',
      description: newComp.description || '',
      images: newComp.images || [],
    };
    try {
      const created = await complaintsApi.create(complaintData);
      const fullComp: Complaint = {
        ...created,
        messages: created.messages || [],
        images: created.images || [],
      };
      setComplaints((prev) => [fullComp, ...prev]);
    } catch (error) {
      console.error('Failed to create complaint:', error);
    }
  };

  const handleAssignStaff = async (ticketId: string, staffName: string, deadline: string) => {
    try {
      await complaintsApi.assignStaff(ticketId, { staffName, deadline });
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === ticketId
            ? { ...c, assignedTo: staffName, deadline, status: 'in_progress', updatedAt: 'Vừa xong' }
            : c
        )
      );
    } catch (error) {
      console.error('Failed to assign staff:', error);
    }
  };

  // ============================================================
  // SERVICE REQUEST & PARCEL HANDLERS — call C# API
  // ============================================================
  const handleApproveRequest = async (id: string) => {
    try {
      await serviceRequestsApi.approve(id);
      setServiceRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'Đã phê duyệt' } : r))
      );
    } catch (error) {
      console.error('Failed to approve request:', error);
    }
  };

  const handleRejectRequest = async (id: string) => {
    try {
      await serviceRequestsApi.reject(id);
      setServiceRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: 'Từ chối' } : r))
      );
    } catch (error) {
      console.error('Failed to reject request:', error);
    }
  };

  const handleCreateRequest = async (req: Partial<ServiceRequest>) => {
    const newReq: any = {
      requestCode: req.requestCode || `YC-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: req.type || 'Đăng ký thang máy hàng (Chuyển đồ)',
      apartmentCode: req.apartmentCode || 'A-1204',
      residentName: req.residentName || currentUser.name,
      residentPhone: req.residentPhone || currentUser.phone,
      startDate: req.startDate || '2026-10-04 09:00',
      details: req.details || '',
      status: 'Chờ duyệt',
    };
    try {
      const created = await serviceRequestsApi.create(newReq);
      setServiceRequests((prev) => [created, ...prev]);
    } catch (error) {
      console.error('Failed to create request:', error);
    }
  };

  const handleMarkParcelReceived = async (id: string) => {
    try {
      const updated = await parcelsApi.markReceived(id);
      setParcels((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: 'Đã nhận', receivedAt: updated.receivedAt }
            : p
        )
      );
    } catch (error) {
      console.error('Failed to mark parcel received:', error);
    }
  };

  const handleAddParcel = async (par: Partial<ParcelItem>) => {
    const newPar: any = {
      trackingCode: par.trackingCode || `VN-${Date.now().toString().slice(-6)}`,
      apartmentCode: par.apartmentCode || 'A-1204',
      recipientName: par.recipientName || 'Cư dân',
      courier: par.courier || 'Shopee Xpress',
      arrivedAt: par.arrivedAt || 'Hôm nay',
      status: 'Chờ nhận tại lễ tân',
      lockerNumber: par.lockerNumber || 'Kệ A',
    };
    try {
      const created = await parcelsApi.create(newPar);
      setParcels((prev) => [created, ...prev]);
    } catch (error) {
      console.error('Failed to add parcel:', error);
    }
  };

  // ============================================================
  // STAFF HANDLERS — call C# API
  // ============================================================
  const handleAddStaff = async (newStaff: Partial<StaffMember>) => {
    const member: any = {
      name: newStaff.name || '',
      role: newStaff.role || 'Kỹ thuật viên',
      department: newStaff.department || 'Kỹ thuật',
      phone: newStaff.phone || '',
      email: newStaff.email || '',
      status: 'active',
      completedTasks: 0,
      rating: 5.0,
      tenantId: currentTenant.id,
    };
    try {
      const created = await staffApi.create(member);
      setStaff((prev) => [...prev, created]);
    } catch (error) {
      console.error('Failed to add staff:', error);
    }
  };

  // ============================================================
  // BOOKING HANDLERS — call C# API
  // ============================================================
  const handleBookFacility = async (newBk: Partial<FacilityBooking>) => {
    const bk: any = {
      facilityName: newBk.facilityName || 'Khu tiệc nướng BBQ',
      apartmentCode: newBk.apartmentCode || 'A-1204',
      residentName: newBk.residentName || currentUser.name,
      bookingDate: newBk.bookingDate || '2026-10-04',
      timeSlot: newBk.timeSlot || '18:00 - 21:00',
      guestCount: newBk.guestCount || 4,
      status: 'Đã xác nhận',
    };
    try {
      const created = await bookingsApi.create(bk);
      setBookings((prev) => [created, ...prev]);
    } catch (error) {
      console.error('Failed to book facility:', error);
    }
  };

  // ============================================================
  // TENANT HANDLERS — call C# API
  // ============================================================
  const handleAddTenant = async (newTenant: Partial<TenantCondo>) => {
    const tenant: TenantCondo = {
      id: `tenant-${Date.now()}`,
      name: newTenant.name || '',
      code: newTenant.code || 'COND',
      address: newTenant.address || '',
      totalApartments: newTenant.totalApartments || 300,
      occupancyRate: 90.0,
      activeResidents: newTenant.activeResidents || 800,
      managerName: newTenant.managerName || 'Ban Quản trị',
      status: 'active',
      package: newTenant.package || 'Professional',
      monthlyFee: newTenant.monthlyFee || 11000000,
      createdAt: new Date().toISOString().split('T')[0],
    };
    try {
      const created = await tenantsApi.create(tenant);
      setTenants((prev) => [...prev, created]);
      setCurrentTenant(created);
    } catch (error) {
      console.error('Failed to add tenant:', error);
    }
  };

  const openComplaintsCount = complaints.filter(
    (c) => c.status === 'new' || c.status === 'in_progress' || c.status === 'waiting_resident'
  ).length;
  const overdueInvoicesCount = invoices.filter((i) => i.status === 'overdue').length;

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Đang kết nối Backend API...</p>
          <p className="text-slate-400 text-sm mt-1">http://localhost:5263</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased max-sm:w-full max-sm:max-w-[100vw] max-sm:overflow-x-hidden">
      {/* Fixed Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentTenant={currentTenant}
        currentRole={currentRole}
        openComplaintsCount={openComplaintsCount}
        overdueInvoicesCount={overdueInvoicesCount}
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex min-h-screen flex-col md:pl-64 max-sm:min-w-0 max-sm:w-full max-sm:max-w-[100vw]">
        {/* Topbar */}
        <Topbar
          currentTenant={currentTenant}
          onSelectTenant={setCurrentTenant}
          allTenants={tenants}
          currentRole={currentRole}
          onSelectRole={handleRoleChange}
          currentUser={currentUser}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenAIChat={() => setIsAIChatOpen(true)}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onOpenSettingsModal={() => setShowSettingsModal(true)}
          onLogout={handleLogout}
          onOpenMobileMenu={() => setMobileNavOpen(true)}
        />

        {/* Dynamic Route Content */}
        <main className="min-w-0 flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 max-sm:w-full max-sm:max-w-full max-sm:px-3">
          {activeTab === 'dashboard' && (
            <DashboardView
              currentTenant={currentTenant}
              apartments={apartments}
              invoices={invoices}
              complaints={complaints}
              staff={staff}
              shifts={shifts}
              onNavigate={(tab) => setActiveTab(tab)}
              onSelectComplaint={() => setActiveTab('complaints')}
            />
          )}

          {activeTab === 'apartments' && (
            <ApartmentManagement
              apartments={apartments}
              residents={residents}
              onUpdateApartmentStatus={handleUpdateApartmentStatus}
              onAssignResident={handleAssignResident}
              onCreateInvoiceForApt={handleCreateInvoiceForApt}
            />
          )}

          {activeTab === 'residents' && (
            <ResidentManagement
              residents={residents}
              contracts={contracts}
              invoices={invoices}
              complaints={complaints}
              onActivateResident={handleActivateResident}
              onAddNewResident={handleAddNewResident}
            />
          )}

          {activeTab === 'billing' && (
            <BillingManagement
              invoices={invoices}
              currentRole={currentRole}
              onPayInvoice={handlePayInvoice}
              onGenerateBatchInvoices={handleGenerateBatchInvoices}
            />
          )}

          {activeTab === 'complaints' && (
            <ComplaintKanban
              complaints={complaints}
              currentRole={currentRole}
              onUpdateComplaintStatus={handleUpdateComplaintStatus}
              onAddMessage={handleAddMessage}
              onCreateComplaint={handleCreateComplaint}
              onAssignStaff={handleAssignStaff}
            />
          )}

          {activeTab === 'services' && (
            <ServiceRequestsView
              currentRole={currentRole}
              requests={serviceRequests}
              parcels={parcels}
              onApproveRequest={handleApproveRequest}
              onRejectRequest={handleRejectRequest}
              onCreateRequest={handleCreateRequest}
              onMarkParcelReceived={handleMarkParcelReceived}
              onAddParcel={handleAddParcel}
            />
          )}

          {activeTab === 'handbook' && (
            <ResidentHandbook currentTenant={currentTenant} />
          )}

          {activeTab === 'staff' && (
            <StaffManagement
              staff={staff}
              shifts={shifts}
              onAddStaff={handleAddStaff}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView
              currentTenant={currentTenant}
              apartments={apartments}
              invoices={invoices}
              complaints={complaints}
              staff={staff}
            />
          )}

          {activeTab === 'resident_portal' && (
            <ResidentPortal
              currentTenant={currentTenant}
              invoices={invoices}
              complaints={complaints}
              contracts={contracts}
              bookings={bookings}
              onPayInvoice={handlePayInvoice}
              onCreateComplaint={handleCreateComplaint}
              onBookFacility={handleBookFacility}
              onOpenAIChat={() => setIsAIChatOpen(true)}
            />
          )}

          {activeTab === 'super_admin' && (
            <SuperAdminView
              tenants={tenants}
              onAddTenant={handleAddTenant}
            />
          )}
        </main>
      </div>

      {/* Floating 24/7 Support Trigger */}
      <div className="fixed bottom-6 right-6 z-40">
        {!isAIChatOpen && (
          <button
            onClick={() => setIsAIChatOpen(true)}
            className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-white shadow-lg hover:bg-slate-800 active:scale-95 transition text-xs font-semibold"
          >
            <MessageCircle className="h-4 w-4 text-blue-400" />
            <span>Hỗ trợ 24/7</span>
          </button>
        )}
      </div>

      {/* Embedded 24/7 Chat Drawer */}
      <AIChatDrawer
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
        currentTenant={currentTenant}
        residentApartment={currentUser.apartmentCode || 'A-1204'}
        onOpenBooking={() => {
          setActiveTab('resident_portal');
          setIsAIChatOpen(false);
        }}
        onOpenComplaint={() => {
          setActiveTab('complaints');
          setIsAIChatOpen(false);
        }}
        onOpenPayment={() => {
          setActiveTab('billing');
          setIsAIChatOpen(false);
        }}
      />

      {/* Authentication Modal (Sign in / Sign up / Forgot pass) */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        onRegisterTenantSuccess={handleRegisterTenantSuccess}
      />

      {/* Account Settings & Profile Modal */}
      <AccountSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        currentUser={currentUser}
        onUpdateProfile={handleUpdateProfile}
        onLogout={handleLogout}
      />
    </div>
  );
}
