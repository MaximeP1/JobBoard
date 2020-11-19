const mysql = require('mysql')
const connexion = require('../libraries/mysqlConnexion').connexion

class People {
  static getAll () {
    var sql = 'SELECT * FROM people'
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getByID (id) {
    var sql = mysql.format('SELECT * FROM people WHERE id=?', [id])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getByEmail (email) {
    var sql = mysql.format('SELECT * FROM people WHERE email=?', [email])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getColumnsName () {
    var sql = "SELECT `COLUMN_NAME`, `COLUMN_TYPE`, `IS_NULLABLE` FROM `INFORMATION_SCHEMA`.`COLUMNS` WHERE `TABLE_SCHEMA`='JobBoard' AND `TABLE_NAME`='people' ORDER BY `ORDINAL_POSITION`"
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static checkIfAdmin (email) {
    var sql = mysql.format('SELECT admin FROM people WHERE email=?', [email])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result.length !== 0 ? result[0].admin !== 0 : false)
      })
    })
  }

  static checkEmailExist (email) {
    var sql = mysql.format('SELECT * FROM people WHERE email=?', [email])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        result.length !== 0 ? resolve(true) : resolve(false)
      })
    })
  }

  static login (email) {
    var sql = mysql.format('SELECT password FROM people WHERE email=?', [email])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static signUp (firstName, lastName, email, password, phone, applicant, recruiter, admin = 0) {
    var sql = mysql.format(
      'INSERT INTO people (firstName, lastName, email, password, phone, applicant, recruiter, admin) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [firstName, lastName, email, password, phone, applicant, recruiter, admin])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static setAdmin () {
    return new Promise((resolve, reject) => {
      connexion.query('UPDATE people SET admin=1 WHERE email="admin"', function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static update (id, firstName, lastName, email, password, phone, applicant, recruiter, admin) {
    var sql = `UPDATE people
               SET    firstName = ?,
                      lastName = ?,
                      email = ?,
                      password = ?,
                      phone = ?,
                      applicant = ?,
                      recruiter = ?,
                      admin = ?
               WHERE  id = ?`
    sql = mysql.format(sql, [firstName, lastName, email, password, phone, applicant, recruiter, admin, id])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static updateProfile (id, firstName, lastName, email, phone) {
    var sql = `UPDATE people
               SET    firstName = ?,
                      lastName = ?,
                      email = ?,
                      phone = ?
               WHERE  id = ?`
    sql = mysql.format(sql, [firstName, lastName, email, phone, id])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static updatePassword (id, password) {
    var sql = `UPDATE people
               SET    password = ?
               WHERE  id = ?`
    sql = mysql.format(sql, [password, id])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByID (id) {
    var sql = mysql.format('DELETE FROM people WHERE id=?', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
}

module.exports = { Class: People }
