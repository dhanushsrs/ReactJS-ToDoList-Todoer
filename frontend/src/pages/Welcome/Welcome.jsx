import React from "react";
import "./Welcome.css";
import { Link } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="welcome-bg">
      <div className="welcome-card">
        <h1 className="welcome-heading">Welcome to Todoer</h1>
        <p className="welcome-para">
          &quot;Turn tasks into triumphs with our smart and sleek to-do list
          app&quot;
        </p>
        <div className="btn-container">
          <Link to="/login">
            <button className="welcome-btn green">LOGIN</button>
          </Link>

          <Link to="/signup">
            <button className="welcome-btn yellow">SIGNUP</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Welcome;
