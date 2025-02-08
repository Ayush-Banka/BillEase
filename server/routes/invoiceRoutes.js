const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create an invoice
router.post("/", authMiddleware, invoiceController.createInvoice);

// Get all invoices
router.get("/", authMiddleware, invoiceController.getAllInvoices);

// Update an invoice
router.put("/:id", authMiddleware, invoiceController.updateInvoice);

// Delete an invoice
router.delete("/:id", authMiddleware, invoiceController.deleteInvoice);

module.exports = router;
