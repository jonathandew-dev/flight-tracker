// src/modules/savedTrip/savedTripRoutes.ts
import { Router } from 'express'
import * as savedTripController from './savedTrip.controller'
import { authMiddleware } from '../../middleware/auth'

const router = Router()

router.use(authMiddleware) // protect all routes

router.get('/', savedTripController.getAllSavedTrips)
router.get('/:id', savedTripController.getSavedTripById)
router.post('/', savedTripController.createSavedTrip)
router.put('/:id', savedTripController.updateSavedTrip)
router.delete('/:id', savedTripController.deleteSavedTrip)

export default router
