const express = require('express');
const router = express.Router();
const { createBooking, getAllBookings, updateBookingStatus } = require('../controllers/bookingController');

router.post('/book', createBooking);
router.get('/all', getAllBookings);
router.put('/:id/status', updateBookingStatus);

module.exports = router;
