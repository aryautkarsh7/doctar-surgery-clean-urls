import { Router } from 'express';
import { getAmbulances, getAmbulanceBySlug } from '../../controllers/emergency/ambulanceController';

const router = Router();

router.get('/', getAmbulances);
router.get('/:slug', getAmbulanceBySlug);

export default router;
