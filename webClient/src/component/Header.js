import React, { useState } from "react";
import axios from "axios";
import '../style/App.css';
import { ReactSVG } from 'react-svg'
import { Link } from 'react-router-dom';

import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';



const Header = () => {

    const details = (
        <div id="headerDiv">
            <Link to="/signup"><button id="headerBottom">הרשמה</button>  </Link>
            <Link to="/login"><button id="headerBottom">התחברות</button> </Link>      
        </div>
        
    )
    return (
        <div className="header">
            <div className="header-in">
            <Link to="/"><ReactSVG src="./assets/logo.svg"/></Link>
            <div>{details}</div>
            </div>
        </div>
    )

}

export default Header;
