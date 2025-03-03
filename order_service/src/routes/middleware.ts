import { NextFunction, Request, Response } from "express";
import { ValidateUser } from "../utils/broker";

export const RequestAuthorizer = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      return res
        .status(401)
        .json({ message: "Unauthorized due to headers not present" });
    }

    const userData = await ValidateUser(req.headers.authorization as string);
    if (!userData) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    req.user = userData;
    next();
  } catch (error) {
    return res.status(403).json({ error });
  }
};
