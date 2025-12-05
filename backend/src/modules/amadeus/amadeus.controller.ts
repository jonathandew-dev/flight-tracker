import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { searchFlights } from "./amadeus.service";



export const searchFlightsHandler = async (req: Request, res: Response) => {
  try {
    const { originLocationCode, destinationLocationCode, departureDate, returnDate, adults, max } = req.query;

    if (!originLocationCode || !destinationLocationCode || !departureDate) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const flights = await searchFlights(
      originLocationCode as string,
      destinationLocationCode as string,
      departureDate as string,
      returnDate ? (returnDate as string) : undefined,
      adults ? parseInt(adults as string) : 1,
      max ? parseInt(max as string) : 5
    );

    res.json(flights);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch flights from Amadeus" });
  }
};