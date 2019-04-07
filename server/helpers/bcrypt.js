const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10);

module.exports = {
  hash: function(password) {
    return bcrypt.hashSync(password, salt)
  },
  compare: function(password, hash) {
    return data = bcrypt.compareSync(password, hash)
  }
}