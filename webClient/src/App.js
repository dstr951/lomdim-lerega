import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./style/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

const App = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event, navigate) => {
    event.preventDefault();

    try {
      const response = await axios.post(`${SERVER_ADDRESS}/api/Users/login`, {
        email,
        password,
      });
      if (response.data) {
        navigate("/teacher-homepage", {
          state: { email: email, token: response.data },
        });
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setMessage(true);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col className="text-center">
          <h1>לומדים לרגע</h1>
        </Col>
      </Row>

      {/* Header */}
      <Row className="mb-4">
        <Col></Col>
      </Row>

      {/* Main Content */}
      <Row className="mb-4">
        <Col md={{ span: 6, offset: 3 }}>
          <Form>
            <Form.Group className="mb-4" dir="rtl">
              <Form.Label>אימייל </Form.Label>
              <Form.Control
                type="email"
                placeholder="הכנס כתובת אימייל"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-4" dir="rtl">
              <Form.Label>סיסמה</Form.Label>
              <Form.Control
                type="password"
                placeholder="הכנס סיסמה"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {/* Buttons Container */}
            <Row className="d-flex justify-content-center mt-3">
              <Col xs="auto">
                <Button variant="primary" type="submit" onClick={handleLogin}>
                  הכנס
                </Button>
              </Col>
              <Col xs="auto">
                <Link to="/signup">
                  <Button variant="primary" as="span">
                    הרשם
                  </Button>
                </Link>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <Row className="d-flex justify-content-center mt-3">
        <Col xs="auto">
          <div>
            {message ? (
              <p style={{ color: "red", fontSize: "20px" }}>
                כתובת מייל או סיסמא שגויים
              </p>
            ) : (
              <></>
            )}
          </div>
        </Col>
      </Row>

      {/* Footer */}
      <Row className="mb-4" dir="rtl">
        <Col className="text-center">
          <p>
            לסרטון הסבר קצר, לחצו <a href="#">כאן</a>.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default App;
