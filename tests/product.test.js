const request = require("supertest");
const app = require("../app");

describe("TESTING PRODUCTS API", () => {
  it("/GET all products", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("/GET a single product", async () => {
    const res = await request(app).get("/products/645d086f7e986fa82ef89932");
    expect(res.statusCode).toBe(200);
    expect(res.body).not.toStrictEqual({});
    expect(res.body).toHaveProperty("title");
  });

  it("/GET products in a category", async () => {
    const res = await request(app).get("/products/category/text cat");
    expect(res.status).toBe(200);
    expect(res.body).not.toStrictEqual([]);
  });

  it("/GET products in a limit and sort", async () => {
    const response = await request(app).get("/products?limit=3&sort=desc");
    expect(response.status).toBe(200);
    expect(response.body).not.toStrictEqual([]);
    expect(response.body).toHaveLength(3);
  });

  it("/POST a product", async () => {
    const response = await request(app).post("/products").send({
      title: "test",
      price: 13.5,
      description: "test desc",
      image: "test img",
      category: "text cat",
    });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe("test");
  });

  it("/DELETE a product", async () => {
    const response = await request(app).delete(
      "/products/645d1e83e2c34f755625eb1f"
    );
    expect(response.statusCode).toBe(200);
  });
});
