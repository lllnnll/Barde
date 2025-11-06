const express = require('express');
const router = express.Router();
const db = require('../db')

// GET all users
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users')
        res.json(result.rows)
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
})

// GET user by id
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM users WHERE users.id LIKE ' + req.params.id)
        res.json
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message })
    }
})

// POST create new user
router.post('/', (req, res) => {
    const newUser = {
        id: Users.length + 1,
        name: req.body.name,
        email: req.body.email,
    };
    Users.push(newUser);
    res.status(201).json(newUser);
})

// PUT update user
router.put('/:id', (req, res) => {
    const user = Users.find(user => user.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }
    if (req.body.name) user.name = req.body.name;
    if (req.body.email) user.email = req.body.email;
    res.json(user);
})

// DELETE user
router.delete('/:id', (req, res) => {
    const userIndex = Users.findIndex(user => user.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }
    const deletedUser = Users.splice(userIndex, 1);
    res.json(deletedUser[0]);
})

module.exports = router;