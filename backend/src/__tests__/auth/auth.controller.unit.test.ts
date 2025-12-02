import "../../helpers/mockPrisma"; // mock Prisma first
import * as authService from "../../modules/auth/auth.service";
import * as authController from "../../modules/auth/auth.controller";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Auth controller", () => {
  describe("registerUserController", () => {
    it("calls service and returns JSON", async () => {
      const req = { body: { email: "a@b.com", password: "123" } } as any;

      const jsonMock = jest.fn();
      const res = { status: jest.fn(() => ({ json: jsonMock })) } as any;
      const next = jest.fn();

      // Spy on service method and return full user
      jest.spyOn(authService, "registerUser").mockResolvedValue({
        id: "1",
        email: "a@b.com",
        name: null,
        password: "123",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      await authController.registerUserController(req, res, next);

      expect(authService.registerUser).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        user: {
          id: "1",
          email: "a@b.com",
          name: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("existing email calls next with error", async () => {
      const req = { body: { email: "a@b.com", password: "123" } } as any;
      const res = { status: jest.fn(() => ({ json: jest.fn() })) } as any;
      const next = jest.fn();

      jest
        .spyOn(authService, "registerUser")
        .mockRejectedValue(new Error("Email exists"));

      await authController.registerUserController(req, res, next);

      expect(next).toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Email exists");
    });
  });
});
