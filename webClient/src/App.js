import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style/App.css';
import Header from "./component/Header";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS

const App = () => {



    const location = useLocation();
    const navigate = useNavigate();

    const initialEmail = location.state?.email || '';
    const [email, setEmail] = useState(initialEmail);
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
    
        try {
            const loginResponse = await axios.post(`${SERVER_ADDRESS}/api/Users/login`, {
                email,
                password
            });
            
            if (loginResponse.data) {
                const token = loginResponse.data;
                const teacherResponse = await axios.get(`${SERVER_ADDRESS}/api/Teachers/search?email=${email}`,
                 { headers: { Authorization: token} });
                
                if (teacherResponse.data) {
                    const teacher = teacherResponse.data;
                    navigate('/teacher-homepage', { state: { teacher } });
                } else {
                    alert('Failed to fetch teacher data.');
                }
            } else {
                alert('Failed to login.');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <Header/>
            
        </div>
    );
}

export default App;
