// backend/config/config.cjs
// This file is specifically for sequelize-cli to know how to connect to your DB.

// Load environment variables here, ensure it's at the very top for CLI access
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  },
};
