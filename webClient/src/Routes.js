import React from "react";
import { Routes as Router, Route, Link } from "react-router-dom";
import App from "./App";
import Login from "./Login";
import Signup from "./Signup";
import TeacherHomepage from "./TeacherHomepage";


function Routes() {
    return (
        <Router>
            <Route path="/" element={<App />} />
            <Route path="/signup" element={<Signup/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/teacher-homepage" element={<TeacherHomepage/>} /> 
        </Router>
    );
}

export default Routes;
