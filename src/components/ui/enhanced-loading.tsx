
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface EnhancedLoadingProps {
  message?: string;
  showSpinner?: boolean;
  className?: string;
}

export const EnhancedLoading = ({ 
  message = "Loading...", 
  showSpinner = true,
  className = ""
}: EnhancedLoadingProps) => {
  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-center">
        {showSpinner && (
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
        )}
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export const EnhancedLoadingCard = ({ 
  message = "Loading...", 
  showSpinner = true 
}: EnhancedLoadingProps) => {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      </CardHeader>
      <CardContent>
        <EnhancedLoading message={message} showSpinner={showSpinner} />
      </CardContent>
    </Card>
  );
};

export const PageLoadingSkeleton = ({ title }: { title: string }) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <EnhancedLoadingCard key={index} />
        ))}
      </div>
    </div>
  );
};
