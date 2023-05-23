const request = require('supertest');
const app = require('../app');
const User = require('../models/user');
const user = require('../controllers/user');

describe('Test users api', () => {
  it('/GET ALL USERS', async () => {
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
