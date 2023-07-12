const request = require("supertest");
const app = require("../app");

describe("TESTING PRODUCTS API", () => {
  let createdProductId;

  it("/GET all products", async () => {
    const res = await request(app).get("/products");
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
  it("/GET a single product", async () => {
    const productId = "64a44421abca05501196ad95";
    const res = await request(app).get(`/products/${productId}`);
    if (res.body && res.body.hasOwnProperty("title")) {
      expect(res.statusCode).toBe(200);
      expect(res.body).not.toStrictEqual({});
      expect(res.body).toHaveProperty("title");
    } else {
      expect(res.statusCode).toBe(404);
    }
  });
  it("/GET products in a category", async () => {
    const res = await request(app).get("/products/category/Books");
    expect(res.status).toBe(200);
    if (res.status === 200) {
      expect(res.body.length).toBeGreaterThan(0);
    }
  });
  it("/GET products in a limit and sort", async () => {
    const response = await request(app).get("/products?limit=3&sort=desc");
    expect(response.status).toBe(200);
    expect(response.body).not.toEqual([]);
    expect(response.body.length).toBeLessThanOrEqual(3);
  });

  // it("/POST add a new product with image", async () => {
  //   const token =
  //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NmYzNmEyOTYzODM2ZmQ0MDY3MzQwMyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4ODU2ODk2NSwiZXhwIjoxNjg4NTcyNTY1fQ.aZNeRfPYvphVDrHaIEPlaq23bAiDFEQAOR2aB5uX7RI";

  //   const productData = {
  //     title: "Test Product",
  //     price: 9.99,
  //     description: "This is a test product.",
  //     category: "Books",
  //     image: {
  //       data: "base64-encoded-data", // Substitua com os dados binários codificados em base64 da imagem
  //       contentType: "image/jpeg", // Substitua com o tipo de conteúdo correto da imagem
  //     },
  //   };

  //   const res = await request(app)
  //     .post("/products")
  //     .set("Authorization", `Bearer ${token}`)
  //     .send(productData);

  //   expect(res.statusCode).toEqual(200);
  //   expect(res.body).toEqual({ status: "success", message: "Product added!" });
  // });

  it("/POST return 400 if not all required fields are provided", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NmYzNmEyOTYzODM2ZmQ0MDY3MzQwMyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4ODU2ODk2NSwiZXhwIjoxNjg4NTcyNTY1fQ.aZNeRfPYvphVDrHaIEPlaq23bAiDFEQAOR2aB5uX7RI";

    const productData = {
      title: "Test Product",
      price: 9.99,
      description: "This is a test product.",
    };

    const res = await request(app)
      .post("/products")
      .set("Authorization", `Bearer ${token}`)
      .send(productData);

    expect(res.statusCode).toEqual(400);
    expect(res.body).toEqual({
      status: "error",
      message: "Provide all required fields.",
    });
  });

  it("/PUT update a product", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NmYzNmEyOTYzODM2ZmQ0MDY3MzQwMyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4ODU2ODk2NSwiZXhwIjoxNjg4NTcyNTY1fQ.aZNeRfPYvphVDrHaIEPlaq23bAiDFEQAOR2aB5uX7RI";

    const productId = "64a44421abca05501196ad95";

    const updatedProductData = {
      title: "Updated Product",
      price: 19.99,
      description: "This is an updated product.",
      category: "Updated Category",
    };

    const res = await request(app)
      .patch(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`)
      .send(updatedProductData);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      status: "success",
      message: "Product updated!",
    });
  });

  it("/DELETE a product", async () => {
    const productId = "64a44421abca05501196ad95";
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0NmYzNmEyOTYzODM2ZmQ0MDY3MzQwMyIsImlzQWRtaW4iOnRydWUsImlhdCI6MTY4ODU2ODk2NSwiZXhwIjoxNjg4NTcyNTY1fQ.aZNeRfPYvphVDrHaIEPlaq23bAiDFEQAOR2aB5uX7RI";

    const res = await request(app)
      .delete(`/products/${productId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ message: "Product deleted!" });

    const deletedProduct = await request(app).get(`/products/${productId}`);
    expect(deletedProduct.statusCode).toBe(404);
  });
});
