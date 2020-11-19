require('dotenv').config()
const Advertisements = require('../models/advertisements.model')
const Companies = require('../models/companies.model')
const People = require('../models/people.model')
const Applications = require('../models/applications.model')
const Mails = require('../models/mails.model')

module.exports = {
  Advertisements: Advertisements.Class,
  Companies: Companies.Class,
  People: People.Class,
  Applications: Applications.Class,
  Mails: Mails.Class
}
