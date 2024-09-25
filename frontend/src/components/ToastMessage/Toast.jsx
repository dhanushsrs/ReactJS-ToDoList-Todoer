import React, { useEffect } from "react";
import "./Toast.css";

import { LuCheck } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";

const Toast = ({ isShown, message, type, onClose }) => {
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onClose();
    }, 3000);
    return () => {
      clearTimeout(timeoutId);
    };
  }, [onClose]);

  const shadowClass = type === "delete" ? "delete" : "default";

  const bgColorClass = type === "delete" ? "bg-red" : "bg-green";

  return (
    <div className={`toast-main-container ${isShown ? "shown" : ""}`}>
      <div className={`toast-shadow-container ${shadowClass}`}>
        <div className="toast-container">
          <div className={`check-container ${bgColorClass}`}>
            {type === "delete" ? (
              <MdDeleteOutline className="cross-icon" />
            ) : (
              <LuCheck className="check-icon" />
            )}
          </div>

          <p className="toast-paragraph">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Toast;
