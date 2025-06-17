
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const GmailCallbackPage = () => {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing Gmail authentication...');
  const navigate = useNavigate();

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

        // Get stored credentials - try multiple times if not immediately available
        let credentialsStr = null;
        let attempts = 0;
        const maxAttempts = 10;
        
        while (!credentialsStr && attempts < maxAttempts) {
          credentialsStr = localStorage.getItem('gmailOAuthCredentials');
          if (!credentialsStr) {
            console.log(`Attempt ${attempts + 1}: Credentials not found, waiting...`);
            await new Promise(resolve => setTimeout(resolve, 500));
            attempts++;
          }
        }
        
        console.log('Credentials found in localStorage after', attempts, 'attempts:', credentialsStr ? 'Yes' : 'No');
        
        if (!credentialsStr) {
          console.error('No credentials found in localStorage after', maxAttempts, 'attempts. Available keys:', Object.keys(localStorage));
          throw new Error('OAuth credentials not found in localStorage');
        }

        const { clientId, clientSecret } = JSON.parse(credentialsStr);
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

        // Store the result for the main window with retry logic
        const authResult = {
          success: true,
          email: userData.email,
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
        };
        
        // Try storing multiple times to ensure it persists
        for (let i = 0; i < 3; i++) {
          localStorage.setItem('gmailAuthResult', JSON.stringify(authResult));
          console.log(`Auth result stored to localStorage (attempt ${i + 1})`);
          
          // Verify it was stored
          const stored = localStorage.getItem('gmailAuthResult');
          if (stored) {
            console.log('Auth result verified in localStorage');
            break;
          } else {
            console.warn('Auth result not found after storing, retrying...');
            await new Promise(resolve => setTimeout(resolve, 200));
          }
        }

        setStatus('success');
        setMessage('Gmail connected successfully! Closing window...');

        // Close the popup window after a longer delay to ensure localStorage is persisted
        setTimeout(() => {
          console.log('Closing popup window');
          window.close();
        }, 3000);

      } catch (error: any) {
        console.error('Gmail callback error:', error);
        setStatus('error');
        setMessage(error.message || 'Authentication failed');

        // Store error result with retry logic
        for (let i = 0; i < 3; i++) {
          localStorage.setItem('gmailAuthResult', JSON.stringify({
            success: false,
            error: error.message,
          }));
          console.log(`Error result stored to localStorage (attempt ${i + 1})`);
          
          // Verify it was stored
          const stored = localStorage.getItem('gmailAuthResult');
          if (stored) break;
          await new Promise(resolve => setTimeout(resolve, 200));
        }

        setTimeout(() => {
          console.log('Closing popup window after error');
          window.close();
        }, 5000);
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
