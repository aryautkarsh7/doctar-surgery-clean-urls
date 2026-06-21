import { Router, Request, Response } from 'express';
import Ambulance from '../../models/emergency/Ambulance';
import EmergencyCenter from '../../models/emergency/EmergencyCenter';
import BloodBank from '../../models/emergency/BloodBank';

const router = Router();

// GET /api/emergency/data/critical?city=Kolkata
// Single fast payload the emergency frontend calls on load — everything needed for a city.
// Namespaced under /api/emergency/data (rather than /api/data) because /api/data/critical
// is already taken by the surgery site's critical payload route.
router.get('/critical', async (req: Request, res: Response) => {
  try {
    const city = ((req.query.city as string) || 'Kolkata').trim();
    const collation = { locale: 'en', strength: 2 }; // case-insensitive

    const [ambulances, emergencyCenters, bloodBanks] = await Promise.all([
      Ambulance.find({ city, active: true }).collation(collation).lean(),
      EmergencyCenter.find({ city, active: true }).collation(collation).lean(),
      BloodBank.find({ city, active: true }).collation(collation).lean(),
    ]);

    res.json({ success: true, city, data: { ambulances, emergencyCenters, bloodBanks } });
  } catch (err) {
    res.status(500).json({ success: false, error: (err as Error).message });
  }
});

export default router;
