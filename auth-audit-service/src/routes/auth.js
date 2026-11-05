// auth-audit-service/src/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dsoc_master_crypto_signing_secret_key_888!';

// Mock User Database Map cache for robust multi-service environment testing loops
const runtimeUserInMemoryCache = new Map();

router.use(express.json());

// 📤 ACCOUNT REGISTRATION ENTRY DESK
router.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password || !username.trim() || !password.trim()) {
        return res.status(400).json({ error: "Missing required credential matrix parameters." });
    }

    const normalizedName = username.trim().toLowerCase();
    if (runtimeUserInMemoryCache.has(normalizedName)) {
        return res.status(400).json({ error: "Permit handle already claimed by another operative." });
    }

    // Save user info inside our secure session map cache layout block
    runtimeUserInMemoryCache.set(normalizedName, { password: password.trim() });
    res.status(201).json({ message: "🔒 Operational account profile secured and activated!" });
});

// 🔑 AUDITED SESSION LOGIN DOOR
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: "Missing required identity checkpoints." });
    }

    const normalizedName = username.trim().toLowerCase();
    const cachedUser = runtimeUserInMemoryCache.get(normalizedName);

    if (!cachedUser || cachedUser.password !== password.trim()) {
        console.log(`🚨 SECURITY ALERT: Failed login try intercepted for user [ ${username} ]`);
        return res.status(401).json({ error: "Access Intercepted: Counterfeit credentials profile trace." });
    }

    // Sign the cross-service authorization session stamp
    const token = jwt.sign(
        { username: normalizedName },
        JWT_SECRET,
        { expiresIn: '1h' }
    );

    // Inject token straight into an HTTP-Only browser cookie envelope container!
    res.cookie('auth_token', token, {
        httpOnly: true,
        secure: false, // Set to true if running over HTTPS production wires
        sameSite: 'lax',
        maxAge: 3600000 // 1 hour expiration window
    });

    res.status(200).json({ 
        message: "Aaccess clearance verified. Session cookie dispatched.",
        user: { username: normalizedName }
    });
});

module.exports = router;
