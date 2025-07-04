
import { Button } from '@/components/ui/button';
import { Brain, Loader2, Check, X, RefreshCw } from 'lucide-react';

interface ActionButtonsProps {
  onApprove: () => void;
  onReject: () => void;
  onAnalyzeVoice?: () => void;
  onReAnalyzeVoice?: () => void;
  isUpdating: boolean;
  isAnalyzing: boolean;
  hasVoiceRecording: boolean;
  hasAnalysis: boolean;
}

export const ActionButtons = ({ 
  onApprove, 
  onReject, 
  onAnalyzeVoice, 
  onReAnalyzeVoice,
  isUpdating, 
  isAnalyzing, 
  hasVoiceRecording, 
  hasAnalysis 
}: ActionButtonsProps) => {
  return (
    <div className="flex gap-1 flex-wrap">
      <Button 
        size="sm" 
        className="text-xs h-7 bg-green-500 hover:bg-green-600 min-w-[28px]"
        onClick={onApprove}
        disabled={isUpdating}
      >
        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
      </Button>
      
      <Button 
        size="sm" 
        variant="destructive" 
        className="text-xs h-7 min-w-[28px]"
        onClick={onReject}
        disabled={isUpdating}
      >
        {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : <X className="w-3 h-3" />}
      </Button>
      
      <Button size="sm" variant="outline" className="text-xs h-7">
        ⏳
      </Button>
      
      {hasVoiceRecording && !hasAnalysis && onAnalyzeVoice && (
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-7 bg-purple-50 hover:bg-purple-100 border-purple-200"
          onClick={onAnalyzeVoice}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Brain className="w-3 h-3" />
          )}
        </Button>
      )}
      
      {hasVoiceRecording && hasAnalysis && onReAnalyzeVoice && (
        <Button 
          size="sm" 
          variant="outline" 
          className="text-xs h-7 bg-blue-50 hover:bg-blue-100 border-blue-200"
          onClick={onReAnalyzeVoice}
          disabled={isAnalyzing}
          title="Re-analyze with updated criteria"
        >
          {isAnalyzing ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
        </Button>
      )}
    </div>
  );
};
