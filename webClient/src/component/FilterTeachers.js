import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { idToGrade, idToSubject } from "../Converters";

const FilterTeachers = ({ handleFilterChange }) => {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const handleSubjectChange = (event) => {
    setSubject(event.target.value);
  };

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };
  return (
    <>
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
          <Button
            onClick={() => {
              handleFilterChange(subject, grade);
            }}
          >
            החל סינון
          </Button>
        </Col>
      </Row>
    </>
  );
};
export default FilterTeachers;
