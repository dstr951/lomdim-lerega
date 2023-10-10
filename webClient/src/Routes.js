import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import App from "./App";
import Signup from "./Signup";

function Routes() {
    return (
        <Router>
            <div>
                {/* Example navigation links (you can style or place them as you wish) */}
                <Link to="/">Home</Link>
                <Link to="/signup">SignUp</Link>

                {/* Route setup */}
                <Route path="/" exact component={App} />
                <Route path="/signup" component={Signup} />
            </div>
        </Router>
    );
}

export default Routes;
