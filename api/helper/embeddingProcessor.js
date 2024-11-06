// helper/embeddingProcessor.js

const fs = require('fs');
const path = require('path');
const { loadAndChunkText } = require('./loadChunks');
const vectorDB = require('../connectors/vector-connectors');

async function embeddingProcessor(input, options = {}) {
  const {
    content_type = 'string',
    collection_name = 'embeddings',
    cache_vectors = true,
    vector_cache_path = path.join(__dirname, 'vectors.json'),
    chunk_size = 400
  } = options;

  try {
    // 1. Load and chunk the text
    console.log("📚 Chunking text...");
    const chunks = await loadAndChunkText(input, content_type, chunk_size);
    
    if (!chunks.length) {
      throw new Error("No chunks were generated from the input");
    }
    console.log(`✅ Generated ${chunks.length} text chunks`);

    // 2. Initialize vectors array
    let vectors = [];
    
    // 3. Check cache if enabled
    if (cache_vectors) {
      try {

        const cacheExists = await fs.access(vector_cache_path)
          .then(() => true)
          .catch(() => false);

        if (cacheExists) {
          const cachedContent = fs.readFile(vector_cache_path, 'utf8');
          if (cachedContent && cachedContent.trim() !== '[]') {
            vectors = JSON.parse(cachedContent);
            console.log("✅ Loaded vectors from cache");
          }
        }
      } catch (err) {
        console.log("ℹ️ No valid cache found, will create new embeddings");
      }
    }

    // 4. Generate embeddings if needed
    if (vectors.length === 0) {
      console.log("🔄 Creating embeddings...");
      
      vectors = await Promise.all(chunks.map(async (chunk, index) => {
        const embedding = await vectorDB.createEmbedding(chunk);
        return {
          id: `text_${Date.now()}_${index}`,
          values: embedding,
          metadata: { 
            text: chunk,
            chunk_index: index,
            total_chunks: chunks.length,
            created_at: new Date().toISOString()
          }
        };
      }));

      if (!vectors.length) {
        throw new Error("Failed to generate embeddings");
      }
      console.log(`✅ Created ${vectors.length} embeddings`);

      // Cache if enabled
      if (cache_vectors) {
        try {
          fs.writeFile(
            vector_cache_path, 
            JSON.stringify(vectors, null, 2)
          );
          console.log("✅ Cached vectors");
        } catch (err) {
          console.warn("⚠️ Failed to cache vectors:", err.message);
        }
      }
    }

    // 5. Ensure collection exists and upsert
    try {
      await vectorDB.createCollection(collection_name);
      console.log(`✅ Ensured collection ${collection_name} exists`);
      
      // upserting to vector db.
      await vectorDB.upsert(collection_name, vectors);
      console.log(`✅ Upserted ${vectors.length} vectors to ${vectorDB.type}`);
    } catch (err) {
      console.error(`❌ Failed to upsert to vector database:`, err);
      throw err;
    }

    return {
      success: true,
      chunks_processed: chunks.length,
      vectors_created: vectors.length,
      collection: collection_name,
      database_type: vectorDB.type
    };

  } catch (error) {
    console.error("❌ Embedding process failed:", error);
    throw error;
  }
}

module.exports = { embeddingProcessor };