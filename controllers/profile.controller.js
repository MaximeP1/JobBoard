exports.getProfile = function (req, res, next) {
  var user = req.user !== undefined
  if (user) {
    var values = {}

    values.firstName = req.user[0].firstName
    values.lastName = req.user[0].lastName
    values.email = req.user[0].email
    values.phone = req.user[0].phone
    values.applicant = req.user[0].applicant === 1 ? 'Applicant' : ''
    values.recruiter = req.user[0].recruiter === 1 ? 'Recruiter' : ''
    values.admin = req.user[0].admin === 1 ? 'Admin' : ''

    res.render('profile', values)
  } else res.redirect('/login')
}
