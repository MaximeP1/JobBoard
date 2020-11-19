const jb = require('../libraries/jobBoardDB_API')
const crypt = require('../libraries/cryptPassword')

exports.getAll = function (req, res, next) {
  jb.People.getAll().then(rows => res.json(rows))
}

exports.signUp = function (req, res, next) {
  const admin = req.body.admin ? req.body.admin : 0
  jb.People.checkEmailExist(req.body.email).then(exist => {
    exist ? res.status(409).send('Email already exist')
      : crypt.hash(req.body.password).then((password) => {
        jb.People.signUp(req.body.firstName, req.body.lastName, req.body.email, password, req.body.phone, req.body.applicant, req.body.recruiter, admin)
          .then(() => res.send('New user'), err => res.status(400).send('Error :' + err))
      })
  })
}

exports.columnsName = function (req, res, next) {
  jb.People.getColumnsName().then(result => res.json(result))
}

exports.deletePeople = function (req, res, next) {
  var done = 0
  var length = Object.keys(req.body).length
  for (const i in req.body) {
    jb.Mails.deleteByPeopleID(req.body[i]).then(() => {
      jb.Applications.deleteByPeopleID(req.body[i]).then(() => {
        jb.People.deleteByID(req.body[i]).then(() => {
          done++
          if (done === length) res.send('People Deleted')
        })
      })
    })
  }
}

exports.updatePeople = function (req, res, next) {
  var error = 0
  var applicant = isNaN(req.body[0]) ? 0 : req.body[0] * 1
  var recruiter = isNaN(req.body[1]) ? 0 : req.body[1] * 1
  var admin = isNaN(req.body[2]) ? 0 : req.body[2] * 1
  var firstName = req.body[3].trim() === '' ? null : req.body[3]
  var lastName = req.body[4].trim() === '' ? null : req.body[4]
  var email = req.body[5].trim() === '' ? error++ : req.body[5]
  var phone = req.body[7].trim() === '' ? null : req.body[7]
  var id = req.body.id
  if (req.body[6].trim() === '' || error) res.sendStatus(400)
  else {
    if (req.body[6].length === 60 && req.body[6].charAt() === '$') {
      jb.People.update(id, firstName, lastName, email, req.body[6], phone, applicant, recruiter, admin).then(() => {
        res.send('People updated')
      }, err => console.log(err))
    } else {
      crypt.hash(req.body[6]).then(password => {
        jb.People.update(id, firstName, lastName, email, password, phone, applicant, recruiter, admin).then(() => {
          res.send('People updated')
        }, () => res.sendStatus(400))
      })
    }
  }
}

exports.updateProfile = function (req, res, next) {
  jb.People.updateProfile(
    req.user[0].id,
    req.body.firstName,
    req.body.lastName,
    req.body.email,
    req.body.phone
  ).then(() => {
    if (req.body.oldPassword !== '' ||
    req.body.password !== '' ||
    req.body.passConfirm !== '') {
      crypt.compare(req.body.oldPassword, req.user[0].password).then(match => {
        if (match) {
          if (req.body.password === req.body.passConfirm && req.body.password.length < 8) {
            crypt.hash(req.body.password).then(password => {
              jb.People.updatePassword(req.user[0].id, password).then(() => {
                res.send('Profile and Password updated')
              })
            })
          } else res.status(400).send('Password and Confirmation does not match or password too short')
        } else res.status(401).send('Old password incorrect')
      }, () => res.sendStatus(400))
    } else res.send('Profile updated')
  }, () => res.sendStatus(400))
}
