
import { EmailTemplate } from '../types';

export const videoEditorWelcomeTemplate: EmailTemplate = {
  id: 'video-editor-welcome',
  name: 'Video Editor Welcome Email',
  jobRole: 'Video Editor',
  isDefault: true,
  subject: '🎬 Welcome to the Creative Team at Patient Pro Marketing!',
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Welcome Video Editor - Patient Pro Marketing</title>
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
    }
    h1 {
      color: #8B5CF6;
      text-align: center;
      margin-bottom: 30px;
    }
    p {
      color: #555;
      margin-bottom: 15px;
    }
    .welcome-box {
      background: linear-gradient(135deg, #8B5CF6, #A855F7);
      color: white;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      text-align: center;
    }
    .next-steps {
      background: #F3F4F6;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .signature {
      font-size: 18px;
      margin-top: 30px;
      font-weight: bold;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎬 Welcome to Our Creative Team!</h1>

    <p>Dear {{firstName}},</p>

    <div class="welcome-box">
      <h2>🎉 Congratulations!</h2>
      <p>You're now officially part of the Patient Pro Marketing creative team as our new Video Editor!</p>
    </div>

    <p>We're thrilled to have someone with your creative vision and technical expertise join our team. Your portfolio and demo reel truly impressed us, and we can't wait to see the amazing content you'll create for our clients.</p>

    <div class="next-steps">
      <h3>🚀 Next Steps:</h3>
      <ul>
        <li><strong>Onboarding Session:</strong> You'll receive a calendar invite for your detailed onboarding</li>
        <li><strong>Creative Brief Access:</strong> Get access to our project management and creative brief system</li>
        <li><strong>Software Setup:</strong> Ensure you have all the necessary editing software and plugins</li>
        <li><strong>Team Introduction:</strong> Meet your fellow creatives and project managers</li>
      </ul>
    </div>

    <p>We're excited about the creative projects ahead and the fresh perspective you'll bring to our video content. Get ready to work on engaging healthcare marketing videos that make a real impact!</p>

    <p class="signature">
      Welcome aboard!<br><br>
      Justin Lesh<br>
      <strong>Founder, Patient Pro Marketing</strong>
    </p>
  </div>
</body>
</html>`
};
