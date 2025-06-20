
import React, { useState, useRef, useEffect } from 'react';
import { Play } from 'lucide-react';

interface LazyVideoProps {
  src: string;
  poster?: string;
  className?: string;
  width?: number;
  height?: number;
  controls?: boolean;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({ 
  src, 
  poster, 
  className = '', 
  width, 
  height,
  controls = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {isInView ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          width={width}
          height={height}
          controls={controls}
          onLoadedData={handleLoad}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          preload="metadata"
          className={`w-full h-auto ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div 
          className="bg-gray-200 flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
          style={{ width, height: height || width * 0.5625 }} // 16:9 aspect ratio fallback
          onClick={handlePlay}
        >
          <Play className="w-12 h-12 text-gray-500" />
        </div>
      )}
      
      {poster && !isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
          <button 
            onClick={handlePlay}
            className="bg-white/90 hover:bg-white rounded-full p-4 transition-colors"
          >
            <Play className="w-8 h-8 text-gray-800 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};
