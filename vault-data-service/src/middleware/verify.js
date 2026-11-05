// vault-data-service/src/middleware/verify.js
const jwt = require('jsonwebtoken');

// 🔌 SHARED SECRET SEED: Must match Microservice A's signing key exactly to confirm signature tokens!
const JWT_SECRET = process.env.JWT_SECRET || 'dsoc_master_crypto_signing_secret_key_888!';

module.exports = function(req, res, next) {
    // Extract the secure auth token from the incoming cross-service browser cookie envelope
    const token = req.cookies?.auth_token;

    if (!token) {
        return res.status(401).json({ 
            error: "Vault Rejection: Missing cross-service authorization token block. Access Denied." 
        });
    }

    try {
        // 🔬 Run cryptographic validation against the shared token secret anchor
        const verifiedPayload = jwt.verify(token, JWT_SECRET);
        
        // Forward the decrypted identity data frame to downstream vault routes
        req.user = verifiedPayload;
        next();
    } catch (err) {
        return res.status(403).json({ 
            error: "Vault Breached: Counterfeit or expired session signature tracking parameter.",
            details: err.message 
        });
    }
};
