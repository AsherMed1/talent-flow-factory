
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Application } from '@/hooks/useApplications';

interface VoiceRecordingsSectionProps {
  application: Application;
  isPlaying: boolean;
  onVoicePlayback: () => void;
}

export const VoiceRecordingsSection = ({ application, isPlaying, onVoicePlayback }: VoiceRecordingsSectionProps) => {
  const getVoiceRecordings = () => {
    const recordings = [];
    
    // First check if has_voice_recording flag is true
    if (application.has_voice_recording) {
      recordings.push({ type: 'Voice Recording', key: 'main_recording' });
    }
    
    // Then check form_data for additional voice recordings
    if (application.form_data) {
      const formData = application.form_data as any;
      
      // Check for voice recordings in the form data
      if (formData.voiceRecordings) {
        if (formData.voiceRecordings.hasIntroduction && !recordings.some(r => r.type.includes('Introduction'))) {
          recordings.push({ type: 'Introduction', key: 'introduction' });
        }
        if (formData.voiceRecordings.hasScript && !recordings.some(r => r.type.includes('Script'))) {
          recordings.push({ type: 'Script Reading', key: 'script' });
        }
      }
      
      // Also check for any audio files in uploads
      if (formData.uploads?.audioFiles && formData.uploads.audioFiles.length > 0) {
        formData.uploads.audioFiles.forEach((file: any, index: number) => {
          recordings.push({ type: `Audio ${index + 1}`, key: `audio_${index}` });
        });
      }
      
      // Check for voice recording URLs or files
      if (formData.voiceRecordingUrl || formData.voiceFile) {
        if (!recordings.some(r => r.key === 'main_recording')) {
          recordings.push({ type: 'Voice Recording', key: 'main_recording' });
        }
      }
    }
    
    return recordings;
  };

  const recordings = getVoiceRecordings();
  
  // Show voice recordings if we have any recordings OR if has_voice_recording is true
  if (recordings.length === 0 && !application.has_voice_recording) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {recordings.length > 0 ? (
        recordings.map((recording, index) => (
          <Badge 
            key={index}
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-1 bg-blue-50 border-blue-200"
            onClick={onVoicePlayback}
          >
            {isPlaying ? (
              <Pause className="w-3 h-3" />
            ) : (
              <Play className="w-3 h-3" />
            )}
            {recording.type} {isPlaying && '(Playing...)'}
          </Badge>
        ))
      ) : (
        // Fallback: if has_voice_recording is true but no specific recordings found
        application.has_voice_recording && (
          <Badge 
            variant="outline" 
            className="text-xs cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-1 bg-blue-50 border-blue-200"
            onClick={onVoicePlayback}
          >
            <Volume2 className="w-3 h-3" />
            Voice Recording {isPlaying && '(Playing...)'}
          </Badge>
        )
      )}
    </div>
  );
};
