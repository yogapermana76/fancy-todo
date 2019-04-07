const Todo = require('../models/todo')

class TodoController {

  static addTodo(req, res) {
    Todo.create({
      name: req.body.name,
      description: req.body.description,
      status: req.body.status,
      due_date: req.body.due_date,
      user_id: req.body.user_id
    })
      .then(todo => {
        res.status(201).json(todo)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static findAllTodo(req, res) {
    Todo.find({
      user_id: req.params.id
    })
      .populate('user_id')
      .then(todos => {
        res.status(200).json(todos)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static updateTodo(req, res) {
    Todo.findByIdAndUpdate(req.params.id, {
      status: 'completed'
    })
      .then(() => {
        res.status(201).json('success update')
      })
      .catch(err => {
        res.status(500).json(err)
      }) 
  }

  static deleteTodo(req, res) {
    Todo.findByIdAndDelete(req.params.id)
      .then(() => {
        res.status(200).json('success deleted')
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

}

module.exports = TodoController