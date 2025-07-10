import React, { useState } from 'react';
import { ArrowLeftIcon, SendIcon } from 'lucide-react';

interface SimpleAssistantProps {
  onBack: () => void;
}

export const SimpleAssistant: React.FC<SimpleAssistantProps> = ({ onBack }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([
    'Hello! I\'m your Budget Buddy Assistant. How can I help you today?'
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessages = [...messages, `You: ${message}`, 'Assistant: Thanks for your message! I\'m here to help with your finances.'];
    setMessages(newMessages);
    setMessage('');
  };

  return (
    <div className="w-full min-h-screen bg-blue-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center shadow-sm">
        <button 
          className="w-10 h-10 rounded-full flex items-center justify-center mr-4 hover:bg-gray-100" 
          onClick={onBack}
        >
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Simple Assistant Test</h1>
          <p className="text-xs text-gray-500">Testing basic functionality</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className="bg-white p-3 rounded-lg shadow-sm">
              <p className="text-gray-800">{msg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white p-4 border-t">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <input 
            type="text" 
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 outline-none" 
            placeholder="Type a message..." 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            onKeyPress={e => e.key === 'Enter' && handleSendMessage()} 
          />
          <button 
            className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-600 text-white" 
            onClick={handleSendMessage}
          >
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
