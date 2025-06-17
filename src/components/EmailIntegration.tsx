import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle, XCircle, Settings, RefreshCw } from 'lucide-react';

interface GmailConnection {
  email: string;
  isConnected: boolean;
  lastSync: string;
  accessToken?: string;
}

export const EmailIntegration = () => {
  const [gmailConnection, setGmailConnection] = useState<GmailConnection | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadGmailConnection();
    // Load existing credentials if they exist
    const existingCredentials = localStorage.getItem('gmailOAuthCredentials');
    if (existingCredentials) {
      console.log('Found existing credentials in localStorage');
      const { clientId: savedClientId } = JSON.parse(existingCredentials);
      setClientId(savedClientId);
    }
  }, []);

  const loadGmailConnection = () => {
    const saved = localStorage.getItem('gmailConnection');
    if (saved) {
      setGmailConnection(JSON.parse(saved));
    }
  };

  const initiateGmailAuth = async () => {
    if (!clientId || !clientSecret) {
      toast({
        title: "Missing Configuration",
        description: "Please enter your Gmail OAuth Client ID and Secret first.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting Gmail auth with clientId:', clientId.substring(0, 10) + '...');
    setIsConnecting(true);

    // Store credentials securely (in production, this should be handled server-side)
    const credentials = { clientId, clientSecret };
    localStorage.setItem('gmailOAuthCredentials', JSON.stringify(credentials));
    console.log('Stored credentials to localStorage');

    // Clear any previous auth results
    localStorage.removeItem('gmailAuthResult');

    // Use exact redirect URI - check current environment
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const redirectUri = isLocalhost 
      ? 'http://localhost:8080/auth/gmail/callback'
      : 'https://preview--talent-flow-factory.lovable.app/auth/gmail/callback';
    
    console.log('Using redirect URI:', redirectUri);
    
    const scope = 'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email';
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(clientId)}&` +
      `redirect_uri=${encodeURIComponent(redirectUri)}&` +
      `scope=${encodeURIComponent(scope)}&` +
      `response_type=code&` +
      `access_type=offline&` +
      `prompt=consent`;

    console.log('Full auth URL:', authUrl);

    // Open OAuth popup
    const popup = window.open(authUrl, 'gmail-auth', 'width=600,height=600');
    
    // Listen for the callback with longer polling interval
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        
        // Give more time for the callback to complete
        setTimeout(() => {
          setIsConnecting(false);
          // Check if auth was successful
          const authResult = localStorage.getItem('gmailAuthResult');
          console.log('Checking auth result after popup closed:', authResult ? 'Found' : 'Not found');
          
          if (authResult) {
            const result = JSON.parse(authResult);
            if (result.success) {
              setGmailConnection({
                email: result.email,
                isConnected: true,
                lastSync: new Date().toISOString(),
                accessToken: result.accessToken
              });
              localStorage.setItem('gmailConnection', JSON.stringify({
                email: result.email,
                isConnected: true,
                lastSync: new Date().toISOString(),
                accessToken: result.accessToken
              }));
              toast({
                title: "Gmail Connected",
                description: `Successfully connected ${result.email}`,
              });
            } else {
              console.error('Auth failed:', result.error);
              toast({
                title: "Authentication Failed",
                description: result.error || "Unknown error occurred",
                variant: "destructive",
              });
            }
            localStorage.removeItem('gmailAuthResult');
          } else {
            console.log('No auth result found in localStorage after extended wait');
            toast({
              title: "Authentication Incomplete",
              description: "The authentication window was closed before completion. Please try again.",
              variant: "destructive",
            });
          }
        }, 2000); // Wait 2 seconds after popup closes
      }
    }, 1000);

    // 10 minute timeout
    setTimeout(() => {
      if (!popup?.closed) {
        popup?.close();
        clearInterval(checkClosed);
        setIsConnecting(false);
        toast({
          title: "Authentication Timeout",
          description: "Authentication took too long. Please try again.",
          variant: "destructive",
        });
      }
    }, 600000);
  };

  const disconnectGmail = () => {
    setGmailConnection(null);
    localStorage.removeItem('gmailConnection');
    localStorage.removeItem('gmailOAuthCredentials');
    toast({
      title: "Gmail Disconnected",
      description: "Gmail account has been disconnected.",
    });
  };

  const testConnection = async () => {
    if (!gmailConnection?.accessToken) {
      toast({
        title: "No Connection",
        description: "Please connect your Gmail account first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Test the connection by making a simple API call
      const response = await fetch('https://www.googleapis.com/gmail/v1/users/me/profile', {
        headers: {
          'Authorization': `Bearer ${gmailConnection.accessToken}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Connection Active",
          description: "Gmail connection is working properly.",
        });
      } else {
        throw new Error('Connection test failed');
      }
    } catch (error) {
      toast({
        title: "Connection Issue",
        description: "Gmail connection may need to be refreshed.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Gmail Integration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {!gmailConnection?.isConnected ? (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Setup Instructions:</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Go to the <a href="https://console.cloud.google.com/" target="_blank" rel="noopener noreferrer" className="underline">Google Cloud Console</a></li>
                  <li>Create a new project or select an existing one</li>
                  <li>Enable the Gmail API</li>
                  <li>Create OAuth 2.0 credentials (Web application)</li>
                  <li>Add these exact redirect URIs:</li>
                  <li className="ml-4">• <code>http://localhost:8080/auth/gmail/callback</code></li>
                  <li className="ml-4">• <code>https://preview--talent-flow-factory.lovable.app/auth/gmail/callback</code></li>
                </ol>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="client-id">Gmail OAuth Client ID</Label>
                  <Input
                    id="client-id"
                    type="password"
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value)}
                    placeholder="Your Google Cloud OAuth Client ID"
                  />
                </div>
                <div>
                  <Label htmlFor="client-secret">Gmail OAuth Client Secret</Label>
                  <Input
                    id="client-secret"
                    type="password"
                    value={clientSecret}
                    onChange={(e) => setClientSecret(e.target.value)}
                    placeholder="Your Google Cloud OAuth Client Secret"
                  />
                </div>
              </div>

              <Button 
                onClick={initiateGmailAuth} 
                disabled={isConnecting || !clientId || !clientSecret}
                className="w-full"
              >
                {isConnecting ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Connecting to Gmail...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Connect Gmail Account
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Gmail Connected</p>
                    <p className="text-sm text-green-700">{gmailConnection.email}</p>
                    <p className="text-xs text-green-600">
                      Last synced: {new Date(gmailConnection.lastSync).toLocaleString()}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-600">
                  Active
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={testConnection} className="flex-1">
                  <Settings className="w-4 h-4 mr-2" />
                  Test Connection
                </Button>
                <Button variant="outline" onClick={disconnectGmail} className="flex-1">
                  <XCircle className="w-4 h-4 mr-2" />
                  Disconnect
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Email Sending Status</CardTitle>
        </CardHeader>
        <CardContent>
          {gmailConnection?.isConnected ? (
            <div className="text-center py-4">
              <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Ready to Send</h3>
              <p className="text-gray-600">
                Emails will be sent from {gmailConnection.email}
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">Gmail Not Connected</h3>
              <p className="text-gray-600">
                Connect your Gmail account to start sending emails
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
