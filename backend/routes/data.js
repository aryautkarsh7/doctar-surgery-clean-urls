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

// GET /api/data/all — everything the frontend needs in one call.
// Treatments are grouped by categorySlug to match the frontend's
// TREATMENTS object shape.
router.get('/all', async (req, res) => {
  try {
    const [categories, treatmentDocs, doctors, hospitals, videos, blogDocs, reviews, faqs, subcategories] = await Promise.all([
      Category.find().lean(),
      Treatment.find().lean(),
      Doctor.find().lean(),
      Hospital.find().lean(),
      Video.find().sort({ order: 1, createdAt: -1 }).lean(),
      Blog.find({ published: true }).sort({ createdAt: -1 }).lean(),
      Review.find().sort({ createdAt: -1 }).lean(),
      FAQ.find().sort({ order: 1, createdAt: -1 }).lean(),
      SubCategory.find().sort({ order: 1, createdAt: -1 }).lean(),
    ]);

    const treatments = {};
    for (const t of treatmentDocs) {
      if (!treatments[t.categorySlug]) treatments[t.categorySlug] = [];
      treatments[t.categorySlug].push(t);
    }

    const normalizedDoctors = doctors.map(doc => ({
      ...doc,
      iconImage: doc.iconImage || '',
    }));

    res.json({
      success: true,
      data: { categories, treatments, doctors: normalizedDoctors, hospitals, videos, blogs: blogDocs, reviews, faqs, subcategories },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
