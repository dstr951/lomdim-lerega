import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  ListGroup,
  CloseButton,
} from "react-bootstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { gradeToId, subjectToId, idToSubject, idToGrade } from "./Converters";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passConfirm, setPassConfirm] = useState("");

  // Teacher fields
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("מתמטיקה");
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

  const navigate = useNavigate();

  const handleAddSubject = () => {
    const newSubject = {
      subject: selectedSubject,
      range: `${startClass} עד ${endClass}`,
    };
    setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
  };

  const handleRemoveSubject = (index) => {
    const updatedSubjects = [...subjects];
    updatedSubjects.splice(index, 1);
    setSubjects(updatedSubjects);
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /^[A-Za-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/i.test(password)
    );
  };

  const validatePhoneNumber = (number) => {
    return /^\d+$/.test(number);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = function () {
        const base64 = reader.result.split(",")[1];
        setProfilePicture(base64);
      };
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !email ||
      !password ||
      !passConfirm ||
      (userType === "teacher" &&
        (!teacherFirstName ||
          !teacherLastName ||
          !age ||
          !socialProfileLink ||
          !phoneNumber ||
          subjects.length === 0)) ||
      (userType === "student" &&
        (!parentFirstName ||
          !parentLastName ||
          !parentPhoneNumber ||
          !studentFirstName ||
          !studentLastName))
    ) {
      return alert("נא למלא את כל השדות הדרושים.");
    }

    if (password !== passConfirm) {
      return alert("הסיסמאות אינן תואמות.");
    }

    if (!validatePassword(password)) {
      return alert(
        "הסיסמה צריכה להיות באורך של 8 תווים לפחות ולהכיל אותיות באנגלית, מספרים וסימנים בלבד."
      );
    }

    if (userType === "teacher" && !validatePhoneNumber(phoneNumber)) {
      return alert("מספר הטלפון של המורה צריך להכיל מספרים בלבד.");
    }

    if (userType === "student" && !validatePhoneNumber(parentPhoneNumber)) {
      return alert("מספר הטלפון של ההורה / האפוטרופוס צריך להכיל מספרים בלבד.");
    }

    if (userType === "teacher") {
      const canTeachFormatted = subjects.map((sub) => ({
        subject: subjectToId[sub.subject],
        lowerGrade: gradeToId[sub.range.split(" עד ")[0]],
        higherGrade: gradeToId[sub.range.split(" עד ")[1]],
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
        canTeach: canTeachFormatted,
      };

      try {
        const response = await axios.post(
          `${SERVER_ADDRESS}/api/Teachers`,
          teacherData
        );
        if (response.status === 200) {
          alert("ההרשמה בוצעה בהצלחה.");
          navigate("/", { state: { email } });
        } else {
          alert("תקלה כללית, אנא נסה שנית מאוחר יותר.");
        }
      } catch (error) {
        if (error.response?.status === 409) {
          console.log("im at 409 clause");
          alert("אימייל זה כבר בשימוש");
        } else {
          alert("ההרשמה נכשלה. אנא נסה שוב מאוחר יותר.");
          console.error(error);
        }
      }
    } else if (userType === "student") {
      const studentData = {
        email,
        password,
        parent: {
          firstName: parentFirstName,
          lastName: parentLastName,
          phoneNumber: parentPhoneNumber,
        },
        student: {
          firstName: studentFirstName,
          lastName: studentLastName,
          grade: gradeToId[studentClass],
        },
      };

      try {
        const response = await axios.post(
          `${SERVER_ADDRESS}/api/Students`,
          studentData
        );
        if (response.status === 200) {
          alert("ההרשמה בוצעה בהצלחה.");
          navigate("/", { state: { email } });
        } else {
          alert("ההרשמה נכשלה. אנא נסה שוב מאוחר יותר.");
        }
      } catch (error) {
        if (error.response?.status === 409) {
          console.log("im at 409 clause");
          alert("אימייל זה כבר בשימוש");
        } else {
          alert("ההרשמה נכשלה. אנא נסה שוב מאוחר יותר.");
          console.error(error);
        }
      }
    }
  };

  return (
    <Container className="mt-3" dir="rtl">
      <Row className="mb-3">
        <Col className="text-center">
          <h1>הרשמה</h1>
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label className="mb-2">בחר סוג משתמש:</Form.Label>
              <Form.Check
                custom
                type="radio"
                id="custom-radio-teacher"
                label="מורה"
                name="userType"
                inline
                onChange={() => setUserType("teacher")}
              />
              <Form.Check
                custom
                type="radio"
                id="custom-radio-student"
                label="תלמיד"
                name="userType"
                inline
                checked={userType === "student"}
                onChange={() => setUserType("student")}
              />
            </Form.Group>
            {userType === "teacher" && (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="mb-2">שם פרטי:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="הכנס שם פרטי"
                        value={teacherFirstName}
                        onChange={(e) => setTeacherFirstName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="mb-2">שם משפחה:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="הכנס שם משפחה"
                        value={teacherLastName}
                        onChange={(e) => setTeacherLastName(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-4">
                  <Form.Label className="mb-2">מקצוע:</Form.Label>
                  <Row className="mb-2">
                    <Col md={3}>
                      <Form.Control
                        as="select"
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                      >
                        {Object.entries(idToSubject).map(([id, subject]) => (
                          <option key={id} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        as="select"
                        value={startClass}
                        onChange={(e) => setStartClass(e.target.value)}
                      >
                        {Object.entries(idToGrade).map(([id, grade]) => (
                          <option key={id} value={grade}>
                            {grade}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={1} className="text-center">
                      עד
                    </Col>
                    <Col md={3}>
                      <Form.Control
                        as="select"
                        value={endClass}
                        defaultValue='י"ב'
                        onChange={(e) => setEndClass(e.target.value)}
                      >
                        {Object.entries(idToGrade).map(([id, grade]) => (
                          <option key={id} value={grade}>
                            {grade}
                          </option>
                        ))}
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
                        <CloseButton
                          size="sm"
                          onClick={() => handleRemoveSubject(index)}
                        />
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>גיל:</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="הכנס גיל"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>על עצמי:</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    placeholder="ספר על עצמך"
                    value={aboutMe}
                    onChange={(e) => setAboutMe(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>תמונה:</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>קישור לפרופיל חברתי:</Form.Label>
                  <Form.Control
                    type="url"
                    placeholder="הכנס קישור"
                    value={socialProfileLink}
                    onChange={(e) => setSocialProfileLink(e.target.value)}
                  />
                </Form.Group>
                <Form.Group className="mb-4">
                  <Form.Label>מספר טלפון</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="הכנס מספר טלפון"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </Form.Group>
              </>
            )}
            {userType === "student" && (
              <Row>
                <Col md={6}>
                  <h4 className="mb-3">פרטי הורה / אפוטרופוס</h4>
                  <Form.Group className="mb-4">
                    <Form.Label>שם:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="הכנס שם ההורה"
                      value={parentFirstName}
                      onChange={(e) => setParentFirstName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>שם משפחה:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="הכנס שם משפחה"
                      value={parentLastName}
                      onChange={(e) => setParentLastName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>טלפון:</Form.Label>
                    <Form.Control
                      type="tel"
                      placeholder="הכנס טלפון הורה / אפוטרופוס"
                      value={parentPhoneNumber}
                      onChange={(e) => setParentPhoneNumber(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <h4 className="mb-3">פרטי הילד</h4>
                  <Form.Group className="mb-4">
                    <Form.Label>שם:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="הכנס שם הילד"
                      value={studentFirstName}
                      onChange={(e) => setStudentFirstName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label>שם משפחה:</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="הכנס שם משפחה"
                      value={studentLastName}
                      onChange={(e) => setStudentLastName(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group className="mb-4">
                    <Form.Label className="mb-2">כיתה:</Form.Label>
                    <Form.Control
                      as="select"
                      value={studentClass}
                      onChange={(e) => setStudentClass(e.target.value)}
                    >
                      {Object.entries(idToGrade).map(([id, grade]) => (
                        <option key={id} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
              </Row>
            )}
            <hr className="my-4" />
            {}
            <Row>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="mb-2">אימייל:</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="הכנס כתובת אימייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="mb-2">סיסמה:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="הכנס סיסמה"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="mb-2">אימות סיסמה:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="אימות סיסמה"
                    value={passConfirm}
                    onChange={(e) => setPassConfirm(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button variant="primary" type="submit" className="w-100 mb-3">
              הרשם
            </Button>
            <Link to="/">
              <Button variant="secondary" className="w-100">
                חזור
              </Button>
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
