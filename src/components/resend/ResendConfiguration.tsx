
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const ResendConfiguration = () => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('resendConfig');
    return saved ? JSON.parse(saved) : {
      fromEmail: '',
      fromName: ''
    };
  });
  
  const [isConnected, setIsConnected] = useState(() => {
    const saved = localStorage.getItem('resendConnected');
    return saved === 'true';
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    if (!config.fromEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide a from email address.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('resendConfig', JSON.stringify(config));
    localStorage.setItem('resendConnected', 'true');
    setIsConnected(true);
    
    toast({
      title: "Email Configuration Saved",
      description: "Your Resend email settings have been saved successfully.",
    });
  };

  const handleDisconnect = () => {
    localStorage.removeItem('resendConfig');
    localStorage.removeItem('resendConnected');
    setIsConnected(false);
    setConfig({
      fromEmail: '',
      fromName: ''
    });
    
    toast({
      title: "Email Disconnected",
      description: "Email configuration has been removed.",
    });
  };

  if (isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Resend Email Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-green-900">Email Configuration Active</p>
              <p className="text-sm text-green-700">Emails will be sent from: {config.fromEmail}</p>
              {config.fromName && (
                <p className="text-xs text-green-600">From name: {config.fromName}</p>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDisconnect} className="flex-1">
              Disconnect Resend
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Resend Email Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Resend Setup Instructions:</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>Make sure you have a Resend account and API key configured</li>
            <li>Verify your sending domain in your Resend dashboard</li>
            <li>Use an email address from your verified domain</li>
          </ul>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fromEmail">From Email *</Label>
          <Input
            id="fromEmail"
            type="email"
            placeholder="noreply@yourdomain.com"
            value={config.fromEmail}
            onChange={(e) => setConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="fromName">From Name (Optional)</Label>
          <Input
            id="fromName"
            placeholder="Your Company Name"
            value={config.fromName}
            onChange={(e) => setConfig(prev => ({ ...prev, fromName: e.target.value }))}
          />
        </div>

        <Button onClick={handleSave} className="w-full">
          Save Email Configuration
        </Button>
      </CardContent>
    </Card>
  );
};
