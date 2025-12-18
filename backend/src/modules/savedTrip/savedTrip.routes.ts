// src/modules/savedTrip/savedTripRoutes.ts
import { Router } from 'express'
import * as savedTripController from "./savedTrip.controller.js"
import { authMiddleware } from "../../middleware/auth.js"
import { validate } from "../../middleware/validate.js"
import { createSavedTripSchema,updateSavedTripSchema } from "./savedTrip.validators.js"

const router = Router()

router.use(authMiddleware) // protect all routes

router.get('/', savedTripController.getAllSavedTrips);
router.get('/:id', savedTripController.getSavedTripById);
router.post('/', validate(createSavedTripSchema), savedTripController.createSavedTrip);
router.put('/:id', validate(updateSavedTripSchema), savedTripController.updateSavedTrip);
router.delete('/:id', savedTripController.deleteSavedTrip);
router.post('/:tripId/flights',savedTripController.addFlightToTrip);
router.put('/:tripId/flights/:flightIndex',savedTripController.updateFlightInTrip);
router.delete('/:tripId/flights/:flightId', savedTripController.deleteFlightFromTrip);

export default router
