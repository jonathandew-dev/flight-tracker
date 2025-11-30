import { catchAsync } from "../../utils/catchAsync.js";
import * as authService from "./auth.service.js";
import ApiError from "../../utils/ApiError.js";
import { registerSchema, loginSchema } from "./auth.validators.js";

export const register = catchAsync(async (req, res) => {
  const data = registerSchema.parse(req.body);
  const user = await authService.registerUser(data);
  res.status(201).json({ user });
});

export const login = catchAsync(async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);
  const { user, accessToken, refreshToken } = await authService.loginUser(
    email,
    password
  );

  res.json({
    user,
    accessToken,
    refreshToken,
  });
});
