import { Router } from "express";
import { searchFlightsController } from "./amadeus.controller";

const router = Router();

router.get("/search", searchFlightsController);

export default router;
