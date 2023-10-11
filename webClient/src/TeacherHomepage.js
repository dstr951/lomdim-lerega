import React, { useEffect, useState } from 'react';
import { Container, Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const TeacherHomepage = ({ teacher }) => {
    return (
        <Container className="mt-3" dir="rtl">
            <Row className="mb-3 justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header className="text-center">
                            <h1>פרופיל המורה</h1>
                        </Card.Header>
                        <Card.Body>
                            <Row className="mb-3">
                                <Col md={4}>
                                    <Image src={teacher.profilePicture} roundedCircle width="200" className="mb-3" />
                                    <h4>{teacher.teacherFirstName} {teacher.teacherLastName}</h4>
                                </Col>
                                <Col md={8}>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>גיל: {teacher.age}</ListGroup.Item>
                                        <ListGroup.Item>
                                            <a href={teacher.socialProfileLink} target="_blank" rel="noopener noreferrer">קישור לפרופיל החברתי</a>
                                        </ListGroup.Item>
                                        <ListGroup.Item>טלפון: {teacher.phoneNumber}</ListGroup.Item>
                                    </ListGroup>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col>
                                    <h4>על עצמי:</h4>
                                    <p>{teacher.aboutMe}</p>
                                </Col>
                            </Row>
                            <Row className="mt-4">
                                <Col>
                                    <h4>מקצועות שאני מלמד:</h4>
                                    <ListGroup variant="flush">
                                        {teacher.canTeach.map((item, index) => (
                                            <ListGroup.Item key={index}>
                                                {item.subject} (מכיתה {item.lowerGrade} עד כיתה {item.higherGrade})
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="text-center">
                            <Button variant="primary">ערוך פרופיל</Button>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

TeacherHomepage.defaultProps = {
    teacher: {
        teacherFirstName: "יוסף",
        teacherLastName: "לוי",
        age: "30",
        socialProfileLink: "https://www.example.com/",
        phoneNumber: "050-1234567",
        profilePicture: "https://via.placeholder.com/150", // Placeholder image
        aboutMe: "אני מורה למתמטיקה ופיזיקה עם ניסיון של למעלה מ-10 שנים.",
        canTeach: [
            { subject: "מתמטיקה", lowerGrade: "א'", higherGrade: "ז'" },
            { subject: "פיזיקה", lowerGrade: "ג'", higherGrade: "י\"ב" }
        ]
    }
};

export default TeacherHomepage;
