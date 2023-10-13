import React from 'react';
import { Container, Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "./component/Header";
import './style/TeacherHomepage.css';



const TeacherHomepage = () => {
    const location = useLocation();
    const teacherData = location.state ? location.state.teacher : TeacherHomepage.defaultProps.teacher;
    const navigate = useNavigate();

    const handleDisconnect = (email) => {
        navigate('/', { state: { email } });
    }

    const idToSubject = {
        1: 'מתמטיקה',
        2: 'היסטוריה',
        3: 'אנגלית',
        4: "לשון",
        5: "ביולוגיה",
        6: "פיזיקה",
        7: "כימיה",
        8: "ערבית",
        9: "תנך",
        10: "מדעי המחשב"
    }

    const idToGrade = {
        1: 'א\'',
        2: 'ב\'',
        3: 'ג\'',
        4: 'ד\'',
        5: 'ה\'',
        6: 'ו\'',
        7: 'ז\'',
        8: 'ח\'',
        9: 'ט\'',
        10: 'י\'',
        11: 'יא\'',
        12: 'יב\'',
    };

    return (
        <div className="teacher-homepage-wrapper">
            <Header className="header-teacher" />
            <Container className="mt-5 content-container" dir="rtl">
                <Row className="mb-5 justify-content-center" id='profile'>
                    <Col md={12}>
                        <Card>
                            <Card.Header className="bg-warning text-center">
                                <h1 className="text-white">הפרופיל שלי</h1>
                            </Card.Header>
                            <Card.Body className="bg-light">
                                <Row className="mb-3">
                                    <Col md={4} className="text-center">
                                        <Image src={teacherData.profilePicture} roundedCircle width="250" className="mb-3 profile-image" />
                                        <h4 className="font-weight-bold">{teacherData.firstName} {teacherData.lastName}</h4>
                                        
                                        <ListGroup variant="flush" className="mt-2">
                                            <ListGroup.Item className="contact-info"><strong>גיל:</strong> {teacherData.age}</ListGroup.Item>
                                            <ListGroup.Item className="contact-info">
                                                <a href={teacherData.socialProfileLink} target="_blank" rel="noopener noreferrer">
                                                    <strong>קישור לפרופיל החברתי</strong>
                                                </a>
                                            </ListGroup.Item>
                                            <ListGroup.Item className="contact-info"><strong>טלפון:</strong> {teacherData.phoneNumber}</ListGroup.Item>
                                        </ListGroup>
                                    </Col>
                                    <Col md={8}>
                                        <h4 className="font-weight-bold">על עצמי:</h4>
                                        <p>{teacherData.aboutMe}</p>
    
                                        <h4 className="font-weight-bold mt-4">מקצועות שאני מלמד:</h4>
                                        <ListGroup variant="flush">
                                            {teacherData.canTeach.map((item, index) => (
                                                <ListGroup.Item key={index}>
                                                    {idToSubject[item.subject]} (מכיתה {idToGrade[item.lowerGrade]} עד כיתה {idToGrade[item.higherGrade]})
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer className="text-center">
                                {/* <Button variant="primary">ערוך פרופיל</Button> */}
                            </Card.Footer>
                            <Card.Footer className="text-center">
                                <Button variant="primary" className="custom-button" onClick={() => handleDisconnect(teacherData.email)}>התנתק</Button>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

TeacherHomepage.defaultProps = {
    teacher: {
        firstName: "יוסי",
        lastName: "לוי",
        age: "30",
        socialProfileLink: "https://www.example.com/",
        phoneNumber: "0501234567",
        profilePicture: "https://via.placeholder.com/150",
        aboutMe: "אני מורה למתמטיקה ופיזיקה עם ניסיון של למעלה מ-10 שנים.",
        canTeach: [
            { subject: "מתמטיקה", lowerGrade: "א'", higherGrade: "ז'" },
            { subject: "פיזיקה", lowerGrade: "ג'", higherGrade: "י\"ב" }
        ]
    }
};

export default TeacherHomepage;
