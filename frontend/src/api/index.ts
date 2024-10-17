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
  _id: string;
  name: string;
  owner_email: string;
  teams: string[];
  onboardings: string[];
  policies: string[];
  compliances: string[];
  meetings: string[];
  emails: string[];
  apiKeys: string[];
  employeeFeedbacks: string[];
  companyFeedbacks: string[];
}

export interface TeamMember {
  _id: string;
  name: string;
  email: string;
  role: string;
  occupation?: string;
  teams: { _id: string; name: string }[];
}

export interface AddMemberData {
  name: string;
  email: string;
  role: string;
  occupation?: string;
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

export const getTeamMembersByWorkspace = async (workspaceId: string): Promise<TeamMember[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workspace/${workspaceId}/members`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch team members');
    }
    const data = await response.json();
    return data.members;
  } catch (error) {
    console.error('Error fetching team members:', error);
    throw error;
  }
};




export const addMemberToTeam = async (teamId: string, memberData: AddMemberData): Promise<TeamMember> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });
    if (!response.ok) {
      throw new Error('Failed to add team member');
    }
    const data = await response.json();
    return data.members;
  } catch (error) {
    console.error('Error adding team member:', error);
    throw error;
  }
};

export interface Candidate {
  _id?: string;
  name: string;
  email: string;
  interview_status: string;
  position: string;
  workspaceId: string;
}

export const addCandidate = async (candidateData: Omit<Candidate, '_id'>): Promise<Candidate> => {
  try {
    const response = await fetch(`${API_BASE_URL}/candidates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(candidateData),
    });
    if (!response.ok) {
      throw new Error('Failed to add candidate');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding candidate:', error);
    throw error;
  }
};

export const getCandidatesByWorkspace = async (workspaceId: string): Promise<Candidate[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workspace/${workspaceId}/candidates`);
    if (!response.ok) {
      throw new Error('Failed to fetch candidates');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching candidates:', error);
    throw error;
  }
};