import { Factory } from "rosie";
import { Product } from "../../models/product.model";
import { faker } from "@faker-js/faker";

export const ProductFactory = new Factory<Product>()
  .attr("id", faker.number.int({ min: 1, max: 10000 }))
  .attr("name", faker.commerce.productName())
  .attr("description", faker.commerce.productDescription())
  .attr("price", +faker.commerce.price())
  .attr("stock", faker.number.int({ min: 10, max: 100 }));
