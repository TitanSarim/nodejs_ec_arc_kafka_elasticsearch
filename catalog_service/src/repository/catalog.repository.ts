import { ICatalogRepository } from "../interface/catalogRepository";
import { Product } from "../models/product.model";
import { ProductFactory } from "../utils/fixtures";

export class CatalogRepository implements ICatalogRepository {
  async create(data: any): Promise<Product> {
    const product = ProductFactory.build();
    return Promise.resolve(product);
  }
  async update(data: any): Promise<Product> {
    const product = ProductFactory.build();
    return Promise.resolve(product);
  }
  async delete(id: any): Promise<number> {
    const product = ProductFactory.build();
    return Promise.resolve(id);
  }
  async find(limit: number, offset: number): Promise<Product[]> {
    const products = ProductFactory.buildList(limit);
    return Promise.resolve(products);
  }
  findOne(id: number): Promise<Product> {
    const product = ProductFactory.build();
    return Promise.resolve(product);
  }
}
