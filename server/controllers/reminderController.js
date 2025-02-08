const pool = require("../config/db");

const reminderController = {};

// Create Reminder
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

// Get All Reminders
reminderController.getAllReminders = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM reminders");
    return res.json(result.rows);
  } catch (err) {
    console.error("Get reminders error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Update Reminder (optional)
reminderController.updateReminder = async (req, res) => {
  const { id } = req.params;
  const { reminder_date } = req.body;
  try {
    const result = await pool.query(
      "UPDATE reminders SET reminder_date = $1 WHERE id = $2 RETURNING *",
      [reminder_date, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Update reminder error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete Reminder
reminderController.deleteReminder = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      "DELETE FROM reminders WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Reminder not found" });
    }
    return res.json({ message: "Reminder deleted successfully" });
  } catch (err) {
    console.error("Delete reminder error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = reminderController;
