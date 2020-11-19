const jb = require('./libraries/jobBoardDB_API')
const crypt = require('./libraries/cryptPassword')
const Chance = require('chance')
require('dotenv').config()

const chance = new Chance()

const companiesNumber = process.env.COMPANIES_NUMBER
const adsNumber = process.env.ADS_NUMBER

function createTestUsers () {
  // create the admin user
  crypt.hash('admin').then(pass => jb.People.signUp('admin', '', 'admin', pass, '', 0, 0)
    .then(() => jb.People.setAdmin()))
  // create test applicant
  crypt.hash('secret').then(pass => jb.People.signUp('Jack', 'Test-User', 'Jack@jobboard.com', pass, '', 1, 0))
  // create test recruiter
  crypt.hash('password').then(pass => jb.People.signUp('Michel', 'Test-Recruiter', 'Michel@jobboard.com', pass, '', 0, 1))
}

function fillCompanies () {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < companiesNumber; i++) {
      jb.Companies.addCompany(chance.company(), chance.email()).then(() => {
        if (i === (companiesNumber - 1)) resolve('Companies Sample done')
      }, err => reject(err))
    }
  })
}

function fillAds () {
  return new Promise((resolve, reject) => {
    jb.Companies.getNumber().then(number => {
      for (let i = 0; i < adsNumber; i++) {
        jb.Companies.getOne(Math.floor(Math.random() * number)).then(company => {
          jb.Advertisements.newAd(
            chance.profession(),
            chance.sentence({ words: 10 }),
            chance.paragraph(),
            Math.floor(Math.random() * 50000 + 20000),
            chance.city(),
            Math.random() > 0.5 ? null : 35,
            company[0].id
          ).then(() => {
            if (i === (adsNumber - 1)) resolve('Advertisements Sample done')
          }, err => reject(err))
        })
      }
    })
  })
}

function fillDB () {
  console.log('fill DB started')

  const start = new Date().getTime()
  createTestUsers()
  fillCompanies().then(res => {
    console.log(res)
    fillAds().then((res) => {
      var end = new Date().getTime()
      console.log(res)
      console.log(companiesNumber, ' + ', adsNumber + ' new rows', (end - start) + 'ms')
      require('./libraries/mysqlConnexion').connexion.end()
    })
  })
}

fillDB()
