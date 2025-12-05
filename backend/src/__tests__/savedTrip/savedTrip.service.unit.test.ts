import { jest } from "@jest/globals";
import {
  createSavedTrip,
  getAllSavedTrips,
  getSavedTripById,
  updateSavedTrip,
  deleteSavedTrip,
} from "../../modules/savedTrip/savedTrip.service";
import { prisma } from "../../config/db";
import type { SavedTrip } from "../../generated/client";
import ApiError from "../../utils/ApiError";



jest.mock("../../config/db", () => ({
  prisma: {
    savedTrip: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique:jest.fn(),
      update:jest.fn(),
      delete:jest.fn(), 
    },
  },
}));

const mockedPrisma = prisma as unknown as {
  savedTrip: {
    create: jest.MockedFunction<(args: any) => Promise<SavedTrip>>;
    findMany: jest.MockedFunction<(args: any) => Promise<SavedTrip[]>>;
    findUnique: jest.MockedFunction<(args: any) => Promise<SavedTrip | null>>;
    update: jest.MockedFunction<(args: any) => Promise<SavedTrip>>;
    delete: jest.MockedFunction<(args: any) => Promise<SavedTrip>>;
  };
};
describe("SavedTrip service - authorization & CRUD", () => {
  afterEach(() => jest.clearAllMocks());

  const exampleTrip: SavedTrip = {
    id: "s1",
    userId: "u1",
    title: "Trip 1",
    flights: { foo: "bar" },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // ---------- CREATE ----------
  test("createSavedTrip calls prisma.create and returns trip", async () => {
    const payload = { userId: "u1", title: "Trip 1", flights: { foo: "bar" } };
    mockedPrisma.savedTrip.create.mockResolvedValue(exampleTrip);

    const res = await createSavedTrip(payload as any);

    expect(mockedPrisma.savedTrip.create).toHaveBeenCalledWith({ data: payload });
    expect(res).toEqual(exampleTrip);
  });

  // ---------- READ ALL ----------
  test("getAllSavedTrips returns trips with userId filter", async () => {
    mockedPrisma.savedTrip.findMany.mockResolvedValue([exampleTrip]);

    const res = await getAllSavedTrips("u1");

    expect(mockedPrisma.savedTrip.findMany).toHaveBeenCalledWith({
      where: { userId: "u1" },
      include: { user: true },
    });
    expect(res).toEqual([exampleTrip]);
  });

  // ---------- READ BY ID ----------
  test("getSavedTripById returns trip for owner", async () => {
    mockedPrisma.savedTrip.findUnique.mockResolvedValue(exampleTrip);

    const res = await getSavedTripById("s1", "u1");
    expect(res).toEqual(exampleTrip);
  });

  test("getSavedTripById throws 403 if not owner", async () => {
    mockedPrisma.savedTrip.findUnique.mockResolvedValue(exampleTrip);

    await expect(getSavedTripById("s1", "u2")).rejects.toThrow(ApiError);
    await expect(getSavedTripById("s1", "u2")).rejects.toMatchObject({ statusCode: 403 });
  });

  test("getSavedTripById throws 404 if trip not found", async () => {
    mockedPrisma.savedTrip.findUnique.mockResolvedValue(null);

    await expect(getSavedTripById("s999", "u1")).rejects.toThrow(ApiError);
    await expect(getSavedTripById("s999", "u1")).rejects.toMatchObject({ statusCode: 404 });
  });

  // ---------- UPDATE ----------
  test("updateSavedTrip updates trip for owner", async () => {
    const updatedTrip = { ...exampleTrip, title: "Updated Trip" };
    mockedPrisma.savedTrip.findUnique.mockResolvedValue(exampleTrip);
    mockedPrisma.savedTrip.update.mockResolvedValue(updatedTrip);

    const res = await updateSavedTrip("s1", { title: "Updated Trip" }, "u1");

    expect(mockedPrisma.savedTrip.update).toHaveBeenCalledWith({
      where: { id: "s1" },
      data: { title: "Updated Trip" },
    });
    expect(res).toEqual(updatedTrip);
  });

  test("updateSavedTrip throws 403 if not owner", async () => {
    mockedPrisma.savedTrip.findUnique.mockResolvedValue(exampleTrip);

    await expect(updateSavedTrip("s1", { title: "Updated Trip" }, "u2")).rejects.toMatchObject({
      statusCode: 403,
    });
  });

  test("updateSavedTrip throws 404 if trip not found", async () => {
    mockedPrisma.savedTrip.findUnique.mockResolvedValue(null);

    await expect(updateSavedTrip("s999", { title: "Updated Trip" }, "u1")).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  // ---------- DELETE ----------
  test("deleteSavedTrip deletes trip for owner", async () => {
    mockedPrisma.savedTrip.findUnique.mockResolvedValue(exampleTrip);
    mockedPrisma.savedTrip.delete.mockResolvedValue(exampleTrip);

    const res = await deleteSavedTrip("s1", "u1");
    expect(mockedPrisma.savedTrip.delete).toHaveBeenCalledWith({ where: { id: "s1" } });
    expect(res).toEqual(exampleTrip);
  });

  test("deleteSavedTrip throws 403 if not owner", async () => {
    mockedPrisma.savedTrip.findUnique.mockResolvedValue(exampleTrip);

    await expect(deleteSavedTrip("s1", "u2")).rejects.toMatchObject({ statusCode: 403 });
  });

  test("deleteSavedTrip throws 404 if trip not found", async () => {
    mockedPrisma.savedTrip.findUnique.mockResolvedValue(null);

    await expect(deleteSavedTrip("s999", "u1")).rejects.toMatchObject({ statusCode: 404 });
  });
});