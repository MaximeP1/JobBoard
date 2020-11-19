const jb = require('../libraries/jobBoardDB_API')

exports.getAll = function (req, res, next) {
  jb.Advertisements.getAll().then(rows => {
    res.json(rows)
  })
}

exports.getNumber = function (req, res, next) {
  jb.Advertisements.number().then(number => {
    res.json(number)
  })
}

exports.getPage = function (req, res, next) {
  const page = req.params.page ? req.params.page : 1
  jb.Advertisements.getPage(page).then(rows => {
    res.json(rows)
  })
}

exports.getByID = function (req, res, next) {
  const id = req.params.id ? req.params.id : res.status(404).render('error', { statusCode: 404 })
  jb.Advertisements.getByID(id).then(rows => {
    res.json(rows)
  })
}

exports.getIDByPosition = function (req, res, next) {
  const position = req.params.position ? req.params.position : res.status(404).render('error', { statusCode: 404 })
  jb.Advertisements.getIDByPosition(position).then(rows => {
    res.json(rows)
  })
}

exports.columnsName = function (req, res, next) {
  jb.Advertisements.getColumnsName().then(result => res.json(result))
}

exports.newAd = function (req, res, next) {
  jb.Advertisements.newAd(
    req.body.title,
    req.body.preview,
    req.body.description,
    req.body.wage,
    req.body.place,
    req.body.workingTime,
    req.body.company
  ).then(() => res.send('New advertisement'), err => res.status(400).send('Error :' + err))
}

exports.deleteAdvertisements = function (req, res, next) {
  var done = 0
  var length = Object.keys(req.body).length
  for (const i in req.body) {
    jb.Mails.deleteByAdvertisementID(req.body[i]).then(() => {
      jb.Applications.deleteByAdvertisementID(req.body[i]).then(() => {
        jb.Advertisements.deleteByID(req.body[i]).then(() => {
          done++
          if (done === length) res.send('Advertisements Deleted')
        })
      })
    })
  }
}

exports.updateAdvertisement = function (req, res, next) {
  var error = 0
  var title = req.body[0].trim() === '' ? error++ : req.body[0]
  var preview = req.body[1].trim() === '' ? error++ : req.body[1]
  var description = req.body[2].trim() === '' ? error++ : req.body[2]
  var wage = isNaN(req.body[3]) ? null : req.body[3] * 1
  var place = req.body[4].trim() === '' ? null : req.body[4]
  var workingTime = isNaN(req.body[5]) ? null : req.body[5] * 1
  var company = isNaN(req.body[6]) ? error++ : req.body[6] * 1
  var id = req.body.id
  if (error) res.sendStatus(400)
  else {
    jb.Advertisements.update(id, title, preview, description, wage, place, workingTime, company, id).then(() => {
      res.send('Application updated')
    }, err => res.status(400).send(err))
  }
}
