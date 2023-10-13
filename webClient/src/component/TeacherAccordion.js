import React, { useState } from "react";
import {
  Accordion,
  Container,
  Row,
  Col,
  ListGroup,
  Button,
  Image,
} from "react-bootstrap";
import { idToGrade, idToSubject } from "../Converters";
import ContactTeacherModal from "../component/ContactTeacherModal";

const TeacherAccordion = ({ filteredTeachers }) => {
  const [modalShow, setModalShow] = React.useState(false);
  const [selectedTeacher, setSelectedTeacher] = React.useState({});
  return (
    <Container>
      <Accordion data-testid={"teacherListing-list"} defaultActiveKey="0">
        {filteredTeachers?.map((teacher) => (
          <Accordion.Item key={teacher.email} eventKey={teacher.email}>
            <Accordion.Header>
              <Container>
                <Row xs="auto">
                  <Col>
                    <Image
                      src={`data:image/jpeg;base64,${teacher.profilePicture}`}
                      roundedCircle
                      width={100}
                      height={100}
                      className="mb-3"
                    />
                  </Col>
                  <Col>
                    <Row xs="auto">
                      <Col>
                        <h3>
                          {teacher.firstName} {teacher.lastName}{" "}
                        </h3>
                      </Col>
                      <Col>
                        <Button
                          href={teacher.socialProfileLink}
                          onClick={() => onClickOpenVacancy(id)}
                        >
                          {"קישור לפרופיל חברתי"}
                        </Button>
                      </Col>
                      {/* {teacher.isOnline ? <p>מחובר</p> : <p> לא מחובר</p>} */}
                    </Row>
                    <Row>
                      <Button
                        variant="primary"
                        onClick={() => {
                          setSelectedTeacher({ teacher });
                          setModalShow(true);
                        }}
                      >
                        פנה למורה
                      </Button>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </Accordion.Header>
            <Accordion.Body>
              <Container>
                <Row>
                  {teacher.aboutMe}

                  <Row xs="auto">
                    <Col xs>
                      <ListGroup variant="flush">
                        {teacher.canTeach.map((item, index) => (
                          <ListGroup.Item key={index}>
                            {idToSubject[item.subject]} (כיתות{" "}
                            {idToGrade[item.lowerGrade]} עד{" "}
                            {idToGrade[item.higherGrade]})
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Col>
                  </Row>
                </Row>
                <Row xs="auto"></Row>
              </Container>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
      <ContactTeacherModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        teacher={selectedTeacher}
      />
    </Container>
  );
};
export default TeacherAccordion;
