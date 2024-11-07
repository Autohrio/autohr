export type AgentType = 'hr' | 'supervisor';

export interface StreamMessage {
  id: string;
  date: string;
  message_type: 'start' | 'function_call' | 'function_return' | 'status' | 'completion' | 'error';
  content?: string;
  function_call?: {
    name: string;
    arguments: string;
    function_call_id: string;
  };
  function_return?: string;
  error?: string;
  details?: string;
}


export const API_BASE_URL = '/api';

export const sendHRStreamMessage = async (
  messageText: string,
  conversationHistory: any[] = [],
  onMessage: (text: string) => void,
  onDone: () => void,
  workspace_id: string,
  user_id: string,
) => {
  try {
    const payload = {
      message: messageText,
      conversation_history: conversationHistory,
      workspace_id: workspace_id, 
      user_id: user_id 
    };

    console.log(payload)

    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
      },
      credentials: 'include',
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      
      if (done) {
        onDone();
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (line.trim() === '') continue;
        if (!line.startsWith('data: ')) continue;

        const data = line.slice(6);
        if (data === '[DONE]' || data === '[ERROR]') {
          onDone();
          continue;
        }
        if (data === '[DONE_STEP]' || data === '[DONE_GEN]') continue;

        try {
          const parsedData = JSON.parse(data) as StreamMessage;
          
          switch (parsedData.message_type) {
            case 'function_return':
              if (parsedData.function_return) {
                onMessage(parsedData.function_return);
              }
              break;
            case 'error':
              console.error('Stream error:', parsedData.error);
              if (parsedData.error) {
                onMessage(`Error: ${parsedData.error}`);
              }
              break;
          }
        } catch (e) {
          console.error('Error parsing stream data:', e);
        }
      }
    }
  } catch (error) {
    console.error('Error sending message:', error);
    onDone();
    throw error;
  }
};