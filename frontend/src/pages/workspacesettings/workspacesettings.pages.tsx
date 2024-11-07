import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

import { useWorkspace } from '@/context/useWorkspace';
import { Trash2, Bell, Globe, Mail, MessageSquare, Check } from 'lucide-react';

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  icon: React.ReactNode;
}

const WorkspaceSettings: React.FC = () => {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([
    {
      id: 'email',
      title: 'Email Notifications',
      description: 'Receive email notifications for important updates',
      enabled: true,
      icon: <Mail className="h-4 w-4" />,
    },
    {
      id: 'browser',
      title: 'Browser Notifications',
      description: 'Show desktop notifications when browser is open',
      enabled: true,
      icon: <Globe className="h-4 w-4" />,
    },
    {
      id: 'push',
      title: 'Push Notifications',
      description: 'Receive push notifications on your devices',
      enabled: false,
      icon: <Bell className="h-4 w-4" />,
    },
    {
      id: 'chat',
      title: 'Chat Notifications',
      description: 'Get notified about new chat messages',
      enabled: true,
      icon: <MessageSquare className="h-4 w-4" />,
    },
  ]);

  const handleNotificationToggle = (settingId: string) => {
    setNotificationSettings(prev =>
      prev.map(setting =>
        setting.id === settingId
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );

    setSuccessMessage('Notification Workspace updated successfully');
    setIsSuccessDialogOpen(true);
  };

  const handleDeleteWorkspace = async () => {
    if (deleteConfirmText !== currentWorkspace?.name) {
      return;
    }

    try {
      // await deleteWorkspace(currentWorkspace.id);
      setIsDeleteDialogOpen(false);
      setSuccessMessage('Workspace deleted successfully');
      setIsSuccessDialogOpen(true);
      setTimeout(() => {
        navigate('/create-workspace');
      }, 2000);
    } catch (error) {
      console.error('Error deleting workspace:', error);
    }
  };

  return (
    <div className="container mx-auto py-10 space-y-8">
      {/* Notification Settings Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            Notification Settings
          </CardTitle>
          <CardDescription>
            Manage how you receive notifications and updates
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                {setting.icon}
                <div className="space-y-1">
                  <Label htmlFor={setting.id} className="text-sm font-medium">
                    {setting.title}
                  </Label>
                  <p className="text-sm text-gray-500">
                    {setting.description}
                  </p>
                </div>
              </div>
              <Switch
                id={setting.id}
                checked={setting.enabled}
                onCheckedChange={() => handleNotificationToggle(setting.id)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Danger Zone Section */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-red-600 flex items-center gap-2">
            <Trash2 className="h-6 w-6" />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Destructive actions that cannot be undone
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 border border-red-200 rounded-lg">
              <h3 className="text-lg font-semibold text-red-600 mb-2">
                Delete Workspace
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                This action cannot be undone. This will permanently delete the
                workspace "{currentWorkspace?.name}" and remove all associated data.
              </p>
              <Button
                variant="destructive"
                onClick={() => setIsDeleteDialogOpen(true)}
              >
                Delete Workspace
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              workspace and remove all associated data.
              <div className="mt-4">
                <Label htmlFor="confirmDelete">
                  Please type <span className="font-semibold">{currentWorkspace?.name}</span> to confirm
                </Label>
                <input
                  id="confirmDelete"
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="mt-2 w-full p-2 border rounded-md"
                  placeholder="Enter workspace name"
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteConfirmText('')}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWorkspace}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete Workspace
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Success Dialog */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-6 w-6 text-green-500" />
              Success
            </DialogTitle>
            <DialogDescription>
              {successMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsSuccessDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WorkspaceSettings;