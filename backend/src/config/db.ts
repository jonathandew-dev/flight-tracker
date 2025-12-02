import 'dotenv/config';
import { PrismaClient, type SavedTrip } from '../generated/client';
import { PrismaPg } from '@prisma/adapter-pg';

// Adapter setup for Prisma v7
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

export const prisma = new PrismaClient({ adapter });

// Re-export types so other modules can import from here
export type { SavedTrip};