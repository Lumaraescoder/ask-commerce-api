const request = require("supertest");
const app = require("../app");

describe("TESTING CART API", () => {
    it("/GET all carts", async() => {
        const res = await request(app).get("/cart");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

});