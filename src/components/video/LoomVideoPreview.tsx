
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, ExternalLink, Loader2 } from 'lucide-react';

interface LoomVideoPreviewProps {
  loomUrl: string;
  title?: string;
  showFullPlayer?: boolean;
  className?: string;
}

export const LoomVideoPreview = ({ 
  loomUrl, 
  title = "Interview Recording", 
  showFullPlayer = false,
  className = "" 
}: LoomVideoPreviewProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(showFullPlayer);

  // Extract Loom video ID from various Loom URL formats
  const extractLoomId = (url: string) => {
    const patterns = [
      /loom\.com\/share\/([a-zA-Z0-9]+)/,
      /loom\.com\/embed\/([a-zA-Z0-9]+)/,
      /loom\.com\/v\/([a-zA-Z0-9]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const loomId = extractLoomId(loomUrl);
  
  if (!loomId) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="text-center text-gray-500">
            <p className="text-sm">Invalid Loom URL</p>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open(loomUrl, '_blank')}
              className="mt-2"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Link
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const embedUrl = `https://www.loom.com/embed/${loomId}`;
  const thumbnailUrl = `https://cdn.loom.com/sessions/thumbnails/${loomId}-with-play.gif`;

  if (!showPlayer) {
    return (
      <Card className={`cursor-pointer hover:shadow-md transition-shadow ${className}`}>
        <CardContent className="p-4">
          <div className="relative">
            <img 
              src={thumbnailUrl}
              alt={title}
              className="w-full h-32 object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-lg">
              <Button
                onClick={() => setShowPlayer(true)}
                className="bg-white bg-opacity-90 hover:bg-opacity-100 text-black"
              >
                <Play className="w-5 h-5 mr-2" />
                Play Interview
              </Button>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <p className="text-sm font-medium truncate">{title}</p>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                window.open(loomUrl, '_blank');
              }}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium">{title}</h4>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowPlayer(false)}
            >
              Close
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open(loomUrl, '_blank')}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          )}
          <iframe
            src={embedUrl}
            className="absolute top-0 left-0 w-full h-full rounded-lg"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
