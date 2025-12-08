import { NextFunction, Request, Response } from "express";
import { registerUser, loginUser } from "./auth.service";
import { catchAsync } from "../../utils/catchAsync";
import { getUserById } from "../user/user.service";
import { verifyAccessToken } from "../../utils/jwt";


// REGISTER
export const registerUserController = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // Call service
    const { user, accessToken, refreshToken } = await registerUser(req.body);

    // Remove password before sending
    const { password, ...userWithoutPassword } = user;

    // Return same shape as login
    res.status(201).json({ user: userWithoutPassword, accessToken, refreshToken });
  }
);

// LOGIN
export const loginUserController = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken, refreshToken } = await loginUser(req.body.email, req.body.password);
  const { password, ...userWithoutPassword } = user;
  res.status(200).json({ user: userWithoutPassword, accessToken, refreshToken });
});

export const getMeController = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: "Unauthorized" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = verifyAccessToken(token);
    const userId = payload.userId; 
    


    
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await getUserById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // exclude sensitive fields
    const { password, ...userSafe } = user;

    res.json({ user: userSafe });
  } catch (err) {
    res.status(401).json({ message: "Token invalid or /auth/me failed", error: err });
  }
};