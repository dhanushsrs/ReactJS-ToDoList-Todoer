require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Todo = require("./models/todo.model");

const express = require("express");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 8000;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authenticateToken } = require("./utilities");

app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email });
  if (isUser) {
    return res.json({ error: true, message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user with hashed password
  const user = new User({ fullName, email, password: hashedPassword });

  await user.save(); // Save user to the database

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

// Login Account
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const userInfo = await User.findOne({ email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found" });
  }

  // Use bcrypt to compare the hashed password
  const passwordMatch = await bcrypt.compare(password, userInfo.password);

  if (passwordMatch) {
    const user = {
      user: userInfo,
    };

    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });

    return res.json({
      error: false,
      message: "Login Successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

//Get User
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

//Add Todo
app.post("/add-todo", authenticateToken, async (req, res) => {
  const { title, content } = req.body;
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({
      error: true,
      message: "Title is required",
    });
  }

  if (!content) {
    return res.status(400).json({
      error: true,
      message: "Content is required",
    });
  }

  try {
    const todo = new Todo({
      title,
      content,
      userId: user._id,
    });

    await todo.save();

    return res.json({
      error: false,
      todo,
      message: "ToDo added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

//Edit Todo
app.put("/edit-todo/:todoId", authenticateToken, async (req, res) => {
  const todoId = req.params.todoId;
  const { title, content, isCompleted } = req.body;
  const { user } = req.user;

  if (!title && !content) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const todo = await Todo.findOne({ _id: todoId, userId: user._id });

    if (!todo) {
      return res.status(404).json({ error: true, message: "Todo not found" });
    }

    if (title) todo.title = title;
    if (content) todo.content = content;
    if (isCompleted) todo.isCompleted = isCompleted;

    await todo.save();

    return res.json({
      error: false,
      todo,
      message: "Todo updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Get All Todos
app.get("/get-all-todos", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const todos = await Todo.find({ userId: user._id }).sort({
      isCompleted: 1,
    });

    return res.json({
      error: false,
      todos,
      messages: "All todos retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// Delete Todo
app.delete("/delete-todo/:todoId", authenticateToken, async (req, res) => {
  const todoId = req.params.todoId;
  const { user } = req.user;

  try {
    const todo = await Todo.findOne({ _id: todoId, userId: user._id });

    if (!todo) {
      return res.status(404).json({ error: true, message: "Todo not found" });
    }
    await Todo.deleteOne({ _id: todoId, userId: user._id });

    return res.json({
      error: false,
      message: "Todo deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: false,
      message: "Internal Server Error",
    });
  }
});

//Update isCompleted Value
app.put(
  "/update-todo-completed/:todoId",
  authenticateToken,
  async (req, res) => {
    const todoId = req.params.todoId;
    const { isCompleted } = req.body;
    const { user } = req.user;

    try {
      const todo = await Todo.findOne({ _id: todoId, userId: user._id });

      if (!todo) {
        return res.status(404).json({ error: true, message: "Todo not found" });
      }

      todo.isCompleted = isCompleted;

      await todo.save();

      return res.json({
        error: false,
        todo,
        message: "Todo updated successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  }
);

app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port}`);
});

module.exports = app;
