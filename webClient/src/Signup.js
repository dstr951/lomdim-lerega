import React, { useState } from "react";
import { Container, Row, Col, Form, Button, ListGroup, CloseButton, FormGroup } from "react-bootstrap";
import axios from 'axios';
import Header from "./component/Header";
import './style/Signup.css';
const SERVER_ADDRESS = process.env.SERVER_ADDRESS
import { ReactSVG } from 'react-svg'

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Teacher fields
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('מתמטיקה');
    const [startClass, setStartClass] = useState("א'");
    const [endClass, setEndClass] = useState("א'");
    const [age, setAge] = useState("");
    const [socialProfileLink, setSocialProfileLink] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePicture, setProfilePicture] = useState(""); 
    const [aboutMe, setAboutMe] = useState("");
    const [teacherFirstName, setTeacherFirstName] = useState("");
    const [teacherLastName, setTeacherLastName] = useState("");

    // Student fields
    const [parentFirstName, setParentFirstName] = useState("");
    const [parentLastName, setParentLastName] = useState("");
    const [parentPhoneNumber, setParentPhoneNumber] = useState("");
    const [studentFirstName, setStudentFirstName] = useState("");
    const [studentLastName, setStudentLastName] = useState("");
    const [studentClass, setStudentClass] = useState("א'");

    const [userType, setUserType] = useState("student");

    const subjectToId = {
        'מתמטיקה': 1,
        'היסטוריה': 2,
        'אנגלית': 3,
        "לשון": 4,
        "ביולוגיה": 5,
        "פיזיקה": 6,
        "כימיה": 7, 
        "ערבית": 8,
        "תנך": 9,
        "מדעי המחשב": 10
    }

    const gradeToId = {
        'א\'': 1,
        'ב\'': 2,
        'ג\'': 3,
        'ד\'': 4,
        'ה\'': 5,
        'ו\'': 6,
        'ז\'': 7,
        'ח\'': 8,
        'ט\'': 9,
        'י\'': 10,
        'י"א': 11,    
        'י"ב': 12,    
    };

    const handleAddSubject = () => {
        const newSubject = {
            subject: selectedSubject,
            range: `${startClass} עד ${endClass}`
        };
        setSubjects(prevSubjects => [...prevSubjects, newSubject]);
    }

    const handleRemoveSubject = (index) => {
        const updatedSubjects = [...subjects];
        updatedSubjects.splice(index, 1);
        setSubjects(updatedSubjects);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (userType === "teacher") {
            const canTeachFormatted = subjects.map(sub => ({
                subject: subjectToId[sub.subject],
                lowerGrade: gradeToId[sub.range.split(' עד ')[0]],
                higherGrade: gradeToId[sub.range.split(' עד ')[1]],
            }));

            const teacherData = {
                email,
                password,
                firstName: teacherFirstName,
                lastName: teacherLastName,
                age: Number(age),
                socialProfileLink,
                phoneNumber,
                profilePicture,
                aboutMe,
                canTeach: canTeachFormatted
            };

            try {
                const response = await axios.post(`${SERVER_ADDRESS}/api/Teachers`, teacherData);
                if (response.status === 200) {
                    console.log("Teacher created successfully");
                    // Maybe redirect to another page or show a success message
                }
            } catch (error) {
                console.error("Error creating teacher:", error);
                // Handle error (show an error message or handle it another way)
            }
        } else if (userType === "student") {
            const studentData = {
                email,
                password,
                parent: {
                    firstName: parentFirstName,
                    lastName: parentLastName,
                    phoneNumber: parentPhoneNumber
                },
                student: {
                    firstName: studentFirstName,
                    lastName: studentLastName,
                    grade: gradeToId[studentClass]
                }
            };

            try {
                const response = await axios.post(`${SERVER_ADDRESS}/api/Students`, studentData); // Adjust the endpoint if needed
                if (response.status === 200) {
                    console.log("Student created successfully");
                    // Maybe redirect to another page or show a success message
                }
            } catch (error) {
                console.error("Error creating student:", error);
                // Handle error (show an error message or handle it another way)
            }
        }
    };

    const teacherSignUp = (<div>
        <h2>פרטים אישיים</h2>
        <FormGroup>
            <p>שם פרטי-</p>
            <Form.Control type="text" placeholder="השם הפרטי שלך" value={teacherFirstName} onChange={(e) => setTeacherFirstName(e.target.value)} />
            <p>שם משפחה-</p>
            <Form.Control type="text" placeholder="שם המשפחה שלך" value={teacherLastName} onChange={(e) => setTeacherLastName(e.target.value)} />
            <p>גיל</p>
            <Form.Control type="text" placeholder="הגיל שלך" value={age} onChange={(e) => setAge(e.target.value)} />
            <p>מספר טלפון</p>
            <Form.Control type="text" placeholder="מספר הטלפון שלך" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            <br/>
            <h2>פרטים מקצועיים</h2>
            <div className="select-container">
            <div className="select">
            <p>מקצוע - </p>
                <Form.Control as="select" className="selectForm" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
                    <option value="מתמטיקה">מתמטיקה</option>
                    <option value="היסטוריה">היסטוריה</option>
                    <option value="אנגלית">אנגלית</option>
                    <option value="לשון">לשון</option>
                    <option value="ביולוגיה">ביולוגיה</option>
                    <option value="כימיה">פיזיקה</option>
                    <option value="כימיה">כימיה</option>
                    <option value="ערבית">ערבית</option>
                    <option value="תנך">תנ"ך</option>
                    <option value="מדעי המחשב">מדעי המחשב</option>
                </Form.Control>
            </div>
            <div>
            <p> מ-  </p>
                <Form.Control as="select" className="selectForm" value={startClass} onChange={(e) => setStartClass(e.target.value)}>
                    <option>א'</option>
                    <option>ב'</option>
                    <option>ג'</option>
                    <option>ד'</option>
                    <option>ה'</option>
                    <option>ו'</option>
                    <option>ז'</option>
                    <option>ח'</option>
                    <option>ט'</option>
                    <option>י'</option>
                    <option>י"א</option>
                    <option>י"ב</option>
                </Form.Control>
            </div>
            <div>
                <p> עד- </p>
                <Form.Control as="select" className="selectForm" value={endClass} defaultValue='י"ב' onChange={(e) => setEndClass(e.target.value)}>
                <option>א'</option>
                <option>ב'</option>
                <option>ג'</option>
                <option>ד'</option>
                <option>ה'</option>
                <option>ו'</option>
                <option>ז'</option>
                <option>ח'</option>
                <option>ט'</option>
                <option>י'</option>
                <option>י"א</option>  
                <option>י"ב</option> 
                </Form.Control>
            </div>
            <button className="addButton" onClick={handleAddSubject}>הוסף</button>
            
            </div>
            <ListGroup className="list">
                    {subjects.map((item, index) => (
                        <ListGroup.Item key={index} className="listItem">
                            {`${item.subject} (${item.range})`}
                            <div><ReactSVG src="./assets/close.svg" className="closeButton" onClick={() => handleRemoveSubject(index)}/></div>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            <div className="addFile-container">
                    <p>תמונה-</p>
                    <Form.Control type="file" className="fileInput" accept="image/*"/>

{/*                     <p id="cert">תעודת הוראה-</p>
                    <Form.Control type="file" className="fileInput" accept="pdf/*"/>
                 */}
                <div>
                <div>
            </div>
            </div>

            </div>
            <p>קישור לפרופיל חברתי-</p>
            <Form.Control type="url" placeholder="קישור לפרופיל החברתי שלך" value={socialProfileLink} onChange={(e) => setSocialProfileLink(e.target.value)}/>
            <p> קצת עלי בכמה מילים...</p>
            <Form.Control type="text" placeholder="מה המקצועות שאני מלמד/ת, כמה ניסיון יש לי, איפה אני מלמד/ת..." value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />

        </FormGroup>
    </div>)
    const studentSignUp=(<div>
        <h2>פרטי תלמיד</h2>
        <FormGroup>
            <p>שם פרטי תלמיד-</p>
            <Form.Control type="text" placeholder="שם פרטי תלמיד" value={studentFirstName} onChange={(e) => setStudentFirstName(e.target.value)} />
            <p>שם משפחה תלמיד-</p>
            <Form.Control type="text" placeholder="שם משפחה תלמיד" value={studentLastName} onChange={(e) => setStudentLastName(e.target.value)} />
            <p>כתה-</p>
            <Form.Control as="select" className="selectForm" value={studentClass} onChange={(e) => setStudentClass(e.target.value)}>
                        <option>א'</option>
                        <option>ב'</option>
                        <option>ג'</option>
                        <option>ד'</option>
                        <option>ה'</option>
                        <option>ו'</option>
                        <option>ז'</option>
                        <option>ח'</option>
                        <option>ט'</option>
                        <option>י'</option>
                        <option>י"א</option>
                        <option>י"ב</option>
                    </Form.Control>
            <br/>
            <h2>פרטי הורה</h2>
            <p>שם משפחה הורה-</p>
            <Form.Control type="text" placeholder="שם פרטי ההורה" value={parentFirstName} onChange={(e) => setParentFirstName(e.target.value)} />
            <p>שם משפחה הורה-</p>
            <Form.Control type="text" placeholder="שם משפחה הורה" value={parentLastName} onChange={(e) => setParentLastName(e.target.value)} />
            <p>מספר טלפון הורה-</p>
            <Form.Control type="tel" placeholder="מספר טלפון ההורה" value={parentPhoneNumber} onChange={(e) => setParentPhoneNumber(e.target.value)} />
        </FormGroup>
    </div>
    )
    
    return (
        
        <div>
            <Header/>
            <div className="main-narrow">
                    <div className="section">
                    <div className="title" style={{backgroundColor: userType == "teacher" ? "#9139E5" : "#E8701F",}}>
                        {userType == "teacher" ? "הרשמה - מורים" : "הרשמה - תלמידים"}
                    </div>
                    <div className="textSection">
                        <Form.Group>
                        <div className="row-container">
                        <p>אני</p>
                            <button 
                                className="buttonsRow"
                                id="teacherButton"
                                label="מורה"
                                name="userType"
                                inline
                                onClick={() => setUserType("teacher")}
                            >מורה</button>
                            <button
                                className="buttonsRow"
                                id="studentButton"
                                label="תלמיד"
                                name="userType"
                                inline
                                checked={userType === "student"}
                                onClick={() => setUserType("student")}
                            >תלמיד</button>
                        </div>
                        </Form.Group>
                        <Form onSubmit={handleSubmit}>
                        <br/>
                        <h2>פרטי התחברות</h2>
                        <p>אימייל-</p>
                        <Form.Control type="email" placeholder="הכנס כתובת אימייל" value={email} onChange={(e) => setEmail(e.target.value)} />
                        <p>סיסמה-</p>
                        <Form.Control type="password" placeholder="הכנס סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} />     
                        <p>אימות סיסמה-</p>
                        <Form.Control type="password" placeholder="אימות סיסמה" value={password} onChange={(e) => setPassword(e.target.value)} />     
                        
                        <br/>
                        {userType === "teacher" && teacherSignUp}
                        {userType === "student" && studentSignUp}
                        <br/>
                        <button variant="primary" type="submit" className="w-100"> הרשם </button>
                        </Form>
                    </div>
                    </div>
                </div>
        </div>
        
    );
}

export default Signup;
