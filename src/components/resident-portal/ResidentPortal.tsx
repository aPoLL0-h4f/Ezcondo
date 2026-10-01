import React, { useState } from 'react';
import {
  Home,
  Receipt,
  FileText,
  AlertTriangle,
  User,
  Coffee,
  CheckCircle2,
  Bell,
  MessageCircle,
  Car,
} from 'lucide-react';
import {
  TenantCondo,
  Invoice,
  Complaint,
  Contract,
  FacilityBooking,
} from '../../types';
import { ANNOUNCEMENTS } from '../../data/mockData';
import { Modal } from '../common/Modal';

interface ResidentPortalProps {
  currentTenant: TenantCondo;
  invoices: Invoice[];
  complaints: Complaint[];
  contracts: Contract[];
  bookings: FacilityBooking[];
  onPayInvoice: (invId: string, method: string) => void;
  onCreateComplaint: (comp: Partial<Complaint>) => void;
  onBookFacility: (booking: Partial<FacilityBooking>) => void;
  onOpenAIChat: () => void;
}

export const ResidentPortal: React.FC<ResidentPortalProps> = ({
  currentTenant,
  invoices,
  complaints,
  contracts,
  bookings,
  onPayInvoice,
  onCreateComplaint,
  onBookFacility,
  onOpenAIChat,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'billing' | 'contract' | 'complaint' | 'facilities' | 'profile'>('home');

  const myApartmentCode = 'A-1204';
  const myResidentName = 'Nguyễn Văn Minh';
  const myPhone = '0908 123 456';

  const myInvoices = invoices.filter((i) => i.apartmentCode === myApartmentCode);
  const myUnpaidInvoices = myInvoices.filter((i) => i.status !== 'paid');
  const myComplaints = complaints.filter((c) => c.apartmentCode === myApartmentCode);
  const myContracts = contracts.filter((c) => c.apartmentCode === myApartmentCode);

  // Quick Pay Modal
  const [payingInv, setPayingInv] = useState<Invoice | null>(null);
  const [paySuccess, setPaySuccess] = useState(false);

  // New Complaint Modal
  const [showComplaintModal, setShowComplaintModal] = useState(false);
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintCategory, setComplaintCategory] = useState<Complaint['category']>('Kỹ thuật - Nước');
  const [complaintDesc, setComplaintDesc] = useState('');

  // Facility Booking Modal
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingFacility, setBookingFacility] = useState<FacilityBooking['facilityName']>('Khu tiệc nướng BBQ');
  const [bookingDate, setBookingDate] = useState('2026-10-04');
  const [bookingTimeSlot, setBookingTimeSlot] = useState('18:00 - 21:00');
  const [guestCount, setGuestCount] = useState(6);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Resident Welcome Banner - Warm, Friendly, Premium */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-900">{currentTenant.name}</span>
              <span aria-hidden="true">·</span>
              <span>Căn hộ {myApartmentCode}</span>
              <span aria-hidden="true">·</span>
              <span>Chủ hộ: {myResidentName}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Xin chào, anh Minh!
            </h1>
            <p className="text-xs text-slate-500">
              Cổng dịch vụ cư dân trực tuyến: tra cứu hóa đơn, gửi yêu cầu kỹ thuật và đăng ký tiện ích tòa nhà.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAIChat}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              <MessageCircle className="h-4 w-4 text-blue-700" />
              <span>Hỏi đáp quy định & dịch vụ 24/7</span>
            </button>
            <button
              onClick={() => setShowComplaintModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition"
            >
              <AlertTriangle className="h-4 w-4" />
              <span>Báo sự cố kỹ thuật</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Sub-Menu for Resident */}
      <div className="flex overflow-x-auto border-b border-slate-200 text-xs font-semibold gap-1">
        {[
          { id: 'home', label: 'Trang chủ cư dân', icon: Home },
          { id: 'billing', label: `Hóa đơn (${myUnpaidInvoices.length > 0 ? myUnpaidInvoices.length + ' cần đóng' : 'Đã thanh toán'})`, icon: Receipt },
          { id: 'contract', label: 'Hợp đồng & Thẻ xe', icon: FileText },
          { id: 'complaint', label: `Sự cố & Khiếu nại (${myComplaints.length})`, icon: AlertTriangle },
          { id: 'facilities', label: 'Tiện ích tòa nhà', icon: Coffee },
          { id: 'profile', label: 'Thông tin căn hộ', icon: User },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-3 py-2.5 border-b-2 whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'border-blue-700 text-blue-800 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: Trang chủ cư dân */}
      {activeTab === 'home' && (
        <div className="space-y-6">
          {/* Quick Notice: Unpaid Invoice Notice */}
          {myUnpaidInvoices.length > 0 && (
            <div className="rounded-xl border border-rose-200 bg-rose-50/60 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-xs text-rose-900">
                  Thông báo cước phí dịch vụ kỳ {myUnpaidInvoices[0].month}
                </h3>
                <p className="text-xs text-rose-700 mt-0.5">
                  Số tiền: <strong>{myUnpaidInvoices[0].totalAmount.toLocaleString('vi-VN')} đ</strong> • Hạn thanh toán đến ngày {myUnpaidInvoices[0].dueDate}
                </p>
              </div>
              <button
                onClick={() => {
                  setPayingInv(myUnpaidInvoices[0]);
                  setPaySuccess(false);
                }}
                className="rounded-lg bg-rose-600 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-700 whitespace-nowrap"
              >
                Thanh toán qua VietQR
              </button>
            </div>
          )}

          {/* 3 Widgets Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Widget 1: Thông báo */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Bell className="h-4 w-4 text-slate-600" />
                  <span>Bảng Tin Chung Cư</span>
                </div>
                <span className="text-[11px] text-slate-400">Ban Quản lý</span>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {ANNOUNCEMENTS.map((item) => (
                  <div key={item.id} className="rounded-lg bg-slate-50 p-2.5 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="font-medium text-slate-700">{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                    <h4 className="font-semibold text-xs text-slate-900">{item.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2">{item.content}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Widget 2: Sự cố */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <AlertTriangle className="h-4 w-4 text-slate-600" />
                  <span>Sự Cố Căn Hộ Đang Xử Lý</span>
                </div>
                <button
                  onClick={() => setShowComplaintModal(true)}
                  className="text-xs text-blue-700 font-semibold hover:underline"
                >
                  + Báo mới
                </button>
              </div>
              <div className="space-y-2.5">
                {myComplaints.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Không có sự cố nào đang ghi nhận
                  </div>
                ) : (
                  myComplaints.map((c) => (
                    <div key={c.id} className="rounded-lg border border-slate-200 p-2.5 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800">{c.category}</span>
                        <span className="text-[10px] text-blue-700 font-medium">
                          {c.status === 'in_progress' ? 'Đang xử lý' : c.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 line-clamp-1">{c.title}</p>
                      <div className="text-[11px] text-slate-400 flex justify-between pt-1 border-t border-slate-100">
                        <span>Phụ trách: {c.assignedTo || 'Kỹ thuật tòa nhà'}</span>
                        <span>{c.createdAt.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Widget 3: Tiện ích */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Coffee className="h-4 w-4 text-slate-600" />
                  <span>Tiện Ích Đã Đặt</span>
                </div>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="text-xs text-blue-700 font-semibold hover:underline"
                >
                  + Đặt lịch
                </button>
              </div>
              <div className="space-y-2.5">
                {bookings.filter((b) => b.apartmentCode === myApartmentCode).map((bk) => (
                  <div key={bk.id} className="rounded-lg bg-slate-50 border border-slate-200 p-2.5 space-y-1 text-xs">
                    <div className="flex items-center justify-between font-semibold text-slate-900">
                      <span>{bk.facilityName}</span>
                      <span className="text-[10px] text-emerald-700">{bk.status}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">
                      Ngày {bk.bookingDate} ({bk.timeSlot})
                    </div>
                    <div className="text-[11px] text-slate-400">Số khách: {bk.guestCount} người</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Hóa đơn & Lịch sử thanh toán */}
      {activeTab === 'billing' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm p-6 space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Lịch Sử Cước Phí & Hóa Đơn Căn Hộ {myApartmentCode}</h3>
          <div className="space-y-3">
            {myInvoices.map((inv) => (
              <div
                key={inv.id}
                className="rounded-lg border border-slate-200 p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">{inv.invoiceCode}</span>
                    <span className="text-xs text-slate-500">Kỳ {inv.month}</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Hạn nộp: {inv.dueDate}
                  </div>
                  <div className="text-sm font-bold text-slate-900 mt-1">
                    {inv.totalAmount.toLocaleString('vi-VN')} đ
                  </div>
                </div>

                <div>
                  {inv.status === 'paid' ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1 rounded border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Đã thanh toán ({inv.paidDate})
                    </span>
                  ) : (
                    <button
                      onClick={() => {
                        setPayingInv(inv);
                        setPaySuccess(false);
                      }}
                      className="rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
                    >
                      Thanh toán VietQR
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Hợp đồng & Thẻ xe */}
      {activeTab === 'contract' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Thông Tin Hợp Đồng Căn Hộ</h3>
            {myContracts.map((c) => (
              <div key={c.id} className="rounded-lg border border-slate-200 p-3.5 bg-slate-50 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{c.contractNumber}</span>
                  <span className="text-emerald-700 font-semibold">Đang hiệu lực</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>Loại hợp đồng: <strong>{c.type}</strong></div>
                  <div>Thời hạn: <strong>{c.startDate} đến {c.endDate}</strong></div>
                  <div>Người đứng tên: <strong>{c.residentName}</strong></div>
                  <div>Số điện thoại: <strong>{c.residentPhone}</strong></div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Phương Tiện Đăng Ký Thẻ Từ Tầng Hầm</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-lg border border-slate-200 p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 block">Ô tô Mazda CX-5</span>
                  <span className="text-[11px] text-slate-400">Mã thẻ: RF-CAR-90812</span>
                </div>
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  51K-892.34
                </span>
              </div>
              <div className="rounded-lg border border-slate-200 p-3 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-900 block">Xe máy Honda SH</span>
                  <span className="text-[11px] text-slate-400">Mã thẻ: RF-MOTO-4821</span>
                </div>
                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
                  59P1-482.19
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Khiếu nại */}
      {activeTab === 'complaint' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900">Sự Cố & Yêu Cầu Hỗ Trợ Đã Gửi</h3>
            <button
              onClick={() => setShowComplaintModal(true)}
              className="rounded-lg bg-blue-700 px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
            >
              + Gửi yêu cầu mới
            </button>
          </div>

          <div className="space-y-3">
            {myComplaints.map((c) => (
              <div key={c.id} className="rounded-lg border border-slate-200 p-3.5 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-sm">{c.title}</span>
                  <span className="text-[11px] font-medium text-slate-500">{c.status}</span>
                </div>
                <p className="text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-100">
                  {c.description}
                </p>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Mã phiếu: {c.ticketCode}</span>
                  <span>Gửi lúc: {c.createdAt}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Đặt tiện ích */}
      {activeTab === 'facilities' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {[
              {
                name: 'Khu tiệc nướng BBQ ngoài trời',
                hours: '17:00 - 21:30',
                cost: 'Miễn phí cư dân (đặt trước 6h)',
                img: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Hồ bơi tràn viền Sky Pool Tầng 5',
                hours: '06:00 - 21:30',
                cost: 'Miễn phí sử dụng bằng thẻ từ',
                img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Phòng tập Gym & Yoga',
                hours: '24/7 hàng ngày',
                cost: 'Trang thiết bị hiện đại',
                img: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80',
              },
              {
                name: 'Sân Tennis',
                hours: '06:00 - 22:00',
                cost: 'Tiêu chuẩn thi đấu',
                img: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=600&q=80',
              },
            ].map((fac, i) => (
              <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm flex flex-col justify-between">
                <div>
                  <img src={fac.img} alt={fac.name} className="h-32 w-full object-cover" />
                  <div className="p-3 space-y-1">
                    <h4 className="font-bold text-slate-900 text-xs">{fac.name}</h4>
                    <p className="text-[11px] text-slate-500">Giờ mở cửa: {fac.hours}</p>
                    <p className="text-[11px] text-slate-700">{fac.cost}</p>
                  </div>
                </div>
                <div className="p-3 pt-0">
                  <button
                    onClick={() => {
                      setBookingFacility(fac.name as any);
                      setShowBookingModal(true);
                      setBookingSuccess(false);
                    }}
                    className="w-full rounded-lg bg-blue-700 py-1.5 text-xs font-semibold text-white hover:bg-blue-800 transition"
                  >
                    Đăng ký sử dụng
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: Thông tin cá nhân */}
      {activeTab === 'profile' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900">Hồ Sơ Căn Hộ {myApartmentCode}</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Chủ hộ đại diện</span>
              <span className="font-bold text-slate-900 text-sm">{myResidentName}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Số điện thoại liên hệ</span>
              <span className="font-bold text-slate-900 text-sm font-mono">{myPhone}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Vị trí</span>
              <span className="font-bold text-slate-900 text-sm">Tháp A • Tầng 12</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[11px]">Diện tích</span>
              <span className="font-bold text-slate-900 text-sm">78.5 m² (2 Phòng ngủ)</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Thanh toán nhanh VietQR */}
      <Modal
        isOpen={!!payingInv}
        onClose={() => setPayingInv(null)}
        title="Thanh Toán Cước Phí Dịch Vụ"
        maxWidth="max-w-md"
        footer={
          !paySuccess ? (
            <div className="flex justify-between w-full">
              <button
                onClick={() => setPayingInv(null)}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs text-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  if (payingInv) {
                    onPayInvoice(payingInv.id, 'VietQR Techcombank');
                    setPaySuccess(true);
                  }
                }}
                className="rounded-lg bg-emerald-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
              >
                Xác nhận đã chuyển khoản
              </button>
            </div>
          ) : (
            <button
              onClick={() => setPayingInv(null)}
              className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white"
            >
              Đóng
            </button>
          )
        }
      >
        {payingInv && !paySuccess ? (
          <div className="text-center space-y-3 text-xs">
            <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-200">
              Số tiền: <strong className="text-base text-slate-900">{payingInv.totalAmount.toLocaleString('vi-VN')} đ</strong>
            </div>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=247-TECHCOMBANK-EZCONDO-${payingInv.invoiceCode}-${payingInv.totalAmount}`}
              alt="VietQR Code"
              className="h-44 w-44 mx-auto rounded-lg border border-slate-200 shadow-sm"
            />
            <div className="text-slate-600 space-y-1">
              <div>Ngân hàng: <strong>Techcombank</strong></div>
              <div>STK: <strong className="font-mono text-slate-900">1903 8888 6688 01</strong></div>
              <div>Nội dung chuyển khoản: <strong className="font-mono text-blue-700">{payingInv.invoiceCode}</strong></div>
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">Thanh Toán Hoàn Tất!</h4>
            <p className="text-xs text-slate-500">Cảm ơn bạn đã nộp phí đúng hạn cho tòa nhà.</p>
          </div>
        )}
      </Modal>

      {/* Modal: Gửi khiếu nại */}
      <Modal
        isOpen={showComplaintModal}
        onClose={() => setShowComplaintModal(false)}
        title="Gửi Báo Cáo Sự Cố Cho Kỹ Thuật"
        footer={
          <>
            <button
              onClick={() => setShowComplaintModal(false)}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs text-slate-700"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (complaintTitle && complaintDesc) {
                  onCreateComplaint({
                    title: complaintTitle,
                    category: complaintCategory,
                    apartmentCode: myApartmentCode,
                    residentName: myResidentName,
                    residentPhone: myPhone,
                    priority: 'high',
                    description: complaintDesc,
                    status: 'new',
                    createdAt: `${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
                    updatedAt: 'Vừa xong',
                    images: [],
                    messages: [
                      {
                        id: `msg-${Date.now()}`,
                        senderName: myResidentName,
                        senderRole: 'Cư dân',
                        content: complaintDesc,
                        timestamp: 'Vừa xong',
                      },
                    ],
                  });
                  setShowComplaintModal(false);
                  setComplaintTitle('');
                  setComplaintDesc('');
                }
              }}
              className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
            >
              Gửi yêu cầu
            </button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Vấn đề cần hỗ trợ *</label>
            <input
              type="text"
              value={complaintTitle}
              onChange={(e) => setComplaintTitle(e.target.value)}
              placeholder="VD: Van nước ban công bị rò rỉ"
              className="w-full rounded-lg border border-slate-200 p-2"
            />
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Phân loại</label>
            <select
              value={complaintCategory}
              onChange={(e) => setComplaintCategory(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 p-2"
            >
              <option value="Kỹ thuật - Nước">Cấp thoát nước</option>
              <option value="Kỹ thuật - Điện">Điện & Điều hòa</option>
              <option value="Thang máy">Thang máy</option>
              <option value="An ninh - Trật tự">An ninh & Tiếng ồn</option>
              <option value="Vệ sinh môi trường">Vệ sinh & Môi trường</option>
            </select>
          </div>
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mô tả cụ thể *</label>
            <textarea
              rows={3}
              value={complaintDesc}
              onChange={(e) => setComplaintDesc(e.target.value)}
              placeholder="Mô tả cụ thể hiện tượng để kỹ thuật viên chuẩn bị thiết bị..."
              className="w-full rounded-lg border border-slate-200 p-2"
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Đặt tiện ích */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Đăng Ký Tiện Ích Tòa Nhà"
        footer={
          !bookingSuccess ? (
            <>
              <button
                onClick={() => setShowBookingModal(false)}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs text-slate-700"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onBookFacility({
                    facilityName: bookingFacility,
                    apartmentCode: myApartmentCode,
                    residentName: myResidentName,
                    bookingDate: bookingDate,
                    timeSlot: bookingTimeSlot,
                    guestCount: guestCount,
                    status: 'Đã xác nhận',
                  });
                  setBookingSuccess(true);
                }}
                className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
              >
                Xác nhận đăng ký
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowBookingModal(false)}
              className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white"
            >
              Đóng
            </button>
          )
        }
      >
        {!bookingSuccess ? (
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tiện ích</label>
              <select
                value={bookingFacility}
                onChange={(e) => setBookingFacility(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 p-2"
              >
                <option value="Khu tiệc nướng BBQ">Khu tiệc nướng BBQ ngoài trời</option>
                <option value="Hồ bơi vô cực">Hồ bơi Sky Pool Tầng 5</option>
                <option value="Sân Tennis">Sân Tennis</option>
                <option value="Phòng tập Gym">Phòng tập Gym</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ngày sử dụng</label>
                <input
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Khung giờ</label>
                <select
                  value={bookingTimeSlot}
                  onChange={(e) => setBookingTimeSlot(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 p-2"
                >
                  <option value="09:00 - 12:00">09:00 - 12:00 (Sáng)</option>
                  <option value="14:00 - 17:00">14:00 - 17:00 (Chiều)</option>
                  <option value="18:00 - 21:00">18:00 - 21:00 (Tối)</option>
                </select>
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Số lượng khách</label>
              <input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-200 p-2"
              />
            </div>
          </div>
        ) : (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-slate-900 text-sm">Đã Đăng Ký Thành Công!</h4>
            <p className="text-xs text-slate-500">
              Lễ tân tòa nhà đã ghi nhận lịch của căn hộ {myApartmentCode} vào ngày {bookingDate}.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
