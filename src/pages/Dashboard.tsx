import React, { useState } from 'react';
import { Plus, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import ContactCard from '../components/ContactCard';
import AddContactModal from '../components/AddContactModal';
import ChatAgent from '../components/ChatAgent';

export default function Dashboard() {
  const { contacts } = useApp();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-medium text-gray-900">Your Contacts</h1>
          <p className="text-gray-600 mt-2">
            Manage birthdays and schedule gifts for your friends
          </p>
          <button
            onClick={() => {
              const clientId = import.meta.env.VITE_PAYMAN_CLIENT_ID;
              const redirectUri = encodeURIComponent(window.location.origin + '/oauth-callback');
              const oauthUrl = `https://app.paymanai.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=payments`;
              window.location.href = oauthUrl;
            }}
            className="mt-4 flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors"
          >
            <span>Connect Payman</span>
          </button>
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