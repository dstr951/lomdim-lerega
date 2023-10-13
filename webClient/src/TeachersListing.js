import React, { useState, useEffect } from "react";
import {
  Accordion,
  Container,
  Row,
  Col,
  Form,
  ListGroup,
  Button,
  Image,
  Card,
} from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { idToGrade, idToSubject } from "./Converters";
import TeacherAccordion from "./component/TeacherAccordion";
import FilterTeachers from "./component/FilterTeachers";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

const TeachersListing = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState(teachers);
  const location = useLocation();
  const [clickedProfile, setClickedProfile] = useState({});
  const navigate = useNavigate();
  const token = location?.state?.token;

  const handleDisconnect = () => {
    navigate("/", {});
  };

  useEffect(() => {
    getTeachers();
  }, []);

  const getTeachers = () => {
    axios
      .get(`${SERVER_ADDRESS}/api/Teachers/all`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setTeachers(response.data);
        setFilteredTeachers(response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleFilterChange = (subject, grade) => {
    const params = [];
    if (subject) {
      params.push(`subject=${subject}`);
    }
    if (grade) {
      params.push(`grade=${grade}`);
    }

    let url = `${SERVER_ADDRESS}/api/Teachers/search`;
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    } else {
      url = `${SERVER_ADDRESS}/api/Teachers/all`;
    }

    if (params.length > 0) {
      axios
        .get(url, { headers: { Authorization: token } })
        .then((response) => {
          setFilteredTeachers(response.data);
        })
        .catch((error) => console.error(error));
    } else {
      setFilteredTeachers(teachers);
    }
  };

  return (
    <Container maxWidth="sm" dir="rtl">
      <Card.Footer align="left">
        <Button variant="primary" onClick={() => handleDisconnect()}>
          התנתק
        </Button>
      </Card.Footer>
      <Row>
        <Col>
          <h1>שנתחיל ללמוד?</h1>
        </Col>
      </Row>
      <FilterTeachers handleFilterChange={handleFilterChange} />
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
        <TeacherAccordion filteredTeachers={filteredTeachers} />
      )}
    </Container>
  );
};

export default TeachersListing;
