const path = require('path')
const jb = require('../libraries/jobBoardDB_API')

exports.getMainPage = function (req, res, next) {
  var values = []
  var ads = []
  var user = req.user !== undefined
  jb.Advertisements.getPage(1).then(result => {
    result.forEach((item, i) => {
      ads.push({ title: item.title, preview: item.preview, i: i })
    })
    values = { ads: ads, user: user }
    if (user) {
      values.name = req.user[0].firstName + ' ' + req.user[0].lastName
      values.email = req.user[0].email
      values.phone = req.user[0].phone
      values.id = req.user[0].id
    }
    req.user !== undefined
      ? req.user[0].admin === 1
        ? res.redirect('/admin')
        : res.render('index', values)
      : res.render('index', values)
  })
}

exports.getFavicon = function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public/resources/favicon.ico'))
}
