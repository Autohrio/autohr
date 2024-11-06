const { MongoClient } = require('mongodb');
const { QdrantClient } = require('@qdrant/js-client-rest');
const { Pinecone } = require('@pinecone-database/pinecone');
const OpenAI = require('openai');
const { 
  ATLAS_MONGODB_URI, 
  QDRANT_URL, 
  VECTOR_DB, 
  PINECONE_API_KEY, 
  OPENAI_API_KEY,
  MONGODB_DB_NAME 
} = require('../constants');

class VectorDBConnector {
  constructor() {
    this.client = null;
    this.type = VECTOR_DB || null;
    this.openai = OPENAI_API_KEY ? new OpenAI({ apiKey: OPENAI_API_KEY }) : null;
  }

  async connect() {

    if (!this.type) {
      console.log('Vector DB connection skipped - No vector database type configured');
      return false;
    }

    try {
      switch(this.type) {
        case 'mongodb':
          if (!ATLAS_MONGODB_URI) {
            throw new Error('ATLAS_MONGODB_URI is required for MongoDB vector search');
          }
          await this.connectMongoDB();
          break;
        case 'qdrant':
          if (!QDRANT_URL) {
            throw new Error('QDRANT_URL is required for Qdrant connection');
          }
          await this.connectQdrant();
          break;
        case 'pinecone':
          if (!PINECONE_API_KEY) {
            throw new Error('PINECONE_API_KEY is required for Pinecone connection');
          }
          await this.connectPinecone();
          break;
        default:
          throw new Error(`Unsupported vector database type: ${this.type}`);
      }
      console.log(`Connected to ${this.type} vector database successfully`);
    } catch (error) {
      console.error(`Failed to connect to ${this.type}:`, error);
      process.exit(1);
    }
  }

  async connectMongoDB() {
    if (!ATLAS_MONGODB_URI) {
      throw new Error('ATLAS_MONGODB_URI is not configured');
    }
    
    this.client = new MongoClient(ATLAS_MONGODB_URI);
    await this.client.connect();
    
    // Test connection
    await this.client.db().admin().ping();

    this.client.on('error', (err) => {
      console.error('Vector MongoDB connection error:', err);
    });

    this.client.on('close', () => {
      console.log('Vector MongoDB disconnected');
    });

    this.setupShutdownHandler(async () => {
      await this.client.close();
    });
  }

  async connectQdrant() {
    this.client = new QdrantClient({ url: QDRANT_URL });
    await this.client.getCollections();
    this.setupShutdownHandler();
  }

  async connectPinecone() {
    this.client = new Pinecone({ apiKey: PINECONE_API_KEY });
    this.setupShutdownHandler();
  }

  setupShutdownHandler(closeFunction = null) {
    process.on('SIGINT', async () => {
      if (closeFunction) {
        await closeFunction();
      }
      console.log(`${this.type} connection closed due to app termination`);
      process.exit(0);
    });
  }

