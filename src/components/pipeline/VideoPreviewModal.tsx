import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, X, Play, Pause, Volume2, VolumeX, Maximize, ExternalLink } from 'lucide-react';
import { Application } from '@/hooks/useApplications';

interface VideoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  videoType: 'demo-reel' | 'introduction' | 'general';
}

export const VideoPreviewModal = ({ 
  isOpen, 
  onClose, 
  application, 
  videoType 
}: VideoPreviewModalProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoError, setVideoError] = useState(false);

  const getVideoUrl = () => {
    if (!application.form_data) return null;
    
    const formData = application.form_data as any;
    
    switch (videoType) {
      case 'demo-reel':
        return formData.portfolio?.videoUpload || formData.videoUpload || null;
      case 'introduction':
        return formData.voiceRecordings?.introductionRecording || null;
      case 'general':
        return formData.video || formData.videoFile || null;
      default:
        return null;
    }
  };

  const getVideoTitle = () => {
    switch (videoType) {
      case 'demo-reel':
        return '🎬 Demo Reel';
      case 'introduction':
        return '🎤 Introduction Recording';
      case 'general':
        return '📹 Video Submission';
      default:
        return 'Video';
    }
  };

  const getPortfolioUrl = () => {
    if (!application.form_data) return null;
    const formData = application.form_data as any;
    return formData.portfolio?.portfolioUrl || formData.portfolioUrl || null;
  };

  const videoUrl = getVideoUrl();
  const portfolioUrl = getPortfolioUrl();

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = `${application.candidate.name}_${videoType.replace('-', '_')}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleFullscreen = () => {
    const video = document.querySelector('video');
    if (video && video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const renderContent = () => {
    if (!videoUrl || videoError) {
      return (
        <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
          <div className="text-center text-gray-500">
            <Play className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">Video Not Available</p>
            <p className="text-sm">This video was not uploaded or the file is no longer accessible.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="relative bg-black rounded-lg overflow-hidden">
        <video 
          className="w-full max-h-96"
          controls
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          onError={() => setVideoError(true)}
          muted={isMuted}
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
        
        {/* Custom controls overlay */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsMuted(!isMuted)}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleFullscreen}
            className="bg-black/50 text-white hover:bg-black/70"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <DialogTitle className="flex items-center gap-2">
              {getVideoTitle()} - {application.candidate.name}
            </DialogTitle>
            {videoType === 'demo-reel' && (
              <Badge className="bg-purple-100 text-purple-800 border-purple-200">
                Portfolio Submission
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {videoUrl && (
              <Button 
                onClick={handleDownload} 
                variant="outline" 
                size="sm"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            )}
            {portfolioUrl && videoType === 'demo-reel' && (
              <Button
                onClick={() => window.open(portfolioUrl, '_blank')}
                variant="outline"
                size="sm"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Portfolio
              </Button>
            )}
            <Button 
              onClick={onClose} 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="mt-4">
          {renderContent()}
          
          {/* Additional info for video editors */}
          {videoType === 'demo-reel' && portfolioUrl && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <ExternalLink className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-purple-900">Portfolio Link</span>
              </div>
              <a 
                href={portfolioUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-purple-600 hover:text-purple-800 underline break-all"
              >
                {portfolioUrl}
              </a>
            </div>
          )}
          
          {/* Video metadata */}
          <div className="mt-4 text-sm text-gray-500 grid grid-cols-2 gap-4">
            <div>
              <span className="font-medium">Candidate:</span> {application.candidate.name}
            </div>
            <div>
              <span className="font-medium">Applied:</span> {new Date(application.applied_date).toLocaleDateString()}
            </div>
            {application.job_role?.name && (
              <div>
                <span className="font-medium">Role:</span> {application.job_role.name}
              </div>
            )}
            <div>
              <span className="font-medium">Status:</span> {application.status.replace('_', ' ')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
