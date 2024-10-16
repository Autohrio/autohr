import React, { createContext, useContext, useState, useEffect } from 'react';
import { checkUserEmailAlreadyExists, UserData } from '@/api';
import { useAuth } from './useAuth';

interface UserContextType {
  user: UserData | null;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
  loadUser: (email: string) => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const { session } = useAuth();

  const loadUser = async (email: string) => {
    try {
      const userData = await checkUserEmailAlreadyExists(email);
      if (userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  useEffect(() => {
    if (session?.user?.email) {
      loadUser(session.user.email);
    }
  }, [session]);

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      loadUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};