const request = require('supertest');
const app = require('./app');

describe('Test the root path', () => {
  test('It should return 200', () => {
    return request(app).get('/').then(response => {
      expect(response.statusCode).toBe(200);
    });
  });
});