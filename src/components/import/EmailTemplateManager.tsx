
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

  const loadTemplates = () => {
    // Load from localStorage for now - would be Supabase in production
    const saved = localStorage.getItem('emailTemplates');
    if (saved) {
      setTemplates(JSON.parse(saved));
    } else {
      // Add default template
      const defaultTemplate: EmailTemplate = {
        id: '1',
        name: 'Default Application Invitation',
        subject: 'Invitation to Apply - {{jobRole}} Position',
        content: `Hi {{firstName}},

Thank you for your interest in our {{jobRole}} position!

We'd like to invite you to complete our application process. This will include:
- Basic information form
- Voice recording to assess communication skills
- Optional document uploads (resume, portfolio, etc.)

Please click the link below to get started:
{{applicationLink}}

The application typically takes 10-15 minutes to complete.

Best regards,
The Hiring Team`,
        jobRole: 'General',
        isDefault: true
      };
      setTemplates([defaultTemplate]);
      localStorage.setItem('emailTemplates', JSON.stringify([defaultTemplate]));
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
                rows={10}
              />
            </div>

            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Available Variables:</h4>
              <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                <div><code>{'{{firstName}}'}</code> - Candidate's first name</div>
                <div><code>{'{{lastName}}'}</code> - Candidate's last name</div>
                <div><code>{'{{email}}'}</code> - Candidate's email</div>
                <div><code>{'{{jobRole}}'}</code> - Job position</div>
                <div><code>{'{{applicationLink}}'}</code> - Link to application form</div>
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
                    {template.content.substring(0, 150)}...
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
