import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  Layers,
  Activity,
  DollarSign,
  PhoneCall,
  Server,
  Plus,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { TenantCondo, SalesLead } from '../../types';
import { INITIAL_SALES_LEADS } from '../../data/mockData';
import { Modal } from '../common/Modal';

interface SuperAdminViewProps {
  tenants: TenantCondo[];
  onAddTenant: (newTenant: Partial<TenantCondo>) => void;
}

export const SuperAdminView: React.FC<SuperAdminViewProps> = ({
  tenants,
  onAddTenant,
}) => {
  const [activeTab, setActiveTab] = useState<'tenants' | 'licensing' | 'metrics' | 'leads'>('tenants');

  // New tenant modal
  const [showAddTenantModal, setShowAddTenantModal] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [tenantCode, setTenantCode] = useState('');
  const [tenantAddress, setTenantAddress] = useState('');
  const [tenantUnits, setTenantUnits] = useState(350);
  const [tenantPackage, setTenantPackage] = useState<'Standard' | 'Professional' | 'Enterprise'>('Professional');
  const [tenantManager, setTenantManager] = useState('');

  // Sales leads state
  const [salesLeads, setSalesLeads] = useState<SalesLead[]>(INITIAL_SALES_LEADS);

  // Platform metrics
  const totalPlatformUnits = tenants.reduce((s, t) => s + t.totalApartments, 0);
  const totalPlatformMRR = tenants.reduce((s, t) => s + t.monthlyFee, 0);
  const totalPlatformResidents = tenants.reduce((s, t) => s + t.activeResidents, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-rose-100 text-rose-700 px-2 py-0.5 text-[10px] font-bold">
              Super Admin SaaS
            </span>
            <span className="text-xs text-slate-400">Platform Management Console</span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            Trung Tâm Quản Trị Nền Tảng EZCondo SaaS
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý tập trung các tòa nhà (tenants), bản quyền thuê bao, doanh thu MRR & giám sát hạ tầng
          </p>
        </div>

        <button
          onClick={() => setShowAddTenantModal(true)}
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition shadow"
        >
          <Plus className="h-4 w-4" />
          <span>Thêm chung cư (Tenant mới)</span>
        </button>
      </div>

      {/* Platform KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Chung cư đang vận hành</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">{tenants.length} Dự án</div>
          <span className="text-[11px] text-emerald-600 font-medium">100% SLA vận hành ổn định</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Doanh thu SaaS hàng tháng (MRR)</span>
          <div className="mt-2 text-2xl font-extrabold text-blue-700">
            {(totalPlatformMRR / 1000000).toFixed(0)} Triệu đ
          </div>
          <span className="text-[11px] text-slate-400">ARR ước đạt: {((totalPlatformMRR * 12) / 1000000000).toFixed(2)} tỷ đ/năm</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Tổng quy mô căn hộ quản lý</span>
          <div className="mt-2 text-2xl font-extrabold text-slate-900">
            {totalPlatformUnits.toLocaleString('vi-VN')} căn
          </div>
          <span className="text-[11px] text-indigo-600 font-medium">{totalPlatformResidents} cư dân kết nối</span>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <span className="text-xs text-slate-500 font-semibold block">Sức khỏe hệ thống Cloud</span>
          <div className="mt-2 text-2xl font-extrabold text-emerald-600 flex items-center gap-1.5">
            <Activity className="h-5 w-5" />
            99.98% Uptime
          </div>
          <span className="text-[11px] text-slate-400">API Latency: 42ms • Cloud Run</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 text-xs font-bold gap-2">
        <button
          onClick={() => setActiveTab('tenants')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition ${
            activeTab === 'tenants'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building2 className="h-4 w-4" />
          Danh sách Chung Cư ({tenants.length})
        </button>

        <button
          onClick={() => setActiveTab('licensing')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition ${
            activeTab === 'licensing'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="h-4 w-4" />
          Gói Dịch Vụ & Bản Quyền
        </button>

        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition ${
            activeTab === 'metrics'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Server className="h-4 w-4" />
          Giám Sát Hệ Thống & API Logs
        </button>

        <button
          onClick={() => setActiveTab('leads')}
          className={`flex items-center gap-1.5 px-4 py-3 border-b-2 transition ${
            activeTab === 'leads'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <PhoneCall className="h-4 w-4" />
          Liên Hệ Bán Hàng & Sales Leads ({salesLeads.length})
        </button>
      </div>

      {/* Tab: Tenants */}
      {activeTab === 'tenants' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-5 py-3.5">Mã / Tên Chung Cư</th>
                <th className="px-4 py-3.5">Địa Chỉ</th>
                <th className="px-4 py-3.5">Quy Mô</th>
                <th className="px-4 py-3.5">Lấp Đầy</th>
                <th className="px-4 py-3.5">Gói Bản Quyền</th>
                <th className="px-4 py-3.5">Phí Thuê Bao/Tháng</th>
                <th className="px-4 py-3.5">Trưởng Ban Quản Lý</th>
                <th className="px-4 py-3.5">Trạng Thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {tenants.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4">
                    <span className="font-bold text-slate-900 block">{t.name}</span>
                    <span className="font-mono text-[10px] text-blue-600 font-semibold">{t.code}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-600 max-w-[220px] truncate">{t.address}</td>
                  <td className="px-4 py-4 font-semibold text-slate-800">{t.totalApartments} căn</td>
                  <td className="px-4 py-4 text-emerald-600 font-bold">{t.occupancyRate}%</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        t.package === 'Enterprise'
                          ? 'bg-purple-100 text-purple-700'
                          : t.package === 'Professional'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {t.package}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold text-slate-900">
                    {t.monthlyFee.toLocaleString('vi-VN')} đ
                  </td>
                  <td className="px-4 py-4 text-slate-700">{t.managerName}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-800">
                      {t.status === 'active' ? 'Hoạt động' : 'Dùng thử'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Licensing */}
      {activeTab === 'licensing' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'Gói Standard',
              price: '6.500.000 đ / tháng',
              desc: 'Tối ưu cho chung cư mini và tòa nhà dưới 300 căn',
              features: [
                'Tối đa 300 căn hộ',
                'Quản lý danh sách cư dân & hợp đồng',
                'Hóa đơn điện tử & VietQR tự động',
                'Kanban khiếu nại tiêu chuẩn',
                'Hỗ trợ kỹ thuật qua Email',
              ],
            },
            {
              name: 'Gói Professional',
              price: '11.000.000 đ / tháng',
              popular: true,
              desc: 'Dành cho chung cư thương mại quy mô 300 - 600 căn',
              features: [
                'Tối đa 600 căn hộ',
                'Đầy đủ tính năng Standard',
                'Cổng Cư Dân (Resident Portal)',
                'Tích hợp Gemini AI Gợi ý ưu tiên',
                'Phân quyền nhân sự RBAC ma trận',
                'Hỗ trợ hotline 24/7',
              ],
            },
            {
              name: 'Gói Enterprise Multi-Tower',
              price: '15.000.000 - 25.000.000 đ / tháng',
              desc: 'Đại đô thị, chuỗi chung cư đa tháp và khu phức hợp cao cấp',
              features: [
                'Không giới hạn số căn hộ',
                'Gemini AI Điều hành & Báo cáo tự động',
                'Tích hợp cổng thanh toán ngân hàng trực tiếp',
                'Quản lý trạm sạc xe điện & Barrier thông minh',
                'Dedicated Account Manager & SLA 99.9%',
              ],
            },
          ].map((pkg, i) => (
            <div
              key={i}
              className={`rounded-2xl border p-6 flex flex-col justify-between bg-white shadow-sm ${
                pkg.popular ? 'border-blue-600 ring-2 ring-blue-500/20' : 'border-slate-200'
              }`}
            >
              <div>
                {pkg.popular && (
                  <span className="rounded-full bg-blue-600 text-white px-3 py-0.5 text-[10px] font-bold uppercase mb-2 inline-block">
                    Phổ biến nhất
                  </span>
                )}
                <h3 className="text-base font-bold text-slate-900">{pkg.name}</h3>
                <div className="mt-2 text-xl font-extrabold text-blue-700">{pkg.price}</div>
                <p className="mt-1 text-xs text-slate-500">{pkg.desc}</p>

                <div className="mt-6 space-y-2.5 text-xs text-slate-700">
                  {pkg.features.map((feat, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="mt-6 w-full rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white hover:bg-slate-800 transition">
                Cập nhật chính sách giá
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Tab: System Health Metrics */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 font-semibold block">Hạ Tầng AI Server</span>
              <div className="text-xl font-bold text-slate-900">Google Gemini 3.8 Flash</div>
              <p className="text-[11px] text-slate-400">Thời gian phản hồi AI trung bình: 780ms</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 font-semibold block">Tải CPU & Bộ Nhớ Server</span>
              <div className="text-xl font-bold text-emerald-600">22% Tải trung bình</div>
              <p className="text-[11px] text-slate-400">Tự động Scale-out khi lượng giao dịch tăng</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-2">
              <span className="text-xs text-slate-500 font-semibold block">An Toàn Thông Tin & Dữ Liệu</span>
              <div className="text-xl font-bold text-blue-700">SSL / TLS 1.3 Mã Hóa</div>
              <p className="text-[11px] text-slate-400">Sao lưu dữ liệu định kỳ mỗi 6 tiếng</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Sales Leads */}
      {activeTab === 'leads' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-200 bg-slate-50 font-bold text-slate-600">
              <tr>
                <th className="px-5 py-3.5">Tòa Nhà / Chung Cư Quan Tâm</th>
                <th className="px-4 py-3.5">Người Đại Diện Liên Hệ</th>
                <th className="px-4 py-3.5">Số Điện Thoại</th>
                <th className="px-4 py-3.5">Email</th>
                <th className="px-4 py-3.5">Quy Mô</th>
                <th className="px-4 py-3.5">Gói Đề Xuất</th>
                <th className="px-4 py-3.5">Trạng Thái Bán Hàng</th>
                <th className="px-5 py-3.5 text-right">Hành Động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {salesLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50 transition">
                  <td className="px-5 py-4 font-bold text-slate-900">{lead.buildingName}</td>
                  <td className="px-4 py-4 text-slate-800">{lead.contactPerson}</td>
                  <td className="px-4 py-4 text-slate-600 font-mono">{lead.phone}</td>
                  <td className="px-4 py-4 text-slate-500">{lead.email}</td>
                  <td className="px-4 py-4 font-semibold text-slate-800">{lead.units} căn</td>
                  <td className="px-4 py-4 text-blue-700 font-semibold">{lead.plan}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        lead.status === 'Chờ ký kết'
                          ? 'bg-purple-100 text-purple-700'
                          : lead.status === 'Đang tư vấn demo'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => alert(`Đang kết nối gọi điện cho ${lead.contactPerson} (${lead.phone})...`)}
                      className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                    >
                      Liên hệ demo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal: Thêm Chung Cư Mới */}
      <Modal
        isOpen={showAddTenantModal}
        onClose={() => setShowAddTenantModal(false)}
        title="Thêm Dự Án Chung Cư Mới (New Tenant)"
        footer={
          <>
            <button
              onClick={() => setShowAddTenantModal(false)}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (tenantName && tenantCode) {
                  onAddTenant({
                    name: tenantName,
                    code: tenantCode.toUpperCase(),
                    address: tenantAddress || 'Quận 2, TP. Hồ Chí Minh',
                    totalApartments: tenantUnits,
                    occupancyRate: 90.0,
                    activeResidents: Math.round(tenantUnits * 2.8),
                    package: tenantPackage,
                    managerName: tenantManager || 'Ban Quản trị lâm thời',
                    monthlyFee:
                      tenantPackage === 'Enterprise'
                        ? 18000000
                        : tenantPackage === 'Professional'
                        ? 11000000
                        : 6500000,
                    status: 'active',
                  });
                  setShowAddTenantModal(false);
                }
              }}
              className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700"
            >
              Tạo Tenant & Cấp Bản Quyền
            </button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tên dự án chung cư *</label>
            <input
              type="text"
              value={tenantName}
              onChange={(e) => setTenantName(e.target.value)}
              placeholder="VD: The Metropole Thủ Thiêm"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mã định danh (Code) *</label>
              <input
                type="text"
                value={tenantCode}
                onChange={(e) => setTenantCode(e.target.value)}
                placeholder="VD: MTP-TT"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800 uppercase"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Tổng số căn hộ</label>
              <input
                type="number"
                value={tenantUnits}
                onChange={(e) => setTenantUnits(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Địa chỉ dự án</label>
            <input
              type="text"
              value={tenantAddress}
              onChange={(e) => setTenantAddress(e.target.value)}
              placeholder="VD: Khu đô thị Thủ Thiêm, TP. Thủ Đức, TP. HCM"
              className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Gói dịch vụ SaaS</label>
              <select
                value={tenantPackage}
                onChange={(e) => setTenantPackage(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
              >
                <option value="Standard">Standard (6.5tr/tháng)</option>
                <option value="Professional">Professional (11tr/tháng)</option>
                <option value="Enterprise">Enterprise (18tr/tháng)</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Đại diện Ban Quản Lý</label>
              <input
                type="text"
                value={tenantManager}
                onChange={(e) => setTenantManager(e.target.value)}
                placeholder="VD: Nguyễn Văn Hưng"
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs text-slate-800"
              />
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
