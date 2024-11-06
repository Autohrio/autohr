// helper/loadChunks.js
const fs = require('fs').promises;

const loadAndChunkText = async (input, content_type = 'string', chunkSize = 400) => {
  try {
    // Get content based on content_type
    const content = content_type === 'file' 
      ? await fs.readFile(input, 'utf8')
      : input;
    
    console.log(`content loaded from ${content_type}`);
    
    const lines = content.split('\n');
    const chunks = [];
    let currentChunk = '';
    
    for (const line of lines) {
      if (currentChunk.length + line.length > chunkSize) {
        chunks.push(currentChunk);
        currentChunk = line;
      } else {
        currentChunk += (currentChunk ? '\n' : '') + line;
      }
    }
    
    if (currentChunk) chunks.push(currentChunk);
    return chunks;
    
  } catch (error) {
    console.error(`Error processing ${content_type}:`, error.message);
    throw error;
  }
};

module.exports = { loadAndChunkText };