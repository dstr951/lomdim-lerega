import React, { useState } from "react";
import { Container, Row, Col, Form, Button, ListGroup, CloseButton, FormGroup } from "react-bootstrap";
import axios from 'axios';
import Header from "./component/Header";
import './style/Signup.css';
const SERVER_ADDRESS = process.env.SERVER_ADDRESS

const Signup = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Teacher fields
    const [subjects, setSubjects] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('מתמטיקה');
    const [startClass, setStartClass] = useState("א'");
    const [endClass, setEndClass] = useState('י"ב');
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

    const oldt = (
        <>
            <Row>
                <Col md={6}>
                    <Form.Group className="mb-4">
                        <Form.Label className="mb-2">שם פרטי:</Form.Label>
                        
                    </Form.Group>
                </Col>
                <Col md={6}>
                    <Form.Group className="mb-4">
                        <Form.Label className="mb-2">שם משפחה:</Form.Label>
                        <Form.Control type="text" placeholder="הכנס שם משפחה" value={teacherLastName} onChange={(e) => setTeacherLastName(e.target.value)} />
                    </Form.Group>
                </Col>
            </Row>
            <Form.Group className="mb-4">
                <Form.Label className="mb-2">מקצוע:</Form.Label>
                <Row className="mb-2">
                    <Col md={3}>
                        <Form.Control as="select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
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
                    </Col>
                    <Col md={3}>
                        <Form.Control as="select" value={startClass} onChange={(e) => setStartClass(e.target.value)}>
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
                    </Col>
                    <Col md={1} className="text-center">
                        עד
                    </Col>
                    <Col md={3}>
                        <Form.Control as="select" value={endClass} defaultValue='י"ב' onChange={(e) => setEndClass(e.target.value)}>
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
                    </Col>
                    <Col md={2}>
                        <Button onClick={handleAddSubject}>הוסף</Button>
                    </Col>
                </Row>
                <ListGroup className="mt-3">
                    {subjects.map((item, index) => (
                        <ListGroup.Item key={index}>
                            {`${item.subject} (${item.range})`}
                            <CloseButton size="sm" onClick={() => handleRemoveSubject(index)} />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>גיל:</Form.Label>
                <Form.Control type="number" placeholder="הכנס גיל" value={age} onChange={(e) => setAge(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>על עצמי:</Form.Label>
                <Form.Control as="textarea" rows={4} placeholder="ספר על עצמך" value={aboutMe} onChange={(e) => setAboutMe(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>תמונה:</Form.Label>
                <Form.Control type="file" accept="image/*" value={profilePicture} onChange={(e) => setProfilePicture(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>קישור לפרופיל חברתי:</Form.Label>
                <Form.Control type="url" placeholder="הכנס קישור" value={socialProfileLink} onChange={(e) => setSocialProfileLink(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-4">
                <Form.Label>מספר טלפון</Form.Label>
                <Form.Control type="text" placeholder="תביא מספר אפס" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </Form.Group>
        </>
    )
    const teacherSignUp = (<div>
        <h2>פרטים אישיים</h2>
        <FormGroup>
            <p>שם פרטי-</p>
            <Form.Control type="text" placeholder="הכנס שם פרטי" value={teacherFirstName} onChange={(e) => setTeacherFirstName(e.target.value)} />
            <p>שם משפחה-</p>
            <Form.Control type="text" placeholder="הכנס שם משפחה" value={teacherLastName} onChange={(e) => setTeacherLastName(e.target.value)} />
            <div className="row-container">
            <div className="select">
            <p>מקצוע - </p>
                <Form.Control as="select" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
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
                <Form.Control as="select" value={startClass} onChange={(e) => setStartClass(e.target.value)}>
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
                <Form.Control as="select" value={endClass} defaultValue='י"ב' onChange={(e) => setEndClass(e.target.value)}>
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
            <button onClick={handleAddSubject}>הוסף</button>
            </div>
            <ListGroup className="mt-3">
                    {subjects.map((item, index) => (
                        <ListGroup.Item key={index}>
                            {`${item.subject} (${item.range})`}
                            <CloseButton size="sm" onClick={() => handleRemoveSubject(index)} />
                        </ListGroup.Item>
                    ))}
                </ListGroup>
        </FormGroup>
    </div>)
    const studentSignUp=(<div>
        <h2>פרטים אישיים</h2>
        <FormGroup>
            <p>שם פרטי</p>
            <Form.Control type="text" placeholder="הכנס שם פרטי" value={teacherFirstName} onChange={(e) => setTeacherFirstName(e.target.value)} />
        </FormGroup>
    </div>
    )
    
    const olds = (
        <Row>
            <Col md={6}>
                <h4 className="mb-3">פרטי ההורה</h4>
                <Form.Group className="mb-4">
                    <Form.Label>שם:</Form.Label>
                    <Form.Control type="text" placeholder="הכנס שם ההורה" value={parentFirstName} onChange={(e) => setParentFirstName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label>שם משפחה:</Form.Label>
                    <Form.Control type="text" placeholder="הכנס שם משפחה" value={parentLastName} onChange={(e) => setParentLastName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label>טלפון:</Form.Label>
                    <Form.Control type="tel" placeholder="הכנס טלפון ההורה" value={parentPhoneNumber} onChange={(e) => setParentPhoneNumber(e.target.value)} />
                </Form.Group>
            </Col>
            <Col md={6}>
                <h4 className="mb-3">פרטי הילד</h4>
                <Form.Group className="mb-4">
                    <Form.Label>שם:</Form.Label>
                    <Form.Control type="text" placeholder="הכנס שם הילד" value={studentFirstName} onChange={(e) => setStudentFirstName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label>שם משפחה:</Form.Label>
                    <Form.Control type="text" placeholder="הכנס שם משפחה" value={studentLastName} onChange={(e) => setStudentLastName(e.target.value)} />
                </Form.Group>
                <Form.Group className="mb-4">
                    <Form.Label className="mb-2">כיתה:</Form.Label>
                    <Form.Control as="select" value={studentClass} onChange={(e) => setStudentClass(e.target.value)}>
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
                </Form.Group>
            </Col>
        </Row>
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
                        <div className="buttonsRow"><p>אני</p></div>
                        <div className="buttonsRow">
                            <button
                                className="w-100 m-0" 
                                id="teacherButton"
                                label="מורה"
                                name="userType"
                                inline
                                onClick={() => setUserType("teacher")}
                            >מורה</button>
                            <button
                                className="w-100 m-0" 
                                id="studentButton"
                                label="תלמיד"
                                name="userType"
                                inline
                                checked={userType === "student"}
                                onClick={() => setUserType("student")}
                            >תלמיד</button>
                        </div>
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
