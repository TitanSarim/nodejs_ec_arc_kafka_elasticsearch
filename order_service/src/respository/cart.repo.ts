import { DB } from "../db/db.connection";
import { Cart, cartLineItems, carts } from "../db/schema";
import { CartWithLineItems } from "../dto/cartRequest.dto";
import { NotFoundError } from "../utils";
import { eq } from "drizzle-orm";
//  declare repo types

export type CartRepositoryType = {
  createCart: (customerId: number, lineItem: cartLineItems) => Promise<number>;
  findCart: (id: number) => Promise<CartWithLineItems>;
  updateCart: (id: number, qty: number) => Promise<cartLineItems>;
  deleteCart: (id: number) => Promise<Boolean>;
  clearCartData: (id: number) => Promise<Boolean>;
  findCartByProductId: (
    customerId: number,
    productId: number
  ) => Promise<cartLineItems>;
};

const createCart = async (
  customerId: number,
  { itemName, price, productId, qty, variant }: cartLineItems
): Promise<number> => {
  const result = await DB.insert(carts)
    .values({ customerId: customerId })
    .returning()
    .onConflictDoUpdate({
      target: carts.customerId,
      set: { updatedAt: new Date() },
    });

  const [{ id }] = result;

  if (id > 0) {
    await DB.insert(cartLineItems).values({
      cartId: id,
      itemName,
      price,
      productId,
      qty,
      variant,
    });
  }
  return id;
};

const findCart = async (id: number): Promise<CartWithLineItems> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.customerId, id),
    with: { lineItems: true },
  });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }
  return cart;
};

const updateCart = async (id: number, qty: number): Promise<cartLineItems> => {
  const [cartLineItem] = await DB.update(cartLineItems)
    .set({ qty: qty })
    .where(eq(cartLineItems.id, id))
    .returning();

  return cartLineItem;
};

const deleteCart = async (id: number): Promise<boolean> => {
  await DB.delete(cartLineItems).where(eq(cartLineItems.id, id)).returning();

  return true;
};

const clearCartData = async (id: number): Promise<boolean> => {
  await DB.delete(carts).where(eq(carts.id, id)).returning();
  return true;
};

const findCartByProductId = async (
  customerId: number,
  productId: number
): Promise<cartLineItems> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.customerId, customerId),
    with: { lineItems: true },
  });

  const lineItem = cart?.lineItems.find((item) => item.productId === productId);

  return lineItem as cartLineItems;
};

export const CartRepository: CartRepositoryType = {
  createCart,
  findCart,
  updateCart,
  deleteCart,
  clearCartData,
  findCartByProductId,
};
