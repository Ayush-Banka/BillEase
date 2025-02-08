const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create a new invoice
router.post("/", authMiddleware, invoiceController.createInvoice);

// Get all invoices
router.get("/", authMiddleware, invoiceController.getAllInvoices);

module.exports = router;
