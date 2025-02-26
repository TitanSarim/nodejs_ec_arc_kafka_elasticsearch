import express, { Request, Response, NextFunction } from "express";
import { MessageBroker } from "../utils/broker";
import { OrderEvent } from "../types";

const router = express.Router();

router.post(
  "/order",
  async (req: Request, res: Response, next: NextFunction) => {
    // order create logic

    // 3rd step publush the message
    await MessageBroker.publish({
      topic: "OrderEvents",
      headers: { token: req.headers.authorization },
      event: OrderEvent.CREATE_ORDER,
      message: {
        orderId: 1,
        items: [
          {
            productid: 1,
            quantity: 1,
          },
          {
            productid: 2,
            quantity: 2,
          },
        ],
      },
    });
    return res.status(200).json({ message: "Create order" });
  }
);

router.get(
  "/order",
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "get order" });
  }
);

router.get(
  "/order/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "get order" });
  }
);

router.delete(
  "/order/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    return res.status(200).json({ message: "delete order" });
  }
);

export default router;
