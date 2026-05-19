module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, school, committee, experience } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const apiKey    = process.env.RESEND_API_KEY_REAL;
  const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';
  const adminEmail = process.env.ADMIN_EMAIL || 'mun@oakridge.in';

  try {
    // Send confirmation to subscriber + admin notification in parallel
    await Promise.all([
      // 1. Confirmation email to the person who signed up
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `Oakridge MUN XVI <${fromEmail}>`,
          to: [email],
          subject: "You're on the list — Oakridge MUN Chapter XVI",
          html: confirmationEmail(firstName),
        }),
      }),

      // 2. Admin notification so every signup lands in your inbox
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `Oakridge MUN Signups <${fromEmail}>`,
          to: [adminEmail],
          subject: `New signup: ${firstName} ${lastName} — Oakridge MUN XVI`,
          html: adminEmail_html({ firstName, lastName, email, school, committee, experience }),
        }),
      }),
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

function confirmationEmail(firstName) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#003057;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#003057;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#001e38;border-radius:16px;overflow:hidden;max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:#003057;padding:32px 40px;text-align:center;border-bottom:1px solid rgba(48,205,215,0.15);">
            <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:#30CDD7;">OAKRIDGE MODEL UNITED NATIONS</p>
            <p style="margin:8px 0 0;font-size:13px;font-weight:600;letter-spacing:0.15em;color:rgba(250,245,237,0.5);">CHAPTER XVI &nbsp;·&nbsp; JULY 2026</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:48px 40px 40px;">
            <p style="margin:0 0 8px;font-size:11px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:#30CDD7;">You're on the list</p>
            <h1 style="margin:0 0 24px;font-size:30px;font-weight:800;line-height:1.15;color:#FAF5ED;">Hey ${firstName},<br>we've got you.</h1>
            <p style="margin:0 0 16px;font-size:15px;line-height:1.75;color:rgba(250,245,237,0.65);">
              You're now on the early-access list for <strong style="color:#FAF5ED;">Oakridge MUN Chapter XVI</strong>.
              The moment registrations open, you'll be the first to know — before the public announcement.
            </p>
            <p style="margin:0 0 36px;font-size:15px;line-height:1.75;color:rgba(250,245,237,0.65);">
              Save the date: <strong style="color:#30CDD7;">24 – 26 July 2026</strong><br>
              Oakridge International School, Hyderabad.
            </p>
            <table cellpadding="0" cellspacing="0">
              <tr>
                <td style="background:#30CDD7;border-radius:100px;padding:14px 32px;">
                  <a href="https://oakmun.in/committees.html" style="font-size:12px;font-weight:800;letter-spacing:0.12em;text-transform:uppercase;color:#003057;text-decoration:none;">Explore Committees &rarr;</a>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Stats strip -->
        <tr>
          <td style="padding:0 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);">
              <tr>
                <td style="padding:20px 0;text-align:center;">
                  <p style="margin:0;font-size:22px;font-weight:800;color:#FAF5ED;">650<sup style="font-size:13px;">+</sup></p>
                  <p style="margin:4px 0 0;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(250,245,237,0.35);">Delegates</p>
                </td>
                <td style="padding:20px 0;text-align:center;border-left:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0;font-size:22px;font-weight:800;color:#FAF5ED;">19</p>
                  <p style="margin:4px 0 0;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(250,245,237,0.35);">Committees</p>
                </td>
                <td style="padding:20px 0;text-align:center;border-left:1px solid rgba(255,255,255,0.06);">
                  <p style="margin:0;font-size:22px;font-weight:800;color:#FAF5ED;">3</p>
                  <p style="margin:4px 0 0;font-size:10px;font-weight:700;letter-spacing:0.18em;text-transform:uppercase;color:rgba(250,245,237,0.35);">Days</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;">
            <p style="margin:0;font-size:11px;color:rgba(250,245,237,0.25);line-height:1.7;">
              You received this because you signed up for early registration notifications on the Oakridge MUN XVI website.
              One email only — we don't spam.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function adminEmail_html({ firstName, lastName, email, school, committee, experience }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:24px;background:#f4f4f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:#fff;border-radius:10px;overflow:hidden;border:1px solid #e0e0e0;">
    <tr>
      <td style="background:#003057;padding:20px 28px;">
        <p style="margin:0;font-size:11px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:#30CDD7;">Oakridge MUN XVI — New Signup</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px;">
        <table width="100%" cellpadding="0" cellspacing="0">
          ${row('Name', `${firstName} ${lastName}`)}
          ${row('Email', email)}
          ${row('School', school || '—')}
          ${row('Committee', committee || '—')}
          ${row('Experience', experience || '—')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function row(label, value) {
  return `<tr>
    <td style="padding:8px 0;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#999;width:110px;">${label}</td>
    <td style="padding:8px 0;font-size:14px;color:#111;">${value}</td>
  </tr>`;
}
