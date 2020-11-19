const jb = require('../libraries/jobBoardDB_API')

exports.getAll = function (req, res, next) {
  jb.Companies.getAll().then(rows => res.json(rows))
}

exports.getByID = function (req, res, next) {
  jb.Companies.getByID(req.params.id).then(rows => res.json(rows))
}

exports.columnsName = function (req, res, next) {
  jb.Companies.getColumnsName().then(result => res.json(result))
}

exports.newCompany = function (req, res, next) {
  jb.Companies.addCompany(
    req.body.name,
    req.body.email
  ).then(() => res.send('New company'), err => res.status(400).send('Error :' + err))
}

exports.deleteCompany = function (req, res, next) {
  var done = 0
  var length = Object.keys(req.body).length
  for (const i in req.body) {
    jb.Mails.deleteByCompanyID(req.body[i]).then(() => {
      jb.Applications.deleteByCompanyID(req.body[i]).then(() => {
        jb.Advertisements.deleteByCompanyID(req.body[i]).then(() => {
          jb.Companies.deleteByID(req.body[i]).then(() => {
            done++
            if (done === length) res.send('Companies Deleted')
          })
        })
      })
    })
  }
}

exports.updateCompany = function (req, res, next) {
  var error = 0
  var name = req.body[0].trim() === '' ? error++ : req.body[0]
  var email = req.body[1].trim() === '' ? null : req.body[1]
  var id = req.body.id
  if (error) res.sendStatus(400)
  else {
    jb.Companies.update(id, name, email).then(() => {
      res.send('Company updated')
    }, err => res.status(400).send(err))
  }
}
