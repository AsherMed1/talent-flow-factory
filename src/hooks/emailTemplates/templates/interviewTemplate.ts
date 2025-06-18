
import { EmailTemplate } from '../types';

export const interviewTemplate: EmailTemplate = {
  id: 'interview-default',
  name: 'Congratulations - Next Step',
  subject: '🎉 Congratulations! You Made It to the Next Step',
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Patient Pro Marketing - Congratulations!</title>
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
      font-size: 16px;
    }
    .celebration {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      margin: 20px 0;
      border-radius: 8px;
    }
    .cta-button {
      display: inline-block;
      padding: 15px 30px;
      margin-top: 20px;
      background-color: #0073e6;
      color: #ffffff;
      font-size: 18px;
      font-weight: bold;
      border-radius: 5px;
      text-decoration: none;
    }
    .cta-button:hover {
      background-color: #005bb5;
    }
    .signature {
      font-size: 18px;
      margin-top: 30px;
      font-weight: bold;
    }
    .instructions {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: left;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="celebration">
      <h1>🎉 Congratulations, {{firstName}}! 🎉</h1>
      <p style="color: white; font-size: 18px;">You've made it to the next step of our hiring process!</p>
    </div>

    <p>We're excited to move forward with your application for the <strong>{{jobRole}}</strong> position at Patient Pro Marketing.</p>

    <div class="instructions">
      <h3>Next Step: Complete Your Application</h3>
      <p>To continue in our hiring process, please complete our detailed application form. This form includes:</p>
      <ul style="text-align: left;">
        <li>Voice recording submissions</li>
        <li>Additional information about your experience</li>
        <li>Skills assessment questions</li>
        <li>Upload of relevant documents</li>
      </ul>
      <p><strong>Important:</strong> Please complete this application within the next 48 hours to ensure your spot in our process.</p>
    </div>

    <p>
      <a href="{{bookingLink}}" class="cta-button">
        📝 Complete Your Application Now
      </a>
    </p>

    <p>If you have any questions about the application process, please don't hesitate to reach out to us.</p>

    <p class="signature">
      Looking forward to your application!<br><br>
      <strong>Justin Lesh, Founder</strong><br>
      Patient Pro Marketing
    </p>
  </div>
</body>
</html>`,
  jobRole: 'General',
  isDefault: true
};
