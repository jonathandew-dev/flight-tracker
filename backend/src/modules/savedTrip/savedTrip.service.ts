// src/modules/savedTrip/savedTrip.service.ts
import { prisma } from "../../config/db";
import type { SavedTrip, Prisma } from "../../generated/client";
import ApiError from "../../utils/ApiError";

// Create a saved trip
export const createSavedTrip = async (
  data: Prisma.SavedTripCreateInput
): Promise<SavedTrip> => {
  return prisma.savedTrip.create({
    data,
  });
};

// Get all saved trips for a user (or all if no userId)
export const getAllSavedTrips = async (userId: string): Promise<SavedTrip[]> => {
  return prisma.savedTrip.findMany({ where: { userId }, include: { user: true } });
};

// Get a saved trip by ID

export const getSavedTripById = async (
  id: string,
  userId: string
): Promise<SavedTrip> => {
  const trip = await prisma.savedTrip.findUnique({ where: { id } });

  if (!trip) throw new ApiError(404, "SavedTrip not found");
  if (trip.userId !== userId) throw new ApiError(403, "Forbidden");

  return trip;
};

// Update a saved trip
export const updateSavedTrip = async (
  id: string,
  data: Partial<Prisma.SavedTripUpdateInput>,
  userId: string
): Promise<SavedTrip> => {
  const trip = await getSavedTripById(id, userId); 
  return prisma.savedTrip.update({ where: { id }, data });
};

export const deleteSavedTrip = async (
  id: string,
  userId: string
): Promise<SavedTrip | null> => {
  const trip = await prisma.savedTrip.findUnique({ where: { id } });
  if (!trip) return null; // Trip already deleted → safe
  if (trip.userId !== userId) throw new ApiError(403, "Forbidden");

  return prisma.savedTrip.delete({ where: { id } });
};

