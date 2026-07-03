const { Sequelize } = require('sequelize');

require('dotenv').config();

const dbName = process.env.DB_NAME || 'bankingsystem';
const dbUser = process.env.DB_USER || 'root';
const dbPass = process.env.DB_PASS || 'Ratna@2005';
const dbHost = process.env.DB_HOST || 'localhost';

// Create a Sequelize instance connecting to the MySQL database
const sequelize = new Sequelize(dbName, dbUser, dbPass, {
  host: dbHost,
  dialect: 'mysql',
  logging: false, // Set to console.log to see SQL queries
});

const connectDB = async () => {
  try {
    // Authenticate with the database
    await sequelize.authenticate();
    console.log('MySQL Database Connected successfully.');

    // Automatically sync models with the database (creates tables if they don't exist)
    await sequelize.sync({ alter: true });
    console.log('Database synced.');
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    // If the database doesn't exist, we might need to create it manually or programmatically.
    // Assuming the user has created the schema 'banking_system' in MySQL.
  }
};

module.exports = { sequelize, connectDB };
