
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface PerformanceMetrics {
  renderTime: number;
  queryTime: number;
  cacheHitRate: number;
  memoryUsage: number;
}

export const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    queryTime: 0,
    cacheHitRate: 0,
    memoryUsage: 0
  });

  useEffect(() => {
    // Monitor performance metrics
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'measure') {
          setMetrics(prev => ({
            ...prev,
            renderTime: entry.duration
          }));
        }
      });
    });

    observer.observe({ entryTypes: ['measure'] });

    // Monitor memory usage (if available)
    if ('memory' in performance) {
      const updateMemory = () => {
        const memory = (performance as any).memory;
        setMetrics(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
        }));
      };

      const interval = setInterval(updateMemory, 5000);
      return () => {
        clearInterval(interval);
        observer.disconnect();
      };
    }

    return () => observer.disconnect();
  }, []);

  const getPerformanceColor = (value: number, type: 'time' | 'memory' | 'cache') => {
    switch (type) {
      case 'time':
        return value < 100 ? 'bg-green-100 text-green-800' : 
               value < 500 ? 'bg-yellow-100 text-yellow-800' : 
               'bg-red-100 text-red-800';
      case 'memory':
        return value < 50 ? 'bg-green-100 text-green-800' : 
               value < 100 ? 'bg-yellow-100 text-yellow-800' : 
               'bg-red-100 text-red-800';
      case 'cache':
        return value > 80 ? 'bg-green-100 text-green-800' : 
               value > 60 ? 'bg-yellow-100 text-yellow-800' : 
               'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (process.env.NODE_ENV === 'production') return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-white/95 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Performance Monitor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Render Time:</span>
          <Badge className={getPerformanceColor(metrics.renderTime, 'time')}>
            {metrics.renderTime.toFixed(2)}ms
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Memory Usage:</span>
          <Badge className={getPerformanceColor(metrics.memoryUsage, 'memory')}>
            {metrics.memoryUsage.toFixed(1)}MB
          </Badge>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">Cache Hit Rate:</span>
          <Badge className={getPerformanceColor(metrics.cacheHitRate, 'cache')}>
            {metrics.cacheHitRate.toFixed(1)}%
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
