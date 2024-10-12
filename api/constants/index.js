require('dotenv').config();

module.exports = {
  SERVER_PORT: 7654,
  ENVIRONMENT: process.env.ENVIRONMENT,
  AUTOHR_MONGODB_URI: process.env.AUTOHR_MONGODB_URI,
  AUTOHR_DB_NAME: process.env.AUTOHR_DB_NAME,
  AUTOHR_DB_PORT: process.env.AUTOHR_DB_PORT,
  AUTOHR_DB_USERNAME: process.env.AUTOHR_DB_USERNAME,
  AUTOHR_DB_PASSWORD: process.env.AUTOHR_DB_PASSWORD,
}