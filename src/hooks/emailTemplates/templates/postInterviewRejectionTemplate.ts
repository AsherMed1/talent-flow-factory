
import { EmailTemplate } from '../types';

export const postInterviewRejectionTemplate: EmailTemplate = {
  id: 'post-interview-rejection-default',
  name: 'Final Rejection After Interview',
  subject: 'Thank You for Interviewing',
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Patient Pro Marketing - Interview Follow-up</title>
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

    <p>Hi {{firstName}},</p>

    <p>Thank you for taking the time to interview with us for the {{jobRole}} position at Patient Pro Marketing. It was a pleasure getting to know you and learning more about your background and experience.</p>

    <p>After careful consideration, we have decided not to move forward with your application at this time. This was a difficult decision as we were impressed with many aspects of your candidacy.</p>

    <p>We truly appreciate the time and effort you invested in the interview process. Please don't hesitate to apply for future opportunities with Patient Pro Marketing that may be a better match for your skills and career goals.</p>

    <p>We wish you continued success in your job search and all your future endeavors.</p>

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
