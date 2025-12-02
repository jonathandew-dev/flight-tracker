// src/modules/user/userValidators.ts
import { z } from 'zod'
import { Request, Response, NextFunction } from 'express'

// ---- Schemas ----

// For creating a user
export const createUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  }),
})

// For updating a user
export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).optional(),
  }),
})

// For login
export const loginUserSchema = z.object({
  body: z.object({
    email: z.string().email({ message: 'Invalid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  }),
})

// For params that include an ID (like /users/:id)
export const userIdParamsSchema = z.object({
  params: z.object({
    id: z.string().min(1, { message: 'User ID is required' }),
  }),
})

// ---- Middleware ----

export const validate =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      })
      next()
    } catch (err: any) {
      res.status(400).json({ error: err.errors })
    }
  }
