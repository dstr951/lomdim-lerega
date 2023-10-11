import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import './style/App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const initialEmail = location.state?.email || '';
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
    
        try {
            const loginResponse = await axios.post('http://localhost:3001/api/Users/login', {
                email,
                password
            });
            
            if (loginResponse.data) {
                const token = loginResponse.data;
                const teacherResponse = await axios.get(`http://localhost:3001/api/Teachers/search?email=${email}`,
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
        <Container className="mt-5">
            <Row>
                <Col className="text-center">
                    <h1>לומדים לרגע</h1>
                </Col>
            </Row>

            {/* Header */}
            <Row className="mb-4">
                <Col>
                </Col>
            </Row>

            {/* Main Content */}
            <Row className="mb-4" >
                <Col md={{ span: 6, offset: 3 }}>
                    <Form>
                        <Form.Group className="mb-4" dir="rtl">
                            <Form.Label>אימייל </Form.Label>
                            <Form.Control type="email" placeholder="הכנס כתובת אימייל" value={email} onChange={e => setEmail(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-4" dir="rtl">
                            <Form.Label>סיסמה</Form.Label>
                            <Form.Control type="password" placeholder="הכנס סיסמה" onChange={e => setPassword(e.target.value)}/>
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

            {/* Footer */}
            <Row className="mb-4" dir="rtl">
                <Col className="text-center">
                    <p>לסרטון הסבר קצר, לחצו  <a href="#">כאן</a>.</p>
                </Col>
            </Row>
        </Container>
    );
}

export default App;
