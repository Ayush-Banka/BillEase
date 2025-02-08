import React, { useEffect, useState } from "react";
import api from "../services/apiService";
import Navbar from "../components/Navbar";
import { Bar, Pie } from "react-chartjs-2";
import { Container, Row, Col, Spinner, Alert } from "react-bootstrap";

const Reports = () => {
  const [invoiceData, setInvoiceData] = useState([]);
  const [reminderData, setReminderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [invoicesRes, remindersRes] = await Promise.all([
        api.get("/invoices"),
        api.get("/reminders"),
      ]);
      setInvoiceData(invoicesRes.data);
      setReminderData(remindersRes.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching reports data:", err);
      setError("Error fetching reports data");
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data for invoices
  const invoiceChartData = {
    labels: invoiceData.map((invoice) => `Invoice ${invoice.id}`),
    datasets: [
      {
        label: "Invoice Amount (₹)",
        data: invoiceData.map((invoice) => invoice.amount),
        backgroundColor: "rgba(75,192,192,0.6)",
      },
    ],
  };

  // Prepare chart data for reminders
  const reminderStatusData = {
    labels: ["Pending Reminders", "Sent Reminders"],
    datasets: [
      {
        data: [
          reminderData.filter((reminder) => reminder.status === "scheduled").length,
          reminderData.filter((reminder) => reminder.status === "sent").length,
        ],
        backgroundColor: ["#ffcc00", "#28a745"],
      },
    ],
  };

  return (
    <div>
      <Navbar />
      <Container className="mt-4">
        <h2>Reports</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row>
            <Col md={6}>
              <h4>Invoice Amounts</h4>
              <Bar data={invoiceChartData} options={{ responsive: true }} />
            </Col>
            <Col md={6}>
              <h4>Reminder Status</h4>
              <Pie data={reminderStatusData} options={{ responsive: true }} />
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
};

export default Reports;
