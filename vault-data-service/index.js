// vault-data-service/index.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3060; // 🚨 PORT SHIFT: Moved to 3060 to prevent EADDRINUSE conflicts!
const JWT_SECRET = process.env.JWT_SECRET || 'dsoc_master_crypto_signing_secret_key_888!';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Mount localized verification guard and data routes right here for absolute stability
app.get('/api/vault/payloads', (req, res) => {
    const token = req.cookies?.auth_token;
    if (!token) return res.status(401).json({ error: "Vault Rejection: Missing cross-service token." });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        res.status(200).json({
            message: "🔓 DECENTRALIZED CROSS-SERVICE CLEARANCE GRANTED!",
            confidentialPayloadStream: "SECURE_DECENTRALIZED_DATA_STREAM: [ALPHA-LOGS-REDACTED-2026]",
            authorizedUserHandle: verified.username || 'Authenticated Operative'
        });
    } catch (err) {
        res.status(403).json({ error: "Vault Breached: Counterfeit signature parameters." });
    }
});

app.listen(PORT, () => console.log(`🚀 Vault service node standing by on port ${PORT}`));
