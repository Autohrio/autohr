import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PaperclipIcon, SendIcon, ImageIcon } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  attachment?: string;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isUser, setIsUser] = useState<string>("bot");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  }, [messages]);

  const handleSendMessage = () => {
    setIsUser("user")
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now(),
        text: inputText,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      // Here you would typically send the message to your AI backend
      // and then add the AI's response to the messages
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Here you would typically upload the file and get a URL back
      // For this example, we'll just use the file name
      const newMessage: Message = {
        id: Date.now(),
        text: `Uploaded: ${file.name}`,
        sender: 'user',
        attachment: file.name,
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
    }
  };

  const handlePasteScreenshot = () => {
    // This is a placeholder for screenshot functionality
    // You would need to implement actual screenshot capture here
    alert('Screenshot functionality would be implemented here');
  };

  return (
    <div className="flex bg-gray-100 rounded-xl flex-col p-6 mx-auto w-full">
      <ScrollArea className="flex-grow p-8 h-[42rem] ">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-xl font-bold text-gray-400">What can I help with?</p>
          </div>
        ) : (
          messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
              <div className={`flex items-start ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="w-8 h-8">
                  <AvatarFallback className='bg-gray-300'>{message.sender === 'user' ? 'US' : 'AI'}</AvatarFallback>
                </Avatar>
                <div>
                  <div className={`mx-2 p-3 rounded-3xl ${message.sender === 'user' ? 'bg-gray-200' : 'bg-gray-200'}`}>
                    <p>{message.text}</p>
                    {message.attachment && <p className="text-sm mt-1">Attachment: {message.attachment}</p>}
                  </div>
                  <p className={`text-xs text-gray-500 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex items-center space-x-2">
          <Button variant="outline" className="p-2 bg-gray-200" onClick={() => fileInputRef.current?.click()}>
            <PaperclipIcon className="h-4 w-4" />
          </Button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <Button variant="outline" className="p-2 bg-gray-200" size="icon" onClick={handlePasteScreenshot}>
            <ImageIcon className="h-4 w-4" />
          </Button>
          <Input
            className='bg-gray-200'
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <Button onClick={handleSendMessage}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;