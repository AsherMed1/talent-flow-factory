
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CheckCircle, Circle, FileText, Play } from 'lucide-react';
import { useState } from 'react';

interface InterviewStep {
  id: string;
  title: string;
  content: string;
  type: 'instruction' | 'question' | 'task' | 'script';
  completed?: boolean;
}

interface InterviewGuideProps {
  jobRole: string;
  steps: InterviewStep[];
  onStepComplete: (stepId: string, notes?: string) => void;
  onUpdateNotes: (stepId: string, notes: string) => void;
  stepNotes: Record<string, string>;
}

export const InterviewGuide = ({ 
  jobRole, 
  steps, 
  onStepComplete, 
  onUpdateNotes, 
  stepNotes 
}: InterviewGuideProps) => {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const getStepIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle className="w-4 h-4 text-green-600" />;
    
    switch (type) {
      case 'question': return <Circle className="w-4 h-4 text-blue-600" />;
      case 'task': return <Play className="w-4 h-4 text-purple-600" />;
      case 'script': return <FileText className="w-4 h-4 text-orange-600" />;
      default: return <Circle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStepBadgeColor = (type: string) => {
    switch (type) {
      case 'question': return 'bg-blue-100 text-blue-800';
      case 'task': return 'bg-purple-100 text-purple-800';
      case 'script': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>
            <div className="text-lg">Interview Guide: {jobRole}</div>
            <div className="text-sm text-gray-500 font-normal">
              {steps.filter(s => s.completed).length} of {steps.length} steps completed
            </div>
          </div>
          <div className="text-sm text-gray-500">
            Progress: {Math.round((steps.filter(s => s.completed).length / steps.length) * 100)}%
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.id} className="border rounded-lg p-3">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => onStepComplete(step.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {getStepIcon(step.type, step.completed || false)}
                </button>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-sm">{step.title}</h4>
                    <Badge className={getStepBadgeColor(step.type)} variant="secondary">
                      {step.type}
                    </Badge>
                  </div>
                  
                  <div className="text-sm text-gray-700 whitespace-pre-wrap mb-2">
                    {step.content}
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                    >
                      {expandedStep === step.id ? 'Hide Notes' : 'Add Notes'}
                    </Button>
                  </div>

                  {expandedStep === step.id && (
                    <div className="mt-3">
                      <Textarea
                        placeholder="Add your notes for this step..."
                        value={stepNotes[step.id] || ''}
                        onChange={(e) => onUpdateNotes(step.id, e.target.value)}
                        className="min-h-20"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
