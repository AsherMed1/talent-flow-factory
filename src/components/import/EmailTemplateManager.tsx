import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, Plus, Edit, Trash2, Eye } from 'lucide-react';

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  jobRole: string;
  isDefault: boolean;
}

export const EmailTemplateManager = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    content: '',
    jobRole: '',
    isDefault: false
  });
  const { toast } = useToast();

  useEffect(() => {
    loadTemplates();
  }, []);

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

  const loadTemplates = () => {
    // Load from localStorage for now - would be Supabase in production
    const saved = localStorage.getItem('emailTemplates');
    if (saved) {
      setTemplates(JSON.parse(saved));
    } else {
      // Add default templates
      const defaultTemplates = getDefaultTemplates();
      setTemplates(defaultTemplates);
      localStorage.setItem('emailTemplates', JSON.stringify(defaultTemplates));
    }
  };

  const saveTemplate = () => {
    if (!formData.name || !formData.subject || !formData.content) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newTemplate: EmailTemplate = {
      id: editingTemplate?.id || Date.now().toString(),
      ...formData
    };

    let updatedTemplates;
    if (editingTemplate) {
      updatedTemplates = templates.map(t => t.id === editingTemplate.id ? newTemplate : t);
    } else {
      updatedTemplates = [...templates, newTemplate];
    }

    setTemplates(updatedTemplates);
    localStorage.setItem('emailTemplates', JSON.stringify(updatedTemplates));

    // Reset form
    setFormData({ name: '', subject: '', content: '', jobRole: '', isDefault: false });
    setIsCreating(false);
    setEditingTemplate(null);

    toast({
      title: editingTemplate ? "Template Updated" : "Template Created",
      description: `Email template "${newTemplate.name}" has been saved.`,
    });
  };

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem('emailTemplates', JSON.stringify(updatedTemplates));
    
    toast({
      title: "Template Deleted",
      description: "Email template has been removed.",
    });
  };

  const startEdit = (template: EmailTemplate) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      subject: template.subject,
      content: template.content,
      jobRole: template.jobRole,
      isDefault: template.isDefault
    });
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingTemplate(null);
    setFormData({ name: '', subject: '', content: '', jobRole: '', isDefault: false });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Email Templates</h2>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Automatic Email Sending:</h4>
        <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
          <li>✅ <strong>Green button (Approve):</strong> Automatically sends "Interview Invitation" email</li>
          <li>❌ <strong>Red button (Reject):</strong> Automatically sends "Rejection Email"</li>
          <li>📧 Make sure your Resend email is configured in Settings > Email Integration</li>
        </ul>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTemplate ? 'Edit Template' : 'Create New Template'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="template-name">Template Name *</Label>
                <Input
                  id="template-name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Appointment Setter Invitation"
                />
              </div>
              <div>
                <Label htmlFor="job-role">Job Role</Label>
                <Input
                  id="job-role"
                  value={formData.jobRole}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobRole: e.target.value }))}
                  placeholder="e.g., Appointment Setter"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email-subject">Email Subject *</Label>
              <Input
                id="email-subject"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Use {{firstName}}, {{lastName}}, {{jobRole}} for personalization"
              />
            </div>

            <div>
              <Label htmlFor="email-content">Email Content *</Label>
              <Textarea
                id="email-content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Email body content. Use {{firstName}}, {{lastName}}, {{jobRole}}, {{applicationLink}} for personalization"
                rows={15}
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Available Variables:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                <div><code>{'{{firstName}}'}</code> - Candidate's first name</div>
                <div><code>{'{{lastName}}'}</code> - Candidate's last name</div>
                <div><code>{'{{email}}'}</code> - Candidate's email</div>
                <div><code>{'{{jobRole}}'}</code> - Job position</div>
                <div><code>{'{{candidateName}}'}</code> - Full candidate name</div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={cancelEdit}>Cancel</Button>
              <Button onClick={saveTemplate}>
                {editingTemplate ? 'Update Template' : 'Create Template'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {templates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <p className="text-sm text-gray-600">{template.jobRole || 'General'}</p>
                </div>
                <div className="flex items-center gap-2">
                  {template.isDefault && (
                    <Badge variant="secondary">Default</Badge>
                  )}
                  <Button variant="ghost" size="sm" onClick={() => startEdit(template)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => deleteTemplate(template.id)}
                    disabled={template.isDefault}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <Label className="text-xs text-gray-500">Subject</Label>
                  <p className="text-sm">{template.subject}</p>
                </div>
                <div>
                  <Label className="text-xs text-gray-500">Content Preview</Label>
                  <p className="text-sm text-gray-700 line-clamp-3">
                    {template.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {templates.length === 0 && !isCreating && (
        <Card>
          <CardContent className="text-center py-8">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Yet</h3>
            <p className="text-gray-500 mb-4">Create your first email template to get started.</p>
            <Button onClick={() => setIsCreating(true)}>Create Template</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
