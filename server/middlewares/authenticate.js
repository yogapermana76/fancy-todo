const { verify } = require('../helpers/jwt')

module.exports = (req, res, next) => {
  try {
    const decoded = verify(req.headers.token, process.env.SECRET_KEY)
    req.authenticated = decoded
    next()
  } catch(err) {
    res.status(401).json({ type: 'authenticate eror', message: 'you do not have access to this page' })
  }
}