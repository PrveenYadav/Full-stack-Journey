export const emailTemplates = {
  // Welcome Email
  welcome: (userName, email) => ({
    subject: "Welcome to Outfytly 👕✨",
    html: `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8" />
        <style>
            body {
            background: #f4f4f4;
            margin: 0;
            padding: 0;
            font-family: Arial, sans-serif;
            }
            .container {
            max-width: 600px;
            margin: 40px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            }
            .header {
            background: linear-gradient(135deg, #111111, #333333);
            padding: 32px;
            text-align: center;
            color: #ffffff;
            }
            .content {
            padding: 32px;
            color: #333333;
            line-height: 1.6;
            }
            .button {
            display: inline-block;
            background: #111111;
            color: #ffffff !important;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
            margin-top: 20px;
            }
            .footer {
            background: #fafafa;
            padding: 20px;
            text-align: center;
            font-size: 13px;
            color: #777;
            }
        </style>
        </head>
        <body>
        <div class="container">
            <div class="header">
            <h1>Welcome to Outfytly 👗🔥</h1>
            <p>Your style journey starts here</p>
            </div>

            <div class="content">
            <h2>Hey ${userName},</h2>
            <p>
                We’re hyped to have you on <strong>Outfytly</strong> — your go-to place
                to discover trending outfits, fresh drops, and everyday drip.
            </p>

            <p><strong>Registered email:</strong> ${email}</p>

            <p>
                Explore new fits, save your favorites, and upgrade your wardrobe with the latest styles.
            </p>

            <a href="${process.env.CLIENT_URL}" class="button">
                Start Exploring 👕
            </a>
            </div>

            <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Outfytly. All rights reserved.</p>
            <p>Fresh fits. Daily drip.</p>
            </div>
        </div>
        </body>
        </html>
    `,
    text: `Welcome to Outfytly, ${userName}! 👕✨
Your account has been created with ${email}.
Start exploring the latest outfits: ${process.env.CLIENT_URL}`,
  }),

  // Password Reset
  passwordReset: (userName, resetToken) => ({
    subject: "Reset your Outfytly password 🔐",
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 40px;">
  <div style="max-width: 600px; background: #fff; padding: 32px; border-radius: 8px; margin: auto;">
    <h2>Password Reset Request</h2>
    <p>Hey ${userName},</p>
    <p>
      We received a request to reset your Outfytly password.
      Click below to set a new one and get back to your drip.
    </p>

    <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}"
       style="display:inline-block;background:#111111;color:#fff;padding:14px 28px;
              border-radius:6px;text-decoration:none;font-weight:bold;">
      Reset Password
    </a>

    <p style="margin-top: 20px;">
      This link will expire in <strong>1 hour</strong>.
    </p>

    <p style="font-size: 14px; color: #777;">
      If you didn’t request this, you can safely ignore this email.
    </p>
  </div>
</body>
</html>
`,
    text: `Hey ${userName},
Reset your Outfytly password here:
${process.env.CLIENT_URL}/reset-password?token=${resetToken}
(Link expires in 1 hour)`,
  }),

  // Email Verification
  verification: (userName, verificationToken) => ({
    subject: "Verify your Outfytly email ✅",
    html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; background: #f4f4f4; padding: 40px;">
  <div style="max-width: 600px; background: #fff; padding: 32px; border-radius: 8px; margin: auto;">
    <h2>Verify Your Email</h2>
    <p>Hey ${userName},</p>
    <p>
      Please confirm your email address to complete your Outfytly registration.
    </p>

    <a href="${process.env.CLIENT_URL}/verify-email?token=${verificationToken}"
       style="display:inline-block;background:#111111;color:#fff;padding:14px 28px;
              border-radius:6px;text-decoration:none;font-weight:bold;">
      Verify Email
    </a>

    <p style="margin-top: 20px;">
      This link will expire in <strong>24 hours</strong>.
    </p>
  </div>
</body>
</html>
`,
    text: `Hey ${userName},
Verify your Outfytly email here:
${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`,
  }),

  // Custom Email
  custom: (subject, title, message, buttonText, buttonUrl) => ({
    subject,
    html: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 40px auto; background: #fff; padding: 32px; border-radius: 8px;">
  <h2>${title}</h2>
  <p style="line-height: 1.6;">${message}</p>

  ${
    buttonText && buttonUrl
      ? `
    <a href="${buttonUrl}"
       style="display:inline-block;margin-top:20px;background:#111111;
              color:#fff;padding:14px 28px;border-radius:6px;
              text-decoration:none;font-weight:bold;">
      ${buttonText}
    </a>
  `
      : ""
  }
</div>
`,
    text: `${title}\n\n${message}${
      buttonText && buttonUrl ? `\n\n${buttonText}: ${buttonUrl}` : ""
    }`,
  }),
};
