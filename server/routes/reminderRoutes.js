const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new reminder
router.post("/", authMiddleware, reminderController.createReminder);

// Get all reminders
router.get("/", authMiddleware, reminderController.getAllReminders);

module.exports = router;
