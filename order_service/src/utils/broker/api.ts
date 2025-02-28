import axios from "axios";
import { APIError, AuthorizeError } from "../error";
import { logger } from "../logger";
import { Product } from "../../dto/productdto";

const CATELOG_BASE_URL =
  process.env.CATALOG_BASE_URL || "http://localhost:8100";

const AUTH_BASE_URL = process.env.AUTH_BASE_URL || "http://localhost:5200";

export const getProductDetails = async (productId: number) => {
  try {
    const response = await axios.get(
      `${CATELOG_BASE_URL}/products/${productId}`
    );
    const product = response.data as Product;
    return product;
  } catch (error) {
    logger.error(error);
    throw new APIError("product not found");
  }
};

export const ValidateUser = async (token: string) => {
  try {
    axios.defaults.headers.common["Authorization"] = token;
    const response = await axios.get(`${AUTH_BASE_URL}/auth/validate`, {
      headers: {
        Authorization: token,
      },
    });

    if (response.status !== 200) {
      throw new AuthorizeError("User not authenticated");
    }

    return response.data;
  } catch (error) {
    logger.error(error);
    throw new APIError("product not found");
  }
};
