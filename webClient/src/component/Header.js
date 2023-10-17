import React from "react";
import "../style/App.css";
import { ReactSVG } from "react-svg";
import { Link } from "react-router-dom";
import israelLogo from "../../public/assets/israel-logo.svg";
import longLogo from "../../public/assets/long-logo.svg";

/* 
פונקציית התנתקות
 */
const handleDisconnect = () => {};

const Header = (props) => {
  const flag = <ReactSVG src={israelLogo} />;

  let details = <div></div>;
  if (props.mode === 1) {
    details = (
      <div id="headerDiv">
        {flag}
        <Link to="/">
          <button id="headerBottom" onClick={() => handleDisconnect()}>
            התנתק
          </button>
        </Link>
      </div>
    );
  } else {
    details = (
      <div id="headerDiv">
        {flag}
        <Link to="/signup">
          <button id="headerBottom">הרשמה</button>
        </Link>
        <Link to="/login">
          <button id="headerBottom">התחברות</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="header">
      <div className="header-in">
        <Link to="/">
          <ReactSVG src={longLogo} />
        </Link>
        <div>{details}</div>
      </div>
    </div>
  );
};

export default Header;
