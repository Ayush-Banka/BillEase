const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new customer
router.post("/", authMiddleware, customerController.createCustomer);

// Get all customers
router.get("/", authMiddleware, customerController.getAllCustomers);

// Update a customer
router.put("/:id", authMiddleware, customerController.updateCustomer);

// Delete a customer
router.delete("/:id", authMiddleware, customerController.deleteCustomer);

module.exports = router;
