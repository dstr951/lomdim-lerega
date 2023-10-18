import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import TeacherAccordion from "./component/TeacherAccordion";
import FilterTeachers from "./component/FilterTeachers";
import Header from "./component/Header";
import { ReactSVG } from "react-svg";
import appleImg from "../public/assets/apple-img.svg";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS
  ? process.env.SERVER_ADDRESS
  : "http://localhost:3001";

const TeachersListing = () => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState(teachers);
  const [noTeachersText, setNoTeachersText] = useState(
    "בדף זה תוכלו לחפש מורים!"
  );
  const navigate = useNavigate();
  const location = useLocation();
  const token = location?.state?.token;
  const authenticated = location?.state?.authenticated;

  const handleError401 = () => {
    alert("נראה שאתה לא היית מחובר, אנא התחבר שוב במסך ההתחברות");
    navigate("/login", {});
  };

  const handleFilterChange = (subject, grade) => {
    if (!authenticated) {
      alert(
        "תלמיד יקר, אינך מאומת עדיין, לכן לא ניתן לחפש מורים בשלב זה. אנא נסה שוב מאוחר יותר."
      );
      return;
    }
    setNoTeachersText("לא נמצאו מורים.");
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
        .catch((error) => {
          console.error(error);
          if (error?.response?.status === 401) {
            handleError401();
          }
        });
    } else {
      setFilteredTeachers(teachers);
      setNoTeachersText("בחרו מקצוע, כיתה או שניהם לפני החיפוש");
    }
  };
  const noTeachers = (
    <div
      variant="body1"
      align="center"
      data-testid="teacherListing-noTeacherssAvailable"
      className="section"
    >
      <div className="text-section">
        <p>{noTeachersText}</p>
      </div>
    </div>
  );

  return (
    <div>
      <Header mode={1} />
      <div className="main-section">
        <div className="section" id="top-section">
          <div className="text-section" id="search-section">
            <h1>שנתחיל ללמוד?</h1>
            <h2>חיפוש מורה לפי נושא</h2>
            <FilterTeachers handleFilterChange={handleFilterChange} />
          </div>
          <ReactSVG src={appleImg} />
        </div>
        {filteredTeachers?.length === 0 ? (
          noTeachers
        ) : (
          <TeacherAccordion filteredTeachers={filteredTeachers} token={token} />
        )}
      </div>
    </div>
  );
};
export default TeachersListing;
