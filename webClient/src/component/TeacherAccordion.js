import React, { useState, useEffect } from "react";
import axios from "axios";
import { Image } from "react-bootstrap";
import { idToGrade, idToSubject } from "../Converters";
import ContactTeacherModal from "../component/ContactTeacherModal";
import "../style/TeachersListing.css";
import { Link } from "react-router-dom";

const TeacherAccordion = ({ filteredTeachers, token }) => {
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState({});
  const [activeSection, setActiveSection] = React.useState(null);
  const [teacherPictures, setTeacherPictures] = useState({});
  const SERVER_ADDRESS = process.env.SERVER_ADDRESS
    ? process.env.SERVER_ADDRESS
    : "http://localhost:3001";

  const toggleSection = (index) => {
    if (index === activeSection) {
      setActiveSection(null);
    } else {
      setActiveSection(index);
    }
  };

  useEffect(() => {
    filteredTeachers.forEach((teacher) => {
      if (teacherPictures.hasOwnProperty(teacher.email)) {
        return;
      }
      const url = `${SERVER_ADDRESS}/api/Teachers/${teacher.email}/profilePicture`;
      axios
        .get(url, { headers: { Authorization: token } })
        .then((response) => {
          setTeacherPictures((oldTeacherPictures) => {
            const newTeacherPictures = { ...oldTeacherPictures };
            newTeacherPictures[teacher.email] = response.data.profilePicture;
            return newTeacherPictures;
          });
        })
        .catch((error) => console.error(error));
    });
  }, [filteredTeachers]);

  const getPictureFromState = (email) => {
    return teacherPictures[email];
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
                src={`data:image/jpeg;base64,${getPictureFromState(
                  teacher.email
                )}`}
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
