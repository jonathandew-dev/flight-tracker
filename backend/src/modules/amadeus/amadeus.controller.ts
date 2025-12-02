import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { searchFlights } from "./amadeus.service";

export const searchFlightsController = catchAsync(async (req: Request, res: Response) => {
  const { origin, destination, date } = req.query;

  if (!origin || !destination || !date) {
    return res.status(400).json({ message: "origin, destination, and date are required" });
  }

    const flights = await searchFlights(origin as string, destination as string, date as string);

  res.status(200).json({ flights });
});