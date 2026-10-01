import React, { useState, useMemo } from 'react';
import {
  Building,
  Search,
  Filter,
  Eye,
  Plus,
  Edit,
  UserPlus,
  Receipt,
  CheckCircle2,
  Clock,
  Wrench,
  Tag,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Layers,
  History,
  Image as ImageIcon,
} from 'lucide-react';
import { Apartment, ApartmentStatus, ApartmentType, Resident } from '../../types';
import { Drawer } from '../common/Drawer';
import { Modal } from '../common/Modal';

interface ApartmentManagementProps {
  apartments: Apartment[];
  residents: Resident[];
  onUpdateApartmentStatus: (aptId: string, newStatus: ApartmentStatus) => void;
  onAssignResident: (aptCode: string, residentName: string, phone: string, email: string) => void;
  onCreateInvoiceForApt: (aptCode: string, residentName: string, amount: number) => void;
}

export const ApartmentManagement: React.FC<ApartmentManagementProps> = ({
  apartments,
  residents,
  onUpdateApartmentStatus,
  onAssignResident,
  onCreateInvoiceForApt,
}) => {
  // Filters state
  const [searchCode, setSearchCode] = useState('');
  const [selectedFloorRange, setSelectedFloorRange] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Selected apartment for drawer
  const [selectedApartment, setSelectedApartment] = useState<Apartment | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'residents' | 'contract' | 'maintenance' | 'photos'>('info');

  // Quick Action Modals
  const [statusModalApt, setStatusModalApt] = useState<Apartment | null>(null);
  const [newStatusChoice, setNewStatusChoice] = useState<ApartmentStatus>('occupied');

  const [assignModalApt, setAssignModalApt] = useState<Apartment | null>(null);
  const [assignName, setAssignName] = useState('');
  const [assignPhone, setAssignPhone] = useState('');
  const [assignEmail, setAssignEmail] = useState('');

  const [invoiceModalApt, setInvoiceModalApt] = useState<Apartment | null>(null);
  const [invoiceAmount, setInvoiceAmount] = useState(1500000);
  const [invoiceDescription, setInvoiceDescription] = useState('Phí quản lý & dịch vụ vận hành T10/2026');

  // Filter apartments
  const filteredApartments = useMemo(() => {
    return apartments.filter((apt) => {
      // Search code
      if (searchCode && !apt.code.toLowerCase().includes(searchCode.toLowerCase())) {
        return false;
      }
      // Floor filter
      if (selectedFloorRange !== 'all') {
        const floor = apt.floor;
        if (selectedFloorRange === '1-5' && (floor < 1 || floor > 5)) return false;
        if (selectedFloorRange === '6-12' && (floor < 6 || floor > 12)) return false;
        if (selectedFloorRange === '13-20' && (floor < 13 || floor > 20)) return false;
        if (selectedFloorRange === '21+' && floor < 21) return false;
      }
      // Type filter
      if (selectedType !== 'all' && apt.type !== selectedType) {
        return false;
      }
      // Status filter
      if (selectedStatus !== 'all' && apt.status !== selectedStatus) {
        return false;
      }
      return true;
    });
  }, [apartments, searchCode, selectedFloorRange, selectedType, selectedStatus]);

  // Paginated records
  const totalPages = Math.ceil(filteredApartments.length / itemsPerPage) || 1;
  const paginatedApartments = filteredApartments.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const statusBadge = (status: ApartmentStatus) => {
    switch (status) {
      case 'occupied':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Đã có cư dân
          </span>
        );
      case 'vacant':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-200">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Căn hộ trống
          </span>
        );
      case 'maintenance':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            Đang bảo trì
          </span>
        );
      case 'for_sale':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 border border-purple-200">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />
            Đang bán
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Quản Lý Danh Sách Căn Hộ
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý sơ đồ mặt bằng, hiện trạng khai thác, hồ sơ cư dân & lịch sử bảo dưỡng
          </p>
        </div>

        {/* Quick count chips */}
        <div className="flex items-center gap-2">
          <span className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
            Tổng {apartments.length} căn
          </span>
          <span className="rounded-xl bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            {apartments.filter((a) => a.status === 'occupied').length} Đang ở
          </span>
          <span className="rounded-xl bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-800">
            {apartments.filter((a) => a.status === 'vacant').length} Trống
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search by code */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchCode}
              onChange={(e) => {
                setSearchCode(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm mã căn hộ (VD: A-1204)..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Floor filter */}
          <div>
            <select
              value={selectedFloorRange}
              onChange={(e) => {
                setSelectedFloorRange(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả các tầng</option>
              <option value="1-5">Tầng 1 - 5 (Tầng thấp & Shophouse)</option>
              <option value="6-12">Tầng 6 - 12 (Tầng trung)</option>
              <option value="13-20">Tầng 13 - 20 (Tầng cao)</option>
              <option value="21+">Tầng 21+ (Penthouse / Sky Villa)</option>
            </select>
          </div>

          {/* Type filter */}
          <div>
            <select
              value={selectedType}
              onChange={(e) => {
                setSelectedType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả loại căn hộ</option>
              <option value="Studio">Studio</option>
              <option value="1PN">1 Phòng ngủ (1PN)</option>
              <option value="2PN">2 Phòng ngủ (2PN)</option>
              <option value="3PN">3 Phòng ngủ (3PN)</option>
              <option value="Penthouse">Penthouse</option>
              <option value="Shophouse">Shophouse</option>
            </select>
          </div>

          {/* Status filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="occupied">Đã có cư dân / Đã thuê</option>
              <option value="vacant">Trống</option>
              <option value="maintenance">Đang bảo trì</option>
              <option value="for_sale">Đang bán</option>
            </select>
          </div>
        </div>
      </div>

      {/* Apartments Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50/80 font-bold text-slate-600">
              <tr>
                <th className="px-5 py-3.5">Mã Căn Hộ</th>
                <th className="px-4 py-3.5">Tầng / Block</th>
                <th className="px-4 py-3.5">Diện Tích</th>
                <th className="px-4 py-3.5">Loại Căn</th>
                <th className="px-4 py-3.5">Trạng Thái</th>
                <th className="px-4 py-3.5">Cư Dân Hiện Tại</th>
                <th className="px-4 py-3.5">Hợp Đồng</th>
                <th className="px-5 py-3.5 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedApartments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Không tìm thấy căn hộ phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                paginatedApartments.map((apt) => (
                  <tr
                    key={apt.id}
                    className="hover:bg-slate-50/80 transition cursor-pointer"
                    onClick={() => {
                      setSelectedApartment(apt);
                      setActiveTab('info');
                    }}
                  >
                    <td className="px-5 py-4 font-bold text-blue-600">
                      {apt.code}
                    </td>
                    <td className="px-4 py-4 text-slate-700">
                      Tầng {apt.floor} • {apt.block}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-800">
                      {apt.area} m²
                    </td>
                    <td className="px-4 py-4">
                      <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                        {apt.type}
                      </span>
                    </td>
                    <td className="px-4 py-4">{statusBadge(apt.status)}</td>
                    <td className="px-4 py-4">
                      {apt.currentResident ? (
                        <div>
                          <span className="font-semibold text-slate-900 block">
                            {apt.currentResident.name}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {apt.currentResident.phone} • {apt.currentResident.isOwner ? 'Chủ hộ' : 'Khách thuê'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic">Chưa gán cư dân</span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      {apt.contractId ? (
                        <span className="font-mono text-[11px] text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded">
                          {apt.contractId}
                        </span>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td
                      className="px-5 py-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedApartment(apt);
                            setActiveTab('info');
                          }}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setStatusModalApt(apt);
                            setNewStatusChoice(apt.status);
                          }}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 transition"
                          title="Cập nhật trạng thái"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setInvoiceModalApt(apt);
                            setInvoiceAmount(apt.monthlyManagementFee || 1250000);
                          }}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition"
                          title="Tạo hóa đơn"
                        >
                          <Receipt className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => {
                            setAssignModalApt(apt);
                            setAssignName(apt.currentResident?.name || '');
                            setAssignPhone(apt.currentResident?.phone || '');
                            setAssignEmail(apt.currentResident?.email || '');
                          }}
                          className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition"
                          title="Gán cư dân"
                        >
                          <UserPlus className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-3.5 bg-slate-50/50 text-xs text-slate-500">
          <span>
            Hiển thị{' '}
            <strong className="text-slate-800">
              {filteredApartments.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}
            </strong>{' '}
            -{' '}
            <strong className="text-slate-800">
              {Math.min(currentPage * itemsPerPage, filteredApartments.length)}
            </strong>{' '}
            trên tổng <strong className="text-slate-800">{filteredApartments.length}</strong> căn hộ
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-white disabled:opacity-40 transition"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="px-2 font-medium text-slate-700">
              Trang {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-white disabled:opacity-40 transition"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Drawer: Chi tiết Căn Hộ (5 Tabs) */}
      <Drawer
        isOpen={!!selectedApartment}
        onClose={() => setSelectedApartment(null)}
        title={`Hồ Sơ Căn Hộ: ${selectedApartment?.code}`}
        subtitle={`${selectedApartment?.block} • Tầng ${selectedApartment?.floor} • Diện tích ${selectedApartment?.area} m²`}
        width="max-w-3xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (selectedApartment) {
                    setStatusModalApt(selectedApartment);
                    setNewStatusChoice(selectedApartment.status);
                  }
                }}
                className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
              >
                Cập nhật trạng thái
              </button>
              <button
                onClick={() => {
                  if (selectedApartment) {
                    setInvoiceModalApt(selectedApartment);
                    setInvoiceAmount(selectedApartment.monthlyManagementFee);
                  }
                }}
                className="rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
              >
                Lập hóa đơn
              </button>
            </div>
            <button
              onClick={() => setSelectedApartment(null)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
            >
              Đóng hồ sơ
            </button>
          </div>
        }
      >
        {selectedApartment && (
          <div className="space-y-6">
            {/* Status and quick badges */}
            <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Trạng thái:</span>
                {statusBadge(selectedApartment.status)}
              </div>
              <div className="text-xs text-slate-600">
                Phí QL cơ bản:{' '}
                <strong className="text-blue-600">
                  {selectedApartment.monthlyManagementFee.toLocaleString('vi-VN')} đ/tháng
                </strong>
              </div>
            </div>

            {/* 5 Tabs selector */}
            <div className="flex border-b border-slate-200 text-xs font-semibold">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition ${
                  activeTab === 'info'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Home className="h-3.5 w-3.5" />
                Thông tin chung
              </button>
              <button
                onClick={() => setActiveTab('residents')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition ${
                  activeTab === 'residents'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <History className="h-3.5 w-3.5" />
                Lịch sử cư dân ({selectedApartment.residentHistory?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('contract')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition ${
                  activeTab === 'contract'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                Hợp đồng ({selectedApartment.contractId ? 1 : 0})
              </button>
              <button
                onClick={() => setActiveTab('maintenance')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition ${
                  activeTab === 'maintenance'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Wrench className="h-3.5 w-3.5" />
                Lịch sử bảo trì ({selectedApartment.maintenanceHistory?.length || 0})
              </button>
              <button
                onClick={() => setActiveTab('photos')}
                className={`flex items-center gap-1.5 pb-2.5 px-3 border-b-2 transition ${
                  activeTab === 'photos'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <ImageIcon className="h-3.5 w-3.5" />
                Hình ảnh ({selectedApartment.images?.length || 0})
              </button>
            </div>

            {/* Tab 1: Thông tin chung */}
            {activeTab === 'info' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <span className="text-[11px] text-slate-400 block">Mã Căn</span>
                    <span className="text-sm font-bold text-slate-900">{selectedApartment.code}</span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <span className="text-[11px] text-slate-400 block">Vị Trí Tòa Nhà</span>
                    <span className="text-sm font-bold text-slate-900">
                      Tầng {selectedApartment.floor}, {selectedApartment.block}
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <span className="text-[11px] text-slate-400 block">Diện Tích Thông Thủy</span>
                    <span className="text-sm font-bold text-slate-900">{selectedApartment.area} m²</span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <span className="text-[11px] text-slate-400 block">Phòng Ngủ / WC</span>
                    <span className="text-sm font-bold text-slate-900">
                      {selectedApartment.bedrooms} PN / {selectedApartment.bathrooms} WC
                    </span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <span className="text-[11px] text-slate-400 block">Hướng Ban Công</span>
                    <span className="text-sm font-bold text-slate-900">{selectedApartment.direction}</span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <span className="text-[11px] text-slate-400 block">Tình Trạng Nội Thất</span>
                    <span className="text-sm font-bold text-slate-900">{selectedApartment.furnished}</span>
                  </div>
                </div>

                {/* Current resident card */}
                <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4">
                  <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                    Cư Dân Đang Cư Trú
                  </h4>
                  {selectedApartment.currentResident ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="text-sm font-bold text-slate-900">
                          {selectedApartment.currentResident.name}
                        </div>
                        <div className="text-xs text-slate-500">
                          SĐT: {selectedApartment.currentResident.phone} • Email:{' '}
                          {selectedApartment.currentResident.email}
                        </div>
                      </div>
                      <span className="rounded-lg bg-blue-100 text-blue-700 px-2.5 py-1 text-xs font-semibold">
                        {selectedApartment.currentResident.isOwner ? 'Chủ sở hữu' : 'Khách thuê hợp đồng'}
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 flex items-center justify-between">
                      <span>Căn hộ hiện đang để trống, chưa có cư dân dọn vào.</span>
                      <button
                        onClick={() => {
                          setAssignModalApt(selectedApartment);
                        }}
                        className="text-xs font-semibold text-blue-600 hover:underline"
                      >
                        Gán cư dân ngay
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Lịch sử cư dân */}
            {activeTab === 'residents' && (
              <div className="space-y-3">
                {selectedApartment.residentHistory && selectedApartment.residentHistory.length > 0 ? (
                  selectedApartment.residentHistory.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-900">{item.residentName}</div>
                        <div className="text-[11px] text-slate-500">
                          SĐT: {item.phone} • Vai trò: {item.role}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">
                          Thời gian: Từ {item.startDate} {item.endDate ? `đến ${item.endDate}` : '(Hiện tại)'}
                        </div>
                      </div>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                          item.active
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.active ? 'Đang ở' : 'Đã chuyển đi'}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Chưa có lịch sử lưu chuyển cư dân trước đó.
                  </div>
                )}
              </div>
            )}

            {/* Tab 3: Hợp đồng */}
            {activeTab === 'contract' && (
              <div className="space-y-3">
                {selectedApartment.contractId ? (
                  <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[11px] font-mono text-slate-400 block">Số hiệu hợp đồng</span>
                        <span className="text-sm font-bold text-blue-700">{selectedApartment.contractId}</span>
                      </div>
                      <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                        Đang hiệu lực
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-slate-400 block">Thời hạn hợp đồng:</span>
                        <span className="font-semibold text-slate-800">
                          Đến hết ngày {selectedApartment.contractExpiry || '2027-12-31'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Người ký kết:</span>
                        <span className="font-semibold text-slate-800">
                          {selectedApartment.currentResident?.name || 'Nguyễn Văn Minh'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Căn hộ chưa phát sinh hợp đồng mua bán hoặc cho thuê được số hóa.
                  </div>
                )}
              </div>
            )}

            {/* Tab 4: Lịch sử bảo trì */}
            {activeTab === 'maintenance' && (
              <div className="space-y-3">
                {selectedApartment.maintenanceHistory && selectedApartment.maintenanceHistory.length > 0 ? (
                  selectedApartment.maintenanceHistory.map((item) => (
                    <div key={item.id} className="rounded-xl border border-slate-200 p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{item.title}</span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                            item.status === 'Đã hoàn thành'
                              ? 'bg-emerald-100 text-emerald-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600">{item.notes}</p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                        <span>Kỹ thuật: {item.technician}</span>
                        <span>
                          Ngày: {item.date} • Chi phí:{' '}
                          <strong className="text-slate-700">{item.cost.toLocaleString('vi-VN')} đ</strong>
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Căn hộ chưa có sự cố kỹ thuật nào phải bảo trì.
                  </div>
                )}
              </div>
            )}

            {/* Tab 5: Hình ảnh & Mặt bằng */}
            {activeTab === 'photos' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {selectedApartment.images && selectedApartment.images.length > 0 ? (
                  selectedApartment.images.map((img, idx) => (
                    <div key={idx} className="rounded-xl overflow-hidden border border-slate-200 shadow-sm">
                      <img
                        src={img}
                        alt={`Ảnh căn hộ ${selectedApartment.code}`}
                        className="w-full h-48 object-cover hover:scale-105 transition duration-300"
                      />
                      <div className="p-2 text-[11px] text-slate-500 bg-slate-50">
                        Ảnh thực tế căn hộ {selectedApartment.code} ({idx + 1})
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center py-8 text-xs text-slate-400">
                    Chưa tải ảnh hiện trạng căn hộ.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Modal: Cập nhật trạng thái căn hộ */}
      <Modal
        isOpen={!!statusModalApt}
        onClose={() => setStatusModalApt(null)}
        title={`Cập Nhật Trạng Thái Căn Hộ ${statusModalApt?.code}`}
        footer={
          <>
            <button
              onClick={() => setStatusModalApt(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (statusModalApt) {
                  onUpdateApartmentStatus(statusModalApt.id, newStatusChoice);
                  setStatusModalApt(null);
                }
              }}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Lưu thay đổi
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-xs text-slate-600">
            Chọn trạng thái mới để cập nhật tình trạng vận hành và đồng bộ dữ liệu vào hệ thống:
          </p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'occupied', label: 'Đã có cư dân / Đã thuê', desc: 'Có hợp đồng thuê hoặc chủ nhà đang ở' },
              { id: 'vacant', label: 'Căn hộ trống', desc: 'Sẵn sàng bàn giao hoặc tiếp nhận khách thuê mới' },
              { id: 'maintenance', label: 'Đang bảo trì', desc: 'Đang sửa chữa hư hỏng kỹ thuật hoặc sơn sửa' },
              { id: 'for_sale', label: 'Đang bán', desc: 'Căn hộ chào bán hoặc sang nhượng trên sàn' },
            ].map((opt) => (
              <div
                key={opt.id}
                onClick={() => setNewStatusChoice(opt.id as ApartmentStatus)}
                className={`cursor-pointer rounded-xl border p-3 transition ${
                  newStatusChoice === opt.id
                    ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="font-bold text-xs text-slate-900">{opt.label}</div>
                <div className="text-[11px] text-slate-500 mt-1">{opt.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Modal: Gán cư dân vào căn hộ */}
      <Modal
        isOpen={!!assignModalApt}
        onClose={() => setAssignModalApt(null)}
        title={`Gán Cư Dân Vào Căn Hộ ${assignModalApt?.code}`}
        footer={
          <>
            <button
              onClick={() => setAssignModalApt(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (assignModalApt && assignName && assignPhone) {
                  onAssignResident(assignModalApt.code, assignName, assignPhone, assignEmail);
                  setAssignModalApt(null);
                }
              }}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
            >
              Xác nhận gán cư dân
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Họ và tên cư dân *</label>
            <input
              type="text"
              value={assignName}
              onChange={(e) => setAssignName(e.target.value)}
              placeholder="VD: Nguyễn Văn An"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Số điện thoại *</label>
            <input
              type="text"
              value={assignPhone}
              onChange={(e) => setAssignPhone(e.target.value)}
              placeholder="VD: 0908 123 456"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email</label>
            <input
              type="email"
              value={assignEmail}
              onChange={(e) => setAssignEmail(e.target.value)}
              placeholder="VD: an.nguyen@example.com"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Tạo hóa đơn nhanh cho căn hộ */}
      <Modal
        isOpen={!!invoiceModalApt}
        onClose={() => setInvoiceModalApt(null)}
        title={`Tạo Hóa Đơn Thu Phí Căn Hộ ${invoiceModalApt?.code}`}
        footer={
          <>
            <button
              onClick={() => setInvoiceModalApt(null)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (invoiceModalApt) {
                  onCreateInvoiceForApt(
                    invoiceModalApt.code,
                    invoiceModalApt.currentResident?.name || 'Cư dân căn hộ',
                    invoiceAmount
                  );
                  setInvoiceModalApt(null);
                }
              }}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
            >
              Phát hành hóa đơn
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Kỳ thu phí</label>
            <input
              type="text"
              readOnly
              value="Tháng 10/2026"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs text-slate-800 font-semibold"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Nội dung khoản thu</label>
            <input
              type="text"
              value={invoiceDescription}
              onChange={(e) => setInvoiceDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Số tiền phải thu (VNĐ) *</label>
            <input
              type="number"
              value={invoiceAmount}
              onChange={(e) => setInvoiceAmount(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 font-bold text-emerald-700 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
