const router = require('express').Router()
const routeUser = require('./user')
const routeTodo = require('./todo')

router.get('/', (req, res) => {
  console.log('hello world')
})

router.use('/users', routeUser)
router.use('/todos', routeTodo)

module.exports = router