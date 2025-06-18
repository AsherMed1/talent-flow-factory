
import { EmailTemplate } from '../types';

export const holdForFutureTemplate: EmailTemplate = {
  id: 'hold-for-future-default',
  name: 'Hold for Future Role',
  subject: 'Thank You for Your Interest - Future Opportunities',
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Patient Pro Marketing - Future Opportunities</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      font-size: 16px;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      padding: 20px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: left;
    }
    h1 {
      color: #333;
      text-align: center;
    }
    p {
      color: #555;
    }
    .signature {
      font-size: 18px;
      margin-top: 20px;
      font-weight: bold;
    }
    .highlight {
      background-color: #e8f4fd;
      padding: 15px;
      border-left: 4px solid #0073e6;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>We'd Love to Keep in Touch!</h1>

    <p>Hey {{firstName}},</p>

    <p>Thank you for your interest in the {{jobRole}} position at Patient Pro Marketing. After careful consideration, we've decided to move forward with other candidates for this specific role.</p>

    <div class="highlight">
      <p><strong>However, we were genuinely impressed with your background and qualifications!</strong></p>
    </div>

    <p>We would love to keep your resume on file for future opportunities that may be a better fit. Our company is growing rapidly, and we frequently have new positions opening up.</p>

    <p>If you're interested in being considered for future roles, please reply to this email to confirm, and we'll reach out when suitable positions become available.</p>

    <p>Thank you again for your time and interest in Patient Pro Marketing. We truly appreciate the effort you put into your application.</p>

    <p>Best regards,</p>

    <p class="signature">
      <br>
      <strong>Justin Lesh, Founder</strong><br>
      Patient Pro Marketing
    </p>
  </div>
</body>
</html>`,
  jobRole: 'General',
  isDefault: true
};
