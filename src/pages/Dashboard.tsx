import React, { useEffect, useState } from 'react';
import { Plus, MessageCircle, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ContactCard from '../components/ContactCard';
import AddContactModal from '../components/AddContactModal';
import ChatAgent from '../components/ChatAgent';
import { isPaymanConnected } from '../lib/payman-client';

export default function Dashboard() {
  const { contacts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [paymanConnected, setPaymanConnected] = useState(false);

  // Connection and message handling
  useEffect(() => {
    // 1. Check connection status periodically
    const checkConnection = () => setPaymanConnected(isPaymanConnected());
    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    window.addEventListener('storage', checkConnection);

    // 2. Listen for OAuth message from popup (as per Payman docs)
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === "payman-oauth-redirect" && event.data.redirectUri) {
        console.log('Dashboard: Received OAuth message from popup', event.data);
        
        try {
          const url = new URL(event.data.redirectUri);
          const code = url.searchParams.get("code");
          const error = url.searchParams.get("error");
          
          console.log('Dashboard: Extracted from redirectUri:', { code: code?.substring(0, 20) + '...', error });
          
          if (error) {
            console.error('Dashboard: OAuth error received:', error);
            return;
          }
          
          if (code) {
            exchangeCodeForToken(code);
          } else {
            console.error('Dashboard: No authorization code found in redirectUri:', event.data.redirectUri);
          }
        } catch (urlError) {
          console.error('Dashboard: Failed to parse redirectUri:', urlError);
        }
      }
    };
    window.addEventListener("message", handleMessage);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkConnection);
      window.removeEventListener("message", handleMessage);
    };
  }, []);
  
  const exchangeCodeForToken = async (code: string) => {
    console.log('Dashboard: Exchanging code for token...', { codeLength: code.length, codePreview: code.substring(0, 20) + '...' });
    try {
      // Follow official docs pattern - only send code
      const requestBody = { code };
      console.log('Dashboard: Sending request to /api/oauth/token with:', requestBody);
      
      const response = await fetch('/api/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log('Dashboard: Response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Dashboard: Error response body:', errorText);
        throw new Error(`Token exchange failed with status: ${response.status} - ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Dashboard: Token exchange successful:', { hasAccessToken: !!responseData.accessToken, expiresIn: responseData.expiresIn });
      
      const { accessToken, expiresIn } = responseData;
      if (!accessToken) {
        throw new Error('No access token in response.');
      }

      console.log('Dashboard: Token received, storing in localStorage.');
      const tokenData = { accessToken, expiresIn };
      localStorage.setItem('payman_token', JSON.stringify(tokenData));
      
      // Manually trigger connection check to update UI immediately
      setPaymanConnected(true);
      console.log('Dashboard: OAuth flow completed successfully!');

    } catch (error) {
      console.error('Dashboard: Failed to exchange code for token.', error);
    }
  };

  // OAuth script injection
  useEffect(() => {
    if (paymanConnected) {
      // Cleanup script if user is connected
      const existingScript = document.querySelector('script[src="https://app.paymanai.com/js/pm.js"]');
      if (existingScript) existingScript.remove();
      const container = document.getElementById('payman-connect');
      if (container) container.innerHTML = '';
      return;
    }

    const existingScript = document.querySelector('script[src="https://app.paymanai.com/js/pm.js"]');
    if (existingScript) return;

    const clientId = import.meta.env.VITE_PAYMAN_CLIENT_ID;
    if (!clientId) {
      console.error('Missing VITE_PAYMAN_CLIENT_ID from .env file');
      // To provide better feedback to the user, you could render a message in the UI
      const container = document.getElementById('payman-connect');
      if (container) {
        container.innerHTML = '<p class="text-red-500">Configuration error: Payman Client ID is missing.</p>';
      }
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://app.paymanai.com/js/pm.js';
    script.setAttribute('data-client-id', clientId);
    script.setAttribute('data-scopes', 'read_balance,read_list_wallets,read_list_payees,read_list_transactions,write_create_payee,write_send_payment,write_create_wallet');
    // Use a dynamic redirect URI for portability between local, preview, and production
    script.setAttribute('data-redirect-uri', `${window.location.origin}/oauth-callback`);
    script.setAttribute('data-target', '#payman-connect');
    script.setAttribute('data-dark-mode', 'false');
    script.setAttribute('data-styles', '{"borderRadius": "8px", "fontSize": "14px"}');

    document.head.appendChild(script);

    // Add a cleanup function to remove the script when the component unmounts
    return () => {
        const scriptInHead = document.querySelector(`script[src="${script.src}"]`);
        if(scriptInHead) {
            document.head.removeChild(scriptInHead);
        }
    }
  }, [paymanConnected]);

  return (
    <div className="space-y-8">
      {/* Debug info - show token status */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
          <strong>Debug:</strong> Payman Connected: {paymanConnected ? '✅ Yes' : '❌ No'} | 
          Token in localStorage: {localStorage.getItem('payman_token') ? '✅ Yes' : '❌ No'}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900">Your Contacts</h1>
          <p className="text-gray-600 mt-2">
            Manage birthdays and schedule gifts for your friends
          </p>
          
          {/* Payman Connection Section */}
          <div className="mt-4 space-y-3">
            {!paymanConnected ? (
              <div className="space-y-2">
                {/* Simple div as per Payman docs */}
                <div id="payman-connect"></div>
                
                {/* Helper Text */}
                <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-1.5 rounded-full max-w-fit">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">Connect Payman to send real payments through the chat agent</span>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full max-w-fit">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Payman Connected</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${
              showChat
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                : 'bg-gray-900 text-white hover:bg-gray-800'
            }`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{showChat ? 'Hide Chat' : 'Chat with Agent'}</span>
            {paymanConnected && !showChat && (
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            )}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Contact</span>
          </button>
        </div>
      </div>

      {showChat && (
        <div className="mb-8">
          <ChatAgent />
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-gray-50 rounded-3xl p-12 max-w-md mx-auto">
            <div className="text-6xl mb-6">🎂</div>
            <h3 className="text-xl font-medium text-gray-900 mb-3">
              No contacts yet
            </h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Add your first friend to start scheduling birthday gifts or chat with the agent to send gifts instantly
            </p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-200"
              >
                Add Your First Contact
              </button>
              <button
                onClick={() => setShowChat(true)}
                className="bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-all duration-200"
              >
                Try Chat Agent
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {contacts.map(contact => (
            <ContactCard key={contact.id} contact={contact} />
          ))}
        </div>
      )}

      <AddContactModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}