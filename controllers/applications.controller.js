const jb = require('../libraries/jobBoardDB_API')

exports.getAll = function (req, res, next) {
  jb.Applications.getAll().then(rows => res.json(rows))
}

exports.newApplication = function (req, res, next) {
  if (req.user) {
    jb.Applications.new(req.body.fullName, req.body.email, req.body.phone, req.body.message, req.body.advertisement, req.body.applicant)
      .then(() => res.send('New application'), err => res.status(400).send('Error :' + err))
  } else {
    jb.Applications.newApplicationWithoutAccount(req.body.fullName, req.body.email, req.body.phone, req.body.message, req.body.adID)
      .then(() => res.send('New application'), err => res.status(400).send('Error :' + err))
  }
}

exports.columnsName = function (req, res, next) {
  jb.Applications.getColumnsName().then(result => res.json(result))
}

exports.deleteApplications = function (req, res, next) {
  var done = 0
  var length = Object.keys(req.body).length
  for (const i in req.body) {
    jb.Applications.deleteByID(req.body[i]).then(() => {
      done++
      if (done === length) res.send('Applications Deleted')
    })
  }
}

exports.updateApplication = function (req, res, next) {
  var error = 0
  var applicant = req.body[0] !== ''
    ? isNaN(req.body[0])
      ? error++
      : req.body[0] * 1
    : null
  var fullName = req.body[1].trim() === '' ? null : req.body[1]
  var email = req.body[2].trim() === '' ? null : req.body[2]
  var phone = req.body[3].trim() === '' ? null : req.body[3]
  var advertisement = isNaN(req.body[4]) ? error++ : req.body[4] * 1
  var message = req.body[5].trim() === '' ? null : req.body[5]
  var id = req.body.id
  if (error) res.sendStatus(400)
  else {
    jb.Applications.update(id, applicant, fullName, email, phone, advertisement, message).then(() => {
      res.send('Application updated')
    }, err => res.status(400).send(err))
  }
}
