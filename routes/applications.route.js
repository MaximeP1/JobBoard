var express = require('express')
var router = express.Router()

var ApplicationsController = require('../controllers/applications.controller')

router.get('/', ApplicationsController.getAll)

router.get('/columns', ApplicationsController.columnsName)

router.post('/new', ApplicationsController.newApplication)

router.post('/update', ApplicationsController.updateApplication)

router.delete('/delete', ApplicationsController.deleteApplications)

module.exports = router
