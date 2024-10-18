import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Trash2, Copy, Check } from "lucide-react";
import { createApiKey, deleteApiKey, getApiKeysByWorkspace, ApiKey } from '@/api';
import { useWorkspace } from '@/context/useWorkspace';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const Configure: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const { currentWorkspace } = useWorkspace();

  useEffect(() => {
    if (currentWorkspace) {
      fetchApiKeys();
    }
  }, [currentWorkspace]);

  const fetchApiKeys = async () => {
    try {
      if (currentWorkspace) {
        const keys = await getApiKeysByWorkspace(currentWorkspace._id);
        setApiKeys(keys);
      }
    } catch (error) {
      console.error('Error fetching API keys:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleCreateApiKey = async () => {
    if (newKeyName.trim() === "") return;

    try {
      if (currentWorkspace) {
        const newKey = await createApiKey(currentWorkspace._id, newKeyName);
        setApiKeys([...apiKeys, newKey]);
        setNewKeyName("");
      }
    } catch (error) {
      console.error('Error creating API key:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleDeleteApiKey = async (id: string) => {
    try {
      await deleteApiKey(id);
      setApiKeys(apiKeys.filter(key => key._id !== id));
    } catch (error) {
      console.error('Error deleting API key:', error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  const handleCopyApiKey = (apiKey: string, id: string) => {
    navigator.clipboard.writeText(apiKey).then(() => {
      setCopiedKeyId(id);
      setTimeout(() => setCopiedKeyId(null), 2000); // Reset after 2 seconds
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage API Keys</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <Plus className="mr-2 h-4 w-4" /> Create New API Key
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
          </DialogHeader>
          <div className="my-4">
            <Input
              placeholder="Enter API Key Name"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button onClick={handleCreateApiKey}>Create</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>API Key</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeys.map((apiKey) => (
            <TableRow key={apiKey._id}>
                <TableCell>{apiKey.name}</TableCell>
              <TableCell className="flex items-center space-x-2">
                <span>{apiKey?.api_key}</span>
                {apiKey.api_key && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopyApiKey(apiKey.api_key, apiKey._id)}
                        >
                          {copiedKeyId === apiKey._id ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{copiedKeyId === apiKey._id ? 'Copied!' : 'Copy API Key'}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </TableCell>
              <TableCell>{new Date(apiKey.created_at).toLocaleString()}</TableCell>
              <TableCell>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the API key.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteApiKey(apiKey._id)}>
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Configure;