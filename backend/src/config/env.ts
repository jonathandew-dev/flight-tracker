import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 5000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "default_access",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "default_refresh",
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  AMADEUS_CLIENT_ID: process.env.AMADEUS_CLIENT_ID || "",
  AMADEUS_CLIENT_SECRET: process.env.AMADEUS_CLIENT_SECRET || "",
};