
import { EmailTemplate } from '../types';

export const thankYouTemplate: EmailTemplate = {
  id: 'thank-you-default',
  name: 'Thank You - Not Selected',
  subject: 'Thank You for Your Interest',
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Patient Pro Marketing - Thank You</title>
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
  </style>
</head>
<body>
  <div class="container">
    <h1>Thank You for Your Time</h1>

    <p>Dear {{firstName}},</p>

    <p>Thank you for taking the time to apply for the {{jobRole}} position at Patient Pro Marketing.</p>

    <p>We appreciate your interest in our company and the effort you put into your application. After careful review, we have decided to pursue other candidates whose experience more closely aligns with our current needs.</p>

    <p>We wish you all the best in your job search and future career endeavors.</p>

    <p>Thank you again for considering Patient Pro Marketing.</p>

    <p>Sincerely,</p>

    <p class="signature">
      <br>
      <strong>The Hiring Team</strong><br>
      Patient Pro Marketing
    </p>
  </div>
</body>
</html>`,
  jobRole: 'General',
  isDefault: true
};
