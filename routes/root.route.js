var express = require('express')
var router = express.Router()

var RootController = require('../controllers/root.controller')

router.get('/', RootController.getMainPage)

router.get('/favicon.ico', RootController.getFavicon)

module.exports = router
