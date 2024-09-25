import React from "react";
import "./TodoCard.css";

import { MdCreate, MdDelete } from "react-icons/md";
import moment from "moment";

const TodoCard = ({
  title,
  date,
  content,
  isCompleted,
  onEdit,
  onDelete,
  onCompleteTodo,
}) => {
  return (
    <div className="todo-container">
      <div className="todo-card-continer">
        <div>
          <h6 className="todo-title">{title}</h6>

          <span className="todo-date">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>
      </div>

      <p className="todo-content">{content?.slice(0, 60)}</p>

      <div className="todo-icon">
        <button
          className={`complete-btn ${isCompleted ? "active" : ""}`}
          onClick={onCompleteTodo}
        >
          {isCompleted ? "Completed" : "Mark as Complete"}
        </button>
        <div className="icon-container">
          <MdCreate className="create-icon" onClick={onEdit} />

          <MdDelete className="delete-icon" onClick={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default TodoCard;
