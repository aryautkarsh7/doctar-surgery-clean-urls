import { Router } from 'express';
import {
  createEmergencyBooking,
  getAllEmergencyBookings,
  updateEmergencyBookingStatus,
} from '../../controllers/emergency/emergencyBookingController';

const router = Router();

router.post('/', createEmergencyBooking);
router.get('/', getAllEmergencyBookings);
router.put('/:id/status', updateEmergencyBookingStatus);

export default router;
