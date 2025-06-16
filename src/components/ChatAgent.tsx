import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, CheckCircle, AlertCircle } from 'lucide-react';
import { useApp, gifts } from '../context/AppContext';
import { getAuthenticatedPaymanClient, isPaymanConnected } from '../lib/payman-client';

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
  const { contacts, addTransaction, showToast } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize messages based on connection status
  useEffect(() => {
    const initializeMessages = () => {
      const connected = isPaymanConnected();
      setMessages([{
        id: '1',
        type: 'agent',
        content: connected 
          ? "Hi! I'm your gift agent. You can tell me to send gifts to your contacts like 'send wireless headphones to Sarah' and I'll handle the purchase and delivery instantly! 🎁"
          : "Hi! I'm your gift agent. Please connect your Payman account first using the button above, then you can tell me to send gifts like 'send wireless headphones to Sarah'! 🎁",
        timestamp: new Date()
      }]);
    };

    initializeMessages();

    // Listen for connection status changes
    const handleStorageChange = () => {
      initializeMessages();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleStorageChange);
    };
  }, []);

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

  const processGiftCommand = async (message: string) => {
    // Check if Payman is connected
    if (!isPaymanConnected()) {
      return {
        success: false,
        response: "Please connect your Payman account first using the 'Connect Payman' button above. Once connected, I'll be able to send real payments! 💳"
      };
    }

    // Handle test connection command
    if (message.toLowerCase().includes('test connection') || message.toLowerCase().includes('test payman')) {
      try {
        const paymanClient = getAuthenticatedPaymanClient();
        if (!paymanClient) {
          return {
            success: false,
            response: "Your Payman session has expired. Please reconnect your account using the button above."
          };
        }

        const balanceResponse = await paymanClient.ask("what's my wallet balance?");
        return {
          success: true,
          response: `✅ Payman connection test successful! Your wallet info: ${balanceResponse}`
        };
              } catch (error) {
          console.error('Connection test failed:', error);
          return {
            success: false,
            response: `❌ Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
          };
        }
    }

    // Parse the message for gift sending commands
    const sendPattern = /send\s+(.+?)\s+to\s+(.+)/i;
    const match = message.match(sendPattern);

    if (!match) {
      return {
        success: false,
        response: "I didn't understand that. Try saying something like 'send wireless headphones to Sarah', 'send coffee beans to Mike', or 'test connection' to verify your Payman setup."
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

    // Use authenticated Payman client for user-specific operations
    try {
      const paymanClient = getAuthenticatedPaymanClient();
      if (!paymanClient) {
        return {
          success: false,
          response: "Your Payman session has expired. Please reconnect your account using the button above."
        };
      }

      // Use the existing test payee instead of creating new ones
      const TEST_PAYEE_ID = 'pd-1f048707-53da-6908-a779-972e0be1d5f8';
      const paymentPrompt = `Send ${gift.price} TSD to payee ${TEST_PAYEE_ID}. Description: Birthday gift for ${contact.name} - ${gift.name}`;
      
      await paymanClient.ask(paymentPrompt);
      
      // Add transaction to our database
      await addTransaction({
        recipientName: contact.name,
        gift: gift,
        status: 'paid',
        transactionDate: new Date().toISOString(),
        paymanId: `payment-${Date.now()}` // In real implementation, extract from paymentResponse
      });

      return {
        success: true,
        response: `Perfect! I've sent ${gift.name} (${gift.price} TSD) to ${contact.name} via Payman. Payment processed and the gift is on its way! 🎉`,
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
        response: "Sorry, there was an error processing the payment. Please check your Payman wallet balance or try again."
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
      <div className="flex items-center justify-between p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-900 p-2 rounded-2xl">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">Gift Agent</h3>
            <p className="text-sm text-gray-600">Your personal gift assistant</p>
          </div>
        </div>
        
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {isPaymanConnected() ? (
            <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full">
              <CheckCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Connected</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Connect Payman</span>
            </div>
          )}
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
            placeholder={isPaymanConnected() ? "Try: 'send wireless headphones to Sarah' or 'test connection'" : "Connect Payman first to send gifts"}
            disabled={!isPaymanConnected()}
            className={`flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all ${
              !isPaymanConnected() ? 'bg-gray-50 text-gray-400' : ''
            }`}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping || !isPaymanConnected()}
            className="bg-gray-900 text-white p-3 rounded-2xl hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {isPaymanConnected() 
            ? 'Example: "send coffee beans to Mike", "send blanket to Emma", or "test connection"'
            : 'Connect your Payman account above to start sending gifts'
          }
        </p>
      </div>
    </div>
  );
}