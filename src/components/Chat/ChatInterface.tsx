import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, X } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { PaymanClient } from '@paymanai/payman-ts';
import { mockGifts } from '../../lib/mockGifts';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift: (message: string) => Promise<void>;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ isOpen, onClose, onSendGift }) => {
  const { user, paymanAccessToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your Gift Agent. You can ask me to send gifts to your contacts. Try saying something like 'Send a notebook to Raj' or 'What gifts do you recommend for Sarah?'",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const message = inputValue.toLowerCase();
      let response = "I'm not sure how to help with that. Try asking me to send a gift, like 'Send a pen to Raj'.";

      if (message.includes('send') && message.includes('to')) {
        if (!paymanAccessToken) {
          response = "Please connect your Payman account on the dashboard before sending gifts.";
        } else {
          const giftMatch = message.match(/send (?:a |an )?(.+?) to (.+)/);
          if (giftMatch && user) {
            const [, giftName, recipient] = giftMatch;
            try {
              // 1. Look up contact
              const { data: contact, error: contactError } = await supabase
                .from('contacts')
                .select('*')
                .eq('user_id', user.id)
                .ilike('name', `%${recipient}%`)
                .maybeSingle();
              if (contactError || !contact) throw new Error(`Contact '${recipient}' not found.`);

              // 2. Find the gift in our catalog
              const gift = mockGifts.find(g => g.name.toLowerCase() === giftName.toLowerCase());
              if (!gift) throw new Error(`Sorry, I couldn't find '${giftName}' in our gift catalog. Please choose from the available gifts.`);

              // 3. Create a temporary Payman client with the user's token
              const userPaymanClient = PaymanClient.withToken(
                import.meta.env.VITE_PAYMAN_CLIENT_ID!,
                { accessToken: paymanAccessToken, expiresIn: 3600 }
              );

              // 4. Send payment to store with correct gift price
              const storePaytag = import.meta.env.VITE_STORE_PAYTAG;
              if (!storePaytag) throw new Error("Store Paytag not configured. Please check environment variables.");
              
              await userPaymanClient.ask(
                `send $${gift.price} to ${storePaytag} for ${gift.name} (Recipient: ${contact.name})`
              );

              // 5. Log transaction
              const { error: txError } = await supabase.from('transactions').insert([{
                user_id: user.id,
                recipient_name: contact.name,
                gift_id: gift.id,
                gift_name: gift.name,
                gift_price: gift.price,
                gift_image: gift.image,
                gift_category: gift.category,
                status: 'paid',
                transaction_date: new Date().toISOString(),
                payman_id: Date.now().toString()
              }]);
              
              if (txError) throw txError;
              
              response = `💸 Payment sent: <span class="text-green-500 font-semibold">$${gift.price}</span>\n\n🎁 Great news! I've purchased the ${gift.name} for ${recipient}. The gift is being processed and will be delivered to their address. They're going to love it!`;

            } catch (err: any) {
              response = `Sorry, I couldn't process that gift purchase. ${err.message}`;
            }
          }
        }
      } else if (message.includes('recommend') || message.includes('suggest')) {
        response = `I'd recommend these popular gifts:\n\n${mockGifts.map(gift => 
          `🎁 ${gift.name} ($${gift.price})`
        ).join('\n')}\n\nWhich contact would you like to send a gift to?`;
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, a critical error occurred. Please try again.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl h-96 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <Bot className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold">Gift Agent</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-xs lg:max-w-md`}>
                {!message.isUser && (
                  <div className="p-1 bg-blue-100 rounded-full">
                    <Bot className="w-4 h-4 text-blue-600" />
                  </div>
                )}
                <div
                  className={`px-3 py-2 rounded-lg whitespace-pre-line ${
                    message.isUser
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                  dangerouslySetInnerHTML={{ __html: message.content }}
                >
                </div>
                {message.isUser && (
                  <div className="p-1 bg-gray-100 rounded-full">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-blue-100 rounded-full">
                  <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div className="px-3 py-2 bg-gray-100 rounded-lg">
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

        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Input
              placeholder="Ask me to send a gift... (e.g., 'Send a notebook to Raj')"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              icon={Send}
            >
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ChatInterface;