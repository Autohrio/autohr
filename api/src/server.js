const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const routes = require('../routes/routes');
require('dotenv').config();
const app = express();
const connectToMongoDB = require('../connectors/mongodb');
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

connectToMongoDB()

// health check
app.get('/healthz', (req, res) => {
  res
    .status(200)
    .json({
      message: "healthy",
      version: "v0.1.0"
    });
});

app.use('/api', routes);

const PORT = process.env.SERVER_PORT || SERVER_PORT;
app.listen(PORT, () => {
  console.log(`Autohr Server is running on port http://localhost:${PORT}`);
  console.log(`Health check http://localhost:${PORT}/healthz`);
});