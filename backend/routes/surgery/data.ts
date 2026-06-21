import express, { Request, Response } from 'express';
const router = express.Router();

import Category from '../../models/surgery/Category';
import Treatment from '../../models/surgery/Treatment';
import Doctor from '../../models/surgery/Doctor';
import Hospital from '../../models/surgery/Hospital';
import Video from '../../models/surgery/Video';
import Blog from '../../models/shared/Blog';
import Review from '../../models/surgery/Review';
import FAQ from '../../models/surgery/FAQ';
import SubCategory from '../../models/surgery/SubCategory';
import SubSubCategory from '../../models/surgery/SubSubCategory';
import PetHospital from '../../models/surgery/PetHospital';
import City from '../../models/shared/City';

// City name blocklist for deriving AVAILABLE_CITIES
const _cityBlocklist = /near |opposite |taluk|kachh| patti |naini |mahewa|mirakhpur|mubark|daiwghat|dadanpur|burhanagar|jhusi|karuvatta|kattanam|kollakadavu|kulanada|kumarapuram|malayambakkam|mannanchery|ashoka circle/i;

function deriveAvailableCities(hospitals: any[]): string[] {
  return [...new Set(
    hospitals
      .map(h => (h.city || '').trim())
      .filter(c =>
        c.length > 0 &&
        c.length <= 30 &&
        !/^\\d/.test(c) &&
        !/[,/\\\\]/.test(c) &&
        !/\\d{4,}/.test(c) &&
        c.split(/\\s+/).length <= 3 &&
        !_cityBlocklist.test(c)
      )
      .map(c => c.charAt(0).toUpperCase() + c.slice(1))
  )].sort();
}

// GET /api/data/critical — fast payload: categories + treatments + subcategories + cities + blogs + videos
router.get('/critical', async (req: Request, res: Response) => {
  try {
    const [categories, treatmentDocs, subcategories, subsubcategories, cityDocs, blogDocs, videos, cities] = await Promise.all([
      Category.find().lean(),
      Treatment.find().lean(),
      SubCategory.find().sort({ order: 1, createdAt: -1 }).lean(),
      SubSubCategory.find().sort({ order: 1, createdAt: -1 }).lean(),
      Hospital.find().select('city').hint({ city: 1 }).lean(),
      Blog.find({ published: true }).sort({ createdAt: -1 }).limit(8).select('title slug category createdAt thumbnail excerpt author published').lean(),
      Video.find().sort({ order: 1, createdAt: -1 }).lean(),
      City.find({}).select('name slug state lat lng').sort({ name: 1 }).lean(),
    ]);

    const treatments: Record<string, any[]> = {};
    for (const t of treatmentDocs as any[]) {
      if (!treatments[t.categorySlug]) treatments[t.categorySlug] = [];
      treatments[t.categorySlug].push(t);
    }

    const availableCities = deriveAvailableCities(cityDocs);

    res.json({ success: true, data: { categories, treatments, subcategories, subsubcategories, availableCities, cities, blogs: blogDocs, videos } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/city?city=Kolkata — hospitals + doctors for ONE city (trimmed fields)
// Uses case-insensitive collation so the { city: 1 } index is used (regex bypasses it).
router.get('/city', async (req: Request, res: Response) => {
  try {
    const city = (req.query.city as string || 'Kolkata').trim();
    const collation = { locale: 'en', strength: 2 }; // strength:2 = case-insensitive

    const [doctorDocs, hospitals, pethospitals] = await Promise.all([
      Doctor.find({ city }).collation(collation).lean(),
      Hospital.find({ city })
        .collation(collation)
        .select('name slug city image logo rating phone type specialties map address locality services metrics')
        .limit(40)
        .lean(),
      PetHospital.find({ city }).collation(collation).lean(),
    ]);

    const doctors = doctorDocs.map((doc: any) => ({ ...doc, iconImage: doc.iconImage || '' }));

    res.json({ success: true, data: { doctors, hospitals, pethospitals } });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/all — full payload kept for admin / backwards compat
router.get('/all', async (req: Request, res: Response) => {
  try {
    const [categories, treatmentDocs, doctors, hospitals, videos, blogDocs, reviews, faqs, subcategories, subsubcategories, pethospitals] = await Promise.all([
      Category.find().lean(),
      Treatment.find().lean(),
      Doctor.find().lean(),
      Hospital.find().lean(),
      Video.find().sort({ order: 1, createdAt: -1 }).lean(),
      Blog.find({ published: true }).sort({ createdAt: -1 }).lean(),
      Review.find().sort({ createdAt: -1 }).lean(),
      FAQ.find().sort({ order: 1, createdAt: -1 }).lean(),
      SubCategory.find().sort({ order: 1, createdAt: -1 }).lean(),
      SubSubCategory.find().sort({ order: 1, createdAt: -1 }).lean(),
      PetHospital.find().lean(),
    ]);

    const treatments: Record<string, any[]> = {};
    for (const t of treatmentDocs as any[]) {
      if (!treatments[t.categorySlug]) treatments[t.categorySlug] = [];
      treatments[t.categorySlug].push(t);
    }

    const normalizedDoctors = (doctors as any[]).map(doc => ({ ...doc, iconImage: doc.iconImage || '' }));

    res.json({
      success: true,
      data: { categories, treatments, doctors: normalizedDoctors, hospitals, videos, blogs: blogDocs, reviews, faqs, subcategories, subsubcategories, pethospitals },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
