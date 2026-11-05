// vault-data-service/src/routes/vault.js
const express = require('express');
const router = express.Router();
const verify = require('../middleware/verify'); // 🛡️ Import our signature gatekeeper guard!

// Attach our verification guard directly to this path axis to secure the data
router.get('/payloads', verify, (req, res) => {
    res.status(200).json({
        message: "🔓 VAULT CLEARANCE GRANTED: Cross-service token signature verified successfully.",
        confidentialPayloadStream: "SECURE_DECENTRALIZED_DATA_STREAM: [ALPHA-LOGS-REDACTED-2026]",
        authorizedUserHandle: req.user.username
    });
});

module.exports = router;
