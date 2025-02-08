const pool = require("../config/db");

const customerController = {};

// Create a new customer
customerController.createCustomer = async (req, res) => {
  const { name, contact_number, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO customers (name, contact_number, email) VALUES ($1, $2, $3) RETURNING *",
      [name, contact_number, email]
    );
    return res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Create customer error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Get all customers
customerController.getAllCustomers = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM customers");
    return res.json(result.rows);
  } catch (err) {
    console.error("Get customers error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Update a customer
customerController.updateCustomer = async (req, res) => {
  const { id } = req.params;
  const { name, contact_number, email } = req.body;
  try {
    const result = await pool.query(
      "UPDATE customers SET name = $1, contact_number = $2, email = $3 WHERE id = $4 RETURNING *",
      [name, contact_number, email, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Customer not found" });
    }
    return res.json(result.rows[0]);
  } catch (err) {
    console.error("Update customer error:", err);
    return res.status(500).json({ error: "Server error" });
  }
};

// Delete a customer (with dependent invoice deletion using a transaction)
customerController.deleteCustomer = async (req, res) => {
  const { id } = req.params;
  // Get a client from the pool to manage a transaction
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    // Delete dependent invoices first
    await client.query("DELETE FROM invoices WHERE customer_id = $1", [id]);

    // Now delete the customer
    const result = await client.query(
      "DELETE FROM customers WHERE id = $1 RETURNING *",
      [id]
    );
    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Customer not found" });
    }
    await client.query("COMMIT");
    return res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Delete customer error:", err);
    return res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

module.exports = customerController;
