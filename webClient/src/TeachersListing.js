import React, { useState } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import TeacherAccordion from "./component/TeacherAccordion";
import FilterTeachers from "./component/FilterTeachers";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

const TeachersListing = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const token = location?.state?.token;

  const handleDisconnect = () => {
    navigate("/", {});
  };

  const handleSearch = (subject, grade) => {
    setHasSearched(true); 
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

    axios
      .get(url, { headers: { Authorization: token } })
      .then((response) => {
        setTeachers(response.data);
        setFilteredTeachers(response.data);
      })
      .catch((error) => console.error(error));
  };

  return (
    <Container dir="rtl">
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
      <FilterTeachers handleFilterChange={handleSearch} />
      <br />
      {hasSearched ? (
        filteredTeachers?.length === 0 ? (
          <Row
            variant="body1"
            align="center"
            data-testid="teacherListing-noTeacherssAvailable"
          >
            לא נמצאו מורים.
          </Row>
        ) : (
          <TeacherAccordion filteredTeachers={filteredTeachers} token={token} />
        )
      ) : (
        <Row variant="body1" align="center">
          כדי לחפש, בחרו בקטוגריות המתאימות לכם ולחצו על כפתור החיפוש.
        </Row>
      )}
    </Container>
  );
};

export default TeachersListing;