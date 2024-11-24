// initDb.js
const pool = require("./db");

const createSchemaAndTables = async () => {
  try {
    // Define the schema and table creation SQL
    const createSchemaSQL = `
      CREATE SCHEMA IF NOT EXISTS PERN;
      
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

      
      CREATE TABLE IF NOT EXISTS PERN.users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          username VARCHAR(50) UNIQUE NOT NULL,
          email VARCHAR(100) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS PERN.pages (
    profile_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES PERN.users(id) ON DELETE CASCADE,
    author VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    misc TEXT,
    dob DATE,
    end_date DATE,
    achievements TEXT,
    career TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
    `;

    // Execute the SQL commands
    await pool.query(createSchemaSQL);
    console.log("Schema and tables created successfully");
  } catch (err) {
    console.error("Error creating schema and tables:", err);
  } finally {
    pool.end(); // Close the pool
  }
};

// Run the function
createSchemaAndTables();
