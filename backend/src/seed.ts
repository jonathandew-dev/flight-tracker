// src/seed.ts
import { prisma } from './config/db.js';
;

async function main() {
  console.log("Seeding database...");

  // Example users
  const usersData = [
    { email: "alice@example.com", firstName: "Alice", lastName: "Wonderland", password: "password123" },
    { email: "bob@example.com", firstName: "Bob", lastName: "Builder", password: "builder456" },
    { email: "charlie@example.com", firstName: "Charlie", lastName: "Brown", password: "snoopy789" },
  ];

  for (const u of usersData) {
    // Optional: hash passwords
    

    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        firstName: u.firstName,
        lastName: u.lastName,
        password: u.password,
      },
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
