import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PaperclipIcon, 
  SendIcon, 
  ImageIcon, 
  Loader2, 
  ClipboardList, 
  Users, 
  Book,
  DollarSign,
  Clock,
  AlertCircle,
  Briefcase,
  FileText
} from 'lucide-react';
import ReactMarkdown, { Components } from 'react-markdown';
import { sendMessageToAgent } from '@/api/chat';
import { sendHRStreamMessage, AgentType } from '@/api/personalChat';
import { useUser } from '@/context/useUser';
import { useWorkspace } from '@/context/useWorkspace';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  attachment?: string;
  timestamp: Date;
}

interface Suggestion {
  icon: React.ReactNode;
  text: string;
  color: string;
}

interface MessageContentProps {
  text: string;
}

interface CodeProps extends React.HTMLProps<HTMLElement> {
  inline?: boolean;
  node?: any;
  className?: string;
  children?: React.ReactNode;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentType>('hr');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const { user } = useUser();
  const { currentWorkspace } = useWorkspace();

  const hrSuggestions: Suggestion[] = [
    { 
      icon: <ClipboardList className="w-4 h-4 text-emerald-500" />,
      text: "Show my current month performance metrics",
      color: "hover:bg-emerald-500/10 group-hover:text-emerald-500"
    },
    { 
      icon: <ClipboardList className="w-4 h-4 text-emerald-500" />,
      text: "View my appraisal status for this month",
      color: "hover:bg-emerald-500/10 group-hover:text-emerald-500"
    },
    { 
      icon: <Book className="w-4 h-4 text-slate-500" />,
      text: "Show company policies and guidelines",
      color: "hover:bg-slate-500/10 group-hover:text-slate-500"
    },
    { 
      icon: <DollarSign className="w-4 h-4 text-green-500" />,
      text: "Calculate my expected earnings this month",
      color: "hover:bg-green-500/10 group-hover:text-green-500"
    },
    { 
      icon: <Clock className="w-4 h-4 text-orange-500" />,
      text: "Submit leave request for specific dates",
      color: "hover:bg-orange-500/10 group-hover:text-orange-500"
    },
    { 
      icon: <AlertCircle className="w-4 h-4 text-red-500" />,
      text: "Request emergency leave for today",
      color: "hover:bg-red-500/10 group-hover:text-red-500"
    },
    { 
      icon: <Briefcase className="w-4 h-4 text-cyan-500" />,
      text: "Review my current projects and deadlines",
      color: "hover:bg-cyan-500/10 group-hover:text-cyan-500"
    },
    { 
      icon: <Users className="w-4 h-4 text-blue-500" />,
      text: "Create an employee onboarding plan",
      color: "hover:bg-blue-500/10 group-hover:text-blue-500"
    },
    { 
      icon: <Users className="w-4 h-4 text-violet-500" />,
      text: "Show my team's upcoming meetings",
      color: "hover:bg-violet-500/10 group-hover:text-violet-500"
    },
    { 
      icon: <FileText className="w-4 h-4 text-fuchsia-500" />,
      text: "Generate employment verification letter",
      color: "hover:bg-fuchsia-500/10 group-hover:text-fuchsia-500"
    }
  ];

