import React, { useState } from "react";
import "./SignUp.css";

import Navbar from "../../components/Navbar/Navbar";
import PasswordInput from "../../components/Input/PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstance";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handlesignUp = async (e) => {
    e.preventDefault();

    if (!name) {
      setError("Please Enter Your Name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please Enter A Valid Email Address");
      return;
    }

    if (!password) {
      setError("Please Enter The Password");
      return;
    }

    setError("");

    // SignUp API Call
    try {
      const response = await axiosInstance.post("/create-account", {
        fullName: name,
        email: email,
        password: password,
      });

      // Handle successful registration response

      if (response.data && response.data.error) {
        setError(response.data.message);
        return;
      }

      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error) {
      // Handle registration Error

      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occured. Please try again.");
      }
    }
  };

  return (
    <>
      <Navbar />

      <div className="form-container">
        <div className="auth-container">
          <form onSubmit={handlesignUp}>
            <h4 className="form-heading">SignUp</h4>

            <input
              type="text"
              placeholder="Name"
              className="input-box"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="text"
              placeholder="Email"
              className="input-box"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="error-paragraph">{error}</p>}

            <button type="submit" className="auth-btn">
              SignUp
            </button>

            <p className="form-paragraph">
              Already have an Account?{" "}
              <Link to="/login" className="auth-link">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignUp;
