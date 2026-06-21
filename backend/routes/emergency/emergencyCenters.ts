import { Router } from 'express';
import { getEmergencyCenters, getEmergencyCenterBySlug } from '../../controllers/emergency/emergencyCenterController';

const router = Router();

router.get('/', getEmergencyCenters);
router.get('/:slug', getEmergencyCenterBySlug);

export default router;
