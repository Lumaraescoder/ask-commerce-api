const request = require('supertest');
const app = require('./app');

describe('Test the root path', () => {
  
  test('It should return 200', () => {
    return request(app).get('/').then(response => {
      expect(response.statusCode).toBe(200);
    });
  });

  it("should set the CORS headers correctly", async () => {
    const response = await request(app)
      .get("/")
      .expect(200);
    expect(response.headers["access-control-allow-methods"]).toBe("GET, PUT, POST, DELETE");
  });

});