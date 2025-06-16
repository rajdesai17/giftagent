import { useEffect } from 'react';

export default function OAuthCallback() {
  useEffect(() => {
    // This page is opened in a popup by the Payman OAuth flow.
    // Its sole job is to send its full URL (containing the auth code)
    // to the main window that opened it, and then close itself.
    
    const broadcastAndClose = () => {
      // Ensure there's an opener window
      if (window.opener) {
        console.log('OAuth Popup: Sending redirect URI to opener window.');
        window.opener.postMessage({
          type: 'payman-oauth-redirect',
          redirectUri: window.location.href,
        }, window.location.origin); // Post to the same origin
      } else {
        console.error('OAuth Popup: No opener window found. This page should be opened as a popup.');
      }

      // Close the popup window
      // Note: This might not work in all browsers if the window was not opened by a script.
      window.close();
    };

    broadcastAndClose();

  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md">
        <h2 className="text-2xl font-bold mb-4">Processing authentication...</h2>
        <p className="text-gray-600">Please wait. This window should close automatically.</p>
      </div>
    </div>
  );
} 