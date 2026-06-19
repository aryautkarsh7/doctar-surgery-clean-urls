import express from 'express';
const router = express.Router();
import { createBooking, getAllBookings, updateBookingStatus } from '../controllers/bookingController';

router.post('/book', createBooking);
router.get('/all', getAllBookings);
router.put('/:id/status', updateBookingStatus);

export default router;
