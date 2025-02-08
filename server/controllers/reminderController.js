const pool = require("../config/db");

const reminderController = {};

// Create a new reminder
reminderController.createReminder = async (req, res) => {
  const { invoice_id, reminder_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO reminders (invoice_id, reminder_date) VALUES ($1, $2) RETURNING *",
      [invoice_id, reminder_date]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create reminder error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get all reminders
reminderController.getAllReminders = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reminders");
    return res.json(result.rows);
  } catch (err) {
    console.error("Get reminders error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = reminderController;
