import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Initialize Gemini SDK with telemetry header
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API: AI Daily Priorities for Condominium Operations
app.post('/api/ai/suggest-priority', async (req, res) => {
  const { condoName, stats, complaints, overdueCount } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      source: 'offline-smart-engine',
      data: [
        {
          id: 'p-1',
          title: 'Khắc phục áp lực nước Block B (Tầng 12 - 18)',
          category: 'Kỹ thuật - Cấp thoát nước',
          urgency: 'high',
          impact: 'Ảnh hưởng 24 căn hộ, 3 khiếu nại chưa xử lý',
          action: 'Điều phối tổ kỹ thuật ca 1 kiểm tra van giảm áp trục đứng B2 trước 10:30.',
        },
        {
          id: 'p-2',
          title: 'Đôn đốc công nợ phí dịch vụ quá hạn > 60 ngày',
          category: 'Tài chính kế toán',
          urgency: 'medium',
          impact: `${overdueCount || 8} căn hộ với tổng nợ 42.500.000 đ`,
          action: 'Gửi thông báo nhắc nợ lần 2 qua Cổng cư dân & liên hệ trực tiếp chủ hộ.',
        },
        {
          id: 'p-3',
          title: 'Bảo trì định kỳ hệ thống quạt thông gió tầng hầm B1-B2',
          category: 'Bảo trì định kỳ',
          urgency: 'normal',
          impact: 'Theo lịch kiểm định PCCC và tiêu chuẩn khí thải',
          action: 'Bàn giao mặt bằng cho nhà thầu kỹ thuật thực hiện lúc 14:00 - 17:00.',
        },
      ],
    });
  }

  try {
    const prompt = `Bạn là trợ lý AI giám sát vận hành chung cư EZCondo.
Chung cư: ${condoName || 'Masteri Thảo Điền'}.
Dữ liệu vận hành:
- Tỷ lệ lấp đầy: ${stats?.occupancy || '92%'}
- Khiếu nại mở: ${stats?.openComplaints || 4}
- Hóa đơn quá hạn: ${overdueCount || 8}
- Sự cố kỹ thuật đang xử lý: ${stats?.openIncidents || 3}
Khiếu nại đáng chú ý: ${JSON.stringify(complaints?.slice(0, 3) || [])}

Hãy đề xuất chính xác 3 công việc ưu tiên cần ban quản lý và đội ngũ kỹ thuật xử lý trong ngày hôm nay.
Trả về định dạng JSON thuần túy (không kèm markdown code block):
[
  {
    "id": "p-1",
    "title": "Tiêu đề công việc ngắn gọn",
    "category": "Lĩnh vực (Kỹ thuật/Tài chính/An ninh/Dịch vụ)",
    "urgency": "high" | "medium" | "normal",
    "impact": "Mức độ ảnh hưởng cư dân/tài chính",
    "action": "Hành động cụ thể và thời hạn hoàn thành"
  }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    res.json({ success: true, source: 'gemini', data: parsed });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: error.message || 'Lỗi xử lý AI' });
  }
});

// API: AI Complaint Diagnosis & Resolution Recommendation
app.post('/api/ai/complaint-assistant', async (req, res) => {
  const { title, apartment, sender, description, category } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      source: 'offline-smart-engine',
      recommendation: {
        diagnosis: `Sự cố "${title}" tại căn hộ ${apartment} thuộc danh mục ${category || 'Kỹ thuật tòa nhà'}. Khả năng cao do hao mòn linh kiện hoặc tắc nghẽn cục bộ.`,
        suggestedResponse: `Chào cư dân ${sender || 'quý cư dân'} (${apartment}), Ban Quản lý đã tiếp nhận phản ánh. Chúng tôi đã phân công kỹ sư bảo trì phụ trách và sẽ liên hệ trực tiếp trước khi đến hỗ trợ trong vòng 45 phút tới. Trân trọng!`,
        actionSteps: [
          'Phân công Kỹ sư Ca trực kiểm tra trực tiếp thiết bị',
          'Khảo sát ống nối/nguồn điện liên đới tầng dưới/trên nếu nghi ngờ rò rỉ',
          'Ghi nhận biên bản nghiệm thu có chữ ký cư dân',
        ],
        estimatedCost: 'Miễn phí trong hạn mức dịch vụ tòa nhà',
        targetTime: 'Xử lý hoàn tất trong 2 giờ',
      },
    });
  }

  try {
    const prompt = `Bạn là Trưởng bộ phận Dịch vụ khách hàng & Kỹ thuật tòa nhà EZCondo.
Có một khiếu nại từ cư dân:
- Tiêu đề: ${title}
- Căn hộ: ${apartment}
- Người gửi: ${sender}
- Danh mục: ${category}
- Chi tiết phản ánh: ${description}

Hãy phân tích và đưa ra:
1. diagnosis: Chuẩn đoán sơ bộ nguyên nhân kỹ thuật/vận hành
2. suggestedResponse: Lời nhắn phản hồi lịch sự, chuẩn mực cho cư dân
3. actionSteps: Mảng 3 bước xử lý cụ thể cho nhân viên kỹ thuật
4. estimatedCost: Dự toán chi phí (nếu có hoặc miễn phí)
5. targetTime: Cam kết SLA thời gian hoàn thành (ví dụ: Trong 90 phút)

Trả về JSON thuần:
{
  "diagnosis": "...",
  "suggestedResponse": "...",
  "actionSteps": ["...", "...", "..."],
  "estimatedCost": "...",
  "targetTime": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({ success: true, source: 'gemini', recommendation: parsed });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: error.message || 'Lỗi xử lý AI' });
  }
});

