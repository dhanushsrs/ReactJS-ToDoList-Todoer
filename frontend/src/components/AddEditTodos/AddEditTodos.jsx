import React, { useState } from "react";
import "./AddEditTodos.css";

import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosInstance";

const AddEditTodos = ({
  todoData,
  type,
  getAllTodos,
  showToastMessage,
  onClose,
}) => {
  const [title, setTitle] = useState(todoData?.title || "");
  const [content, setContent] = useState(todoData?.content || "");

  const [error, setError] = useState(null);

  // Add Todo
  const addNewTodo = async () => {
    try {
      const response = await axiosInstance.post("/add-todo", {
        title,
        content,
      });

      if (response.data && response.data.todo) {
        showToastMessage("Todo Added Successfully");
        getAllTodos();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  // Edit Todo
  const editTodo = async () => {
    const todoId = todoData._id;
    try {
      const response = await axiosInstance.put("/edit-todo/" + todoId, {
        title,
        content,
      });

      if (response.data && response.data.todo) {
        showToastMessage("Todo Updated Successfully");
        getAllTodos();
        onClose();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      }
    }
  };

  const handleAddNote = () => {
    if (!title) {
      setError("Please Enter The Title");
      return;
    }

    if (!content) {
      setError("Please Enter The Content");
      return;
    }

    setError("");

    if (type === "edit") {
      editTodo();
    } else {
      addNewTodo();
    }
  };

  return (
    <div className="add-edit-container">
      <button className="close-btn" onClick={onClose}>
        <MdClose className="close-icon" />
      </button>

      <div className="popup-container">
        <label htmlFor="title" className="input-label">
          TITLE
        </label>

        <input
          type="text"
          className="title-input"
          placeholder="Add Title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="content-box">
        <label htmlFor="content" className="input-label">
          CONTENT
        </label>

        <textarea
          type="text"
          className="content-area"
          placeholder="Add Content ..."
          rows={5}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {error && <p className="error-paragraph">{error}</p>}

      <button className="add-btn" onClick={handleAddNote}>
        {type === "edit" ? "UPDATE" : "ADD"}
      </button>
    </div>
  );
};
export default AddEditTodos;
