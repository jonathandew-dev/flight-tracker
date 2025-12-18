import { Router } from "express";
import { searchFlightsHandler } from "./amadeus.controller.js";

const router = Router();

router.get("/search", searchFlightsHandler);

export default router;
