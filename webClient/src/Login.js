import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import jwt from "jwt-decode";
import axios from "axios";
import "./style/App.css";
import Header from "./component/Header";
import Swal from "sweetalert2";

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
        const authenticated = loginResponse.data.authenticated;
        const login = jwt(token);
        switch (login.role) {
          case "teacher":
            const teacherResponse = await axios.get(
              `${SERVER_ADDRESS}/api/Teachers/myself`,
              { headers: { Authorization: token } }
            );
            if (teacherResponse.data) {
              const teacher = teacherResponse.data;
              navigate("/teacher-homepage", {
                state: { teacher, token, authenticated },
              });
            }
            break;
          case "student":
            navigate("/seek-teachers", { state: { token, authenticated } });
            break;
          case "admin":
            navigate("/admin/panel", { state: { token } });
            break;
          default:
            return Swal.fire({
              icon: "error",
              title: "משהו השתבש בהתחברות",
              html: `
                <div dir="rtl">
                  אופס, יש לנו תקלה בשרת, אנא נסו שוב מאוחר יותר 
                  או פנו אלינו במייל: 
                  <span dir="ltr" style="display: inline-block;">
                    <a href="mailto:lomdimlerega@gmail.com">lomdimlerega@gmail.com</a>
                  </span>
                </div>
              `,
              confirmButtonText: "הבנתי",
            });
        }
      }
    } catch (error) {
      if (error.response)
        if (error.response?.status === 404) {
          return Swal.fire({
            icon: "error",
            title: "משהו השתבש בהתחברות",
            text: "לא מצאנו משתמש עם הפרטים הללו",
            confirmButtonText: "הבנתי",
          }).then(() => {
            console.error(error);
          });
        } else {
          return Swal.fire({
            icon: "error",
            title: "משהו השתבש בהתחברות",
            html: `
            <div dir="rtl">
              אופס, יש לנו תקלה בשרת, אנא נסו שוב מאוחר יותר 
              או פנו אלינו במייל: 
              <span dir="ltr" style="display: inline-block;">
                <a href="mailto:lomdimlerega@gmail.com">lomdimlerega@gmail.com</a>
              </span>
            </div>
          `,
            confirmButtonText: "הבנתי",
          });
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
