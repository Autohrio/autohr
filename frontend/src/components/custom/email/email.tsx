import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const Email: React.FC = () => {
  const [smtpConfig, setSmtpConfig] = useState({
    host: '',
    port: '',
    username: '',
    password: '',
    fromEmail: '',
  });

  const [offerTemplate, setOfferTemplate] = useState('');
  const [rejectionTemplate, setRejectionTemplate] = useState('');

  const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSmtpConfig(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>, setTemplate: React.Dispatch<React.SetStateAction<string>>) => {
    setTemplate(e.target.value);
  };

  const handleSaveConfig = () => {
    console.log('Saving SMTP configuration:', smtpConfig);
    // Here you would typically send this data to your backend
  };

  const handleSaveTemplates = () => {
    console.log('Saving email templates:', { offerTemplate, rejectionTemplate });
    // Here you would typically send this data to your backend
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Email Configuration</h1>
      
      <div role="tablist" className="tabs tabs-lifted text-slate-950">
        <input type="radio" name="email_tabs" role="tab" className="tab" aria-label="SMTP Configuration" defaultChecked />
        <div role="tabpanel" className="tab-content border-base-300 rounded-box p-6">
          <h2 className="text-xl font-semibold mb-4">SMTP Configuration</h2>
          <form className="space-y-4">
            <div>
              <Label htmlFor="host">SMTP Host</Label>
              <Input id="host" name="host" value={smtpConfig.host} onChange={handleSmtpChange} placeholder="e.g. smtp.gmail.com" />
            </div>
            <div>
              <Label htmlFor="port">SMTP Port</Label>
              <Input id="port" name="port" value={smtpConfig.port} onChange={handleSmtpChange} placeholder="e.g. 587" />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={smtpConfig.username} onChange={handleSmtpChange} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={smtpConfig.password} onChange={handleSmtpChange} />
            </div>
            <div>
              <Label htmlFor="fromEmail">From Email</Label>
              <Input id="fromEmail" name="fromEmail" value={smtpConfig.fromEmail} onChange={handleSmtpChange} placeholder="noreply@yourcompany.com" />
            </div>
            <Button onClick={handleSaveConfig}>Save SMTP Configuration</Button>
          </form>
        </div>

        <input type="radio" name="email_tabs" role="tab" className="tab" aria-label="Email Templates" />
        <div role="tabpanel" className="tab-content border-base-300 rounded-box p-6">
          <h2 className="text-xl font-semibold mb-4">Email Templates</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="offerTemplate">Offer Email Template</Label>
              <Textarea
                id="offerTemplate"
                value={offerTemplate}
                onChange={(e) => handleTemplateChange(e, setOfferTemplate)}
                placeholder="Dear {name},&#10;&#10;We are pleased to offer you the position of..."
                className="h-40"
              />
            </div>
            <div>
              <Label htmlFor="rejectionTemplate">Rejection Email Template</Label>
              <Textarea
                id="rejectionTemplate"
                value={rejectionTemplate}
                onChange={(e) => handleTemplateChange(e, setRejectionTemplate)}
                placeholder="Dear {name},&#10;&#10;Thank you for your interest in our company..."
                className="h-40"
              />
            </div>
            <Button onClick={handleSaveTemplates}>Save Email Templates</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Email;