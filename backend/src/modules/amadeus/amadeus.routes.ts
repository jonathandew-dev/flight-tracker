import { Router } from "express";
import { searchFlightsController } from "./amadeus.controller";

const router = Router();

router.get("/flights", searchFlightsController);

export default router;
