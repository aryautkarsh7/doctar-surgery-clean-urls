import { Router } from 'express';
import { getBloodBanks, getBloodBankBySlug } from '../../controllers/emergency/bloodBankController';

const router = Router();

router.get('/', getBloodBanks);
router.get('/:slug', getBloodBankBySlug);

export default router;
