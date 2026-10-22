import emailjs from '@emailjs/browser';

/**
 * Configuration for automated Love Confirmation Email
 * Recipient 1: hnguyen278279@gmail.com (Test)
 * Recipient 2: xnguyen107204@gmail.com (Xuân Nguyên)
 */
export const EMAIL_CONFIG = {
  serviceId: 'service_z6npd8u',
  templateId: 'template_fga4zmi',
  publicKey: '5dTeZA77uNsfQa5YE',
  
  partnerEmail: 'hnguyen278279@gmail.com',
  myEmail: 'xnguyen107204@gmail.com',
};

/**
 * Format current date & time in Vietnamese
 */
export function getFormattedCurrentTime() {
  const now = new Date();
  return now.toLocaleString('vi-VN', {
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
 * Send love confirmation email to both Ngọc and User
 */
export async function sendOfficialLoveEmail() {
  const timestamp = getFormattedCurrentTime();

  const emailParams = {
    partner_email: EMAIL_CONFIG.partnerEmail,
    my_email: EMAIL_CONFIG.myEmail,
    to_email: `${EMAIL_CONFIG.partnerEmail}, ${EMAIL_CONFIG.myEmail}`,
    email: EMAIL_CONFIG.myEmail,
    to_name: 'Bé Ngọc & Xuân Nguyên',
    from_name: 'Xuân Nguyên ❤️',
    reply_to: EMAIL_CONFIG.myEmail,
    subject: `💌 [Chính Thức] Giấy Chứng Nhận Tình Yêu: Ngọc Đã Đồng Ý Làm Người Yêu Của Anh Rồi Nhé!`,
    timestamp: timestamp,
    time: timestamp,
    message: `
Chúc mừng Bé Ngọc & Anh đã chính thức nên duyên! 💖
-----------------------------------------------------------
Vào lúc: ${timestamp}
Bé Ngọc (${EMAIL_CONFIG.partnerEmail}) đã bấm 'Đồng ý' làm người yêu của anh (${EMAIL_CONFIG.myEmail}).

Lời nhắn gửi từ trái tim:
"Cảm ơn em đã bước vào cuộc đời anh. Anh hứa sẽ luôn trân trọng, yêu thương, lắng nghe và cùng em viết nên câu chuyện của hai đứa mình."

Giấy chứng nhận tình yêu này có giá trị vĩnh cửu! 🌹
-----------------------------------------------------------
    `,
  };

  try {
    const response = await emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.templateId,
      emailParams,
      EMAIL_CONFIG.publicKey
    );
    console.log('✅ EmailJS sent successfully:', response);
    return {
      success: true,
      message: `Đã gửi thành công email xác nhận tới ${EMAIL_CONFIG.partnerEmail} và ${EMAIL_CONFIG.myEmail}!`,
      mode: 'emailjs',
      timestamp
    };
  } catch (error) {
    console.warn('⚠️ EmailJS error, fallback to client record:', error);
    return {
      success: true,
      message: `Đã ghi nhận khoảnh khắc chính thức thành đôi của Anh & Bé Ngọc!`,
      mode: 'fallback',
      timestamp
    };
  }
}
