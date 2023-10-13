import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { idToGrade, idToSubject, subjectToId } from "../Converters";

function ContactTeacherModal(props) {
  const navigate = useNavigate();
  const [selectedSubject, setSelectedSubject] = useState("מתמטיקה");
  const [messageContent, setMessageContent] = useState("");

  const sendMessageToTeacher = (studentToken, clickedProfile) => {
    navigate("/seek-teachers", { state: { token } });
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
                    {props.teacher.teacher?.canTeach.map((record) => (
                      <option
                        value={subjectToId[record.subject]}
                        key={record.subject}
                      >
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
