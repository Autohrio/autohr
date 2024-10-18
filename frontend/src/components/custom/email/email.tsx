import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useWorkspace } from '@/context/useWorkspace'; // Update the import path as needed
import { getEmailConfiguration, updateEmailConfiguration, EmailConfiguration } from '@/api'; // Update the import path as needed

const Email: React.FC = () => {
  const { currentWorkspace } = useWorkspace();
  const [emailConfig, setEmailConfig] = useState<EmailConfiguration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEmailConfig = async () => {
      if (!currentWorkspace) return;
      try {
        const config = await getEmailConfiguration(currentWorkspace._id);
        setEmailConfig(config);
      } catch (err) {
        setError('Failed to fetch email configuration');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEmailConfig();
  }, [currentWorkspace]);

  const handleSmtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEmailConfig(prev => prev ? {
      ...prev,
      smtp_config: {
        ...prev.smtp_config,
        [name]: value
      }
    } : null);
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLTextAreaElement>, templateName: 'offer_template' | 'rejection_template') => {
    setEmailConfig(prev => prev ? {
      ...prev,
      templates: {
        ...prev.templates,
        [templateName]: e.target.value
      }
    } : null);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (!currentWorkspace || !emailConfig) return;
    try {
      await updateEmailConfiguration(currentWorkspace._id, {
        smtp_config: emailConfig.smtp_config
      });
      console.log('SMTP configuration saved successfully');
    } catch (err) {
      console.error('Failed to save SMTP configuration:', err);
    }
  };

  const handleSaveTemplates = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
    if (!currentWorkspace || !emailConfig) return;
    try {
      await updateEmailConfiguration(currentWorkspace._id, {
        templates: emailConfig.templates
      });
      console.log('Email templates saved successfully');
    } catch (err) {
      console.error('Failed to save email templates:', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!emailConfig) return <div>No email configuration found</div>;

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
              <Input id="host" name="host" value={emailConfig.smtp_config.host} onChange={handleSmtpChange} placeholder="e.g. smtp.gmail.com" />
            </div>
            <div>
              <Label htmlFor="port">SMTP Port</Label>
              <Input id="port" name="port" value={emailConfig.smtp_config.port} onChange={handleSmtpChange} placeholder="e.g. 587" />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" value={emailConfig.smtp_config.username} onChange={handleSmtpChange} />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" value={emailConfig.smtp_config.password} onChange={handleSmtpChange} />
            </div>
            <div>
              <Label htmlFor="fromEmail">From Email</Label>
              <Input id="fromEmail" name="fromEmail" value={emailConfig.smtp_config.fromEmail} onChange={handleSmtpChange} placeholder="noreply@yourcompany.com" />
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
                value={emailConfig.templates.offer_template}
                onChange={(e) => handleTemplateChange(e, 'offer_template')}
                placeholder="Dear {name},&#10;&#10;We are pleased to offer you the position of..."
                className="h-40"
              />
            </div>
            <div>
              <Label htmlFor="rejectionTemplate">Rejection Email Template</Label>
              <Textarea
                id="rejectionTemplate"
                value={emailConfig.templates.rejection_template}
                onChange={(e) => handleTemplateChange(e, 'rejection_template')}
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