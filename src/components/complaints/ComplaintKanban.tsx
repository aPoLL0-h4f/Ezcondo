import React, { useState } from 'react';
import {
  Plus,
  Clock,
  Send,
  AlertTriangle,
  User,
  ArrowRight,
  ArrowLeft,
  Wrench,
  RefreshCw,
  MessageSquare,
} from 'lucide-react';
import { Complaint, ComplaintPriority, ComplaintStatus, UserRole } from '../../types';
import { Drawer } from '../common/Drawer';
import { Modal } from '../common/Modal';

interface ComplaintKanbanProps {
  complaints: Complaint[];
  currentRole: UserRole;
  onUpdateComplaintStatus: (ticketId: string, nextStatus: ComplaintStatus) => void;
  onAddMessage: (ticketId: string, message: string, senderRole: any) => void;
  onCreateComplaint: (newComplaint: Partial<Complaint>) => void;
  onAssignStaff: (ticketId: string, staffName: string, deadline: string) => void;
}

export const ComplaintKanban: React.FC<ComplaintKanbanProps> = ({
  complaints,
  currentRole,
  onUpdateComplaintStatus,
  onAddMessage,
  onCreateComplaint,
  onAssignStaff,
}) => {
  const [selectedTicket, setSelectedTicket] = useState<Complaint | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);

  // New ticket modal
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<Complaint['category']>('Kỹ thuật - Nước');
  const [newApartment, setNewApartment] = useState(currentRole === 'resident' ? 'A-1204' : '');
  const [newResidentName, setNewResidentName] = useState(currentRole === 'resident' ? 'Nguyễn Văn Minh' : '');
  const [newPhone, setNewPhone] = useState(currentRole === 'resident' ? '0908 123 456' : '');
  const [newPriority, setNewPriority] = useState<ComplaintPriority>('high');
  const [newDescription, setNewDescription] = useState('');

  // Assign staff form
  const [assigneeName, setAssigneeName] = useState('KTV Phạm Văn Tuấn');
  const [assigneeDeadline, setAssigneeDeadline] = useState('2026-10-02 12:00');

  // Columns definition
  const columns: { id: ComplaintStatus; title: string }[] = [
    { id: 'new', title: 'Mới tiếp nhận' },
    { id: 'in_progress', title: 'Đang xử lý' },
    { id: 'waiting_resident', title: 'Chờ phản hồi cư dân' },
    { id: 'resolved', title: 'Đã hoàn thành' },
    { id: 'closed', title: 'Đã đóng' },
  ];

  const priorityLabel = (p: ComplaintPriority) => {
    switch (p) {
      case 'urgent':
        return <span className="text-rose-700 font-semibold text-[11px]">Khẩn cấp</span>;
      case 'high':
        return <span className="text-amber-700 font-medium text-[11px]">Ưu tiên cao</span>;
      case 'medium':
        return <span className="text-blue-700 font-medium text-[11px]">Bình thường</span>;
      case 'low':
        return <span className="text-slate-500 text-[11px]">Thấp</span>;
    }
  };

  // Run AI Complaint Analysis
  const requestAIRecommendation = async (ticket: Complaint) => {
    setLoadingAI(true);
    try {
      const res = await fetch('/api/ai/complaint-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: ticket.title,
          apartment: ticket.apartmentCode,
          sender: ticket.residentName,
          category: ticket.category,
          description: ticket.description,
        }),
      });
      const data = await res.json();
      if (data.recommendation) {
        setSelectedTicket((prev) => {
          if (!prev) return null;
          return {
            ...prev,
            aiAnalysis: data.recommendation,
          };
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingAI(false);
    }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !selectedTicket) return;
    const roleTitle =
      currentRole === 'resident'
        ? 'Cư dân'
        : currentRole === 'staff'
        ? 'Nhân viên kỹ thuật'
        : 'Ban Quản lý';

    onAddMessage(selectedTicket.id, chatInput, roleTitle);

    setSelectedTicket((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [
          ...prev.messages,
          {
            id: `msg-${Date.now()}`,
            senderName:
              currentRole === 'resident'
                ? prev.residentName
                : currentRole === 'staff'
                ? 'KTV Trực ban'
                : 'Ban Quản trị',
            senderRole: roleTitle,
            content: chatInput,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          },
        ],
      };
    });
    setChatInput('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Theo Dõi Khiếu Nại & Xử Lý Sự Cố (Kanban)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Quy trình tiếp nhận, điều phối kỹ sư cơ điện & trao đổi thông tin với cư dân
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="flex items-center gap-1.5 rounded-lg bg-blue-700 px-3.5 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition"
        >
          <Plus className="h-4 w-4" />
          <span>Tạo phiếu khiếu nại mới</span>
        </button>
      </div>

      {/* Kanban 5 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4 items-start">
        {columns.map((col) => {
          const colTickets = complaints.filter((c) => c.status === col.id);

          return (
            <div
              key={col.id}
              className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 flex flex-col max-h-[82vh]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200">
                <h3 className="font-semibold text-xs text-slate-800">{col.title}</h3>
                <span className="text-xs font-bold text-slate-500">
                  {colTickets.length}
                </span>
              </div>

              {/* Column Cards */}
              <div className="space-y-2.5 overflow-y-auto pr-0.5 flex-1">
                {colTickets.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400 italic">
                    Trống
                  </div>
                ) : (
                  colTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => {
                        setSelectedTicket(ticket);
                        if (!ticket.aiAnalysis) {
                          requestAIRecommendation(ticket);
                        }
                      }}
                      className="cursor-pointer rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:border-slate-300 transition space-y-2"
                    >
                      {/* Top tags */}
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{ticket.apartmentCode}</span>
                        {priorityLabel(ticket.priority)}
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-semibold text-slate-800 line-clamp-2 leading-snug">
                        {ticket.title}
                      </h4>

                      {/* Category tag */}
                      <div className="text-[11px] text-slate-500">
                        {ticket.category}
                      </div>

                      {/* Assignee & time */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="truncate max-w-[90px]">{ticket.assignedTo || 'Chưa phân công'}</span>
                        <span>{ticket.createdAt.split(' ')[1] || ticket.createdAt}</span>
                      </div>

                      {/* Move Status Buttons */}
                      <div
                        className="flex items-center justify-between pt-1 text-[11px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {col.id !== 'new' && (
                          <button
                            onClick={() => {
                              const prevIdx = columns.findIndex((c) => c.id === col.id) - 1;
                              if (prevIdx >= 0) {
                                onUpdateComplaintStatus(ticket.id, columns[prevIdx].id);
                              }
                            }}
                            className="text-slate-400 hover:text-slate-700 flex items-center gap-0.5"
                          >
                            <ArrowLeft className="h-3 w-3" />
                            Trước
                          </button>
                        )}
                        {col.id !== 'closed' && (
                          <button
                            onClick={() => {
                              const nextIdx = columns.findIndex((c) => c.id === col.id) + 1;
                              if (nextIdx < columns.length) {
                                onUpdateComplaintStatus(ticket.id, columns[nextIdx].id);
                              }
                            }}
                            className="text-blue-700 font-semibold hover:underline flex items-center gap-0.5 ml-auto"
                          >
                            Tiếp
                            <ArrowRight className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer: Chi tiết Khiếu Nại */}
      <Drawer
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        title={`Phiếu Sự Cố: ${selectedTicket?.ticketCode}`}
        subtitle={`${selectedTicket?.category} • Căn hộ ${selectedTicket?.apartmentCode} • ${selectedTicket?.residentName}`}
        width="max-w-2xl"
        footer={
          selectedTicket ? (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Trạng thái:</span>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => {
                    const nextSt = e.target.value as ComplaintStatus;
                    onUpdateComplaintStatus(selectedTicket.id, nextSt);
                    setSelectedTicket({ ...selectedTicket, status: nextSt });
                  }}
                  className="rounded border border-slate-200 py-1 px-2 text-xs font-semibold text-slate-800 focus:outline-none"
                >
                  <option value="new">Mới tiếp nhận</option>
                  <option value="in_progress">Đang xử lý</option>
                  <option value="waiting_resident">Chờ phản hồi cư dân</option>
                  <option value="resolved">Đã hoàn thành</option>
                  <option value="closed">Đã đóng</option>
                </select>
              </div>

              <button
                onClick={() => setSelectedTicket(null)}
                className="rounded-lg bg-slate-800 px-4 py-1.5 text-xs font-semibold text-white"
              >
                Đóng
              </button>
            </div>
          ) : undefined
        }
      >
        {selectedTicket && (
          <div className="space-y-5">
            {/* Top Info Banner */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">{selectedTicket.title}</h3>
                {priorityLabel(selectedTicket.priority)}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded border border-slate-200">
                {selectedTicket.description}
              </p>
              <div className="flex flex-wrap gap-3 text-xs text-slate-500 pt-1">
                <span>Cư dân: <strong className="text-slate-800">{selectedTicket.residentName}</strong> ({selectedTicket.residentPhone})</span>
                <span>Phụ trách: <strong className="text-slate-800">{selectedTicket.assignedTo || 'Chưa gán'}</strong></span>
                <span>Hạn SLA: <strong className="text-slate-800">{selectedTicket.deadline || 'Trong ngày'}</strong></span>
              </div>
            </div>

            {/* Photos if any */}
            {selectedTicket.images && selectedTicket.images.length > 0 && (
              <div>
                <span className="text-xs font-semibold text-slate-700 block mb-2">Ảnh chụp hiện trường:</span>
                <div className="flex gap-2">
                  {selectedTicket.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Ảnh sự cố"
                      className="h-28 w-40 object-cover rounded-lg border border-slate-200"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Technical Suggestion & Guidance (Clean human style) */}
            <div className="rounded-xl border border-blue-200 bg-blue-50/40 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Wrench className="h-4 w-4 text-blue-700" />
                  Gợi Ý Phương Án Xử Lý & Chẩn Đoán Kỹ Thuật
                </h4>
                <button
                  onClick={() => requestAIRecommendation(selectedTicket)}
                  disabled={loadingAI}
                  className="rounded border border-blue-200 bg-white px-2 py-0.5 text-[11px] font-medium text-blue-700 hover:bg-blue-50 flex items-center gap-1"
                >
                  <RefreshCw className={`h-3 w-3 ${loadingAI ? 'animate-spin' : ''}`} />
                  Cập nhật gợi ý
                </button>
              </div>

              {selectedTicket.aiAnalysis ? (
                <div className="space-y-2 text-xs">
                  <div className="rounded-lg bg-white p-2.5 border border-blue-100 text-slate-800">
                    <strong>Chẩn đoán:</strong> {selectedTicket.aiAnalysis.diagnosis}
                  </div>

                  <div className="rounded-lg bg-white p-2.5 border border-blue-100">
                    <strong className="text-slate-900 block mb-1">Các bước xử lý khuyến nghị:</strong>
                    <ol className="list-decimal list-inside space-y-1 text-slate-700">
                      {selectedTicket.aiAnalysis.actionSteps?.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  </div>

                  <div className="rounded-lg bg-white p-2.5 border border-blue-100 space-y-1">
                    <div className="flex items-center justify-between">
                      <strong className="text-slate-900">Mẫu tin phản hồi cư dân:</strong>
                      <button
                        onClick={() => setChatInput(selectedTicket.aiAnalysis?.suggestedResponse || '')}
                        className="text-[11px] text-blue-700 underline font-medium"
                      >
                        Sử dụng nội dung này
                      </button>
                    </div>
                    <p className="italic text-slate-600">
                      "{selectedTicket.aiAnalysis.suggestedResponse}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                    <span>Dự toán: <strong>{selectedTicket.aiAnalysis.estimatedCost}</strong></span>
                    <span>Thời gian cam kết: <strong>{selectedTicket.aiAnalysis.targetTime}</strong></span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-3 text-xs text-slate-500">
                  {loadingAI ? 'Đang tổng hợp phương án kỹ thuật...' : 'Chưa có phân tích.'}
                </div>
              )}
            </div>

            {/* Chat trao đổi trực tiếp */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-900">
                Nhật Ký Trao Đổi (Cư dân – Kỹ thuật – Ban Quản lý)
              </h4>

              <div className="space-y-2 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3">
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`rounded-lg p-2.5 text-xs shadow-xs max-w-[85%] ${
                      m.senderRole === 'Cư dân'
                        ? 'bg-amber-50 text-slate-900 border border-amber-200 ml-auto'
                        : 'bg-white text-slate-900 border border-slate-200 mr-auto'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 gap-3">
                      <span className="font-semibold text-slate-800">
                        {m.senderName} ({m.senderRole})
                      </span>
                      <span>{m.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{m.content}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage();
                  }}
                  placeholder="Nhập nội dung trao đổi hoặc hướng dẫn cho cư dân..."
                  className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-800 focus:border-blue-600 focus:outline-none"
                />
                <button
                  onClick={handleSendMessage}
                  className="rounded-lg bg-blue-700 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-800 transition"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Phân công nhân sự */}
            <div className="rounded-lg border border-slate-200 p-3.5 bg-slate-50 space-y-2.5">
              <h4 className="text-xs font-bold text-slate-900">Phân Công Nhân Sự Trực Tiếp</h4>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-500 block mb-1">Kỹ thuật viên</label>
                  <select
                    value={assigneeName}
                    onChange={(e) => setAssigneeName(e.target.value)}
                    className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs"
                  >
                    <option value="KTV Phạm Văn Tuấn">KTV Phạm Văn Tuấn (Kỹ sư MEP)</option>
                    <option value="KTV Vũ Quốc Bảo">KTV Vũ Quốc Bảo (Điện nước)</option>
                    <option value="KTV Lê Văn Hùng">KTV Lê Văn Hùng (Bảo trì cơ điện)</option>
                    <option value="Đội An ninh Ca 1">Đội An ninh Ca 1</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-500 block mb-1">Thời hạn hoàn tất</label>
                  <input
                    type="text"
                    value={assigneeDeadline}
                    onChange={(e) => setAssigneeDeadline(e.target.value)}
                    className="w-full rounded border border-slate-200 bg-white p-1.5 text-xs"
                  />
                </div>
              </div>
              <button
                onClick={() => {
                  onAssignStaff(selectedTicket.id, assigneeName, assigneeDeadline);
                  setSelectedTicket({
                    ...selectedTicket,
                    assignedTo: assigneeName,
                    deadline: assigneeDeadline,
                  });
                }}
                className="rounded bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white hover:bg-slate-900"
              >
                Lưu phân công
              </button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Modal: Tạo khiếu nại mới */}
      <Modal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        title="Tiếp Nhận Khiếu Nại & Báo Sự Cố Mới"
        footer={
          <>
            <button
              onClick={() => setShowNewModal(false)}
              className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (newTitle && newApartment && newDescription) {
                  onCreateComplaint({
                    title: newTitle,
                    category: newCategory,
                    apartmentCode: newApartment,
                    residentName: newResidentName || 'Cư dân',
                    residentPhone: newPhone || '0908 123 456',
                    priority: newPriority,
                    description: newDescription,
                    status: 'new',
                    createdAt: `${new Date().toLocaleDateString('vi-VN')} ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}`,
                    updatedAt: 'Vừa xong',
                    images: [],
                    messages: [
                      {
                        id: `msg-${Date.now()}`,
                        senderName: newResidentName || 'Cư dân',
                        senderRole: 'Cư dân',
                        content: newDescription,
                        timestamp: 'Vừa xong',
                      },
                    ],
                  });
                  setShowNewModal(false);
                  setNewTitle('');
                  setNewDescription('');
                }
              }}
              className="rounded-lg bg-blue-700 px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-800"
            >
              Lưu tiếp nhận
            </button>
          </>
        }
      >
        <div className="space-y-3.5 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Tiêu đề sự cố *</label>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="VD: Nước chảy yếu tại phòng tắm master"
              className="w-full rounded-lg border border-slate-200 p-2 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phân loại</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs"
              >
                <option value="Kỹ thuật - Nước">Cấp thoát nước</option>
                <option value="Kỹ thuật - Điện">Điện & Điều hòa</option>
                <option value="Thang máy">Thang máy</option>
                <option value="An ninh - Trật tự">An ninh & Tiếng ồn</option>
                <option value="Vệ sinh môi trường">Vệ sinh môi trường</option>
                <option value="Hành chính - Dịch vụ">Hành chính & Thẻ xe</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mức độ ưu tiên</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as any)}
                className="w-full rounded-lg border border-slate-200 p-2 text-xs"
              >
                <option value="urgent">Khẩn cấp</option>
                <option value="high">Ưu tiên cao</option>
                <option value="medium">Bình thường</option>
                <option value="low">Thấp</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mã căn hộ *</label>
              <input
                type="text"
                value={newApartment}
                onChange={(e) => setNewApartment(e.target.value)}
                placeholder="VD: A-1204"
                className="w-full rounded-lg border border-slate-200 p-2 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Họ tên người gửi</label>
              <input
                type="text"
                value={newResidentName}
                onChange={(e) => setNewResidentName(e.target.value)}
                placeholder="Nguyễn Văn Minh"
                className="w-full rounded-lg border border-slate-200 p-2 text-xs"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Số điện thoại</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="0908 123 456"
                className="w-full rounded-lg border border-slate-200 p-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Chi tiết phản ánh *</label>
            <textarea
              rows={3}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Mô tả hiện tượng sự cố, vị trí xảy ra..."
              className="w-full rounded-lg border border-slate-200 p-2 text-xs"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};
