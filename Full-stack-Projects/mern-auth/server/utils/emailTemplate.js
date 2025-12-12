export const emailTemplates = {
  // Welcome Email
  welcome: (userName, email) => ({
    subject: 'Welcome to Our Platform! 🎉',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }
          .content { padding: 30px; background: #f9f9f9; }
          .footer { padding: 20px; text-align: center; background: #333; color: white; }
          .button { background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to DevWorld! 👋</h1>
          </div>
          <div class="content">
            <h2>Hello ${userName},</h2>
            <p>Welcome to our developer community! Your account has been successfully created.</p>
            <p><strong>Registered Email:</strong> ${email}</p>
            <p>We're excited to have you on board. Start exploring our platform and connect with fellow developers.</p>
            <br>
            <a href="${process.env.CLIENT_URL}" class="button">Get Started</a>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} DevWorld. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Welcome to DevWorld! Hello ${userName}, your account has been created with email: ${email}. Get started: ${process.env.CLIENT_URL}`
  }),

  // Password Reset
  passwordReset: (userName, resetToken) => ({
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Password Reset Request</h2>
        <p>Hello ${userName},</p>
        <p>You requested to reset your password. Click the button below to create a new password:</p>
        <a href="${process.env.CLIENT_URL}/reset-password?token=${resetToken}" 
           style="background: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour.</p>
        <p>If you didn't request this, please ignore this email.</p>
      </div>
    `,
    text: `Password Reset: Hello ${userName}, reset your password here: ${process.env.CLIENT_URL}/reset-password?token=${resetToken} (Expires in 1 hour)`
  }),

  // Account Verification
  verification: (userName, verificationToken) => ({
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Verify Your Email</h2>
        <p>Hello ${userName},</p>
        <p>Please verify your email address to complete your registration:</p>
        <a href="${process.env.CLIENT_URL}/verify-email?token=${verificationToken}" 
           style="background: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Verify Email
        </a>
        <p>This link will expire in 24 hours.</p>
      </div>
    `,
    text: `Verify your email: Hello ${userName}, verify your email here: ${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`
  }),

  // Custom email template
  custom: (subject, title, message, buttonText, buttonUrl) => ({
    subject,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>${title}</h2>
        <p>${message}</p>
        ${buttonText && buttonUrl ? `
          <a href="${buttonUrl}" 
             style="background: #007bff; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block;">
            ${buttonText}
          </a>
        ` : ''}
      </div>
    `,
    text: `${title}: ${message}${buttonText && buttonUrl ? ` - ${buttonText}: ${buttonUrl}` : ''}`
  })
}