// API: AI Executive Operational & Financial Summary Report
app.post('/api/ai/generate-report', async (req, res) => {
  const { condoName, period, stats } = req.body;

  if (!ai) {
    return res.json({
      success: true,
      source: 'offline-smart-engine',
      summary: `**BÁO CÁO VẬN HÀNH TỔNG QUAN ${period?.toUpperCase() || 'THÁNG HIỆN TẠI'} - ${condoName || 'EZCONDO RESIDENCES'}**

1. **Hiệu suất lấp đầy:** Tỷ lệ lấp đầy đạt **${stats?.occupancy || '94.2%'}**, tăng trưởng 1.8% so với cùng kỳ. Có ${stats?.vacant || 14} căn đang trong trạng thái trống sẵn sàng bàn giao khách thuê mới.
2. **Tài chính & Thu phí:** Doanh thu thu phí đạt **${stats?.revenue || '1.420.000.000 đ'}** (tỷ lệ thu đúng hạn đạt 92.5%). Tổng công nợ quá hạn ghi nhận 48.200.000 đ, giảm 12% so với tháng trước nhờ quy trình nhắc nợ đa kênh.
3. **Chất lượng dịch vụ & Khiếu nại:** Tiếp nhận 42 khiếu nại trong kỳ, đã xử lý hoàn tất 39 trường hợp (SLA 92.8% giải quyết dưới 3 giờ). Chỉ số hài lòng CSAT trung bình đạt **4.8/5.0 sao**.
4. **Khuyến nghị AI cho Ban Quản trị:**
- Triển khai vệ sinh bảo dưỡng hệ thống điều hòa sảnh chính trước cao điểm nắng nóng.
- Nâng cấp trạm sạc xe điện tầng hầm B1 do lượng đăng ký mới tăng 35%.
- Tối ưu hóa ca trực ban đêm của đội an ninh tại cổng Barrier số 2.`,
    });
  }

  try {
    const prompt = `Bạn là Giám đốc Vận hành Cấp cao (COO) của chuỗi bất động sản EZCondo.
Hãy viết một bản Báo Cáo Tóm Tắt Vận Hành Điều Hành (${period || 'Tháng'}) cho chung cư "${condoName}".
Dữ liệu chính:
${JSON.stringify(stats || {})}

Yêu cầu định dạng: Markdown chuyên nghiệp, có các mục:
1. Đánh giá Khai thác Căn hộ & Cư dân
2. Tình hình Tài chính, Doanh thu & Quản lý Công nợ
3. Hoạt động Kỹ thuật, Bảo trì & SLA Khiếu nại
4. Đề xuất & Khuyến nghị Chiến lược của AI cho Ban Quản trị và Chủ đầu tư.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ success: true, source: 'gemini', summary: response.text });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: error.message || 'Lỗi xử lý AI' });
  }
});

// API: AI Resident 24/7 Portal Assistant
app.post('/api/ai/resident-chat', async (req, res) => {
  const { message, condoName, apartment, history } = req.body;

  if (!ai) {
    const lower = (message || '').toLowerCase();
    let reply = `Chào bạn, mình là Trợ lý AI Cư dân ${condoName || 'EZCondo'}. Mình luôn túc trực 24/7 để hỗ trợ bạn!`;

    if (lower.includes('hóa đơn') || lower.includes('thanh toán') || lower.includes('tiền')) {
      reply = `Dạ, để thanh toán hóa đơn dịch vụ căn ${apartment || 'của bạn'}, bạn có thể bấm tab "Hóa đơn & Thanh toán" ở menu bên trái hoặc nút "Thanh toán ngay" tại trang chủ Cổng Cư dân. Hệ thống hỗ trợ VietQR chuyển khoản tự động gạch nợ tức thì, thẻ Visa/Mastercard và ví Momo.`;
    } else if (lower.includes('tiện ích') || lower.includes('hồ bơi') || lower.includes('gym') || lower.includes('bbq')) {
      reply = `Chung cư cung cấp tiện ích Hồ bơi vô cực (Tầng 5, 06:00 - 21:30), Phòng Gym hiện đại (Tầng 5, 24/7 với thẻ từ cư dân), và Khu tiệc nướng BBQ ngoài trời (cần đặt trước tối thiểu 6 tiếng qua mục "Tiện ích"). Miễn phí hoàn toàn cho cư dân đã kích hoạt thẻ cư dân!`;
    } else if (lower.includes('sự cố') || lower.includes('hư') || lower.includes('khiếu nại') || lower.includes('nước') || lower.includes('điện')) {
      reply = `Bạn đang gặp sự cố kỹ thuật? Bạn có thể gửi phản ánh nhanh tại mục "Gửi khiếu nại" (đính kèm ảnh chụp sự cố nếu có). Đội kỹ thuật trực ca sẽ tiếp nhận và có mặt xử lý theo tiêu chuẩn SLA tối đa 45 phút đối với các sự cố điện nước khẩn cấp.`;
    } else if (lower.includes('xe') || lower.includes('gửi xe') || lower.includes('vé xe')) {
      reply = `Biểu phí gửi xe theo quy định tòa nhà: Xe máy 120.000 đ/tháng, Ô tô 1.250.000 đ/tháng. Đăng ký bổ sung xe mới tại quầy Lễ tân sảnh A hoặc tải biểu mẫu trực tiếp trên ứng dụng.`;
    } else {
      reply = `Cảm ơn câu hỏi của bạn. Về nội dung "${message}", Ban Quản lý ${condoName || 'EZCondo'} đã ghi nhận. Nếu cần trợ giúp khẩn cấp, bạn có thể gọi trực tiếp Hotline Lễ tân 24/7 qua số 1900 6868 hoặc để lại tin nhắn khiếu nại để ban quản trị giải quyết ngay nhé!`;
    }

    return res.json({ success: true, source: 'offline-smart-engine', reply });
  }

  try {
    const prompt = `Bạn là Trợ lý AI thân thiện, chu đáo và lịch sự 24/7 của Cổng Cư Dân ${condoName || 'EZCondo'}.
Cư dân: Căn hộ ${apartment || 'P.1204 - Tháp A'}.
Nội quy chung:
- Giờ quy định yên tĩnh: Sau 22:00
- Thu phí quản lý: Từ ngày 1 đến ngày 10 hàng tháng, thanh toán qua QR VietQR hoặc thẻ
- Tiện ích: Hồ bơi và Gym miễn phí cho cư dân, tiệc BBQ cần đăng ký trước 6 tiếng
- Đăng ký thi công sửa chữa/vận chuyển đồ lớn: Báo trước 24h để cấp thẻ thang máy hàng
- Hotline sự cố khẩn cấp: 1900 6868

Câu hỏi của cư dân: "${message}"

Hãy trả lời ngắn gọn, niềm nở, ân cần, giải thích rõ ràng và hướng dẫn hành động cụ thể trên Cổng Cư dân.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ success: true, source: 'gemini', reply: response.text });
  } catch (error: any) {
    console.error('Gemini error:', error);
    res.status(500).json({ error: error.message || 'Lỗi xử lý AI' });
  }
});

// Setup Vite middlewares in development or serve static in production
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`EZCondo server is running on http://localhost:${PORT}`);
  });
}

startServer();
