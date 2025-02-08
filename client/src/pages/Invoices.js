import React, { useEffect, useState } from "react";
import api from "../services/apiService";
import Navbar from "../components/Navbar";
import { Table, Button, Modal, Form, Spinner, Alert } from "react-bootstrap";

const Invoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [invoiceForm, setInvoiceForm] = useState({
    customer_id: "",
    items: "",
    amount: "",
    due_date: "",
  });

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const res = await api.get("/invoices");
      setInvoices(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching invoices:", err);
      setError("Error fetching invoices");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingInvoice(null);
    setInvoiceForm({ customer_id: "", items: "", amount: "", due_date: "" });
  };

  const handleFormChange = (e) => {
    setInvoiceForm({ ...invoiceForm, [e.target.name]: e.target.value });
  };

  const handleAddInvoice = async (e) => {
    e.preventDefault();
    try {
      await api.post("/invoices", invoiceForm);
      fetchInvoices();
      handleModalClose();
    } catch (err) {
      console.error("Error adding invoice:", err);
      setError("Error adding invoice");
    }
  };

  const handleUpdateInvoice = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/invoices/${editingInvoice.id}`, invoiceForm);
      fetchInvoices();
      handleModalClose();
    } catch (err) {
      console.error("Error updating invoice:", err);
      setError("Error updating invoice");
    }
  };

  const handleDeleteInvoice = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await api.delete(`/invoices/${id}`);
      fetchInvoices();
    } catch (err) {
      console.error("Error deleting invoice:", err);
      setError("Error deleting invoice");
    }
  };

  const openAddModal = () => {
    setEditingInvoice(null);
    setInvoiceForm({ customer_id: "", items: "", amount: "", due_date: "" });
    setShowModal(true);
  };

  const openEditModal = (invoice) => {
    setEditingInvoice(invoice);
    setInvoiceForm({
      customer_id: invoice.customer_id,
      items: invoice.items,
      amount: invoice.amount,
      due_date: invoice.due_date.split("T")[0],
    });
    setShowModal(true);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Invoices</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="mb-3">
          <Button variant="success" onClick={openAddModal}>
            + Add Invoice
          </Button>
        </div>
        {loading ? (
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Customer ID</th>
                <th>Items</th>
                <th>Amount (₹)</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td>{invoice.id}</td>
                  <td>{invoice.customer_id}</td>
                  <td>{invoice.items}</td>
                  <td>{invoice.amount}</td>
                  <td>{invoice.due_date.split("T")[0]}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => openEditModal(invoice)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteInvoice(invoice.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Add/Edit Invoice Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingInvoice ? "Edit Invoice" : "Add Invoice"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editingInvoice ? handleUpdateInvoice : handleAddInvoice}>
            <Form.Group controlId="invoiceCustomer" className="mb-3">
              <Form.Label>Customer ID</Form.Label>
              <Form.Control
                type="number"
                name="customer_id"
                value={invoiceForm.customer_id}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="invoiceItems" className="mb-3">
              <Form.Label>Items</Form.Label>
              <Form.Control
                type="text"
                name="items"
                value={invoiceForm.items}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="invoiceAmount" className="mb-3">
              <Form.Label>Amount (₹)</Form.Label>
              <Form.Control
                type="number"
                name="amount"
                value={invoiceForm.amount}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="invoiceDueDate" className="mb-3">
              <Form.Label>Due Date</Form.Label>
              <Form.Control
                type="date"
                name="due_date"
                value={invoiceForm.due_date}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              {editingInvoice ? "Update" : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Invoices;
