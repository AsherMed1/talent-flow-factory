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

    // Listen for messages from popup window
    const handleMessage = (event: MessageEvent) => {
      // Only accept messages from our popup
      if (event.origin !== window.location.origin) return;
      
      console.log('Parent window received message:', event.data);
      
      if (event.data.type === 'GMAIL_AUTH_RESULT') {
        console.log('Received auth result from popup:', event.data);
        setIsConnecting(false);
        
        if (event.data.success) {
          const newConnection = {
            email: event.data.email,
            isConnected: true,
            lastSync: new Date().toISOString(),
            accessToken: event.data.accessToken
          };
          setGmailConnection(newConnection);
          localStorage.setItem('gmailConnection', JSON.stringify(newConnection));
          toast({
            title: "Gmail Connected",
            description: `Successfully connected ${event.data.email}`,
          });
        } else {
          console.error('Auth failed:', event.data.error);
          toast({
            title: "Authentication Failed",
            description: event.data.error || "Unknown error occurred",
            variant: "destructive",
          });
        }
      }
      
      if (event.data.type === 'GMAIL_AUTH_REQUEST_CREDENTIALS') {
        console.log('Popup requesting credentials, sending response...');
        // Send credentials to popup immediately
        const credentials = localStorage.getItem('gmailOAuthCredentials');
        if (credentials) {
          const response = {
            type: 'GMAIL_AUTH_CREDENTIALS_RESPONSE',
            credentials: JSON.parse(credentials)
          };
          console.log('Sending credentials to popup:', response);
          event.source?.postMessage(response, { targetOrigin: window.location.origin });
        } else {
          console.error('No credentials found in localStorage to send to popup');
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [toast]);

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
    
    // Handle popup close without completion
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        clearInterval(checkClosed);
        // Give some time for any final messages
        setTimeout(() => {
          if (isConnecting) {
            setIsConnecting(false);
            toast({
              title: "Authentication Cancelled",
              description: "The authentication window was closed before completion.",
              variant: "destructive",
            });
          }
        }, 1000);
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
