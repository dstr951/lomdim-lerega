import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { idToGrade, idToSubject, subjectToId } from "../Converters";

function ContactTeacherModal(props) {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("נא לבחור מקצוע");
  const [messageContent, setMessageContent] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const SERVER_ADDRESS = process.env.SERVER_ADDRESS
    ? process.env.SERVER_ADDRESS
    : "http://localhost:3001";

  useEffect(() => {
    getStudentEmail();
  }, []);

  const getStudentEmail = () => {
    axios
      .get(`${SERVER_ADDRESS}/api/Students/myself `, {
        headers: { Authorization: props.token },
      })
      .then((response) => {
        setStudentEmail(response.data.email);
        console.log(studentEmail);
      })
      .catch((error) => console.error(error));
  };

  const sendMessageToTeacher = async (e) => {
    e.preventDefault();

    if (selectedSubject === "נא לבחור מקצוע" || messageContent === "") {
      return Swal.fire({
        icon: "error",
        title: "משהו השתבש",
        text: "נא למלא את כל השדות",
      });
    }

    try {
      console.log(selectedSubject);
      const response = await axios.post(
        `${SERVER_ADDRESS}/api/TeachingRequests/`,
        {
          studentEmail: studentEmail,
          teacherEmail: props.teacher?.teacher?.email,
          subject: selectedSubject,
          messageContent: messageContent,
        },
        {
          headers: { Authorization: props.token },
        }
      );
      props.onHide();
      setMessageContent("");
      setSelectedSubject("נא לבחור מקצוע");
      if (response.status === 200) {
        return Swal.fire({
          icon: "success",
          title: "!ההודעה נשלחה בהצלחה",
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
      props.onHide();
      setSelectedSubject("נא לבחור מקצוע");
      setMessageContent("");
      if (error.message === "Request failed with status code 409") {
        Swal.fire({
          icon: "info",
          title: "בקשה למורה הזה כבר נשלחה",
          text: "אנא המתינו עד לקבלת תשובה מהמורה, בינתיים מוזמנים לנסות מורים אחרים",
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
  };

  return (
    <>
      {props.show && <div className="overlay" />}
      <Modal
        dir="rtl"
        {...props}
        size="lg"
        centered
        enforceFocus={"true"}
        id="no-background"
      >
        <Form onSubmit={sendMessageToTeacher} className="requests-modal">
          <div className="title">יצרית קשר - מורה</div>

          <div className="requests-modal-body">
            <p>מקצוע:</p>
            <div className="mb-2">
              <Col md={6}>
                <Form.Select
                  as="select"
                  className="select-form"
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  <option value={"נא לבחור מקצוע"} className="select-form">
                    נא לבחור מקצוע
                  </option>
                  {props.teacher?.teacher?.canTeach.map((record) => (
                    <option value={record.subject} key={record.subject}>
                      {idToSubject[record.subject]}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </div>
            <p>כתוב הודעתך למורה:</p>
            <Form.Control
              id="text-message"
              rows={4}
              placeholder="כתוב את הודעתך למורה כאן."
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
            />
            <div>
              {" "}
              <div md={6} className="d-flex justify-content-center">
                <button type="button" onClick={props.onHide}>
                  חזור
                </button>{" "}
                <button className="me-2" variant="primary" type="submit">
                  שלח
                </button>
              </div>
            </div>
          </div>
        </Form>
      </Modal>
    </>
  );
}
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  zIndex: 999,
  pointerEvents: "none",
};

export default ContactTeacherModal;
