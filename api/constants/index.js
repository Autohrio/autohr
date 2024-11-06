require('dotenv').config();

module.exports = {
  // Local MongoDB (for Mongoose)
  AUTOHR_MONGODB_URI: process.env.AUTOHR_MONGODB_URI,
  AUTOHR_DB_NAME: process.env.AUTOHR_DB_NAME,
  
  // Atlas MongoDB (for vector search)
  ATLAS_MONGODB_URI: process.env.ATLAS_MONGODB_URI,
  MONGODB_DB_NAME: process.env.MONGODB_DB_NAME,
  
  // Vector DB Configuration
  VECTOR_DB: process.env.VECTOR_DB,
  QDRANT_URL: process.env.QDRANT_URL,
  PINECONE_API_KEY: process.env.PINECONE_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // Server Configuration
  SERVER_PORT: process.env.SERVER_PORT || 7654,
  ENVIRONMENT: process.env.ENVIRONMENT || 'development'
};