import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  Mail,
  Phone,
  Car,
  KeyRound,
  Shield,
  CreditCard,
  MessageSquare,
  Lock,
  ChevronRight,
  Eye,
  Send,
} from 'lucide-react';
import { Resident, Contract, Invoice, Complaint } from '../../types';
import { Drawer } from '../common/Drawer';
import { Modal } from '../common/Modal';

interface ResidentManagementProps {
  residents: Resident[];
  contracts: Contract[];
  invoices: Invoice[];
  complaints: Complaint[];
  onActivateResident: (resId: string) => void;
  onAddNewResident: (newRes: Partial<Resident>) => void;
}

export const ResidentManagement: React.FC<ResidentManagementProps> = ({
  residents,
  contracts,
  invoices,
  complaints,
  onActivateResident,
  onAddNewResident,
}) => {
  const [topTab, setTopTab] = useState<'residents' | 'active_contracts' | 'expiring_contracts'>('residents');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected resident drawer
  const [selectedResident, setSelectedResident] = useState<Resident | null>(null);
  const [residentDetailTab, setResidentDetailTab] = useState<'info' | 'contracts' | 'payments' | 'complaints' | 'notes'>('info');

  // Activate resident modal
  const [showActivateModal, setShowActivateModal] = useState(false);
  const [formName, setFormName] = useState('');
  const [formApt, setFormApt] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formIdCard, setFormIdCard] = useState('');
  const [formRole, setFormRole] = useState<'Chủ hộ' | 'Khách thuê' | 'Thành viên'>('Chủ hộ');
  const [activationSent, setActivationSent] = useState(false);

  // Filter residents
  const filteredResidents = residents.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.apartmentCode.toLowerCase().includes(q) ||
      r.phone.includes(q) ||
      r.email.toLowerCase().includes(q)
    );
  });

  // Filter active and expiring contracts
  const activeContractsList = contracts.filter((c) => c.status === 'active');
  const expiringContractsList = contracts.filter((c) => c.status === 'expiring_soon');

  const statusBadge = (status: Resident['status']) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Đã kích hoạt App
          </span>
        );
      case 'pending_activation':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            Chờ kích hoạt
          </span>
        );
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
            <Lock className="h-3 w-3" />
            Tạm khóa
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
            Quản Lý Cư Dân & Hợp Đồng
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Cấp quyền tài khoản số, giám sát hợp đồng sở hữu/cho thuê & quyền lợi tiện ích tòa nhà
          </p>
        </div>

        <button
          onClick={() => {
            setShowActivateModal(true);
            setActivationSent(false);
          }}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
        >
          <UserPlus className="h-4 w-4" />
          <span>Kích hoạt cư dân mới</span>
        </button>
      </div>

      {/* 3 Main Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-2">
        <button
          onClick={() => setTopTab('residents')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
            topTab === 'residents'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Danh Sách Cư Dân ({residents.length})</span>
        </button>

        <button
          onClick={() => setTopTab('active_contracts')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
            topTab === 'active_contracts'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>Hợp Đồng Đang Hiệu Lực ({activeContractsList.length})</span>
        </button>

        <button
          onClick={() => setTopTab('expiring_contracts')}
          className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
            topTab === 'expiring_contracts'
              ? 'border-amber-600 text-amber-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <AlertCircle className="h-4 w-4" />
          <span>Hợp Đồng Sắp Hết Hạn ({expiringContractsList.length})</span>
          {expiringContractsList.length > 0 && (
            <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 text-[10px]">
              Cần gia hạn
            </span>
          )}
        </button>
      </div>

      {/* Tab 1: Danh sách cư dân */}
      {topTab === 'residents' && (
        <div className="space-y-4">
          {/* Search bar */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm flex items-center justify-between">
            <div className="relative w-80 max-w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm họ tên, căn hộ, SĐT, email..."
                className="w-full rounded-xl border border-slate-200 py-1.5 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div className="text-xs text-slate-500">
              Có <strong>{filteredResidents.length}</strong> cư dân trong hệ thống
            </div>
          </div>

          {/* Resident Table */}
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
                  <tr>
                    <th className="px-5 py-3.5">Họ Và Tên</th>
                    <th className="px-4 py-3.5">Căn Hộ</th>
                    <th className="px-4 py-3.5">Số Điện Thoại</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Vai Trò</th>
                    <th className="px-4 py-3.5">Trạng Thái Tài Khoản</th>
                    <th className="px-4 py-3.5">Ngày Vào Ở</th>
                    <th className="px-5 py-3.5 text-right">Hành Động</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredResidents.map((res) => (
                    <tr
                      key={res.id}
                      onClick={() => {
                        setSelectedResident(res);
                        setResidentDetailTab('info');
                      }}
                      className="hover:bg-slate-50/80 cursor-pointer transition"
                    >
                      <td className="px-5 py-4 font-bold text-slate-900">{res.name}</td>
                      <td className="px-4 py-4 font-semibold text-blue-600">{res.apartmentCode}</td>
                      <td className="px-4 py-4 text-slate-700 font-mono">{res.phone}</td>
                      <td className="px-4 py-4 text-slate-500">{res.email}</td>
                      <td className="px-4 py-4">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {res.role}
                        </span>
                      </td>
                      <td className="px-4 py-4">{statusBadge(res.status)}</td>
                      <td className="px-4 py-4 text-slate-600">{res.moveInDate}</td>
                      <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedResident(res);
                              setResidentDetailTab('info');
                            }}
                            className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition"
                            title="Xem hồ sơ"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {res.status === 'pending_activation' && (
                            <button
                              onClick={() => onActivateResident(res.id)}
                              className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                            >
                              Kích hoạt
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Hợp đồng đang hiệu lực */}
      {topTab === 'active_contracts' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-5 py-3.5">Mã Hợp Đồng</th>
                <th className="px-4 py-3.5">Căn Hộ</th>
                <th className="px-4 py-3.5">Đại Diện Ký</th>
                <th className="px-4 py-3.5">Loại Hợp Đồng</th>
                <th className="px-4 py-3.5">Thời Hạn</th>
                <th className="px-4 py-3.5">Giá Thuê / Giá Trị</th>
                <th className="px-4 py-3.5">Tiền Cọc</th>
                <th className="px-4 py-3.5">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {activeContractsList.map((con) => (
                <tr key={con.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4 font-mono font-bold text-blue-600">{con.contractNumber}</td>
                  <td className="px-4 py-4 font-semibold text-slate-900">{con.apartmentCode}</td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-800 block">{con.residentName}</span>
                    <span className="text-[10px] text-slate-400">{con.residentPhone}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{con.type}</td>
                  <td className="px-4 py-4 text-slate-600">
                    {con.startDate} → <strong>{con.endDate}</strong>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900">
                    {con.monthlyRent ? `${con.monthlyRent.toLocaleString('vi-VN')} đ/tháng` : 'Sở hữu'}
                  </td>
                  <td className="px-4 py-4 text-slate-600">
                    {con.deposit ? `${con.deposit.toLocaleString('vi-VN')} đ` : '—'}
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                      Hiệu lực
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 3: Hợp đồng sắp hết hạn */}
      {topTab === 'expiring_contracts' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-amber-50 p-3.5 text-xs text-amber-800 border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 shrink-0" />
              <span>
                Các hợp đồng dưới đây sẽ hết hạn trong vòng <strong>45 ngày tới</strong>. Ban Quản trị cần liên hệ cư dân để chuẩn bị thủ tục tái ký hoặc bàn giao căn hộ.
              </span>
            </div>
            <button className="rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-700 transition">
              Gửi thông báo gia hạn hàng loạt
            </button>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
                <tr>
                  <th className="px-5 py-3.5">Mã Hợp Đồng</th>
                  <th className="px-4 py-3.5">Căn Hộ</th>
                  <th className="px-4 py-3.5">Khách Thuê</th>
                  <th className="px-4 py-3.5">Ngày Hết Hạn</th>
                  <th className="px-4 py-3.5">Giá Thuê</th>
                  <th className="px-4 py-3.5">Hành Động Khuyến Nghị</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {expiringContractsList.map((con) => (
                  <tr key={con.id} className="hover:bg-slate-50 transition">
                    <td className="px-5 py-4 font-mono font-bold text-amber-700">{con.contractNumber}</td>
                    <td className="px-4 py-4 font-bold text-slate-900">{con.apartmentCode}</td>
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{con.residentName}</div>
                      <div className="text-[10px] text-slate-400">{con.residentPhone}</div>
                    </td>
                    <td className="px-4 py-4 text-rose-600 font-bold">{con.endDate}</td>
                    <td className="px-4 py-4 font-semibold text-slate-800">
                      {con.monthlyRent?.toLocaleString('vi-VN')} đ/tháng
                    </td>
                    <td className="px-4 py-4">
                      <button className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100 transition">
                        Gửi mẫu gia hạn
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Drawer: Chi tiết hồ sơ cư dân */}
      <Drawer
        isOpen={!!selectedResident}
        onClose={() => setSelectedResident(null)}
        title={`Hồ Sơ Cư Dân: ${selectedResident?.name}`}
        subtitle={`Căn hộ: ${selectedResident?.apartmentCode} • Vai trò: ${selectedResident?.role}`}
        width="max-w-2xl"
      >
        {selectedResident && (
          <div className="space-y-6">
            {/* Top Navigation in Drawer */}
            <div className="flex border-b border-slate-200 text-xs font-semibold gap-1">
              <button
                onClick={() => setResidentDetailTab('info')}
                className={`pb-2.5 px-3 border-b-2 transition ${
                  residentDetailTab === 'info'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Thông tin cá nhân
              </button>
              <button
                onClick={() => setResidentDetailTab('contracts')}
                className={`pb-2.5 px-3 border-b-2 transition ${
                  residentDetailTab === 'contracts'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Hợp đồng & Xe
              </button>
              <button
                onClick={() => setResidentDetailTab('payments')}
                className={`pb-2.5 px-3 border-b-2 transition ${
                  residentDetailTab === 'payments'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Thanh toán
              </button>
              <button
                onClick={() => setResidentDetailTab('complaints')}
                className={`pb-2.5 px-3 border-b-2 transition ${
                  residentDetailTab === 'complaints'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Khiếu nại
              </button>
              <button
                onClick={() => setResidentDetailTab('notes')}
                className={`pb-2.5 px-3 border-b-2 transition ${
                  residentDetailTab === 'notes'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-500'
                }`}
              >
                Ghi chú nội bộ
              </button>
            </div>

            {/* Tab: Thông tin cá nhân */}
            {residentDetailTab === 'info' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/60">
                    <span className="text-[11px] text-slate-400 block">Số CMND / CCCD</span>
                    <span className="font-bold text-slate-900 font-mono">{selectedResident.idCard}</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/60">
                    <span className="text-[11px] text-slate-400 block">Số Điện Thoại</span>
                    <span className="font-bold text-slate-900 font-mono">{selectedResident.phone}</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/60">
                    <span className="text-[11px] text-slate-400 block">Hộp Thư Email</span>
                    <span className="font-bold text-slate-900">{selectedResident.email}</span>
                  </div>
                  <div className="rounded-xl border border-slate-200 p-3 bg-slate-50/60">
                    <span className="text-[11px] text-slate-400 block">Ngày Vào Cư Trú</span>
                    <span className="font-bold text-slate-900">{selectedResident.moveInDate}</span>
                  </div>
                </div>

                {/* Status card */}
                <div className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block">Tài khoản ứng dụng cư dân</span>
                    <span className="text-[11px] text-slate-400">
                      Cho phép cư dân nhận thông báo, mở thẻ từ thang máy và thanh toán QR
                    </span>
                  </div>
                  {statusBadge(selectedResident.status)}
                </div>
              </div>
            )}

            {/* Tab: Hợp đồng & Phương tiện */}
            {residentDetailTab === 'contracts' && (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 mb-2">Phương tiện đăng ký gửi tại hầm</h4>
                  <div className="space-y-2">
                    {selectedResident.vehicles && selectedResident.vehicles.length > 0 ? (
                      selectedResident.vehicles.map((v, i) => (
                        <div key={i} className="flex items-center justify-between rounded-xl border border-slate-200 p-3">
                          <div className="flex items-center gap-2">
                            <Car className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-slate-900">{v.type}</span>
                          </div>
                          <span className="font-mono font-bold bg-slate-100 px-2.5 py-1 rounded text-slate-800">
                            {v.plate}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-slate-400">Chưa đăng ký phương tiện</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Lịch sử thanh toán */}
            {residentDetailTab === 'payments' && (
              <div className="space-y-3 text-xs">
                {invoices.filter((i) => i.apartmentCode === selectedResident.apartmentCode).map((inv) => (
                  <div key={inv.id} className="rounded-xl border border-slate-200 p-3.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">{inv.month} - {inv.invoiceCode}</div>
                      <div className="text-[11px] text-slate-400">Hạn nộp: {inv.dueDate}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-slate-900">{inv.totalAmount.toLocaleString('vi-VN')} đ</div>
                      <span className={`text-[10px] font-bold ${inv.status === 'paid' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {inv.status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Tab: Khiếu nại đã gửi */}
            {residentDetailTab === 'complaints' && (
              <div className="space-y-3 text-xs">
                {complaints.filter((c) => c.apartmentCode === selectedResident.apartmentCode).length === 0 ? (
                  <div className="text-center py-8 text-slate-400">Cư dân chưa có khiếu nại nào</div>
                ) : (
                  complaints
                    .filter((c) => c.apartmentCode === selectedResident.apartmentCode)
                    .map((c) => (
                      <div key={c.id} className="rounded-xl border border-slate-200 p-3">
                        <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                          <span>{c.title}</span>
                          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded">{c.status}</span>
                        </div>
                        <p className="text-slate-500 text-[11px]">{c.description}</p>
                      </div>
                    ))
                )}
              </div>
            )}

            {/* Tab: Ghi chú nội bộ */}
            {residentDetailTab === 'notes' && (
              <div className="space-y-3 text-xs">
                <div className="rounded-xl bg-amber-50/70 p-4 border border-amber-200">
                  <h4 className="font-bold text-amber-900 mb-2">Ghi chú của Ban Quản trị / Lễ tân:</h4>
                  <p className="text-slate-700 leading-relaxed">
                    {selectedResident.internalNotes || 'Chưa có ghi chú đặc biệt cho hồ sơ cư dân này.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Modal: Kích hoạt cư dân */}
      <Modal
        isOpen={showActivateModal}
        onClose={() => setShowActivateModal(false)}
        title="Kích Hoạt Tài Khoản Cư Dân Mới"
        footer={
          <>
            <button
              onClick={() => setShowActivateModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </button>
            {!activationSent ? (
              <button
                onClick={() => {
                  if (formName && formApt && formPhone) {
                    onAddNewResident({
                      name: formName,
                      apartmentCode: formApt,
                      phone: formPhone,
                      email: formEmail,
                      idCard: formIdCard || '079099887766',
                      role: formRole,
                      status: 'active',
                      moveInDate: new Date().toISOString().split('T')[0],
                      vehicles: [],
                    });
                    setActivationSent(true);
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                <Send className="h-3.5 w-3.5" />
                Gửi mã & Kích hoạt ngay
              </button>
            ) : (
              <button
                onClick={() => setShowActivateModal(false)}
                className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white"
              >
                Hoàn tất
              </button>
            )}
          </>
        }
      >
        {!activationSent ? (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mã căn hộ *</label>
                <input
                  type="text"
                  value={formApt}
                  onChange={(e) => setFormApt(e.target.value)}
                  placeholder="VD: A-1204"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Vai trò trong căn hộ</label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                >
                  <option value="Chủ hộ">Chủ hộ</option>
                  <option value="Khách thuê">Khách thuê</option>
                  <option value="Thành viên">Thành viên gia đình</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Họ và tên cư dân *</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="VD: Trần Đình Khang"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số điện thoại *</label>
                <input
                  type="text"
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  placeholder="VD: 0918 889 999"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Số CCCD / Hộ chiếu</label>
                <input
                  type="text"
                  value={formIdCard}
                  onChange={(e) => setFormIdCard(e.target.value)}
                  placeholder="079099887766"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email nhận thông báo</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="khang.tran@gmail.com"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Kích Hoạt Tài Khoản Thành Công!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hệ thống đã gửi mã OTP và đường link tải ứng dụng Cổng Cư Dân đến số điện thoại <strong>{formPhone}</strong> và email <strong>{formEmail || 'cư dân'}</strong>.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
