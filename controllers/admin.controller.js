const path = require('path')
const utils = require('../libraries/utils')

exports.getAdminPage = function (req, res, next) {
  if (utils.allowUser(req, res)) res.sendFile(path.join(__dirname, '../public/html/database.html'))
}
