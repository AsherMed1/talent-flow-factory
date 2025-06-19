
import { EmailTemplate } from '../types';

export const videoEditorInterviewTemplate: EmailTemplate = {
  id: 'video-editor-interview',
  name: 'Video Editor Interview Invitation',
  type: 'interview',
  jobRole: 'Video Editor',
  subject: '🎬 Exciting Video Editor Opportunity - Let\'s Schedule Your Interview!',
  content: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Patient Pro Marketing - Video Editor Interview</title>
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
      color: #8B5CF6;
      margin-bottom: 20px;
    }
    p {
      color: #555;
      margin-bottom: 15px;
    }
    .highlight {
      background: linear-gradient(135deg, #8B5CF6, #A855F7);
      color: white;
      padding: 15px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .cta-button {
      display: inline-block;
      padding: 15px 30px;
      margin-top: 15px;
      background: linear-gradient(135deg, #8B5CF6, #A855F7);
      color: #ffffff;
      font-size: 18px;
      font-weight: bold;
      border-radius: 8px;
      text-decoration: none;
    }
    .cta-button:hover {
      background: linear-gradient(135deg, #7C3AED, #9333EA);
    }
    .signature {
      font-size: 18px;
      margin-top: 30px;
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎬 Your Creative Journey Begins Here!</h1>

    <p>Hey {{firstName}},</p>

    <p>We were impressed by your portfolio and demo reel! Your creative vision and technical skills caught our attention, and we'd love to discuss how you can bring your video editing expertise to our team.</p>

    <div class="highlight">
      <h3>🎥 What We Loved About Your Application:</h3>
      <p>✨ Your portfolio showcases impressive creativity<br>
      🎬 Demo reel demonstrates strong technical skills<br>
      💼 Experience aligns perfectly with our projects</p>
    </div>

    <p>Click below to schedule your interview - we're excited to learn more about your creative process and discuss exciting video projects!</p>

    <p>
      <a href="{{bookingLink}}" class="cta-button">
        🎬 Schedule Your Creative Interview
      </a>
    </p>

    <p><strong>What to expect:</strong><br>
    • Discussion about your creative process<br>
    • Portfolio walkthrough<br>
    • Overview of exciting video projects<br>
    • Technical workflow discussion</p>

    <p class="signature">
      Looking forward to seeing your creativity in action!<br><br>
      Justin Lesh<br>
      <strong>Founder, Patient Pro Marketing</strong>
    </p>
  </div>
</body>
</html>`
};
