// helper/chatCompletion.js

const { v4: uuidv4 } = require('uuid');
const vectorDB = require('../connectors/vector-connectors');

class ChatCompletion {
  constructor(options = {}) {
    this.vectorDB = vectorDB;
    this.defaultOptions = {
      collection_name: 'embeddings',
      top_k: 3,
      temperature: 0.0,
      model: "gpt-3.5-turbo",
      system_prompt: "You are a helpful assistant. Answer questions based on the context provided."
    };
    this.options = { ...this.defaultOptions, ...options };
  }

  async getContextFromVectorDB(query, options = {}) {
    try {
      // Create embedding for the query
      const queryEmbedding = await this.vectorDB.createEmbedding(query);
      
      // Search vector database with merged options
      const searchOptions = {
        limit: this.options.top_k,
        ...options
      };

      const results = await this.vectorDB.vectorSearch(
        this.options.collection_name,
        queryEmbedding,
        searchOptions
      );

      // Extract and join relevant texts
      const relevantTexts = results.map(result => 
        result.metadata?.text || result.text || ''
      );

      return relevantTexts.join('\n\n');
    } catch (error) {
      console.error('Error getting context from vector DB:', error);
      return '';
    }
  }

  async generateStreamResponse(messages, res) {
    try {
      // Initial response
      res.write('data: [DONE_GEN]\n\n');

      // Function call message
      const functionCallId = `call_${uuidv4()}`;
      const functionCallMessage = {
        id: `message-${uuidv4()}`,
        date: new Date().toISOString(),
        message_type: "function_call",
        function_call: {
          name: "process_chat",
          arguments: JSON.stringify({ messages }),
          function_call_id: functionCallId
        }
      };
      res.write(`data: ${JSON.stringify(functionCallMessage)}\n\n`);

      // Get chat completion
      const completion = await this.vectorDB.openai.chat.completions.create({
        model: this.options.model,
        messages,
        temperature: this.options.temperature,
      });

      const assistantResponse = completion.choices[0].message.content;

      // Function return message
      const functionReturnMessage = {
        id: `message-${uuidv4()}`,
        date: new Date().toISOString(),
        message_type: "function_return",
        function_return: assistantResponse,
        status: "success",
        function_call_id: functionCallId
      };
      res.write(`data: ${JSON.stringify(functionReturnMessage)}\n\n`);

      // Completion messages
      res.write('data: [DONE_STEP]\n\n');
      res.write('data: [DONE]\n\n');

      return assistantResponse;
    } catch (error) {
      console.error('Stream generation error:', error);
      const errorMessage = {
        id: `message-${uuidv4()}`,
        date: new Date().toISOString(),
        message_type: "error",
        error: error.message
      };
      res.write(`data: ${JSON.stringify(errorMessage)}\n\n`);
      res.write('data: [ERROR]\n\n');
      throw error;
    }
  }

  async generateChatCompletion(messages) {
    try {
      const completion = await this.vectorDB.openai.chat.completions.create({
        model: this.options.model,
        messages,
        temperature: this.options.temperature,
      });

      return completion.choices[0].message.content;
    } catch (error) {
      console.error('Chat completion error:', error);
      throw error;
    }
  }

  createMessage({ role, content }) {
    return {
      id: `message-${uuidv4()}`,
      date: new Date().toISOString(),
      role,
      content
    };
  }

  parseStreamedMessage(line) {
    try {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        
        if (data === '[DONE]' || data === '[DONE_GEN]' || data === '[DONE_STEP]') {
          return { type: 'status', status: data };
        }
        
        return {
          type: 'message',
          data: JSON.parse(data)
        };
      }
      return null;
    } catch (error) {
      console.error('Error parsing streamed message:', error);
      return null;
    }
  }

  // Helper method to format vector search results
  formatVectorResults(results) {
    return results.map(result => ({
      text: result.metadata?.text || result.text,
      score: result.score || result.similarity,
      metadata: result.metadata || {}
    }));
  }

  // Helper method to validate messages array
  validateMessages(messages) {
    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array');
    }

    const validRoles = ['system', 'user', 'assistant'];
    const isValid = messages.every(message => 
      message.role && 
      validRoles.includes(message.role) && 
      typeof message.content === 'string'
    );

    if (!isValid) {
      throw new Error('Invalid message format. Each message must have a valid role and content.');
    }

    return true;
  }

  // Method to build conversation context
  buildConversationContext(messages, context) {
    return [
      { 
        role: "system", 
        content: this.options.system_prompt 
      },
      ...messages,
      { 
        role: "system", 
        content: `Context: ${context}` 
      }
    ];
  }

  // Method to handle rate limiting and retries
  async withRetry(operation, maxRetries = 3, delay = 1000) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        if (error.response?.status === 429 && attempt < maxRetries) { // Rate limit error
          await new Promise(resolve => setTimeout(resolve, delay * attempt));
          continue;
        }
        throw error;
      }
    }
  }
}

module.exports = ChatCompletion;