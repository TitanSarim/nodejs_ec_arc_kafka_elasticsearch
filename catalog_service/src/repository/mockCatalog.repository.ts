import { ICatalogRepository } from "../interface/catalogRepository";
import { Product } from "../models/product.model";

export class MockCatalogRepository implements ICatalogRepository {
  create(data: any): Promise<Product> {
    const mockProduct = {
      id: 1,
      ...data,
    } as Product;
    return Promise.resolve(mockProduct);
  }
  update(data: any): Promise<Product> {
    throw new Error("Method not implemented.");
  }
  delete(id: any): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  find(): Promise<Product[]> {
    throw new Error("Method not implemented.");
  }
  findOne(id: number): Promise<Product> {
    throw new Error("Method not implemented.");
  }
}
