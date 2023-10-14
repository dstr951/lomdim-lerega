import React, { useState, useEffect } from "react";
import { Row, Col, Form, Button } from "react-bootstrap";
import { idToGrade, idToSubject } from "../Converters";
import "../style/App.css";
import "../style/TeachersListing.css";

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
    <div className="filter-container" id="search-teacher">
      <Form.Select
        size="sm"
        className="selectForm"
        id="filter-lesson"
        value={subject}
        onChange={handleSubjectChange}
      >
        <option value={0}>כל המקצועות</option>
        {Object.keys(idToSubject).map((id) => (
          <option value={id} key={id}>
            {idToSubject[id]}
          </option>
        ))}
      </Form.Select>
      <Form.Select
        size="sm"
        className="selectForm"
        id="filter-class"
        value={grade}
        onChange={handleGradeChange}
      >
        <option value={0}>כל הכיתות</option>
        {Object.keys(idToGrade).map((id) => (
          <option value={id} key={id}>
            {idToGrade[id]}
          </option>
        ))}
      </Form.Select>

      <button
        onClick={() => {
          handleFilterChange(subject, grade);
        }}
      >
        החל סינון
      </button>
    </div>
  );
};
export default FilterTeachers;
