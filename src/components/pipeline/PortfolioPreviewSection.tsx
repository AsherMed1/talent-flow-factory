
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Eye, CheckCircle, AlertTriangle, Globe, Play } from 'lucide-react';
import { Application } from '@/hooks/useApplications';
import { VideoPreviewModal } from './VideoPreviewModal';

interface PortfolioPreviewSectionProps {
  application: Application;
}

export const PortfolioPreviewSection = ({ application }: PortfolioPreviewSectionProps) => {
  const [videoPreview, setVideoPreview] = useState<{
    isOpen: boolean;
    type: 'demo-reel' | 'introduction' | 'general';
  }>({
    isOpen: false,
    type: 'demo-reel'
  });

  if (!application.form_data) return null;

  const formData = application.form_data as any;
  const portfolioUrl = formData.portfolio?.portfolioUrl || formData.portfolioUrl;
  const hasVideoUpload = formData.portfolio?.videoUpload || formData.videoUpload;
  const hasPortfolioUrl = formData.portfolio?.hasPortfolioUrl || !!portfolioUrl;

  if (!hasPortfolioUrl && !hasVideoUpload) return null;

  const validatePortfolioUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      const domain = urlObj.hostname.toLowerCase();
      
      // Common portfolio platforms
      const portfolioPlatforms = [
        'behance.net',
        'dribbble.com',
        'vimeo.com',
        'youtube.com',
        'youtu.be',
        'portfolio.adobe.com',
        'artstation.com',
        'cargo.site',
        'format.com',
        'squarespace.com',
        'wix.com',
        'weebly.com'
      ];

      const isPortfolioPlatform = portfolioPlatforms.some(platform => 
        domain.includes(platform) || domain.endsWith(platform)
      );

      return {
        isValid: true,
        isPortfolioPlatform,
        platform: isPortfolioPlatform ? portfolioPlatforms.find(p => domain.includes(p)) : 'custom',
        domain
      };
    } catch {
      return {
        isValid: false,
        isPortfolioPlatform: false,
        platform: null,
        domain: null
      };
    }
  };

  const urlValidation = portfolioUrl ? validatePortfolioUrl(portfolioUrl) : null;

  const openVideoPreview = (type: 'demo-reel' | 'introduction' | 'general') => {
    setVideoPreview({ isOpen: true, type });
  };

  const closeVideoPreview = () => {
    setVideoPreview({ isOpen: false, type: 'demo-reel' });
  };

  return (
    <>
      <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4 text-purple-600" />
          <span className="font-medium text-purple-900">Video Editor Portfolio</span>
        </div>

        <div className="space-y-3">
          {/* Portfolio URL */}
          {hasPortfolioUrl && portfolioUrl && (
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <ExternalLink className="w-3 h-3 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">Portfolio Website</span>
                  {urlValidation?.isValid ? (
                    <Badge className="text-xs bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Valid URL
                    </Badge>
                  ) : (
                    <Badge className="text-xs bg-red-100 text-red-700 border-red-200">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Invalid URL
                    </Badge>
                  )}
                  {urlValidation?.isPortfolioPlatform && (
                    <Badge className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                      {urlValidation.platform}
                    </Badge>
                  )}
                </div>
                <a 
                  href={portfolioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-purple-600 hover:text-purple-800 underline text-sm break-all"
                >
                  {portfolioUrl}
                </a>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(portfolioUrl, '_blank')}
                className="ml-3"
              >
                <Eye className="w-3 h-3 mr-1" />
                View
              </Button>
            </div>
          )}

          {/* Demo Reel Video */}
          {hasVideoUpload && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Play className="w-3 h-3 text-purple-600" />
                <span className="text-sm font-medium text-purple-900">Demo Reel Video</span>
                <Badge className="text-xs bg-purple-100 text-purple-700 border-purple-200">
                  Uploaded
                </Badge>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => openVideoPreview('demo-reel')}
              >
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
            </div>
          )}

          {/* Portfolio Quality Assessment */}
          {(hasPortfolioUrl || hasVideoUpload) && (
            <div className="mt-3 pt-3 border-t border-purple-200">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="flex items-center gap-1">
                  <span className="text-purple-600">Portfolio URL:</span>
                  <span className={`font-medium ${urlValidation?.isValid ? 'text-green-600' : 'text-red-600'}`}>
                    {hasPortfolioUrl ? (urlValidation?.isValid ? 'Valid' : 'Invalid') : 'Not provided'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-purple-600">Demo Reel:</span>
                  <span className={`font-medium ${hasVideoUpload ? 'text-green-600' : 'text-gray-500'}`}>
                    {hasVideoUpload ? 'Uploaded' : 'Not provided'}
                  </span>
                </div>
                {urlValidation?.isPortfolioPlatform && (
                  <div className="flex items-center gap-1 col-span-2">
                    <span className="text-purple-600">Platform:</span>
                    <span className="font-medium text-blue-600">
                      {urlValidation.platform}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <VideoPreviewModal
        isOpen={videoPreview.isOpen}
        onClose={closeVideoPreview}
        application={application}
        videoType={videoPreview.type}
      />
    </>
  );
};
