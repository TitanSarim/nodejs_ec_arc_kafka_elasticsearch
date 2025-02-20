import { DB } from "../db/db.connection";
import { carts } from "../db/schema";
import { CartRepositoryType } from "../types/repo.type";

const createCart = async (input: any): Promise<{}> => {
  // connect to db
  const result = await DB.insert(carts)
    .values({
      customerId: 123,
    })
    .returning({ cartId: carts.id });
  // perform db operations
  return Promise.resolve({
    message: "Fake response from cart repository",
    input: result,
  });
};

const getCart = async (input: any): Promise<{}> => {
  return Promise.resolve({});
};

const updateCart = async (input: any): Promise<{}> => {
  return Promise.resolve({});
};

const deleteCart = async (input: any): Promise<{}> => {
  return Promise.resolve({});
};

export const CartRepository: CartRepositoryType = {
  create: createCart,
  find: getCart,
  update: updateCart,
  delete: deleteCart,
};
