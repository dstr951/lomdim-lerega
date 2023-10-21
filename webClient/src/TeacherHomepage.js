import React, { useState, useEffect } from "react";
import { Image, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { idToGrade, idToSubject } from "./Converters";
import Header from "./component/Header";
import "./style/TeacherHomepage.css";
import "./style/App.css";
import axios from "axios";
import Swal from "sweetalert2";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS
  ? process.env.SERVER_ADDRESS
  : "http://localhost:3001";

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

  const confirmAndApproveRequest = () => {
    Swal.fire({
      title: "?האם אתה בטוח",
      text: '.בעת אישור הבקשה, דוא"ל יישלח אליך ואל התלמיד עם פרטי יצירת הקשר של כל אחד, כך שתוכלו ליצור קשר אחד עם השני ולקבוע שיעור',
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "כן, אשר את הבקשה",
      cancelButtonText: "ביטול",
    }).then((result) => {
      if (result.isConfirmed) {
        approveRequest();
        Swal.fire("!אושר", "הבקשה אושרה בהצלחה", "success");
      }
    });
  };

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

  const confirmAndRejectRequest = () => {
    Swal.fire({
      title: "?האם אתה בטוח",
      text: "ברגע שתבטל את הבקשה, לא תוכל לשחזר אותה",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "כן, בטל את הבקשה",
      cancelButtonText: "חזור",
    }).then((result) => {
      if (result.isConfirmed) {
        rejectRequest();
        Swal.fire("הבקשה נדחתה בהצלחה", "", "success");
      }
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
        <button
          variant="success"
          className="mr-2"
          onClick={confirmAndApproveRequest}
        >
          אשר
        </button>
        <button variant="danger" onClick={confirmAndRejectRequest}>
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
  const [teacherImage, setTeacherImage] = useState("");

  const handleRequestAction = (requestId) => {
    setTeachingRequests((prevRequests) =>
      prevRequests.filter((request) => request._id !== requestId)
    );
  };

  useEffect(() => {
    const imageURL = `${SERVER_ADDRESS}/api/Teachers/${teacherData.email}/profilePicture`;
    axios
      .get(imageURL, {
        headers: {
          Authorization: token,
        },
      })
      .then((response) => {
        setTeacherImage(response.data.profilePicture);
      })
      .catch((error) => {
        console.error("Error fetching image:", error);
        console.error("Error response:", error.response);
      });
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
                  src={`data:image/jpeg;base64,${teacherImage}`}
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
    profilePicture: "",
    aboutMe:
      "אתם צופים בדף של מורה לא קיים, אם אתם רואים את הדף הזה זאת אומרת שהייתה שגיאה בהבאת הנתונים מהשרת או שהגעתם לעמוד למרות שאתם לא מחוברים. אנא חזרו למסך ההתחברות והתחברו משם",
    canTeach: [
      { subject: "מתמטיקה", lowerGrade: "א'", higherGrade: "ז'" },
      { subject: "פיזיקה", lowerGrade: "ג'", higherGrade: 'י"ב' },
    ],
  },
};

export default TeacherHomepage;
