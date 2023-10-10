import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

const Signup = () => {
    const [userType, setUserType] = useState("");  

    return (
        <Container className="mt-5" dir="rtl">
            <Row>
                <Col className="text-center">
                    <h1>הרשמה</h1>
                </Col>
            </Row>

            <Row className="mb-4" dir="rtl">
                <Col md={{ span: 6, offset: 3 }}>
                    <Form>
                        <Form.Group>
                            <Form.Label>בחר סוג משתמש:</Form.Label>
                            <Form.Check
                                type="radio"
                                label="מורה"
                                name="userType"
                                id="teacher"
                                onChange={() => setUserType("teacher")}
                            />
                            <Form.Check
                                type="radio"
                                label="תלמיד"
                                name="userType"
                                id="student"
                                onChange={() => setUserType("student")}
                            />
                        </Form.Group>

                        {userType === "teacher" && (
                            <>
                                {/* Fields specific for Teacher */}
                                <Form.Group>
                                    <Form.Label>מקצוע:</Form.Label>
                                    <Form.Control type="text" placeholder="הכנס את מקצוע ההוראה שלך" />
                                </Form.Group>
                            </>
                        )}

                        {userType === "student" && (
                            <>
                                {/* Fields specific for Student */}
                                <Form.Group>
                                    <Form.Label>מוסד לימודים:</Form.Label>
                                    <Form.Control type="text" placeholder="הכנס את מקום לימודיך" />
                                </Form.Group>
                            </>
                        )}

                        <Form.Group>
                            <Form.Label>אימייל:</Form.Label>
                            <Form.Control type="email" placeholder="הכנס אימייל" />
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>סיסמה:</Form.Label>
                            <Form.Control type="password" placeholder="הכנס סיסמה" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            הרשם
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Signup;