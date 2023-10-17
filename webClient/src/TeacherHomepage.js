import React, { useState, useEffect } from "react";
import { Image, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { idToGrade, idToSubject } from "./Converters";
import Header from "./component/Header";
import "./style/TeacherHomepage.css";
import "./style/App.css";
import axios from "axios";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

const ConfirmationModal = ({ isOpen, onClose, onConfirm, firstName }) => {
  const preventBackgroundClick = (e) => {
    e.stopPropagation();
  };

  return isOpen ? (
    <div
      className="confirmation-modal-overlay"
      onClick={onClose}
      shouldCloseOnOverlayClick={false}
    >
      <div className="confirmation-modal" onClick={preventBackgroundClick}>
        <p>האם את/ה בטוח/ה שברצונך לדחות את הבקשה של {firstName}?</p>
        <div className="confirmation-buttons">
          <Button variant="danger" onClick={onConfirm}>
            אני בטוח
          </Button>
          <Button variant="secondary" onClick={onClose}>
            ביטול
          </Button>
        </div>
      </div>
    </div>
  ) : null;
};

const TeachingRequest = ({ request, token, onActionComplete }) => {
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const approveRequest = () => {
    axios
      .post(
        `${SERVER_ADDRESS}/api/TeachingRequests/${request._id}/approve`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(() => {
        onActionComplete(request._id);
      })
      .catch((error) => {
        console.error("Error approving the request:", error);
      });
  };

  const rejectRequest = () => {
    axios
      .post(
        `${SERVER_ADDRESS}/api/TeachingRequests/${request._id}/reject`,
        {},
        {
          headers: {
            Authorization: token,
          },
        }
      )
      .then(() => {
        setIsConfirmationModalOpen(false);
        onActionComplete(request._id);
      })
      .catch((error) => {
        console.error("Error rejecting the request:", error);
        setIsConfirmationModalOpen(false);
      });
  };

  return (
    <div className="about-me-box" id="margin-bottom-8">
      <div>
        <strong>שם:</strong>{" "}
        {request.studentFirstName + " " + request.studentLastName} <br />
        <strong>תאריך:</strong> {new Date(request.created).toLocaleDateString()}{" "}
        <br />
        <strong>מקצוע:</strong> {idToSubject[request.subject]} <br />
        <strong>כיתה:</strong> {idToGrade[request.grade]} <br />
        <strong>הודעה:</strong> {request.messageContent} <br />
      </div>
      <div className="card-buttons d-flex justify-content-center">
        <button variant="success" className="mr-2" onClick={approveRequest}>
          אשר
        </button>
        <button variant="danger" onClick={rejectRequest}>
          דחה
        </button>
      </div>
      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={rejectRequest}
        firstName={request.firstName}
      />
    </div>
  );
};

const NotificationButton = ({
  notifications,
  teachingRequests,
  token,
  handleRequestAction,
}) => {
  const [showRequests, setShowRequests] = useState(false);
  return (
    <>
      <button
        className="notification-button"
        id="orange-button"
        onClick={() => setShowRequests(true)}
      >
        <div className="notification-icon">בקשות ממתינות</div>
        <span className="notification-count">{notifications}</span>
      </button>

      {showRequests && (
        <div className="overlay">
          <div className="requests-modal">
            <div className="title">ההתראות שלי</div>
            <div className="requests-modal-body">
              {teachingRequests.length == 0 ? (
                <p id="center">אין התראות כרגע.</p>
              ) : (
                teachingRequests.map((request) => (
                  <TeachingRequest
                    key={request._id}
                    request={request}
                    token={token}
                    onActionComplete={handleRequestAction}
                  />
                ))
              )}
            </div>

            <div className="d-flex justify-content-center mt-2">
              <button id="close-button" onClick={() => setShowRequests(false)}>
                סגור
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const TeacherHomepage = () => {
  const location = useLocation();
  const teacherData = location.state
    ? location.state.teacher
    : TeacherHomepage.defaultProps.teacher;
  const token = location.state?.token;

  const [teachingRequests, setTeachingRequests] = useState([]);

  const handleRequestAction = (requestId) => {
    setTeachingRequests((prevRequests) =>
      prevRequests.filter((request) => request._id !== requestId)
    );
  };

  useEffect(() => {
    axios
      .get(`${SERVER_ADDRESS}/api/TeachingRequests/myRequests`, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setTeachingRequests(response.data);
      })
      .catch((error) => {
        console.error("Error fetching teaching requests:", error);
        console.error("Error response:", error.response);
      });
  }, [token]);

  return (
    <div className="teacher-homepage-wrapper">
      <Header mode={1} />
      <div className="main-section">
        <div className="section">
          <div className="title" id="orange-background">
            הפרופיל שלי
          </div>
          <div className="text-section">
            <div className="two-cols-container">
              <div className="right-section">
                <Image
                  src={`data:image/jpeg;base64,${teacherData.profilePicture}`}
                  roundedCircle
                  width="250"
                  height="250"
                  className="profile-img"
                />
                <div className="info-box">
                  <div className="text-box">
                    <h2 id="orange-text">
                      {teacherData.firstName} {teacherData.lastName}
                    </h2>
                    <p>
                      <strong>גיל:</strong> {teacherData.age} <br />
                      <a
                        id="orange-text"
                        href={teacherData.socialProfileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        קישור לפרופיל החברתי
                      </a>
                      <br />
                    </p>
                  </div>
                  <div className="button-div">
                    <NotificationButton
                      notifications={teachingRequests.length}
                      teachingRequests={teachingRequests}
                      token={token}
                      handleRequestAction={handleRequestAction}
                    />
                  </div>
                </div>
              </div>
              <div className="left-section">
                <h2 id="orange-text">על עצמי:</h2>
                <p className="about-me-box">{teacherData.aboutMe}</p>
                <br />
                <h2 id="orange-text">מקצועות שאני מלמד</h2>
                <div variant="flush" className="list">
                  {teacherData.canTeach.map((item, index) => (
                    <div key={index} className="list-item">
                      {idToSubject[item.subject]} (מכיתה{" "}
                      {idToGrade[item.lowerGrade]} עד כיתה{" "}
                      {idToGrade[item.higherGrade]})
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

TeacherHomepage.defaultProps = {
  teacher: {
    firstName: "יוסי",
    lastName: "לוי",
    age: "30",
    socialProfileLink: "https://www.example.com/",
    phoneNumber: "0501234567",
    profilePicture:
      "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",
    aboutMe:
      "אני מורה למתמטיקה ופיזיקה עם ניסיון של למעלה מ-10 שניאני מורה למתמטיקה ופיזיקה עם ניסיון של למעלה מ-10 שניאני מורה למתמטיקה ופיזיקה עם ניסיון של למעלה מ-10 שניאני מורה למתמטיקה ופיזיקה עם ניסיון של למעלה מ-10 שנים.",
    canTeach: [
      { subject: "מתמטיקה", lowerGrade: "א'", higherGrade: "ז'" },
      { subject: "פיזיקה", lowerGrade: "ג'", higherGrade: 'י"ב' },
    ],
  },
};

export default TeacherHomepage;
