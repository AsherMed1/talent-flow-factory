
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
    
    console.log('Checking voice recordings for application:', application.id);
    console.log('has_voice_recording flag:', application.has_voice_recording);
    console.log('form_data:', application.form_data);
    
    // Check if has_voice_recording flag is true
    if (application.has_voice_recording) {
      recordings.push({ type: 'Voice Recording', key: 'main_recording' });
    }
    
    // Check form_data for voice recordings
    if (application.form_data) {
      const formData = application.form_data as any;
      
      // Log all possible voice recording related fields
      console.log('Form data keys:', Object.keys(formData));
      
      // Check for introduction recording
      if (formData.introductionRecording || 
          (formData.voiceRecordings && formData.voiceRecordings.hasIntroduction) ||
          formData.hasIntroductionRecording) {
        recordings.push({ type: 'Introduction', key: 'introduction' });
      }
      
      // Check for script recording
      if (formData.scriptRecording || 
          (formData.voiceRecordings && formData.voiceRecordings.hasScript) ||
          formData.hasScriptRecording) {
        recordings.push({ type: 'Script Reading', key: 'script' });
      }
      
      // Check for any audio files in uploads
      if (formData.uploads?.audioFiles && Array.isArray(formData.uploads.audioFiles)) {
        formData.uploads.audioFiles.forEach((file: any, index: number) => {
          recordings.push({ type: `Audio ${index + 1}`, key: `audio_${index}` });
        });
      }
      
      // Check for other possible voice recording fields
      if (formData.voiceRecordingUrl || formData.voiceFile || formData.audioRecording) {
        if (!recordings.some(r => r.key === 'main_recording')) {
          recordings.push({ type: 'Voice Recording', key: 'main_recording' });
        }
      }
      
      // Check for any field that contains "voice" or "audio" or "recording"
      Object.keys(formData).forEach(key => {
        const lowerKey = key.toLowerCase();
        if ((lowerKey.includes('voice') || lowerKey.includes('audio') || lowerKey.includes('recording')) && 
            formData[key] && 
            !recordings.some(r => r.key === key)) {
          recordings.push({ type: `${key.charAt(0).toUpperCase() + key.slice(1)}`, key });
        }
      });
    }
    
    console.log('Found recordings:', recordings);
    return recordings;
  };

  const recordings = getVoiceRecordings();
  
  // Show voice recordings section if we have any recordings OR if has_voice_recording is true
  if (recordings.length === 0 && !application.has_voice_recording) {
    console.log('No voice recordings found for application:', application.id);
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
