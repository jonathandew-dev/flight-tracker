import { Router } from "express";
import { searchFlightsHandler } from "./amadeus.controller";

const router = Router();

router.get("/search", searchFlightsHandler);

export default router;
