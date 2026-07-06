const nodemailer = require("nodemailer");

/**
 * Sends an email if EMAIL_USER/EMAIL_PASS are configured in .env.
 * If NOT configured (default, zero-signup mode), it simply logs the
 * content + link to the console so local development never breaks.
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log("\n📧 [DEV MODE - no email credentials set in .env]");
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body:\n${html}\n`);
    return { simulated: true };
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"LifeOS" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });

  return { simulated: false };
};

module.exports = sendEmail;
