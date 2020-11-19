var express = require('express')
var router = express.Router()
var LogoutController = require('../controllers/logout.controller')

router.get('/', LogoutController.logout)

module.exports = router
