import axios from "axios";
import { APIError } from "../error";
import { logger } from "../logger";
import { Product } from "../../dto/productdto";

const CATELOG_BASE_URL =
  process.env.CATALOG_BASE_URL || "http://localhost:8100";

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
