
import { useState, useRef } from 'react';
import { Calendar, Star, ChevronRight, Phone, Mail, FileText, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Application } from '@/hooks/useApplications';
import { ApplicationActions } from './ApplicationActions';
import { RatingDisplay } from './RatingDisplay';

interface MobileApplicationCardProps {
  application: Application;
  stageIndex: number;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
}

export const MobileApplicationCard = ({ 
  application, 
  stageIndex, 
  onSwipeLeft, 
  onSwipeRight 
}: MobileApplicationCardProps) => {
  const [playingRecordingKey, setPlayingRecordingKey] = useState<string | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const minSwipeDistance = 50;

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && onSwipeLeft) {
      onSwipeLeft();
    }
    if (isRightSwipe && onSwipeRight) {
      onSwipeRight();
    }
  };

  const handleVoicePlayback = () => {
    if (application.form_data) {
      const formData = application.form_data as any;
      let audioUrl = null;
      let recordingKey = 'main';
      
      if (formData.voiceRecordings?.introductionRecording) {
        audioUrl = formData.voiceRecordings.introductionRecording;
        recordingKey = 'introduction';
      } else if (formData.voiceRecordings?.scriptRecording) {
        audioUrl = formData.voiceRecordings.scriptRecording;
        recordingKey = 'script';
      }
      
      // If already playing this recording, stop it
      if (playingRecordingKey === recordingKey) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        setPlayingRecordingKey(null);
        return;
      }
      
      if (audioUrl) {
        if (audioRef.current) {
          audioRef.current.src = audioUrl;
          audioRef.current.play()
            .then(() => setPlayingRecordingKey(recordingKey))
            .catch(() => {
              setPlayingRecordingKey(recordingKey);
              setTimeout(() => setPlayingRecordingKey(null), 3000);
            });
          
          audioRef.current.onended = () => setPlayingRecordingKey(null);
        }
      } else {
        setPlayingRecordingKey(recordingKey);
        setTimeout(() => setPlayingRecordingKey(null), 3000);
      }
    }
  };

  const hasDocuments = application.form_data && (
    (application.form_data as any).resume || 
    (application.form_data as any).coverLetter ||
    (application.form_data as any).portfolio
  );

  const hasVoiceRecordings = application.form_data && (
    (application.form_data as any).voiceRecordings?.introductionRecording ||
    (application.form_data as any).voiceRecordings?.scriptRecording ||
    (application.form_data as any).introductionRecording ||
    (application.form_data as any).scriptRecording
  );

  const isPlaying = playingRecordingKey !== null;

  return (
    <Card 
      className="mb-3 touch-manipulation"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <CardContent className="p-4">
        <audio ref={audioRef} className="hidden" />
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarFallback className="text-sm">
                {application.candidates.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="font-medium text-base truncate">{application.candidates.name}</div>
              <div className="text-sm text-gray-500 truncate">
                {application.job_roles && application.job_roles.name ? application.job_roles.name : 'Unknown Role'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </div>

        {/* Rating and Score */}
        <div className="flex items-center justify-between mb-3">
          <RatingDisplay rating={application.rating} size="sm" showEmpty={false} />
          {application.voice_analysis_score && (
            <Badge variant="outline" className="text-xs">
              Voice: {application.voice_analysis_score}/10
            </Badge>
          )}
        </div>

        {/* Date Information */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Applied {new Date(application.applied_date).toLocaleDateString()}</span>
          </div>
          {application.interview_date && (
            <div className="text-blue-600">
              Interview: {new Date(application.interview_date).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Quick Action Icons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex gap-3">
            {hasDocuments && (
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <FileText className="w-4 h-4 text-blue-600" />
              </Button>
            )}
            {hasVoiceRecordings && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2"
                onClick={handleVoicePlayback}
              >
                <Mic className={`w-4 h-4 ${isPlaying ? 'text-red-600' : 'text-green-600'}`} />
              </Button>
            )}
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <Mail className="w-4 h-4 text-gray-600" />
            </Button>
            {application.candidates.phone && (
              <Button variant="ghost" size="sm" className="h-8 px-2">
                <Phone className="w-4 h-4 text-gray-600" />
              </Button>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-2 border-t">
          <ApplicationActions application={application} currentStageIndex={stageIndex} />
        </div>
      </CardContent>
    </Card>
  );
};
