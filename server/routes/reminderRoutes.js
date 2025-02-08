const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create Reminder
router.post("/", authMiddleware, reminderController.createReminder);

// Get All Reminders
router.get("/", authMiddleware, reminderController.getAllReminders);

// Update Reminder (optional)
router.put("/:id", authMiddleware, reminderController.updateReminder);

// Delete Reminder
router.delete("/:id", authMiddleware, reminderController.deleteReminder);

module.exports = router;
