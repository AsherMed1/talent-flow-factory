
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Volume2 } from 'lucide-react';
import { Application } from '@/hooks/useApplications';

interface VoiceRecordingsSectionProps {
  application: Application;
  playingRecordingKey: string | null;
  onVoicePlayback: (recordingKey: string, recordingUrl?: string) => void;
}

export const VoiceRecordingsSection = ({ 
  application, 
  playingRecordingKey, 
  onVoicePlayback 
}: VoiceRecordingsSectionProps) => {
  const getVoiceRecordings = () => {
    const recordings = [];
    
    console.log('Checking voice recordings for application:', application.id);
    console.log('has_voice_recording flag:', application.has_voice_recording);
    console.log('form_data:', application.form_data);
    
    // Check form_data for voice recordings from the application form
    if (application.form_data) {
      const formData = application.form_data as any;
      
      console.log('Form data keys:', Object.keys(formData));
      
      // Check for voiceRecordings object structure from the form
      if (formData.voiceRecordings) {
        console.log('voiceRecordings object found:', formData.voiceRecordings);
        
        // Check for introduction recording
        if (formData.voiceRecordings.hasIntroduction || formData.voiceRecordings.introductionRecording) {
          const url = formData.voiceRecordings.introductionRecording;
          console.log('Introduction recording URL:', url, 'Type:', typeof url);
          
          // Check if it's a permanent URL (not a blob)
          const isValidUrl = url && typeof url === 'string' && !url.startsWith('blob:');
          console.log('Introduction URL valid:', isValidUrl);
          
          recordings.push({ 
            type: 'Introduction', 
            key: 'introduction',
            hasAudio: true,
            url: url,
            isPlayable: isValidUrl
          });
        }
        
        // Check for script recording
        if (formData.voiceRecordings.hasScript || formData.voiceRecordings.scriptRecording) {
          const url = formData.voiceRecordings.scriptRecording;
          console.log('Script recording URL:', url, 'Type:', typeof url);
          
          // Check if it's a permanent URL (not a blob)
          const isValidUrl = url && typeof url === 'string' && !url.startsWith('blob:');
          console.log('Script URL valid:', isValidUrl);
          
          recordings.push({ 
            type: 'Script Reading', 
            key: 'script',
            hasAudio: true,
            url: url,
            isPlayable: isValidUrl
          });
        }
      }
      
      // Check for direct recording fields
      if (formData.introductionRecording) {
        const url = formData.introductionRecording;
        const isValidUrl = url && typeof url === 'string' && !url.startsWith('blob:');
        
        recordings.push({ 
          type: 'Introduction', 
          key: 'introduction',
          hasAudio: true,
          url: url,
          isPlayable: isValidUrl
        });
      }
      
      if (formData.scriptRecording) {
        const url = formData.scriptRecording;
        const isValidUrl = url && typeof url === 'string' && !url.startsWith('blob:');
        
        recordings.push({ 
          type: 'Script Reading', 
          key: 'script',
          hasAudio: true,
          url: url,
          isPlayable: isValidUrl
        });
      }
      
      // Check for any audio files in uploads
      if (formData.uploads?.audioFiles && Array.isArray(formData.uploads.audioFiles) && formData.uploads.audioFiles.length > 0) {
        formData.uploads.audioFiles.forEach((file: any, index: number) => {
          const url = file.url || file.src;
          const isValidUrl = url && typeof url === 'string' && !url.startsWith('blob:');
          
          recordings.push({ 
            type: `Audio File ${index + 1}`, 
            key: `audio_${index}`,
            hasAudio: true,
            fileName: file.name || `audio_${index + 1}`,
            url: url,
            isPlayable: isValidUrl
          });
        });
      }
    }
    
    // If has_voice_recording flag is true but no specific recordings found, add a generic one
    if (application.has_voice_recording && recordings.length === 0) {
      recordings.push({ 
        type: 'Voice Recording', 
        key: 'main_recording',
        hasAudio: true,
        isPlayable: false
      });
    }
    
    console.log('Found recordings:', recordings);
    return recordings;
  };

  const recordings = getVoiceRecordings();
  
  // Don't show section if no recordings found
  if (recordings.length === 0) {
    console.log('No voice recordings found for application:', application.id);
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 mb-3">
      {recordings.map((recording, index) => {
        const isCurrentlyPlaying = playingRecordingKey === recording.key;
        const canPlay = recording.isPlayable !== false;
        
        return (
          <Badge 
            key={index}
            variant="outline" 
            className={`text-xs cursor-pointer hover:bg-blue-50 transition-colors flex items-center gap-1 
              ${canPlay ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-300 opacity-60'}`}
            onClick={() => {
              if (!canPlay) {
                console.log('Recording not playable:', recording.type);
                return;
              }
              console.log('Playing recording:', recording.type, 'for application:', application.id);
              console.log('Recording URL:', recording.url);
              onVoicePlayback(recording.key, recording.url);
            }}
          >
            {isCurrentlyPlaying ? (
              <Pause className="w-3 h-3" />
            ) : canPlay ? (
              <Play className="w-3 h-3" />
            ) : (
              <Volume2 className="w-3 h-3 opacity-50" />
            )}
            {recording.type}
            {isCurrentlyPlaying && ' (Playing...)'}
            {!canPlay && ' (Unavailable)'}
          </Badge>
        );
      })}
    </div>
  );
};
