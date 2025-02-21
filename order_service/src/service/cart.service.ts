import { CartRequestInput } from "../dto/cartRequest.dto";
import { CartRepositoryType } from "../types/repo.type";
import { logger, NotFoundError } from "../utils";
import { getProductDetails } from "../utils/broker";

export const CreateCart = async (
  input: CartRequestInput,
  repo: CartRepositoryType
) => {
  // make a call to our cataglog microservice
  // synchronise call
  const product = await getProductDetails(input.productId);
  logger.info(product);
  if (product.stock < input.qty) {
    throw new NotFoundError("Product out of stock");
  }

  // const data = await repo.create(input);
  return product;
};

export const GetCart = async (input: any, repo: CartRepositoryType) => {
  const data = await repo.find(input);
  return data;
};

export const EditCart = async (input: any, repo: CartRepositoryType) => {
  const data = await repo.update(input);
  return data;
};

export const DeleteCart = async (input: any, repo: CartRepositoryType) => {
  const data = await repo.delete(input);
  return data;
};
