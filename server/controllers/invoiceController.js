const pool = require("../config/db");

const invoiceController = {};

// Create a new invoice
invoiceController.createInvoice = async (req, res) => {
  const { admin_id, customer_id, amount, status, due_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO invoices (admin_id, customer_id, amount, status, due_date) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [admin_id, customer_id, amount, status, due_date]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create invoice error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get all invoices
invoiceController.getAllInvoices = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM invoices");
    return res.json(result.rows);
  } catch (err) {
    console.error("Get invoices error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = invoiceController;
