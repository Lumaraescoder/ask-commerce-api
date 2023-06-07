const request = require("supertest");
const app = require("../app");

describe("TESTING CART API", () => {
    it("/GET all carts", async() => {
        const res = await request(app).get("/cart");
        expect(res.statusCode).toBe(200);
        expect(res.body.length).toBeGreaterThan(0);
    });

    // it("/GET a single cart", async() => {
    //     const res = await request(app).get("/cart/carts/646e2f7284e77dfd4dbf1359");
    //     expect(res.statusCode).toBe(200);
    //     expect(res.body).not.toStrictEqual({});
    //     expect(res.body).toHaveProperty("products");
    // });

    // it("/GET a cart by userId", async() => {
    //     const res = await request(app).get("/cart/carts/user/646e2f7284e77dfd4dbf1359");
    //     expect(res.statusCode).toBe(200);
    //     expect(res.body).not.toStrictEqual({});
    //     expect(res.body).toHaveProperty("userId");
    // });

    // it("/DELETE a cart", async() => {
    //     const response = await request(app).delete(
    //         "/cart/carts/646cc1b2da5592b1b472e860"
    //     );
    //     expect(response.statusCode).toBe(200);
    // });

    // it("/POST addCart", async() => {
    //     const response = await request(app).post("/cart/carts").send({
    //         // "id": "0",
    //         "userId": "test",
    //         "date": "2023-05-22",
    //         "products": [{
    //             "productId": "6464b82b6ed6a67f6787fdfd",
    //             "quantity": 1
    //         }]
    //     });
    //     expect(response.status).toBe(200);
    //     expect(response.body.userId).toBe("test");
    // });

});