import { Request, Response, NextFunction } from 'express'

import ApiError from '../utils/ApiError'
import { verifyAccessToken } from '../utils/jwt' 

declare global {
  namespace Express {
    interface Request {
      userId?: string
    }
  }
}


// Auth middleware
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new ApiError(401, 'No token provided'))
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = verifyAccessToken(token) // <- centralized verification
    req.userId = decoded.userId
    next()
  } catch (err) {
    return next(new ApiError(401, 'Invalid token'))
  }
}