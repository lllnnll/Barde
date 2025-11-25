require('dotenv').config()
const express = require('express')
const { prisma } = require('./prismaClient')

const app = express()
const usersRouter = require('./users/route')
const bardesRouter = require('./bardes/route')

const allowOrigin = process.env.CORS_ALLOW_ORIGIN || '*'

// Simple CORS headers so the Vite frontend can call the API both locally & on Vercel
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', allowOrigin)
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200)
  }
  next()
})

app.use(express.json())

app.get('/', (_req, res) => {
  res.send('Barde API up and running')
})

app.get('/health/db', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok' })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

app.use('/users', usersRouter)
app.use('/bardes', bardesRouter)

// Prepare the connection ahead of the first request (important on serverless)
const ready = (async () => {
  try {
    await prisma.$connect()
    console.log('Prisma connection ready')
    return true
  } catch (err) {
    console.error('Failed to initialize database connection', err)
    throw err
  }
})()

process.on('beforeExit', async () => {
  await prisma.$disconnect()
})

module.exports = { app, ready }


