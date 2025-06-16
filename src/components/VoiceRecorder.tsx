
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Mic, Square, Play, Pause, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, audioUrl: string) => void;
  disabled?: boolean;
}

export const VoiceRecorder = ({ onRecordingComplete, disabled }: VoiceRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob, url);
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
      
      // Start duration counter
      intervalRef.current = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };

  const playRecording = () => {
    if (audioUrl && audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
      
      audioRef.current.onended = () => {
        setIsPlaying(false);
      };
    }
  };

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="p-4">
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Voice Recording</Label>
          <p className="text-xs text-gray-600 mt-1">
            Please record a 2-3 minute introduction about yourself and why you're interested in this position.
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          {!isRecording && !audioUrl && (
            <Button 
              onClick={startRecording}
              disabled={disabled}
              className="flex items-center space-x-2"
            >
              <Mic size={16} />
              <span>Start Recording</span>
            </Button>
          )}
          
          {isRecording && (
            <div className="flex items-center space-x-4">
              <Button 
                onClick={stopRecording}
                variant="destructive"
                className="flex items-center space-x-2"
              >
                <Square size={16} />
                <span>Stop Recording</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-mono">{formatDuration(duration)}</span>
              </div>
            </div>
          )}
          
          {audioUrl && (
            <div className="flex items-center space-x-4">
              <Button
                onClick={isPlaying ? pauseRecording : playRecording}
                variant="outline"
                className="flex items-center space-x-2"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </Button>
              
              <Button 
                onClick={startRecording}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Mic size={16} />
                <span>Re-record</span>
              </Button>
              
              <span className="text-sm text-gray-600">
                Duration: {formatDuration(duration)}
              </span>
            </div>
          )}
        </div>
        
        {audioUrl && (
          <audio ref={audioRef} src={audioUrl} className="hidden" />
        )}
      </CardContent>
    </Card>
  );
};
