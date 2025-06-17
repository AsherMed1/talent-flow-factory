
import { Badge } from '@/components/ui/badge';
import { Play, Pause } from 'lucide-react';
import { Application } from '@/hooks/useApplications';

interface VoiceRecordingsSectionProps {
  application: Application;
  isPlaying: boolean;
  onVoicePlayback: () => void;
}

export const VoiceRecordingsSection = ({ application, isPlaying, onVoicePlayback }: VoiceRecordingsSectionProps) => {
  const getVoiceRecordings = () => {
    const recordings = [];
    if (application.form_data) {
      const formData = application.form_data as any;
      if (formData.voiceRecordings?.hasIntroduction) {
        recordings.push({ type: 'Introduction', key: 'introduction' });
      }
      if (formData.voiceRecordings?.hasScript) {
        recordings.push({ type: 'Script Reading', key: 'script' });
      }
    }
    return recordings;
  };

  if (!application.has_voice_recording) return null;

  const recordings = getVoiceRecordings();

  return (
    <div className="mb-3">
      <div className="text-xs font-medium text-gray-700 mb-1">Voice Recordings:</div>
      <div className="flex flex-wrap gap-1">
        {recordings.map((recording, index) => (
          <Badge 
            key={index}
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-blue-50 transition-colors"
            onClick={onVoicePlayback}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 mr-1" />
            ) : (
              <Play className="w-3 h-3 mr-1" />
            )}
            {recording.type} {isPlaying && '(Playing...)'}
          </Badge>
        ))}
      </div>
    </div>
  );
};
