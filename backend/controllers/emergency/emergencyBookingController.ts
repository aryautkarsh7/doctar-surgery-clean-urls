import { Request, Response } from 'express';
import { Types } from 'mongoose';
import EmergencyBooking from '../../models/emergency/EmergencyBooking';
import Ambulance from '../../models/emergency/Ambulance';

const ALLOWED_STATUSES = ['pending', 'confirmed', 'dispatched', 'completed', 'cancelled'];

// Generate a confirmation code: "DOC-" + 4 random digits
function generateConfirmationCode(): string {
  return 'DOC-' + Math.floor(1000 + Math.random() * 9000);
}

// POST /api/emergency-bookings — create a new ambulance booking
export async function createEmergencyBooking(req: Request, res: Response) {
  try {
    const { patientName, phone, pickupLocation, reason, notes, ambulance } = req.body;

    if (!patientName || !phone) {
      return res.status(400).json({ success: false, message: 'patientName and phone are required' });
    }

    // Resolve the ambulance reference — accept an ObjectId or a slug.
    let ambulanceRef: Types.ObjectId | null = null;
    if (ambulance) {
      if (/^[0-9a-fA-F]{24}$/.test(ambulance)) {
        ambulanceRef = new Types.ObjectId(ambulance);
      } else {
        const amb = await Ambulance.findOne({ slug: ambulance }).select('_id').lean();
        if (amb) ambulanceRef = amb._id as Types.ObjectId;
      }
    }

    const booking = await EmergencyBooking.create({
      patientName,
      phone,
      pickupLocation,
      reason,
      notes,
      ambulance: ambulanceRef,
      confirmationCode: generateConfirmationCode(),
      status: 'pending',
    });
    console.log('✅ Emergency booking saved:', booking.confirmationCode, '-', booking.patientName);

    return res.status(201).json({ success: true, message: 'Booking received!', data: booking });
  } catch (err) {
    console.error('❌ createEmergencyBooking error:', (err as Error).message);
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

// GET /api/emergency-bookings — list all bookings (admin, newest first)
export async function getAllEmergencyBookings(_req: Request, res: Response) {
  try {
    const bookings = await EmergencyBooking.find().populate('ambulance', 'name slug phone').sort({ createdAt: -1 });
    return res.json({ success: true, total: bookings.length, data: bookings });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}

// PUT /api/emergency-bookings/:id/status — update a booking's status
export async function updateEmergencyBookingStatus(req: Request, res: Response) {
  try {
    const { status } = req.body;
    if (!ALLOWED_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const booking = await EmergencyBooking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    return res.json({ success: true, data: booking });
  } catch (err) {
    return res.status(500).json({ success: false, error: (err as Error).message });
  }
}
