import React, { useEffect, useState } from "react";
import api from "../services/apiService";
import Navbar from "../components/Navbar";
import { Table, Button, Form, Modal, Spinner, Alert } from "react-bootstrap";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    contact_number: "",
    email: "",
  });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/customers");
      setCustomers(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Error fetching customers");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingCustomer(null);
    setCustomerForm({ name: "", contact_number: "", email: "" });
  };

  const handleFormChange = (e) => {
    setCustomerForm({ ...customerForm, [e.target.name]: e.target.value });
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.post("/customers", customerForm);
      fetchCustomers();
      handleModalClose();
    } catch (err) {
      console.error("Error adding customer:", err);
      setError("Error adding customer");
    }
  };

  const handleUpdateCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/customers/${editingCustomer.id}`, customerForm);
      fetchCustomers();
      handleModalClose();
    } catch (err) {
      console.error("Error updating customer:", err);
      setError("Error updating customer");
    }
  };

  const handleDeleteCustomer = async (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      await api.delete(`/customers/${id}`);
      fetchCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("Error deleting customer");
    }
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setCustomerForm({ name: "", contact_number: "", email: "" });
    setShowModal(true);
  };

  const openEditModal = (customer) => {
    setEditingCustomer(customer);
    setCustomerForm({
      name: customer.name,
      contact_number: customer.contact_number,
      email: customer.email,
    });
    setShowModal(true);
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Customers</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="mb-3">
          <Button variant="success" onClick={openAddModal}>
            + Add Customer
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
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.contact_number}</td>
                  <td>{customer.email}</td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => openEditModal(customer)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDeleteCustomer(customer.id)}
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

      {/* Add/Edit Customer Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCustomer ? "Edit Customer" : "Add Customer"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={editingCustomer ? handleUpdateCustomer : handleAddCustomer}>
            <Form.Group controlId="customerName" className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={customerForm.name}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="customerContact" className="mb-3">
              <Form.Label>Contact</Form.Label>
              <Form.Control
                type="text"
                name="contact_number"
                value={customerForm.contact_number}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="customerEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={customerForm.email}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              {editingCustomer ? "Update" : "Save"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Customers;
