
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface EmailConfigurationWarningProps {
  isConnected: boolean;
}

export const EmailConfigurationWarning = ({ isConnected }: EmailConfigurationWarningProps) => {
  const navigate = useNavigate();

  if (isConnected) return null;

  const handleNavigateToSettings = () => {
    navigate('/settings');
  };

  return (
    <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-100 rounded-full flex-shrink-0">
            <Mail className="w-6 h-6 text-red-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-red-900 mb-2">Email Configuration Required</h3>
            <p className="text-red-700 mb-3">
              Application emails will be sent automatically after import. Please configure your email settings first.
            </p>
            <Button 
              onClick={handleNavigateToSettings}
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
            >
              <Settings className="w-4 h-4 mr-2" />
              Go to Email Settings
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
