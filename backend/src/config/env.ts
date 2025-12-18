import dotenv from "dotenv";
dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

export const ENV = {
  PORT: Number(process.env.PORT ?? 5000),
  DATABASE_URL: required("DATABASE_URL"),
  JWT_ACCESS_SECRET: required("JWT_ACCESS_SECRET"),
  JWT_REFRESH_SECRET: required("JWT_REFRESH_SECRET"),
  JWT_ACCESS_EXPIRES_IN: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
  AMADEUS_CLIENT_ID: required("AMADEUS_CLIENT_ID"),
  AMADEUS_CLIENT_SECRET: required("AMADEUS_CLIENT_SECRET"),
};
