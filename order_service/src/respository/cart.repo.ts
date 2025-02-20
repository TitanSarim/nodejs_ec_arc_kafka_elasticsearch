import { CartRepositoryType } from "../types/repo.type";

const createCart = async (input: any): Promise<{}> => {
  // connect to db
  // perform db operations
  return Promise.resolve({
    message: "Fake response from cart repository",
    input: input,
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
