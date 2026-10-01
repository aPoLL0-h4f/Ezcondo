import React, { useState } from 'react';
import {
  X,
  Phone,
  Lock,
  Mail,
  Building,
  User,
  CheckCircle2,
  ArrowRight,
  Shield,
  KeyRound,
  FileCheck,
} from 'lucide-react';
import { UserAccount, UserRole, TenantCondo } from '../../types';
import { DEFAULT_ACCOUNTS } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  onRegisterTenantSuccess: (newTenant: Partial<TenantCondo>, user: UserAccount) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onRegisterTenantSuccess,
}) => {
  const [mode, setMode] = useState<'signin' | 'signup_resident' | 'signup_condo' | 'forgot'>('signin');

  // Sign in form state
  const [loginIdentifier, setLoginIdentifier] = useState('0908123456');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [rememberMe, setRememberMe] = useState(true);

  // Resident registration form state
  const [resApt, setResApt] = useState('');
  const [resName, setResName] = useState('');
  const [resPhone, setResPhone] = useState('');
  const [resEmail, setResEmail] = useState('');
  const [resIdCard, setResIdCard] = useState('');
  const [resRole, setResRole] = useState<'Chủ hộ' | 'Khách thuê' | 'Thành viên'>('Chủ hộ');
  const [resPassword, setResPassword] = useState('');
  const [resSuccess, setResSuccess] = useState(false);

  // Condo registration form state
  const [condoName, setCondoName] = useState('');
  const [condoAddress, setCondoAddress] = useState('');
  const [condoUnits, setCondoUnits] = useState(400);
  const [condoManager, setCondoManager] = useState('');
  const [condoPhone, setCondoPhone] = useState('');
  const [condoEmail, setCondoEmail] = useState('');
  const [condoPackage, setCondoPackage] = useState<'Standard' | 'Professional' | 'Enterprise'>('Professional');
  const [condoSuccess, setCondoSuccess] = useState(false);

  // Forgot password form state
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotStep, setForgotStep] = useState<'phone' | 'otp' | 'done'>('phone');
  const [otpCode, setOtpCode] = useState('');

  if (!isOpen) return null;

  const handleSignIn = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Check against default accounts or fallback
    const matched = DEFAULT_ACCOUNTS.find(
      (a) => a.phone === loginIdentifier.replace(/\s+/g, '') || a.email.toLowerCase() === loginIdentifier.toLowerCase()
    );

    if (matched) {
      onLoginSuccess(matched as UserAccount);
    } else {
      // Create user session for provided input
      onLoginSuccess({
        id: `usr-${Date.now()}`,
        name: loginIdentifier.includes('@') ? loginIdentifier.split('@')[0] : 'Cư dân EZCondo',
        phone: loginIdentifier,
        email: loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier}@cudan.vn`,
        role: 'resident',
        tenantId: 'tenant-1',
        apartmentCode: 'A-1204',
        createdAt: new Date().toISOString().split('T')[0],
      });
    }
    onClose();
  };

  const handleQuickDemoLogin = (acc: typeof DEFAULT_ACCOUNTS[0]) => {
    onLoginSuccess(acc as UserAccount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header with Close */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-900">EZCondo</span>
              <span className="text-[10px] text-slate-400 font-medium">BQL Tòa Nhà</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {mode === 'signin' && 'Đăng nhập vào hệ thống vận hành & cổng cư dân'}
              {mode === 'signup_resident' && 'Đăng ký tài khoản cư dân nhận quyền quản lý căn hộ'}
              {mode === 'signup_condo' && 'Đăng ký dùng thử hệ thống cho Ban Quản trị tòa nhà mới'}
              {mode === 'forgot' && 'Khôi phục mật khẩu tài khoản'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {/* 1. MÀN HÌNH ĐĂNG NHẬP */}
          {mode === 'signin' && (
            <div className="space-y-4">
              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số điện thoại hoặc Email</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder="0908 123 456 hoặc email..."
                      className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-semibold text-slate-700">Mật khẩu</label>
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-blue-700 hover:underline"
                    >
                      Quên mật khẩu?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Nhập mật khẩu..."
                      className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition shadow-sm mt-2"
                >
                  Đăng nhập
                </button>
              </form>

              {/* Fast Demo Accounts Picker */}
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Đăng nhập nhanh theo vai trò mẫu:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {DEFAULT_ACCOUNTS.map((acc) => (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => handleQuickDemoLogin(acc)}
                      className="rounded-lg border border-slate-200 p-2 text-left hover:bg-slate-50 transition"
                    >
                      <span className="font-semibold text-slate-900 block truncate">{acc.name}</span>
                      <span className="text-[10px] text-slate-500 capitalize">
                        {acc.role === 'resident'
                          ? `Cư dân (${acc.apartmentCode})`
                          : acc.role === 'manager'
                          ? 'Ban Quản lý'
                          : acc.role === 'staff'
                          ? 'Kỹ sư MEP'
                          : acc.role === 'owner'
                          ? 'Chủ chung cư'
                          : 'Super Admin'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Bottom links to register */}
              <div className="pt-2 text-center text-slate-600 space-y-1">
                <div>
                  Bạn là cư dân mới?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup_resident')}
                    className="font-semibold text-blue-700 hover:underline"
                  >
                    Đăng ký tài khoản cư dân
                  </button>
                </div>
                <div>
                  Bạn muốn triển khai cho tòa nhà?{' '}
                  <button
                    type="button"
                    onClick={() => setMode('signup_condo')}
                    className="font-semibold text-slate-800 hover:underline"
                  >
                    Đăng ký dùng thử BQL
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. MÀN HÌNH ĐĂNG KÝ CƯ DÂN */}
          {mode === 'signup_resident' && (
            <div className="space-y-3.5">
              {!resSuccess ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Mã căn hộ *</label>
                      <input
                        type="text"
                        value={resApt}
                        onChange={(e) => setResApt(e.target.value)}
                        placeholder="VD: A-1204"
                        className="w-full rounded-lg border border-slate-200 p-2"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Vai trò</label>
                      <select
                        value={resRole}
                        onChange={(e) => setResRole(e.target.value as any)}
                        className="w-full rounded-lg border border-slate-200 p-2"
                      >
                        <option value="Chủ hộ">Chủ hộ sở hữu</option>
                        <option value="Khách thuê">Khách thuê dài hạn</option>
                        <option value="Thành viên">Thành viên gia đình</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Họ và tên cư dân *</label>
                    <input
                      type="text"
                      value={resName}
                      onChange={(e) => setResName(e.target.value)}
                      placeholder="VD: Nguyễn Văn An"
                      className="w-full rounded-lg border border-slate-200 p-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Số điện thoại *</label>
                      <input
                        type="text"
                        value={resPhone}
                        onChange={(e) => setResPhone(e.target.value)}
                        placeholder="0918 223 344"
                        className="w-full rounded-lg border border-slate-200 p-2"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Số CCCD / Hộ chiếu</label>
                      <input
                        type="text"
                        value={resIdCard}
                        onChange={(e) => setResIdCard(e.target.value)}
                        placeholder="079090001234"
                        className="w-full rounded-lg border border-slate-200 p-2"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Mật khẩu khởi tạo *</label>
                    <input
                      type="password"
                      value={resPassword}
                      onChange={(e) => setResPassword(e.target.value)}
                      placeholder="Tối thiểu 6 ký tự"
                      className="w-full rounded-lg border border-slate-200 p-2"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (resApt && resName && resPhone) {
                        setResSuccess(true);
                      } else {
                        alert('Vui lòng điền đủ Mã căn hộ, Họ tên và Số điện thoại!');
                      }
                    }}
                    className="w-full rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition shadow-sm mt-2"
                  >
                    Gửi hồ sơ đăng ký tài khoản
                  </button>
                </>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900">Đăng Ký Tài Khoản Thành Công!</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Hồ sơ căn hộ <strong>{resApt}</strong> của cư dân <strong>{resName}</strong> đã được chuyển đến Ban Quản lý phê duyệt. Mã kích hoạt đã được gửi về số {resPhone}.
                  </p>
                  <button
                    onClick={() => {
                      onLoginSuccess({
                        id: `usr-${Date.now()}`,
                        name: resName,
                        phone: resPhone,
                        email: resEmail || `${resPhone}@cudan.vn`,
                        role: 'resident',
                        tenantId: 'tenant-1',
                        apartmentCode: resApt,
                        createdAt: new Date().toISOString().split('T')[0],
                      });
                      onClose();
                    }}
                    className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Vào Cổng Cư Dân ngay
                  </button>
                </div>
              )}

              <div className="pt-2 text-center text-slate-600">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-semibold text-blue-700 hover:underline"
                >
                  Quay lại Đăng nhập
                </button>
              </div>
            </div>
          )}

          {/* 3. MÀN HÌNH ĐĂNG KÝ TÒA NHÀ MỚI (BQL / CHỦ CHUNG CƯ) */}
          {mode === 'signup_condo' && (
            <div className="space-y-3.5">
              {!condoSuccess ? (
                <>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tên chung cư / Tòa nhà *</label>
                    <input
                      type="text"
                      value={condoName}
                      onChange={(e) => setCondoName(e.target.value)}
                      placeholder="VD: Chung cư Gateway Thảo Điền"
                      className="w-full rounded-lg border border-slate-200 p-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Quy mô số căn hộ</label>
                      <input
                        type="number"
                        value={condoUnits}
                        onChange={(e) => setCondoUnits(Number(e.target.value))}
                        className="w-full rounded-lg border border-slate-200 p-2"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Gói phần mềm</label>
                      <select
                        value={condoPackage}
                        onChange={(e) => setCondoPackage(e.target.value as any)}
                        className="w-full rounded-lg border border-slate-200 p-2"
                      >
                        <option value="Standard">Gói Standard (Dưới 300 căn)</option>
                        <option value="Professional">Gói Professional (300 - 600 căn)</option>
                        <option value="Enterprise">Gói Enterprise (Đại đô thị)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Địa chỉ tòa nhà *</label>
                    <input
                      type="text"
                      value={condoAddress}
                      onChange={(e) => setCondoAddress(e.target.value)}
                      placeholder="Số nhà, Đường, Phường, Quận, Thành phố..."
                      className="w-full rounded-lg border border-slate-200 p-2"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Họ tên Trưởng BQL *</label>
                      <input
                        type="text"
                        value={condoManager}
                        onChange={(e) => setCondoManager(e.target.value)}
                        placeholder="VD: Lê Hoàng Nam"
                        className="w-full rounded-lg border border-slate-200 p-2"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Số điện thoại liên hệ *</label>
                      <input
                        type="text"
                        value={condoPhone}
                        onChange={(e) => setCondoPhone(e.target.value)}
                        placeholder="0912 888 999"
                        className="w-full rounded-lg border border-slate-200 p-2"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (condoName && condoManager && condoPhone) {
                        const newTenant: Partial<TenantCondo> = {
                          name: condoName,
                          code: condoName.split(' ').map((w) => w[0]).join('').toUpperCase() || 'NEW',
                          address: condoAddress,
                          totalApartments: condoUnits,
                          occupancyRate: 90.0,
                          activeResidents: Math.round(condoUnits * 2.5),
                          managerName: condoManager,
                          package: condoPackage,
                          status: 'trial',
                          monthlyFee: condoPackage === 'Enterprise' ? 18000000 : 11000000,
                          createdAt: new Date().toISOString().split('T')[0],
                        };
                        const managerUser: UserAccount = {
                          id: `usr-${Date.now()}`,
                          name: condoManager,
                          phone: condoPhone,
                          email: condoEmail || `${condoPhone}@ezcondo.vn`,
                          role: 'manager',
                          tenantId: 'tenant-new',
                          createdAt: new Date().toISOString().split('T')[0],
                        };
                        onRegisterTenantSuccess(newTenant, managerUser);
                        setCondoSuccess(true);
                      } else {
                        alert('Vui lòng điền đủ Tên chung cư, Trưởng BQL và Số điện thoại!');
                      }
                    }}
                    className="w-full rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800 transition shadow-sm mt-2"
                  >
                    Kích hoạt hệ thống & Dùng thử 30 ngày
                  </button>
                </>
              ) : (
                <div className="py-6 text-center space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900">Khởi Tạo Dự Án Thành Công!</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Tòa nhà <strong>{condoName}</strong> đã được khởi tạo trên nền tảng EZCondo SaaS. Bạn đang đăng nhập với vai trò Trưởng Ban Quản lý.
                  </p>
                  <button
                    onClick={onClose}
                    className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Bắt đầu điều hành
                  </button>
                </div>
              )}

              <div className="pt-2 text-center text-slate-600">
                Đã có tài khoản?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-semibold text-blue-700 hover:underline"
                >
                  Quay lại Đăng nhập
                </button>
              </div>
            </div>
          )}

          {/* 4. MÀN HÌNH QUÊN MẬT KHẨU */}
          {mode === 'forgot' && (
            <div className="space-y-4">
              {forgotStep === 'phone' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    Nhập số điện thoại đã đăng ký tài khoản cư dân hoặc BQL để nhận mã xác minh OTP:
                  </p>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Số điện thoại</label>
                    <input
                      type="text"
                      value={forgotPhone}
                      onChange={(e) => setForgotPhone(e.target.value)}
                      placeholder="VD: 0908 123 456"
                      className="w-full rounded-lg border border-slate-200 p-2"
                    />
                  </div>
                  <button
                    onClick={() => {
                      if (forgotPhone) setForgotStep('otp');
                      else alert('Vui lòng nhập số điện thoại');
                    }}
                    className="w-full rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
                  >
                    Gửi mã xác nhận SMS
                  </button>
                </div>
              )}

              {forgotStep === 'otp' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-600">
                    Mã xác nhận 6 số đã được gửi tới số <strong>{forgotPhone}</strong>. Vui lòng nhập mã:
                  </p>
                  <input
                    type="text"
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="123456"
                    className="w-full text-center text-lg font-mono tracking-widest rounded-lg border border-slate-200 p-2.5"
                  />
                  <button
                    onClick={() => setForgotStep('done')}
                    className="w-full rounded-lg bg-blue-700 py-2.5 text-xs font-bold text-white hover:bg-blue-800"
                  >
                    Xác minh & Đặt lại mật khẩu
                  </button>
                </div>
              )}

              {forgotStep === 'done' && (
                <div className="py-6 text-center space-y-3">
                  <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-900">Mật Khẩu Đã Được Khôi Phục!</h4>
                  <p className="text-xs text-slate-500">
                    Mật khẩu tạm thời mới đã được gửi qua tin nhắn SMS tới số của bạn.
                  </p>
                  <button
                    onClick={() => {
                      setMode('signin');
                      setForgotStep('phone');
                    }}
                    className="rounded-lg bg-blue-700 px-4 py-2 text-xs font-semibold text-white"
                  >
                    Đăng nhập ngay
                  </button>
                </div>
              )}

              <div className="pt-2 text-center text-slate-600">
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="font-semibold text-blue-700 hover:underline"
                >
                  Quay lại Đăng nhập
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
