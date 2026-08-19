# 🏯 Đấu Trường Lịch Sử (VNR202)

**Đấu Trường Lịch Sử** là web game quiz trắc nghiệm lịch sử Việt Nam multiplayer realtime, cho phép nhiều người chơi tham gia vào cùng một phòng thi đấu bằng điện thoại hoặc máy tính theo thời gian thực.

---

## 🌟 Tính năng nổi bật

- **Realtime Multiplayer:** Sử dụng Firebase Realtime Database cập nhật điểm số, trạng thái phòng và vị trí bảng xếp hạng tức thì.
- **Giao diện Bảo tàng/Lịch sử (Parchment & Gold):** Phong cách hoài cổ đậm chất Việt Nam với họa tiết Trống Đồng, giấy cuộn phong thư, hiệu ứng dấu ấn đỏ.
- **Hệ thống tính điểm thông minh:** Điểm cơ bản + Điểm thưởng tốc độ (Speed Bonus).
- **Phòng điều khiển Host (Admin Control Room):** Cho phép Host làm chủ cuộc chơi (Bắt đầu, Tạm dừng, Chuyển câu hỏi, Hiện đáp án & Bảng xếp hạng).
- **Âm thanh chân thực:** Tích hợp Web Audio API (âm thanh đếm ngược, đúng/sai, chiến thắng).
- **Tối ưu Mobile First:** Phản hồi mượt mà trên tất cả thiết bị di động & desktop.

---

## 🛠️ Công nghệ sử dụng

- **Frontend:** Next.js 14+ (App Router, TypeScript, Tailwind CSS)
- **Database & Auth:** Firebase Realtime Database + Anonymous Auth
- **Hiệu ứng & Utilities:** Canvas Confetti, React QR Code, Web Audio API

---

## 🚀 Hướng dẫn cài đặt & Chạy ứng dụng

### 1. Clone dự án và cài đặt thư viện
```bash
git clone https://github.com/hoangtruong01/VNR202.git
cd VNR202
npm install
```

### 2. Cấu hình file `.env.local`
Tạo file `.env.local` tại thư mục gốc và điền thông số Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.asia-southeast1.firebasedatabase.app
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 3. Chạy môi trường Dev
```bash
npm run dev
```
Truy cập [http://localhost:3000](http://localhost:3000) để trải nghiệm game!
