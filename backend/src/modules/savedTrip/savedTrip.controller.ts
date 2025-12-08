import { Request, Response, NextFunction } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import * as savedTripService from './savedTrip.service';
import {prisma} from '../../config/db'
import {Prisma} from '../../generated/client';
import { v4 as uuidv4 } from 'uuid';

// POST /savedTrips
export const createSavedTrip = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const tripData: Prisma.SavedTripCreateInput = {
    title: req.body.title ?? null,
    user: { connect: { id: req.userId! } },
    flights: (req.body.flights ?? null) as Prisma.NullableJsonNullValueInput | Prisma.InputJsonValue | undefined,
  };

  const trip = await savedTripService.createSavedTrip(tripData);
  res.status(201).json( trip );
});

// GET /savedTrips
export const getAllSavedTrips = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const trips = await savedTripService.getAllSavedTrips(req.userId!);
  res.status(200).json( trips );
});

// GET /savedTrips/:id
export const getSavedTripById = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const trip = await savedTripService.getSavedTripById(req.params.id, req.userId!);
  res.status(200).json({ trip });
});

// PUT /savedTrips/:id
export const updateSavedTrip = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const trip = await savedTripService.updateSavedTrip(req.params.id, req.body, req.userId!);
  res.status(200).json({ trip });
});

// DELETE /savedTrips/:id
export const deleteSavedTrip = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  await savedTripService.deleteSavedTrip(req.params.id, req.userId!);
  res.status(204).send();
});


// PATCH /savedTrips/:tripId/flights/:flightId
export const updateFlightInTrip = async (req: Request, res: Response) => {
  try {
    const { tripId, flightId } = req.params;
    const flightUpdate = req.body; // new flight data

    const trip = await prisma.savedTrip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Ensure flights is an array of objects
    const flights: Record<string, any>[] = Array.isArray(trip.flights)
      ? (trip.flights as Record<string, any>[])
      : [];

    // Find the flight by its internal id
    const index = flights.findIndex(f => f.id === flightId);
    if (index === -1) return res.status(404).json({ message: "Flight not found" });

    // Merge the update
    flights[index] = { ...flights[index], ...flightUpdate };

    const updatedTrip = await prisma.savedTrip.update({
      where: { id: tripId },
      data: { flights },
    });

    res.json(updatedTrip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not update flight", error: err });
  }
};

// When adding a new flight, generate an internal ID
export const addFlightToTrip = async (req: Request, res: Response) => {
  try {
    const tripId = req.params.tripId;
    const flightData = req.body;

    const trip = await prisma.savedTrip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const flights: Record<string, any>[] = Array.isArray(trip.flights)
      ? (trip.flights as Record<string, any>[])
      : [];

    // Prevent duplicate flights by flightNumber + departureTime
    const exists = flights.some(
      (f) =>
        f.flightNumber === flightData.flightNumber &&
        f.departureTime === flightData.departureTime
    );
    if (exists)
      return res
        .status(400)
        .json({ message: "This flight is already in the trip" });

    // Assign internal UUID
    const flight = { id: uuidv4(), ...flightData };
    const updatedTrip = await prisma.savedTrip.update({
      where: { id: tripId },
      data: { flights: [...flights, flight] },
    });

    res.json(updatedTrip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not add flight", error: err });
  }
};

// Delete a flight from a trip
export const deleteFlightFromTrip = async (req: Request, res: Response) => {
  try {
    const { tripId, flightId } = req.params;

    const trip = await prisma.savedTrip.findUnique({ where: { id: tripId } });
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    const flights: Record<string, any>[] = Array.isArray(trip.flights)
      ? (trip.flights as Record<string, any>[])
      : [];

    const updatedFlights = flights.filter((f) => f.id !== flightId);
    if (updatedFlights.length === flights.length)
      return res.status(404).json({ message: "Flight not found" });

    const updatedTrip = await prisma.savedTrip.update({
      where: { id: tripId },
      data: { flights: updatedFlights },
    });

    res.status(200).json(updatedTrip);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Could not delete flight", error: err });
  }
};
