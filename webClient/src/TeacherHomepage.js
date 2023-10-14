import React from "react";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Image,
  Button,
  Card,
} from "react-bootstrap";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { idToGrade, idToSubject } from "./Converters";
import Header from "./component/Header";
import './style/TeacherHomepage.css';
import './style/App.css';

const TeacherHomepage = () => {
  const location = useLocation();
  const teacherData = location.state
    ? location.state.teacher
    : TeacherHomepage.defaultProps.teacher;
  const token = location.state?.token;
  const navigate = useNavigate();

  const handleDisconnect = (email) => {
    navigate("/", { state: { email } });
  };


    return (
        <div className="teacher-homepage-wrapper">
            <Header mode="1"/>
            <div className="main-section">
                <div className="section">
                    <div className="title" id="orange-background">
                        הפרופיל שלי
                    </div>    
                    <div className="text-section">
                        <div className='two-cols-container'>
                            <div className="right-section">
                                <Image src={`data:image/jpeg;base64,${teacherData.profilePicture}`} roundedCircle width="250" className="profile-img" />
                                    <div className='info-box'>
                                    <div className='text-box'>
                                        <h2 id="h2-orange">{teacherData.firstName} {teacherData.lastName}</h2>
                                        <p>
                                            <strong>גיל:</strong> {teacherData.age} <br/>
                                            <strong>טלפון:</strong> {teacherData.phoneNumber}<br/><br/>
                                            <a id="orange-text" href={teacherData.socialProfileLink} target="_blank" rel="noopener noreferrer">
                                                        קישור לפרופיל החברתי</a><br/>
                                        </p>
                                    </div>
                                    <Link to="/login">
                                    <button id="orange-button">התנתקות</button>
                                    </Link>
                                </div>
                            </div>
                            <div className="left-section">
                                <h2 id="h2-orange">על עצמי:</h2>
                                <p className="list-item">{teacherData.aboutMe}</p>
                                <br/>
                                <h2 id="h2-orange">מקצועות שאני מלמד</h2>
                                    <ListGroup variant="flush" className="list">
                                        {teacherData.canTeach.map((item, index) => (
                                            <ListGroup.Item key={index} className="list-item">
                                                {idToSubject[item.subject]} (מכיתה {idToGrade[item.lowerGrade]} עד כיתה {idToGrade[item.higherGrade]})
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
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
    profilePicture: "https://via.placeholder.com/150",
    aboutMe: "אני מורה למתמטיקה ופיזיקה עם ניסיון של למעלה מ-10 שנים.",
    canTeach: [
      { subject: "מתמטיקה", lowerGrade: "א'", higherGrade: "ז'" },
      { subject: "פיזיקה", lowerGrade: "ג'", higherGrade: 'י"ב' },
    ],
  },
};

export default TeacherHomepage;
