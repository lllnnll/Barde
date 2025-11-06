require('dotenv').config()
const express = require('express')
const app = express()
const port = process.env.PORT || 3000
const db = require('./db')

// Middleware CORS pour permettre les requêtes depuis le frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

// Middleware pour parser le JSON
app.use(express.json())

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Healthcheck DB
app.get('/health/db', async (req, res) => {
  try {
    const result = await db.query('SELECT 1 as ok')
    res.json({ status: 'ok', db: result.rows[0] })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// Route des users
const usersRouter = require('./users/route')
app.use('/users', usersRouter)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
