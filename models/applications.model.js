const mysql = require('mysql')
const connexion = require('../libraries/mysqlConnexion').connexion

class Applications {
  static getAll () {
    var sql = 'SELECT * FROM applications'
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static getColumnsName () {
    var sql = "SELECT `COLUMN_NAME`, `COLUMN_TYPE`, `IS_NULLABLE` FROM `INFORMATION_SCHEMA`.`COLUMNS`  WHERE `TABLE_SCHEMA`='JobBoard' AND `TABLE_NAME`='applications' ORDER BY `ORDINAL_POSITION`"
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static new (fullName, email, phone, message, advertisementID, applicantID) {
    var sql = mysql.format(
      'INSERT INTO applications (fullName, email, phone, message, advertisement, applicant) VALUES (?, ?, ?, ?, ?, ?)',
      [fullName, email, phone, message, advertisementID, applicantID])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static newApplicationWithoutAccount (fullName, email, phone, message, advertisementID) {
    var sql = mysql.format(
      'INSERT INTO applications (fullName, email, phone, message, advertisement) VALUES (?, ?, ?, ?, ?)',
      [fullName, email, phone, message, advertisementID])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static newApplicationWithAccount (applicantID, advertisementID, message) {
    var sql = mysql.format(
      'INSERT INTO applications (applicant, advertisement, message) VALUES (?, ?, ?)',
      [applicantID, advertisementID, message])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  static update (id, applicantID, fullName, email, phone, advertisementID, message) {
    var sql = `UPDATE applications
               SET    applicant = ?,
                      fullName = ?,
                      email = ?,
                      phone = ?,
                      advertisement = ?,
                      message = ?
               WHERE  id = ?`
    sql = mysql.format(sql, [applicantID, fullName, email, phone, advertisementID, message, id])
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByID (id) {
    var sql = mysql.format('DELETE FROM applications WHERE id=?', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByCompanyID (id) {
    var sql = mysql.format('DELETE applications FROM applications INNER JOIN advertisements ON applications.advertisement=advertisements.id WHERE company=?;', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByAdvertisementID (id) {
    var sql = mysql.format('DELETE FROM applications WHERE advertisement=?', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  static deleteByPeopleID (id) {
    var sql = mysql.format('DELETE FROM applications WHERE applicant=?', id)
    return new Promise((resolve, reject) => {
      connexion.query(sql, function (err, result) {
        if (err) reject(err)
        resolve(result)
      })
    })
  }
}

module.exports = { Class: Applications }
