const mysql = require('mysql')
var connexion

connexion = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
})
connexion.connect(function (err) {
  if (err) throw err
  console.log('Connected!')
})

module.exports = { connexion: connexion }
