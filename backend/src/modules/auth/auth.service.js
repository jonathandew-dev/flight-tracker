import bcrypt from "bcrypt";
import { prisma } from "../../config/db.js";
import ApiError from "../../utils/ApiError.js";
import { signAccessToken, signRefreshToken } from "../../utils/jwt.js";

export const registerUser = async (data) => {
  const exists = await prisma.user.findUnique({ where: { email: data.email }});
  if (exists) throw new ApiError(400, "Email already in use");

  const hashed = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashed,
      name: data.name || null,
    },
  });

  return user;
};

export const loginUser = async (email, password) => {
  const user = await prisma.user.findUnique({ where: { email }});
  if (!user) throw new ApiError(400, "Invalid credentials");

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new ApiError(400, "Invalid credentials");

  const accessToken = signAccessToken({ userId: user.id });
  const refreshToken = signRefreshToken({ userId: user.id });

  return { user, accessToken, refreshToken };
};
