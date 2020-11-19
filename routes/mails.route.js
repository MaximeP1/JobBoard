var express = require('express')
var router = express.Router()

var MailsController = require('../controllers/mails.controller')

router.get('/', MailsController.getAll)

router.get('/columns', MailsController.columnsName)

router.post('/new', MailsController.newMail)

router.post('/update', MailsController.updateMails)

router.delete('/delete', MailsController.deleteMails)

module.exports = router
