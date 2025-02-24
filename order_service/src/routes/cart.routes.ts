import express, { Request, Response, NextFunction } from "express";
import * as service from "../service/cart.service";
import * as repository from "../respository/cart.repo";
import { validateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.dto";
const router = express.Router();
const repo = repository.CartRepository;

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isValidUser = true;
  if (!isValidUser) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};

router.post(
  "/cart",
  authMiddleware,
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
  // comes from auth middleware
  const response = await service.GetCart(req.body.customerId, repo);
  return res.status(200).json(response);
});

router.patch(
  "/cart/:lineItemId",
  async (req: Request, res: Response, next: NextFunction) => {
    const lineItemId = req.params.lineItemId;
    const response = await service.EditCart(
      { id: +lineItemId, qty: req.body.qty },
      repo
    );
    return res.status(200).json(response);
  }
);

router.delete(
  "/cart/:lineItemId",
  async (req: Request, res: Response, next: NextFunction) => {
    const lineItemId = req.params.lineItemId;
    const response = await service.DeleteCart(+lineItemId, repo);
    return res.status(200).json(response);
  }
);

export default router;
