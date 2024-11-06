const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('../routes/routes');
require('dotenv').config();
const app = express();
const connectToMongoDB = require('../connectors/mongodb');
const vectorDB = require('../connectors/vector-connectors');
const { SERVER_PORT } = require('../constants');

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Cache control middleware
const noCacheMiddleware = (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  next();
};
app.use(noCacheMiddleware);

// Track database connection states
const dbStatus = {
  mongodb: false,
  vectorDB: false
};

// Connect to MongoDB (required)
connectToMongoDB()
  .then(() => {
    dbStatus.mongodb = true;
    console.log('MongoDB(Mongoose) connected successfully');
  })
  .catch((error) => {
    dbStatus.mongodb = false;
    console.error('MongoDB(Mongoose) connection failed:', error);
    // Exit if primary database fails to connect
    process.exit(1);
  });

// Connect to Vector Database (optional)
if (vectorDB.isConfigured()) {
  vectorDB.connect()
    .then((connected) => {
      dbStatus.vectorDB = connected;
      if (connected) {
        console.log(`Vector DB (${vectorDB.type}) connected successfully`);
      }
    })
    .catch(() => {
      dbStatus.vectorDB = false;
      console.warn('Vector search functionality will be unavailable');
    });
} else {
  console.log('Vector DB not configured - skipping connection');
}


// Health check endpoint
app.get('/healthz', (req, res) => {
  const status = {
    status: dbStatus.mongodb ? "healthy" : "unhealthy",
    version: "v0.1.0",
    timestamp: new Date().toISOString(),
    services: {
      mongodb: {
        connected: dbStatus.mongodb,
        type: 'primary database'
      },
      vectorDB: {
        connected: dbStatus.vectorDB,
        type: vectorDB.type,
        optional: true
      }
    }
  };
  
  res.status(dbStatus.mongodb ? 200 : 503).json(status);
});

// Vector DB specific health check
app.get('/healthz/vector-db', async (req, res) => {
  try {
    const client = vectorDB.getClient();
    const status = {
      status: dbStatus.vectorDB ? "healthy" : "unhealthy",
      type: vectorDB.type,
      timestamp: new Date().toISOString(),
      optional: true
    };

    // Add database-specific checks only if connected
    if (dbStatus.vectorDB && client) {
      switch(vectorDB.type) {
        case 'mongodb':
          await client.db().admin().ping();
          status.details = "MongoDB vector search is operational";
          break;
        
        case 'pinecone':
          const indexes = await client.listIndexes();
          status.details = {
            message: "Pinecone is operational",
            indexes: indexes.indexes.map(idx => idx.name)
          };
          break;
        
        case 'qdrant':
          const collections = await client.getCollections();
          status.details = {
            message: "Qdrant is operational",
            collections: collections.map(col => col.name)
          };
          break;
      }
    } else {
      status.details = "Vector database is not connected";
    }

    // Always return 200 since vector DB is optional
    res.status(200).json(status);
  } catch (error) {
    res.status(200).json({
      status: "unhealthy",
      type: vectorDB.type,
      optional: true,
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.SERVER_PORT || SERVER_PORT;
app.listen(PORT, () => {
  console.log(`Autohr Server is running on port http://localhost:${PORT}`);
  console.log(`Health check http://localhost:${PORT}/healthz`);
  console.log(`Vector DB health check http://localhost:${PORT}/healthz/vector-db`);
});