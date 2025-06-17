
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Star, Calendar, FileText, Play, Volume2, Pause } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { ApplicationActions } from './ApplicationActions';
import { useState, useRef } from 'react';

interface ApplicationCardProps {
  application: Application;
  stageIndex: number;
}

export const ApplicationCard = ({ application, stageIndex }: ApplicationCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const renderStars = (rating: number | null) => {
    if (!rating) return null;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${index < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const getVoiceScoreColor = (score: number | null) => {
    if (!score) return 'bg-gray-100 text-gray-600';
    if (score >= 8) return 'bg-green-100 text-green-800';
    if (score >= 6) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const handleVoicePlayback = () => {
    console.log('Playing voice recording for:', application.candidates.name);
    
    // For demo purposes, we'll simulate audio playback
    // In a real implementation, you would fetch the actual audio file
    if (!isPlaying) {
      setIsPlaying(true);
      // Simulate audio duration
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow bg-white">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-xs">
                {application.candidates.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium text-sm">{application.candidates.name}</div>
              <div className="text-xs text-gray-500">{application.job_roles?.name || 'Unknown Role'}</div>
            </div>
          </div>
          {application.rating && (
            <div className="flex gap-1">
              {renderStars(application.rating)}
            </div>
          )}
        </div>
        
        <div className="text-xs text-gray-500 mb-3">
          Applied: {new Date(application.applied_date).toLocaleDateString()}
        </div>
        
        <div className="flex gap-1 mb-3">
          {application.has_resume && (
            <Badge variant="outline" className="text-xs">
              <FileText className="w-3 h-3 mr-1" />
              Resume
            </Badge>
          )}
          {application.has_voice_recording && (
            <Badge 
              variant="outline" 
              className="text-xs cursor-pointer hover:bg-blue-50 transition-colors"
              onClick={handleVoicePlayback}
            >
              {isPlaying ? (
                <Pause className="w-3 h-3 mr-1" />
              ) : (
                <Play className="w-3 h-3 mr-1" />
              )}
              Voice {isPlaying && '(Playing...)'}
            </Badge>
          )}
          {application.has_video && (
            <Badge variant="outline" className="text-xs">
              📹 Video
            </Badge>
          )}
        </div>

        {/* Voice Analysis Summary */}
        {application.has_voice_recording && application.voice_analysis_score && (
          <div className="mb-3 p-2 bg-blue-50 rounded-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium flex items-center gap-1">
                <Volume2 className="w-3 h-3" />
                Voice Analysis
              </span>
              <Badge 
                variant="outline" 
                className={`text-xs ${getVoiceScoreColor(application.voice_analysis_score)}`}
              >
                {application.voice_analysis_score}/10
              </Badge>
            </div>
            {/* Quick trait scores */}
            <div className="grid grid-cols-2 gap-1 text-xs">
              {application.voice_clarity_score && (
                <span>Clarity: {application.voice_clarity_score}/10</span>
              )}
              {application.voice_confidence_score && (
                <span>Confidence: {application.voice_confidence_score}/10</span>
              )}
              {application.voice_tone_score && (
                <span>Tone: {application.voice_tone_score}/10</span>
              )}
              {application.voice_energy_score && (
                <span>Energy: {application.voice_energy_score}/10</span>
              )}
            </div>
          </div>
        )}
        
        {/* Display candidate tags */}
        {application.candidates.candidate_tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {application.candidates.candidate_tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs bg-blue-50">
                {tag.tag}
              </Badge>
            ))}
          </div>
        )}
        
        {application.interview_date && (
          <div className="text-xs text-blue-600 mb-2">
            <Calendar className="w-3 h-3 inline mr-1" />
            {new Date(application.interview_date).toLocaleDateString()}
          </div>
        )}
        
        {application.offer_sent_date && (
          <div className="text-xs text-green-600 mb-2">
            Offer sent: {new Date(application.offer_sent_date).toLocaleDateString()}
          </div>
        )}
        
        <ApplicationActions application={application} currentStageIndex={stageIndex} />
      </CardContent>
    </Card>
  );
};
