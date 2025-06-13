import React, { useEffect, useState } from 'react';
import { PaymanClient } from '@paymanai/payman-ts';

export default function OAuthCallback() {
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const clientId = import.meta.env.VITE_PAYMAN_CLIENT_ID;

    if (!code) {
      setStatus('No code found in URL.');
      return;
    }

    async function exchangeCode() {
      try {
        const payman = PaymanClient.withAuthCode({ clientId }, code);
        // Optionally, you can call a test endpoint to verify the token
        // Save the token/client for later use (e.g., in localStorage or context)
        localStorage.setItem('payman_oauth_code', code);
        setStatus('Payman account connected! You can now send real payments.');
      } catch (err) {
        setStatus('Failed to connect Payman: ' + (err.message || err.toString()));
      }
    }
    exchangeCode();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow text-center">
        <h2 className="text-2xl font-bold mb-4">Payman OAuth</h2>
        <p>{status}</p>
      </div>
    </div>
  );
} 