
import { EmailTemplate } from '../types';

export const applicationUpdateTemplate: EmailTemplate = {
  id: 'application-update-default',
  name: 'Application Update - Initial Form Request',
  subject: 'Appointment Setter Application Update',
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
    .next-steps {
      background-color: #f8f9fa;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .step {
      margin: 15px 0;
      font-size: 16px;
    }
    a {
      color: #0073e6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .form-button {
      display: inline-block;
      background-color: #0073e6;
      color: white;
      padding: 12px 24px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: bold;
      margin: 10px 0;
    }
    .form-button:hover {
      background-color: #005bb5;
      color: white;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Appointment Setter Application Update</h1>

    <p>Hi {{firstName}},</p>

    <p>Congratulations! I'm excited to tell you that after reviewing your application, you've reached the next round of our hiring process for the Appointment Setter role at Patient Pro Marketing.</p>

    <div class="next-steps">
      <h3>Next Steps:</h3>
      
      <div class="step">
        <p>🎥 <strong>Step 1: Watch this Loom Video</strong></p>
        <p>
          <a href="https://www.loom.com/share/9f3c0e5226ca4d68aaecdcdd2ef621de">
            🎥 Watch This Quick Video Before Proceeding 🎥
          </a>
        </p>

        <a href="https://www.loom.com/share/9f3c0e5226ca4d68aaecdcdd2ef621de">
          <img src="https://cdn.loom.com/sessions/thumbnails/baf2cd9833434d4c80f4b9e9770d01b5-212796318d2031c0-full-play.gif" alt="Interview Video" style="max-width: 100%; height: auto; display: block; margin: 20px auto; border-radius: 8px;">
        </a>
      </div>

      <div class="step">
        <p>👉 <strong>Step 2: Complete This Form</strong></p>
        <p>
          <a href="{{bookingLink}}" class="form-button">
            Complete Application Form
          </a>
        </p>
      </div>
    </div>

    <p>Thanks,</p>

    <p class="signature">
      <strong>Justin Lesh</strong><br>
      Founder, Patient Pro Marketing
    </p>
  </div>
</body>
</html>`,
  jobRole: 'General',
  isDefault: true
};
