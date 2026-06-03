const nodemailer = require('nodemailer');

// Gmail transporter. Uses an App Password (not your normal Gmail password).
// Create one at: Google Account → Security → 2-Step Verification → App passwords
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Returns true only when real (non-placeholder) credentials are set.
function isConfigured() {
  const user = process.env.EMAIL_USER || '';
  const pass = process.env.EMAIL_PASS || '';
  if (!user || !pass) return false;
  // Treat the .env.example placeholders as "not configured"
  if (user.includes('your-email') || pass.includes('your-')) return false;
  return true;
}

// Verify config once at startup (logs a warning instead of crashing if unset)
function verifyMailer() {
  if (!isConfigured()) {
    console.warn('⚠️  Email not configured — set real EMAIL_USER / EMAIL_PASS in .env');
    return;
  }
  transporter.verify((err) => {
    if (err) console.warn('⚠️  Email transporter error:', err.message);
    else console.log('✅ Email transporter ready');
  });
}

const brandPurple = '#5e4091';

function patientHtml(booking) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:${brandPurple};color:#fff;padding:24px 28px">
      <h2 style="margin:0;font-size:20px">Doctar — Booking Received</h2>
    </div>
    <div style="padding:28px">
      <p style="font-size:15px;color:#333">Hi <strong>${booking.name}</strong>,</p>
      <p style="font-size:15px;color:#333;line-height:1.6">
        Thank you for booking through Doctar. We've received your request and our care
        coordinator will call you shortly on <strong>${booking.phone}</strong>.
      </p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;font-size:14px">
        <tr><td style="padding:8px 0;color:#888">Treatment</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.disease}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.phone}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Status</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.status}</td></tr>
      </table>
      <p style="font-size:13px;color:#888">Need help now? Call our 24/7 helpline at +91-8877772277.</p>
    </div>
    <div style="background:#faf8ff;padding:16px 28px;font-size:12px;color:#999;text-align:center">
      © Doctar Health Care
    </div>
  </div>`;
}

function adminHtml(booking) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;border:1px solid #eee;border-radius:12px;overflow:hidden">
    <div style="background:${brandPurple};color:#fff;padding:20px 28px">
      <h2 style="margin:0;font-size:18px">🔔 New Booking — Action Needed</h2>
    </div>
    <div style="padding:24px 28px">
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:8px 0;color:#888">Name</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.name}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Phone</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.phone}</td></tr>
        ${booking.email ? `<tr><td style="padding:8px 0;color:#888">Email</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.email}</td></tr>` : ''}
        <tr><td style="padding:8px 0;color:#888">Treatment</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.disease}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Source</td><td style="padding:8px 0;color:#111;font-weight:600">${booking.source}</td></tr>
        <tr><td style="padding:8px 0;color:#888">Received</td><td style="padding:8px 0;color:#111;font-weight:600">${new Date(booking.createdAt).toLocaleString('en-IN')}</td></tr>
      </table>
    </div>
  </div>`;
}

/**
 * Send booking emails.
 * - Always notifies the admin (ADMIN_EMAIL).
 * - Sends the patient a confirmation only if booking.email is present.
 * Never throws — failures are logged so a booking is never lost due to email.
 */
async function sendBookingEmail(booking) {
  if (!isConfigured()) {
    console.warn('⚠️  Skipping emails — EMAIL_USER / EMAIL_PASS not configured');
    return;
  }

  const from = `"Doctar" <${process.env.EMAIL_USER}>`;
  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  const jobs = [];

  // Admin notification (always)
  jobs.push(
    transporter.sendMail({
      from,
      to: adminEmail,
      subject: `New booking: ${booking.disease} — ${booking.name}`,
      html: adminHtml(booking),
    })
  );

  // Patient confirmation (only if we captured an email)
  if (booking.email) {
    jobs.push(
      transporter.sendMail({
        from,
        to: booking.email,
        subject: 'Your Doctar booking is received ✅',
        html: patientHtml(booking),
      })
    );
  }

  try {
    await Promise.all(jobs);
    console.log(`📧 Booking emails sent (admin${booking.email ? ' + patient' : ''})`);
  } catch (err) {
    console.error('❌ Failed to send booking email:', err.message);
  }
}

module.exports = { sendBookingEmail, verifyMailer };