  async createEmbedding(text) {
    const embedding = await this.openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: text,
      encoding_format: "float",
    });
    return embedding.data[0].embedding;
  }

  async createCollection(collectionName, options = {}) {
    const { dimension = 1536, indexName = 'vector_index' } = options;
    
    try {
      switch(this.type) {
        case 'pinecone':
          await this.client.createIndex({
            name: collectionName,
            dimension: dimension,
            metric: 'cosine',
            spec: {
              serverless: {
                cloud: 'aws',
                region: 'us-east-1'
              }
            }
          });
          break;
          
        case 'qdrant':
          await this.client.createCollection(collectionName, {
            vectors: {
              size: dimension,
              distance: 'Cosine'
            }
          });
          break;
          
        case 'mongodb':
          const database = this.client.db(MONGODB_DB_NAME);
          const collection = database.collection(collectionName);
          
          // Create Atlas Search index
          const searchIndex = {
            name: indexName,
            definition: {
              mappings: {
                dynamic: false,
                fields: {
                  vector: {
                    dimensions: dimension,
                    similarity: "cosine",
                    type: "knnVector"
                  },
                  text: {
                    type: "string"
                  },
                  metadata: {
                    type: "document"
                  }
                }
              }
            }
          };

          const result = await collection.createSearchIndex(searchIndex);
          console.log(`MongoDB Atlas Search index created: ${result}`);
          break;
      }
      console.log(`Collection ${collectionName} created in ${this.type}`);
    } catch (error) {
      console.error(`Failed to create collection in ${this.type}:`, error);
      throw error;
    }
  }

  async listIndexes(collectionName) {
    if (this.type === 'mongodb') {
      const database = this.client.db(MONGODB_DB_NAME);
      const collection = database.collection(collectionName);
      const indexes = await collection.listSearchIndexes().toArray();
      return indexes;
    }
    throw new Error('List indexes operation is only supported for MongoDB');
  }

  async deleteIndex(collectionName, indexName) {
    if (this.type === 'mongodb') {
      const database = this.client.db(MONGODB_DB_NAME);
      const collection = database.collection(collectionName);
      await collection.dropSearchIndex(indexName);
      console.log(`Search index ${indexName} deleted from collection ${collectionName}`);
    }
    throw new Error('Delete index operation is only supported for MongoDB');
  }

  async upsert(collectionName, vectors) {
    try {
      switch(this.type) {
        case 'pinecone': {
          const index = this.client.index(collectionName);
          await index.upsert(vectors);
          break;
        }
          
        case 'qdrant': {
          await this.client.upsert(collectionName, {
            points: vectors.map(v => ({
              id: v.id,
              vector: v.values,
              payload: v.metadata
            }))
          });
          break;
        }
          
        case 'mongodb': {
          const database = this.client.db(MONGODB_DB_NAME);
          const collection = database.collection(collectionName);
          const documents = vectors.map(v => ({
            _id: v.id,
            vector: v.values,
            ...v.metadata
          }));
          
          // Using bulkWrite for better performance with upserts
          const bulkOps = documents.map(doc => ({
            updateOne: {
              filter: { _id: doc._id },
              update: { $set: doc },
              upsert: true
            }
          }));
          
          await collection.bulkWrite(bulkOps);
          break;
        }
      }
      console.log(`Upserted ${vectors.length} vectors to ${this.type}`);
    } catch (error) {
      console.error(`Upsert failed in ${this.type}:`, error);
      throw error;
    }
  }

  async vectorSearch(collectionName, queryVector, options = {}) {
    const { limit = 5, vectorField = 'vector' } = options;

    try {
      switch(this.type) {
        case 'pinecone': {
          const index = this.client.index(collectionName);
          const results = await index.query({
            vector: queryVector,
            topK: limit,
            includeMetadata: true,
          });
          return results.matches;
        }
        
        case 'qdrant': {
          const results = await this.client.search(collectionName, {
            vector: queryVector,
            limit: limit,
          });
          return results;
        }
        
        case 'mongodb': {
          const database = this.client.db(MONGODB_DB_NAME);
          const collection = database.collection(collectionName);
          const results = await collection.aggregate([
            {
              $search: {
                index: "vector_index",
                knnBeta: {
                  vector: queryVector,
                  path: vectorField,
                  k: limit,
                }
              }
            }
          ]).toArray();
          return results;
        }
      }
    } catch (error) {
      console.error(`Vector search failed in ${this.type}:`, error);
      throw error;
    }
  }

  async deleteCollection(collectionName) {
    try {
      switch(this.type) {
        case 'pinecone':
          await this.client.deleteIndex(collectionName);
          break;
          
        case 'qdrant':
          await this.client.deleteCollection(collectionName);
          break;
          
        case 'mongodb':
          const database = this.client.db(MONGODB_DB_NAME);
          await database.dropCollection(collectionName);
          break;
      }
      console.log(`Collection ${collectionName} deleted from ${this.type}`);
    } catch (error) {
      console.error(`Failed to delete collection in ${this.type}:`, error);
      throw error;
    }
  }

  getClient() {
    return this.client;
  }

  isConfigured() {
    return Boolean(this.type);
  }
}

const vectorDB = new VectorDBConnector();

module.exports = vectorDB;