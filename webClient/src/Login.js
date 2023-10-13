import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import './style/App.css';
import Header from "./component/Header";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS

const Login = () => {


    const location = useLocation();
    const navigate = useNavigate();

    const initialEmail = location.state?.email || '';
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
    
        try {
            const loginResponse = await axios.post(`${SERVER_ADDRESS}/api/Users/login`, {
                email,
                password
            });
            
            if (loginResponse.data) {
                const token = loginResponse.data;
                const teacherResponse = await axios.get(`${SERVER_ADDRESS}/api/Teachers/search?email=${email}`,
                 { headers: { Authorization: token} });
                
                if (teacherResponse.data) {
                    const teacher = teacherResponse.data;
                    navigate('/teacher-homepage', { state: { teacher } });
                } else {
                    alert('Failed to fetch teacher data.');
                }
            } else {
                alert('Failed to login.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Header/>
            <div className="main-narrow">
                <div className="section">
                
                <div className="title">
                    התחברות
                </div>
                    <div className="textSection">
                        <Form>
                            <Form.Group className="mb-4" dir="rtl">
                                <p>אימייל </p>
                                <Form.Control type="email" placeholder="הכנס כתובת אימייל" value={email} onChange={e => setEmail(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-4" dir="rtl">
                                <p>סיסמה</p>
                                <Form.Control type="password" placeholder="הכנס סיסמה" onChange={e => setPassword(e.target.value)}/>
                            </Form.Group>

                            {/* Buttons Container */}
                            <Row className="d-flex justify-content-center mt-3">
                                <Col xs="auto">
                                    <button variant="primary" type="submit" onClick={handleLogin}>
                                        הכנס
                                    </button>
                                </Col>
                                <Col xs="auto">
                                    <Link to="/signup">
                                        <button variant="primary" as="span">
                                            הרשם
                                        </button>
                                    </Link>
                                </Col>
                            </Row>
                        </Form>
                        <br/>
                        <p className="pCenter"><a href="#">שכחתי סיסמה</a></p>                    
                        <p className="pCenter">הסתבכתם? לחצו  <a href="#">כאן</a> לסרטון הסבר קצר.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
