
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

    // Check if we're returning from OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth error:', error);
      toast({
        title: "Authentication Failed",
        description: `OAuth error: ${error}`,
        variant: "destructive",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }

    if (authCode) {
      console.log('Processing OAuth callback with code:', authCode.substring(0, 20) + '...');
      handleOAuthCallback(authCode);
    }
  }, [toast]);

  const handleOAuthCallback = async (authCode: string) => {
    setIsConnecting(true);
    
    try {
      const credentials = localStorage.getItem('gmailOAuthCredentials');
      if (!credentials) {
        throw new Error('OAuth credentials not found');
      }

      const { clientId, clientSecret } = JSON.parse(credentials);
      
      // Determine redirect URI based on environment
      const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      const redirectUri = isLocalhost 
        ? 'http://localhost:8080/'
        : 'https://preview--talent-flow-factory.lovable.app/';

      console.log('Exchange token with redirect URI:', redirectUri);

      // Exchange authorization code for access token
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code: authCode,
          grant_type: 'authorization_code',
          redirect_uri: redirectUri,
        }),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        console.error('Token exchange failed:', errorData);
        throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error}`);
      }

      const tokenData = await tokenResponse.json();
      console.log('Token exchange successful');

      // Get user email
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          'Authorization': `Bearer ${tokenData.access_token}`,
        },
      });

      if (!userResponse.ok) {
        throw new Error('Failed to get user information');
      }

      const userData = await userResponse.json();
      console.log('User data retrieved:', userData.email);

      const newConnection = {
        email: userData.email,
        isConnected: true,
        lastSync: new Date().toISOString(),
        accessToken: tokenData.access_token
      };
      
      setGmailConnection(newConnection);
      localStorage.setItem('gmailConnection', JSON.stringify(newConnection));
      
      toast({
        title: "Gmail Connected",
        description: `Successfully connected ${userData.email}`,
      });

      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);

    } catch (error: any) {
      console.error('OAuth callback error:', error);
      toast({
        title: "Authentication Failed",
        description: error.message || "Unknown error occurred",
        variant: "destructive",
      });
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } finally {
      setIsConnecting(false);
    }
  };

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

    // Use main window redirect instead of popup
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const redirectUri = isLocalhost 
      ? 'http://localhost:8080/'
      : 'https://preview--talent-flow-factory.lovable.app/';
    
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

    // Redirect to OAuth URL in the same window
    window.location.href = authUrl;
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
