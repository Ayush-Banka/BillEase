const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middlewares/authMiddleware");

// Create Customer
router.post("/", authMiddleware, async (req, res) => {
  const { name, contact_number, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO customers (name, contact_number, email) VALUES ($1, $2, $3) RETURNING *",
      [name, contact_number, email]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Customers
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;