import "dotenv/config";  // load env first
import app from "./app.js";
import { prisma } from "./config/db.js";

const PORT = process.env.PORT || 5000;

const server = app;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = async () => {
  console.log("Shutting down server...");
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
