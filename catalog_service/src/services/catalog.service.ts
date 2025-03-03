import { ICatalogRepository } from "../interface/catalogRepository";

export class CatalogService {
  private _repo: ICatalogRepository;

  constructor(repo: ICatalogRepository) {
    this._repo = repo;
  }
  async createProduct(input: any) {
    const data = await this._repo.create(input);
    if (!data.id) {
      throw new Error("Product creation failed.");
    }
    return data;
  }

  async updateProduct(input: any) {
    const data = await this._repo.update(input);
    // emit event to update record i elastic search

    if (!data) {
      throw new Error("Product update failed.");
    }
    return data;
  }

  // instead of this get product from elasticsearch
  async getProducts(limit: number, offset: number) {
    const products = await this._repo.find(limit, offset);
    return products;
  }

  async getProduct(id: number) {
    const product = await this._repo.findOne(id);
    return product;
  }

  async deleteProduct(id: number): Promise<{ id: number }> {
    const result = await this._repo.delete(id);
    return { id: result };
  }

  async getProductStock(ids: number[]) {
    const products = await this._repo.findStock(ids);
    if (!products) {
      throw new Error("Failed to fetch product stock");
    }
    return products;
  }
}
