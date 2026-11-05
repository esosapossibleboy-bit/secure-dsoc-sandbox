// auth-audit-service/src/tests/auth.test.js
const request = require('supertest');
const express = require('express');
const authRouter = require('../routes/auth');
const User = require('../models/User');

jest.mock('../models/User');

describe('🎛️ Distributed SOC: Microservice A Audited Auth Ingestion Tests', () => {
    let app;

    beforeAll(() => {
        process.env.NODE_ENV = 'test';
        app = express();
        app.use(express.json());
        app.use('/api/auth', authRouter);
    });

    it('should catch invalid credential sets, deny entry, and log a failed event parameters payload', async () => {
        User.findOne.mockResolvedValue(null); // Simulate a non-existent profile lookup search

        const response = await request(app)
            .post('/api/auth/login')
            .send({ username: 'intruder_raccoon', password: 'wrongPassword123' });

        expect(response.status).toBe(401);
        expect(response.body.error).toContain('Counterfeit credentials profile trace');
    });
});
