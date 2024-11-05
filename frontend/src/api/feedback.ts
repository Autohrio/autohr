import { ICompanyFeedback } from "@/types";

const API_BASE_URL = 'http://localhost:7654/api';

export const createCompanyFeedback = async (workspaceId: string, from_employee: string, feedback: string): Promise<ICompanyFeedback> => {
  try {
    const response = await fetch(`${API_BASE_URL}/company-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        workspaceId,
        from_employee,
        feedback,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: ICompanyFeedback =  await response.json();
    return data;
  } catch (error) {
    console.error('Error sending company feedback:', error);
    throw error;
  }
};

export type AnonymizedFeedback = Omit<ICompanyFeedback, 'from_employee'>

export const getAnonymizedCompanyFeedback = async (workspaceId: string): Promise<AnonymizedFeedback[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/anonymized-company-feedback`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AnonymizedFeedback[] =  await response.json();
    return data;
  } catch (error) {
    console.error('Error sending company feedback:', error);
    throw error;
  }
};

export const createEmployeeFeedback = async (workspaceId: string): Promise<AnonymizedFeedback[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/anonymized-company-feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({})
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: AnonymizedFeedback[] =  await response.json();
    return data;
  } catch (error) {
    console.error('Error sending company feedback:', error);
    throw error;
  }
};