
// Image optimization utilities
export const generateImageSizes = (baseUrl: string, sizes: number[] = [320, 640, 1024, 1280, 1920]) => {
  if (!baseUrl) return { src: '', srcSet: '', sizes: '' };
  
  const srcSet = sizes
    .map(size => `${baseUrl}?w=${size}&q=80&f=webp ${size}w`)
    .join(', ');
  
  const sizesAttr = [
    '(max-width: 320px) 280px',
    '(max-width: 640px) 600px', 
    '(max-width: 1024px) 980px',
    '(max-width: 1280px) 1200px',
    '1800px'
  ].join(', ');

  return {
    src: `${baseUrl}?w=1280&q=80&f=webp`,
    srcSet,
    sizes: sizesAttr
  };
};

export const compressImage = (file: File, maxWidth = 1920, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob(resolve, 'image/webp', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Lazy loading utility for videos
export const setupVideoLazyLoading = () => {
  const videos = document.querySelectorAll('video[data-src]');
  
  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const video = entry.target as HTMLVideoElement;
        video.src = video.dataset.src!;
        video.load();
        videoObserver.unobserve(video);
      }
    });
  });
  
  videos.forEach(video => videoObserver.observe(video));
};
