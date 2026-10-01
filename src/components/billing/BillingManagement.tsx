import React, { useState, useMemo } from 'react';
import {
  Receipt,
  Search,
  Filter,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  Clock,
  Download,
  CreditCard,
  QrCode,
  Printer,
  Sparkles,
  ChevronRight,
  Check,
  Send,
  Building,
} from 'lucide-react';
import { Invoice, InvoiceStatus, UserRole } from '../../types';
import { Modal } from '../common/Modal';

interface BillingManagementProps {
  invoices: Invoice[];
  currentRole: UserRole;
  onPayInvoice: (invoiceId: string, method: string) => void;
  onGenerateBatchInvoices: () => void;
}

export const BillingManagement: React.FC<BillingManagementProps> = ({
  invoices,
  currentRole,
  onPayInvoice,
  onGenerateBatchInvoices,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [apartmentSearch, setApartmentSearch] = useState('');

  // Payment Modal
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'card' | 'momo'>('vietqr');
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Invoice Print / Preview Modal
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);

  // Batch generate confirmation modal
  const [showBatchModal, setShowBatchModal] = useState(false);
  const [batchGeneratedDone, setBatchGeneratedDone] = useState(false);

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // If resident role, filter only A-1204 (mock resident)
      if (currentRole === 'resident' && inv.apartmentCode !== 'A-1204') {
        return false;
      }
      if (selectedMonth !== 'all' && inv.month !== selectedMonth) {
        return false;
      }
      if (selectedStatus !== 'all' && inv.status !== selectedStatus) {
        return false;
      }
      if (
        apartmentSearch &&
        !inv.apartmentCode.toLowerCase().includes(apartmentSearch.toLowerCase()) &&
        !inv.residentName.toLowerCase().includes(apartmentSearch.toLowerCase())
      ) {
        return false;
      }
      return true;
    });
  }, [invoices, currentRole, selectedMonth, selectedStatus, apartmentSearch]);

  // Quick stats
  const totalReceivable = filteredInvoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalCollected = filteredInvoices
    .filter((i) => i.status === 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);
  const totalOutstanding = filteredInvoices
    .filter((i) => i.status !== 'paid')
    .reduce((sum, i) => sum + i.totalAmount, 0);

  const statusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Đã thanh toán
          </span>
        );
      case 'unpaid':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 border border-amber-200">
            <Clock className="h-3 w-3" />
            Chờ thanh toán
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 border border-rose-200">
            <AlertCircle className="h-3 w-3" />
            Quá hạn
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
            {currentRole === 'resident'
              ? 'Hóa Đơn & Thanh Toán Dịch Vụ Căn Hộ'
              : 'Quản Lý Hóa Đơn & Công Nợ Dịch Vụ'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentRole === 'resident'
              ? 'Tra cứu biểu phí quản lý, điện nước, gửi xe và thanh toán tức thì qua VietQR'
              : 'Theo dõi tổng thu, công nợ lũy kế, tạo hóa đơn hàng loạt và đối soát thanh toán điện tử'}
          </p>
        </div>

        {/* Manager/Staff action buttons */}
        {currentRole !== 'resident' && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setShowBatchModal(true);
                setBatchGeneratedDone(false);
              }}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition"
            >
              <Sparkles className="h-4 w-4" />
              <span>Tạo hóa đơn hàng loạt</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Download className="h-4 w-4" />
              <span>Xuất Báo Cáo Excel</span>
            </button>
          </div>
        )}
      </div>

      {/* 3 Quick Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <span className="text-xs font-semibold text-slate-500 block">Tổng Phải Thu (Tháng chọn)</span>
          <div className="mt-2 text-xl font-bold text-slate-900">
            {totalReceivable.toLocaleString('vi-VN')} đ
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {filteredInvoices.length} hóa đơn phát hành
          </span>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-emerald-800 block">Đã Thu Thành Công</span>
          <div className="mt-2 text-xl font-bold text-emerald-700">
            {totalCollected.toLocaleString('vi-VN')} đ
          </div>
          <span className="text-[11px] text-emerald-600 mt-1 block font-medium">
            Tỷ lệ thu: {totalReceivable > 0 ? Math.round((totalCollected / totalReceivable) * 100) : 0}%
          </span>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50/40 p-4 shadow-sm">
          <span className="text-xs font-semibold text-rose-800 block">Công Nợ Còn Phải Thu</span>
          <div className="mt-2 text-xl font-bold text-rose-600">
            {totalOutstanding.toLocaleString('vi-VN')} đ
          </div>
          <span className="text-[11px] text-rose-500 mt-1 block">
            {filteredInvoices.filter((i) => i.status !== 'paid').length} căn hộ chưa thanh toán
          </span>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search by Apt or resident */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={apartmentSearch}
              onChange={(e) => setApartmentSearch(e.target.value)}
              placeholder="Tìm theo mã căn hộ hoặc cư dân..."
              className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Month selector */}
          <div>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả các tháng</option>
              <option value="10/2026">Tháng 10/2026 (Kỳ hiện tại)</option>
              <option value="09/2026">Tháng 09/2026</option>
              <option value="08/2026">Tháng 08/2026</option>
            </select>
          </div>

          {/* Status selector */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-xl border border-slate-200 py-2 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="paid">Đã thanh toán</option>
              <option value="unpaid">Chưa thanh toán</option>
              <option value="overdue">Quá hạn</option>
            </select>
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-5 py-3.5">Mã Hóa Đơn</th>
                <th className="px-4 py-3.5">Căn Hộ</th>
                <th className="px-4 py-3.5">Cư Dân</th>
                <th className="px-4 py-3.5">Kỳ Thu</th>
                <th className="px-4 py-3.5">Tổng Tiền (VNĐ)</th>
                <th className="px-4 py-3.5">Hạn Thanh Toán</th>
                <th className="px-4 py-3.5">Trạng Thái</th>
                <th className="px-5 py-3.5 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50/80 transition">
                  <td className="px-5 py-4 font-mono font-bold text-blue-600">{inv.invoiceCode}</td>
                  <td className="px-4 py-4 font-bold text-slate-900">{inv.apartmentCode}</td>
                  <td className="px-4 py-4 text-slate-700 font-medium">{inv.residentName}</td>
                  <td className="px-4 py-4 text-slate-600">{inv.month}</td>
                  <td className="px-4 py-4 font-bold text-slate-900">
                    {inv.totalAmount.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="px-4 py-4 text-slate-600">{inv.dueDate}</td>
                  <td className="px-4 py-4">{statusBadge(inv.status)}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setPreviewInvoice(inv)}
                        className="rounded-lg border border-slate-200 p-1.5 text-slate-600 hover:bg-slate-100 transition"
                        title="In / Xem chi tiết"
                      >
                        <Printer className="h-4 w-4" />
                      </button>

                      {/* Payment trigger */}
                      {inv.status !== 'paid' ? (
                        <button
                          onClick={() => {
                            setPayingInvoice(inv);
                            setPaymentSuccess(false);
                          }}
                          className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-700 transition"
                        >
                          Thanh toán ngay
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Đã thu</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Thanh toán Hóa Đơn & Cổng VietQR */}
      <Modal
        isOpen={!!payingInvoice}
        onClose={() => setPayingInvoice(null)}
        title={`Thanh Toán Hóa Đơn Dịch Vụ: ${payingInvoice?.invoiceCode}`}
        maxWidth="max-w-lg"
        footer={
          !paymentSuccess ? (
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => setPayingInvoice(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Đóng
              </button>
              <button
                onClick={() => {
                  if (payingInvoice) {
                    onPayInvoice(payingInvoice.id, paymentMethod === 'vietqr' ? 'VietQR Techcombank' : 'Thẻ quốc tế');
                    setPaymentSuccess(true);
                  }
                }}
                className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-md shadow-emerald-600/20"
              >
                <Check className="h-4 w-4" />
                Xác nhận đã chuyển khoản thành công
              </button>
            </div>
          ) : (
            <button
              onClick={() => setPayingInvoice(null)}
              className="rounded-xl bg-blue-600 px-5 py-2 text-xs font-bold text-white"
            >
              Hoàn tất giao dịch
            </button>
          )
        }
      >
        {payingInvoice && !paymentSuccess && (
          <div className="space-y-4">
            {/* Amount details */}
            <div className="rounded-xl bg-slate-50 p-4 border border-slate-200 text-center">
              <span className="text-xs text-slate-500">Số tiền cần thanh toán</span>
              <div className="text-2xl font-extrabold text-blue-700 mt-0.5">
                {payingInvoice.totalAmount.toLocaleString('vi-VN')} đ
              </div>
              <span className="text-xs text-slate-600 font-medium">
                Căn hộ: <strong>{payingInvoice.apartmentCode}</strong> • {payingInvoice.residentName}
              </span>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                onClick={() => setPaymentMethod('vietqr')}
                className={`rounded-xl border p-2.5 font-bold transition flex flex-col items-center gap-1 ${
                  paymentMethod === 'vietqr'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="h-5 w-5" />
                <span>VietQR Chuyển khoản</span>
              </button>
              <button
                onClick={() => setPaymentMethod('card')}
                className={`rounded-xl border p-2.5 font-bold transition flex flex-col items-center gap-1 ${
                  paymentMethod === 'card'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="h-5 w-5" />
                <span>Thẻ ATM / Visa</span>
              </button>
              <button
                onClick={() => setPaymentMethod('momo')}
                className={`rounded-xl border p-2.5 font-bold transition flex flex-col items-center gap-1 ${
                  paymentMethod === 'momo'
                    ? 'border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-500/20'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="font-extrabold text-pink-600 text-base">MoMo</span>
                <span>Ví điện tử</span>
              </button>
            </div>

            {/* VietQR View */}
            {paymentMethod === 'vietqr' && (
              <div className="rounded-xl border border-slate-200 p-4 text-center space-y-3 bg-white">
                <div className="inline-block p-2 bg-slate-50 rounded-xl border border-slate-200 shadow-inner">
                  {/* Generated Dynamic VietQR mock placeholder */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=247-TECHCOMBANK-EZCONDO-${payingInvoice.invoiceCode}-${payingInvoice.totalAmount}`}
                    alt="VietQR Code"
                    className="h-44 w-44 mx-auto rounded-lg"
                  />
                </div>
                <div className="space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-400">Ngân hàng:</span>
                    <strong className="text-slate-900">Techcombank (TCB)</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-400">Số tài khoản BQL:</span>
                    <strong className="text-blue-700 font-mono">1903 8888 6688 01</strong>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1">
                    <span className="text-slate-400">Tên thụ hưởng:</span>
                    <strong className="text-slate-900">BQL EZCONDO RESIDENCES</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Nội dung CK:</span>
                    <strong className="text-rose-600 font-mono">{payingInvoice.invoiceCode}</strong>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400 italic">
                  Quét mã qua mọi App ngân hàng (VietinBank, VCB, MB, Techcombank...). Hệ thống tự động gạch nợ sau 30 giây!
                </p>
              </div>
            )}
          </div>
        )}

        {paymentSuccess && (
          <div className="py-8 text-center space-y-3">
            <div className="h-14 w-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h4 className="text-base font-bold text-slate-900">Giao Dịch Đã Ghi Nhận Thành Công!</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Hóa đơn <strong>{payingInvoice?.invoiceCode}</strong> đã được gạch nợ thành công trên toàn hệ thống. Biên lai điện tử đã được lưu trữ trong mục Lịch sử thanh toán.
            </p>
          </div>
        )}
      </Modal>

      {/* Modal: Xem & In Hóa Đơn Chuẩn (PDF preview) */}
      <Modal
        isOpen={!!previewInvoice}
        onClose={() => setPreviewInvoice(null)}
        title="Chi Tiết Hóa Đơn & Biên Lai Thu Phí"
        maxWidth="max-w-2xl"
        footer={
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              <Printer className="h-4 w-4" />
              In hóa đơn ra máy in
            </button>
            <button
              onClick={() => setPreviewInvoice(null)}
              className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
            >
              Đóng
            </button>
          </div>
        }
      >
        {previewInvoice && (
          <div className="space-y-4 p-2 text-xs">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="text-sm font-extrabold text-blue-700">BAN QUẢN LÝ TÒA NHÀ EZCONDO</h3>
                <p className="text-[11px] text-slate-500">Bộ phận Kế toán & Dịch vụ khách hàng</p>
              </div>
              <div className="text-right">
                <span className="font-mono font-bold text-slate-900 text-sm block">
                  {previewInvoice.invoiceCode}
                </span>
                <span className="text-[10px] text-slate-400">Kỳ thu: {previewInvoice.month}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl">
              <div>
                <span className="text-slate-400 block">Căn hộ:</span>
                <span className="font-bold text-slate-900 text-sm">{previewInvoice.apartmentCode}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Người thanh toán:</span>
                <span className="font-bold text-slate-900">{previewInvoice.residentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Ngày phát hành:</span>
                <span className="font-medium text-slate-700">{previewInvoice.issueDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Hạn thanh toán:</span>
                <span className="font-medium text-rose-600">{previewInvoice.dueDate}</span>
              </div>
            </div>

            {/* Items */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 font-bold text-slate-700">
                  <tr>
                    <th className="p-2.5">Khoản mục dịch vụ</th>
                    <th className="p-2.5 text-center">SL</th>
                    <th className="p-2.5 text-right">Đơn giá</th>
                    <th className="p-2.5 text-right">Thành tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewInvoice.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-2.5 font-medium text-slate-800">{it.description}</td>
                      <td className="p-2.5 text-center text-slate-600">{it.quantity} {it.unit}</td>
                      <td className="p-2.5 text-right text-slate-600">{it.unitPrice.toLocaleString('vi-VN')} đ</td>
                      <td className="p-2.5 text-right font-bold text-slate-900">{it.amount.toLocaleString('vi-VN')} đ</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50 font-bold">
                  <tr>
                    <td colSpan={3} className="p-3 text-right text-slate-800">TỔNG CỘNG THANH TOÁN:</td>
                    <td className="p-3 text-right text-base text-blue-700">
                      {previewInvoice.totalAmount.toLocaleString('vi-VN')} đ
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {previewInvoice.status === 'paid' && (
              <div className="rounded-xl bg-emerald-50 p-3 text-emerald-800 border border-emerald-200 flex items-center justify-between">
                <span>Hóa đơn đã được thanh toán qua: <strong>{previewInvoice.paymentMethod || 'Chuyển khoản'}</strong></span>
                <span className="font-mono text-[11px]">Mã GD: {previewInvoice.transactionId || 'TCB-202610-09'}</span>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Modal: Tạo hóa đơn hàng loạt */}
      <Modal
        isOpen={showBatchModal}
        onClose={() => setShowBatchModal(false)}
        title="Tạo Hóa Đơn Hàng Loạt Toàn Chung Cư"
        footer={
          !batchGeneratedDone ? (
            <>
              <button
                onClick={() => setShowBatchModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={() => {
                  onGenerateBatchInvoices();
                  setBatchGeneratedDone(true);
                }}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
              >
                Bắt đầu chạy tính phí tự động
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowBatchModal(false)}
              className="rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white"
            >
              Xong
            </button>
          )
        }
      >
        {!batchGeneratedDone ? (
          <div className="space-y-4 text-xs">
            <p className="text-slate-600">
              Công cụ tính phí tự động sẽ quét toàn bộ danh sách <strong>450 căn hộ</strong> và tự động áp dụng công thức:
            </p>
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-200 space-y-1.5 font-mono text-[11px] text-slate-700">
              <div>• Phí quản lý = Diện tích m² x 16.000 đ/m²</div>
              <div>• Phí xe ô tô = Số lượng x 1.250.000 đ/xe</div>
              <div>• Phí xe máy = Số lượng x 120.000 đ/xe</div>
              <div>• Chỉ số nước tháng 09 nhập từ hệ thống đồng hồ đo thông minh</div>
            </div>
            <p className="text-slate-500">
              Sau khi tạo, hóa đơn sẽ tự động xuất hiện trên Cổng Cư Dân kèm mã QR thanh toán động VietQR.
            </p>
          </div>
        ) : (
          <div className="py-6 text-center space-y-3">
            <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-900">Phát Hành Hóa Đơn Thành Công!</h4>
            <p className="text-xs text-slate-500">
              Đã tạo và gửi thông báo cước đến 450 căn hộ trong tòa nhà.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};
