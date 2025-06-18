
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

    // Check if we have a valid URL
    if (!recordingUrl) {
      console.log('No audio URL provided');
      toast({
        title: "Audio Not Available",
        description: "Voice recording URL is not available.",
        variant: "destructive",
      });
      return;
    }

    // Check if it's a blob URL (which might be expired)
    if (recordingUrl.startsWith('blob:')) {
      console.log('Detected blob URL - these typically don\'t work across page contexts');
      toast({
        title: "Audio Unavailable",
        description: "Voice recording is not accessible. Blob URLs expire when navigating between pages.",
        variant: "destructive",
      });
      return;
    }

    // Check if URL is accessible
    const isValidHttpUrl = recordingUrl.startsWith('http://') || recordingUrl.startsWith('https://');
    if (!isValidHttpUrl) {
      console.log('Invalid URL format:', recordingUrl);
      toast({
        title: "Invalid Audio URL",
        description: "The audio URL format is not supported.",
        variant: "destructive",
      });
      return;
    }

    // Try to play the audio with the permanent URL
    console.log('Attempting to play audio with URL:', recordingUrl);
    
    if (audioRef.current) {
      // Set up event handlers before setting src
      audioRef.current.onerror = (e) => {
        console.error('❌ Audio error:', e);
        toast({
          title: "Audio Error",
          description: "Could not play the voice recording. The file may be corrupted or unavailable.",
          variant: "destructive",
        });
        setPlayingRecordingKey(null);
      };
      
      audioRef.current.onended = () => {
        console.log('✓ Audio finished playing');
        setPlayingRecordingKey(null);
      };
      
      audioRef.current.onloadstart = () => {
        console.log('🔄 Audio loading started');
      };
      
      audioRef.current.oncanplay = () => {
        console.log('✓ Audio can start playing');
      };

      audioRef.current.onpause = () => {
        console.log('⏸️ Audio paused');
      };

      audioRef.current.onplay = () => {
        console.log('▶️ Audio started playing');
      };
      
      // Set source and attempt to play
      audioRef.current.src = recordingUrl;
      audioRef.current.load(); // Reload the audio element with new source
      
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('✓ Audio playing successfully');
            setPlayingRecordingKey(recordingKey);
          })
          .catch((error) => {
            console.error('❌ Play failed:', error);
            
            // Provide more specific error messages
            if (error.name === 'NotSupportedError') {
              toast({
                title: "Audio Format Not Supported",
                description: "This audio format is not supported by your browser.",
                variant: "destructive",
              });
            } else if (error.name === 'NotAllowedError') {
              toast({
                title: "Audio Blocked",
                description: "Audio playback was blocked. Try clicking play again.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Playback Failed",
                description: "Voice recording could not be played. Please check your internet connection.",
                variant: "destructive",
              });
            }
          });
      }
    }
    console.log('=== End Audio Debug ===');
  };

  return {
    playingRecordingKey,
    audioRef,
    handleVoicePlayback
  };
};
