// backend/config/db.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config(); // <--- Make sure this line is present here

// Initialize Sequelize with database connection details
const sequelize = new Sequelize(
  process.env.DB_NAME,      // Database name
  process.env.DB_USER,      // Username
  process.env.DB_PASSWORD,  // Password
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: process.env.DB_DIALECT || 'mysql', // fallback for safety
    logging: false, // Disable SQL query logs in console
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Connection to the database has been established successfully.');
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
};

export { sequelize };
