import React, { useState, useEffect } from "react";
import {
  Accordion,
  Container,
  Row,
  Col,
  Form,
  ListGroup,
  Button,
} from "react-bootstrap";
import axios from "axios";

const idToGrade = {
  1: "א'",
  2: "ב'",
  3: "ג'",
  4: "ד'",
  5: "ה'",
  6: "ו'",
  7: "ז'",
  8: "ח'",
  9: "ט'",
  10: "י'",
  11: 'י"א',
  12: 'י"ב',
};

const idToSubject = {
  1: "מתמטיקה",
  2: "היסטוריה",
  3: "אנגלית",
  4: "לשון",
  5: "ביולוגיה",
  6: "פיזיקה",
  7: "כימיה",
  8: "ערבית",
  9: "תנך",
  10: "מדעי המחשב",
};

const TeachersListing = () => {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState(teachers);

  useEffect(() => {
    getTeachers();
  }, []);

  const getTeachers = () => {
    axios
      .get(`http://127.0.0.1:3001/api/Teachers/all`)
      .then((response) => {
        setTeachers(response.data);
        setFilteredTeachers(response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleFilterChange = () => {
    const params = [];
    if (subject) {
      params.push(`subject=${subject}`);
    }
    if (grade) {
      params.push(`grade=${grade}`);
    }

    let url = `http://127.0.0.1:3001/api/Teachers/search`;
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    } else {
      url = `http://127.0.0.1:3001/api/Teachers/all`;
    }

    if (params.length > 0) {
      axios
        .get(url)
        .then((response) => {
          setFilteredTeachers(response.data);
        })
        .catch((error) => console.error(error));
    } else {
      setFilteredTeachers(teachers);
    }
  };

  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  return (
    <Container maxWidth="sm" dir="rtl">
      <Row>
        <Col>
          <h1>שנתחיל ללמוד?</h1>
        </Col>
      </Row>
      <Row>
        <Col>חיפוש מורה פרטי לפי נושא:</Col>
      </Row>
      <Row>
        <Col>
          <Form.Select size="sm" value={subject} onChange={handleSubjectChange}>
            <option value={0}>כל המקצועות</option>
            {Object.keys(idToSubject).map((id) => (
              <option value={id}>{idToSubject[id]}</option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Form.Select size="sm" value={grade} onChange={handleGradeChange}>
            <option value={0}>כל הכיתות</option>
            {Object.keys(idToGrade).map((id) => (
              <option value={id}>{idToGrade[id]}</option>
            ))}
          </Form.Select>
        </Col>
        <Col>
          <Button onClick={handleFilterChange}>החל סינון</Button>
        </Col>
      </Row>
      <br />
      {filteredTeachers?.length === 0 ? (
        <Row
          variant="body1"
          align="center"
          data-testid="teacherListing-noTeacherssAvailable"
        >
          לא נמצאו מורים.
        </Row>
      ) : (
        <Accordion data-testid={"teacherListing-list"} defaultActiveKey="0">
          {filteredTeachers?.map((teacher) => (
            <Accordion.Item key={teacher.email} eventKey={teacher.email}>
              <Accordion.Header>
                <Container>
                  <Row xs="auto">
                    <Col>IMAGE</Col>
                    <Col>
                      <Row xs="auto">
                        <Col>
                          <h6>
                            {teacher.firstName} {teacher.lastName}{" "}
                          </h6>
                        </Col>
                        {teacher.isOnline ? <p>מחובר</p> : <p> לא מחובר</p>}
                      </Row>
                    </Col>
                  </Row>
                </Container>
              </Accordion.Header>
              <Accordion.Body>
                <Container>
                  <Row>
                    {teacher.aboutMe}

                    <Row xs="auto">
                      <Col xs>
                        <ListGroup variant="flush">
                          {teacher.canTeach.map((item, index) => (
                            <ListGroup.Item key={index}>
                              {idToSubject[item.subject]} (כיתות{" "}
                              {idToGrade[item.lowerGrade]} עד{" "}
                              {idToGrade[item.higherGrade]})
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Col>
                    </Row>
                  </Row>
                  <Row xs="auto">
                    <Col>
                      <Button>
                        {teacher.phoneNumber.substring(0, 3) +
                          "-" +
                          teacher.phoneNumber.substring(2)}
                      </Button>
                    </Col>
                    <Col>
                      <Button>{teacher.socialProfileLink}</Button>
                    </Col>
                  </Row>
                </Container>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default TeachersListing;
