import request from "supertest";
import express from "express";
import { faker } from "@faker-js/faker/.";
import catalogRoutes, { catalogService } from "../catalog.routes";
import { ProductFactory } from "../../utils/fixtures";

const app = express();

app.use(express.json());

app.use(catalogRoutes);

const mockRequest = () => {
  return {
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    stock: faker.number.int({ min: 10, max: 100 }),
    price: +faker.commerce.price(),
  };
};

describe("Catalog Routes", () => {
  // create product
  describe("POST /products", () => {
    test("should create a new product", async () => {
      const requestBody = mockRequest();

      const product = ProductFactory.build();
      jest
        .spyOn(catalogService, "createProduct")
        .mockResolvedValueOnce(product);

      const response = await request(app)
        .post("/products")
        .send(requestBody)
        .set("Accept", "application/json");
      console.log("Test Response", response);
      expect(response.status).toBe(201);
      expect(response.body).toEqual(product);
    });

    test("should response with validation error 400", async () => {
      const requestBody = mockRequest();

      const response = await request(app)
        .post("/products")
        .send({ ...requestBody, name: "" })
        .set("Accept", "application/json");
      console.log("Test Response", response);
      expect(response.status).toBe(400);
      expect(response.body).toEqual("name should not be empty");
    });

    test("should response with internal error code 500", async () => {
      const requestBody = mockRequest();

      jest
        .spyOn(catalogService, "createProduct")
        .mockRejectedValueOnce(new Error("Product creation failed."));

      const response = await request(app)
        .post("/products")
        .send(requestBody)
        .set("Accept", "application/json");
      console.log("Test Response", response);
      expect(response.status).toBe(500);
      expect(response.body).toEqual("Product creation failed.");
    });
  });

  // update product
  describe("PATCH /products/:id", () => {
    test("should update a new product", async () => {
      const product = ProductFactory.build();

      const requestBody = {
        name: product.name,
        price: product.price,
        stock: product.stock,
      };

      jest
        .spyOn(catalogService, "updateProduct")
        .mockResolvedValueOnce(product);

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(requestBody)
        .set("Accept", "application/json");
      console.log("Test Response", response);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
    });

    test("should response with validation error 400", async () => {
      const product = ProductFactory.build();

      const requestBody = {
        name: product.name,
        price: -1,
        stock: product.stock,
      };
      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send({ ...requestBody })
        .set("Accept", "application/json");
      console.log("Test Response", response);
      expect(response.status).toBe(400);
      expect(response.body).toEqual("price must not be less than 1");
    });

    test("should response with internal error code 400", async () => {
      const product = ProductFactory.build();

      const requestBody = {
        name: product.name,
        price: product.price,
        stock: product.stock,
      };

      jest
        .spyOn(catalogService, "updateProduct")
        .mockRejectedValueOnce(new Error("Product update failed."));

      const response = await request(app)
        .patch(`/products/${product.id}`)
        .send(requestBody)
        .set("Accept", "application/json");
      console.log("Test Response", response);
      expect(response.status).toBe(500);
      expect(response.body).toEqual("Product update failed.");
    });
  });

  // get products
  describe("GET /products?limit=0&offset=0", () => {
    test("should return a range of products based on limits andoffset", async () => {
      const randomLimit = faker.number.int({ min: 1, max: 80 });
      const products = ProductFactory.buildList(randomLimit);

      jest.spyOn(catalogService, "getProducts").mockResolvedValueOnce(products);

      const response = await request(app)
        .get(`/products?limit=${randomLimit}&offset=0`)
        .set("Accept", "application/json");
      console.log("Test Response", response);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(products);
    });

    // 2️⃣ Missing or Invalid limit and offset (400 Bad Request)
    test("should respond with 400 if limit or offset is invalid", async () => {
      const response = await request(app)
        .get(`/products?limit=-5&offset=abc`) // Invalid values
        .set("Accept", "application/json");

      console.log("Test Response", response.body);
      expect(response.status).toBe(400);
      expect(response.body).toEqual("Invalid limit or offset");
    });

    // 3️⃣ No Products Available (200 OK but Empty List)
    test("should return 200 with an empty array if no products exist", async () => {
      jest.spyOn(catalogService, "getProducts").mockResolvedValueOnce([]);

      const response = await request(app)
        .get(`/products?limit=10&offset=0`)
        .set("Accept", "application/json");

      console.log("Test Response", response.body);
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  // get product
  describe("GET /products/:id", () => {
    test("should return a product by id", async () => {
      const product = ProductFactory.build();

      jest.spyOn(catalogService, "getProduct").mockResolvedValueOnce(product);

      const response = await request(app)
        .get(`/products/${product.id}`)
        .set("Accept", "application/json");
      console.log("Test Response", response);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(product);
    });
  });

  // get product
  describe("DELETE /products/:id", () => {
    test("should delete a product by id", async () => {
      const product = ProductFactory.build();

      jest
        .spyOn(catalogService, "deleteProduct")
        .mockResolvedValueOnce({ id: product.id || 0 });

      const response = await request(app)
        .delete(`/products/${product.id}`)
        .set("Accept", "application/json");
      console.log("Test Response", response);
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ id: product.id });
    });
  });
});
