import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import api from "../services/apiService";
import { Card, Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";

const Dashboard = () => {
  const { logoutUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    customerCount: 0,
    invoiceCount: 0,
    reminderCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [customerRes, invoiceRes, reminderRes] = await Promise.all([
        api.get("/customers"),
        api.get("/invoices"),
        api.get("/reminders"),
      ]);
      setStats({
        customerCount: customerRes.data.length,
        invoiceCount: invoiceRes.data.length,
        reminderCount: reminderRes.data.length,
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching stats:", err);
      setError("Error fetching dashboard stats.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div>
      <Navbar />
      <Container className="mt-4">
        <h2>Dashboard</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading ? (
          <div className="text-center my-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          <Row>
            <Col md={4}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <Card.Title>Customers</Card.Title>
                  <Card.Text>{stats.customerCount}</Card.Text>
                  <Button variant="primary" onClick={() => navigate("/customers")}>
                    View
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <Card.Title>Invoices</Card.Title>
                  <Card.Text>{stats.invoiceCount}</Card.Text>
                  <Button variant="primary" onClick={() => navigate("/invoices")}>
                    View
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center mb-3">
                <Card.Body>
                  <Card.Title>Reminders</Card.Title>
                  <Card.Text>{stats.reminderCount}</Card.Text>
                  <Button variant="primary" onClick={() => navigate("/reminders")}>
                    View
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
        <div className="text-center mt-4">
          <Button variant="danger" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;
