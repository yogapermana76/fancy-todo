require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes/index')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost:27017/fancy-todo', { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('database connect')
})

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/', routes)

app.listen(port, () => {
  console.log(`listen on port ${port}`)
})