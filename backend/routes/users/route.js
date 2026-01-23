const express = require('express')
const router = express.Router()
const { prisma } = require('../../prismaClient')
const bcrypt = require('bcrypt');

// GET all users (with pagination)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { user_id: 'asc' }
      }),
      prisma.user.count()
    ])

    res.json({
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// GET user by id
router.get('/:id', async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid id parameter' })
    }
    const user = await prisma.user.findUnique({ where: { user_id: userId } })
    if (!user) return res.status(404).json({ message: 'User not found' })
    res.json(user)
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// POST create new user
router.post('/', async (req, res) => {
  try {
    const { user_username, user_email, user_password } = req.body
    if (!user_username || !user_email || !user_password) {
      return res.status(400).json({ message: 'Missing user_username, user_email, or user_password' })
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const created = await prisma.user.create({
      data: { user_username, user_email, user_password: hashedPassword },
    })
    res.status(201).json(created)
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ status: 'error', message: 'Email already exists' })
    }
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// PUT update user
router.put('/:id', async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid id parameter' })
    }
    const updates = {}
    if (req.body.user_username !== undefined) updates.user_username = req.body.user_username
    if (req.body.user_email !== undefined) updates.user_email = req.body.user_email

    const updated = await prisma.user.update({
      where: { user_id: userId },
      data: updates,
    })

    res.json(updated)
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ status: 'error', message: 'Email already exists' })
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    const userId = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid id parameter' })
    }

    await prisma.user.delete({ where: { user_id: userId } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'User not found' })
    }
    res.status(500).json({ status: 'error', message: err.message })
  }
})

module.exports = router