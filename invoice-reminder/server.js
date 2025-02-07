require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg"); // Use Pool from pg

const app = express();
app.use(cors());
app.use(express.json());

// Database connection using Pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Required for Supabase
});

// Test the database connection
pool.connect()
  .then(() => console.log("Connected to PostgreSQL database"))
  .catch(err => console.error("Database connection failed:", err));

// API routes
app.get("/", (req, res) => {
  res.send("Invoice Reminder System API is running...");
});

// Start server
const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
