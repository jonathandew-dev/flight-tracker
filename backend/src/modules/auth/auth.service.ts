import bcrypt from "bcrypt";
import {prisma} from "../../config/db";
import ApiError from "../../utils/ApiError";
import { signAccessToken, signRefreshToken } from "../../utils/jwt";

const SALT_ROUNDS = 10;

interface RegisterData {
  name?: string;
  email: string;
  password: string;
}

export const registerUser = async (data: RegisterData) => {
  const exists = await prisma.user.findUnique({ where: { email: data.email } });
  if (exists) throw new ApiError(400, "Email already in use");

  const hashed = await bcrypt.hash(data.password, SALT_ROUNDS);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name || null,
    },
  });

  return user;
};

// Login user
export const loginUser = async (email: string, password: string) => {
  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(401, "Invalid credentials");

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  return { user, accessToken, refreshToken };
};