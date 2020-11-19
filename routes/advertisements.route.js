var express = require('express')
var router = express.Router()

var AdvertisementsController = require('../controllers/advertisements.controller')

router.get('/', AdvertisementsController.getAll)

router.get('/number', AdvertisementsController.getNumber)

router.get('/:page([0-9]+)', AdvertisementsController.getPage)

router.get('/getByID/:id([0-9]+)', AdvertisementsController.getByID)

router.get('/getIDByPosition/:position([0-9]+)', AdvertisementsController.getIDByPosition)

router.get('/columns', AdvertisementsController.columnsName)

router.post('/new', AdvertisementsController.newAd)

router.post('/update', AdvertisementsController.updateAdvertisement)

router.delete('/delete', AdvertisementsController.deleteAdvertisements)

module.exports = router
