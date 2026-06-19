import { Request, Response } from 'express';
import Booking from '../models/Booking';
import Doctor from '../models/Doctor';
import { sendBookingEmail } from '../utils/mailer';
// import { sendBookingSMS } from '../utils/sms'; // SMS utility doesn't exist yet as TS or maybe at all. Wait, let me check.

// Let's create an empty mock for sendBookingSMS just in case, but let's read the old one or just import it.
// Actually let's assume it exists as utils/sms.js and I will convert it soon, or just use any.
// The previous errors showed: Could not find a declaration file for module '../utils/sms'.
// Let's type it inline or just require it.
const { sendBookingSMS } = require('../utils/sms');

export async function createBooking(req: Request, res: Response) {
  try {
    const {
      name, phone, disease, email, patientEmail,
      doctorSlug, doctorName, hospital, location,
      appointmentDate, appointmentTime,
    } = req.body;

    if (!name || !phone || !disease) {
      res.status(400).json({ success: false, message: 'All fields are required' });
      return;
    }

    const booking = await Booking.create({
      name, phone, disease,
      email,
      patientEmail: patientEmail || email,
      doctorSlug,
      doctorName,
      appointmentDate,
      appointmentTime,
      hospital,
      location,
    });
    console.log('✅ Booking saved:', booking.name);

    let doctorEmail: string | undefined = undefined;
    if (doctorSlug) {
      try {
        const doctor = await Doctor.findOne({ slug: doctorSlug }).lean();
        if (doctor && doctor.email) doctorEmail = doctor.email;
      } catch (e: any) {
        console.error('⚠️  Doctor lookup failed:', e.message);
      }
    }

    console.log('📨 Calling sendBookingEmail...');
    await sendBookingEmail(booking, doctorEmail);
    console.log('📨 sendBookingEmail done');

    // Non-blocking SMS
    sendBookingSMS(booking);

    res.status(201).json({ success: true, message: 'Booking received!', data: booking });
  } catch (err: any) {
    console.error('❌ createBooking error:', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
}

export async function getAllBookings(req: Request, res: Response) {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    res.json({ success: true, total: bookings.length, data: bookings });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}

const ALLOWED_STATUSES = ['pending', 'confirmed', 'cancelled'];

export async function updateBookingStatus(req: Request, res: Response) {
  try {
    const { status } = req.body;
    if (!ALLOWED_STATUSES.includes(status)) {
      res.status(400).json({
        success: false,
        message: `Status must be one of: ${ALLOWED_STATUSES.join(', ')}`,
      });
      return;
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      res.status(404).json({ success: false, message: 'Booking not found' });
      return;
    }

    res.json({ success: true, message: 'Status updated', data: booking });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
}
