var express = require('express')
var router = express.Router()

var CompaniesController = require('../controllers/companies.controller')

router.get('/', CompaniesController.getAll)

router.get('/columns', CompaniesController.columnsName)

router.get('/:id([0-9]+)', CompaniesController.getByID)

router.post('/new', CompaniesController.newCompany)

router.post('/update', CompaniesController.updateCompany)

router.delete('/delete', CompaniesController.deleteCompany)

module.exports = router
