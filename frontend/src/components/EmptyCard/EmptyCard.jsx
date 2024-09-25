import React from "react";
import "./EmptyCard.css";

const EmptyCard = ({ imgsrc, message }) => {
  return (
    <div className="empty-container">
      <img src={imgsrc} alt="No Todos" />

      <p className="empty-paragraph">{message}</p>
    </div>
  );
};

export default EmptyCard;
