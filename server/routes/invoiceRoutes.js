const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const authMiddleware = require("../middlewares/authMiddleware");

// Create Invoice
router.post("/", authMiddleware, invoiceController.createInvoice);

// Get All Invoices
router.get("/", authMiddleware, invoiceController.getAllInvoices);

// Update Invoice
router.put("/:id", authMiddleware, invoiceController.updateInvoice);

// Delete Invoice
router.delete("/:id", authMiddleware, invoiceController.deleteInvoice);

module.exports = router;
