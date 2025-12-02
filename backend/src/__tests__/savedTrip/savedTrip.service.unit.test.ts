import { jest } from "@jest/globals";
import { createSavedTrip, getAllSavedTrips } from "../../modules/savedTrip/savedTrip.service";
import { prisma } from "../../config/db";
import type { SavedTrip } from "../../generated/client";

jest.mock("../../config/db", () => ({
  prisma: {
    savedTrip: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

const mockedPrisma = prisma as unknown as {
  savedTrip: {
    create: jest.MockedFunction<(args: any) => Promise<SavedTrip>>;
    findMany: jest.MockedFunction<(args: any) => Promise<SavedTrip[]>>;
  };
};

describe("SavedTrip service", () => {
  afterEach(() => jest.clearAllMocks());

  test("createSavedTrip calls prisma.create and returns saved trip", async () => {
    const payload = { userId: "u1", title: "T1", flights: { foo: "bar" } };
    const created: SavedTrip = {
      id: "s1",
      userId: payload.userId,
      title: payload.title,
      flights: payload.flights,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockedPrisma.savedTrip.create.mockResolvedValue(created);

    const res = await createSavedTrip(payload as any);
    expect(mockedPrisma.savedTrip.create).toHaveBeenCalledWith({ data: payload });
    expect(res).toEqual(created);
  });

  test("getAllSavedTrips returns findMany results (with userId filter)", async () => {
    const trips: SavedTrip[] = [
      {
        id: "s1",
        userId: "u1",
        title: "T1",
        flights: { foo: "bar" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "s2",
        userId: "u1",
        title: "T2",
        flights: { bar: "baz" },
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    mockedPrisma.savedTrip.findMany.mockResolvedValue(trips);

    const res = await getAllSavedTrips("u1");
    expect(mockedPrisma.savedTrip.findMany).toHaveBeenCalledWith({
      where: { userId: "u1" },
      include: { user: true },
    });
    expect(res).toEqual(trips);
  });
});
