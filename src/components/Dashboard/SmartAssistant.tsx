import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeftIcon, SendIcon, MicIcon, PlusIcon, ArrowRightIcon, TrendingUpIcon, AlertCircleIcon, CalendarIcon, DollarSignIcon } from 'lucide-react';
interface SmartAssistantProps {
  onBack: () => void;
}
interface Message {
  id: string;
  type: 'user' | 'assistant' | 'suggestion';
  content: string;
  timestamp: Date;
  suggestion?: {
    type: 'transfer' | 'analysis' | 'reminder' | 'info';
    action?: string;
  };
}
export const SmartAssistant: React.FC<SmartAssistantProps> = ({
  onBack
}) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'assistant',
    content: 'Hello Sam! How can I help you with your finances today?',
    timestamp: new Date(Date.now() - 60000)
  }, {
    id: '2',
    type: 'suggestion',
    content: 'Move ₦5,000 to savings today?',
    timestamp: new Date(),
    suggestion: {
      type: 'transfer',
      action: 'Transfer now'
    }
  }, {
    id: '3',
    type: 'suggestion',
    content: "Want to analyze June's spending?",
    timestamp: new Date(),
    suggestion: {
      type: 'analysis',
      action: 'View analysis'
    }
  }]);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  // Handle send message
  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };
    setMessages([...messages, userMessage]);
    setMessage('');
    // Simulate assistant response
    setTimeout(() => {
      let responseContent = '';
      let suggestionType: Message['suggestion'] | undefined = undefined;
      if (message.toLowerCase().includes('spent') || message.toLowerCase().includes('spending')) {
        responseContent = "You've spent ₦32,500 this week. Your biggest expense was Food & Drinks at ₦12,800.";
        suggestionType = {
          type: 'info'
        };
      } else if (message.toLowerCase().includes('remind') || message.toLowerCase().includes('reminder')) {
        responseContent = "I've set a reminder for you to pay rent on Friday, July 28th.";
        suggestionType = {
          type: 'reminder'
        };
      } else {
        responseContent = "I'm here to help with your finances! You can ask about your spending, set reminders, or get insights on your budget.";
      }
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        suggestion: suggestionType
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
  };
  // Handle voice recording
  const handleVoiceRecording = () => {
    setIsRecording(true);
    // Simulate voice recording and processing
    setTimeout(() => {
      setIsRecording(false);
      const voiceMessage: Message = {
        id: Date.now().toString(),
        type: 'user',
        content: 'How much have I spent this week?',
        timestamp: new Date()
      };
      setMessages([...messages, voiceMessage]);
      // Simulate assistant response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: "You've spent ₦32,500 this week. Your biggest expense was Food & Drinks at ₦12,800.",
          timestamp: new Date(),
          suggestion: {
            type: 'info'
          }
        };
        setMessages(prev => [...prev, assistantMessage]);
      }, 1000);
    }, 3000);
  };
  // Handle suggestion action
  const handleSuggestionAction = (suggestionType: string) => {
    let responseContent = '';
    if (suggestionType === 'transfer') {
      responseContent = "Great! I've transferred ₦5,000 to your savings account.";
    } else if (suggestionType === 'analysis') {
      responseContent = "Here's your June spending analysis: You spent 20% less than May. Well done!";
    }
    const assistantMessage: Message = {
      id: Date.now().toString(),
      type: 'assistant',
      content: responseContent,
      timestamp: new Date()
    };
    setMessages([...messages, assistantMessage]);
  };
  // Get icon for suggestion type
  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'transfer':
        return <DollarSignIcon className="w-4 h-4" />;
      case 'analysis':
        return <TrendingUpIcon className="w-4 h-4" />;
      case 'reminder':
        return <CalendarIcon className="w-4 h-4" />;
      case 'info':
        return <AlertCircleIcon className="w-4 h-4" />;
      default:
        return null;
    }
  };
  // Format time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  return <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white p-4 flex items-center shadow-sm">
        <button className="w-10 h-10 rounded-full flex items-center justify-center mr-4 hover:bg-gray-100" onClick={onBack}>
          <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-800">Smart Assistant</h1>
          <p className="text-xs text-gray-500">
            Ask me anything about your finances
          </p>
        </div>
      </div>
      {/* Messages Container */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto space-y-4">
          {messages.map(msg => <div key={msg.id}>
              {msg.type === 'user' && <motion.div className="flex justify-end" initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }}>
                  <div className="bg-purple-600 text-white rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                    <p>{msg.content}</p>
                    <p className="text-xs text-purple-200 text-right mt-1">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>}
              {msg.type === 'assistant' && <motion.div className="flex justify-start" initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }}>
                  <div className="bg-white text-gray-800 rounded-2xl rounded-tl-none px-4 py-2 shadow-sm max-w-[80%]">
                    <p>{msg.content}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>
                </motion.div>}
              {msg.type === 'suggestion' && <motion.div className="flex justify-start" initial={{
            opacity: 0,
            y: 10
          }} animate={{
            opacity: 1,
            y: 0
          }}>
                  <div className="bg-white rounded-2xl p-4 shadow-sm max-w-[90%]">
                    <div className="flex items-center mb-2">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-2">
                        {msg.suggestion && getSuggestionIcon(msg.suggestion.type)}
                      </div>
                      <p className="font-medium text-gray-800">{msg.content}</p>
                    </div>
                    {msg.suggestion && msg.suggestion.action && <button className="flex items-center text-sm text-purple-600 font-medium mt-1" onClick={() => handleSuggestionAction(msg.suggestion!.type)}>
                        {msg.suggestion.action}
                        <ArrowRightIcon className="w-4 h-4 ml-1" />
                      </button>}
                  </div>
                </motion.div>}
            </div>)}
          <div ref={messagesEndRef} />
        </div>
      </div>
      {/* Input Area */}
      <div className="bg-white p-4 border-t">
        <div className="max-w-md mx-auto flex items-center">
          <button className="w-10 h-10 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100">
            <PlusIcon className="w-5 h-5" />
          </button>
          <div className="flex-1 bg-gray-100 rounded-full flex items-center mx-2 px-4 py-2">
            <input type="text" className="flex-1 bg-transparent outline-none" placeholder="Message your assistant..." value={message} onChange={e => setMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} />
            <AnimatePresence>
              {isRecording && <motion.div className="text-red-500 text-sm mr-2" initial={{
              opacity: 0
            }} animate={{
              opacity: 1
            }} exit={{
              opacity: 0
            }}>
                  Recording...
                </motion.div>}
            </AnimatePresence>
            <button className={`w-8 h-8 rounded-full flex items-center justify-center ${isRecording ? 'text-red-500 animate-pulse' : 'text-gray-500'}`} onClick={handleVoiceRecording}>
              <MicIcon className="w-5 h-5" />
            </button>
          </div>
          <button className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-600 text-white" onClick={handleSendMessage} disabled={!message.trim()}>
            <SendIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>;
};