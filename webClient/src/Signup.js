import React, { useState } from "react";
import { Form, ListGroup, FormGroup } from "react-bootstrap";
import axios from "axios";
import Header from "./component/Header";
import "./style/Signup.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useNavigate } from "react-router-dom";
import { gradeToId, subjectToId, idToSubject, idToGrade } from "./Converters";
import { ReactSVG } from "react-svg";
import closeSVG from "../public/assets/close.svg";
import Swal from "sweetalert2";
import imageCompression from "browser-image-compression";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS
  ? process.env.SERVER_ADDRESS
  : "http://localhost:3001";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passConfirm, setPassConfirm] = useState("");

  // Teacher fields
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("בחר מקצוע");
  const [startClass, setStartClass] = useState("בחר כיתה");
  const [endClass, setEndClass] = useState("בחר כיתה");
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
    if (
      selectedSubject != "בחר מקצוע" &&
      startClass != "בחר כיתה" &&
      endClass != "בחר כיתה"
    ) {
      if (gradeToId[startClass] > gradeToId[endClass]) {
        Swal.fire({
          icon: "error",
          title: "משהו השתבש בהרשמה",
          text: "!טווח הכיתות אינו תקין",
        });
        return;
      }
      const newSubject = {
        subject: selectedSubject,
        range: `${startClass} עד ${endClass}`,
      };
      const i = subjects.findIndex((item) => item.subject === selectedSubject);
      if (i != -1) {
        handleRemoveSubject(i);
      }
      setSubjects((prevSubjects) => [...prevSubjects, newSubject]);
    }
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

  function ValidateEmail(email) {
    return /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
      email
    );
  }

  const validatePhoneNumber = (number) => {
    return /^\d+$/.test(number) && number.length === 10;
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const options = {
          maxSizeMB: 0.5, // Adjust this value as per your requirements
          maxWidthOrHeight: 800,
          useWebWorker: true,
        };
        const compressedFile = await imageCompression(file, options);
        const reader = new FileReader();
        reader.readAsDataURL(compressedFile);
        reader.onloadend = function () {
          const base64 = reader.result.split(",")[1];
          setProfilePicture(base64);
        };
      } catch (error) {
        console.error("Image compression failed: ", error);
      }
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
      return Swal.fire({
        icon: "error",
        title: "משהו השתבש בהרשמה",
        text: "נא למלא את כל השדות",
      });
    }

    if (!ValidateEmail(email)) {
      return Swal.fire({
        icon: "error",
        title: "משהו השתבש בהרשמה",
        text: "בדקו שכתובת האימייל שהזנתם תקינה",
      });
    }

    if (password !== passConfirm) {
      return Swal.fire({
        icon: "error",
        title: "משהו השתבש בהרשמה",
        text: "הסיסמאות אינן תואמות",
      });
    }

    if (!validatePassword(password)) {
      return Swal.fire({
        icon: "error",
        title: "משהו השתבש בהרשמה",
        text: "הסיסמה צריכה להיות באורך לפחות 8, להכין מספרים, סימנים ותווים באנגלית בלבד",
      });
    }

    if (userType === "teacher" && !validatePhoneNumber(phoneNumber)) {
      return Swal.fire({
        icon: "error",
        title: "משהו השתבש בהרשמה",
        text: "מספר הטלפון צריך להכיל עשר ספרות",
      });
    }

    if (userType === "student" && !validatePhoneNumber(parentPhoneNumber)) {
      return Swal.fire({
        icon: "error",
        title: "משהו השתבש בהרשמה",
        text: "מספר הטלפון צריך להכיל עשר ספרות",
      });
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
          Swal.fire({
            icon: "success",
            title: "!ההרשמה בוצעה בהצלחה",
          }).then(() => {
            navigate("/login", { state: { email } });
          });
        } else {
          return Swal.fire({
            icon: "error",
            title: "משהו השתבש בהרשמה",
            html: `
              <div dir="rtl">
                אופס, יש לנו תקלה בשרת, אנא נסו שוב מאוחר יותר 
                או פנו אלינו במייל: 
                <span dir="ltr" style="display: inline-block;">
                  <a href="mailto:lomdimlerega@gmail.com">lomdimlerega@gmail.com</a>
                </span>
              </div>
            `,
            confirmButtonText: "אישור",
          });
        }
      } catch (error) {
        if (error.response?.status === 409) {
          console.log("im at 409 clause");
          return Swal.fire({
            icon: "error",
            title: "משהו השתבש בהרשמה",
            text: "נראה שכבר קיים משתמש עם כתובת האימייל הזאת",
          });
        } else {
          return Swal.fire({
            icon: "error",
            title: "משהו השתבש בהרשמה",
            html: `
              <div dir="rtl">
                אופס, יש לנו תקלה בשרת, אנא נסו שוב מאוחר יותר 
                או פנו אלינו במייל: 
                <span dir="ltr" style="display: inline-block;">
                  <a href="mailto:lomdimlerega@gmail.com">lomdimlerega@gmail.com</a>
                </span>
              </div>
            `,
            confirmButtonText: "אישור",
          }).then(() => {
            console.error(error);
          });
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
          Swal.fire({
            icon: "success",
            title: "!ההרשמה בוצעה בהצלחה",
          }).then(() => {
            navigate("/login", { state: { email } });
          });
        } else {
          return Swal.fire({
            icon: "error",
            title: "משהו השתבש בהרשמה",
            html: `
              <div dir="rtl">
                אופס, יש לנו תקלה בשרת, אנא נסו שוב מאוחר יותר 
                או פנו אלינו במייל: 
                <span dir="ltr" style="display: inline-block;">
                  <a href="mailto:lomdimlerega@gmail.com">lomdimlerega@gmail.com</a>
                </span>
              </div>
            `,
            confirmButtonText: "אישור",
          });
        }
      } catch (error) {
        if (error.response?.status === 409) {
          console.log("im at 409 clause");
          return Swal.fire({
            icon: "error",
            title: "משהו השתבש בהרשמה",
            text: "נראה שכבר קיים משתמש עם כתובת האימייל הזאת",
          });
        } else {
          return Swal.fire({
            icon: "error",
            title: "משהו השתבש בהרשמה",
            html: `
              <div dir="rtl">
                אופס, יש לנו תקלה בשרת, אנא נסו שוב מאוחר יותר 
                או פנו אלינו במייל: 
                <span dir="ltr" style="display: inline-block;">
                  <a href="mailto:lomdimlerega@gmail.com">lomdimlerega@gmail.com</a>
                </span>
              </div>
            `,
            confirmButtonText: "אישור",
          }).then(() => {
            console.error(error);
          });
        }
      }
    }
  };

  const color = userType == "teacher" ? "orange-text" : "purple-text";

  const teacherSignUp = (
    <div>
      <h2 id={color}>פרטים אישיים</h2>
      <FormGroup>
        <p>שם פרטי:</p>
        <Form.Control
          type="text"
          placeholder="השם הפרטי שלך"
          value={teacherFirstName}
          onChange={(e) => setTeacherFirstName(e.target.value)}
        />
        <p>שם משפחה:</p>
        <Form.Control
          type="text"
          placeholder="שם המשפחה שלך"
          value={teacherLastName}
          onChange={(e) => setTeacherLastName(e.target.value)}
        />
        <p>גיל:</p>
        <Form.Control
          type="number"
          placeholder="הגיל שלך"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <p>מספר טלפון:</p>
        <Form.Control
          type="text"
          placeholder="מספר הטלפון שלך"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <div className="addFile-container">
          <p>תמונת פרופיל:</p>
          <Form.Control
            type="file"
            className="fileInput"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <p>קישור לפרופיל חברתי:</p>
        <Form.Control
          type="url"
          placeholder="קישור לפרופיל החברתי שלך"
          value={socialProfileLink}
          onChange={(e) => setSocialProfileLink(e.target.value)}
        />
        <br />
        <h2 id={color}>פרטים מקצועיים</h2>
        <div className="select-container">
          <div className="select">
            <p>מקצוע: </p>
            <Form.Control
              as="select"
              className="select-form"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
            >
              <option value={"בחר מקצוע"}>בחר מקצוע</option>
              {Object.entries(idToSubject).map(([id, subject]) => (
                <option key={id} value={subject}>
                  {subject}
                </option>
              ))}
            </Form.Control>
          </div>
          <div>
            <p> מ- </p>
            <Form.Control
              as="select"
              className="select-form"
              value={startClass}
              onChange={(e) => setStartClass(e.target.value)}
            >
              <option value={"בחר כיתה"}>בחר כיתה</option>
              {Object.entries(idToGrade).map(([id, grade]) => (
                <option key={id} value={grade}>
                  {grade}
                </option>
              ))}
            </Form.Control>
          </div>
          <div>
            <p> עד- </p>
            <Form.Control
              as="select"
              className="select-form"
              value={endClass}
              defaultValue='י"ב'
              onChange={(e) => setEndClass(e.target.value)}
            >
              <option value={"בחר כיתה"}>בחר כיתה</option>
              {Object.entries(idToGrade).map(([id, grade]) => (
                <option key={id} value={grade}>
                  {grade}
                </option>
              ))}
            </Form.Control>
          </div>
          <button
            type="button"
            id="orange-background"
            className="addButton"
            onClick={handleAddSubject}
          >
            הוסף
          </button>
        </div>
        <p>מקצועות שנבחרו:</p>
        {subjects.length == 0 ? (
          <p class="text-center">לא הוזנו מקצועות.</p>
        ) : (
          <ListGroup className="list">
            {subjects.map((item, index) => (
              <ListGroup.Item key={index} className="list-item">
                {`${item.subject} (${item.range})`}
                <div>
                  <ReactSVG
                    src={closeSVG}
                    className="closeButton"
                    onClick={() => handleRemoveSubject(index)}
                  />
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
        <br />
        <p> קצת עליי בכמה מילים...</p>
        <Form.Control
          type="text"
          placeholder="מה המקצועות שאני מלמד/ת, כמה ניסיון יש לי, איפה אני מלמד/ת..."
          value={aboutMe}
          onChange={(e) => setAboutMe(e.target.value)}
        />
      </FormGroup>
    </div>
  );
  const studentSignUp = (
    <div>
      <h2 id={color}>פרטי תלמיד</h2>
      <FormGroup>
        <p>שם פרטי תלמיד:</p>
        <Form.Control
          type="text"
          placeholder="שם פרטי תלמיד"
          value={studentFirstName}
          onChange={(e) => setStudentFirstName(e.target.value)}
        />
        <p>שם משפחה תלמיד:</p>
        <Form.Control
          type="text"
          placeholder="שם משפחה תלמיד"
          value={studentLastName}
          onChange={(e) => setStudentLastName(e.target.value)}
        />
        <p>כיתה:</p>
        <Form.Control
          as="select"
          className="select-form"
          value={studentClass}
          onChange={(e) => setStudentClass(e.target.value)}
        >
          {Object.entries(idToGrade).map(([id, grade]) => (
            <option key={id} value={grade}>
              {grade}
            </option>
          ))}
        </Form.Control>
        <br />
        <h2 id={color}>פרטי הורה / אפוטרופוס</h2>
        <p>שם פרטי הורה / אפוטרופוס:</p>
        <Form.Control
          type="text"
          placeholder="שם פרטי ההורה"
          value={parentFirstName}
          onChange={(e) => setParentFirstName(e.target.value)}
        />
        <p>שם משפחה הורה / אפוטרופוס:</p>
        <Form.Control
          type="text"
          placeholder="שם משפחה הורה"
          value={parentLastName}
          onChange={(e) => setParentLastName(e.target.value)}
        />
        <p>מספר טלפון הורה / אפוטרופוס:</p>
        <Form.Control
          type="tel"
          placeholder="מספר טלפון ההורה"
          value={parentPhoneNumber}
          onChange={(e) => setParentPhoneNumber(e.target.value)}
        />
      </FormGroup>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="main-section-narrow">
        <div className="section">
          <div
            className="title"
            style={{
              backgroundColor: userType == "teacher" ? "#E8701F" : "#9139E5",
            }}
          >
            {userType == "teacher" ? "הרשמה - מורים" : "הרשמה - תלמידים"}
          </div>
          <div className="text-section">
            <Form.Group>
              <div className="row-container">
                <p>אני</p>
                <button
                  className={`item-row ${
                    userType === "teacher" ? "checked-signup-button" : "unchecked-signup-button"
                  }`}
                  id="orange-button"
                  label="מורה"
                  name="userType"
                  inline
                  onClick={() => setUserType("teacher")}
                >
                  מורה
                </button>
                <button
                  className={`item-row ${
                    userType === "student" ? "checked-signup-button" : "unchecked-signup-button"
                  }`}
                  id="purple-button"
                  label="תלמיד"
                  name="userType"
                  inline
                  onClick={() => setUserType("student")}
                >
                  תלמיד
                </button>
              </div>
            </Form.Group>
            <Form onSubmit={handleSubmit}>
              <br />
			  <div className="color-red">*שימו לב, כל השדות בטופס הינם חובה</div>
              <h2 id={color}>פרטי התחברות</h2>
              <p>אימייל:</p>
              <Form.Control
                type="text"
                placeholder="הכנס כתובת אימייל"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <p>סיסמה:</p>
              <Form.Control
                type="password"
                placeholder="הכנס סיסמה בת 8 תווים לפחות"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p>אימות סיסמה:</p>
              <Form.Control
                type="password"
                placeholder="אימות סיסמה"
                value={passConfirm}
                onChange={(e) => setPassConfirm(e.target.value)}
              />

              <br />
              {userType === "teacher" && teacherSignUp}
              {userType === "student" && studentSignUp}
              <br />
              <button
                variant="primary"
                type="submit"
                className="w-100"
                id={userType == "teacher" ? "orange-button" : "purple-button"}
              >
                {" "}
                {userType == "teacher" ? "הרשם כמורה" : "הרשם כתלמיד"}
              </button>
              <Link to="/login">
                <button
                  variant="secondary"
                  type="button"
                  className="w-100 back-button"
                >
                  להתחברות
                </button>
              </Link>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
