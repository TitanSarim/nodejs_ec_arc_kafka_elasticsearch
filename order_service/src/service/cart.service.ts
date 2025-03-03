import { cartLineItems } from "../db/schema";
import { CartEditRequestInput, CartRequestInput } from "../dto/cartRequest.dto";
import { CartRepositoryType } from "../respository/cart.repo";
import { AuthorizeError, logger, NotFoundError } from "../utils";
import { getProductDetails, GetStocksDetails } from "../utils/broker";

export const CreateCart = async (
  input: CartRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  // product details from the catalog service
  const product = await getProductDetails(input.productId);
  logger.info(product);
  if (product.stock < input.qty) {
    throw new NotFoundError("Product out of stock");
  }

  // find if the product is already in the cart
  const lineItem = await repo.findCartByProductId(
    input.customerId,
    input.productId
  );

  if (lineItem) {
    return repo.updateCart(lineItem.id, lineItem.qty + input.qty);
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
  // get customer card data
  const cart = await repo.findCart(id);

  if (!cart) {
    throw new NotFoundError("Cart does not exist");
  }
  // list out  all line items in the cart
  const lineItems = cart.lineItems;
  if (!lineItems.length) {
    throw new NotFoundError("Cart items not found");
  }

  // verify with inventory service if the product is still available
  const stockDetails = await GetStocksDetails(
    lineItems
      ?.map((item) => item?.productId)
      .filter((id): id is number => id !== null) || []
  );

  if (Array.isArray(stockDetails)) {
    lineItems.forEach((lineItem) => {
      const stockItem = stockDetails.find(
        (stock) => stock.id === lineItem.productId
      );

      if (stockItem) {
        lineItem.availability = stockItem.stock;
      }
    });

    // update cart line items
    cart.lineItems = lineItems;
  }

  // return updated cart data with latest stock availability

  return cart;
};

const AuthorizedCart = async (
  lineItemId: number,
  customerId: number,
  repo: CartRepositoryType
) => {
  const cart = await repo.findCart(customerId);
  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
  if (!lineItem) {
    throw new AuthorizeError("You are not authorized to edit this cart");
  }

  return lineItem;
};

export const EditCart = async (
  input: CartEditRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  await AuthorizedCart(input.id, input.customerId, repo);
  const data = await repo.updateCart(input.id, input.qty);
  return data;
};

export const DeleteCart = async (
  input: { id: number; customerId: number },
  repo: CartRepositoryType
) => {
  await AuthorizedCart(input.id, input.customerId, repo);
  const data = await repo.deleteCart(input.id);
  return data;
};
