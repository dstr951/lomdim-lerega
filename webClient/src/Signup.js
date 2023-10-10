import React, { useState } from "react";
import { Container, Row, Col, Form, Button, ListGroup, CloseButton } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Signup = () => {
    const [userType, setUserType] = useState("student");
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('מתמטיקה');
    const [startClass, setStartClass] = useState("א'");
    const [endClass, setEndClass] = useState("א'");

    const handleAddSubject = () => {
        const newSubject = {
            subject: selectedSubject,
            range: `${startClass} עד ${endClass}`
        };
        setSubjects(prevSubjects => [...prevSubjects, newSubject]);
    }

    const handleRemoveSubject = (index) => {
        const updatedSubjects = [...subjects];
        updatedSubjects.splice(index, 1);
        setSubjects(updatedSubjects);
    }

    return (
        <Container className="mt-3" dir="rtl">
            <Row className="mb-3">
                <Col className="text-center">
                    <h1>הרשמה</h1>
                </Col>
            </Row>

            <Row className="justify-content-center">
                <Col md={6}>
                    <Form>
                        <Form.Group className="mb-4">
                            <Form.Label className="mb-2">בחר סוג משתמש:</Form.Label>
                            <Form.Check
                                custom
                                type="radio"
                                id="custom-radio-teacher"
                                label="מורה"
                                name="userType"
                                inline
                                onChange={() => setUserType("teacher")}
                            />
                            <Form.Check
                                custom
                                type="radio"
                                id="custom-radio-student"
                                label="תלמיד"
                                name="userType"
                                inline
                                checked={userType === "student"}
                                onChange={() => setUserType("student")}
                            />
                        </Form.Group>

                        {userType === "teacher" && (
                <>
                    <Form.Group className="mb-4">
                        <Form.Label className="mb-2">מקצוע:</Form.Label>
                        <Row className="mb-2">
                            <Col md={3}>
                                <Form.Control as="select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                                    <option value="מתמטיקה">מתמטיקה</option>
                                    <option value="היסטוריה">היסטוריה</option>
                                    <option value="אנגלית">אנגלית</option>
                                    <option value="לשון">לשון</option>
                                    <option value="ביולוגיה">ביולוגיה</option>
                                    <option value="כימיה">פיזיקה</option>
                                    <option value="כימיה">כימיה</option>
                                    <option value="ערבית">ערבית</option>
                                    <option value="תנך">תנ"ך</option>
                                    <option value="מדעי המחשב">מדעי המחשב</option>
                                </Form.Control>
                            </Col>
                            <Col md={3}>
                                <Form.Control as="select" value={startClass} onChange={(e) => setStartClass(e.target.value)}>
                                    <option>א'</option>
                                    <option>ב'</option>
                                    <option>ג'</option>
                                    <option>ד'</option>
                                    <option>ה'</option>
                                    <option>ו'</option>
                                    <option>ז'</option>
                                    <option>ח'</option>
                                    <option>ט'</option>
                                    <option>י'</option>
                                    <option>י"א</option>
                                    <option>י"ב</option>
                                </Form.Control>
                            </Col>
                            <Col md={1} className="text-center">
                                עד
                            </Col>
                            <Col md={3}>
                                <Form.Control as="select" value={endClass} onChange={(e) => setEndClass(e.target.value)}>
                                    <option>א'</option>
                                    <option>ב'</option>
                                    <option>ג'</option>
                                    <option>ד'</option>
                                    <option>ה'</option>
                                    <option>ו'</option>
                                    <option>ז'</option>
                                    <option>ח'</option>
                                    <option>ט'</option>
                                    <option>י'</option>
                                    <option>י"א</option>
                                    <option>י"ב</option>
                                </Form.Control>
                            </Col>
                            <Col md={2}>
                                <Button onClick={handleAddSubject}>הוסף</Button>
                            </Col>
                        </Row>
                        <ListGroup className="mt-3">
                            {subjects.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    {`${item.subject} (${item.range})`}
                                    <CloseButton size="sm" onClick={() => handleRemoveSubject(index)} />
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>גיל:</Form.Label>
                        <Form.Control type="number" placeholder="הכנס גיל" />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>על עצמי:</Form.Label>
                        <Form.Control as="textarea" rows={4} placeholder="ספר על עצמך" />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>תמונה:</Form.Label>
                        <Form.Control type="file" accept="image/*" />
                    </Form.Group>
                    <Form.Group className="mb-4">
                        <Form.Label>קישור לפרופיל חברתי:</Form.Label>
                        <Form.Control type="url" placeholder="הכנס קישור" />
                    </Form.Group>
                </>
            )}

                        {userType === "student" && (
                            <Row>
                                <Col md={6}>
                                    <h4 className="mb-3">פרטי ההורה</h4>
                                    <Form.Group className="mb-4">
                                        <Form.Label>שם:</Form.Label>
                                        <Form.Control type="text" placeholder="הכנס שם ההורה" />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>שם משפחה:</Form.Label>
                                        <Form.Control type="text" placeholder="הכנס שם משפחה" />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>טלפון:</Form.Label>
                                        <Form.Control type="tel" placeholder="הכנס טלפון ההורה" />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <h4 className="mb-3">פרטי הילד</h4>
                                    <Form.Group className="mb-4">
                                        <Form.Label>שם:</Form.Label>
                                        <Form.Control type="text" placeholder="הכנס שם הילד" />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label>שם משפחה:</Form.Label>
                                        <Form.Control type="text" placeholder="הכנס שם משפחה" />
                                    </Form.Group>
                                    <Form.Group className="mb-4">
                                        <Form.Label className="mb-2">כיתה:</Form.Label>
                                        <Form.Control as="select">
                                            <option>א'</option>
                                            <option>ב'</option>
                                            <option>ג'</option>
                                            <option>ד'</option>
                                            <option>ה'</option>
                                            <option>ו'</option>
                                            <option>ז'</option>
                                            <option>ח'</option>
                                            <option>ט'</option>
                                            <option>י'</option>
                                            <option>י"א</option>
                                            <option>י"ב</option>
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                        )}

                        <hr className="my-4" /> {}

                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="mb-2">אימייל:</Form.Label>
                                    <Form.Control type="email" placeholder="הכנס כתובת אימייל" />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-4">
                                    <Form.Label className="mb-2">סיסמה:</Form.Label>
                                    <Form.Control type="password" placeholder="הכנס סיסמה" />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Button variant="primary" type="submit" className="w-100">
                            הרשם
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Signup;
