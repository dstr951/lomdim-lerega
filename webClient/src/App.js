import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import jwt from "jwt-decode";
import "./style/App.css";
import Header from "./component/Header";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS
  ? process.env.SERVER_ADDRESS
  : "http://localhost:3001";

const App = () => {
  return (
    <div>
      <Header />
    </div>
  );
};

export default App;
