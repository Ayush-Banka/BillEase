const express = require("express");
const router = express.Router();
const reminderController = require("../controllers/reminderController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/", authMiddleware, reminderController.createReminder);
router.get("/", authMiddleware, reminderController.getAllReminders);
router.put("/:id", authMiddleware, reminderController.updateReminder);
router.delete("/:id", authMiddleware, reminderController.deleteReminder);

module.exports = router;
