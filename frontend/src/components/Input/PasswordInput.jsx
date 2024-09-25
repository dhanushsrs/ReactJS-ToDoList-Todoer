import React, { useState } from "react";
import "./PasswordInput.css";

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
const PasswordInput = ({ value, onChange }) => {
  const [isShowPassword, setIsShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword);
  };
  return (
    <div className="input-container">
      <input
        value={value}
        onChange={onChange}
        type={isShowPassword ? "text" : "password"}
        placeholder="Password"
        className="pwd-input"
      />

      {isShowPassword ? (
        <FaRegEye
          size={22}
          className="icon-style"
          onClick={() => toggleShowPassword()}
        />
      ) : (
        <FaRegEyeSlash
          size={22}
          className="icon-style slash"
          onClick={() => toggleShowPassword()}
        />
      )}
    </div>
  );
};

export default PasswordInput;
