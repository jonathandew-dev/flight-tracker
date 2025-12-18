import { Request, Response, NextFunction } from 'express';
import { ZodObject } from 'zod';
import ApiError from "../utils/ApiError.js";

export const validate =
  (schema: ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err: any) {
      next(new ApiError(400, err.errors?.map((e: any) => e.message).join(', ') || 'Invalid request'));
    }
  };