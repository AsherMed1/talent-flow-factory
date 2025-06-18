import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Save, X, Wand2, Loader2 } from 'lucide-react';
import { useJobRoles } from '@/hooks/useJobRoles';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface InterviewStep {
  id: string;
  title: string;
  content: string;
  type: 'instruction' | 'question' | 'task' | 'script';
}

interface InterviewGuideTemplate {
  id: string;
  jobRoleId: string;
  jobRoleName: string;
  steps: InterviewStep[];
}

export const InterviewGuideManager = () => {
  const [guides, setGuides] = useState<InterviewGuideTemplate[]>([]);
  const [editingGuide, setEditingGuide] = useState<InterviewGuideTemplate | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: jobRoles } = useJobRoles();
  const { toast } = useToast();

  const createNewStep = (): InterviewStep => ({
    id: `step-${Date.now()}-${Math.random()}`,
    title: '',
    content: '',
    type: 'instruction'
  });

  const startCreating = () => {
    setIsCreating(true);
    setEditingGuide({
      id: `guide-${Date.now()}`,
      jobRoleId: '',
      jobRoleName: '',
      steps: [createNewStep()]
    });
    setAiPrompt('');
  };

  const generateWithAI = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for AI generation",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-interview-guide', {
        body: { prompt: aiPrompt }
      });

      if (error) throw error;

      const generatedSteps = data.steps.map((step: any, index: number) => ({
        id: `step-${Date.now()}-${index}`,
        title: step.title,
        content: step.content,
        type: step.type
      }));

      setEditingGuide(prev => prev ? {
        ...prev,
        steps: generatedSteps
      } : null);

      toast({
        title: "Success",
        description: "Interview guide generated successfully! You can now customize the steps.",
      });
    } catch (error) {
      console.error('Error generating interview guide:', error);
      toast({
        title: "Error",
        description: "Failed to generate interview guide. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!editingGuide || !editingGuide.jobRoleId) return;

    const jobRole = jobRoles?.find(role => role.id === editingGuide.jobRoleId);
    if (!jobRole) return;

    const updatedGuide = {
      ...editingGuide,
      jobRoleName: jobRole.name
    };

    setGuides(prev => {
      const existing = prev.find(g => g.id === editingGuide.id);
      if (existing) {
        return prev.map(g => g.id === editingGuide.id ? updatedGuide : g);
      } else {
        return [...prev, updatedGuide];
      }
    });

    setEditingGuide(null);
    setIsCreating(false);
    
    toast({
      title: "Guide Saved",
      description: `Interview guide for ${jobRole.name} has been saved.`,
    });
  };

  const handleCancel = () => {
    setEditingGuide(null);
    setIsCreating(false);
  };

  const addStep = () => {
    if (!editingGuide) return;
    setEditingGuide({
      ...editingGuide,
      steps: [...editingGuide.steps, createNewStep()]
    });
  };

  const updateStep = (stepId: string, field: keyof InterviewStep, value: string) => {
    if (!editingGuide) return;
    setEditingGuide({
      ...editingGuide,
      steps: editingGuide.steps.map(step =>
        step.id === stepId ? { ...step, [field]: value } : step
      )
    });
  };

  const removeStep = (stepId: string) => {
    if (!editingGuide) return;
    setEditingGuide({
      ...editingGuide,
      steps: editingGuide.steps.filter(step => step.id !== stepId)
    });
  };

  const deleteGuide = (guideId: string) => {
    setGuides(prev => prev.filter(g => g.id !== guideId));
    toast({
      title: "Guide Deleted",
      description: "Interview guide has been deleted.",
    });
  };

  const getStepTypeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'task': return 'bg-purple-100 text-purple-800';
      case 'script': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interview Guide Manager</h1>
          <p className="text-gray-600">Create and manage role-specific interview guides</p>
        </div>
        <Button onClick={startCreating} disabled={isCreating}>
          <Plus className="w-4 h-4 mr-2" />
          Create Guide
        </Button>
      </div>

      {editingGuide && (
        <Card className="border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div>
                {isCreating ? 'Create New Interview Guide' : 'Edit Interview Guide'}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Job Role</label>
              <Select
                value={editingGuide.jobRoleId}
                onValueChange={(value) => setEditingGuide({ ...editingGuide, jobRoleId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a job role" />
                </SelectTrigger>
                <SelectContent>
                  {jobRoles?.map(role => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isCreating && (
              <div className="space-y-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border">
                <div className="flex items-center gap-2">
                  <Wand2 className="w-5 h-5 text-purple-600" />
                  <h3 className="font-medium text-gray-900">AI Interview Guide Generation</h3>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Describe the role or paste job description for AI to generate interview steps
                  </label>
                  <Textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g., 'Senior Sales Representative position requiring 3+ years B2B experience, cold calling skills, and CRM knowledge' or paste full job description..."
                    className="min-h-24"
                  />
                </div>
                <Button 
                  onClick={generateWithAI} 
                  disabled={isGenerating || !aiPrompt.trim()}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Interview Steps
                    </>
                  )}
                </Button>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="text-sm font-medium">Interview Steps</label>
                <Button size="sm" variant="outline" onClick={addStep}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Step
                </Button>
              </div>

              <div className="space-y-4">
                {editingGuide.steps.map((step, index) => (
                  <div key={step.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-500">Step {index + 1}</span>
                      <Select
                        value={step.type}
                        onValueChange={(value) => updateStep(step.id, 'type', value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instruction">Instruction</SelectItem>
                          <SelectItem value="question">Question</SelectItem>
                          <SelectItem value="task">Task</SelectItem>
                          <SelectItem value="script">Script</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeStep(step.id)}
                        className="ml-auto text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <Input
                      placeholder="Step title..."
                      value={step.title}
                      onChange={(e) => updateStep(step.id, 'title', e.target.value)}
                    />
                    
                    <Textarea
                      placeholder="Step content or instructions..."
                      value={step.content}
                      onChange={(e) => updateStep(step.id, 'content', e.target.value)}
                      className="min-h-24"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {guides.map(guide => (
          <Card key={guide.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div>
                  <div className="text-lg">{guide.jobRoleName}</div>
                  <div className="text-sm text-gray-500 font-normal">
                    {guide.steps.length} steps
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingGuide(guide)}
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteGuide(guide.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {guide.steps.slice(0, 3).map((step, index) => (
                  <div key={step.id} className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{index + 1}.</span>
                    <Badge className={getStepTypeColor(step.type)} variant="secondary">
                      {step.type}
                    </Badge>
                    <span className="text-sm">{step.title}</span>
                  </div>
                ))}
                {guide.steps.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{guide.steps.length - 3} more steps...
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {guides.length === 0 && !editingGuide && (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-500">
                <div className="text-lg font-medium mb-2">No Interview Guides Yet</div>
                <div className="text-sm mb-4">Create your first interview guide to get started</div>
                <Button onClick={startCreating}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Guide
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
