import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share2, Download, ChevronLeft, ChevronRight, Bold, Italic, Underline, List, Link } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Policies: React.FC = () => {
  const [content, setContent] = useState('# Company Policies\n\n## Code of Conduct\n\nOur company is committed to...\n\n## Compliance Guidelines\n\n1. All employees must...\n2. Annual training is required...\n\n## Data Protection\n\nWe take data protection seriously...');

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'policies_and_compliance.md';
    a.click();
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing content...');
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="border-t-4 border-t-gray-500">
        <div className="flex justify-between items-center p-4 border-b">
          <div className="flex space-x-2">
            <Button variant="ghost" className="p-2" size="icon"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="ghost" className="p-2" size="icon"><ChevronRight className="h-4 w-4" /></Button>
            <Button variant="ghost" className="p-2" size="icon"><Bold className="h-4 w-4" /></Button>
            <Button variant="ghost" className="p-2" size="icon"><Italic className="h-4 w-4" /></Button>
            <Button variant="ghost" className="p-2" size="icon"><Underline className="h-4 w-4" /></Button>
            <Button variant="ghost" className="p-2" size="icon"><List className="h-4 w-4" /></Button>
            <Button variant="ghost" className="p-2" size="icon"><Link className="h-4 w-4" /></Button>
          </div>
          <div className="flex space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline"><Share2 className="h-4 w-4 mr-2" /> Share</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleShare}>Copy share link</DropdownMenuItem>
                <DropdownMenuItem onClick={handleShare}>Email</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button onClick={handleDownload}><Download className="h-4 w-4 mr-2" /> Download</Button>
          </div>
        </div>
        <Tabs defaultValue="edit" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit">
            <textarea
              className="w-full h-[calc(100vh-200px)] p-4 font-mono text-sm bg-gray-200 resize-none focus:outline-none"
              value={content}
              onChange={handleContentChange}
            />
          </TabsContent>
          <TabsContent value="preview">
            <div className="w-full h-[calc(100vh-200px)] p-4 overflow-auto prose">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Policies;