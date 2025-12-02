// src/__tests__/auth/auth.service.unit.test.ts
import { prisma } from "../../config/db";
import * as authService from "../../modules/auth/auth.service";
import bcrypt from "bcrypt";

// -----------------------------
// MOCKS
// -----------------------------
jest.mock("bcrypt", () => ({
  hash: jest.fn().mockResolvedValue("hashedPassword123"),
  compare: jest.fn().mockResolvedValue(true),
}));

const mockedPrisma = prisma as typeof prisma & {
  user: {
    findUnique: jest.Mock;
    create: jest.Mock;
  };
};

// -----------------------------
// RESET MOCKS BEFORE EACH TEST
// -----------------------------
beforeEach(() => {
  jest.clearAllMocks();
});

// -----------------------------
// TEST SUITE
// -----------------------------
describe("Auth service", () => {
  describe("registerUser", () => {
    it("throws if email exists", async () => {
      mockedPrisma.user.findUnique.mockResolvedValue({ id: "1", email: "a@b.com" });

      await expect(
        authService.registerUser({ email: "a@b.com", password: "123" })
      ).rejects.toThrow();
    });

    it("hashes password and creates user", async () => {
      mockedPrisma.user.findUnique.mockResolvedValue(null);
      mockedPrisma.user.create.mockResolvedValue({
        id: "2",
        email: "b@c.com",
        password: "hashedPassword123",
      });

      const user = await authService.registerUser({ email: "b@c.com", password: "123" });

      expect(mockedPrisma.user.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            email: "b@c.com",
            password: "hashedPassword123", // matches mocked bcrypt.hash
          }),
        })
      );

      expect(user.email).toBe("b@c.com");
      expect(await bcrypt.compare("123", user.password)).toBe(true);
    });
  });

  describe("loginUser", () => {
    it("throws if user does not exist", async () => {
      mockedPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        authService.loginUser("x@y.com", "password123")
      ).rejects.toThrow("Invalid credentials");
    });

    it("throws if password is incorrect", async () => {
      mockedPrisma.user.findUnique.mockResolvedValue({
        id: "3",
        email: "y@z.com",
        password: "hashedPassword123",
      });

      // override bcrypt.compare to return false
      (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);

      await expect(
        authService.loginUser("y@z.com", "wrongPassword")
      ).rejects.toThrow("Invalid credentials");
    });

    it("returns user if credentials are correct", async () => {
  mockedPrisma.user.findUnique.mockResolvedValue({
    id: "4",
    email: "good@user.com",
    password: "hashedPassword123",
  });

  const result = await authService.loginUser("good@user.com", "123");

  expect(result).toEqual({
    accessToken: expect.any(String),
    refreshToken: expect.any(String),
    user: {
      id: "4",
      email: "good@user.com",
      password: "hashedPassword123",
    },
  });

  expect(bcrypt.compare).toHaveBeenCalledWith("123", "hashedPassword123");
});
  });
});
