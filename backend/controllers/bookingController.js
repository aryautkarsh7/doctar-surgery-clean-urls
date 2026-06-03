const Booking = require('../models/Booking');
const { sendBookingEmail } = require('../utils/mailer');

// POST /api/bookings/book — create a new booking
async function createBooking(req, res) {
  try {
    const { name, phone, disease, email } = req.body;

    if (!name || !phone || !disease) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const booking = await Booking.create({ name, phone, disease, email });

    // Fire confirmation + admin notification emails.
    // Awaited but mailer never throws, so a mail issue won't break the booking.
    await sendBookingEmail(booking);

    return res.status(201).json({ success: true, message: 'Booking received!', data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// GET /api/bookings/all — list all bookings (newest first)
async function getAllBookings(req, res) {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    return res.json({ success: true, total: bookings.length, data: bookings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

// PUT /api/bookings/:id/status — update a booking's status
const ALLOWED_STATUSES = ['pending', 'confirmed', 'cancelled'];

async function updateBookingStatus(req, res) {
  try {
    const { status } = req.body;

    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    return res.json({ success: true, message: 'Status updated', data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = { createBooking, getAllBookings, updateBookingStatus };
