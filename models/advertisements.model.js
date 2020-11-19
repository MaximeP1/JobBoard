const mysql = require('mysql')
const articlesMaxOnPage = 9

const connexion = require('../libraries/mysqlConnexion').connexion

class Advertisements {
  static getAll () {
    var sql = 'SELECT * FROM advertisements'
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getPage (page) {
    if (page < 1) page = 1
    var sql = mysql.format(
      'SELECT * FROM advertisements LIMIT ?, ?',
      [(page - 1) * articlesMaxOnPage, articlesMaxOnPage])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getByID (id) {
    var sql = mysql.format('SELECT * FROM advertisements WHERE id=? LIMIT 1', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getIDByPosition (position) {
    position = position * 1
    var sql = mysql.format('SELECT id FROM advertisements ORDER BY id LIMIT ?, 1', position)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getColumnsName () {
    var sql = "SELECT `COLUMN_NAME`, `COLUMN_TYPE`, `IS_NULLABLE` FROM `INFORMATION_SCHEMA`.`COLUMNS`  WHERE `TABLE_SCHEMA`='JobBoard' AND `TABLE_NAME`='advertisements' ORDER BY `ORDINAL_POSITION`"
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static number () {
    var sql = mysql.format('SELECT COUNT(*) FROM advertisements')
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(Object.values(result[0])[0])
      })
    })
  }

  static newAd (title, preview, description, wage, place, workingTime, company) {
    return new Promise((resolve, reject) => {
      var sql = mysql.format(
        'INSERT INTO advertisements (title, preview, description, wage, place, workingTime, company) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, preview, description, wage, place, workingTime, company])
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static update (id, title, preview, description, wage, place, workingTime, company) {
    var sql = `UPDATE advertisements
               SET    title = ?,
                      preview = ?,
                      description = ?,
                      wage = ?,
                      place = ?,
                      workingTime = ?,
                      company = ?
               WHERE  id = ?`
    sql = mysql.format(sql, [title, preview, description, wage, place, workingTime, company, id])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByID (id) {
    var sql = mysql.format('DELETE FROM advertisements WHERE id=?', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByCompanyID (id) {
    var sql = mysql.format('DELETE FROM advertisements WHERE company=?', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
}

module.exports = { Class: Advertisements }
