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

  updateProduct(input: any) {}

  getProducts(limit: number, offset: number) {}

  getProduct(id: number) {}

  deleteProduct(id: number) {}
}
