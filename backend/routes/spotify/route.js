const express = require('express');
const router = express.Router();
const axios = require('axios');
const { prisma } = require('../../prismaClient');
const jwt = require('jsonwebtoken');

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const SPOTIFY_REDIRECT_URI = process.env.SPOTIFY_REDIRECT_URI;
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key';

// Middleware to verify JWT and attach user info (optional for login)
const authenticateOptional = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        req.userId = null;
        return next();
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        req.userId = null;
        next();
    }
};

const authenticateRequired = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

// GET /api/spotify/login
router.get('/login', authenticateOptional, (req, res) => {
    const scope = 'user-read-private user-read-email user-library-read playlist-read-private';
    const state = req.userId ? req.userId.toString() : 'login';

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: SPOTIFY_CLIENT_ID,
        scope: scope,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        state: state
    });

    res.json({ url: `https://accounts.spotify.com/authorize?${params.toString()}` });
});

// GET /api/spotify/callback
router.get('/callback', async (req, res) => {
    const { code, state, error } = req.query;

    if (error) {
        return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=spotify_access_denied`);
    }

    if (!code) {
        return res.status(400).send('No code provided');
    }

    try {
        const authHeader = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64');

        // Exchange code for access token
        const tokenResponse = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            data: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: SPOTIFY_REDIRECT_URI
            }).toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authHeader}`
            }
        });

        const { access_token, refresh_token, expires_in } = tokenResponse.data;
        const expiry = new Date();
        expiry.setSeconds(expiry.getSeconds() + expires_in);

        // Get user profile to get spotify_id and email
        const userResponse = await axios.get('https://api.spotify.com/v1/me', {
            headers: { Authorization: `Bearer ${access_token}` }
        });

        const spotifyData = userResponse.data;
        const spotifyId = spotifyData.id;
        const spotifyEmail = spotifyData.email;

        let targetUserId;

        if (state && state !== 'login') {
            // LINKING FLOW: User was already logged in to Barde
            targetUserId = parseInt(state);
            await prisma.user.update({
                where: { user_id: targetUserId },
                data: {
                    spotify_id: spotifyId,
                    spotify_access_token: access_token,
                    spotify_refresh_token: refresh_token,
                    spotify_token_expiry: expiry
                }
            });
            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?spotify=connected`);
        } else {
            // LOGIN/REGISTER FLOW
            let user = await prisma.user.findUnique({
                where: { user_email: spotifyEmail }
            });

            if (!user) {
                // REGISTER: Create new user
                user = await prisma.user.create({
                    data: {
                        user_username: spotifyData.display_name || spotifyId,
                        user_email: spotifyEmail,
                        user_password: '', // No password for social logins
                        spotify_id: spotifyId,
                        spotify_access_token: access_token,
                        spotify_refresh_token: refresh_token,
                        spotify_token_expiry: expiry
                    }
                });
            } else {
                // LOGIN: Update tokens
                user = await prisma.user.update({
                    where: { user_id: user.user_id },
                    data: {
                        spotify_id: spotifyId,
                        spotify_access_token: access_token,
                        spotify_refresh_token: refresh_token,
                        spotify_token_expiry: expiry
                    }
                });
            }

            // Generate Barde JWT
            const token = jwt.sign(
                { userId: user.user_id },
                JWT_SECRET
            );

            return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?token=${token}`);
        }
    } catch (err) {
        console.error('Spotify callback error:', err.response?.data || err.message);
        res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=spotify_connection_failed`);
    }
});

// GET /api/spotify/status
router.get('/status', authenticateRequired, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { user_id: req.userId },
            select: { spotify_id: true }
        });

        res.json({ connected: !!user?.spotify_id, spotifyId: user?.spotify_id });
    } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
