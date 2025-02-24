import { cartLineItems } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto";
import { CartRepositoryType } from "../respository/cart.repo";
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

  return await repo.createCart(input.customerId, {
    productId: product.id,
    price: product.price,
    qty: input.qty,
    itemName: product.name,
    variant: product.variant,
  } as cartLineItems);
};

export const GetCart = async (id: number, repo: CartRepositoryType) => {
  const data = await repo.findCart(id);

  if (!data) {
    throw new NotFoundError("Cart not found");
  }
  return data;
};

export const EditCart = async (
  input: CartEditRequestInput,
  repo: CartRepositoryType
) => {
  const data = await repo.updateCart(input.id, input.qty);
  return data;
};

export const DeleteCart = async (id: number, repo: CartRepositoryType) => {
  const data = await repo.deleteCart(id);
  return data;
};
