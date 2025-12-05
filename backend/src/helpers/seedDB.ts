import { prisma } from "../config/db"

async function main() {
  console.log("Seeding database...");

  // 1️⃣ Create test user
  const user = await prisma.user.create({
    data: {
      email: "test@example.com",
      password: "hashed_password_here", // hash if needed
      name: "Test User",
    },
  });

  console.log("Created user:", user.email);

  // 2️⃣ Create saved trips
  const trip1 = await prisma.savedTrip.create({
    data: {
      title: "West Coast Adventure",
      userId: user.id,
      flights: {
        create: [
          { flightNumber: "AA100", origin: "JFK", destination: "LAX" },
          { flightNumber: "UA200", origin: "LAX", destination: "SFO" },
          { flightNumber: "DL300", origin: "SFO", destination: "SEA" },
        ],
      },
    },
  });

  const trip2 = await prisma.savedTrip.create({
    data: {
      title: "European Getaway",
      userId: user.id,
      flights: {
        create: [
          { flightNumber: "BA400", origin: "JFK", destination: "LHR" },
          { flightNumber: "AF500", origin: "LHR", destination: "CDG" },
          { flightNumber: "LH600", origin: "CDG", destination: "FRA" },
        ],
      },
    },
  });

  console.log("Created trips:");
  console.log(trip1.title, trip2.title);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("Seeding finished.");
  });
