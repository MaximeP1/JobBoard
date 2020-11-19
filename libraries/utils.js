const jb = require('./jobBoardDB_API')
const crypt = require('./cryptPassword')
var Strategy = require('passport-local').Strategy

function removeTrailingSlash (req, res, next) {
  if (req.path.substr(-1) === '/' && req.path.length > 1) {
    const query = req.url.slice(req.path.length)
    res.redirect(301, req.path.slice(0, -1) + query)
  } else {
    next()
  }
}

var strategy = new Strategy(
  {
    usernameField: 'email',
    passwordField: 'psw'
  },
  function (username, password, cb) {
    var user
    jb.People.getByEmail(username).then(result => {
      user = result
      jb.People.login(username).then(userPass => {
        if (Object.keys(userPass).length === 0) { return cb(null, false, { message: 'Email or password incorrect' }) }
        crypt.compare(password, userPass[0].password).then(pass => {
          if (!pass) { return cb(null, false, { message: 'Email or password incorrect' }) }
          return cb(null, user)
        })
      })
    })
  }
)

function serializeUser (user, cb) {
  cb(null, user[0].id)
}

function deserializeUser (id, cb) {
  jb.People.getByID(id).then(user => {
    cb(null, user)
  })
}

function allowUser (req, res) {
  var allowed = false
  req.user !== undefined
    ? req.user[0].admin === 1
      ? allowed = true
      : res.status(403).render('error', { statusCode: 403 })
    : res.status(403).render('error', { statusCode: 403 })
  return allowed
}

function pageNotFound (req, res) {
  res.status(404)

  if (req.accepts('html')) {
    res.render('error', { statusCode: 404 })
    return
  }

  if (req.accepts('json')) {
    res.send({ error: '404 Not found' })
    return
  }

  res.type('txt').send('Not found')
}

module.exports = {
  removeTrailingSlash: removeTrailingSlash,
  strategy: strategy,
  serializeUser: serializeUser,
  deserializeUser: deserializeUser,
  allowUser: allowUser,
  pageNotFound: pageNotFound
}
