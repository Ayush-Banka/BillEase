const express = require("express");
const router = express.Router();
const pool = require("../db");
const authMiddleware = require("../middlewares/authMiddleware");

// Create Reminder
router.post("/", authMiddleware, async (req, res) => {
  const { invoice_id, reminder_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO reminders (invoice_id, reminder_date) VALUES ($1, $2) RETURNING *",
      [invoice_id, reminder_date]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Get All Reminders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reminders");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
