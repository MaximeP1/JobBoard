exports.getLoginPage = function (req, res, next) {
  res.render('login', { message: req.flash('error') })
}

exports.signIn = function (req, res, next) {
  res.redirect('/')
}
