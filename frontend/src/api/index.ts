// api.ts
const API_BASE_URL = 'http://localhost:7654/api';

export interface UserData {
  _id: string;
  name: string;
  email: string;
  username: string;
  urls: string[];
  workspaces: string[];
}

export interface Workspace {
  id: string;
  name: string;
  // owner_email: string;
}

export const checkUserEmailAlreadyExists = async (email: string): Promise<UserData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return 'message' in data && data.message === "User not found" ? null : data as UserData;
  } catch (error) {
    console.error('Error checking user existence:', error);
    throw error;
  }
};

export const registerUser = async (name: string, email: string, username: string): Promise<UserData> => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, username }),
    });
    if (!response.ok) {
      throw new Error('Registration failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error registering user:', error);
    throw error;
  }
};

export const getAllWorkspaces = async (owner_email: string | undefined): Promise<Workspace[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workspaces/owner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ owner_email: owner_email }),
    });
    if (!response.ok) {
      throw new Error('Loading Workspace failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting workspaces:', error);
    throw error;
  }
};

export const createWorkspace = async (name: string, owner_email: string | undefined): Promise<Workspace> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workspaces`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name, 
        owner_email: owner_email 
      }),
    });
    if (!response.ok) {
      throw new Error('Workspace creation failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating workspaces:', error);
    throw error;
  }
};