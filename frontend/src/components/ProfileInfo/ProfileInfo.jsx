import React from "react";
import "./ProfileInfo.css";
import { getInitials } from "../../utils/helper";

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className="profile-container">
      <div className="initial-container">{getInitials(userInfo?.fullName)}</div>

      <div>
        <p className="name-paragraph">{userInfo?.fullName}</p>

        <button className="logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
