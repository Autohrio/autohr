// controllers/chat.controller.js

const { v4: uuidv4 } = require('uuid');
const ChatCompletion = require('../../helper/chatCompletion');
const { updateChatContext } = require('../../helper/teamContext');

const chatCompletion = new ChatCompletion({
  collection_name: 'hr_policies',
  top_k: 3,
  temperature: 0.0,
  system_prompt: "You are a friendly HR assistant. Answer questions based on the context provided."
});

exports.sendHrMessageStream = async (req, res) => {
  const { 
    message, 
    conversation_history = [],
    workspace_id,
    user_id 
  } = req.body;

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // Get team member context
    const { systemMessage, context: teamContext } = await updateChatContext(
      workspace_id,
      message,
      user_id
    );

    // Get policy context from vector DB
    const policyContext = await chatCompletion.getContextFromVectorDB(message);

    // Initial stream message
    const startMessage = {
      id: `message-${uuidv4()}`,
      date: new Date().toISOString(),
      message_type: "start",
      content: "Starting to process your request..."
    };
    res.write(`data: ${JSON.stringify(startMessage)}\n\n`);

    // Function call message
    const functionCallId = `call_${uuidv4()}`;
    const functionCallMessage = {
      id: `message-${uuidv4()}`,
      date: new Date().toISOString(),
      message_type: "function_call",
      function_call: {
        name: "process_chat",
        arguments: JSON.stringify({ message }),
        function_call_id: functionCallId
      }
    };
    res.write(`data: ${JSON.stringify(functionCallMessage)}\n\n`);

    // Prepare messages array with both contexts
    const messages = [
      { 
        role: "system", 
        content: systemMessage 
      },
      ...conversation_history,
      { 
        role: "user", 
        content: message 
      },
      { 
        role: "system", 
        content: `Team Context: ${JSON.stringify(teamContext, null, 2)}
Policy Context: ${policyContext}` 
      }
    ];

    // Send thinking message
    const thinkingMessage = {
      id: `message-${uuidv4()}`,
      date: new Date().toISOString(),
      message_type: "status",
      content: "Processing information..."
    };
    res.write(`data: ${JSON.stringify(thinkingMessage)}\n\n`);
    res.write('data: [DONE_GEN]\n\n');

    // Get chat completion
    const completion = await chatCompletion.vectorDB.openai.chat.completions.create({
      model: chatCompletion.options.model,
      messages,
      temperature: chatCompletion.options.temperature,
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

    // Final success message
    const completionMessage = {
      id: `message-${uuidv4()}`,
      date: new Date().toISOString(),
      message_type: "completion",
      content: "Response generated successfully"
    };
    res.write(`data: ${JSON.stringify(completionMessage)}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();

    return {
      success: true,
      message: chatCompletion.createMessage({
        role: 'assistant',
        content: assistantResponse
      })
    };

  } catch (error) {
    console.error('Stream error:', error);
    const errorMessage = {
      id: `message-${uuidv4()}`,
      date: new Date().toISOString(),
      message_type: "error",
      error: error.message,
      details: error.stack
    };
    res.write(`data: ${JSON.stringify(errorMessage)}\n\n`);
    res.write('data: [ERROR]\n\n');
    res.end();
  }
};

exports.sendHrMessage = async (req, res) => {
  const { 
    message, 
    conversation_history = [],
    workspace_id,
    user_id 
  } = req.body;

  try {
    // Get team member context
    const { systemMessage, context: teamContext } = await updateChatContext(
      workspace_id,
      message,
      user_id
    );

    // Get policy context from vector DB
    const policyContext = await chatCompletion.getContextFromVectorDB(message);

    // Prepare messages array
    const messages = [
      { 
        role: "system", 
        content: systemMessage 
      },
      ...conversation_history,
      { 
        role: "user", 
        content: message 
      },
      { 
        role: "system", 
        content: `Team Context: ${JSON.stringify(teamContext, null, 2)}
Policy Context: ${policyContext}` 
      }
    ];

    // Get chat completion
    const completion = await chatCompletion.vectorDB.openai.chat.completions.create({
      model: chatCompletion.options.model,
      messages,
      temperature: chatCompletion.options.temperature,
    });

    const assistantResponse = completion.choices[0].message.content;

    res.json({
      success: true,
      message: chatCompletion.createMessage({
        role: 'assistant',
        content: assistantResponse
      })
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: error.stack
    });
  }
};
