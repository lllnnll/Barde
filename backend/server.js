const { app, ready } = require('./app')
const port = process.env.PORT || 3000

async function start() {
  try {
    await ready
    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

if (require.main === module) {
  start()
}

module.exports = app
