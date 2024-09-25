import React from "react";
import "./Navbar.css";

import ProfileInfo from "../ProfileInfo/ProfileInfo";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userInfo }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="navbar-container">
      <h2 className="navbar-heading">Todoer</h2>

      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
