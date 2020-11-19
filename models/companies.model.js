const mysql = require('mysql')
const connexion = require('../libraries/mysqlConnexion').connexion

class Companies {
  static getAll () {
    var sql = 'SELECT * FROM companies'
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getByID (id) {
    var sql = mysql.format('SELECT * FROM companies WHERE id=?', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getByName (name) {
    var sql = mysql.format('SELECT * FROM companies WHERE name=?', name)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getNumber () {
    var sql = mysql.format('SELECT COUNT(*) FROM companies')
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(Object.values(result[0])[0])
      })
    })
  }

  static getOne (position) {
    if (position < 1) position = 1
    var sql = mysql.format(
      'SELECT * FROM companies LIMIT ?, ?',
      [(position - 1), 1])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getColumnsName () {
    var sql = "SELECT `COLUMN_NAME`, `COLUMN_TYPE`, `IS_NULLABLE` FROM `INFORMATION_SCHEMA`.`COLUMNS`  WHERE `TABLE_SCHEMA`='JobBoard' AND `TABLE_NAME`='companies' ORDER BY `ORDINAL_POSITION`"
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static addCompany (name, email) {
    var sql = mysql.format('INSERT INTO companies (name, email) VALUES (?, ?)', [name, email])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static update (id, name, email) {
    var sql = `UPDATE companies
               SET    name = ?,
                      email = ?
               WHERE  id = ?`
    sql = mysql.format(sql, [name, email, id])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByID (id) {
    var sql = mysql.format('DELETE FROM companies WHERE id=?', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
}

module.exports = { Class: Companies }
