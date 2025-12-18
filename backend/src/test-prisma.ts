import { prisma } from "./config/db.js";

async function testDB() {
  try {
    const users = await prisma.user.findMany();
    console.log("✅ Users in DB:", users);
  } catch (error) {
    console.error("❌ DB connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDB();