import { Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";


// REGISTER
export const registerUserController = catchAsync(async (req: Request, res: Response) => {
  const user = await registerUser(req.body);
  const { password, ...userWithoutPassword } = user;
  res.status(201).json({ user: userWithoutPassword });
});

// LOGIN
export const loginUserController = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body.email, req.body.password);
  const { password, ...userWithoutPassword } = user;
  res.status(200).json({ user: userWithoutPassword, accessToken, refreshToken });
});