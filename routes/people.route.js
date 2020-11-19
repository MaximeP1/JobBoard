var express = require('express')
var router = express.Router()

var PeopleController = require('../controllers/people.controller')

router.get('/', PeopleController.getAll)

router.get('/columns', PeopleController.columnsName)

router.post('/new', PeopleController.signUp)

router.post('/update', PeopleController.updatePeople)

router.post('/updateProfile', PeopleController.updateProfile)

router.delete('/delete', PeopleController.deletePeople)

module.exports = router
