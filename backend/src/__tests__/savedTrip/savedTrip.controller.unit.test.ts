// src/__tests__/savedTrip/savedTrip.controller.unit.test.ts

import "../../helpers/mockPrisma";

import type { Request, Response, NextFunction } from "express";

// --- MOCK the service before importing controller ---
jest.mock("../../modules/savedTrip/savedTrip.service");

import * as savedTripController from "../../modules/savedTrip/savedTrip.controller";
import * as savedTripService from "../../modules/savedTrip/savedTrip.service";

beforeEach(() => {
  jest.clearAllMocks();
});
describe("SavedTrip controller", () => {
  describe("createSavedTripHandler", () => {
    it("calls service and returns JSON on success", async () => {
      const req = { body: { title: "Trip 1", flights: [] }, userId: "u1" } as unknown as Request;
      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock })) as unknown as Response;
      const res = { status: statusMock } as unknown as Response;
      const next = jest.fn() as jest.MockedFunction<NextFunction>;

      (savedTripService.createSavedTrip as jest.Mock).mockResolvedValue({ id: "1" });

      await savedTripController.createSavedTrip(req, res, next);

      expect(savedTripService.createSavedTrip).toHaveBeenCalledWith({
        title: "Trip 1",
        flights: [],
        user: { connect: { id: "u1" } },
      });
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({ trip: { id: "1" } });
      expect(next).not.toHaveBeenCalled();
    });

    it("calls next on service error", async () => {
      const req = { body: { title: "Trip 1" }, userId: "u1" } as unknown as Request;
      const res = { status: jest.fn() } as unknown as Response;
      const next = jest.fn() as jest.MockedFunction<NextFunction>;

      (savedTripService.createSavedTrip as jest.Mock).mockRejectedValue(new Error("boom"));

      await savedTripController.createSavedTrip(req, res, next);

      expect(next).toHaveBeenCalled();
      const errorArg = next.mock.calls[0][0] as unknown as Error;
      expect(errorArg).toBeInstanceOf(Error);
      expect(errorArg.message).toBe("boom");
    });
  });

  describe("getAllSavedTrips", () => {
    it("returns trips on success", async () => {
      const req = { userId: "u1" } as unknown as Request;
      const jsonMock = jest.fn();
      const statusMock = jest.fn(() => ({ json: jsonMock })) as unknown as Response;
      const res = { status: statusMock } as unknown as Response;
      const next = jest.fn();

      (savedTripService.getAllSavedTrips as jest.Mock).mockResolvedValue([{ id: "1" }]);

      await savedTripController.getAllSavedTrips(req, res, next);

      expect(savedTripService.getAllSavedTrips).toHaveBeenCalledWith("u1");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ trips: [{ id: "1" }] });
    });
  });
});