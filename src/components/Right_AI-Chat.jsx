import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, SendIcon } from 'lucide-react';

const AISidePanel = ({ 
  isOpen, 
  onClose, 
  initialQuestion, 
  onSendMessage,
  title = "AI Conversation",
  placeholder = "Type your message...",
  showAIControls = true,
  children
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (initialQuestion) {
      setMessages([{ type: 'user', content: initialQuestion }]);
      // Simulate AI response (replace with actual API call in production)
      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { type: 'ai', content: `Here's a response to "${initialQuestion}"` }]);
      }, 1000);
    }
  }, [initialQuestion]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages(prevMessages => [...prevMessages, { type: 'user', content: newMessage }]);
      onSendMessage?.(newMessage);
      setNewMessage('');
      
      if (showAIControls) {
        // Simulate AI response (replace with actual API call in production)
        setTimeout(() => {
          setMessages(prevMessages => [...prevMessages, { type: 'ai', content: `Here's a response to "${newMessage}"` }]);
        }, 1000);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed top-16 right-4 bottom-4 w-[336px] bg-white shadow-lg flex flex-col z-[9999] rounded-t-[24px] rounded-b-[48px] my-6">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">{title}</h2>
        <Button variant="ghost" onClick={onClose}>Close</Button>
      </div>
      
      <div className="flex-grow overflow-hidden py-6 px-4">
        <div className="bg-gray-100 h-full rounded-2xl p-4 overflow-y-auto">
          {children || (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`p-3 rounded-lg max-w-[80%] ${
                    message.type === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-white text-gray-800 border border-gray-300'
                  }`}>
                    {message.content}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <div className="bg-white rounded-full shadow-lg p-2 flex items-center space-x-2 flex-grow">
            {showAIControls && (
              <Button 
                size="icon" 
                className="rounded-full flex-shrink-0 bg-[#594BFF1A] hover:bg-[#594BFF33]"
                onClick={() => setNewMessage('')}
              >
                <PlusIcon className="h-6 w-6 text-[#594BFF]" />
              </Button>
            )}
            <Input 
              type="text" 
              placeholder={placeholder}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              className="flex-grow text-lg border-none focus:ring-0 rounded-full"
            />
            <Button 
              className="bg-[#594BFF] hover:bg-[#4B3FD9] text-white rounded-full px-6"
              onClick={handleSend}
            >
              {showAIControls ? 'Ask' : 'Send'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISidePanel;
