module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { firstName, lastName, email, school } = req.body;

  if (!firstName || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  try {
    // Resend emails — non-blocking, skipped if API key not configured
    const apiKey = process.env.RESEND_OAKMUN_REGISTRATION;
    if (apiKey) {
      const fromEmail  = process.env.FROM_EMAIL || 'onboarding@resend.dev';
      const adminEmail = process.env.ADMIN_EMAIL || 'mun@oakridge.in';
      Promise.all([
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
        fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            from: `Oakridge MUN Signups <${fromEmail}>`,
            to: [adminEmail],
            subject: `New signup: ${firstName} ${lastName} — Oakridge MUN XVI`,
            html: adminEmail_html({ firstName, lastName, email, school }),
          }),
        }),
      ]).catch(err => console.error('Resend error:', err));
    }

    // Log to Google Sheets — non-blocking
    const sheetsUrl = process.env.SHEETS_WEBHOOK_URL;
    if (sheetsUrl) {
      fetch(sheetsUrl, {
        method: 'POST',
        redirect: 'follow',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, school }),
      }).then(r => console.log('Sheets log status:', r.status))
        .catch(err => console.error('Sheets log failed:', err));
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Subscribe error:', err);
    return res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
}

function confirmationEmail(firstName) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <title>You're on the list — Oakridge MUN XVI</title>
</head>
<body style="margin:0;padding:0;background:#0a1628;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <!-- Outer wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#0a1628;padding:48px 16px;">
    <tr><td align="center">

      <!-- Card -->
      <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:580px;width:100%;border-radius:20px;overflow:hidden;border:1px solid rgba(48,205,215,0.12);">

        <!-- ── Hero band ── -->
        <tr>
          <td style="background:linear-gradient(135deg,#002244 0%,#003a6b 60%,#004f8a 100%);padding:44px 48px 40px;text-align:center;border-bottom:1px solid rgba(48,205,215,0.12);">
            <img src="https://oakridgemun-2026.vercel.app/logo.png" alt="Oakridge MUN" width="80" height="80" style="display:block;margin:0 auto 24px;border-radius:50%;">
            <p style="margin:0 0 6px;font-size:10px;font-weight:800;letter-spacing:0.35em;text-transform:uppercase;color:#30CDD7;">Oakridge Model United Nations</p>
            <p style="margin:0;font-size:12px;font-weight:500;letter-spacing:0.18em;color:rgba(250,245,237,0.38);">CHAPTER XVI &nbsp;&middot;&nbsp; HYDERABAD &nbsp;&middot;&nbsp; JULY 2026</p>
          </td>
        </tr>

        <!-- ── Body ── -->
        <tr>
          <td style="background:#001c36;padding:48px 48px 36px;">

            <!-- Eyebrow -->
            <p style="margin:0 0 10px;font-size:10px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:#30CDD7;">You're on the list</p>

            <!-- Headline -->
            <h1 style="margin:0 0 20px;font-size:28px;font-weight:800;line-height:1.2;color:#FAF5ED;">
              Hey ${firstName},<br>we'll keep you posted.
            </h1>

            <!-- Divider line -->
            <table width="40" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 0 24px;">
              <tr><td style="height:3px;background:#30CDD7;border-radius:2px;"></td></tr>
            </table>

            <!-- Body copy -->
            <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:rgba(250,245,237,0.62);">
              Thanks for your interest in <strong style="color:#FAF5ED;">Oakridge MUN Chapter XVI</strong>.
              We'll send you an email as soon as registrations open — you won't miss a thing.
            </p>

            <!-- Date callout box -->
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="margin:28px 0 36px;border-left:3px solid #30CDD7;">
              <tr>
                <td style="padding:16px 20px;background:rgba(48,205,215,0.06);border-radius:0 8px 8px 0;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:800;letter-spacing:0.25em;text-transform:uppercase;color:rgba(250,245,237,0.4);">Save the date</p>
                  <p style="margin:0;font-size:17px;font-weight:700;color:#FAF5ED;">24 – 26 July 2026</p>
                  <p style="margin:4px 0 0;font-size:13px;color:rgba(250,245,237,0.5);">Oakridge International School, Hyderabad</p>
                </td>
              </tr>
            </table>

            <!-- CTA button -->
            <table cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td style="border-radius:100px;background:#30CDD7;">
                  <a href="https://oakridgemun-2026.vercel.app/committees.html"
                     style="display:inline-block;padding:14px 36px;font-size:11px;font-weight:800;letter-spacing:0.14em;text-transform:uppercase;color:#002244;text-decoration:none;border-radius:100px;">
                    Explore Committees &rarr;
                  </a>
                </td>
              </tr>
            </table>

          </td>
        </tr>

        <!-- ── Stats strip ── -->
        <tr>
          <td style="background:#001229;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
              <tr>
                <td width="33%" style="padding:22px 0;text-align:center;border-right:1px solid rgba(255,255,255,0.05);">
                  <p style="margin:0;font-size:24px;font-weight:900;color:#FAF5ED;letter-spacing:-0.5px;">650<span style="font-size:14px;font-weight:700;color:#30CDD7;">+</span></p>
                  <p style="margin:5px 0 0;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(250,245,237,0.3);">Delegates</p>
                </td>
                <td width="33%" style="padding:22px 0;text-align:center;border-right:1px solid rgba(255,255,255,0.05);">
                  <p style="margin:0;font-size:24px;font-weight:900;color:#FAF5ED;letter-spacing:-0.5px;">19</p>
                  <p style="margin:5px 0 0;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(250,245,237,0.3);">Committees</p>
                </td>
                <td width="33%" style="padding:22px 0;text-align:center;">
                  <p style="margin:0;font-size:24px;font-weight:900;color:#FAF5ED;letter-spacing:-0.5px;">3</p>
                  <p style="margin:5px 0 0;font-size:9px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:rgba(250,245,237,0.3);">Days</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- ── Footer ── -->
        <tr>
          <td style="background:#001229;padding:20px 48px 28px;border-top:1px solid rgba(255,255,255,0.04);">
            <p style="margin:0;font-size:11px;line-height:1.7;color:rgba(250,245,237,0.2);">
              You received this because you signed up for early registration notifications at oakridgemun.in.
              We sent exactly one email — no newsletters, no spam.
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;
}

