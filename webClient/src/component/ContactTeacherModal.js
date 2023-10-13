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
      {props.show && <div style={overlayStyle} onClick={props.onHide} />}
      <Modal
        dir="rtl"
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        enforceFocus={"true"}
      >
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">
            יצירת קשר עם מורה
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={sendMessageToTeacher}>
            <Form.Group className="mb-4">
              <Form.Label className="mb-2">מקצוע:</Form.Label>
              <Row className="mb-2">
                <Col md={6}>
                  <Form.Control
                    as="select"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                  >
                    <option value={"נא לבחור מקצוע"}>נא לבחור מקצוע</option>
                    {props.teacher?.teacher?.canTeach.map((record) => (
                      <option value={record.subject} key={record.subject}>
                        {idToSubject[record.subject]}
                      </option>
                    ))}
                  </Form.Control>
                </Col>
              </Row>
              <Form.Label>כתוב הודעתך למורה:</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="כתוב את הודעתך למורה כאן."
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
              />
              <Row>
                {" "}
                <Col md={6}>
                  <Button onClick={props.onHide}>חזור</Button>
                </Col>
                <Col md={6}>
                  <Button variant="primary" type="submit">
                    שלח
                  </Button>
                </Col>
              </Row>
            </Form.Group>
          </Form>
        </Modal.Body>
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
