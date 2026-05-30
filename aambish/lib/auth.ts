// lib/auth.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = '7d';

export function generateToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

export function verifyToken(token: string): { userId: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; role: string };
  } catch {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOTPExpiry(minutes = 10): Date {
  return new Date(Date.now() + minutes * 60 * 1000);
}

// Email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOTPEmail(email: string, otp: string, name: string): Promise<void> {
  await transporter.sendMail({
    from: `"Aambish Luxury" <${process.env.SMTP_USER}>`,
    to: email,
    subject: 'Verify Your Aambish Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: 'Georgia', serif; background: #FAFAF7; margin: 0; padding: 40px 20px; }
          .wrapper { max-width: 540px; margin: 0 auto; background: white; border: 1px solid #E8E8E0; }
          .header { background: #2C3528; padding: 40px; text-align: center; }
          .header h1 { color: #C9A96E; font-size: 28px; margin: 0; letter-spacing: 0.1em; }
          .body { padding: 48px 40px; }
          .otp-box { background: #F4F3EE; border: 1px solid #C9A96E; padding: 28px; text-align: center; margin: 32px 0; border-radius: 2px; }
          .otp-code { font-size: 40px; font-weight: 700; color: #2C3528; letter-spacing: 0.2em; font-family: monospace; }
          .footer { background: #F4F3EE; padding: 24px 40px; text-align: center; font-size: 12px; color: #8A8A7A; }
        </style>
      </head>
      <body>
        <div class="wrapper">
          <div class="header"><h1>AAMBISH</h1></div>
          <div class="body">
            <p style="color: #2C3528; font-size: 16px;">Hello ${name},</p>
            <p style="color: #3D4A38; margin-top: 16px;">Your verification code for Aambish Luxury is:</p>
            <div class="otp-box">
              <div class="otp-code">${otp}</div>
              <p style="color: #8A8A7A; font-size: 13px; margin-top: 12px; font-family: sans-serif;">Valid for 10 minutes</p>
            </div>
            <p style="color: #8A8A7A; font-size: 13px; font-family: sans-serif;">If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">© ${new Date().getFullYear()} Aambish Luxury. All rights reserved.</div>
        </div>
      </body>
      </html>
    `,
  });
}

export async function sendOrderConfirmationEmail(email: string, orderNumber: string, name: string): Promise<void> {
  await transporter.sendMail({
    from: `"Aambish Luxury" <${process.env.SMTP_USER}>`,
    to: email,
    subject: `Order Confirmed — ${orderNumber}`,
    html: `
      <p>Hi ${name}, your order <strong>${orderNumber}</strong> has been confirmed. We'll notify you when it ships.</p>
    `,
  });
}
