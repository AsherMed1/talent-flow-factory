
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2 } from 'lucide-react';

interface ProgressStep {
  id: string;
  title: string;
  estimatedTime: string;
  completed: boolean;
}

interface ProgressIndicatorProps {
  currentStep: number;
  steps: ProgressStep[];
}

export const ProgressIndicator = ({ currentStep, steps }: ProgressIndicatorProps) => {
  const progress = ((currentStep + 1) / steps.length) * 100;
  const totalTime = steps.reduce((acc, step, index) => {
    if (index > currentStep) {
      const time = parseInt(step.estimatedTime);
      return acc + time;
    }
    return acc;
  }, 0);

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Application Progress</h3>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          ~{totalTime} min remaining
        </div>
      </div>
      
      <Progress value={progress} className="mb-4 h-2" />
      
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center justify-between">
            <div className="flex items-center">
              {step.completed ? (
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
              ) : (
                <div className={`w-4 h-4 rounded-full mr-2 ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
              )}
              <span className={`text-sm ${
                index <= currentStep ? 'text-gray-900 font-medium' : 'text-gray-500'
              }`}>
                {step.title}
              </span>
            </div>
            <span className="text-xs text-gray-500">{step.estimatedTime}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
