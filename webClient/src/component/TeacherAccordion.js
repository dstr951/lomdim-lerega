import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { idToGrade, idToSubject } from "../Converters";
import ContactTeacherModal from "../component/ContactTeacherModal";
import "../style/TeachersListing.css";
import { Link } from "react-router-dom";

const TeacherAccordion = ({ filteredTeachers, token }) => {
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
          id={
            teacher.email === activeSection
              ? "accordion-activate"
              : "accordion-deactivate"
          }
        >
          <div className="accordion-header">
            <div id="image-div">
              <Image
                src={`data:image/jpeg;base64,${teacher.profilePicture}`}
                roundedCircle
                width={100}
                height={100}
                className="mb-3"
              />
            </div>
            <div>
              <h2 id="personal-title">
                {teacher.firstName} {teacher.lastName}{" "}
              </h2>
              <div className="row-container">
                <Link to={teacher.socialProfileLink} target="_blank">
                  <button>{"קישור לפרופיל חברתי"}</button>
                </Link>
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
                  <p>
                    {" "}
                    <strong>קצת עלי:</strong> {teacher.aboutMe}
                  </p>
                  <div variant="flush" className="list">
                    {teacher?.canTeach?.map((item, index) => (
                      <div key={index} className="item">
                        {idToSubject[item.subject]} (כיתות{" "}
                        {idToGrade[item.lowerGrade]} עד{" "}
                        {idToGrade[item.higherGrade]})
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
      <ContactTeacherModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        teacher={selectedTeacher}
        token={token}
      />
    </div>
  );
};
export default TeacherAccordion;
