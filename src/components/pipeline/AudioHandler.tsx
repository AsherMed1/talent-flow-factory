
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useAudioHandler = () => {
  const [playingRecordingKey, setPlayingRecordingKey] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const handleVoicePlayback = (recordingKey: string, recordingUrl?: string) => {
    console.log('=== Audio Playback Debug ===');
    console.log('handleVoicePlayback called with:', { recordingKey, recordingUrl });
    
    // If the same recording is already playing, stop it
    if (playingRecordingKey === recordingKey) {
      console.log('Stopping currently playing recording');
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setPlayingRecordingKey(null);
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      console.log('Stopping previous audio');
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Check if we have a valid URL and it's a blob URL
    if (recordingUrl && recordingUrl.startsWith('blob:')) {
      console.log('Detected blob URL - these typically don\'t work across page contexts');
      toast({
        title: "Audio Unavailable",
        description: "Voice recording is not accessible. Blob URLs expire when navigating between pages.",
        variant: "destructive",
      });
      return;
    }

    // Try to play the specific recording if we have a valid URL
    if (recordingUrl && !recordingUrl.startsWith('blob:')) {
      console.log('Attempting to play audio with URL:', recordingUrl);
      
      if (audioRef.current) {
        audioRef.current.onerror = (e) => {
          console.error('❌ Audio error:', e);
          toast({
            title: "Audio Error",
            description: "Could not play the voice recording.",
            variant: "destructive",
          });
          setPlayingRecordingKey(null);
        };
        
        audioRef.current.onended = () => {
          console.log('✓ Audio finished playing');
          setPlayingRecordingKey(null);
        };
        
        audioRef.current.src = recordingUrl;
        audioRef.current.play()
          .then(() => {
            console.log('✓ Audio playing successfully');
            setPlayingRecordingKey(recordingKey);
          })
          .catch((error) => {
            console.error('❌ Play failed:', error);
            toast({
              title: "Playback Failed",
              description: "Voice recording could not be played.",
              variant: "destructive",
            });
          });
      }
    } else {
      // No valid URL - show helpful message
      console.log('No valid audio URL available');
      toast({
        title: "Audio Not Available",
        description: "Voice recording was submitted but audio file is not accessible in this context.",
        variant: "destructive",
      });
    }
    console.log('=== End Audio Debug ===');
  };

  return {
    playingRecordingKey,
    audioRef,
    handleVoicePlayback
  };
};
