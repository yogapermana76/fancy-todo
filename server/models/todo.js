const mongoose = require('mongoose')
const Schema = mongoose.Schema

const todoSchema = new Schema({
  name: {
    type: String,
    required: [true, 'please fill name todo']
  },
  description: {
    type: String,
    required: [true, 'please fill description']
  },
  status: {
    type: String,
    default: 'uncomplete'
  },
  due_date: {
    type: Date,
    required: [true, 'please fill date']
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
})

const Todo = mongoose.model('todo', todoSchema)

module.exports = Todo
