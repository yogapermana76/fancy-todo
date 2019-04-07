const router = require('express').Router()
const TodoController = require('../controllers/todoController')
const authenticate = require('../middlewares/authenticate')

router.use(authenticate)
router.post('/', TodoController.addTodo)
router.get('/:id', TodoController.findAllTodo)
router.delete('/:id/delete', TodoController.deleteTodo)
router.put('/:id/update', TodoController.updateTodo)


module.exports = router