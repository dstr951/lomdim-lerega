import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import jwt from "jwt-decode";
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
        let token;
        try {
            const loginResponse = await axios.post(`${SERVER_ADDRESS}/api/Users/login`, {
                email,
                password
            });
            
            if (loginResponse.data) {
                token = loginResponse.data.token;
                const login = jwt(token);
                switch(login.role){
                    case "teacher":
                        const teacherResponse = await axios.get(`${SERVER_ADDRESS}/api/Teachers/search?email=${email}`,
                        { headers: { Authorization: token} });                        
                        if (teacherResponse.data) {
                            const teacher = teacherResponse.data;
                            navigate('/teacher-homepage', { state: { teacher, token } });
                        }                        
                        break;
                    case "student":
                        navigate('/seek-teachers', {state: {token}});
                        break;
                    case "admin":
                        navigate('/admin/panel', {state: {token}});
                        break;
                    default:
                        alert("there was an error")
                        break;
                }
            } 
        } catch (error) {
            if(error.response.data === "couldn't find a user with those credetials"){
                alert('Failed to login.');
                console.error('Error:', error);
            } else if(error.response.data === "We couldn't find a teacher with this email"){
                
            }
            else {
                alert("there was an error logging in")
            }
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