function adminEmail_html({ firstName, lastName, email, school }) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:32px 16px;background:#f0f2f5;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;margin:0 auto;">

    <!-- Header -->
    <tr>
      <td style="background:#003057;padding:22px 32px;border-radius:14px 14px 0 0;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          <tr>
            <td>
              <p style="margin:0;font-size:9px;font-weight:800;letter-spacing:0.3em;text-transform:uppercase;color:#30CDD7;">Oakridge MUN XVI</p>
              <p style="margin:4px 0 0;font-size:15px;font-weight:700;color:#FAF5ED;">New Registration Interest</p>
            </td>
            <td align="right" style="vertical-align:middle;">
              <span style="display:inline-block;background:rgba(48,205,215,0.15);border:1px solid rgba(48,205,215,0.35);border-radius:100px;padding:4px 14px;font-size:10px;font-weight:700;letter-spacing:0.1em;color:#30CDD7;">NEW</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Body -->
    <tr>
      <td style="background:#ffffff;padding:28px 32px;border-left:1px solid #e4e7ec;border-right:1px solid #e4e7ec;">
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
          ${adminRow('Name', `${firstName} ${lastName}`)}
          ${adminRow('Email', email)}
          ${adminRow('School', school || '—')}
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td style="background:#f8f9fb;padding:16px 32px;border:1px solid #e4e7ec;border-top:none;border-radius:0 0 14px 14px;">
        <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.6;">
          Submitted via oakridgemun.in early-access form &nbsp;&middot;&nbsp; Oakridge MUN XVI Secretariat
        </p>
      </td>
    </tr>

  </table>
</body>
</html>`;
}

function adminRow(label, value) {
  return `<tr>
    <td style="padding:10px 0;font-size:10px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#9ca3af;width:130px;vertical-align:top;border-bottom:1px solid #f3f4f6;">${label}</td>
    <td style="padding:10px 0;font-size:14px;font-weight:500;color:#111827;border-bottom:1px solid #f3f4f6;">${value}</td>
  </tr>`;
}
