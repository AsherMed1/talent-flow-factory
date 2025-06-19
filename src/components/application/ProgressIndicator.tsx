
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle2, Video, Mic, Upload } from 'lucide-react';
import { detectRoleType } from '@/utils/roleDetection';

interface ProgressStep {
  id: string;
  title: string;
  estimatedTime: string;
  completed: boolean;
  icon?: React.ReactNode;
  roleSpecific?: 'video-editor' | 'appointment-setter' | 'both';
}

interface ProgressIndicatorProps {
  currentStep: number;
  steps: ProgressStep[];
  roleName?: string;
}

export const ProgressIndicator = ({ currentStep, steps, roleName }: ProgressIndicatorProps) => {
  const { isVideoEditor, isAppointmentSetter } = detectRoleType(roleName);
  
  // Filter steps based on role type
  const roleFilteredSteps = steps.filter(step => {
    if (!step.roleSpecific || step.roleSpecific === 'both') return true;
    if (step.roleSpecific === 'video-editor') return isVideoEditor;
    if (step.roleSpecific === 'appointment-setter') return isAppointmentSetter;
    return true;
  });

  const progress = ((currentStep + 1) / roleFilteredSteps.length) * 100;
  const totalTime = roleFilteredSteps.reduce((acc, step, index) => {
    if (index > currentStep) {
      const time = parseInt(step.estimatedTime);
      return acc + time;
    }
    return acc;
  }, 0);

  const getRoleSpecificTitle = () => {
    if (isVideoEditor) return 'Video Editor Application Progress';
    if (isAppointmentSetter) return 'Appointment Setter Application Progress';
    return 'Application Progress';
  };

  const getRoleSpecificIcon = () => {
    if (isVideoEditor) return <Video className="w-5 h-5 text-purple-600" />;
    if (isAppointmentSetter) return <Mic className="w-5 h-5 text-blue-600" />;
    return <Upload className="w-5 h-5 text-gray-600" />;
  };

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getRoleSpecificIcon()}
          <h3 className="text-lg font-semibold text-gray-900">{getRoleSpecificTitle()}</h3>
        </div>
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          ~{totalTime} min remaining
        </div>
      </div>
      
      <Progress 
        value={progress} 
        className={`mb-4 h-2 ${isVideoEditor ? '[&>div]:bg-purple-600' : '[&>div]:bg-blue-600'}`} 
      />
      
      <div className="space-y-3">
        {roleFilteredSteps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = step.completed || index < currentStep;
          
          return (
            <div key={step.id} className="flex items-center justify-between">
              <div className="flex items-center">
                {isCompleted ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-3" />
                ) : (
                  <div className={`w-4 h-4 rounded-full mr-3 ${
                    isActive 
                      ? isVideoEditor ? 'bg-purple-500' : 'bg-blue-500'
                      : 'bg-gray-300'
                  }`} />
                )}
                <div className="flex items-center gap-2">
                  {step.icon && (
                    <span className={`${
                      isActive 
                        ? isVideoEditor ? 'text-purple-600' : 'text-blue-600'
                        : isCompleted ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {step.icon}
                    </span>
                  )}
                  <span className={`text-sm ${
                    isActive || isCompleted 
                      ? 'text-gray-900 font-medium' 
                      : 'text-gray-500'
                  }`}>
                    {step.title}
                  </span>
                </div>
              </div>
              <span className="text-xs text-gray-500">{step.estimatedTime}</span>
            </div>
          );
        })}
      </div>
      
      {/* Role-specific tips */}
      <div className={`mt-4 p-3 rounded-lg text-xs ${
        isVideoEditor 
          ? 'bg-purple-50 text-purple-700 border border-purple-200' 
          : 'bg-blue-50 text-blue-700 border border-blue-200'
      }`}>
        {isVideoEditor ? (
          <>💡 Tip: Have your portfolio and demo reel ready for faster completion</>
        ) : (
          <>💡 Tip: Find a quiet space for voice recordings to ensure best quality</>
        )}
      </div>
    </div>
  );
};
