import React, { useState } from "react";
import axios from "axios";
import '../style/App.css';
import { ReactSVG } from 'react-svg'

const Header = () => {

    const details = (
        <div id="headerDiv">
            <div><button id="headerBottom">הרשמה</button></div>  
            <div><button id="headerBottom">התחברות</button></div>        
        </div>
        
    )
    return (
        <div id="header">
            <div><ReactSVG src="./assets/logo.svg"/></div>
            <div>{details}</div>
        </div>
    )

}

export default Header;
