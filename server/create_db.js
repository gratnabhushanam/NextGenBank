const mysql = require('mysql2/promise');

async function createDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: 'Ratna@2005'
    });
    
    await connection.query('CREATE DATABASE IF NOT EXISTS banking_system;');
    console.log('Database banking_system created or already exists.');
    
    await connection.end();
  } catch (error) {
    console.error('Error creating database:', error.message);
  }
}

createDatabase();
