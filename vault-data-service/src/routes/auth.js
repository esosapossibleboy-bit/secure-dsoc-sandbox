// auth-audit-service/src/routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');

const JWT_SECRET = process.env.JWT_SECRET || 'dsoc_master_crypto_signing_secret_key_888!';

router.use(express.json());

// 📤 ACCOUNT REGISTRATION
router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username: username?.toLowerCase() });
        if (existingUser) return res.status(400).json({ error: "Permit handle already claimed." });

        const newUser = new User({ username, password });
        await newUser.save();
        res.status(201).json({ message: "🔒 Operational profile account secured and activated!" });
    } catch (err) {
        res.status(400).json({ error: "Registration Rejected", details: err.message });
    }
});

// 🔑 AUDITED LOGIN OVERSEE LOOP (Triggers automated logs on success or fail!)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const clientIp = req.ip || req.headers['x-forwarded-for'] || '127.0.0.1';

    try {
        const user = await User.findOne({ username: username?.toLowerCase() });
        
        // 🚨 FAILURE BLOCK: Credentials mismatch. Write an intrusion event audit immediately!
        if (!user || !(await user.comparePassword(password))) {
            const breachLog = new AuditLog({
                attemptedUsername: username || 'anonymous_attacker',
                ipAddress: clientIp,
                eventStatus: 'FAILED_BRUTE_FORCE_ATTEMPT',
                failureReason: 'Invalid passphrase matrix mismatch or non-existent profile handle lookup.',
                severityLevel: 'HIGH'
            });
            // Avoid failing requests if database is unlinked during quick testing sweeps
            if (process.env.NODE_ENV !== 'test') await breachLog.save();

            return res.status(401).json({ error: "Access Intercepted: Counterfeit credentials profile trace." });
        }

        // 🟢 SUCCESS BLOCK: Create a success token and write a safe audit log entry
        const successLog = new AuditLog({
            attemptedUsername: user.username,
            ipAddress: clientIp,
            eventStatus: 'SUCCESS',
            severityLevel: 'LOW'
        });
        if (process.env.NODE_ENV !== 'test') await successLog.save();

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('auth_token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 3600000
        });

        res.status(200).json({ message: "🔓 Access clearance verified. Session cookie dispatched." });
    } catch (err) {
        res.status(500).json({ error: "Internal Auth Node Failure", details: err.message });
    }
});

module.exports = router;
