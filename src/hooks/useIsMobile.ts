
import React from 'react';

export const useIsMobile = () => {
  // Safety check for React hooks availability
  if (!React || typeof React.useState !== 'function') {
    console.warn('React hooks not available in useIsMobile, returning false');
    return false;
  }

  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return isMobile;
};
