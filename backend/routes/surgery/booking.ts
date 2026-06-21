import express from 'express';
const router = express.Router();
import { createBooking, getAllBookings, updateBookingStatus } from '../../controllers/surgery/bookingController';

/**
 * @openapi
 * /api/bookings/book:
 *   post:
 *     tags: [Surgery]
 *     summary: Create a surgery consultation booking
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, phone, disease]
 *             properties:
 *               name: { type: string }
 *               phone: { type: string }
 *               disease: { type: string }
 *               email: { type: string }
 *               patientEmail: { type: string }
 *               doctorSlug: { type: string }
 *               doctorName: { type: string }
 *               hospital: { type: string }
 *               location: { type: string }
 *               appointmentDate: { type: string }
 *               appointmentTime: { type: string }
 *     responses:
 *       201: { description: Booking created; confirmation email sent to doctor if doctorSlug resolves }
 *       400: { description: Missing required fields }
 * /api/bookings/all:
 *   get:
 *     tags: [Surgery]
 *     summary: List all surgery bookings (admin)
 *     description: ⚠️ No read auth — returns all bookings to any caller.
 *     responses:
 *       200: { description: List of bookings, newest first }
 * /api/bookings/{id}/status:
 *   put:
 *     tags: [Surgery]
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
 *               status: { type: string, enum: [pending, confirmed, cancelled] }
 *     responses:
 *       200: { description: Booking updated }
 *       400: { description: Invalid status }
 *       404: { description: Booking not found }
 */
router.post('/book', createBooking);
router.get('/all', getAllBookings);
router.put('/:id/status', updateBookingStatus);

export default router;
