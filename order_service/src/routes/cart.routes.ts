import express, { Request, Response, NextFunction } from "express";
import * as service from "../service/cart.service";
import * as repository from "../respository/cart.repo";
import { validateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.dto";
const router = express.Router();
const repo = repository.CartRepository;

router.post(
  "/cart",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const err = validateRequest<CartRequestInput>(
        req.body,
        CartRequestSchema
      );
      if (err) {
        return res.status(404).json(err);
      }
      const response = await service.CreateCart(
        req.body as CartRequestInput,
        repo
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json(error);
    }
  }
);

router.get("/cart", async (req: Request, res: Response, next: NextFunction) => {
  const response = await service.GetCart(req.body, repo);
  return res.status(200).json(response);
});

router.patch(
  "/cart",
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await service.EditCart(req.body, repo);
    return res.status(200).json(response);
  }
);

router.delete(
  "/cart/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const response = await service.DeleteCart(req.body, repo);
    return res.status(200).json(response);
  }
);

export default router;
