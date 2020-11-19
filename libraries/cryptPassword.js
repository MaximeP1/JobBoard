const bcrypt = require('bcrypt')
const saltRounds = 10

function hash (password) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, saltRounds, function (err, hash) {
      if (err) return reject(err)
      resolve(hash)
    })
  })
}

function compare (password, hash) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, hash, function (err, result) {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

module.exports = {
  hash: hash,
  compare: compare
}
