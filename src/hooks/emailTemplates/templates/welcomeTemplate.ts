
import { EmailTemplate } from '../types';

export const welcomeTemplate: EmailTemplate = {
  id: 'welcome-default',
  name: 'Welcome to the Team',
  subject: '🎉 Welcome to Patient Pro Marketing!',
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Patient Pro Marketing - Welcome!</title>
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
      max-width: 700px;
      margin: 20px auto;
      padding: 20px;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h1 {
      color: #333;
      font-size: 28px;
    }
    p {
      color: #555;
    }
    .celebration {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .next-steps {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      text-align: left;
      margin: 20px 0;
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
    <div class="celebration">
      <h1>🎉 Congratulations, {{firstName}}! 🎉</h1>
      <p style="color: white; font-size: 18px;">Welcome to the Patient Pro Marketing family!</p>
    </div>

    <p>We are thrilled to officially offer you the {{jobRole}} position at Patient Pro Marketing. Your skills, experience, and enthusiasm made you the perfect fit for our team.</p>

    <div class="next-steps">
      <h3>What happens next:</h3>
      <ul>
        <li>You'll receive your official offer letter and contract within 24 hours</li>
        <li>Our HR team will contact you to discuss your start date and onboarding process</li>
        <li>We'll send you access to our team resources and training materials</li>
        <li>You'll be invited to our team communication channels</li>
      </ul>
    </div>

    <p>We can't wait to see the amazing contributions you'll bring to Patient Pro Marketing. If you have any questions before your start date, please don't hesitate to reach out.</p>

    <p>Once again, welcome to the team!</p>

    <p class="signature">
      Excited to work with you!<br><br>
      <strong>Justin Lesh, Founder</strong><br>
      Patient Pro Marketing
    </p>
  </div>
</body>
</html>`,
  jobRole: 'General',
  isDefault: true
};
