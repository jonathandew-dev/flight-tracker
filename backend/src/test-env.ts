import dotenv from "dotenv";
dotenv.config({ path: "./backend.env" });

console.log("DATABASE_URL", process.env.DATABASE_URL);