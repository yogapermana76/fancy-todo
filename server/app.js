require('dotenv').config();
const express = require('express')
const app = express()
const port = 3000
const routes = require('./routes/index')
const cors = require('cors')
const mongoose = require('mongoose')
mongoose.connect(`mongodb+srv://${process.env.USERNAME_DB}:${process.env.PASSWORD_DB}@cluster0-y1tro.mongodb.net/fancy-todo?retryWrites=true`, { useNewUrlParser: true });

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