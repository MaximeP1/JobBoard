const utils = require('./libraries/utils')
const express = require('express')
const mustacheExpress = require('mustache-express')
const passport = require('passport')
const path = require('path')
const flash = require('connect-flash')
const app = express()
const port = 3000

passport.use(utils.strategy)
passport.serializeUser(utils.serializeUser)
passport.deserializeUser(utils.deserializeUser)

const root = require('./routes/root.route')
const login = require('./routes/login.route')
const logout = require('./routes/logout.route')
const advertisements = require('./routes/advertisements.route')
const companies = require('./routes/companies.route')
const people = require('./routes/people.route')
const applications = require('./routes/applications.route')
const mails = require('./routes/mails.route')
const admin = require('./routes/admin.route')
const profile = require('./routes/profile.route')

app.use(express.json())
app.use(utils.removeTrailingSlash)

app.set('views', `${__dirname}/public/html`)
app.set('view engine', 'mustache')
app.engine('mustache', mustacheExpress())

app.use(require('body-parser').urlencoded({ extended: true }))
app.use(require('express-session')({ secret: '^]T2)j/W-rWak{[3GFn$?gYZiv,YIV', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())

app.use('/public', express.static(path.join(__dirname, 'public')))

app.use('/', root)
app.use('/login', login)
app.use('/logout', logout)
app.use('/advertisements', advertisements)
app.use('/companies', companies)
app.use('/people', people)
app.use('/applications', applications)
app.use('/mails', mails)
app.use('/admin', admin)
app.use('/profile', profile)

app.use(utils.pageNotFound)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
