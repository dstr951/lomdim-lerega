import React from "react";
import { Routes as Router, Route, Link } from "react-router-dom";
import App from "./App";
import AdminPage from "./AdminPage"
import Signup from "./Signup";
import TeacherHomepage from "./TeacherHomepage";

function Routes() {
    return (
        <Router>
            <Route path="/" element={<App/>} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/teacher-homepage" element={<TeacherHomepage/>} /> 
            <Route path="/admin/panel" element={<AdminPage/>} /> 
        </Router>
    );
}

export default Routes;
