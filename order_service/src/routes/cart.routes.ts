import express, { Request, Response, NextFunction } from "express";
import * as service from "../service/cart.service";
import * as repository from "../respository/cart.repo";
import { validateRequest } from "../utils/validator";
import { CartRequestInput, CartRequestSchema } from "../dto/cartRequest.dto";
import { RequestAuthorizer } from "./middleware";
const router = express.Router();
const repo = repository.CartRepository;

router.post(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        next(new Error("User not found"));
        return;
      }

      const err = validateRequest<CartRequestInput>(
        req.body,
        CartRequestSchema
      );
      if (err) {
        return res.status(404).json(err);
      }

      const input: CartRequestInput = req.body;

      const response = await service.CreateCart(
        { customerId: user.id, ...input },
        repo
      );
      return res.status(200).json(response);
    } catch (error) {
      return res.status(404).json(error);
    }
  }
);

router.get(
  "/cart",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    // comes from auth middleware
    try {
      const user = req.user;

      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const response = await service.GetCart(user.id, repo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.patch(
  "/cart/:lineItemId",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const lineItemId = req.params.lineItemId;
      const response = await service.EditCart(
        { id: +lineItemId, qty: req.body.qty, customerId: user.id },
        repo
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/cart/:lineItemId",
  RequestAuthorizer,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;

      if (!user) {
        next(new Error("User not found"));
        return;
      }
      const lineItemId = req.params.lineItemId;
      const input = {
        id: +lineItemId,
        customerId: user.id,
      };
      const response = await service.DeleteCart(input, repo);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
