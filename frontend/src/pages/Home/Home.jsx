import React, { useEffect, useState } from "react";
import "./Home.css";

import Navbar from "../../components/Navbar/Navbar";
import TodoCard from "../../components/Card/TodoCard";
import { MdAdd } from "react-icons/md";
import AddEditTodos from "../../components/AddEditTodos/AddEditTodos";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";
import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddTodoImg from "../../assets/Images/add-todo.svg";

const Home = () => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allTodos, setAllTodos] = useState([]);
  const [userInfo, setUserInfo] = useState(null);

  const navigate = useNavigate();

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  const handleEdit = (todoDetails) => {
    setOpenAddEditModal({ isShown: true, data: todoDetails, type: "edit" });
  };

  // Get User Info

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all todos

  const getAllTodos = async () => {
    try {
      const response = await axiosInstance.get("/get-all-todos");

      if (response.data && response.data.todos) {
        setAllTodos(response.data.todos);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Delete todo

  const deleteTodo = async (data) => {
    const todoId = data._id;

    try {
      const response = await axiosInstance.delete("/delete-todo/" + todoId);

      if (response.data && !response.data.error) {
        showToastMessage("Todo Deleted Successfully", "delete");
        getAllTodos();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  };

  // Update isCompleted
  const updateIsCompleted = async (todoData) => {
    const todoId = todoData._id;
    try {
      const response = await axiosInstance.put(
        "/update-todo-completed/" + todoId,
        {
          isCompleted: !todoData.isCompleted,
        }
      );

      if (response.data && response.data.todo) {
        showToastMessage("Todo Updated Successfully");
        getAllTodos();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTodos();
    getUserInfo();
    return () => {};
  }, []);
  return (
    <>
      <Navbar userInfo={userInfo} />

      <div className="home-container">
        {allTodos.length > 0 ? (
          <div className="todo-grid">
            {allTodos.map((item, index) => (
              <TodoCard
                key={item._id}
                title={item.title}
                date={item.createdOn}
                content={item.content}
                isCompleted={item.isCompleted}
                onEdit={() => handleEdit(item)}
                onDelete={() => deleteTodo(item)}
                onCompleteTodo={() => updateIsCompleted(item)}
              />
            ))}

            {/* First create dummy data here for better understanding */}
          </div>
        ) : (
          <EmptyCard
            imgsrc={AddTodoImg}
            message={`Start creating your first Todo! Click the "Add" button to create 
            your To Do List. Let's get started!  `}
          />
        )}
      </div>

      <button
        className="plus-btn"
        onClick={() => {
          setOpenAddEditModal({
            isShown: true,
            type: "add",
            data: null,
          });
        }}
      >
        <MdAdd className="plus-icon" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="modal-classname"
      >
        <AddEditTodos
          type={openAddEditModal.type}
          todoData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({
              isShown: false,
              type: "add",
              data: null,
            });
          }}
          getAllTodos={getAllTodos}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
