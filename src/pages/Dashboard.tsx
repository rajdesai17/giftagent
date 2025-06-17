import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertCircle, MessageCircle, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ContactCard from '../components/ContactCard';
import AddContactModal from '../components/AddContactModal';
import ChatAgent from '../components/ChatAgent';
import { isPaymanConnected } from '../lib/payman-client';

export default function Dashboard() {
  const { contacts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [paymanConnected, setPaymanConnected] = useState(isPaymanConnected());
  const [error, setError] = useState<string | null>(null);

  // Listen for OAuth redirect message and exchange code for token
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'payman-oauth-redirect' && event.data.redirectUri) {
        try {
          const url = new URL(event.data.redirectUri);
          const code = url.searchParams.get('code');
          const error = url.searchParams.get('error');
          if (error) {
            setError('OAuth error: ' + error);
            return;
          }
          if (code) {
            exchangeCodeForToken(code);
          } else {
            setError('No authorization code found in redirect URI.');
          }
        } catch (e) {
          setError('Failed to parse redirect URI.');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Check Payman connection status
  useEffect(() => {
    const checkConnection = () => setPaymanConnected(isPaymanConnected());
    checkConnection();
    const interval = setInterval(checkConnection, 2000);
    window.addEventListener('storage', checkConnection);
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkConnection);
    };
  }, []);

  // Inject Payman Connect script if not connected
  useEffect(() => {
    if (paymanConnected) {
      const container = document.getElementById('payman-connect');
      if (container) container.innerHTML = '';
      return;
    }
    const clientId = import.meta.env.VITE_PAYMAN_CLIENT_ID;
    if (!clientId) {
      setError('Configuration error: Payman Client ID is missing.');
      return;
    }
    const scriptId = 'payman-connect-script';
    if (document.getElementById(scriptId)) return;
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://app.paymanai.com/js/pm-connect.js';
    script.setAttribute('data-client-id', clientId);
    script.setAttribute('data-scopes', 'read_balance read_list_wallets read_list_payees read_list_transactions write_create_payee write_send_payment write_create_wallet');
    script.setAttribute('data-redirect-uri', `${window.location.origin}/oauth-callback`);
    script.setAttribute('data-target', '#payman-connect');
    script.setAttribute('data-dark-mode', 'false');
    script.setAttribute('data-styles', '{"borderRadius": "8px", "fontSize": "14px"}');
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, [paymanConnected]);

  // Exchange code for token via backend
  const exchangeCodeForToken = async (code: string) => {
    setError(null);
    try {
      const response = await fetch('/api/oauth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        setError('Token exchange failed: ' + errorText);
        return;
      }
      const { accessToken, expiresIn } = await response.json();
      if (!accessToken) {
        setError('No access token in response.');
        return;
      }
      localStorage.setItem('payman_token', JSON.stringify({ accessToken, expiresIn }));
      setPaymanConnected(true);
    } catch (e) {
      setError('Failed to exchange code for token.');
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900">Your Contacts</h1>
          <p className="text-gray-600 mt-2">Manage birthdays and schedule gifts for your friends</p>
          <div className="mt-4 space-y-3">
            {!paymanConnected ? (
              <div className="space-y-2">
                <div id="payman-connect"></div>
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
            className={`flex items-center space-x-2 px-6 py-3 rounded-full font-medium transition-all duration-200 ${showChat ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' : 'bg-gray-900 text-white hover:bg-gray-800'}`}
          >
            <MessageCircle className="h-4 w-4" />
            <span>{showChat ? 'Hide Chat' : 'Chat with Agent'}</span>
            {paymanConnected && !showChat && <div className="w-2 h-2 bg-green-400 rounded-full"></div>}
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
            <h3 className="text-xl font-medium text-gray-900 mb-3">No contacts yet</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">Add your first friend to start scheduling birthday gifts or chat with the agent to send gifts instantly</p>
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setIsModalOpen(true)}
                className="bg-gray-900 text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all duration-200"
              >Add Your First Contact</button>
              <button
                onClick={() => setShowChat(true)}
                className="bg-gray-100 text-gray-900 px-6 py-3 rounded-full font-medium hover:bg-gray-200 transition-all duration-200"
              >Try Chat Agent</button>
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
      <AddContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}