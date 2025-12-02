// src/modules/savedTrip/savedTrip.service.ts
import { prisma } from '../../config/db';
import type { SavedTrip, Prisma } from '../../generated/client';
import ApiError from '../../utils/ApiError';

// Create a saved trip
export const createSavedTrip = async (data:Prisma.SavedTripCreateInput): Promise<SavedTrip> => {
  return prisma.savedTrip.create({
    data,
  });
};

// Get all saved trips for a user (or all if no userId)
export const getAllSavedTrips = async (userId?: string): Promise<SavedTrip[]> => {
  const where = userId ? { userId } : undefined;
  return prisma.savedTrip.findMany({ where, include: { user: true } });
};

// Get a saved trip by ID
export const getSavedTripById = async (id: string): Promise<SavedTrip> => {
  const trip = await prisma.savedTrip.findUnique({ where: { id }, include: { user: true } });
  if (!trip) throw new ApiError(404, 'SavedTrip not found');
  return trip;
};

// Update a saved trip
export const updateSavedTrip = async (id: string, data: Partial<Prisma.SavedTripUpdateInput>): Promise<SavedTrip> => {
  return prisma.savedTrip.update({ where: { id }, data });
};

// Delete a saved trip
export const deleteSavedTrip = async (id: string): Promise<SavedTrip> => {
  return prisma.savedTrip.delete({ where: { id } });
};
