
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

export const ThankYouPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <Card className="max-w-md w-full">
        <CardContent className="p-8 text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Thank You!
            </h1>
            <p className="text-gray-600">
              We appreciate your application and will review it shortly. 
              Our team will get back to you soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
