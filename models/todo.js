const mongoose = require("mongoose");


const todoSchema = new mongoose.Schema({
  Title : String,
  Description : String,
  Complete:{
    type:Boolean,
    default:false
  },
  Createdby: {
    type : mongoose.Schema.Types.ObjectId,
    ref: "UserTodo",
    required: true,
  },
});


module.exports = mongoose.model("todo_data", todoSchema);