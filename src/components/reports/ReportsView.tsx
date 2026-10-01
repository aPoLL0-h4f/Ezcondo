import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  Calendar,
  RefreshCw,
  Printer,
  Building,
  Users,
  FileText,
} from 'lucide-react';
import { TenantCondo, Apartment, Invoice, Complaint, StaffMember } from '../../types';

interface ReportsViewProps {
  currentTenant: TenantCondo;
  apartments: Apartment[];
  invoices: Invoice[];
  complaints: Complaint[];
  staff: StaffMember[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  currentTenant,
  apartments,
  invoices,
  complaints,
  staff,
}) => {
  const [reportType, setReportType] = useState<
    'executive_summary' | 'operations' | 'occupancy' | 'finance' | 'staff'
  >('executive_summary');
  const [timePeriod, setTimePeriod] = useState<'this_month' | 'last_month' | 'this_quarter' | 'this_year'>('this_month');

  const [reportContent, setReportContent] = useState<string>('');
  const [loadingReport, setLoadingReport] = useState<boolean>(false);

  const fetchReport = async () => {
    setLoadingReport(true);
    try {
      const res = await fetch('/api/ai/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          condoName: currentTenant.name,
          period: timePeriod === 'this_month' ? 'Tháng 10/2026' : 'Quý IV/2026',
          stats: {
            occupancy: `${currentTenant.occupancyRate}%`,
            revenue: '1.428.500.000 đ',
            vacant: apartments.filter((a) => a.status === 'vacant').length,
            complaintsResolved: complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length,
            activeIncidents: complaints.filter((c) => c.status === 'in_progress').length,
          },
        }),
      });
      const data = await res.json();
      if (data.summary) {
        setReportContent(data.summary);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingReport(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [currentTenant.id, timePeriod]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Báo Cáo & Thống Kê Định Kỳ
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Dữ liệu tổng hợp vận hành, tài chính thu phí, nhân sự và văn bản điều hành
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Period selector */}
          <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as any)}
              className="bg-transparent text-slate-800 font-medium focus:outline-none"
            >
              <option value="this_month">Tháng 10/2026</option>
              <option value="last_month">Tháng 09/2026</option>
              <option value="this_quarter">Quý IV/2026</option>
              <option value="this_year">Năm 2026</option>
            </select>
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
          >
            <Printer className="h-4 w-4 text-slate-500" />
            <span>In báo cáo</span>
          </button>

          <button
            onClick={() => alert('Xuất báo cáo số liệu dạng bảng Excel thành công!')}
            className="flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-800"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Xuất Excel</span>
          </button>
        </div>
      </div>

      {/* 5 Report Subtabs */}
      <div className="flex border-b border-slate-200 text-xs font-semibold gap-2">
        <button
          onClick={() => setReportType('executive_summary')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition ${
            reportType === 'executive_summary'
              ? 'border-blue-700 text-blue-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileText className="h-4 w-4" />
          Báo Cáo Tổng Hợp Điều Hành
        </button>
        <button
          onClick={() => setReportType('operations')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition ${
            reportType === 'operations'
              ? 'border-blue-700 text-blue-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          Báo Cáo Vận Hành & Kỹ Thuật
        </button>
        <button
          onClick={() => setReportType('occupancy')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition ${
            reportType === 'occupancy'
              ? 'border-blue-700 text-blue-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="h-4 w-4" />
          Khai Thác Căn Hộ
        </button>
        <button
          onClick={() => setReportType('finance')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition ${
            reportType === 'finance'
              ? 'border-blue-700 text-blue-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BarChart3 className="h-4 w-4" />
          Doanh Thu & Công Nợ
        </button>
        <button
          onClick={() => setReportType('staff')}
          className={`flex items-center gap-1.5 px-3 py-2.5 border-b-2 transition ${
            reportType === 'staff'
              ? 'border-blue-700 text-blue-800 font-bold'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          Nhân Sự & Ca Trực
        </button>
      </div>

      {/* Tab: Executive Summary */}
      {reportType === 'executive_summary' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Văn Bản Tóm Tắt Tình Hình Vận Hành {currentTenant.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tổng hợp số liệu từ các phân hệ: Căn hộ, Thu phí, Kỹ thuật và Phản hồi cư dân
                </p>
              </div>

              <button
                onClick={fetchReport}
                disabled={loadingReport}
                className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loadingReport ? 'animate-spin' : ''}`} />
                Cập nhật dữ liệu mới nhất
              </button>
            </div>

            {loadingReport ? (
              <div className="py-12 text-center text-xs text-slate-500">
                <RefreshCw className="h-6 w-6 text-slate-400 animate-spin mx-auto mb-2" />
                Đang tổng hợp báo cáo vận hành...
              </div>
            ) : (
              <div className="prose prose-sm max-w-none text-slate-700 whitespace-pre-line leading-relaxed text-xs">
                {reportContent}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab: Operations */}
      {reportType === 'operations' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs text-slate-500 block">Tổng sự cố tiếp nhận</span>
              <div className="mt-1 text-2xl font-bold text-slate-900">{complaints.length} vụ</div>
              <span className="text-[11px] text-emerald-600 font-medium">94.8% xử lý đúng thời hạn cam kết</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs text-slate-500 block">Đã xử lý nghiệm thu</span>
              <div className="mt-1 text-2xl font-bold text-slate-900">
                {complaints.filter((c) => c.status === 'resolved' || c.status === 'closed').length} vụ
              </div>
              <span className="text-[11px] text-slate-400">Thời gian trung bình: 1.8 giờ/vụ</span>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <span className="text-xs text-slate-500 block">Mức độ hài lòng của cư dân</span>
              <div className="mt-1 text-2xl font-bold text-slate-900">4.92 / 5.0</div>
              <span className="text-[11px] text-slate-500">Khảo sát trên 184 phản hồi</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Occupancy */}
      {reportType === 'occupancy' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Chi Tiết Tình Trạng Khai Thác Từng Phân Khu</h3>
          <div className="space-y-2 text-xs">
            {[
              { block: 'Tháp A (Tower A)', total: 180, occupied: 172, vacant: 8, rate: '95.5%' },
              { block: 'Tháp B (Tower B)', total: 150, occupied: 139, vacant: 11, rate: '92.6%' },
              { block: 'Tháp C (Tower C)', total: 90, occupied: 86, vacant: 4, rate: '95.5%' },
              { block: 'Khối đế Shophouse', total: 30, occupied: 27, vacant: 3, rate: '90.0%' },
            ].map((b, idx) => (
              <div key={idx} className="rounded-lg border border-slate-100 p-3 bg-slate-50 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900">{b.block}</h4>
                  <span className="text-slate-500 text-[11px]">
                    {b.total} căn • {b.occupied} đang ở • {b.vacant} căn trống
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-slate-900 font-bold text-sm block">{b.rate}</span>
                  <span className="text-[10px] text-slate-400">Tỷ lệ lấp đầy</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Finance */}
      {reportType === 'finance' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900">Cơ Cấu Nguồn Thu Vận Hành Kỳ Này</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Phí quản lý diện tích</span>
              <span className="text-base font-bold text-slate-900">820.000.000 đ</span>
              <span className="text-[11px] text-slate-500 block mt-1">57.4% tổng thu</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Phí gửi xe ô tô & xe máy</span>
              <span className="text-base font-bold text-slate-900">385.000.000 đ</span>
              <span className="text-[11px] text-slate-500 block mt-1">26.9% tổng thu</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Nước sinh hoạt đo đếm</span>
              <span className="text-base font-bold text-slate-900">142.500.000 đ</span>
              <span className="text-[11px] text-slate-500 block mt-1">10.0% tổng thu</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-500 block">Dịch vụ tiện ích BBQ / Sân</span>
              <span className="text-base font-bold text-slate-900">81.000.000 đ</span>
              <span className="text-[11px] text-slate-500 block mt-1">5.7% tổng thu</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Staff */}
      {reportType === 'staff' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-sm text-slate-900 mb-2">Bố Trí Quân Số Theo Ca Trực 24/7</h3>
          <div className="grid grid-cols-3 gap-3 text-xs text-center mt-4">
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700 block">Ca Sáng (06:00 - 14:00)</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">12 nhân sự</span>
              <span className="text-[11px] text-slate-400">Cao điểm giao thông & bảo trì</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700 block">Ca Chiều (14:00 - 22:00)</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">10 nhân sự</span>
              <span className="text-[11px] text-slate-400">Lễ tân tiếp nhận & kiểm tra</span>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-100">
              <span className="font-semibold text-slate-700 block">Ca Đêm (22:00 - 06:00)</span>
              <span className="text-xl font-bold text-slate-900 mt-1 block">6 nhân sự</span>
              <span className="text-[11px] text-slate-400">Tuần tra an ninh & PCCC</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
