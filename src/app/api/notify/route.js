import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export const runtime = 'nodejs';

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      type, 
      outlet, 
      counter, 
      rating, 
      tags, 
      message, 
      customerName, 
      customerPhone, 
      requestType,
      notificationEmails
    } = body;

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const defaultAdmin = process.env.ADMIN_EMAIL || 'info@dorek.in';

    // Build recipient list
    let recipients = [defaultAdmin];
    if (notificationEmails && Array.isArray(notificationEmails) && notificationEmails.length > 0) {
      recipients = [...new Set([...recipients, ...notificationEmails.map(e => e.trim()).filter(Boolean)])];
    } else if (typeof notificationEmails === 'string' && notificationEmails.trim()) {
      const extra = notificationEmails.split(',').map(e => e.trim()).filter(Boolean);
      recipients = [...new Set([...recipients, ...extra])];
    }

    if (!smtpUser || !smtpPass) {
      console.warn('SMTP credentials not configured in environment variables');
      return NextResponse.json({ success: true, warning: 'SMTP not configured, skipped email dispatch' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const isServiceCall = type === 'service_call';
    const subject = isServiceCall 
      ? `🚨 URGENT: Staff Call at ${escapeHtml(outlet)} - ${escapeHtml(counter)}`
      : `⭐ ${rating}★ Feedback from ${escapeHtml(outlet)} - ${escapeHtml(counter)}`;

    const htmlContent = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
        <div style="background: #0A2E5D; padding: 24px; text-align: center; border-bottom: 3px solid #D4AF37;">
          <h2 style="color: #D4AF37; margin: 0; font-size: 20px; letter-spacing: 1px;">DOREK INTERNATIONAL</h2>
          <p style="color: #ffffff; margin: 6px 0 0 0; font-size: 14px;">Smart QR Live Outlet Alert</p>
        </div>

        <div style="padding: 24px;">
          <div style="background: ${isServiceCall ? '#fee2e2' : '#f0fdf4'}; border-left: 4px solid ${isServiceCall ? '#ef4444' : '#10b981'}; padding: 12px 16px; border-radius: 6px; margin-bottom: 20px;">
            <h3 style="margin: 0; color: ${isServiceCall ? '#991b1b' : '#065f46'}; font-size: 16px;">
              ${isServiceCall ? '🛎️ Live Service Request / Staff Call' : `⭐ Customer Rating: ${rating} / 5 Stars`}
            </h3>
            <p style="margin: 4px 0 0 0; color: #475569; font-size: 13px;">
              Received at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}
            </p>
          </div>

          <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600; width: 140px;">Outlet Location:</td>
              <td style="padding: 10px 0; color: #1e293b; font-weight: 700;">${escapeHtml(outlet || 'Main Store')}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Counter / Desk:</td>
              <td style="padding: 10px 0; color: #0A2E5D; font-weight: 700;">${escapeHtml(counter || 'General Desk')}</td>
            </tr>
            ${isServiceCall ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Service Needed:</td>
              <td style="padding: 10px 0; color: #ef4444; font-weight: 700;">${escapeHtml(requestType || 'Assistance')}</td>
            </tr>
            ` : ''}
            ${tags && tags.length > 0 ? `
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Feedback Tags:</td>
              <td style="padding: 10px 0; color: #334155;">${tags.map(t => escapeHtml(t)).join(', ')}</td>
            </tr>
            ` : ''}
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Customer Name:</td>
              <td style="padding: 10px 0; color: #1e293b;">${escapeHtml(customerName || 'Anonymous')}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f1f5f9;">
              <td style="padding: 10px 0; color: #64748b; font-weight: 600;">Phone Number:</td>
              <td style="padding: 10px 0; color: #1e293b;">
                ${customerPhone ? `<a href="tel:${escapeHtml(customerPhone)}" style="color: #0A2E5D; font-weight: 700; text-decoration: none;">${escapeHtml(customerPhone)}</a>` : 'Not provided'}
              </td>
            </tr>
          </table>

          ${message ? `
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
            <div style="font-size: 12px; font-weight: 700; color: #64748b; margin-bottom: 4px; text-transform: uppercase;">Message / Details:</div>
            <div style="font-size: 14px; color: #334155; line-height: 1.5; font-style: italic;">"${escapeHtml(message)}"</div>
          </div>
          ` : ''}

          <div style="text-align: center; margin-top: 24px;">
            <p style="font-size: 12px; color: #94a3b8; margin-bottom: 10px;">To manage live tickets, visit your Dorek Admin Dashboard or Live Staff Kanban Board.</p>
          </div>
        </div>

        <div style="background: #f8fafc; padding: 14px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0;">
          Dorek Pulse Smart Outlet System • Dorek International Enterprises LLP
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Dorek Pulse Alert" <${smtpUser}>`,
      to: recipients.join(', '),
      subject: subject,
      html: htmlContent,
    });

    return NextResponse.json({ success: true, notified: recipients });
  } catch (error) {
    console.error('Error sending notification email:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
