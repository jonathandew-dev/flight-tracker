import { mockedPrisma } from "./helpers/mockPrisma";

// Mock the whole db import
jest.mock("./config/db", () => ({
  prisma: mockedPrisma,
}));