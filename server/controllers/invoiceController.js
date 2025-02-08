const pool = require("../config/db");

const invoiceController = {};

// Create Invoice
invoiceController.createInvoice = async (req, res) => {
  const { admin_id, customer_id, amount, status, due_date, items, payment_method } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO invoices (admin_id, customer_id, amount, status, due_date, items, payment_method) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [admin_id, customer_id, amount, status, due_date, items, payment_method]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create invoice error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get All Invoices
invoiceController.getAllInvoices = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM invoices");
    return res.json(result.rows);
  } catch (err) {
    console.error("Get invoices error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Update Invoice
invoiceController.updateInvoice = async (req, res) => {
  const { id } = req.params;
  const { amount, status, due_date, items, payment_method } = req.body;
  try {
    const result = await pool.query(
      "UPDATE invoices SET amount = $1, status = $2, due_date = $3, items = $4, payment_method = $5 WHERE id = $6 RETURNING *",
      [amount, status, due_date, items, payment_method, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Update invoice error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete Invoice (with transaction to delete dependent reminders first)
invoiceController.deleteInvoice = async (req, res) => {
  const { id } = req.params;
  // Obtain a client from the pool to manage a transaction
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Delete all reminders referencing this invoice
    await client.query("DELETE FROM reminders WHERE invoice_id = $1", [id]);
    // Now delete the invoice itself
    const result = await client.query(
      "DELETE FROM invoices WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Invoice not found" });
    }
    await client.query("COMMIT");
    return res.json({ message: "Invoice deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Delete invoice error:", err);
    return res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

module.exports = invoiceController;
