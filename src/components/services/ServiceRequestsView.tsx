import React, { useState } from 'react';
import {
  FileCheck,
  Package,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Truck,
  Car,
  Wrench,
  Search,
  Filter,
} from 'lucide-react';
import { ServiceRequest, ParcelItem, UserRole } from '../../types';
import { Modal } from '../common/Modal';

interface ServiceRequestsViewProps {
  currentRole: UserRole;
  requests: ServiceRequest[];
  parcels: ParcelItem[];
  onApproveRequest: (id: string) => void;
  onRejectRequest: (id: string) => void;
  onCreateRequest: (req: Partial<ServiceRequest>) => void;
  onMarkParcelReceived: (id: string) => void;
  onAddParcel: (par: Partial<ParcelItem>) => void;
}

export const ServiceRequestsView: React.FC<ServiceRequestsViewProps> = ({
  currentRole,
  requests,
  parcels,
  onApproveRequest,
  onRejectRequest,
  onCreateRequest,
  onMarkParcelReceived,
  onAddParcel,
}) => {
  const [tab, setTab] = useState<'requests' | 'parcels'>('requests');

  // New Request Modal
  const [showReqModal, setShowReqModal] = useState(false);
  const [reqType, setReqType] = useState<ServiceRequest['type']>('Đăng ký thang máy hàng (Chuyển đồ)');
  const [reqApt, setReqApt] = useState(currentRole === 'resident' ? 'A-1204' : '');
  const [reqName, setReqName] = useState(currentRole === 'resident' ? 'Nguyễn Văn Minh' : '');
  const [reqPhone, setReqPhone] = useState(currentRole === 'resident' ? '0908 123 456' : '');
  const [reqStart, setReqStart] = useState('2026-10-04 09:00');
  const [reqDetails, setReqDetails] = useState('');

  // New Parcel Modal (Staff / Reception)
  const [showParcelModal, setShowParcelModal] = useState(false);
  const [parcelCode, setParcelCode] = useState('');
  const [parcelApt, setParcelApt] = useState('');
  const [parcelName, setParcelName] = useState('');
  const [parcelCourier, setParcelCourier] = useState('Shopee Xpress');
  const [parcelLocker, setParcelLocker] = useState('Kệ A - Ô 05');

  const filteredRequests = currentRole === 'resident'
    ? requests.filter((r) => r.apartmentCode === 'A-1204')
    : requests;

  const filteredParcels = currentRole === 'resident'
    ? parcels.filter((p) => p.apartmentCode === 'A-1204')
    : parcels;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Dịch Vụ Đăng Ký Tòa Nhà & Giao Nhận Bưu Phẩm
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Đăng ký thi công, giữ thang máy chuyển đồ, cấp thẻ xe và quản lý bưu phẩm tại quầy lễ tân
          </p>
        </div>

        <div className="flex items-center gap-2">
          {tab === 'requests' ? (
            <button
              onClick={() => setShowReqModal(true)}
              className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition"
            >
              <Plus className="h-4 w-4" />
              <span>Đăng ký dịch vụ mới</span>
            </button>
          ) : (
            currentRole !== 'resident' && (
              <button
                onClick={() => setShowParcelModal(true)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition"
              >
                <Plus className="h-4 w-4" />
                <span>Tiếp nhận bưu kiện mới</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold gap-2">
        <button
          onClick={() => setTab('requests')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition ${
            tab === 'requests'
              ? 'border-blue-700 text-blue-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="h-4 w-4" />
          <span>Hồ Sơ Đăng Ký Dịch Vụ ({filteredRequests.length})</span>
        </button>
        <button
          onClick={() => setTab('parcels')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition ${
            tab === 'parcels'
              ? 'border-blue-700 text-blue-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="h-4 w-4" />
          <span>Quản Lý Bưu Kiện Lễ Tân ({filteredParcels.length})</span>
        </button>
      </div>

      {/* Tab 1: Service Requests */}
      {tab === 'requests' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-5 py-3.5">Mã Yêu Cầu</th>
                <th className="px-4 py-3.5">Loại Dịch Vụ</th>
                <th className="px-4 py-3.5">Căn Hộ / Người Đăng Ký</th>
                <th className="px-4 py-3.5">Thời Gian Bắt Đầu</th>
                <th className="px-4 py-3.5">Chi Tiết Đăng Ký</th>
                <th className="px-4 py-3.5">Trạng Thái</th>
                {currentRole !== 'resident' && <th className="px-5 py-3.5 text-right">Phê Duyệt</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900">{req.requestCode}</td>
                  <td className="px-4 py-4 font-semibold text-blue-800">{req.type}</td>
                  <td className="px-4 py-4">
                    <span className="font-semibold text-slate-900 block">{req.apartmentCode}</span>
                    <span className="text-[11px] text-slate-500">{req.residentName} ({req.residentPhone})</span>
                  </td>
                  <td className="px-4 py-4 text-slate-700 font-medium">{req.startDate}</td>
                  <td className="px-4 py-4 text-slate-600 max-w-[240px] leading-relaxed">{req.details}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block text-[11px] font-semibold ${
                        req.status === 'Đã phê duyệt'
                          ? 'text-emerald-700'
                          : req.status === 'Chờ duyệt'
                          ? 'text-amber-700'
                          : req.status === 'Đã hoàn tất'
                          ? 'text-blue-700'
                          : 'text-rose-700'
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  {currentRole !== 'resident' && (
                    <td className="px-5 py-4 text-right">
                      {req.status === 'Chờ duyệt' && (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onApproveRequest(req.id)}
                            className="rounded bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-800"
                          >
                            Duyệt
                          </button>
                          <button
                            onClick={() => onRejectRequest(req.id)}
                            className="rounded border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50"
                          >
                            Từ chối
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Parcels */}
      {tab === 'parcels' && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-5 py-3.5">Mã Vận Đơn</th>
                <th className="px-4 py-3.5">Căn Hộ Nhận</th>
                <th className="px-4 py-3.5">Người Nhận</th>
                <th className="px-4 py-3.5">Đơn Vị Vận Chuyển</th>
                <th className="px-4 py-3.5">Vị Trí Lưu Tại Quầy</th>
                <th className="px-4 py-3.5">Thời Gian Đến</th>
                <th className="px-4 py-3.5">Trạng Thái</th>
                <th className="px-5 py-3.5 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredParcels.map((par) => (
                <tr key={par.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4 font-mono font-bold text-slate-900">{par.trackingCode}</td>
                  <td className="px-4 py-4 font-bold text-blue-700">{par.apartmentCode}</td>
                  <td className="px-4 py-4 text-slate-800 font-medium">{par.recipientName}</td>
                  <td className="px-4 py-4 text-slate-600">{par.courier}</td>
                  <td className="px-4 py-4 font-semibold text-slate-700">{par.lockerNumber || 'Kệ A'}</td>
                  <td className="px-4 py-4 text-slate-500">{par.arrivedAt}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`text-[11px] font-semibold ${
                        par.status === 'Chờ nhận tại lễ tân' ? 'text-amber-700' : 'text-emerald-700'
                      }`}
                    >
                      {par.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    {par.status === 'Chờ nhận tại lễ tân' ? (
                      <button
                        onClick={() => onMarkParcelReceived(par.id)}
                        className="rounded bg-blue-700 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-800"
                      >
                        Xác nhận đã lấy
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Đã lấy lúc {par.receivedAt?.split(' ')[1] || 'hôm nay'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Đăng ký dịch vụ mới */}
      <Modal
        isOpen={showReqModal}
        onClose={() => setShowReqModal(false)}
        title="Đăng Ký Dịch Vụ Vận Hành Căn Hộ"
        footer={
          <>
            <button
              onClick={() => setShowReqModal(false)}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs text-slate-700"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (reqApt && reqName && reqDetails) {
                  onCreateRequest({
                    requestCode: `YC-2026-${Math.floor(100 + Math.random() * 900)}`,
                    type: reqType,
                    apartmentCode: reqApt,
                    residentName: reqName,
                    residentPhone: reqPhone,
                    startDate: reqStart,
                    details: reqDetails,
                    status: 'Chờ duyệt',
                    createdAt: new Date().toISOString().split('T')[0],
                  });
                  setShowReqModal(false);
                  setReqDetails('');
                } else {
                  alert('Vui lòng điền đủ thông tin');
                }
              }}
              className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
            >
              Nộp đơn đăng ký
            </button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Loại thủ tục đăng ký *</label>
            <select
              value={reqType}
              onChange={(e) => setReqType(e.target.value as any)}
              className="w-full rounded-lg border border-slate-200 p-2"
            >
              <option value="Đăng ký thang máy hàng (Chuyển đồ)">Đăng ký thang máy hàng (Chuyển đồ / Hàng nặng)</option>
              <option value="Đăng ký thi công nội thất">Đăng ký thi công nội thất / Sửa chữa căn hộ</option>
              <option value="Đăng ký cấp thẻ xe">Đăng ký cấp thẻ xe ô tô / xe máy mới</option>
              <option value="Đăng ký tạm trú / Vắng mặt dài ngày">Đăng ký vắng mặt dài ngày / Tạm trú</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mã căn hộ *</label>
              <input
                type="text"
                value={reqApt}
                onChange={(e) => setReqApt(e.target.value)}
                placeholder="VD: A-1204"
                className="w-full rounded-lg border border-slate-200 p-2"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Thời gian dự kiến thực hiện</label>
              <input
                type="text"
                value={reqStart}
                onChange={(e) => setReqStart(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Họ tên người đăng ký</label>
              <input
                type="text"
                value={reqName}
                onChange={(e) => setReqName(e.target.value)}
                placeholder="Nguyễn Văn Minh"
                className="w-full rounded-lg border border-slate-200 p-2"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Số điện thoại</label>
              <input
                type="text"
                value={reqPhone}
                onChange={(e) => setReqPhone(e.target.value)}
                placeholder="0908 123 456"
                className="w-full rounded-lg border border-slate-200 p-2"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Chi tiết công việc / Đồ đạc vận chuyển *</label>
            <textarea
              rows={3}
              value={reqDetails}
              onChange={(e) => setReqDetails(e.target.value)}
              placeholder="VD: Chuyển tủ lạnh và sofa lúc 09h sáng, có 2 nhân viên vận chuyển đi kèm..."
              className="w-full rounded-lg border border-slate-200 p-2"
            />
          </div>
        </div>
      </Modal>

      {/* Modal: Tiếp nhận bưu kiện mới (Lễ tân) */}
      <Modal
        isOpen={showParcelModal}
        onClose={() => setShowParcelModal(false)}
        title="Tiếp Nhận Bưu Kiện / Hàng Hóa Tại Quầy Lễ Tân"
        footer={
          <>
            <button
              onClick={() => setShowParcelModal(false)}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs text-slate-700"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (parcelCode && parcelApt && parcelName) {
                  onAddParcel({
                    trackingCode: parcelCode,
                    apartmentCode: parcelApt,
                    recipientName: parcelName,
                    courier: parcelCourier,
                    lockerNumber: parcelLocker,
                    arrivedAt: `${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
                    status: 'Chờ nhận tại lễ tân',
                  });
                  setShowParcelModal(false);
                  setParcelCode('');
                } else {
                  alert('Vui lòng điền đủ Mã vận đơn, Căn hộ và Tên người nhận');
                }
              }}
              className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
            >
              Lưu kiện & Báo cư dân
            </button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Mã vận đơn bưu phẩm *</label>
            <input
              type="text"
              value={parcelCode}
              onChange={(e) => setParcelCode(e.target.value)}
              placeholder="VD: SPX-VN88991122"
              className="w-full rounded-lg border border-slate-200 p-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Căn hộ nhận hàng *</label>
              <input
                type="text"
                value={parcelApt}
                onChange={(e) => setParcelApt(e.target.value)}
                placeholder="VD: A-1204"
                className="w-full rounded-lg border border-slate-200 p-2"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tên người nhận *</label>
              <input
                type="text"
                value={parcelName}
                onChange={(e) => setParcelName(e.target.value)}
                placeholder="VD: Nguyễn Văn Minh"
                className="w-full rounded-lg border border-slate-200 p-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Đơn vị vận chuyển</label>
              <select
                value={parcelCourier}
                onChange={(e) => setParcelCourier(e.target.value)}
                className="w-full rounded-lg border border-slate-200 p-2"
              >
                <option value="Shopee Xpress">Shopee Xpress</option>
                <option value="Giao Hàng Tiết Kiệm">Giao Hàng Tiết Kiệm</option>
                <option value="Viettel Post">Viettel Post</option>
                <option value="J&T Express">J&T Express</option>
                <option value="GrabExpress">GrabExpress</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Vị trí lưu kho tại sảnh</label>
              <input
                type="text"
                value={parcelLocker}
                onChange={(e) => setParcelLocker(e.target.value)}
                placeholder="Kệ A - Ô 12"
                className="w-full rounded-lg border border-slate-200 p-2"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
