const express = require('express')
const router = express.Router()
const { prisma } = require('../prismaClient')

// GET all bardes
router.get('/', async (_req, res) => {
  try {
    const bardes = await prisma.barde.findMany({ orderBy: { id: 'asc' } })
    res.json(bardes)
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// GET barde by id
router.get('/:id', async (req, res) => {
  try {
    const bardeId = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(bardeId)) {
      return res.status(400).json({ message: 'Invalid id parameter' })
    }

    const barde = await prisma.barde.findUnique({ where: { id: bardeId } })
    if (!barde) {
      return res.status(404).json({ message: 'Barde not found' })
    }
    res.json(barde)
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// POST create new barde
router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    if (!name) return res.status(400).json({ message: 'Missing barde name' })

    const created = await prisma.barde.create({
      data: { name },
    })
    res.status(201).json(created)
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// PUT update barde
router.put('/:id', async (req, res) => {
  try {
    const bardeId = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(bardeId)) {
      return res.status(400).json({ message: 'Invalid id parameter' })
    }

    const updated = await prisma.barde.update({
      where: { id: bardeId },
      data: { name: req.body.name },
    })

    res.json(updated)
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Barde not found' })
    }
    res.status(500).json({ status: 'error', message: err.message })
  }
})

// DELETE barde
router.delete('/:id', async (req, res) => {
  try {
    const bardeId = Number.parseInt(req.params.id, 10)
    if (Number.isNaN(bardeId)) {
      return res.status(400).json({ message: 'Invalid id parameter' })
    }

    await prisma.barde.delete({ where: { id: bardeId } })
    res.status(204).send()
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ message: 'Barde not found' })
    }
    res.status(500).json({ status: 'error', message: err.message })
  }
})

module.exports = router
