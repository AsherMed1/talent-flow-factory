
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { VoiceRecorder } from '@/components/VoiceRecorder';
import { UseFormReturn } from 'react-hook-form';
import { ApplicationFormData } from './formSchema';

interface VoiceRecordingSectionProps {
  isSubmitting: boolean;
  form: UseFormReturn<ApplicationFormData>;
}

export const VoiceRecordingSection = ({ isSubmitting, form }: VoiceRecordingSectionProps) => {
  const [introductionRecording, setIntroductionRecording] = useState<{
    blob: Blob;
    url: string;
  } | null>(null);
  const [scriptRecording, setScriptRecording] = useState<{
    blob: Blob;
    url: string;
  } | null>(null);
  const [currentRecordingType, setCurrentRecordingType] = useState<'introduction' | 'script' | null>(null);

  const handleVoiceRecording = (audioBlob: Blob, permanentUrl: string) => {
    console.log('Voice recording completed:', { type: currentRecordingType, url: permanentUrl });
    
    if (currentRecordingType === 'introduction') {
      setIntroductionRecording({ blob: audioBlob, url: permanentUrl });
      form.setValue('introductionRecording', permanentUrl);
    } else if (currentRecordingType === 'script') {
      setScriptRecording({ blob: audioBlob, url: permanentUrl });
      form.setValue('scriptRecording', permanentUrl);
    }
    setCurrentRecordingType(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Voice Recordings</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        For the next two questions, please record yourself using the voice recorder below.
      </p>
      
      <div className="space-y-6">
        <div className="space-y-3">
          <Label className="text-base font-medium text-gray-800 leading-tight">
            Please Provide a Voice Recording Of Yourself. Just Tell Us a Little About You and Your Experience.
          </Label>
          <div className="mt-3">
            {!introductionRecording ? (
              <Button
                type="button"
                onClick={() => setCurrentRecordingType('introduction')}
                disabled={currentRecordingType !== null}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Record Introduction
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-green-600 font-medium flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Introduction recording saved permanently
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentRecordingType('introduction')}
                  disabled={currentRecordingType !== null}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Re-record Introduction
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-3">
          <Label className="text-base font-medium text-gray-800 leading-tight block">
            Record Yourself Confirming Call Script:
          </Label>
          <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
            <p className="text-sm italic text-gray-700 leading-relaxed">
              "Hey Susan, just a quick check-in to confirm your appointment for tomorrow.—it's {"{Your Name}"} from Apex Vascular. 
              You're all set for your knee pain consultation with Dr. Pollock tomorrow at 2 PM! We're excited to see you and get you 
              on the path to feeling better. Let me know if anything comes up—otherwise, see you then!"
            </p>
          </div>
          <div className="mt-3">
            {!scriptRecording ? (
              <Button
                type="button"
                onClick={() => setCurrentRecordingType('script')}
                disabled={currentRecordingType !== null}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Record Script
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="text-sm text-green-600 font-medium flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  Script recording saved permanently
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentRecordingType('script')}
                  disabled={currentRecordingType !== null}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Re-record Script
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {currentRecordingType && (
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-4">
              Recording: {currentRecordingType === 'introduction' ? 'Introduction' : 'Call Script'}
            </h4>
            <VoiceRecorder 
              onRecordingComplete={handleVoiceRecording}
              disabled={isSubmitting}
            />
          </div>
        )}
      </div>
    </div>
  );
};
