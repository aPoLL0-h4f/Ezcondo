import React, { useState } from 'react';
import {
  BookOpen,
  ShieldCheck,
  Flame,
  VolumeX,
  Phone,
  HelpCircle,
  FileText,
  Search,
} from 'lucide-react';
import { HANDBOOK_SECTIONS } from '../../data/mockData';
import { TenantCondo } from '../../types';

interface ResidentHandbookProps {
  currentTenant: TenantCondo;
}

export const ResidentHandbook: React.FC<ResidentHandbookProps> = ({ currentTenant }) => {
  const [search, setSearch] = useState('');
  const [selectedSection, setSelectedSection] = useState(HANDBOOK_SECTIONS[0].id);

  const filteredSections = HANDBOOK_SECTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.content.toLowerCase().includes(search.toLowerCase())
  );

  const activeContent = HANDBOOK_SECTIONS.find((s) => s.id === selectedSection);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Sổ Tay Cư Dân & Quy Chế Vận Hành Tòa Nhà
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Căn cứ theo Luật Nhà ở và Quy chế quản lý sử dụng chung cư {currentTenant.name}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-600 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
          <Phone className="h-4 w-4 text-rose-600" />
          <span>Hotline khẩn cấp PCCC / An ninh: <strong>1900 6868</strong></span>
        </div>
      </div>

      {/* Main Handbook Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation list */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-2 block">
            Mục lục sổ tay
          </span>
          <div className="space-y-1">
            {HANDBOOK_SECTIONS.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`w-full text-left p-3 rounded-lg text-xs font-semibold transition ${
                  selectedSection === sec.id
                    ? 'bg-blue-50 text-blue-800 border-l-2 border-blue-700'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sec.title}
              </button>
            ))}
          </div>
        </div>

        {/* Section Reading Pane */}
        <div className="md:col-span-2 rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          {activeContent && (
            <>
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base font-bold text-slate-900">{activeContent.title}</h2>
                <span className="text-xs text-slate-400">Áp dụng cho toàn thể cư dân {currentTenant.name}</span>
              </div>
              <div className="prose prose-sm max-w-none text-slate-700 text-xs leading-relaxed whitespace-pre-line">
                {activeContent.content}
              </div>
              <div className="rounded-lg bg-slate-50 p-3 text-[11px] text-slate-500 border border-slate-200">
                Mọi hành vi vi phạm nội quy nhiều lần sẽ được lập biên bản và xử lý theo chế tài quy định tại Hợp đồng dịch vụ quản lý vận hành tòa nhà.
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
