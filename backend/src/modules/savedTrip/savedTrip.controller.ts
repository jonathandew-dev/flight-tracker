import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import * as savedTripService from './savedTrip.service';
import type { Prisma } from "../../generated/client";

// POST /savedTrips
// export const createSavedTrip = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//   const { title, flights } = req.body;

//   const tripData: Prisma.SavedTripCreateInput = {
//     title: title ?? null,
//     user: { connect: { id: req.userId! } },
//     flights: (flights ?? null) as Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined,
//   };

//   const trip = await savedTripService.createSavedTrip(tripData);
//   res.status(201).json({ trip });
// });
export const createSavedTripHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, flights } = req.body;
    const tripData: Prisma.SavedTripCreateInput = {
      title: title ?? null,
      user: { connect: { id: req.userId! } },
      flights: (flights ?? null) as Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined,
    };
    const trip = await savedTripService.createSavedTrip(tripData);
    res.status(201).json({ trip });
  } catch (err) {
    next(err);
  }
};

// Keep catchAsync wrapper for app routes
export const createSavedTrip = catchAsync(createSavedTripHandler);

// GET /savedTrips
export const getAllSavedTrips = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const trips = await savedTripService.getAllSavedTrips(req.userId);
  res.status(200).json({ trips });
});

// GET /savedTrips/:id
export const getSavedTripById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const trip = await savedTripService.getSavedTripById(req.params.id);
  res.status(200).json({ trip });
});

// PUT /savedTrips/:id
export const updateSavedTrip = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const trip = await savedTripService.updateSavedTrip(req.params.id, req.body);
  res.status(200).json({ trip });
});

// DELETE /savedTrips/:id
export const deleteSavedTrip = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await savedTripService.deleteSavedTrip(req.params.id);
  res.status(204).send();
});
