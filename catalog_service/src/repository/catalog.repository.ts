import { PrismaClient } from "@prisma/client";
import { ICatalogRepository } from "../interface/catalogRepository";
import { Product } from "../models/product.model";

export class CatalogRepository implements ICatalogRepository {
  _primsa: PrismaClient;

  constructor() {
    this._primsa = new PrismaClient();
  }

  async create(data: any): Promise<Product> {
    return this._primsa.product.create({ data });
  }
  async update(data: any): Promise<Product> {
    return this._primsa.product.update({ where: { id: data.id }, data });
  }
  async delete(id: any): Promise<number> {
    const data = await this._primsa.product.delete({ where: { id: id } });
    return Promise.resolve(data.id);
  }
  async find(limit: number, offset: number): Promise<Product[]> {
    return this._primsa.product.findMany({
      take: limit,
      skip: offset,
      orderBy: { id: "asc" },
    });
  }
  async findOne(id: number): Promise<Product> {
    const data = await this._primsa.product.findFirst({ where: { id: id } });
    if (!data) {
      throw new Error(`Product not found`);
    }
    return Promise.resolve(data);
  }
}
