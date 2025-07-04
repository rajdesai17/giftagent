import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Plus, MessageCircle, CheckCircle, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import DashboardNav from '../components/Dashboard/DashboardNav';
import PaymanConnect from '../components/Dashboard/PaymanConnect';
import ContactCard from '../components/Dashboard/ContactCard';
import ChatInterface from '../components/Chat/ChatInterface';
import AddContactModal from '../components/Dashboard/AddContactModal';
import DeleteContactModal from '../components/Dashboard/DeleteContactModal';
import { Contact, Gift } from '../types';
import Card from '../components/ui/Card';
import { supabase } from '../lib/supabase';

const Dashboard: React.FC = () => {
  const { user, paymanAccessToken, setPaymanToken } = useAuth();
  const [contacts, setContacts] = useState<(Contact & { gift?: Gift })[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showDeleteContact, setShowDeleteContact] = useState(false);
  const [contactToEdit, setContactToEdit] = useState<(Contact & { gift?: Gift }) | undefined>(undefined);
  const [contactToDelete, setContactToDelete] = useState<(Contact & { gift?: Gift }) | null>(null);

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
      // Transform flat gift fields into nested gift object
      const transformedContacts = data.map(contact => {
        const transformedContact: Contact & { gift?: Gift & { delivery_date: string } } = {
          ...contact,
        };

        // If contact has gift data, create nested gift object
        if (contact.gift_id && contact.gift_name) {
          transformedContact.gift = {
            id: contact.gift_id,
            name: contact.gift_name,
            price: contact.gift_price,
            image: contact.gift_image,
            description: '',
            category: contact.gift_category,
            delivery_date: contact.birthday // Use birthday as delivery date for scheduled gifts
          };
        }

        return transformedContact;
      });
      
      setContacts(transformedContacts);
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

  const handleEditContact = (contact: Contact & { gift?: Gift }) => {
    setContactToEdit(contact);
    setShowAddContact(true);
  };

  const handleDeleteContact = (contact: Contact & { gift?: Gift }) => {
    setContactToDelete(contact);
    setShowDeleteContact(true);
  };

  const confirmDeleteContact = async () => {
    if (!contactToDelete || !user) return;

    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', contactToDelete.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error deleting contact:', error);
      throw error;
    }

    // Reload contacts after successful deletion
    await loadContacts();
    setContactToDelete(null);
  };

  const handleCloseAddModal = () => {
    setShowAddContact(false);
    setContactToEdit(undefined);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <DashboardNav onChatClick={() => setShowChat(true)} />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contact Dashboard</h1>
              <p className="text-gray-600">Never miss a birthday again. Let AI handle the surprises.</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <Button
                variant="primary"
                icon={MessageCircle}
                onClick={() => setShowChat(true)}
                className="w-full sm:w-auto"
              >
                Chat with GiftAgent
              </Button>
              <Button 
                variant="secondary" 
                icon={Plus}
                onClick={() => setShowAddContact(true)}
                className="w-full sm:w-auto"
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-200">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-gray-100 rounded-full">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-2">No Contacts Found</h3>
              <p className="text-gray-500 mb-6">Add a contact to get started with automated gifting.</p>
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

      {/* Chat Interface */}
      <ChatInterface
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        onSendGift={handleSendGift}
      />

      {/* Add Contact Modal */}
      <AddContactModal
        isOpen={showAddContact}
        onClose={handleCloseAddModal}
        onSuccess={loadContacts}
        contactToEdit={contactToEdit}
      />

      {/* Delete Contact Modal */}
      <DeleteContactModal
        isOpen={showDeleteContact}
        onClose={() => {
          setShowDeleteContact(false);
          setContactToDelete(null);
        }}
        onConfirm={confirmDeleteContact}
        contact={contactToDelete}
      />
    </div>
  );
};

export default Dashboard;