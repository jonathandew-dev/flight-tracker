import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { searchFlights } from "./amadeus.service";

export const searchFlightsController = catchAsync(async (req: Request, res: Response) => {
  const { origin, destination, date, nonStop, maxPrice, airlines } = req.query;

  if (!origin || !destination || !date) {
    return res.status(400).json({ message: "origin, destination, and date are required" });
  }

  // Convert filters to proper types
  const filters = {
    nonStop: nonStop === 'true', // query params are strings
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    airlines: airlines ? (airlines as string).split(',') : undefined,
  };

  const flights = await searchFlights(origin as string, destination as string, date as string, filters);

  res.status(200).json({ flights });
});