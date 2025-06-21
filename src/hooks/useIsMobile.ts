
import React from 'react';

export const useIsMobile = () => {
  // Enhanced safety check for React hooks availability
  console.log('useIsMobile - React availability check:', {
    React: !!React,
    useState: !!React?.useState,
    useEffect: !!React?.useEffect,
    windowReact: !!(window as any)?.React,
    windowUseState: !!(window as any)?.useState,
    globalReact: !!(globalThis as any)?.React
  });

  if (!React || typeof React.useState !== 'function' || typeof React.useEffect !== 'function') {
    console.error('useIsMobile: React hooks not available, returning false');
    return false;
  }

  // Use the hooks with additional safety
  let isMobile, setIsMobile;
  
  try {
    [isMobile, setIsMobile] = React.useState(false);
  } catch (error) {
    console.error('useIsMobile: useState failed:', error);
    return false;
  }

  try {
    React.useEffect(() => {
      const checkIsMobile = () => {
        if (setIsMobile && typeof setIsMobile === 'function') {
          setIsMobile(window.innerWidth < 768);
        }
      };

      checkIsMobile();
      
      window.addEventListener('resize', checkIsMobile);
      return () => window.removeEventListener('resize', checkIsMobile);
    }, []);
  } catch (error) {
    console.error('useIsMobile: useEffect failed:', error);
    return false;
  }

  return isMobile || false;
};
