// File: src/pages/CreateBill.js
import React, { useState } from 'react';
import { Form, Button, Table } from 'react-bootstrap';
import Navbar from '../components/Navbar';
import api from '../services/apiService';

const CreateBill = () => {
  // Customer details
  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
  
  // Items (array of objects with description and price)
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState({ description: '', price: '' });

  // Payment options
  const [paymentMethod, setPaymentMethod] = useState('');
  const [dueDays, setDueDays] = useState('');

  // Add a new item to the list
  const handleAddItem = () => {
    if (newItem.description && newItem.price) {
      setItems([...items, newItem]);
      setNewItem({ description: '', price: '' });
    }
  };

  // Calculate total amount
  const totalAmount = items.reduce((total, item) => total + parseFloat(item.price), 0);

  // Handle form submission to create invoice
  const handleSubmit = async (e) => {
    e.preventDefault();
    const invoiceData = {
      // For example, you may include admin_id from your logged-in user context
      admin_id: 1, // or get from context
      customer_id: 0, // If customer is created separately, you might create the customer first.
      // Alternatively, you can pass the customer details along with invoice data.
      customer_name: customer.name,
      customer_phone: customer.phone,
      customer_email: customer.email,
      items: items, // Store items as an array (your backend should handle parsing this)
      amount: totalAmount,
      payment_method: paymentMethod,
      // If "Pay Later", calculate due date based on dueDays
      due_date: paymentMethod === 'later'
        ? new Date(Date.now() + parseInt(dueDays) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
      status: paymentMethod === 'later' ? 'pending' : 'paid'
    };
    try {
      const res = await api.post('/invoices', invoiceData);
      alert('Invoice created successfully!');
      // Optionally redirect to a summary page or clear the form
    } catch (err) {
      console.error('Error creating invoice:', err);
      alert('Failed to create invoice');
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <h2>Create Bill</h2>
        <Form onSubmit={handleSubmit}>
          <h4>Customer Details</h4>
          <Form.Group controlId="customerName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter customer name"
              value={customer.name}
              onChange={(e) => setCustomer({ ...customer, name: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="customerPhone">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter phone number"
              value={customer.phone}
              onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
              required
            />
          </Form.Group>
          <Form.Group controlId="customerEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={customer.email}
              onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
              required
            />
          </Form.Group>

          <h4 className="mt-4">Items Purchased</h4>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Description</th>
                <th>Price (₹)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index}>
                  <td>{item.description}</td>
                  <td>{item.price}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Form.Group controlId="itemDescription">
            <Form.Label>Item Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Item description"
              value={newItem.description}
              onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            />
          </Form.Group>
          <Form.Group controlId="itemPrice">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Item price"
              value={newItem.price}
              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            />
          </Form.Group>
          <Button variant="secondary" onClick={handleAddItem} className="mt-2">
            Add Item
          </Button>

          <h4 className="mt-4">Payment Options</h4>
          <Form.Group controlId="paymentMethod">
            <Form.Check
              inline
              label="Cash"
              name="paymentMethod"
              type="radio"
              value="cash"
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            />
            <Form.Check
              inline
              label="Card"
              name="paymentMethod"
              type="radio"
              value="card"
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            />
            <Form.Check
              inline
              label="UPI"
              name="paymentMethod"
              type="radio"
              value="upi"
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            />
            <Form.Check
              inline
              label="Pay Later"
              name="paymentMethod"
              type="radio"
              value="later"
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            />
          </Form.Group>
          {paymentMethod === 'later' && (
            <Form.Group controlId="dueDays">
              <Form.Label>Number of Days to Pay</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter number of days"
                value={dueDays}
                onChange={(e) => setDueDays(e.target.value)}
                required
              />
            </Form.Group>
          )}

          <Button variant="primary" type="submit" className="mt-3">
            Create Invoice
          </Button>
        </Form>
      </div>
    </>
  );
};

export default CreateBill;
