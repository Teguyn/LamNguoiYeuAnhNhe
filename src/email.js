import emailjs from '@emailjs/browser';

export const EMAIL_CONFIG = {
  serviceId: 'service_z6npd8u',
  templateId: 'template_fga4zmi',
  publicKey: '5dTeZA77uNsfQa5YE',

  partnerEmail: 'hnguyen278279@gmail.com', // test mail — đổi lại embuonkh@gmail.com khi dùng thật
  myEmail: 'xnguyen107204@gmail.com',
};

export function getFormattedCurrentTime() {
  return new Date().toLocaleString('vi-VN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * Tạo thiệp tình yêu HTML đẹp — nhúng inline vào email
 */
function buildLoveCertificateHTML(timestamp) {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,600&family=Great+Vibes&family=Nunito:wght@400;600;700&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{background:#0a040f;font-family:'Nunito',sans-serif;padding:20px}
  .wrap{max-width:600px;margin:0 auto}
  /* Header banner */
  .banner{
    background:linear-gradient(135deg,#1a0428,#3d0a2a,#1a0428);
    border-radius:20px 20px 0 0;
    padding:44px 30px 36px;
    text-align:center;
    border:1px solid rgba(255,117,140,0.35);
    border-bottom:none;
    position:relative;
    overflow:hidden;
  }
  .banner::before{
    content:'';
    position:absolute;inset:0;
    background:radial-gradient(ellipse at 50% 0%,rgba(255,45,96,0.25),transparent 65%);
  }
  .hearts-row{font-size:22px;letter-spacing:6px;margin-bottom:14px;position:relative}
  .banner-from{
    font-family:'Nunito',sans-serif;
    font-size:0.78rem;font-weight:700;
    letter-spacing:3px;text-transform:uppercase;
    color:rgba(255,192,203,0.7);
    margin-bottom:8px;position:relative;
  }
  .banner-title{
    font-family:'Great Vibes',cursive;
    font-size:3.4rem;color:#fff;
    line-height:1.1;position:relative;
    text-shadow:0 0 40px rgba(255,45,96,0.7);
  }
  .banner-subtitle{
    font-family:'Playfair Display',serif;
    font-size:1rem;font-style:italic;
    color:rgba(255,224,230,0.85);
    margin-top:10px;position:relative;
    line-height:1.6;
  }
  /* Certificate body */
  .cert{
    background:linear-gradient(180deg,#12051e,#1a0828);
    border:1px solid rgba(255,117,140,0.3);
    border-top:none;border-radius:0 0 20px 20px;
    padding:0 24px 32px;
  }
  /* Divider */
  .divider{
    text-align:center;
    font-size:0.85rem;
    letter-spacing:6px;
    color:#f7c873;
    padding:18px 0 16px;
    opacity:.85;
  }
  /* Badge stamp */
  .official-stamp{
    display:inline-block;
    border:2px solid rgba(247,200,115,0.6);
    border-radius:12px;
    padding:8px 24px;
    font-size:0.72rem;
    font-weight:700;
    letter-spacing:2.5px;
    text-transform:uppercase;
    color:#f7c873;
    background:rgba(247,200,115,0.08);
    margin-bottom:20px;
  }
  /* Main couple names */
  .couple-names{
    font-family:'Great Vibes',cursive;
    font-size:2.8rem;
    color:#fff;
    text-align:center;
    line-height:1.15;
    text-shadow:0 0 28px rgba(255,45,96,0.5),0 0 12px rgba(247,200,115,0.3);
    margin-bottom:6px;
  }
  /* Love vow text */
  .vow-box{
    background:rgba(255,45,96,0.08);
    border:1px solid rgba(255,117,140,0.2);
    border-radius:14px;
    padding:20px 22px;
    margin:18px 0;
    text-align:center;
  }
  .vow-quote{
    font-family:'Playfair Display',serif;
    font-size:1.05rem;
    font-style:italic;
    color:rgba(255,240,245,0.92);
    line-height:1.9;
  }
  /* Info rows */
  .info-row{
    display:flex;
    justify-content:space-between;
    align-items:center;
    padding:10px 0;
    border-bottom:1px solid rgba(255,255,255,0.07);
  }
  .info-row:last-child{border-bottom:none}
  .info-label{
    font-size:0.75rem;font-weight:700;
    letter-spacing:1.5px;text-transform:uppercase;
    color:rgba(232,213,245,0.6);
  }
  .info-value{
    font-size:0.92rem;font-weight:600;
    color:rgba(255,240,245,0.9);
    text-align:right;
  }
  /* Signatures */
  .signatures{
    display:flex;
    justify-content:space-between;
    align-items:flex-end;
    margin-top:28px;
    padding-top:20px;
    border-top:1px dashed rgba(247,200,115,0.3);
  }
  .sig-block{text-align:center;flex:1}
  .sig-label{
    font-size:0.7rem;font-weight:600;
    letter-spacing:1px;text-transform:uppercase;
    color:rgba(232,213,245,0.5);
    margin-bottom:6px;
  }
  .sig-name{
    font-family:'Great Vibes',cursive;
    font-size:2rem;color:rgba(255,192,203,0.9);
    text-shadow:0 2px 8px rgba(0,0,0,0.5);
  }
  .sig-heart{
    font-size:2rem;text-align:center;flex:0 0 44px;
    animation:none;
  }
  /* Footer */
  .footer{
    text-align:center;
    margin-top:24px;
    font-size:0.78rem;
    color:rgba(200,180,220,0.5);
    line-height:1.7;
    font-family:'Nunito',sans-serif;
  }
  .footer a{color:rgba(255,117,140,0.8);text-decoration:none}
</style>
</head>
<body>
<div class="wrap">

  <!-- Banner header -->
  <div class="banner">
    <div class="hearts-row">💕 💕 💕</div>
    <div class="banner-from">Một bức thư đặc biệt từ Xuân Nguyên</div>
    <div class="banner-title">Giấy Chứng Nhận Tình Yêu</div>
    <div class="banner-subtitle">
      Được lập vào ngày hai trái tim chính thức thuộc về nhau
    </div>
  </div>

  <!-- Certificate body -->
  <div class="cert">
    <div class="divider">❦ ─── ❀ ─── ❦</div>

    <div style="text-align:center;margin-bottom:16px">
      <span class="official-stamp">✦ Chứng Nhận Chính Thức ✦</span>
    </div>

    <div class="couple-names">Xuân Nguyên &amp; Bé Ngọc</div>

    <div class="divider" style="padding:10px 0 14px">❦ ─── ❀ ─── ❦</div>

    <!-- Vow quote -->
    <div class="vow-box">
      <p class="vow-quote">
        "Kể từ khoảnh khắc này, chúng ta chính thức là một nửa của nhau.
        Anh hứa sẽ luôn lắng nghe, thấu hiểu, trân trọng và yêu thương
        em bằng cả trái tim — mỗi ngày một nhiều hơn ngày hôm qua."
      </p>
    </div>

    <!-- Info rows -->
    <div style="margin:20px 0 0">
      <div class="info-row">
        <span class="info-label">Ngày chính thức</span>
        <span class="info-value">${timestamp}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Người gửi</span>
        <span class="info-value"> Xuân Nguyên (xnguyen107204@gmail.com)</span>
      </div>
      <div class="info-row">
        <span class="info-label">Người nhận</span>
        <span class="info-value"> Bé Ngọc (${EMAIL_CONFIG.partnerEmail})</span>
      </div>
      <div class="info-row">
        <span class="info-label">Trạng thái</span>
        <span class="info-value" style="color:#6ee7b7;font-weight:700;">Đã xác nhận — Em đồng ý rồi! 💖</span>
      </div>
      <div class="info-row">
        <span class="info-label">Hiệu lực</span>
        <span class="info-value" style="color:#fcd34d">  Mãi mãi và vĩnh cửu 💍</span>
      </div>
    </div>

    <!-- Signatures -->
    <div class="signatures">
      <div class="sig-block">
        <div class="sig-label">Bên Anh</div>
        <div class="sig-name">Xuân Nguyên</div>
      </div>
      <div class="sig-heart">❤️</div>
      <div class="sig-block">
        <div class="sig-label">Bên Em</div>
        <div class="sig-name">Bé Ngọc</div>
      </div>
    </div>
  </div>

  <!-- Footer -->
  <div class="footer">
    <p>💌 Thiệp tình yêu này được tạo với cả trái tim của Xuân Nguyên.</p>
    <p style="margin-top:6px">
      Xem lại trang web kỷ niệm:
      <a href="https://teguyn.github.io/LamNguoiYeuAnhNhe">teguyn.github.io/LamNguoiYeuAnhNhe</a>
    </p>
    <p style="margin-top:6px;font-size:0.72rem;opacity:.6">
      Email này được gửi tự động khi Bé Ngọc nhấn "Dạ em đồng ý" 🌹
    </p>
  </div>

</div>
</body>
</html>`;
}

/**
 * Gửi email kèm thiệp HTML đẹp tới cả hai người
 */
export async function sendOfficialLoveEmail() {
  const timestamp = getFormattedCurrentTime();
  const htmlCard = buildLoveCertificateHTML(timestamp);

  const emailParams = {
    partner_email: EMAIL_CONFIG.partnerEmail,
    my_email: EMAIL_CONFIG.myEmail,
    to_email: `${EMAIL_CONFIG.partnerEmail}, ${EMAIL_CONFIG.myEmail}`,
    email: EMAIL_CONFIG.myEmail,
    name: 'Xuân Nguyên',
    from_name: 'Xuân Nguyên ❤️',
    reply_to: EMAIL_CONFIG.myEmail,
    subject: '💌 [Chính Thức] Giấy Chứng Nhận Tình Yêu — Ngọc Đã Đồng Ý Rồi! 🌹',
    timestamp,
    time: timestamp,
    // Plain text fallback
    message: `✨ Giấy Chứng Nhận Tình Yêu ✨\n\nXuân Nguyên & Bé Ngọc\n\n"Kể từ khoảnh khắc này, chúng ta chính thức là một nửa của nhau."\n\n📅 Ngày chính thức: ${timestamp}\n✅ Trạng thái: Em đã đồng ý! 💖\n⏳ Hiệu lực: Mãi mãi và vĩnh cửu 💍`,
    // HTML thiệp đẹp — EmailJS template cần dùng {{{html_content}}}
    html_content: htmlCard,
  };

  try {
    const res = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      emailParams,
      EMAIL_CONFIG.publicKey
    );
    console.log('✅ EmailJS OK:', res);
    return { success: true, mode: 'emailjs', timestamp };
  } catch (err) {
    console.warn('⚠️ EmailJS error:', err);
    return { success: true, mode: 'fallback', timestamp };
  }
}
