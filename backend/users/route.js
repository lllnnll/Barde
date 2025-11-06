const express = require('express');
const router = express.Router();
const { User } = require('../models/User')

// GET all users
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll()
        res.json(users)
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
})

// GET user by id
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        if (!user) return res.status(404).json({ message: 'User not found' })
        res.json(user)
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
})

// POST create new user
router.post('/', async (req, res) => {
    try {
        const created = await User.create({ user_username: req.body.user_username, user_email: req.body.user_email })
        res.status(201).json(created)
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
})

// PUT update user
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id)
        if (!user) return res.status(404).json({ message: 'User not found' })
        user.user_username = req.body.user_username ?? user.user_username
        user.user_email = req.body.user_email ?? user.user_email
        await user.save()
        res.json(user)
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
})

// DELETE user
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await User.destroy({ where: { user_id: req.params.id } })
        if (!deleted) return res.status(404).json({ message: 'User not found' })
        res.status(204).send()
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
})

module.exports = router;