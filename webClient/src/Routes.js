import React from "react";
import { Routes as Router, Route, Link } from "react-router-dom";
import App from "./App";
import Signup from "./Signup";

function Routes() {
    return (
        <Router>
                <Route path="/" element={<App/>} />
                <Route path="/signup" element={<Signup/>} />
        </Router>
    );
}

export default Routes;
