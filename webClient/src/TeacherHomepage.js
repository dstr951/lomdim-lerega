import React from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { idToGrade, idToSubject } from "./Converters";
const TeacherHomepage = () => {
  const location = useLocation();
  const teacherData = location.state
    ? location.state.teacher
    : TeacherHomepage.defaultProps.teacher;
  const token = location.state?.token;
  const navigate = useNavigate();

  const handleDisconnect = (email) => {
    navigate("/", { state: { email } });
  };

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
                  <Image
                    src={`data:image/jpeg;base64,${teacherData.profilePicture}`}
                    roundedCircle
                    width="200"
                    className="mb-3"
                  />
                  <h4>
                    {teacherData.firstName} {teacherData.lastName}
                  </h4>
                </Col>
                <Col md={8}>
                  <ListGroup variant="flush">
                    <ListGroup.Item>גיל: {teacherData.age}</ListGroup.Item>
                    <ListGroup.Item>
                      <a
                        href={teacherData.socialProfileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        קישור לפרופיל החברתי
                      </a>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      טלפון: {teacherData.phoneNumber}
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <h4>על עצמי:</h4>
                  <p>{teacherData.aboutMe}</p>
                </Col>
              </Row>
              <Row className="mt-4">
                <Col>
                  <h4>מקצועות שאני מלמד:</h4>
                  <ListGroup variant="flush">
                    {teacherData.canTeach.map((item, index) => (
                      <ListGroup.Item key={index}>
                        {idToSubject[item.subject]} (מכיתה{" "}
                        {idToGrade[item.lowerGrade]} עד כיתה{" "}
                        {idToGrade[item.higherGrade]})
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
              <Button
                variant="primary"
                onClick={() => handleDisconnect(teacherData.email)}
              >
                התנתק
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
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
      { subject: "פיזיקה", lowerGrade: "ג'", higherGrade: 'י"ב' },
    ],
  },
};

export default TeacherHomepage;
