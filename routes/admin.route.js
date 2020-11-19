var express = require('express')
var router = express.Router()

var AdminController = require('../controllers/admin.controller')

router.get('/', AdminController.getAdminPage)

module.exports = router
