const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv")

const cors = require("cors");

// import midlleware
const { islogin } = require("./Middlewares/general");

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config()

//database connecton

mongoose
  .connect(
    process.env.DATA_BASE
  )
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("error Database connection", err.message));

// adding auth routes
const authRoutes = require("./routes/auth");
const todoRoutes = require("./routes/todo");

app.use("/auth", authRoutes);
app.use("/todo", islogin, todoRoutes);

//starting app
const PORT = 4050;
app.listen(PORT, () => console.log(`Server is Running on PORT :${PORT}`));
