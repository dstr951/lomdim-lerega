import React, { useState } from "react";
import {
  Accordion,
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  Image,
} from "react-bootstrap";
import { idToGrade, idToSubject } from "../Converters";
import ContactTeacherModal from "./ContactTeacherModal";

const TeacherAccordion = ({props, filteredTeachers, token }) => {
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState({});
  const [activeSection, setActiveSection] = React.useState(null);


  const toggleSection = (index) => {
    if (index === activeSection) {
      setActiveSection(null);
    } else {
      setActiveSection(index);
    }
  };

  return (
    <div className="accordion-list">
      {filteredTeachers?.map((teacher) => (
        <div 
        eventKey={teacher.email}
        key={teacher.email}
        className="accordion"
        onClick={() => toggleSection(teacher.email)}
        >
          <div className="accordion-header">
            <Image
              src={`data:image/jpeg;base64,${teacher.profilePicture}`}
              roundedCircle
              width={100}
              height={100}
              className="mb-3"
            />
            <div>
              <h2 id="personal-title">{teacher.firstName} {teacher.lastName}{" "}</h2>
              <div className="row-container">
              <button
                          href={teacher.socialProfileLink}
                          onClick={() => onClickOpenVacancy(id)}
                        >
                          {"קישור לפרופיל חברתי"}
                </button>
              <button
                variant="primary"
                onClick={() => {
                  setSelectedTeacher({ teacher });
                  setModalShow(true);
                }}
              >
                פנה למורה
              </button>
                </div>
              {teacher.email === activeSection && (
          <div className="accordion-body">
            
            <p> {teacher.aboutMe}</p>
            <ListGroup variant="flush">
                        {teacher?.canTeach?.map((item, index) => (
                          <ListGroup.Item key={index}>
                            {idToSubject[item.subject]} (כיתות{" "}
                            {idToGrade[item.lowerGrade]} עד{" "}
                            {idToGrade[item.higherGrade]})
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
          </div>
        )}
            </div>
          </div>
        </div>
      ))}

    </div>
  );
};
export default TeacherAccordion;
