import { Router } from 'express';
import {
  createEmergencyBooking,
  getAllEmergencyBookings,
  updateEmergencyBookingStatus,
} from '../../controllers/emergency/emergencyBookingController';

const router = Router();

/**
 * @openapi
 * /api/emergency-bookings:
 *   post:
 *     tags: [Emergency]
 *     summary: Create an ambulance booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [patientName, phone]
 *             properties:
 *               patientName: { type: string }
 *               phone: { type: string }
 *               pickupLocation: { type: string }
 *               reason: { type: string }
 *               notes: { type: string }
 *               ambulance: { type: string, description: "Ambulance Mongo _id or slug" }
 *     responses:
 *       201: { description: "Booking created, confirmationCode generated as DOC-NNNN" }
 *       400: { description: Missing patientName or phone }
 *   get:
 *     tags: [Emergency]
 *     summary: List all emergency bookings (admin)
 *     description: ⚠️ No read auth — returns all bookings to any caller.
 *     responses:
 *       200: { description: "List of bookings, newest first, with ambulance populated (name, slug, phone)" }
 * /api/emergency-bookings/{id}/status:
 *   put:
 *     tags: [Emergency]
 *     summary: Update a booking's status (⚠️ No write auth)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status: { type: string, enum: [pending, confirmed, dispatched, completed, cancelled] }
 *     responses:
 *       200: { description: Booking updated }
 *       400: { description: Invalid status }
 *       404: { description: Booking not found }
 */
router.post('/', createEmergencyBooking);
router.get('/', getAllEmergencyBookings);
router.put('/:id/status', updateEmergencyBookingStatus);

export default router;
