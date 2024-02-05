const Todos = require("../models/todo");

const addTodo = (req, res) => {
  //1. we will verify token {token are in side the header}

  const { Title, Description } = req.body;

  // user is login

  Todos.create({ Title, Description, Createdby: req.TokenData.id })
    .then(() => res.json({ success: true, message: "add todo successfully" }))

    .catch((err) => res.json({ success: false, message: err.message }));
};
//read todo

const fetchTodos = (req, res) => {
  Todos.find({ Createdby: req.TokenData.id })

    .then((todo) => res.json({ success: true, todos: todo }))
    .catch((err) => res.json({ success: false, message: err.message }));
};

//tip: whenever you want design an api where docuemnt will be updated or delete always spicify the id or docid in the urk params of a ap
//update todo(we need ,userid ,title ,decripation,completed ,todoid)

const UpdataTodos = (req, res) => {
  const { Complete } = req.body;
  const todoid = req.params.todoId;
 
  //give me id and createdby id in login user

  Todos.findOneAndUpdate(
    { _id: todoid, Createdby: req.TokenData.id },
    { Complete }
  )

    .then((doc) => {
     
      if (doc) {
        return res.json({ success: true, message: "Todo completed" });
      } else {
        return res.json({ success: false, message: "Todo Not Completed" });
      }
    })
    .catch((err) => res.json({ success: false, message: err.message }));
};

//delete todo
const DeleteTodos = (req, res) => {
  Todos.findOneAndDelete({
    _id: req.params.todoId,
    Createdby: req.TokenData.id,
  })

    .then((doc) => {
      if (doc) {
        return res.json({ success: true, message: "document delete" });
      } else {
        return res.json({ success: false, message: "Data not found" });
      }
    })
    .catch((err) => res.json({ success: false, message: err.message }));
};

module.exports = {
  addTodo,
  fetchTodos,
  UpdataTodos,
  DeleteTodos,
};
