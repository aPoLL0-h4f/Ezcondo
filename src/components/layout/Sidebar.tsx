import React from 'react';
import {
  LayoutDashboard,
  Building,
  Users,
  Receipt,
  MessageSquareWarning,
  UserCheck,
  BarChart3,
  Home,
  Shield,
  PhoneCall,
  CheckCircle2,
  FileCheck,
  BookOpen,
} from 'lucide-react';
import { TenantCondo, UserRole } from '../../types';

export type NavTab =
  | 'dashboard'
  | 'apartments'
  | 'residents'
  | 'billing'
  | 'complaints'
  | 'services'
  | 'handbook'
  | 'staff'
  | 'reports'
  | 'resident_portal'
  | 'super_admin';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  currentTenant: TenantCondo;
  currentRole: UserRole;
  openComplaintsCount: number;
  overdueInvoicesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  currentTenant,
  currentRole,
  openComplaintsCount,
  overdueInvoicesCount,
}) => {
  const navItems = [
    {
      id: 'dashboard' as NavTab,
      label: 'Tổng quan vận hành',
      icon: LayoutDashboard,
      roles: ['owner', 'manager', 'staff', 'superadmin'],
    },
    {
      id: 'apartments' as NavTab,
      label: 'Danh mục căn hộ',
      icon: Building,
      roles: ['owner', 'manager', 'staff', 'superadmin'],
    },
    {
      id: 'residents' as NavTab,
      label: 'Hồ sơ cư dân & Hợp đồng',
      icon: Users,
      roles: ['owner', 'manager', 'staff', 'superadmin'],
    },
    {
      id: 'billing' as NavTab,
      label: 'Hóa đơn & Thu phí',
      icon: Receipt,
      badge: overdueInvoicesCount > 0 ? `${overdueInvoicesCount} nợ` : undefined,
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
      roles: ['owner', 'manager', 'staff', 'resident', 'superadmin'],
    },
    {
      id: 'complaints' as NavTab,
      label: 'Khiếu nại & Kỹ thuật',
      icon: MessageSquareWarning,
      badge: openComplaintsCount > 0 ? `${openComplaintsCount}` : undefined,
      badgeColor: 'bg-amber-50 text-amber-700 border border-amber-200',
      roles: ['owner', 'manager', 'staff', 'resident', 'superadmin'],
    },
    {
      id: 'services' as NavTab,
      label: 'Dịch vụ & Bưu kiện',
      icon: FileCheck,
      roles: ['owner', 'manager', 'staff', 'resident', 'superadmin'],
    },
    {
      id: 'handbook' as NavTab,
      label: 'Sổ tay nội quy & PCCC',
      icon: BookOpen,
      roles: ['owner', 'manager', 'staff', 'resident', 'superadmin'],
    },
    {
      id: 'staff' as NavTab,
      label: 'Nhân sự & Ca trực',
      icon: UserCheck,
      roles: ['owner', 'manager', 'superadmin'],
    },
    {
      id: 'reports' as NavTab,
      label: 'Báo cáo & Thống kê',
      icon: BarChart3,
      roles: ['owner', 'manager', 'superadmin'],
    },
    {
      id: 'resident_portal' as NavTab,
      label: 'Cổng thông tin Cư dân',
      icon: Home,
      roles: ['owner', 'manager', 'staff', 'resident', 'superadmin'],
      highlight: currentRole === 'resident',
    },
    {
      id: 'super_admin' as NavTab,
      label: 'Quản trị hệ thống (SaaS)',
      icon: Shield,
      roles: ['superadmin', 'owner', 'manager'],
    },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200 bg-white text-slate-800 shadow-sm">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-white font-bold shadow-sm">
          <Building className="h-5 w-5" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-base tracking-tight text-slate-900">EZCondo</span>
            <span className="text-[10px] text-slate-400 font-medium">BQL</span>
          </div>
          <p className="text-[11px] text-slate-500 truncate max-w-[155px]">
            Hệ thống quản lý tòa nhà
          </p>
        </div>
      </div>

      {/* Condominium Multi-tenant Info Card */}
      <div className="mx-3 mt-3 rounded-xl bg-slate-50 p-3 border border-slate-200/80">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <span>Tòa nhà đang chọn:</span>
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <CheckCircle2 className="h-3 w-3" /> Đang vận hành
          </span>
        </div>
        <p className="mt-1 font-semibold text-xs text-slate-900 truncate">{currentTenant.name}</p>
        <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-200/60">
          <span>{currentTenant.totalApartments} Căn hộ</span>
          <span className="text-slate-600 font-medium">
            Mã: {currentTenant.code}
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        <div className="px-3 pb-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Chức năng
        </div>

        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const isRoleAllowed = item.roles.includes(currentRole);

          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition ${
                isActive
                  ? 'bg-blue-50 text-blue-700 font-semibold'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              } ${!isRoleAllowed ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center gap-2.5">
                <item.icon
                  className={`h-4 w-4 transition ${
                    isActive ? 'text-blue-700' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5">
                {item.highlight && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                )}
                {item.badge && (
                  <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* Contact & Support Footer */}
      <div className="border-t border-slate-100 p-3 bg-slate-50/60">
        <div className="flex items-center justify-between text-xs text-slate-600 px-1 py-0.5">
          <div className="flex items-center gap-2">
            <PhoneCall className="h-4 w-4 text-slate-500" />
            <div>
              <span className="block text-[10px] text-slate-400 leading-none">Hotline Lễ tân</span>
              <span className="font-bold text-slate-800 text-xs">1900 6868</span>
            </div>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Ca trực 24/7</span>
        </div>
      </div>
    </aside>
  );
};
