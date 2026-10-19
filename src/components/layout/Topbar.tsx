import React, { useState } from 'react';
import {
  Search,
  Bell,
  Building2,
  ChevronDown,
  Check,
  Shield,
  MessageCircle,
  User,
  LogOut,
  Settings,
  LogIn,
  Menu,
} from 'lucide-react';
import { TenantCondo, UserRole, UserAccount } from '../../types';
import { ANNOUNCEMENTS } from '../../data/mockData';

interface TopbarProps {
  currentTenant: TenantCondo;
  onSelectTenant: (tenant: TenantCondo) => void;
  allTenants: TenantCondo[];
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  currentUser: UserAccount;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenAIChat?: () => void;
  onOpenAuthModal: () => void;
  onOpenSettingsModal: () => void;
  onLogout: () => void;
  onOpenMobileMenu: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({
  currentTenant,
  onSelectTenant,
  allTenants,
  currentRole,
  onSelectRole,
  currentUser,
  searchQuery,
  onSearchChange,
  onOpenAIChat,
  onOpenAuthModal,
  onOpenSettingsModal,
  onLogout,
  onOpenMobileMenu,
}) => {
  const [showTenantDropdown, setShowTenantDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [readNotifications, setReadNotifications] = useState<string[]>([]);

  const roleLabels: Record<UserRole, { label: string; desc: string }> = {
    owner: {
      label: 'Chủ chung cư',
      desc: 'Theo dõi báo cáo khai thác, tài chính & hiệu suất vận hành',
    },
    manager: {
      label: 'Ban Quản lý (Trưởng BQL)',
      desc: 'Điều hành toàn diện, phân công kỹ thuật & duyệt hóa đơn',
    },
    staff: {
      label: 'Nhân viên kỹ thuật / Lễ tân',
      desc: 'Xử lý sự cố, ca trực, cập nhật căn hộ & thu phí',
    },
    resident: {
      label: 'Cư dân căn hộ (A-1204)',
      desc: 'Cổng thanh toán cước, gửi yêu cầu bảo trì & đặt tiện ích',
    },
    superadmin: {
      label: 'Quản trị viên nền tảng',
      desc: 'Quản lý toàn bộ danh sách tòa nhà, bản quyền & hạ tầng',
    },
  };

  const unreadCount = ANNOUNCEMENTS.filter((a) => !readNotifications.includes(a.id)).length;

  // Reuse the same selectors in the desktop toolbar and the second mobile row.
  const renderTenantSelector = (mobile = false) => (
    <div className="relative min-w-0">
      <button
        onClick={() => {
          setShowTenantDropdown(!showTenantDropdown);
          setShowRoleDropdown(false);
          setShowNotifications(false);
          setShowUserDropdown(false);
        }}
        className={mobile
          ? 'flex w-full min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 transition'
          : 'flex max-w-[140px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 transition'}
      >
        <Building2 className="h-4 w-4 shrink-0 text-slate-500" />
        <span className={mobile ? 'min-w-0 flex-1 truncate text-left font-semibold text-slate-900' : 'max-w-[110px] truncate text-left font-semibold text-slate-900'}>
          {currentTenant.name}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      </button>

      {showTenantDropdown && (
        <div className={mobile
          ? 'fixed left-3 right-3 top-[7.5rem] z-50 max-h-[60vh] overflow-y-auto rounded-xl border border-slate-200 bg-white p-2 shadow-lg'
          : 'absolute right-0 z-50 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-2 shadow-lg'}
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Chọn chung cư điều hành
          </div>
          <div className="mt-1 space-y-1">
            {allTenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => {
                  onSelectTenant(tenant);
                  setShowTenantDropdown(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition ${
                  currentTenant.id === tenant.id
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="min-w-0">
                  <div className="truncate font-medium text-slate-900">{tenant.name}</div>
                  <div className="text-[11px] text-slate-400">
                    {tenant.totalApartments} căn • Mã {tenant.code}
                  </div>
                </div>
                {currentTenant.id === tenant.id && <Check className="h-4 w-4 shrink-0 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderRoleSelector = (mobile = false) => (
    <div className="relative min-w-0">
      <button
        onClick={() => {
          setShowRoleDropdown(!showRoleDropdown);
          setShowTenantDropdown(false);
          setShowNotifications(false);
          setShowUserDropdown(false);
        }}
        className={mobile
          ? 'flex w-full min-w-0 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-100 transition'
          : 'flex max-w-[180px] items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 transition'}
      >
        <Shield className="h-3.5 w-3.5 shrink-0 text-slate-500" />
        <span className="min-w-0 flex-1 truncate text-left font-semibold text-slate-900">
          {roleLabels[currentRole].label}
        </span>
        <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
      </button>

      {showRoleDropdown && (
        <div className={mobile
          ? 'fixed left-3 right-3 top-[7.5rem] z-50 rounded-xl border border-slate-200 bg-white p-2 shadow-lg'
          : 'absolute right-0 z-50 mt-2 w-80 rounded-xl border border-slate-200 bg-white p-2 shadow-lg'}
        >
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Chuyển vai trò xem giao diện
          </div>
          <div className="mt-1 space-y-1">
            {(Object.keys(roleLabels) as UserRole[]).map((role) => (
              <button
                key={role}
                onClick={() => {
                  onSelectRole(role);
                  setShowRoleDropdown(false);
                }}
                className={`flex w-full items-center justify-between rounded-lg p-2.5 text-left text-xs transition ${
                  currentRole === role
                    ? 'bg-blue-50 text-blue-900 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                } ${mobile ? 'px-3 py-1.5' : ''}`}
              >
                <div className="min-w-0 flex-1 pr-2">
                  <div className="truncate font-semibold text-slate-900">{roleLabels[role].label}</div>
                  <p className={`mt-0.5 text-[11px] text-slate-500 font-normal leading-normal ${mobile ? 'mt-0 truncate' : ''}`}>
                    {roleLabels[role].desc}
                  </p>
                </div>
                {currentRole === role && <Check className="h-4 w-4 shrink-0 text-blue-600" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
  return (
    <header className="sticky top-0 z-30 w-full border-b border-slate-200 bg-white px-3 sm:px-6 md:flex md:min-h-16 md:items-center">
      {/* Top row: menu, search, notifications and profile */}
      <div className="flex min-h-16 w-full items-center gap-2">
      <button type="button" onClick={onOpenMobileMenu} aria-label="Mở menu" className="shrink-0 rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden">
        <Menu className="h-5 w-5" />
      </button>
      {/* Search Input */}
      <div className="relative min-w-0 max-w-[260px] flex-1 md:w-80 md:flex-none md:max-w-full">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm căn hộ, cư dân, hóa đơn, sự cố..."
          className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
        />
      </div>

      {/* Right controls */}
      <div className="ml-auto mr-0 max-md:mr-4 flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Support Assistant Button */}
        {onOpenAIChat && (
          <button
            onClick={onOpenAIChat}
            className="hidden md:flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <MessageCircle className="h-4 w-4 text-blue-700" />
            <span>Trợ lý 24/7</span>
          </button>
        )}

        {/* Desktop tenant and role selectors; mobile uses the second row below. */}
        <div className="hidden md:block">{renderTenantSelector()}</div>
        <div className="hidden md:block">{renderRoleSelector()}</div>
        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowTenantDropdown(false);
              setShowRoleDropdown(false);
              setShowUserDropdown(false);
            }}
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-200 p-0 text-slate-600 hover:bg-slate-50 transition"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-88 rounded-xl border border-slate-200 bg-white p-3 shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <span className="text-xs font-bold text-slate-800">Thông báo từ BQL</span>
                <button
                  onClick={() => setReadNotifications(ANNOUNCEMENTS.map((a) => a.id))}
                  className="text-[11px] font-medium text-blue-600 hover:underline"
                >
                  Đánh dấu đã đọc
                </button>
              </div>
              <div className="space-y-2 max-h-72 overflow-y-auto">
                {ANNOUNCEMENTS.map((item) => (
                  <div
                    key={item.id}
                    onClick={() =>
                      setReadNotifications((prev) =>
                        prev.includes(item.id) ? prev : [...prev, item.id]
                      )
                    }
                    className={`cursor-pointer rounded-lg p-2.5 transition text-xs ${
                      readNotifications.includes(item.id)
                        ? 'bg-slate-50 text-slate-600'
                        : 'bg-blue-50/50 text-slate-900 border-l-2 border-blue-600'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                      <span className="font-semibold text-blue-700">{item.category}</span>
                      <span>{item.date}</span>
                    </div>
                    <div className="font-semibold leading-snug">{item.title}</div>
                    <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User profile avatar & menu */}
        <div className="relative pl-2 max-sm:pl-2">
          <span aria-hidden="true" className="absolute bottom-1 left-0.5 top-1 w-px bg-slate-200" />
          <button
            onClick={() => {
              setShowUserDropdown(!showUserDropdown);
              setShowTenantDropdown(false);
              setShowRoleDropdown(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 hover:opacity-80 transition text-left translate-x-0.5"
          >
            <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-xs">
              {currentUser.name.charAt(0)}
            </div>
            <div className="hidden lg:block text-xs">
              <span className="block font-semibold text-slate-900 leading-tight">
                {currentUser.name}
              </span>
              <span className="block text-[11px] text-slate-400">
                {roleLabels[currentUser.role]?.label || 'Tài khoản'}
              </span>
            </div>

          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-lg z-50 text-xs">
              <div className="px-3 py-2 border-b border-slate-100">
                <span className="font-bold text-slate-900 block">{currentUser.name}</span>
                <span className="text-[11px] text-slate-500 block truncate">{currentUser.phone}</span>
                {currentUser.apartmentCode && (
                  <span className="text-[10px] text-blue-700 font-semibold block mt-0.5">
                    Căn hộ {currentUser.apartmentCode}
                  </span>
                )}
              </div>

              <div className="space-y-0.5 py-1">
                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenSettingsModal();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <Settings className="h-4 w-4 text-slate-500" />
                  <span>Cài đặt tài khoản & Hồ sơ</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onOpenAuthModal();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-50 text-left font-medium"
                >
                  <LogIn className="h-4 w-4 text-slate-500" />
                  <span>Đổi tài khoản / Đăng ký mới</span>
                </button>

                <button
                  onClick={() => {
                    setShowUserDropdown(false);
                    onLogout();
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-rose-700 hover:bg-rose-50 text-left font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* Second row on mobile: full-width building and role selectors */}
      <div className="grid grid-cols-2 gap-2 pb-3 md:hidden">
        {renderTenantSelector(true)}
        {renderRoleSelector(true)}
      </div>
    </header>
  );
};
