const ContactMe = require('../../models/contectme');
const SibApiV3Sdk = require('sib-api-v3-sdk');

// --- BREVO CONFIGURATION ---
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = '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';

const ADMIN_EMAIL = 'subhadip5069@gmail.com';
const FROM_EMAIL = 'subhadip5069@gmail.com'; // Must be verified in Brevo

exports.contactMe = async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    // Save to MongoDB
    const contact = new ContactMe({ name, email, phone, message });
    await contact.save();

    // Check if FROM_EMAIL is verified (do this in Brevo dashboard, not in code)

    // Prepare Brevo API instance
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    // --- 1. Email to Admin ---
// --- 1. Email to Admin (Subhadip Dey) ---
const adminMail = {
  to: [{ email: ADMIN_EMAIL }],
  sender: { name: 'Subhadip Dey Portfolio', email: FROM_EMAIL },
  subject: '🔔 [Subhadip Dey Portfolio] New Contact Received - Action Needed',
  htmlContent: `
    <div style="max-width:480px;margin:30px auto;padding:24px;border-radius:16px;background:linear-gradient(135deg,#f0f4ff 60%,#e0e7ff 100%);box-shadow:0 6px 32px rgba(90,110,250,0.10);font-family:Segoe UI,Arial,sans-serif;">
      <h2 style="margin-top:0;color:#4f46e5;">New Contact Submission</h2>
      <div style="background:#fff;border-radius:12px;padding:18px 16px;margin:18px 0 24px 0;box-shadow:0 1px 6px rgba(90,110,250,0.04);">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br>${message.replace(/\n/g, "<br>")}</p>
      </div>
      <div style="color:#64748b;font-size:0.97em;">
        <em>This notification was sent to you, <strong>Subhadip Dey</strong>, as the site administrator for Subhadip Dey Portfolio. Please respond promptly if required.</em>
      </div>
    </div>
  `,
  replyTo: { email, name }
};

// --- 2. Confirmation Email to User ---
const userMail = {
  to: [{ email }],
  sender: { name: 'Subhadip Dey Portfolio', email: FROM_EMAIL },
  subject: 'Thank You for Contacting Subhadip Dey Portfolio!',
  htmlContent: `
    <div style="max-width:480px;margin:30px auto;padding:24px;border-radius:16px;background:linear-gradient(135deg,#f0fdf4 60%,#e0ffe7 100%);box-shadow:0 6px 32px rgba(34,197,94,0.10);font-family:Segoe UI,Arial,sans-serif;">
      <h2 style="margin-top:0;color:#16a34a;">Thank You for Getting in Touch, ${name}!</h2>
      <div style="background:#fff;border-radius:12px;padding:18px 16px;margin:18px 0 24px 0;box-shadow:0 1px 6px rgba(34,197,94,0.04);">
        <p>Your message has been received. I appreciate you reaching out through my portfolio website.</p>
        <hr style="border:none;border-top:1px solid #d1fae5;margin:14px 0;">
        <p><strong>Your Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      </div>
      <div style="color:#64748b;font-size:0.97em;">
        <p>I will review your message and get back to you as soon as possible.</p>
        <p>Warm regards,<br><strong>Subhadip Dey</strong></p>
        <p style="margin-top:1em;">This is an automated confirmation from <a href="https://subhadipdey.com" style="color:#16a34a;">Subhadip Dey Portfolio</a></p>
      </div>
    </div>
  `
};

    // Send both emails in parallel and handle individual errors
    await Promise.all([
      apiInstance.sendTransacEmail(adminMail),
      apiInstance.sendTransacEmail(userMail)
    ]);

    req.session.success = "Your message has been sent successfully!";
    res.redirect("/");
  } catch (err) {
    // More detailed error logging for troubleshooting
    if (err.response && err.response.body) {
      console.error('Contact form submission error:', err.response.body);
    } else {
      console.error('Contact form submission error:', err);
    }
    req.session.error = "Failed to send your message. Please check your email address or try again later.";
    res.redirect("/");
  }
};