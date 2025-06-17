
import { useEffect, useState } from 'react';

const GmailCallbackPage = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing Gmail authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const authCode = urlParams.get('code');
        const error = urlParams.get('error');

        console.log('Callback page loaded with URL:', window.location.href);
        console.log('Auth code received:', authCode ? 'Yes' : 'No');
        console.log('Error received:', error);

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (!authCode) {
          throw new Error('No authorization code received');
        }

        console.log('Processing auth code:', authCode.substring(0, 20) + '...');

        // Try to get credentials from localStorage first (fallback)
        let credentials = null;
        const localCredentials = localStorage.getItem('gmailOAuthCredentials');
        if (localCredentials) {
          console.log('Found credentials in localStorage as fallback');
          credentials = JSON.parse(localCredentials);
        } else {
          console.log('No credentials in localStorage, requesting from parent...');
          
          // Request credentials from parent window with longer timeout
          credentials = await new Promise<any>((resolve, reject) => {
            const handleMessage = (event: MessageEvent) => {
              console.log('Received message in popup:', event.data);
              if (event.origin !== window.location.origin) return;
              
              if (event.data.type === 'GMAIL_AUTH_CREDENTIALS_RESPONSE') {
                window.removeEventListener('message', handleMessage);
                console.log('Received credentials response from parent');
                resolve(event.data.credentials);
              }
            };
            
            window.addEventListener('message', handleMessage);
            
            // Request credentials from parent
            if (window.opener) {
              console.log('Requesting credentials from parent window');
              window.opener.postMessage({
                type: 'GMAIL_AUTH_REQUEST_CREDENTIALS'
              }, window.location.origin);
            } else {
              console.error('No window.opener available');
              reject(new Error('No parent window available'));
              return;
            }
            
            // Longer timeout (10 seconds)
            setTimeout(() => {
              window.removeEventListener('message', handleMessage);
              console.error('Timeout waiting for credentials from parent');
              reject(new Error('Timeout waiting for credentials'));
            }, 10000);
          });
        }

        if (!credentials || !credentials.clientId || !credentials.clientSecret) {
          throw new Error('OAuth credentials not available');
        }

        const { clientId, clientSecret } = credentials;
        console.log('Using clientId:', clientId ? clientId.substring(0, 10) + '...' : 'undefined');

        // Determine redirect URI based on environment
        const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        const redirectUri = isLocalhost 
          ? 'http://localhost:8080/auth/gmail/callback'
          : 'https://preview--talent-flow-factory.lovable.app/auth/gmail/callback';

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

        console.log('Token response status:', tokenResponse.status);

        if (!tokenResponse.ok) {
          const errorData = await tokenResponse.json();
          console.error('Token exchange failed:', errorData);
          throw new Error(`Token exchange failed: ${errorData.error_description || errorData.error}`);
        }

        const tokenData = await tokenResponse.json();
        console.log('Token exchange successful, access token length:', tokenData.access_token?.length);

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

        // Send result to parent window
        const authResult = {
          type: 'GMAIL_AUTH_RESULT',
          success: true,
          email: userData.email,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
        };
        
        if (window.opener) {
          window.opener.postMessage(authResult, window.location.origin);
          console.log('Auth result sent to parent window');
        }

        setStatus('success');
        setMessage('Gmail connected successfully! Closing window...');

        // Close the popup window after a brief delay
        setTimeout(() => {
          console.log('Closing popup window');
          window.close();
        }, 2000);

      } catch (error: any) {
        console.error('Gmail callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed');

        // Send error to parent window
        if (window.opener) {
          window.opener.postMessage({
            type: 'GMAIL_AUTH_RESULT',
            success: false,
            error: error.message,
          }, window.location.origin);
        }

        setTimeout(() => {
          console.log('Closing popup window after error');
          window.close();
        }, 3000);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center p-8 bg-white rounded-lg shadow-md max-w-md">
        {status === 'processing' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Processing Authentication</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold text-green-700 mb-2">Success!</h2>
            <p className="text-gray-600">{message}</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="text-red-500 text-5xl mb-4">✗</div>
            <h2 className="text-xl font-semibold text-red-700 mb-2">Authentication Failed</h2>
            <p className="text-gray-600">{message}</p>
            <button 
              onClick={() => window.close()}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Close Window
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default GmailCallbackPage;
