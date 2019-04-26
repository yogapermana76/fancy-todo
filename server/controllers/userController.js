const User = require('../models/user')
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { compare } = require('../helpers/bcrypt')
const { sign } = require('../helpers/jwt')

class UserController {

  static login(req, res) {
    User.findOne({
      email: req.body.email
    })
      .then(foundUser => {
        if(!foundUser) {
          res.status(401).json({
            message: 'email not found!'
          })
        } else {
          const verifyPassword = compare(req.body.password, foundUser.password)
          if(!verifyPassword) {
            res.status(401).json({
              message: 'password wrong!'
            })
          } else {
            const { id, email, name } = foundUser
            let token = sign({
              id: foundUser.id,
              email: foundUser.email
            }, process.env.SECRET_KEY)
            res.status(200).json({
              token,
              id,
              email,
              name
            })
            // req.headers.token = token ga perlu disini
          }
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static signInGoogle(req, res) {
    let payload = null
    client.verifyIdToken({
      idToken: req.body.id_token,
      audience: process.env.CLIENT_ID
    })
      .then(ticket => {
        payload = ticket.getPayload();
        return User.findOne({
          email: payload.email
        })
      })
      .then(user => {
        if(!user) {
          return User.create({
            email: payload.email,
            name: payload.name,
            password: process.env.PASSWORD
          })
        } else {
          return user
        }
      })
      .then(user => {
          const { id } = user
          let token = sign({
            email: payload.email,
            name: payload.name,
            password: payload.password
        }, process.env.SECRET_KEY)
        // req.headers.token = token
        res.status(201).json({
          token,
          id,
        })
      })
      .catch(err => {
        res.status(500).json({ err: err.message })
      })
  }

  static register(req, res) {
    User.findOne({
      email: req.body.email
    })
      .then(foundUser => {
        if(!foundUser) {
          return User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })
        } else {
          return new Promise(resolve => {
            resolve({
              status: 401,
              error: true,
              message: 'email already exist'
            })
          })

        }
      })
      .then(user => {
        if (user.error) {
            res.status(401).json({
            message: 'email already exist'
          })
        } else {
          console.log('asd')
          res.status(201).json(user)
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

}

module.exports = UserController