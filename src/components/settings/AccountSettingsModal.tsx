import React, { useState } from 'react';
import {
  User,
  Lock,
  Bell,
  CheckCircle2,
  LogOut,
  Shield,
  Smartphone,
} from 'lucide-react';
import { UserAccount } from '../../types';
import { Modal } from '../common/Modal';

interface AccountSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onUpdateProfile: (updated: Partial<UserAccount>) => void;
  onLogout: () => void;
}

export const AccountSettingsModal: React.FC<AccountSettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateProfile,
  onLogout,
}) => {
  const [tab, setTab] = useState<'profile' | 'password' | 'notifications'>('profile');

  // Profile Form State
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);
  const [email, setEmail] = useState(currentUser.email);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Password Form State
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passChanged, setPassChanged] = useState(false);

  // Notifications State
  const [smsNotify, setSmsNotify] = useState(true);
  const [emailNotify, setEmailNotify] = useState(true);
  const [parcelNotify, setParcelNotify] = useState(true);

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cài Đặt Tài Khoản & Bảo Mật"
      maxWidth="max-w-md"
      footer={
        <div className="flex items-center justify-between w-full">
          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:underline"
          >
            <LogOut className="h-4 w-4" />
            <span>Đăng xuất tài khoản</span>
          </button>
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
          >
            Đóng
          </button>
        </div>
      }
    >
      <div className="space-y-4 text-xs">
        {/* Navigation tabs */}
        <div className="flex border-b border-slate-200 text-xs font-semibold gap-1">
          <button
            onClick={() => setTab('profile')}
            className={`pb-2 px-2.5 border-b-2 transition ${
              tab === 'profile'
                ? 'border-blue-700 text-blue-800 font-bold'
                : 'border-transparent text-slate-500'
            }`}
          >
            Thông tin cá nhân
          </button>
          <button
            onClick={() => setTab('password')}
            className={`pb-2 px-2.5 border-b-2 transition ${
              tab === 'password'
                ? 'border-blue-700 text-blue-800 font-bold'
                : 'border-transparent text-slate-500'
            }`}
          >
            Đổi mật khẩu
          </button>
          <button
            onClick={() => setTab('notifications')}
            className={`pb-2 px-2.5 border-b-2 transition ${
              tab === 'notifications'
                ? 'border-blue-700 text-blue-800 font-bold'
                : 'border-transparent text-slate-500'
            }`}
          >
            Cài đặt thông báo
          </button>
        </div>

        {/* Tab 1: Profile */}
        {tab === 'profile' && (
          <div className="space-y-3 pt-1">
            {savedSuccess && (
              <div className="p-2 rounded bg-emerald-50 text-emerald-800 text-xs flex items-center gap-1.5 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Cập nhật thông tin thành công!</span>
              </div>
            )}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Họ và tên</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded border border-slate-200 p-2 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Số điện thoại liên lạc</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded border border-slate-200 p-2 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Hộp thư Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded border border-slate-200 p-2 text-xs"
              />
            </div>
            {currentUser.apartmentCode && (
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Căn hộ liên kết</label>
                <input
                  type="text"
                  readOnly
                  value={currentUser.apartmentCode}
                  className="w-full rounded border border-slate-200 bg-slate-50 p-2 text-xs font-semibold text-slate-700"
                />
              </div>
            )}
            <button
              onClick={() => {
                onUpdateProfile({ name, phone, email });
                setSavedSuccess(true);
                setTimeout(() => setSavedSuccess(false), 2000);
              }}
              className="w-full rounded bg-blue-700 py-2 text-xs font-semibold text-white hover:bg-blue-800 mt-2"
            >
              Lưu thay đổi hồ sơ
            </button>
          </div>
        )}

        {/* Tab 2: Password */}
        {tab === 'password' && (
          <div className="space-y-3 pt-1">
            {passChanged && (
              <div className="p-2 rounded bg-emerald-50 text-emerald-800 text-xs flex items-center gap-1.5 border border-emerald-200">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>Mật khẩu đã được thay đổi thành công!</span>
              </div>
            )}
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mật khẩu hiện tại</label>
              <input
                type="password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••"
                className="w-full rounded border border-slate-200 p-2 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mật khẩu mới</label>
              <input
                type="password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Tối thiểu 6 ký tự"
                className="w-full rounded border border-slate-200 p-2 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                placeholder="Nhập lại mật khẩu mới"
                className="w-full rounded border border-slate-200 p-2 text-xs"
              />
            </div>
            <button
              onClick={() => {
                if (newPass && newPass === confirmPass) {
                  setPassChanged(true);
                  setCurrentPass('');
                  setNewPass('');
                  setConfirmPass('');
                  setTimeout(() => setPassChanged(false), 2500);
                } else {
                  alert('Mật khẩu xác nhận không khớp hoặc để trống!');
                }
              }}
              className="w-full rounded bg-blue-700 py-2 text-xs font-semibold text-white hover:bg-blue-800 mt-2"
            >
              Cập nhật mật khẩu mới
            </button>
          </div>
        )}

        {/* Tab 3: Notifications */}
        {tab === 'notifications' && (
          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200">
              <div>
                <span className="font-semibold text-slate-900 block">Thông báo cước phí & Hóa đơn mới</span>
                <span className="text-[11px] text-slate-500">Nhận tin nhắn SMS và thông báo ứng dụng</span>
              </div>
              <input
                type="checkbox"
                checked={smsNotify}
                onChange={(e) => setSmsNotify(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200">
              <div>
                <span className="font-semibold text-slate-900 block">Tiến độ xử lý khiếu nại kỹ thuật</span>
                <span className="text-[11px] text-slate-500">Cập nhật khi kỹ sư tiếp nhận và sửa chữa</span>
              </div>
              <input
                type="checkbox"
                checked={emailNotify}
                onChange={(e) => setEmailNotify(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600"
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded border border-slate-200">
              <div>
                <span className="font-semibold text-slate-900 block">Bưu kiện đã tới quầy lễ tân</span>
                <span className="text-[11px] text-slate-500">Nhận thông báo khi shipper gửi hàng tại sảnh</span>
              </div>
              <input
                type="checkbox"
                checked={parcelNotify}
                onChange={(e) => setParcelNotify(e.target.checked)}
                className="h-4 w-4 rounded text-blue-600"
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
