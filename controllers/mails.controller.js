const jb = require('../libraries/jobBoardDB_API')

exports.getAll = function (req, res, next) {
  jb.Mails.getAll().then(rows => res.json(rows))
}

exports.columnsName = function (req, res, next) {
  jb.Mails.getColumnsName().then(result => res.json(result))
}

exports.newMail = function (req, res, next) {
  jb.Mails.new(
    req.body.sender,
    req.body.recipient,
    req.body.company,
    req.body.advertisement,
    req.body.message
  ).then(() => res.send('New mail'), err => res.status(400).send('Error :' + err))
}

exports.deleteMails = function (req, res, next) {
  var done = 0
  var length = Object.keys(req.body).length
  for (const i in req.body) {
    jb.Mails.deleteByID(req.body[i]).then(() => {
      done++
      if (done === length) res.send('Mails Deleted')
    })
  }
}

exports.updateMails = function (req, res, next) {
  var error = 0
  var sender = isNaN(req.body[0]) ? error++ : req.body[0] * 1
  var recipient = isNaN(req.body[1]) ? error++ : req.body[1] * 1
  var company = isNaN(req.body[2]) ? error++ : req.body[2] * 1
  var advertisement = isNaN(req.body[3]) ? error++ : req.body[3] * 1
  var message = req.body[4].trim() === '' ? null : req.body[4]
  var id = req.body.id
  if (error) res.sendStatus(400)
  else {
    jb.Mails.update(id, sender, recipient, company, advertisement, message).then(() => {
      res.send('Mail updated')
    }, () => res.sendStatus(400))
  }
}
