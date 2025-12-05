import { z } from "zod";

export const createSavedTripSchema = z.object({
  title: z.string().min(1).optional(),
  flights: z.any().optional(), // minimal validation for MVP
});

export const updateSavedTripSchema = z.object({
  title: z.string().min(1).optional(),
  flights: z.any().optional(),
});