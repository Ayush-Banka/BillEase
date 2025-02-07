const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middlewares/authMiddleware");

// Create Invoice
router.post("/", authMiddleware, async (req, res) => {
  const { admin_id, customer_id, amount, status, due_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO invoices (admin_id, customer_id, amount, status, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [admin_id, customer_id, amount, status, due_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Invoices
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM invoices");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
