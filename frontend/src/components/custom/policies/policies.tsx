import React, { useState, ChangeEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Share2, Download, ChevronLeft, ChevronRight, Bold, Italic, Underline, List, Link, Type } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface CustomRenderers {
  [key: string]: React.FC<{ children: React.ReactNode }>;
}

const fontFamilies = [
  { name: 'Sans-serif', value: 'sans-serif' },
  { name: 'Serif', value: 'serif' },
  { name: 'Monospace', value: 'monospace' },
  { name: 'Cursive', value: 'cursive' },
  { name: 'Fantasy', value: 'fantasy' },
];

const Policies: React.FC = () => {
  const [content, setContent] = useState<string>(`# Company Policies

## Code of Conduct

Our company is committed...

## Compliance Guidelines

1. All employees must...
2. Annual training is required...

## Data Protection

We take data protection seriously...

| Policy | Description | Importance |
|--------|-------------|------------|
| Code of Conduct | Guidelines for behavior | High |
| Compliance | Legal and regulatory adherence | Critical |
| Data Protection | Safeguarding sensitive information | Very High |
`);
  const [previewFont, setPreviewFont] = useState<string>('sans-serif');

  const handleContentChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'policies.md';
    a.click();
  };

  const handleShare = () => {
    // Implement share functionality
    console.log('Sharing content...');
  };

  const handleFontChange = (font: string) => {
    setPreviewFont(font);
  };

  const customRenderers: CustomRenderers = {
    h1: ({children}) => <h1 className="text-3xl font-bold mb-4">{children}</h1>,
    h2: ({children}) => <h2 className="text-2xl font-semibold mb-3">{children}</h2>,
    h3: ({children}) => <h3 className="text-xl font-medium mb-2">{children}</h3>,
    p: ({children}) => <p className="mb-4">{children}</p>,
    ul: ({children}) => <ul className="list-disc pl-5 mb-4">{children}</ul>,
    ol: ({children}) => <ol className="list-decimal pl-5 mb-4">{children}</ol>,
    li: ({children}) => <li className="mb-1">{children}</li>,
    table: ({children}) => <table className="w-full border-collapse border border-gray-300 mb-4">{children}</table>,
    thead: ({children}) => <thead className="bg-gray-100">{children}</thead>,
    th: ({children}) => <th className="border border-gray-300 p-2">{children}</th>,
    td: ({children}) => <td className="border border-gray-300 p-2">{children}</td>,
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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-2" size="icon"><Type className="h-4 w-4" /></Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {fontFamilies.map((font) => (
                  <DropdownMenuItem key={font.value} onClick={() => handleFontChange(font.value)}>
                    <span style={{ fontFamily: font.value }}>{font.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
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
              className="w-full h-[calc(100vh-200px)] p-4 font-mono text-sm bg-gray-100 resize-none focus:outline-none"
              value={content}
              onChange={handleContentChange}
            />
          </TabsContent>
          <TabsContent value="preview">
            <div 
              className="w-full h-[calc(100vh-200px)] px-16 py-4 overflow-auto prose max-w-none"
              style={{ fontFamily: previewFont }}
            >
              <ReactMarkdown 
                components={customRenderers}
                remarkPlugins={[remarkGfm]}
              >
                {content}
              </ReactMarkdown>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Policies;