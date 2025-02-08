import React, { useEffect, useState } from "react";
import api from "../services/apiService";
import Navbar from "../components/Navbar";
import { Table, Button, Form, Modal, Spinner, Alert } from "react-bootstrap";

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [reminderForm, setReminderForm] = useState({
    invoice_id: "",
    reminder_date: "",
  });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const res = await api.get("/reminders");
      setReminders(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching reminders:", err);
      setError("Error fetching reminders");
    } finally {
      setLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setReminderForm({ invoice_id: "", reminder_date: "" });
  };

  const handleFormChange = (e) => {
    setReminderForm({ ...reminderForm, [e.target.name]: e.target.value });
  };

  const handleAddReminder = async (e) => {
    e.preventDefault();
    try {
      await api.post("/reminders", reminderForm);
      fetchReminders();
      handleModalClose();
    } catch (err) {
      console.error("Error adding reminder:", err);
      setError("Error adding reminder");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <h2>Reminders</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        <div className="mb-3">
          <Button variant="success" onClick={() => setShowModal(true)}>
            + Add Reminder
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
                <th>Invoice ID</th>
                <th>Reminder Date</th>
              </tr>
            </thead>
            <tbody>
              {reminders.map((reminder) => (
                <tr key={reminder.id}>
                  <td>{reminder.id}</td>
                  <td>{reminder.invoice_id}</td>
                  <td>{reminder.reminder_date}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      {/* Add Reminder Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Reminder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddReminder}>
            <Form.Group controlId="reminderInvoiceId" className="mb-3">
              <Form.Label>Invoice ID</Form.Label>
              <Form.Control
                type="number"
                name="invoice_id"
                value={reminderForm.invoice_id}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="reminderDate" className="mb-3">
              <Form.Label>Reminder Date</Form.Label>
              <Form.Control
                type="date"
                name="reminder_date"
                value={reminderForm.reminder_date}
                onChange={handleFormChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Reminders;
