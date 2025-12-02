import jwt from "jsonwebtoken";
import type { SignOptions, Secret } from "jsonwebtoken";

type StringValue = `${number}${"s" | "m" | "h" | "d" | "y"}`;

const ACCESS_SECRET: Secret = process.env.JWT_ACCESS_SECRET || "default_access_secret";
const REFRESH_SECRET: Secret = process.env.JWT_REFRESH_SECRET || "default_refresh_secret";

interface JwtPayload {
  userId: string;
}

// Default expires as StringValue literals
const ACCESS_EXPIRES: StringValue = "15m";
const REFRESH_EXPIRES: StringValue = "7d";

export const signAccessToken = (payload: JwtPayload, expiresIn: StringValue = ACCESS_EXPIRES): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, ACCESS_SECRET, options);
};

export const signRefreshToken = (payload: JwtPayload, expiresIn: StringValue = REFRESH_EXPIRES): string => {
  const options: SignOptions = { expiresIn };
  return jwt.sign(payload, REFRESH_SECRET, options);
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, ACCESS_SECRET) as JwtPayload;
};

export const verifyRefreshToken = (token: string): JwtPayload => {
  return jwt.verify(token, REFRESH_SECRET) as JwtPayload;
};
