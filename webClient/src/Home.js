import React, { useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import jwt from "jwt-decode";
import "./style/App.css";
import "./style/Home.css";
import { ReactSVG } from "react-svg";
import Header from "./component/Header";

import firstImage from "../public/assets/first-img.svg";
import lastImage from "../public/assets/last-img.svg";
import israelFlag from "../public/assets/israel-flag.svg";
import appleImage from "../public/assets/apple-big.svg";

const SERVER_ADDRESS = process.env.SERVER_ADDRESS;

const Home = () => {
  const rand = Math.random();

  const img1 = rand >= 0.5 ? firstImage : lastImage;
  const img2 = rand < 0.5 ? firstImage : lastImage;

  return (
    <div>
      <Header mode="0" />
      <div className="home-section" id="section-1">
        <div className="text-section-1">
          <ReactSVG src={israelFlag} />
          <h1 className="title-1">בזמנים קשים, כולנו לומדים יחד.</h1>
          <p className="home-text">
            מורים מעבירים שיעורים פרטיים בהתנדבות, לכל מי שצריך.
          </p>
          <Link to="/signup">
            <button id="green-button">הרשמו עכשיו!</button>
          </Link>
        </div>
        <div className="img-section">
          <ReactSVG
            src={img1}
            beforeInjection={(svg) => {
              svg.setAttribute("style", "width: 95%");
            }}
          />
        </div>
      </div>
      <div className="home-section" id="section-2">
        <ReactSVG
          src={appleImage}
          beforeInjection={(svg) => {
            svg.setAttribute("style", "width: 300px");
          }}
        />
        <div className="text-section-1">
          <h1>
            מערך שיעורים פרטיים בזום,
            <br />
            בכל המקצועות, לכל הכתות
            <br />
            בחינם!
          </h1>
          <p className="home-text">
            זה לא במקום בית ספר, אלא בנוסף, כדי להמשיך ליצור שגרה איכותית
            ומעניינת לילדים ולספק עיסוק חיובי בימים הקשים שעוברים עלינו.
            <br />
            <br />
            השיעורים מתאימים לתלמידי בית ספר בכל הגילאים (יסודי, חטיבה ותיכון)
            ובכל מקצועות הלימוד - החל במתמטיקה ולשון וכלה במוסיקה ואמנות.
            הפלטפורמה תקשר בין תלמידים ותלמידות למורים המתאימים על פי גיל, מקצוע
            וזמינות.
          </p>
        </div>
        <div className="img-section"></div>
      </div>
      <div className="home-section" id="section-3">
        <div className="text-section-3">
          <h1>
            הצטרפו למאות מורים ותלמידים <br />
            שלומדים ומלמדים, <br />
            למען עתידנו וחוסננו הלאומי
            <br />
          </h1>
          <Link to="/signup">
            <button id="green-button">הרשמו עכשיו!</button>
          </Link>
        </div>
        <div className="img-section-1">
          <ReactSVG
            src={img2}
            beforeInjection={(svg) => {
              svg.setAttribute("style", "width: 90%");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
