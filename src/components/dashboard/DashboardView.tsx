import React, { useState, useEffect } from 'react';
import {
  Building2,
  TrendingUp,
  AlertTriangle,
  Wrench,
  Users,
  CheckCircle2,
  ArrowUpRight,
  ChevronRight,
  Clock,
  RefreshCw,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import {
  TenantCondo,
  Apartment,
  Invoice,
  Complaint,
  StaffMember,
  ShiftSchedule,
} from '../../types';
import { Modal } from '../common/Modal';

interface DashboardViewProps {
  currentTenant: TenantCondo;
  apartments: Apartment[];
  invoices: Invoice[];
  complaints: Complaint[];
  staff: StaffMember[];
  shifts: ShiftSchedule[];
  onNavigate: (tab: any) => void;
  onSelectComplaint?: (c: Complaint) => void;
}

interface AIPriorityItem {
  id: string;
  title: string;
  category: string;
  urgency: 'high' | 'medium' | 'normal';
  impact: string;
  action: string;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentTenant,
  apartments,
  invoices,
  complaints,
  staff,
  shifts,
  onNavigate,
  onSelectComplaint,
}) => {
  const [aiPriorities, setAiPriorities] = useState<AIPriorityItem[]>([]);
  const [loadingAI, setLoadingAI] = useState<boolean>(false);
  const [showAIPrioritiesModal, setShowAIPrioritiesModal] = useState<boolean>(false);

  // Compute metrics
  const totalUnits = apartments.length > 0 ? currentTenant.totalApartments : 450;
  const vacantUnits = apartments.filter((a) => a.status === 'vacant').length;
  const currentOccupancy = currentTenant.occupancyRate || 94.2;

  // Revenue calculation
  const currentMonthRevenue = invoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0) || 1420000000;

  const openComplaints = complaints.filter(
    (c) => c.status === 'new' || c.status === 'in_progress' || c.status === 'waiting_resident'
  );
  const activeIncidents = complaints.filter(
    (c) => (c.category.includes('Kỹ thuật') || c.category.includes('Thang máy')) && c.status !== 'closed'
  );
  const overdueInvoices = invoices.filter((i) => i.status === 'overdue');

  // Fetch priorities
  const fetchAIPriorities = async () => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/suggest-priority', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condoName: currentTenant.name,
          stats: {
            occupancy: `${currentOccupancy}%`,
            openComplaints: openComplaints.length,
            openIncidents: activeIncidents.length,
          },
          complaints: openComplaints.map((c) => ({
            title: c.title,
            priority: c.priority,
            apartment: c.apartmentCode,
          })),
          overdueCount: overdueInvoices.length,
        }),
      });
      const data = await res.json();
      if (data.data) {
        setAiPriorities(data.data);
      }
    } catch (err) {
      console.error('Failed to load priorities:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  useEffect(() => {
    fetchAIPriorities();
  }, [currentTenant.id]);

  // 6-month revenue data
  const revenueHistory = [
    { month: 'T05/26', amount: 1280000000 },
    { month: 'T06/26', amount: 1310000000 },
    { month: 'T07/26', amount: 1350000000 },
    { month: 'T08/26', amount: 1390000000 },
    { month: 'T09/26', amount: 1410000000 },
    { month: 'T10/26 (Hiện tại)', amount: 1428500000, isCurrent: true },
  ];
  const maxRevenue = Math.max(...revenueHistory.map((r) => r.amount));

  // Occupancy breakdown percentages
  const occupancyBreakdown = [
    { label: 'Đang có cư dân ở / Đã thuê', count: 424, percentage: 94.2, color: 'bg-emerald-600', text: 'text-emerald-700' },
    { label: 'Căn hộ trống sẵn sàng', count: 18, percentage: 4.0, color: 'bg-blue-600', text: 'text-blue-700' },
    { label: 'Đang sửa chữa / Bảo trì', count: 5, percentage: 1.1, color: 'bg-amber-500', text: 'text-amber-700' },
    { label: 'Đang chào bán / Chuyển nhượng', count: 3, percentage: 0.7, color: 'bg-slate-400', text: 'text-slate-600' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Human-designed Clean Header */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <span>Bảng điều hành</span>
              <span aria-hidden="true">·</span>
              <span>{currentTenant.name}</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-600 font-medium">Hôm nay: {new Date().toLocaleDateString('vi-VN')}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Tổng Quan Vận Hành Tòa Nhà
            </h1>
            <p className="mt-1 text-xs text-slate-500 max-w-2xl leading-relaxed">
              Địa chỉ: {currentTenant.address} • Quản lý: {currentTenant.managerName}
            </p>
          </div>

          {/* Daily Priority Action Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowAIPrioritiesModal(true)}
              className="flex items-center gap-2 rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition shadow-sm"
            >
              <span>Xem công việc cần ưu tiên hôm nay ({aiPriorities.length})</span>
            </button>
            <button
              onClick={fetchAIPriorities}
              disabled={loadingAI}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-50 transition"
              title="Làm mới dữ liệu"
            >
              <RefreshCw className={`h-4 w-4 ${loadingAI ? 'animate-spin text-blue-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* 6 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1 */}
        <div
          onClick={() => onNavigate('apartments')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Tỷ lệ lấp đầy</span>
            <Building2 className="h-4 w-4 text-slate-400" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">{currentOccupancy}%</div>
          <div className="mt-1 text-xs text-slate-500">
            {totalUnits - vacantUnits} / {totalUnits} căn ({vacantUnits} trống)
          </div>
        </div>

        {/* Card 2 */}
        <div
          onClick={() => onNavigate('billing')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Doanh thu tháng 10</span>
            <TrendingUp className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">
            {(currentMonthRevenue / 1000000000).toFixed(2)} tỷ đ
          </div>
          <div className="mt-1 flex items-center gap-1 text-xs text-emerald-600 font-medium">
            <ArrowUpRight className="h-3 w-3" />
            <span>Tăng 8.4% so tháng trước</span>
          </div>
        </div>

        {/* Card 3 */}
        <div
          onClick={() => onNavigate('complaints')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Khiếu nại đang mở</span>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">{openComplaints.length} vụ</div>
          <div className="mt-1 text-xs text-amber-700">
            {complaints.filter((c) => c.priority === 'urgent' || c.priority === 'high').length} vụ cần xử lý ngay
          </div>
        </div>

        {/* Card 4 */}
        <div
          onClick={() => onNavigate('complaints')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Sự cố kỹ thuật</span>
            <Wrench className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">{activeIncidents.length} sự cố</div>
          <div className="mt-1 text-xs text-slate-500">Đang được kỹ sư ca xử lý</div>
        </div>

        {/* Card 5 */}
        <div
          onClick={() => onNavigate('residents')}
          className="cursor-pointer rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-slate-300 transition"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Cư dân hiện diện</span>
            <Users className="h-4 w-4 text-slate-500" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">
            {currentTenant.activeResidents.toLocaleString('vi-VN')} người
          </div>
          <div className="mt-1 text-xs text-slate-500">
            1.290 tài khoản đã kích hoạt
          </div>
        </div>

        {/* Card 6 */}
        <div
          onClick={() => setShowAIPrioritiesModal(true)}
          className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50/60 p-4 shadow-sm hover:border-blue-400 hover:bg-white transition"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-blue-800">
            <span>Ưu tiên hôm nay</span>
            <Clock className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-xl font-bold text-slate-900">{aiPriorities.length} việc</div>
          <div className="mt-1 text-xs text-blue-700 flex items-center gap-0.5 font-medium">
            <span>Xem chi tiết giải pháp</span>
            <ChevronRight className="h-3 w-3" />
          </div>
        </div>
      </div>

      {/* 2 Big Charts: Revenue 6 months & Occupancy Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Doanh thu 6 tháng gần nhất */}
        <div className="lg:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Doanh Thu Phí Dịch Vụ 6 Tháng Gần Nhất
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Bao gồm phí quản lý, trông giữ xe, nước sinh hoạt và tiện ích
              </p>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Đơn vị: VNĐ
            </div>
          </div>

          {/* Interactive Bar Chart Representation */}
          <div className="h-56 flex items-end justify-between gap-4 pt-4 pb-2 border-b border-slate-100">
            {revenueHistory.map((item, idx) => {
              const heightPct = Math.round((item.amount / maxRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity mb-2 text-[11px] font-semibold bg-slate-800 text-white rounded px-2 py-0.5 whitespace-nowrap shadow-sm">
                    {(item.amount / 1000000000).toFixed(3)} tỷ đ
                  </div>
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-md overflow-hidden flex flex-col justify-end h-full">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className={`w-full rounded-t-md transition-all duration-300 ${
                        item.isCurrent
                          ? 'bg-blue-700 group-hover:bg-blue-800'
                          : 'bg-slate-300 group-hover:bg-slate-400'
                      }`}
                    />
                  </div>
                  <span className={`mt-2 text-xs ${item.isCurrent ? 'font-bold text-blue-700' : 'text-slate-500'}`}>
                    {item.month}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
            <span>Tiến độ thu tháng 10: <strong className="text-slate-800">98.5%</strong></span>
            <span>Tổng lũy kế 6 tháng: <strong className="text-slate-800">8.168.500.000 đ</strong></span>
          </div>
        </div>

        {/* Chart 2: Tình trạng khai thác căn hộ */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-bold text-slate-900">Hiện Trạng Khai Thác Căn Hộ</h2>
              <span className="text-xs font-semibold text-emerald-700">
                {currentOccupancy}% lấp đầy
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Tổng số {totalUnits} căn hộ tại {currentTenant.name}
            </p>

            {/* Simple Clean Stacked Bar */}
            <div className="mb-6">
              <div className="flex h-3 w-full overflow-hidden rounded-full bg-slate-100">
                {occupancyBreakdown.map((item, idx) => (
                  <div
                    key={idx}
                    style={{ width: `${item.percentage}%` }}
                    className={`${item.color}`}
                    title={`${item.label}: ${item.count} căn (${item.percentage}%)`}
                  />
                ))}
              </div>
            </div>

            {/* Breakdown List */}
            <div className="space-y-3">
              {occupancyBreakdown.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                    <span className="text-slate-600">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium">
                    <span className="text-slate-900">{item.count} căn</span>
                    <span className="text-slate-400">({item.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              onClick={() => onNavigate('apartments')}
              className="flex w-full items-center justify-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-800"
            >
              <span>Xem sơ đồ & mặt bằng căn hộ</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* 3 Quick Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table 1: Khiếu nại mới nhất */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Khiếu Nại Mới Nhất</h3>
              <button
                onClick={() => onNavigate('complaints')}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Xem tất cả ({complaints.length})
              </button>
            </div>

            <div className="space-y-3">
              {complaints.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectComplaint ? onSelectComplaint(item) : onNavigate('complaints')}
                  className="cursor-pointer rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-slate-900">{item.apartmentCode}</span>
                    <span className="text-[11px] text-slate-500 font-medium">{item.category}</span>
                  </div>
                  <p className="text-xs text-slate-700 line-clamp-1 font-medium">{item.title}</p>
                  <div className="mt-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.residentName}</span>
                    <span>{item.createdAt.split(' ')[1]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table 2: Hóa đơn quá hạn */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Hóa Đơn Quá Hạn Cần Nhắc</h3>
              <button
                onClick={() => onNavigate('billing')}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Xem tất cả ({overdueInvoices.length})
              </button>
            </div>

            <div className="space-y-3">
              {overdueInvoices.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  Hiện không có hóa đơn quá hạn
                </div>
              ) : (
                overdueInvoices.slice(0, 3).map((item) => (
                  <div
                    key={item.id}
                    onClick={() => onNavigate('billing')}
                    className="cursor-pointer rounded-lg border border-slate-100 p-3 hover:bg-slate-50 transition"
                  >
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-bold text-slate-900">{item.apartmentCode}</span>
                      <span className="font-bold text-rose-700">
                        {item.totalAmount.toLocaleString('vi-VN')} đ
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{item.residentName}</span>
                      <span className="text-[11px] text-slate-400">Hạn: {item.dueDate}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Table 3: Công việc nhân viên hôm nay */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Lịch Trực Ca Hôm Nay</h3>
              <button
                onClick={() => onNavigate('staff')}
                className="text-xs font-semibold text-blue-700 hover:underline"
              >
                Xem ca trực
              </button>
            </div>

            <div className="space-y-3">
              {shifts.map((shift) => (
                <div key={shift.id} className="rounded-lg border border-slate-100 p-2.5 bg-slate-50">
                  <div className="flex items-center justify-between text-xs mb-1 font-semibold text-slate-800">
                    <span>{shift.shiftName}</span>
                    <span className="text-[11px] text-slate-500 font-normal">{shift.staffAssigned.length} người</span>
                  </div>
                  <div className="text-[11px] text-slate-600 line-clamp-1">
                    {shift.staffAssigned.map((s) => s.staffName).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Đề xuất ưu tiên vận hành */}
      <Modal
        isOpen={showAIPrioritiesModal}
        onClose={() => setShowAIPrioritiesModal(false)}
        title="Đề Xuất Ưu Tiên Vận Hành Trong Ngày"
        maxWidth="max-w-2xl"
        footer={
          <button
            onClick={() => setShowAIPrioritiesModal(false)}
            className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition"
          >
            Đóng
          </button>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Dựa trên tổng hợp {openComplaints.length} khiếu nại mở và {overdueInvoices.length} hóa đơn quá hạn tại {currentTenant.name}:
          </p>

          <div className="space-y-3">
            {aiPriorities.map((item, idx) => (
              <div
                key={item.id || idx}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-700">{item.category}</span>
                  <span className="text-[11px] text-slate-500">{item.urgency === 'high' ? 'Khẩn cấp' : 'Ưu tiên'}</span>
                </div>
                <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600">{item.impact}</p>
                <div className="rounded-lg bg-slate-50 p-2.5 text-xs text-slate-800 font-medium border border-slate-100">
                  Khuyến nghị hành động: {item.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};
