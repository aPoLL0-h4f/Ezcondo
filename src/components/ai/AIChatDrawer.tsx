import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  X,
  User,
  MessageCircle,
} from 'lucide-react';
import { TenantCondo } from '../../types';

interface AIChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTenant: TenantCondo;
  residentApartment?: string;
  onOpenBooking?: () => void;
  onOpenComplaint?: () => void;
  onOpenPayment?: () => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export const AIChatDrawer: React.FC<AIChatDrawerProps> = ({
  isOpen,
  onClose,
  currentTenant,
  residentApartment = 'A-1204',
  onOpenBooking,
  onOpenComplaint,
  onOpenPayment,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      role: 'assistant',
      content: `Xin chào quý cư dân! Bộ phận Chăm sóc & Vận hành **${currentTenant.name}** luôn sẵn sàng hỗ trợ bạn 24/7. Bạn có thể hỏi về cách thanh toán cước phí, quy định giờ giấc yên tĩnh, đặt tiện ích tiệc nướng BBQ hoặc hướng dẫn xử lý sự cố kỹ thuật trong căn hộ.`,
      timestamp: 'Vừa xong',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (textToSend?: string) => {
    const msg = textToSend || input;
    if (!msg.trim() || loading) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: msg,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/resident-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: msg,
          condoName: currentTenant.name,
          apartment: residentApartment,
          history: messages.slice(-4),
        }),
      });
      const data = await res.json();
      const reply = data.reply || 'Dạ Ban Quản lý đã ghi nhận yêu cầu của quý cư dân.';

      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: reply,
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: 'Dạ hiện kết nối tạm thời gián đoạn. Bạn có thể liên hệ số hotline trực ca 1900 6868 nếu cần hỗ trợ khẩn cấp nhé.',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col w-96 max-w-[90vw] h-[520px] max-h-[85vh] rounded-2xl bg-white shadow-xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between bg-slate-900 px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs">
            BQL
          </div>
          <div>
            <h3 className="font-semibold text-xs">Hỗ Trợ Cư Dân Trực Tuyến 24/7</h3>
            <p className="text-[11px] text-slate-400">{currentTenant.name} • Căn {residentApartment}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded p-1 text-slate-400 hover:text-white transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Suggested Quick Questions */}
      <div className="flex items-center gap-1.5 overflow-x-auto p-2 bg-slate-50 border-b border-slate-100 text-[11px] whitespace-nowrap">
        <button
          onClick={() => handleSend('Cách thanh toán hóa đơn phí quản lý qua VietQR như thế nào?')}
          className="rounded-md bg-white px-2 py-1 font-medium text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
        >
          Cách nộp phí
        </button>
        <button
          onClick={() => handleSend('Quy định giờ giấc và cách đặt tiệc nướng BBQ ngoài trời?')}
          className="rounded-md bg-white px-2 py-1 font-medium text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
        >
          Đặt tiệc BBQ
        </button>
        <button
          onClick={() => handleSend('Căn hộ bị rò rỉ nước thì quy trình tiếp nhận xử lý bao lâu?')}
          className="rounded-md bg-white px-2 py-1 font-medium text-slate-700 border border-slate-200 hover:bg-slate-100 transition"
        >
          Báo rò rỉ nước
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/40">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-2 ${
              m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                m.role === 'user'
                  ? 'bg-blue-700 text-white'
                  : 'bg-slate-200 text-slate-700 font-bold'
              }`}
            >
              {m.role === 'user' ? <User className="h-3.5 w-3.5" /> : 'CS'}
            </div>

            <div
              className={`rounded-xl px-3.5 py-2.5 text-xs shadow-xs max-w-[82%] leading-relaxed ${
                m.role === 'user'
                  ? 'bg-blue-700 text-white'
                  : 'bg-white text-slate-800 border border-slate-200'
              }`}
            >
              {m.content}
              <div
                className={`text-[9px] mt-1 text-right ${
                  m.role === 'user' ? 'text-blue-200' : 'text-slate-400'
                }`}
              >
                {m.timestamp}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-xs text-slate-400 p-2 italic">
            Đang tìm kiếm thông tin phản hồi...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          placeholder="Nhập câu hỏi hoặc nội dung cần hỗ trợ..."
          className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs text-slate-800 focus:border-blue-700 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          className="rounded-lg bg-blue-700 p-2 text-white hover:bg-blue-800 disabled:opacity-40 transition"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
