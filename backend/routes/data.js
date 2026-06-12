const express = require('express');
const router = express.Router();

const Category = require('../models/Category');
const Treatment = require('../models/Treatment');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');
const Video = require('../models/Video');
const Blog = require('../models/Blog');
const Review = require('../models/Review');
const FAQ = require('../models/FAQ');
const SubCategory = require('../models/SubCategory');
const SubSubCategory = require('../models/SubSubCategory');
const PetHospital = require('../models/PetHospital');

// City name blocklist for deriving AVAILABLE_CITIES
const _cityBlocklist = /near |opposite |taluk|kachh| patti |naini |mahewa|mirakhpur|mubark|daiwghat|dadanpur|burhanagar|jhusi|karuvatta|kattanam|kollakadavu|kulanada|kumarapuram|malayambakkam|mannanchery|ashoka circle/i;

function deriveAvailableCities(hospitals) {
  return [...new Set(
    hospitals
      .map(h => (h.city || '').trim())
      .filter(c =>
        c.length > 0 &&
        c.length <= 30 &&
        !/^\d/.test(c) &&
        !/[,/\\]/.test(c) &&
        !/\d{4,}/.test(c) &&
        c.split(/\s+/).length <= 3 &&
        !_cityBlocklist.test(c)
      )
      .map(c => c.charAt(0).toUpperCase() + c.slice(1))
  )].sort();
}

// GET /api/data/critical — small fast payload: categories + treatments + subcategories + cities list
router.get('/critical', async (req, res) => {
  try {
    const [categories, treatmentDocs, subcategories, subsubcategories, cityDocs] = await Promise.all([
      Category.find().lean(),
      Treatment.find().lean(),
      SubCategory.find().sort({ order: 1, createdAt: -1 }).lean(),
      SubSubCategory.find().sort({ order: 1, createdAt: -1 }).lean(),
      Hospital.find().select('city').hint({ city: 1 }).lean(),
    ]);

    const treatments = {};
    for (const t of treatmentDocs) {
      if (!treatments[t.categorySlug]) treatments[t.categorySlug] = [];
      treatments[t.categorySlug].push(t);
    }

    const availableCities = deriveAvailableCities(cityDocs);

    res.json({ success: true, data: { categories, treatments, subcategories, subsubcategories, availableCities } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/city?city=Kolkata — hospitals + doctors for ONE city (trimmed fields)
// Uses case-insensitive collation so the { city: 1 } index is used (regex bypasses it).
router.get('/city', async (req, res) => {
  try {
    const city = (req.query.city || 'Kolkata').trim();
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

    const doctors = doctorDocs.map(doc => ({ ...doc, iconImage: doc.iconImage || '' }));

    res.json({ success: true, data: { doctors, hospitals, pethospitals } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/data/all — full payload kept for admin / backwards compat
router.get('/all', async (req, res) => {
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

    const treatments = {};
    for (const t of treatmentDocs) {
      if (!treatments[t.categorySlug]) treatments[t.categorySlug] = [];
      treatments[t.categorySlug].push(t);
    }

    const normalizedDoctors = doctors.map(doc => ({ ...doc, iconImage: doc.iconImage || '' }));

    res.json({
      success: true,
      data: { categories, treatments, doctors: normalizedDoctors, hospitals, videos, blogs: blogDocs, reviews, faqs, subcategories, subsubcategories, pethospitals },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
