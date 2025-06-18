
import { EmailTemplate } from '../types';

export const rejectionTemplate: EmailTemplate = {
  id: 'rejection-default',
  name: 'Kind Rejection After Application Review',
  subject: 'Thank You for Applying',
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Patient Pro Marketing - Application Update</title>
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
    <h1>Thank You for Your Interest</h1>

    <p>Hi {{firstName}},</p>

    <p>Thank you for your interest in the {{jobRole}} position at Patient Pro Marketing and for taking the time to submit your application.</p>

    <p>After careful review of your application, we have decided to move forward with other candidates who more closely match our current requirements for this role.</p>

    <p>We truly appreciate the time and effort you put into your application. Please don't let this discourage you - we encourage you to apply for future openings that may be a better fit for your skills and experience.</p>

    <p>We wish you all the best in your job search and future career endeavors.</p>

    <p>Thank you again for considering Patient Pro Marketing.</p>

    <p>Best regards,</p>

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
