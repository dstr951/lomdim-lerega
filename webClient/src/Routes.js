import React from "react";
import { Routes as Router, Route, Link } from "react-router-dom";
import App from "./App";
import Signup from "./Signup";
import TeacherHomepage from "./TeacherHomepage";
import TeachersListing from "./TeachersListing";

function Routes() {
  return (
    <Router>
      <Route path="/" element={<TeachersListing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/teacher-homepage" element={<TeacherHomepage />} />
      <Route path="/seek-teachers" element={<TeachersListing />} />
    </Router>
  );
}

export default Routes;
