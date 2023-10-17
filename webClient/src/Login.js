import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import jwt from "jwt-decode";
import axios from "axios";
import "./style/App.css";
import Header from "./component/Header";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS
  ? process.env.SERVER_ADDRESS
  : "http://localhost:3001";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const initialEmail = location.state?.email || "";
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    let token;
    try {
      const loginResponse = await axios.post(
        `${SERVER_ADDRESS}/api/Users/login`,
        {
          email,
          password,
        }
      );

      if (loginResponse.data) {
        token = loginResponse.data.token;
        const login = jwt(token);
        switch (login.role) {
          case "teacher":
            const teacherResponse = await axios.get(
              `${SERVER_ADDRESS}/api/Teachers/search?email=${email}`,
              { headers: { Authorization: token } }
            );
            if (teacherResponse.data) {
              const teacher = teacherResponse.data;
              navigate("/teacher-homepage", { state: { teacher, token } });
            }
            break;
          case "student":
            navigate("/seek-teachers", { state: { token } });
            break;
          case "admin":
            navigate("/admin/panel", { state: { token } });
            break;
          default:
            alert("there was an error");
            break;
        }
      }
    } catch (error) {
      if (error.response?.status === 404) {
        alert("לא מצאנו משתמש עם הפרטים הללו, אנא נסה שנית עם הפרטים הנכונים");
        console.error("Error:", error);
      } else {
        alert("there was an error logging in");
      }
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Header />
      <div className="main-section-narrow">
        <div className="section">
          <div className="title">התחברות</div>
          <div className="text-section">
            <Form>
              <Form.Group className="mb-4" dir="rtl">
                <p>אימייל </p>
                <Form.Control
                  type="email"
                  placeholder="הכנס כתובת אימייל"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-4" dir="rtl">
                <p>סיסמה</p>
                <Form.Control
                  type="password"
                  placeholder="הכנס סיסמה"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>

              {/* Buttons Container */}
              <Row className="d-flex justify-content-center mt-3">
                <Col xs="auto">
                  <Link to="/signup">
                    <button variant="primary" type="button" as="span">
                      הרשם
                    </button>
                  </Link>
                </Col>
                <Col xs="auto">
                  <button variant="primary" type="submit" onClick={handleLogin}>
                    הכנס
                  </button>
                </Col>
              </Row>
            </Form>
            <br />
            {/* <p className="pCenter"><a href="#">שכחתי סיסמה</a></p> */}

            <br />
            {/* <p className="pCenter">הסתבכתם? לחצו  <a href="#">כאן</a> לסרטון הסבר קצר.</p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
