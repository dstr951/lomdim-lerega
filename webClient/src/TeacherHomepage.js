import React from 'react';
import { Container, Row, Col, ListGroup, Image, Button, Card } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "./component/Header";
import './style/TeacherHomepage.css';
import './style/App.css';



const TeacherHomepage = () => {
    const location = useLocation();
    const teacherData = location.state ? location.state.teacher : TeacherHomepage.defaultProps.teacher;
    const navigate = useNavigate();

    const handleDisconnect = (email) => {
        navigate('/', { state: { email } });
    }

    const idToSubject = {
        1: 'מתמטיקה',
        2: 'היסטוריה',
        3: 'אנגלית',
        4: "לשון",
        5: "ביולוגיה",
        6: "פיזיקה",
        7: "כימיה",
        8: "ערבית",
        9: "תנך",
        10: "מדעי המחשב"
    }

    const idToGrade = {
        1: 'א\'',
        2: 'ב\'',
        3: 'ג\'',
        4: 'ד\'',
        5: 'ה\'',
        6: 'ו\'',
        7: 'ז\'',
        8: 'ח\'',
        9: 'ט\'',
        10: 'י\'',
        11: 'יא\'',
        12: 'יב\'',
    };

    return (
        <div className="teacher-homepage-wrapper">
            <Header/>
            <div className="main">
                <div className="section">
                    <div className="title" id="orange-background">
                        הפרופיל שלי
                    </div>    
                    <div className="text-section">
                        <div className='two-cols-container'>
                            <div className="right-section">
                                <Image src={teacherData.profilePicture} roundedCircle width="250" className="profile-img" />
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
                                    <button id="orange-button">התנתקות</button>
                                    פססס לא לשכוח לתת פונקציונליות
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
            { subject: "פיזיקה", lowerGrade: "ג'", higherGrade: "י\"ב" }
        ]
    }
};

export default TeacherHomepage;
