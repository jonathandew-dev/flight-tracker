// src/modules/auth/auth.service.ts
import bcrypt from "bcrypt";
import { prisma } from "../../config/db.js";
import ApiError from "../../utils/ApiError.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";

const SALT_ROUNDS = 10;

// --------------------
// Types
// --------------------
interface RegisterData {
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
}

// --------------------
// Register User
// --------------------
export const registerUser = async (data: RegisterData) => {
  // Check if user exists
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new ApiError(400, "Email already in use");

  // Hash password
  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

  // Create user
 const user = await prisma.user.create({
  data: {
    email: data.email,
    password: hashed,
    firstName: data.firstName ?? null,
    lastName: data.lastName ?? null,
  },
});

  // Generate tokens
  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  return { user, accessToken, refreshToken };
};

// --------------------
// Login User
// --------------------
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) throw new ApiError(400, "Email and password are required");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  return { user, accessToken, refreshToken };
};
