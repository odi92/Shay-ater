import nodemailer from 'nodemailer';
import type { ContactFormData } from '@/types';

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendContactEmail(data: ContactFormData): Promise<void> {
  const transporter = createTransporter();
  const to = process.env.CONTACT_EMAIL ?? 'shayater1@gmail.com';
  const from = process.env.SMTP_FROM ?? process.env.SMTP_USER ?? 'noreply@shayater.com';

  await transporter.sendMail({
    from: `"Shay Ater Website" <${from}>`,
    to,
    replyTo: data.email,
    subject: `New message from ${data.name}: ${data.subject}`,
    text: [
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Subject: ${data.subject}`,
      '',
      data.message,
    ].join('\n'),
    html: `
      <div style="font-family: sans-serif; max-width: 600px;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <table style="border-collapse: collapse; width: 100%;">
          <tr>
            <td style="padding: 8px; font-weight: bold; width: 120px;">Name</td>
            <td style="padding: 8px;">${escapeHtml(data.name)}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 8px; font-weight: bold;">Email</td>
            <td style="padding: 8px;"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px; font-weight: bold;">Subject</td>
            <td style="padding: 8px;">${escapeHtml(data.subject)}</td>
          </tr>
        </table>
        <h3 style="color: #333; margin-top: 24px;">Message</h3>
        <p style="white-space: pre-wrap; background: #f9f9f9; padding: 16px; border-radius: 4px;">${escapeHtml(data.message)}</p>
      </div>
    `,
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
