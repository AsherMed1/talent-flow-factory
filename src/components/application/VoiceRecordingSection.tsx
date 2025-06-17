
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

  const handleVoiceRecording = (audioBlob: Blob, audioUrl: string) => {
    if (currentRecordingType === 'introduction') {
      setIntroductionRecording({ blob: audioBlob, url: audioUrl });
      // Update form with the recording URL
      form.setValue('introductionRecording', audioUrl);
    } else if (currentRecordingType === 'script') {
      setScriptRecording({ blob: audioBlob, url: audioUrl });
      // Update form with the recording URL
      form.setValue('scriptRecording', audioUrl);
    }
    setCurrentRecordingType(null);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Voice Recordings</h3>
      <p className="text-sm text-gray-600">
        For the next two questions, please record yourself using the voice recorder below.
      </p>
      
      <div className="space-y-4">
        <div>
          <Label className="text-base font-medium">
            Please Provide a Voice Recording Of Yourself. Just Tell Us a Little About You and Your Experience.
          </Label>
          <div className="mt-2">
            {!introductionRecording ? (
              <Button
                type="button"
                onClick={() => setCurrentRecordingType('introduction')}
                disabled={currentRecordingType !== null}
                className="mb-2"
              >
                Record Introduction
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-green-600 font-medium">
                  ✓ Introduction recording captured
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentRecordingType('introduction')}
                  disabled={currentRecordingType !== null}
                >
                  Re-record Introduction
                </Button>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <Label className="text-base font-medium">
            Record Yourself Confirming Call Script:
          </Label>
          <div className="bg-gray-50 p-3 rounded-md text-sm italic my-2">
            "Hey Susan, just a quick check-in to confirm your appointment for tomorrow.—it's {"{Your Name}"} from Apex Vascular. You're all set for your knee pain consultation with Dr. Pollock tomorrow at 2 PM! We're excited to see you and get you on the path to feeling better. Let me know if anything comes up—otherwise, see you then!"
          </div>
          <div className="mt-2">
            {!scriptRecording ? (
              <Button
                type="button"
                onClick={() => setCurrentRecordingType('script')}
                disabled={currentRecordingType !== null}
                className="mb-2"
              >
                Record Script
              </Button>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-green-600 font-medium">
                  ✓ Script recording captured
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentRecordingType('script')}
                  disabled={currentRecordingType !== null}
                >
                  Re-record Script
                </Button>
              </div>
            )}
          </div>
        </div>
        
        {currentRecordingType && (
          <div className="border rounded-lg p-4">
            <h4 className="font-medium mb-2">
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
