
import { Card, CardContent } from '@/components/ui/card';
import { Mail } from 'lucide-react';

interface EmailConfigurationWarningProps {
  isConnected: boolean;
}

export const EmailConfigurationWarning = ({ isConnected }: EmailConfigurationWarningProps) => {
  if (isConnected) return null;

  return (
    <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Mail className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-red-900">Email Configuration Required</h3>
            <p className="text-red-700">
              Application emails will be sent automatically after import. Please configure your email settings first.
            </p>
            <p className="text-sm text-red-600 mt-1">
              Go to Settings &gt; Email Integration to set up your email provider
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
