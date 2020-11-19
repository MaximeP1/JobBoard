var express = require('express')
var passport = require('passport')
var router = express.Router()

var LoginController = require('../controllers/login.controller')

router.get('/', LoginController.getLoginPage)

router.post('/sign-in', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }), LoginController.signIn)

module.exports = router
