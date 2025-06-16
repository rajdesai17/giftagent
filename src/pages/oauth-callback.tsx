import { useEffect, useState } from 'react';

export default function OAuthCallback() {
  const [status, setStatus] = useState('Processing...');
  const [details, setDetails] = useState('');

  useEffect(() => {
    // This page only handles full-page redirects.
    // The popup flow is handled by the listener on the Dashboard.
    const handleRedirectCallback = async () => {
      try {
        setDetails('Checking for authorization code in URL...');
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const error = urlParams.get('error');

        if (error) {
          throw new Error(`OAuth error: ${error}`);
        }

        if (code) {
          setDetails('Code found, exchanging for token...');
          const response = await fetch('/api/oauth/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          if (!response.ok) {
            throw new Error(`Token exchange failed: ${response.statusText}`);
          }

          const { accessToken, expiresIn } = await response.json();
          if (!accessToken) {
            throw new Error('No access token in response.');
          }
          
          setDetails('Token received, storing authentication...');
          localStorage.setItem('payman_token', JSON.stringify({ accessToken, expiresIn }));
          
          // Dispatch storage event so other tabs know about the login
          window.dispatchEvent(new StorageEvent('storage', { key: 'payman_token' }));

          setStatus('🎉 Payman account connected successfully!');
          setDetails('Redirecting to your dashboard...');
          
          setTimeout(() => {
            window.location.href = '/dashboard';
          }, 2000);

        } else {
          setStatus('OAuth Error');
          setDetails('No authorization code found in the URL. Please try again.');
        }
      } catch (err) {
        setStatus('OAuth Error');
        setDetails(err instanceof Error ? err.message : String(err));
      }
    };

    handleRedirectCallback();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">{status}</h2>
        <p className="text-gray-600">{details}</p>
      </div>
    </div>
  );
} 