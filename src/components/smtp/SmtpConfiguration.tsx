
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export const SmtpConfiguration = () => {
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('smtpConfig');
    return saved ? JSON.parse(saved) : {
      host: '',
      port: '',
      username: 'Hiring@patientpro.com',
      password: '',
      fromEmail: 'Hiring@patientpro.com',
      fromName: 'PatientPro Hiring Team'
    };
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isConnected, setIsConnected] = useState(() => {
    const saved = localStorage.getItem('smtpConnected');
    return saved === 'true';
  });
  
  const { toast } = useToast();

  const handleSave = () => {
    if (!config.host || !config.port || !config.username || !config.password || !config.fromEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    localStorage.setItem('smtpConfig', JSON.stringify(config));
    localStorage.setItem('smtpConnected', 'true');
    setIsConnected(true);
    
    toast({
      title: "SMTP Configuration Saved",
      description: "Your email settings have been saved successfully.",
    });
  };

  const handleDisconnect = () => {
    localStorage.removeItem('smtpConfig');
    localStorage.removeItem('smtpConnected');
    setIsConnected(false);
    setConfig({
      host: '',
      port: '',
      username: 'Hiring@patientpro.com',
      password: '',
      fromEmail: 'Hiring@patientpro.com',
      fromName: 'PatientPro Hiring Team'
    });
    
    toast({
      title: "SMTP Disconnected",
      description: "Email configuration has been removed.",
    });
  };

  if (isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            SMTP Email Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div>
              <p className="font-medium text-green-900">Email Configuration Active</p>
              <p className="text-sm text-green-700">Emails will be sent from: {config.fromEmail}</p>
              <p className="text-xs text-green-600">SMTP Host: {config.host}</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDisconnect} className="flex-1">
              Disconnect SMTP
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
          SMTP Email Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">SMTP Setup Instructions:</h4>
          <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
            <li>For Gmail: Use smtp.gmail.com, port 587, and create an App Password</li>
            <li>For Outlook: Use smtp-mail.outlook.com, port 587</li>
            <li>For other providers: Check their SMTP documentation</li>
            <li>Make sure to use the PatientPro hiring email address</li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="host">SMTP Host *</Label>
            <Input
              id="host"
              placeholder="smtp.gmail.com"
              value={config.host}
              onChange={(e) => setConfig(prev => ({ ...prev, host: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="port">Port *</Label>
            <Input
              id="port"
              placeholder="587"
              value={config.port}
              onChange={(e) => setConfig(prev => ({ ...prev, port: e.target.value }))}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username/Email *</Label>
          <Input
            id="username"
            type="email"
            placeholder="Hiring@patientpro.com"
            value={config.username}
            onChange={(e) => setConfig(prev => ({ ...prev, username: e.target.value }))}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password/App Password *</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Your app password"
              value={config.password}
              onChange={(e) => setConfig(prev => ({ ...prev, password: e.target.value }))}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fromEmail">From Email *</Label>
            <Input
              id="fromEmail"
              type="email"
              placeholder="Hiring@patientpro.com"
              value={config.fromEmail}
              onChange={(e) => setConfig(prev => ({ ...prev, fromEmail: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="fromName">From Name</Label>
            <Input
              id="fromName"
              placeholder="PatientPro Hiring Team"
              value={config.fromName}
              onChange={(e) => setConfig(prev => ({ ...prev, fromName: e.target.value }))}
            />
          </div>
        </div>

        <Button onClick={handleSave} className="w-full">
          Save SMTP Configuration
        </Button>
      </CardContent>
    </Card>
  );
};
