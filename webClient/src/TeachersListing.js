// TeachersListing.js
import React, { useState } from "react";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Accordion,
  Container,
  Row,
  Col,
  Form,
  ListGroup,
} from "react-bootstrap";
import Teachers from "./Teachers";
const teachers = Teachers;
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
  //   const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState(teachers);

  const getTeachers = () => {
    axios
      .get(`http://127.0.0.1:3001/api/Teachers`)
      .then((response) => setTeachers(response.data.Teachers))
      .catch((error) => console.error(error));
  };

  const handleFilterChange = (subject, grade) => {
    const params = [];
    if (subject != 0) {
      params.push(`subject=${subject}`);
    }

    if (grade != 0) {
      params.push(`grade=${grade}`);
    }

    let url = `http://127.0.0.1:3001/api/Teachers/search${
      params ? `?${params.join("&")}` : ``
    }`;

    if (params != []) {
      axios
        .get(url)
        .then((response) => {
          setFilteredTeachers(response.data.Teachers);
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
    // prevent default?
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
      </Row>
      <br />

      {filteredTeachers.length === 0 ? (
        <Typography
          variant="body1"
          align="center"
          data-testid="teacherListing-noTeacherssAvailable"
        >
          לא נמצאו מורים.
        </Typography>
      ) : (
        <Accordion data-testid={"teacherListing-list"} defaultActiveKey="0">
          {filteredTeachers.map((teacher) => (
            <Accordion.Item key={teacher.id} eventKey={teacher.id}>
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
                      <Row xs="auto">
                        <Col xs>
                          <ListGroup variant="flush">
                            {teacher.canTeach.map((item, index) => (
                              <ListGroup.Item key={index}>
                                {idToSubject[item.subject]} (מכיתה{" "}
                                {idToGrade[item.lowerGrade]} עד כיתה{" "}
                                {idToGrade[item.higherGrade]})
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row xs="auto">
                    <Col>
                      <button>{teacher.phoneNumber}</button>
                    </Col>
                    <Col>
                      <button>{teacher.socialProfileLink}</button>
                    </Col>
                  </Row>
                </Container>
              </Accordion.Header>
              <Accordion.Body>{teacher.aboutMe}</Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Container>
  );
};

export default TeachersListing;
