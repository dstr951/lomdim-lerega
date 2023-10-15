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
  const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

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
      return alert("נא למלא את כל השדות הדרושים.");
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
        alert("ההודעה נשלחה.");
      } else {
        alert("השליחה נכשלה, נסה שנית מאוחר יותר.");
      }
    } catch (error) {
      props.onHide();
      setSelectedSubject("נא לבחור מקצוע");
      setMessageContent("");
      if (error.message === "Request failed with status code 409") {
        alert(
          "כבר נשלחה בקשה למורה עם מקצוע זה, יכולים לנסות אצל מורים אחרים."
        );
      } else {
        alert("השליחה נכשלה, נסה שנית מאוחר יותר.");
      }

      console.error(error);
    }
  };

  return (
    <>
      {props.show && <div className="overlay"/>}
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
                      <option 
                      value={"נא לבחור מקצוע"}
                      className="select-form"
                      >נא לבחור מקצוע</option>
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
