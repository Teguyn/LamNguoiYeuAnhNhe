# 💌 Bức Thư Tỏ Tình Bé Ngọc (LamNguoiYeuAnhNhe)

Một trang web tỏ tình lãng mạn, hiện đại với đồ họa 3D chân thực, hiệu ứng âm thanh sống động và tính năng tự động gửi email xác nhận tình yêu khi bạn gái (Ngọc) bấm **"Đồng ý"**.

---

## ✨ Tính Năng Nổi Bật

1. **Đồ Họa 3D Particle Bằng Three.js:**
   - Dải thiên hà vũ trụ với hàng ngàn hạt sao lấp lánh và bụi không gian huyền ảo.
   - Trái tim 3D phát sáng nhấp nháy theo nhịp đập chân thực (*heartbeat pulse*), tương tác xoay chuyển động mượt mà theo chuột và thao tác vuốt trên điện thoại.
   - Cánh hoa hồng ánh sáng bay bồng bềnh trong không gian.
   - Hiệu ứng bùng nổ Supernova khi Ngọc bấm đồng ý.

2. **Kịch Bản 4 Chương Cảm Xúc:**
   - **Chương 1:** Bức thư bí mật niêm phong sáp khắc chữ **N** (Ngọc) lơ lửng giữa luồng sáng neon.
   - **Chương 2:** Hành trình trái tim với các tấm thẻ thủy tinh (Glassmorphism) ghi lại cảm xúc và lý do vì sao anh yêu Ngọc.
   - **Chương 3:** Trái tim 3D rực sáng cùng câu hỏi quyết định: *"Ngọc à, làm người yêu anh nhé? 💕"*
   - **Chương 4:** Giấy chứng nhận tình yêu mạ vàng chính thức mang tên **Anh & Bé Ngọc** kèm đồng hồ bấm giờ tình yêu thời gian thực.

3. **Tương Tác Tinh Nghịch (Nút Né Tránh):**
   - Khi Ngọc rê chuột hoặc chạm vào nút **"Em cần suy nghĩ..."**, nút sẽ tự động chạy trốn khắp màn hình kèm những câu thoại trêu đùa ngọt ngào (*"Ơ kìa đừng bấm vào đây mà 🥺"*, *"Nút này bị khoá rùi, chọn nút bên kia nha 💕"*...).

4. **Âm Thanh & Hiệu Ứng Pháo Hoa:**
   - Tích hợp bộ phát nhạc du dương lãng mạn (Web Audio Synthesizer) không lo bị lỗi link nhạc chết.
   - Hiệu ứng âm thanh khi bấm mở thư, tiếng huýt sáo khi nút chạy trốn và bản hòa tấu khải hoàn mừng tình yêu.
   - Đại tiệc pháo hoa & hoa giấy (*Canvas Confetti*) ngập tràn màn hình.

5. **Tự Động Gửi Email Xác Nhận:**
   - Khi Ngọc ấn "Đồng ý", hệ thống kích hoạt gửi thông báo xác nhận thành đôi tới cả 2 email:
     - Email của Ngọc: `embuonkh@gmail.com`
     - Email của bạn: `xnguyen107204@gmail.com`

---

## 🚀 Hướng Dẫn Chạy Thử Trên Máy

1. Cài đặt các gói thư viện:
   ```bash
   npm install
   ```

2. Khởi chạy máy chủ phát triển (Dev server):
   ```bash
   npm run dev
   ```
   Trình duyệt sẽ tự động mở tại `http://localhost:3000` (hoặc cổng được hiển thị trên terminal).

3. Đóng gói bản chạy thực tế:
   ```bash
   npm run build
   ```

---

## 💌 Cấu Hình EmailJS Để Nhận Mail Thật Về Hộp Thư

Trang web đã được tích hợp sẵn thư viện `@emailjs/browser`. Để kích hoạt gửi email thực tế vào hộp thư Gmail miễn phí:

1. Đăng ký tài khoản miễn phí tại: [EmailJS.com](https://www.emailjs.com/)
2. Kết nối dịch vụ Gmail (nhận được **Service ID**).
3. Tạo một Email Template (nhận được **Template ID**) với nội dung:
   - To Email: `{{partner_email}}, {{my_email}}`
   - Subject: `{{subject}}`
   - Content: `{{message}}`
4. Mở file [src/email.js](file:///d:/NgocIu/LamNguoiYeuAnhNhe/src/email.js) và điền các khóa của bạn:
   ```javascript
   export const EMAIL_CONFIG = {
     serviceId: 'service_của_bạn',
     templateId: 'template_của_bạn',
     publicKey: 'public_key_của_bạn',
     partnerEmail: 'embuonkh@gmail.com',
     myEmail: 'xnguyen107204@gmail.com',
   };
   ```

---

## 🌐 Hướng Dẫn Đẩy Lên GitHub & Bật Web Miễn Phí (GitHub Pages)

### Bước 1: Khởi tạo và đẩy code lên GitHub
1. Vào [GitHub.com](https://github.com) tạo một repository mới tên là `LamNguoiYeuAnhNhe` (chọn Public).
2. Chạy các lệnh sau trong thư mục dự án:
   ```bash
   git init
   git add .
   git commit -m "feat: Official confession website for Ngoc"
   git branch -M main
   git remote add origin https://github.com/<tên-tài-khoản-github-của-bạn>/LamNguoiYeuAnhNhe.git
   git push -u origin main
   ```

### Bước 2: Bật GitHub Pages tự động
1. Vào repo: [https://github.com/Teguyn/LamNguoiYeuAnhNhe/settings/pages](https://github.com/Teguyn/LamNguoiYeuAnhNhe/settings/pages)
2. Ở phần **Build and deployment** -> **Source**: Chọn **GitHub Actions**.
3. Quy trình tự động [deploy.yml](.github/workflows/deploy.yml) sẽ tự động kích hoạt, build và xuất bản trang web.
4. Sau 1-2 phút, trang web của bạn sẽ hoạt động trực tiếp tại:
   👉 **`https://teguyn.github.io/LamNguoiYeuAnhNhe/`**
5. Copy đường link này và gửi ngay cho Bé Ngọc nhé! 💕
