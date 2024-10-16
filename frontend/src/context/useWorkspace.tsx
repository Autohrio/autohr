import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Workspace, 
  createWorkspace, 
  getAllWorkspaces
} from '@/api';
import { useUser } from './useUser';
import { useAuth } from './useAuth';

interface WorkspaceContextType {
  currentWorkspace: Workspace | null;
  setCurrentWorkspace: React.Dispatch<React.SetStateAction<Workspace | null>>;
  workspaces: Workspace[];
  setWorkspaces: React.Dispatch<React.SetStateAction<Workspace[]>>;
  loadWorkspaces: () => Promise<void>;
  addWorkspace: (name: string) => Promise<void>;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentWorkspace, setCurrentWorkspace] = useState<Workspace | null>(null);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const { user } = useUser();
  const { session } = useAuth();

  const loadWorkspaces = async () => {
    if (user?.email) {
      try {
        const userWorkspaces = await getAllWorkspaces(user.email);
        setWorkspaces(userWorkspaces);
        if (userWorkspaces.length > 0 && !currentWorkspace) {
          setCurrentWorkspace(userWorkspaces[0]);
        }
      } catch (error) {
        console.error('Error loading workspaces:', error);
      }
    }
  };

  const addWorkspace = async (name: string) => {
    if (user?.email) {
      try {
        const newWorkspace = await createWorkspace(name, user.email);
        setWorkspaces([...workspaces, newWorkspace]);
        if (!currentWorkspace) {
          setCurrentWorkspace(newWorkspace);
        }
      } catch (error) {
        console.error('Error creating workspace:', error);
      }
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      loadWorkspaces();
    }
  }, [session, user]);

  return (
    <WorkspaceContext.Provider value={{
      currentWorkspace,
      setCurrentWorkspace,
      workspaces,
      setWorkspaces,
      loadWorkspaces,
      addWorkspace
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (context === undefined) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
};