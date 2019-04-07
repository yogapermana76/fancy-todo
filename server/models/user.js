const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { hash } = require('../helpers/bcrypt')

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, 'please fill name']
  },
  email: {
    type: String,
    required: [true, 'please fill email']
  },
  password: {
    type: String,
    required: [true, 'please fill password']
  }
});

userSchema.pre('save', function(next) {
  if(this.password) {
    this.password = hash(this.password)
  }
  next()
})

const User = mongoose.model('user', userSchema)

module.exports = User