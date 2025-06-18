
import { EmailTemplate } from '../types';

export const rejectionTemplate: EmailTemplate = {
  id: 'rejection-default',
  name: 'Rejection Email',
  subject: "I'm Sorry You Were Not Selected",
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
    <h1>Application Update</h1>

    <p>Hey {{firstName}},</p>

    <p>Thank you so much for showing interest in our company.</p>

    <p>Unfortunately, our team did not select you for further consideration. I would like to note that our hiring team receives multiple resumes for each position, and it's often difficult for us to choose between several high-caliber candidates.</p>

    <p>We truly appreciate the time and effort you put into your application. We wish you the best of luck in your job search and all your future endeavors.</p>

    <p>Thank you,</p>

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
