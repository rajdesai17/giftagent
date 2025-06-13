import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Gift, CheckCircle } from 'lucide-react';
import { useApp, gifts } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import payman from '../lib/payman';
import { PaymanClient } from '@paymanai/payman-ts';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: Date;
  isProcessing?: boolean;
  giftSent?: {
    giftName: string;
    recipientName: string;
    price: number;
  };
}

export default function ChatAgent() {
  const { user } = useAuth();
  const { contacts, addTransaction, showToast } = useApp();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'agent',
      content: "Hi! I'm your gift agent. You can tell me to send gifts to your contacts like 'send wireless headphones to Sarah' and I'll handle the purchase and delivery instantly! 🎁",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findGiftByName = (giftName: string) => {
    const normalizedInput = giftName.toLowerCase();
    return gifts.find(gift => 
      gift.name.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(gift.name.toLowerCase()) ||
      gift.category.toLowerCase().includes(normalizedInput)
    );
  };

  const findContactByName = (contactName: string) => {
    const normalizedInput = contactName.toLowerCase();
    return contacts.find(contact => 
      contact.name.toLowerCase().includes(normalizedInput) ||
      normalizedInput.includes(contact.name.toLowerCase())
    );
  };

  const generateTransactionId = () => {
    return `PM-${Math.floor(Math.random() * 9000000) + 1000000}`;
  };

  const processGiftCommand = async (message: string) => {
    // Parse the message for gift sending commands
    const sendPattern = /send\s+(.+?)\s+to\s+(.+)/i;
    const match = message.match(sendPattern);

    if (!match) {
      return {
        success: false,
        response: "I didn't understand that. Try saying something like 'send wireless headphones to Sarah' or 'send coffee beans to Mike'."
      };
    }

    const [, giftQuery, recipientQuery] = match;
    
    // Find the gift
    const gift = findGiftByName(giftQuery.trim());
    if (!gift) {
      const availableGifts = gifts.map(g => g.name).join(', ');
      return {
        success: false,
        response: `I couldn't find that gift. Available gifts: ${availableGifts}`
      };
    }

    // Find the contact
    const contact = findContactByName(recipientQuery.trim());
    if (!contact) {
      const availableContacts = contacts.map(c => c.name).join(', ');
      return {
        success: false,
        response: contacts.length > 0 
          ? `I couldn't find that contact. Your contacts: ${availableContacts}`
          : "You don't have any contacts yet. Add some contacts first!"
      };
    }

    // Real Payman payment logic using API route
    try {
      const TO_WALLET_ID = 'pd-1f048707-53da-6908-a779-972e0be1d5f8';
      const response = await fetch('/api/sendPayment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toWalletId: TO_WALLET_ID,
          amount: gift.price,
          description: `Birthday gift for ${contact.name}`,
          metadata: { contactId: contact.id, giftId: gift.id }
        })
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.error);
      const payment = result.payment;

      await addTransaction({
        recipientName: contact.name,
        gift: gift,
        status: 'paid',
        transactionDate: new Date().toISOString(),
        paymanId: payment.id
      });

      return {
        success: true,
        response: `Perfect! I've sent ${gift.name} (${gift.price} TSD) to ${contact.name} at ${contact.address}. Payment processed and the gift is on its way! 🎉`,
        giftSent: {
          giftName: gift.name,
          recipientName: contact.name,
          price: gift.price
        }
      };
    } catch (error) {
      console.error('Payman payment error:', error);
      return {
        success: false,
        response: "Sorry, there was an error processing the payment. Please try again."
      };
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate processing delay
    setTimeout(async () => {
      const result = await processGiftCommand(inputMessage);
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'agent',
        content: result.response,
        timestamp: new Date(),
        giftSent: result.giftSent
      };

      setMessages(prev => [...prev, agentMessage]);
      setIsTyping(false);

      if (result.success) {
        showToast('Gift sent successfully!', 'success');
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 h-[600px] flex flex-col">
      {/* Chat Header */}
      <div className="flex items-center space-x-3 p-6 border-b border-gray-100">
        <div className="bg-gray-900 p-2 rounded-2xl">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-medium text-gray-900">Gift Agent</h3>
          <p className="text-sm text-gray-600">Your personal gift assistant</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${
              message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              <div className={`p-2 rounded-2xl ${
                message.type === 'user' 
                  ? 'bg-gray-100' 
                  : 'bg-gray-900'
              }`}>
                {message.type === 'user' ? (
                  <User className="h-4 w-4 text-gray-600" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className={`rounded-2xl px-4 py-3 ${
                message.type === 'user'
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-50 text-gray-900'
              }`}>
                <p className="text-sm leading-relaxed">{message.content}</p>
                {message.giftSent && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-center space-x-2 text-green-700">
                      <CheckCircle className="h-4 w-4" />
                      <span className="text-xs font-medium">Gift Sent Successfully</span>
                    </div>
                    <div className="mt-2 text-xs text-green-600">
                      <p><strong>{message.giftSent.giftName}</strong> → {message.giftSent.recipientName}</p>
                      <p>${message.giftSent.price} • Payment processed</p>
                    </div>
                  </div>
                )}
                <p className="text-xs opacity-70 mt-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="bg-gray-900 p-2 rounded-2xl">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <div className="bg-gray-50 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-gray-100">
        <div className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Try: 'send wireless headphones to Sarah'"
            className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gray-900 text-white p-3 rounded-2xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Example: "send coffee beans to Mike" or "send blanket to Emma"
        </p>
      </div>
    </div>
  );
}