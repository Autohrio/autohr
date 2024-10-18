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

// Workspace and User APIs.
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

// Team APIs
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

export const removeTeamMember = async (teamId: string, memberId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/teams/${teamId}/members/${memberId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove team member');
    }
  } catch (error) {
    console.error('Error removing team member:', error);
    throw error;
  }
};

// Onboarding APIs
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

export const removeCandidate = async (workspaceId: string, candidateId: string): Promise<void> => {
  try {

    const response = await fetch(`${API_BASE_URL}/workspace/${workspaceId}/candidates/${candidateId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to remove candidate');
    }
  }catch(error){
    console.error('Error deleting candidates:', error);
    throw error;
  }
};

export const patchCandidate = async (workspaceId: string, candidateId: string, updateData: Partial<Candidate>): Promise<Candidate> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workspace/${workspaceId}/candidates/${candidateId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update candidate');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating candidate:', error);
    throw error;
  }
};

// Email Configuration APIs.
export interface SMTPConfig {
  host: string;
  port: string;
  username: string;
  password: string;
  fromEmail: string;
}

export interface EmailTemplates {
  offer_template: string;
  rejection_template: string;
}

export interface EmailConfiguration {
  _id: string;
  workspace: string;
  smtp_config: SMTPConfig;
  templates: EmailTemplates;
}

export const getEmailConfiguration = async (workspaceId: string): Promise<EmailConfiguration> => {
  try {
    const response = await fetch(`${API_BASE_URL}/emails/${workspaceId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch email configuration');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching email configuration:', error);
    throw error;
  }
};

export const updateEmailConfiguration = async (
  workspaceId: string, 
  updates: Partial<{smtp_config: Partial<SMTPConfig>, templates: Partial<EmailTemplates>}>
): Promise<EmailConfiguration> => {
  try {
    const response = await fetch(`${API_BASE_URL}/emails/${workspaceId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error('Failed to update email configuration');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating email configuration:', error);
    throw error;
  }
};

// Policies APIs
export interface Policy {
  _id: string;
  content: string;
}

export const getPolicy = async (workspaceId: string): Promise<Policy | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/policies`);
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch policy');
    }
    const policies = await response.json();
    return policies.length > 0 ? policies[0] : null;
  } catch (error) {
    console.error('Error fetching policy:', error);
    throw error;
  }
};

export const createPolicy = async (workspaceId: string, content: string): Promise<Policy> => {
  try {
    const response = await fetch(`${API_BASE_URL}/policies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workspaceId, content }),
    });
    if (!response.ok) {
      throw new Error('Failed to create policy');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating policy:', error);
    throw error;
  }
};

export const updatePolicy = async (policyId: string, content: string): Promise<Policy> => {
  try {
    const response = await fetch(`${API_BASE_URL}/policies/${policyId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Failed to update policy');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating policy:', error);
    throw error;
  }
};

// Compliances APIs
export interface Compliance {
  _id: string;
  content: string;
}

export const getCompliance = async (workspaceId: string): Promise<Compliance | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/compliances`);
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No compliance found
      }
      throw new Error('Failed to fetch compliance');
    }
    const compliances = await response.json();
    return compliances.length > 0 ? compliances[0] : null;
  } catch (error) {
    console.error('Error fetching compliance:', error);
    throw error;
  }
};

export const createCompliance = async (workspaceId: string, content: string): Promise<Compliance> => {
  try {
    const response = await fetch(`${API_BASE_URL}/compliances`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workspaceId, content }),
    });
    if (!response.ok) {
      throw new Error('Failed to create compliance');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating compliance:', error);
    throw error;
  }
};

export const updateCompliance = async (complianceId: string, content: string): Promise<Compliance> => {
  try {
    const response = await fetch(`${API_BASE_URL}/compliances/${complianceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });
    if (!response.ok) {
      throw new Error('Failed to update compliance');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating compliance:', error);
    throw error;
  }
};

// APIKeys APIs

export interface ApiKey {
  _id: string;
  name: string;
  api_key: string;
  created_at: string;
}

// Function to create a new API key
export const createApiKey = async (workspaceId: string, name: string): Promise<ApiKey> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-keys`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ workspaceId, name }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating API key:', error);
    throw error;
  }
};

// Function to delete an API key
export const deleteApiKey = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api-keys/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting API key:', error);
    throw error;
  }
};

// Function to get API keys for a specific workspace
export const getApiKeysByWorkspace = async (workspaceId: string): Promise<ApiKey[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/api-keys`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching API keys for workspace:', error);
    throw error;
  }
};