const express = require('express');
const router = express.Router();
const { prisma } = require('../../prismaClient');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { validateRegister, validateLogin } = require('../../middleware/validation');

// POST /api/auth/register
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { user_email: email }
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        user_username: name,
        user_email: email,
        user_password: hashedPassword
      }
    });

    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET || 'secret_key'
    );

    res.status(201).json({
      token,
      user: {
        id: user.user_id,
        name: user.user_username,
        email: user.user_email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// POST /api/auth/login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { user_email: email }
    });

    if (!user || !(await bcrypt.compare(password, user.user_password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { userId: user.user_id },
      process.env.JWT_SECRET || 'secret_key'
    );

    res.json({
      token,
      user: {
        id: user.user_id,
        name: user.user_username,
        email: user.user_email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;