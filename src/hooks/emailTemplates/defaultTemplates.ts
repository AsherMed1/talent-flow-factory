
import { EmailTemplate } from './types';

export const getDefaultTemplates = (fallbackBookingLink: string): EmailTemplate[] => {
  const correctBookingLink = 'https://link.patientpromarketing.com/widget/booking/1TnMI0I04dlMjYsoNxt3';
  
  return [
    {
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
    },
    {
      id: 'interview-default',
      name: 'Interview Invitation',
      subject: 'Congrats! Please Schedule Your Interview',
      content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Patient Pro Marketing - Interview Invitation</title>
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
    }
    p {
      color: #555;
    }
    a {
      text-decoration: none;
      color: #0073e6;
      font-size: 18px;
      font-weight: bold;
    }
    .video-thumbnail {
      max-width: 100%;
      height: auto;
      display: block;
      margin: 20px auto;
      border-radius: 8px;
    }
    .cta-button {
      display: inline-block;
      padding: 12px 20px;
      margin-top: 15px;
      background-color: #0073e6;
      color: #ffffff;
      font-size: 18px;
      font-weight: bold;
      border-radius: 5px;
    }
    .cta-button:hover {
      background-color: #005bb5;
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
    <h1>Exciting Opportunity Awaits!</h1>

    <p>Hey {{firstName}},</p>

    <p>We loved your application and appreciate the recordings you sent in! Click the link below to schedule your interview – we're excited to connect with you!</p>

    <p>
      <a href="https://www.loom.com/share/baf2cd9833434d4c80f4b9e9770d01b5">
        🎤 Watch This Video Before Your Interview 🎤
      </a>
    </p>

    <a href="https://www.loom.com/share/baf2cd9833434d4c80f4b9e9770d01b5">
      <img class="video-thumbnail" src="https://cdn.loom.com/sessions/thumbnails/baf2cd9833434d4c80f4b9e9770d01b5-212796318d2031c0-full-play.gif" alt="Interview Video">
    </a>

    <p>
      <a href="${correctBookingLink}" class="cta-button">
        📅 Schedule Your Interview Now
      </a>
    </p>

    <p class="signature">
      Looking forward to speaking with you!<br><br>
      Justin Lesh<br>
      <strong>Founder, Patient Pro Marketing</strong>
    </p>
  </div>
</body>
</html>`,
      jobRole: 'General',
      isDefault: true
    },
    {
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
    },
    {
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
    },
    {
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
    }
  ];
};