  const MessageContent: React.FC<MessageContentProps> = ({ text }) => {
    const components: Components = {
      p: ({ children, ...props }) => (
        <p className="mb-2" {...props}>{children}</p>
      ),
      code: ({ inline, className, children, ...props }: CodeProps) => {
        return inline ? (
          <code className="bg-gray-100 px-1 rounded" {...props}>
            {children}
          </code>
        ) : (
          <pre className="bg-gray-100 p-3 rounded-lg overflow-x-auto">
            <code className={className} {...props}>
              {children}
            </code>
          </pre>
        );
      },
      ul: ({ children, ...props }) => (
        <ul className="list-disc ml-4 mb-2" {...props}>{children}</ul>
      ),
      ol: ({ children, ...props }) => (
        <ol className="list-decimal ml-4 mb-2" {...props}>{children}</ol>
      ),
      li: ({ children, ...props }) => (
        <li className="mb-1" {...props}>{children}</li>
      ),
    };
  
    return <ReactMarkdown components={components}>{text}</ReactMarkdown>;
  };
  
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string = inputText) => {
    if (text.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: text,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      setIsLoading(true);

      try {
        if (selectedAgent === 'hr') {
          // Use original HR agent
          await sendMessageToAgent(
            text,
            (botResponse: string) => {
              const botMessage: Message = {
                id: Date.now(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, botMessage]);
            },
            () => setIsLoading(false)
          );
        } else {
          // Use new stream message for supervisor
          const conversationHistory = messages.map(msg => ({
            role: msg.sender === 'user' ? 'user' : 'assistant',
            content: msg.text
          }));

          await sendHRStreamMessage(
            text,
            conversationHistory,
            (botResponse: string) => {
              const botMessage: Message = {
                id: Date.now(),
                text: botResponse,
                sender: 'bot',
                timestamp: new Date(),
              };
              setMessages(prev => [...prev, botMessage]);
            },
            () => setIsLoading(false),
            currentWorkspace?._id as string,
            user?._id as string
          );
        }
      } catch (error) {
        console.error('Error in sending message:', error);
        setIsLoading(false);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const newMessage: Message = {
        id: Date.now(),
        text: `Uploaded: ${file.name}`,
        sender: 'user',
        attachment: file.name,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const handlePasteScreenshot = () => {
    alert('Screenshot functionality would be implemented here');
  };

  const handleSuggestionClick = (text: string) => {
    handleSendMessage(text);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex bg-gray-100 rounded-xl flex-col p-6 mx-auto w-full">
      <div className="mb-4">
        <Select
          value={selectedAgent}
          onValueChange={(value: AgentType) => setSelectedAgent(value)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Agent Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hr">HR Agent</SelectItem>
            <SelectItem value="supervisor">Senior Supervisor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="flex-grow p-8 h-[47rem]">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center space-y-8">
            <p className="text-2xl font-bold text-gray-700">What can I help with?</p>
            <div className="w-full max-w-2xl space-y-2">
              {hrSuggestions.map((suggestion, index) => (
                <button
                  key={`suggestion-${index}`}
                  onClick={() => handleSuggestionClick(suggestion.text)}
                  className={`w-full text-left p-3 rounded-lg border border-gray-200 group transition-all duration-300 ${suggestion.color}`}
                >
                  <div className="flex items-center gap-3">
                    {suggestion.icon}
                    <span className="text-sm font-medium">{suggestion.text}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`flex items-start max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    <AvatarFallback className='bg-gray-300'>
                      {message.sender === 'user' ? 'US' : selectedAgent === 'hr' ? 'HR' : 'SV'}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`mx-2 ${message.sender === 'user' ? 'ml-0' : 'mr-0'}`}>
                    <div 
                      className={`px-10 rounded-xl ${
                        message.sender === 'user' 
                          ? 'bg-slate-200 py-2' 
                          : 'border-gray-200'
                      }`}
                    >
                      <div className={`prose prose-sm ${
                        message.sender === 'user' ? 'prose-invert' : ''
                      } max-w-none`}>
                        <MessageContent text={message.text} />
                      </div>
                      {message.attachment && (
                        <p className="text-sm mt-1">Attachment: {message.attachment}</p>
                      )}
                    </div>
                    <p className={`text-xs text-gray-500 mt-1 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="flex items-start">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className='bg-gray-300'>
                      {selectedAgent === 'hr' ? 'HR' : 'SV'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="mx-2 p-3 rounded-xl bg-white border border-gray-200">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={chatEndRef} />
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="p-2" onClick={() => fileInputRef.current?.click()}>
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button variant="outline" className="p-2" size="icon" onClick={handlePasteScreenshot}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />
          <Button onClick={() => handleSendMessage()} disabled={isLoading}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;