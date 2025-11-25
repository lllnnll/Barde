const { app, ready } = require('../backend/app')

module.exports = async (req, res) => {
  await ready
  return app(req, res)
}


