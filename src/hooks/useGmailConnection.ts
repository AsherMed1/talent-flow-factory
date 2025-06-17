
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

interface GmailConnection {
  email: string;
  isConnected: boolean;
  lastSync: string;
  accessToken?: string;
}

export const useGmailConnection = () => {
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
    
    // Listen for the callback with longer polling interval and extended wait time
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        
        // Give much more time for the callback to complete (up to 10 seconds)
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
        }, 10000); // Wait 10 seconds after popup closes
      }
    }, 1000); // Check every second

    // 15 minute timeout
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
    }, 900000);
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

  return {
    gmailConnection,
    isConnecting,
    clientId,
    clientSecret,
    setClientId,
    setClientSecret,
    initiateGmailAuth,
    disconnectGmail,
    testConnection,
  };
};
