import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, MessageCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import DashboardNav from '../components/Dashboard/DashboardNav';
import PaymanConnect from '../components/Dashboard/PaymanConnect';
import ContactCard from '../components/Dashboard/ContactCard';
import ChatInterface from '../components/Chat/ChatInterface';
import AddContactModal from '../components/Dashboard/AddContactModal';
import { Contact, Gift } from '../types';
import Card from '../components/ui/Card';
import { supabase } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const { user, paymanAccessToken, setPaymanToken } = useAuth();
  const [contacts, setContacts] = useState<(Contact & { gift?: Gift })[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);

  useEffect(() => {
    const handlePaymanMessage = async (event: MessageEvent) => {
      if (event.data.type === 'payman-oauth-redirect') {
        const url = new URL(event.data.redirectUri);
        const code = url.searchParams.get('code');

        if (code) {
          try {
            const response = await fetch('/api/oauth/token', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code }),
            });

            if (!response.ok) {
              throw new Error('Token exchange failed');
            }

            const { accessToken } = await response.json();
            setPaymanToken(accessToken); // Set token in context
            
          } catch (error) {
            console.error('Payman OAuth Error:', error);
          }
        }
      }
    };
    window.addEventListener('message', handlePaymanMessage);
    return () => {
      window.removeEventListener('message', handlePaymanMessage);
    };
  }, [setPaymanToken]);

  const loadContacts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (data) {
      setContacts(data);
    }
  };

  useEffect(() => {
    if (user) {
      loadContacts();
    }
  }, [user]);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSendGift = async (message: string) => {
    // This function can be expanded or used for other gift-sending logic
    console.log('Processing gift request:', message);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <DashboardNav />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Contacts</h1>
                <p className="text-gray-600">Manage birthdays and schedule gifts for your friends</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="primary"
                  icon={MessageCircle}
                  onClick={() => setShowChat(true)}
                >
                  Chat with Agent
                </Button>
                <Button 
                  variant="secondary" 
                  icon={Plus}
                  onClick={() => setShowAddContact(true)}
                >
                  Add Contact
                </Button>
              </div>
            </div>

            {/* Payman Connection */}
            {paymanAccessToken ? (
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">
                      Payman Connected
                    </p>
                    <p className="text-xs text-green-600">
                      You can now send gifts via the chat agent.
                    </p>
                  </div>
                </div>
              </Card>
            ) : (
              <PaymanConnect />
            )}

            {/* Contacts Grid */}
            {contacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts.map((contact) => (
                  <ContactCard
                    key={contact.id}
                    contact={contact}
                    onClick={() => console.log('Contact clicked:', contact.name)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No contacts yet</p>
                <Button 
                  variant="primary" 
                  icon={Plus}
                  onClick={() => setShowAddContact(true)}
                >
                  Add Your First Contact
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        onSendGift={handleSendGift}
      />

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={showAddContact}
        onClose={() => setShowAddContact(false)}
        onSuccess={loadContacts}
      />
    </div>
  );
};

export default Dashboard;