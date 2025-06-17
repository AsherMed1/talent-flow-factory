
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

  // Check if application has voice recordings
  const recordings = getVoiceRecordings();
  const hasVoiceRecordings = application.has_voice_recording || recordings.length > 0;

  if (!hasVoiceRecordings) return null;

  return (
    <div className="flex flex-wrap gap-1 mb-3">
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
      
      {/* Fallback: if has_voice_recording is true but no specific recordings in form_data */}
      {application.has_voice_recording && recordings.length === 0 && (
        <Badge 
          variant="outline" 
          className="text-xs cursor-pointer hover:bg-blue-50 transition-colors"
          onClick={onVoicePlayback}
        >
          {isPlaying ? (
            <Pause className="w-3 h-3 mr-1" />
          ) : (
            <Play className="w-3 h-3 mr-1" />
          )}
          Voice Recording {isPlaying && '(Playing...)'}
        </Badge>
      )}
    </div>
  );
};
