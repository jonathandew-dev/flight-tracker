// src/server.ts
import "dotenv/config"; // must be first to load env vars
import app from "./app.js"; // your Express app
import { prisma } from "./config/db.js"; // your Prisma client

const PORT = process.env.PORT || 1000;

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const shutdown = async () => {
  console.log("Shutting down server...");
  await prisma.$disconnect();
  server.close(() => {
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
