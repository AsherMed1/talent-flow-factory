
import { useResendSender } from './useResendSender';
import { useToast } from './use-toast';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  jobRole: string;
  isDefault: boolean;
}

interface SendTemplateEmailParams {
  templateType: 'rejection' | 'interview';
  candidateName: string;
  candidateEmail: string;
  firstName?: string;
  lastName?: string;
  jobRole?: string;
}

export const useEmailTemplates = () => {
  const { sendEmail, isConnected } = useResendSender();
  const { toast } = useToast();

  const getTemplates = (): EmailTemplate[] => {
    const saved = localStorage.getItem('emailTemplates');
    if (saved) {
      return JSON.parse(saved);
    }
    return getDefaultTemplates();
  };

  const getDefaultTemplates = (): EmailTemplate[] => {
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
      <a href="https://link.patientpromarketing.com/widget/bookings/schedulerinterview" class="cta-button">
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
      }
    ];
  };

  const getTemplateByType = (type: 'rejection' | 'interview', jobRole?: string): EmailTemplate | null => {
    const templates = getTemplates();
    
    // Try to find a job-specific template first
    if (jobRole) {
      const jobSpecificTemplate = templates.find(t => 
        t.name.toLowerCase().includes(type) && 
        t.jobRole.toLowerCase() === jobRole.toLowerCase()
      );
      if (jobSpecificTemplate) return jobSpecificTemplate;
    }
    
    // Fall back to default template
    const defaultTemplate = templates.find(t => 
      t.name.toLowerCase().includes(type) && t.isDefault
    );
    
    return defaultTemplate || null;
  };

  const replaceVariables = (content: string, variables: Record<string, string>): string => {
    let result = content;
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, value);
    });
    return result;
  };

  const sendTemplateEmail = async ({
    templateType,
    candidateName,
    candidateEmail,
    firstName,
    lastName,
    jobRole = 'General'
  }: SendTemplateEmailParams): Promise<boolean> => {
    if (!isConnected) {
      toast({
        title: "Email Not Configured",
        description: "Please configure your email settings before sending emails.",
        variant: "destructive",
      });
      return false;
    }

    const template = getTemplateByType(templateType, jobRole);
    if (!template) {
      toast({
        title: "Template Not Found",
        description: `No ${templateType} email template found for ${jobRole}`,
        variant: "destructive",
      });
      return false;
    }

    const variables = {
      firstName: firstName || candidateName.split(' ')[0] || 'Candidate',
      lastName: lastName || candidateName.split(' ').slice(1).join(' ') || '',
      candidateName,
      jobRole,
      email: candidateEmail
    };

    const subject = replaceVariables(template.subject, variables);
    const htmlContent = replaceVariables(template.content, variables);

    return await sendEmail({
      to: candidateEmail,
      subject,
      htmlContent
    });
  };

  return {
    getTemplates,
    getTemplateByType,
    sendTemplateEmail,
    isConnected
  };
};
