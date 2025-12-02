// src/helpers/mockPrisma.ts
export const mockedPrisma = {
    user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  savedTrip: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

// Mock the entire db import
jest.mock("../config/db", () => ({
  prisma: mockedPrisma,
}));
