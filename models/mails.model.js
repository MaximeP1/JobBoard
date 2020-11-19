const connexion = require('../libraries/mysqlConnexion').connexion
const mysql = require('mysql')

class Mails {
  static getAll () {
    var sql = 'SELECT * FROM mails'
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getColumnsName () {
    var sql = "SELECT `COLUMN_NAME`, `COLUMN_TYPE`, `IS_NULLABLE` FROM `INFORMATION_SCHEMA`.`COLUMNS`  WHERE `TABLE_SCHEMA`='JobBoard' AND `TABLE_NAME`='mails' ORDER BY `ORDINAL_POSITION`"
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static new (sender, recipient, company, advertisement, message) {
    var sql = mysql.format(
      'INSERT INTO mails (sender, recipient, company, advertisement, message) VALUES (?, ?, ?, ?, ?)',
      [sender, recipient, company, advertisement, message])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static update (id, sender, recipient, company, advertisement, message) {
    var sql = `UPDATE mails
               SET    sender = ?,
                      recipient = ?,
                      company = ?,
                      advertisement = ?,
                      message = ?
               WHERE  id = ?`
    sql = mysql.format(sql, [sender, recipient, company, advertisement, message, id])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByID (id) {
    var sql = mysql.format('DELETE FROM mails WHERE id=?', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByCompanyID (id) {
    var sql = mysql.format('DELETE mails FROM mails INNER JOIN advertisements ON mails.advertisement=advertisements.id WHERE advertisements.company=?', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByAdvertisementID (id) {
    var sql = mysql.format('DELETE FROM mails WHERE advertisement=?', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByPeopleID (id) {
    var sql = mysql.format('DELETE FROM mails WHERE sender=? OR recipient=?', [id, id])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
}

module.exports = { Class: Mails }
