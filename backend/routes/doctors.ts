import express, { Request, Response } from 'express';
const router = express.Router();
import Doctor from '../models/Doctor';
import crudController from '../controllers/crudController';

const c = crudController(Doctor, 'Doctor');

// GET / — list all doctors, always include iconImage (even for docs seeded before the field existed)
router.get('/', async (req: Request, res: Response) => {
  try {
    const docs = await Doctor.find().sort({ createdAt: -1 }).lean();
    const normalized = docs.map((doc: any) => ({
      ...doc,
      iconImage: doc.iconImage || '',
    }));
    res.json({ success: true, total: normalized.length, data: normalized });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// All other CRUD operations (getOne, create, update, delete) use the generic controller
router.get('/:id', c.getOne);
router.post('/', c.create);
router.put('/:id', c.update);
router.delete('/:id', c.remove);

export default router;
