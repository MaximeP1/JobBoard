var express = require('express')
var router = express.Router()
var ProfileController = require('../controllers/profile.controller')

router.get('/', ProfileController.getProfile)

module.exports = router
