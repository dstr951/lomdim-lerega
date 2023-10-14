import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import TeacherAccordion from "./component/TeacherAccordion";
import FilterTeachers from "./component/FilterTeachers";
import Header from "./component/Header";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

const TeachersListing = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState(teachers);
  const [clickedProfile, setClickedProfile] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  const token = location?.state?.token;

  const handleDisconnect = () => {
    navigate("/", {});
  };

  useEffect(() => {
    getTeachers();
  }, []);

  const getTeachers = () => {
    axios
      .get(`${SERVER_ADDRESS}/api/Teachers/all`, {
        headers: { Authorization: token },
      })
      .then((response) => {
        setTeachers(response.data);
        setFilteredTeachers(response.data);
      })
      .catch((error) => console.error(error));
  };

  const handleFilterChange = (subject, grade) => {
    const params = [];
    if (subject) {
      params.push(`subject=${subject}`);
    }
    if (grade) {
      params.push(`grade=${grade}`);
    }

    let url = `${SERVER_ADDRESS}/api/Teachers/search`;
    if (params.length > 0) {
      url += `?${params.join("&")}`;
    } else {
      url = `${SERVER_ADDRESS}/api/Teachers/all`;
    }

    if (params.length > 0) {
      axios
        .get(url, { headers: { Authorization: token } })
        .then((response) => {
          setFilteredTeachers(response.data);
        })
        .catch((error) => console.error(error));
    } else {
      setFilteredTeachers(teachers);
    }
  };
  console.log(token);
  const noTeachers = (
    <div 
          variant="body1"
          align="center"
          data-testid="teacherListing-noTeacherssAvailable"
          className="section">
          <div className="text-section">
            <p>לא נמצאו מורים.</p>
          </div>
        </div>
  )
  console.log(filteredTeachers)
  return (
    <div>
      <Header/>
      <div className="main">
        <div className="section">
          <div className="text-section">
            <h1>שנתחיל ללמוד?</h1>
            <h2>חיפוש מורה לפי נושא</h2>
            <FilterTeachers handleFilterChange={handleFilterChange} />
          </div>
        </div>
        {filteredTeachers?.length === 0 ? noTeachers : (
        <TeacherAccordion 
        filteredTeachers={filteredTeachers} 
        token={token} />
      )}
      </div>
    </div>
  );
};



{/*
לטפל בזה
<Button variant="primary" onClick={() => handleDisconnect()}>
          התנתק
        </Button> */}


        

export default TeachersListing;
