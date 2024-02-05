const express = require("express");
const router = express.Router();

const {addTodo , fetchTodos , UpdataTodos , DeleteTodos} = require("../controllers/todo");
const { islogin } = require("../Middlewares/general");

router.post("/add-todo" , islogin , addTodo)
router.get("/fetch-todo" , islogin , fetchTodos)
router.put("/update-todo/:todoId" , islogin , UpdataTodos)
router.delete("/delete-todo/:todoId" , islogin , DeleteTodos)

module.exports = router ;