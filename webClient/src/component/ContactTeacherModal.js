import React from "react";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

function ContactTeacherModal(props) {
  const navigate = useNavigate();
  const [messageContent, setMessageContent] = useState("");

  const sendMessageToTeacher = (studentToken, clickedProfile) => {
    navigate("/seek-teachers", { state: { token } });
  };

  return (
    <Modal
      dir="rtl"
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">
          יצירת קשר עם מורה
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={sendMessageToTeacher}>
          <Form.Group className="mb-4">
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
              <Col>
                <Button onClick={props.onHide}>חזור</Button>
              </Col>
              <Col>
                <Button variant="primary" type="submit">
                  שלח
                </Button>
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default ContactTeacherModal;
