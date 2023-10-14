import React from "react";
import { Routes as Router, Route, Link } from "react-router-dom";
import App from "./App";
import AdminPage from "./AdminPage"
import Login from "./Login";
import Signup from "./Signup";
import TeacherHomepage from "./TeacherHomepage";
import TeachersListing from "./TeachersListing";
import Blank from "./Blank";


function Routes() {
  return (
    <Router>
      <Route path="/" element={<TeachersListing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/teacher-homepage" element={<TeacherHomepage />} />
      <Route path="/seek-teachers" element={<TeachersListing />} />
      <Route path="/admin/panel" element={<AdminPage/>} />
    </Router>
  );
}

export default Routes;
