import React, { useState } from 'react';
import {
  UserCheck,
  Shield,
  Calendar,
  Award,
  Plus,
  Phone,
  Mail,
  Check,
  Clock,
  Star,
  CheckCircle2,
} from 'lucide-react';
import { StaffMember, ShiftSchedule } from '../../types';
import { Modal } from '../common/Modal';

interface StaffManagementProps {
  staff: StaffMember[];
  shifts: ShiftSchedule[];
  onAddStaff: (newStaff: Partial<StaffMember>) => void;
}

export const StaffManagement: React.FC<StaffManagementProps> = ({
  staff,
  shifts,
  onAddStaff,
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'matrix' | 'schedule' | 'performance'>('list');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formDept, setFormDept] = useState<StaffMember['department']>('Kỹ thuật');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');

  // RBAC permissions matrix state
  const permissionsList = [
    { id: 'view_apartments', label: 'Xem danh sách & mặt bằng căn hộ' },
    { id: 'edit_apartments', label: 'Cập nhật trạng thái & gán cư dân' },
    { id: 'manage_billing', label: 'Lập hóa đơn & gạch nợ thanh toán' },
    { id: 'manage_complaints', label: 'Tiếp nhận & điều phối khiếu nại' },
    { id: 'view_reports', label: 'Xem báo cáo tài chính & doanh thu' },
    { id: 'assign_shifts', label: 'Phân ca trực & xếp lịch kỹ thuật' },
    { id: 'system_config', label: 'Cấu hình đơn giá dịch vụ & hệ thống' },
  ];

  const roles = [
    { key: 'owner', name: 'Chủ chung cư' },
    { key: 'manager', name: 'Quản lý (Manager)' },
    { key: 'staff', name: 'Nhân viên (Staff)' },
    { key: 'resident', name: 'Cư dân (Resident)' },
    { key: 'superadmin', name: 'Super Admin' },
  ];

  // Default permissions matrix mapping
  const [matrix, setMatrix] = useState<Record<string, Record<string, boolean>>>({
    view_apartments: { owner: true, manager: true, staff: true, resident: false, superadmin: true },
    edit_apartments: { owner: false, manager: true, staff: true, resident: false, superadmin: true },
    manage_billing: { owner: false, manager: true, staff: true, resident: false, superadmin: true },
    manage_complaints: { owner: true, manager: true, staff: true, resident: true, superadmin: true },
    view_reports: { owner: true, manager: true, staff: false, resident: false, superadmin: true },
    assign_shifts: { owner: false, manager: true, staff: false, resident: false, superadmin: true },
    system_config: { owner: true, manager: true, staff: false, resident: false, superadmin: true },
  });

  const togglePermission = (permId: string, roleKey: string) => {
    setMatrix((prev) => ({
      ...prev,
      [permId]: {
        ...prev[permId],
        [roleKey]: !prev[permId][roleKey],
      },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Nhân Sự & Phân Quyền Vận Hành
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý đội ngũ kỹ sư, lễ tân, an ninh, ma trận phân quyền RBAC và lịch ca trực
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm nhân sự mới</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition ${
            activeTab === 'list'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserCheck className="h-4 w-4" />
          Danh sách nhân viên ({staff.length})
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition ${
            activeTab === 'matrix'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="h-4 w-4" />
          Phân quyền theo vai trò (RBAC)
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition ${
            activeTab === 'schedule'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Lịch làm việc / Ca trực
        </button>
        <button
          onClick={() => setActiveTab('performance')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition ${
            activeTab === 'performance'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Award className="h-4 w-4" />
          Báo cáo hiệu suất & Đánh giá
        </button>
      </div>

      {/* Tab 1: Danh sách nhân viên */}
      {activeTab === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((st) => (
            <div
              key={st.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow">
                    {st.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{st.name}</h3>
                    <p className="text-[11px] text-slate-500">{st.role}</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                  {st.status === 'active' ? 'Đang làm việc' : 'Nghỉ phép'}
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{st.phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <span>{st.email}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Hoàn thành: <strong>{st.completedTasks} việc</strong>
                </span>
                <span className="flex items-center gap-1 font-bold text-amber-600">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {st.rating} / 5.0
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Ma trận phân quyền (RBAC Matrix) */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          <div className="rounded-xl bg-blue-50 p-3 text-xs text-blue-800 border border-blue-100">
            Ma trận phân quyền (Role-Based Access Control). Bạn có thể tích chọn trực tiếp để tùy biến quyền hạn cho từng vị trí chức danh.
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-700">
                <tr>
                  <th className="px-5 py-3.5 w-1/3">Quyền hạn chức năng</th>
                  {roles.map((r) => (
                    <th key={r.key} className="px-4 py-3.5 text-center">
                      {r.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {permissionsList.map((perm) => (
                  <tr key={perm.id} className="hover:bg-slate-50/70 transition">
                    <td className="px-5 py-4 font-semibold text-slate-900">{perm.label}</td>
                    {roles.map((r) => {
                      const isChecked = !!matrix[perm.id]?.[r.key];
                      return (
                        <td key={r.key} className="px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => togglePermission(perm.id, r.key)}
                            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Lịch làm việc / Ca trực */}
      {activeTab === 'schedule' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {shifts.map((shift) => (
              <div
                key={shift.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{shift.shiftName}</h3>
                    <span className="text-[11px] text-slate-400">Ngày trực: {shift.date}</span>
                  </div>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-bold text-blue-700">
                    {shift.staffAssigned.length} nhân sự
                  </span>
                </div>

                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase">
                    Nhân viên trong ca:
                  </span>
                  {shift.staffAssigned.map((st, i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-100 bg-slate-50 p-2.5 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-900">{st.staffName}</span>
                      <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {st.department}
                      </span>
                    </div>
                  ))}
                </div>

                {shift.notes && (
                  <p className="text-[11px] text-slate-500 bg-amber-50 p-2.5 rounded-xl border border-amber-100">
                    <strong>Ghi chú ca:</strong> {shift.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Báo cáo hiệu suất */}
      {activeTab === 'performance' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-5 py-3.5">Họ và tên</th>
                <th className="px-4 py-3.5">Phòng ban</th>
                <th className="px-4 py-3.5">Công việc hoàn thành</th>
                <th className="px-4 py-3.5">Tỷ lệ đúng hạn (SLA)</th>
                <th className="px-4 py-3.5">Đánh giá trung bình từ cư dân</th>
                <th className="px-4 py-3.5">Xếp loại thi đua</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {staff.map((st) => (
                <tr key={st.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4 font-bold text-slate-900">{st.name}</td>
                  <td className="px-4 py-4 text-slate-700">{st.department}</td>
                  <td className="px-4 py-4 font-bold text-blue-700">{st.completedTasks} nhiệm vụ</td>
                  <td className="px-4 py-4 font-semibold text-emerald-600">97.8% đúng hẹn</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <span>{st.rating} / 5.0</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                      Xuất sắc
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Thêm nhân sự mới */}
      <Modal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        title="Thêm Nhân Sự Vào Ban Vận Hành"
        footer={
          <>
            <button
              onClick={() => setShowAddModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (formName && formPhone) {
                  onAddStaff({
                    name: formName,
                    role: formRole || 'Chuyên viên kỹ thuật',
                    department: formDept,
                    phone: formPhone,
                    email: formEmail,
                    status: 'active',
                    completedTasks: 0,
                    rating: 5.0,
                  });
                  setShowAddModal(false);
                }
              }}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
            >
              Lưu nhân sự
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Họ và tên *</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="VD: Đặng Quốc Tuấn"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Chức danh công việc</label>
              <input
                type="text"
                value={formRole}
                onChange={(e) => setFormRole(e.target.value)}
                placeholder="VD: Kỹ sư PCCC"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phòng ban</label>
              <select
                value={formDept}
                onChange={(e) => setFormDept(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
              >
                <option value="Kỹ thuật">Kỹ thuật</option>
                <option value="Dịch vụ cư dân">Dịch vụ cư dân</option>
                <option value="An ninh">An ninh</option>
                <option value="Tài chính">Tài chính</option>
                <option value="Vận hành">Vận hành</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Số điện thoại *</label>
              <input
                type="text"
                value={formPhone}
                onChange={(e) => setFormPhone(e.target.value)}
                placeholder="0912 345 678"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="tuan.dq@ezcondo.vn"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
