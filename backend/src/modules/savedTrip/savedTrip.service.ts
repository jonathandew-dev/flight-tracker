// src/modules/savedTrip/savedTrip.service.ts
import { prisma } from "../../config/db.js";
import type { Prisma } from "@prisma/client";
import ApiError from "../../utils/ApiError.js";

// Create a saved trip
export const createSavedTrip = async (
  data: Prisma.SavedTripCreateInput
) => {
  return prisma.savedTrip.create({
    data,
  });
};

// Get all saved trips for a user
export const getAllSavedTrips = async (userId: string) => {
  return prisma.savedTrip.findMany({
    where: { userId },
    include: { user: true },
  });
};

// Get a saved trip by ID
export const getSavedTripById = async (
  id: string,
  userId: string
) => {
  const trip = await prisma.savedTrip.findUnique({ where: { id } });

  if (!trip) throw new ApiError(404, "SavedTrip not found");
  if (trip.userId !== userId) throw new ApiError(403, "Forbidden");

  return trip;
};

// Update a saved trip
export const updateSavedTrip = async (
  id: string,
  data: Prisma.SavedTripUpdateInput,
  userId: string
) => {
  await getSavedTripById(id, userId);
  return prisma.savedTrip.update({ where: { id }, data });
};

// Delete a saved trip
export const deleteSavedTrip = async (
  id: string,
  userId: string
) => {
  const trip = await prisma.savedTrip.findUnique({ where: { id } });
  if (!trip) return null;
  if (trip.userId !== userId) throw new ApiError(403, "Forbidden");

  return prisma.savedTrip.delete({ where: { id } });
};
