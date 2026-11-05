// auth-audit-service/index.js
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');

// 🔐 Grab our verified audited authentication routing desk module!
const authRouter = require('./src/routes/auth');

const app = express();
const PORT = process.env.PORT || 3040;

app.use(cors({ 
    origin: 'http://localhost:5173', 
    credentials: true 
}));

app.use(express.json());
app.use(cookieParser());

// Mount our audited auth paths safely
app.use('/api/auth', authRouter);

app.get('/api/health', (req, res) => {
    res.status(200).json({ service: "Auth Audit Microservice Node", status: "green" });
});

app.listen(PORT, () => {
    console.log(`\n🔐 ==================================================`);
    console.log(`🚀 AUTH-AUDIT SERVICE NODE RUNNING ON PORT ${PORT}!`);
    console.log(`🔐 ==================================================`);
});
