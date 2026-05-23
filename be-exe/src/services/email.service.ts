import nodemailer from "nodemailer";
import { env, isSmtpEnabled } from "../config/env.js";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!isSmtpEnabled) return null;
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env.smtp.host,
      port: env.smtp.port,
      secure: env.smtp.port === 465, // Use secure: true for port 465, false for 587 (TLS)
      auth: {
        user: env.smtp.user,
        pass: env.smtp.pass,
      },
    });
  }
  return transporter;
}

export async function sendPasswordResetEmail(to: string, resetUrl: string) {
  const subject = "Đặt lại mật khẩu — Vistory";
  const html = `
    <p>Bạn đã yêu cầu đặt lại mật khẩu.</p>
    <p><a href="${resetUrl}">Nhấn vào đây để đặt mật khẩu mới</a></p>
    <p>Link hết hạn sau 1 giờ. Nếu không phải bạn, hãy bỏ qua email này.</p>
  `;

  const transport = getTransporter();
  if (!transport) {
    console.warn("[EMAIL] SMTP chưa được cấu hình. Email không gửi được.");
    console.log("[DEV] Password reset link:", resetUrl);
    return;
  }

  try {
    const info = await transport.sendMail({
      from: env.smtp.from,
      to,
      subject,
      html,
    });
    console.log("[EMAIL] ✓ Email gửi thành công:", info.messageId);
  } catch (error) {
    console.error("[EMAIL] ✗ Lỗi gửi email:", error instanceof Error ? error.message : error);
    throw new Error(`Không thể gửi email đặt lại mật khẩu: ${error instanceof Error ? error.message : "Lỗi không xác định"}`);
  }
}
