const express = require('express');
const router = express.Router();

const Category = require('../models/Category');
const Treatment = require('../models/Treatment');
const Doctor = require('../models/Doctor');
const Hospital = require('../models/Hospital');

// GET /api/data/all — everything the frontend needs in one call.
// Treatments are grouped by categorySlug to match the frontend's
// TREATMENTS object shape.
router.get('/all', async (req, res) => {
  try {
    const [categories, treatmentDocs, doctors, hospitals] = await Promise.all([
      Category.find().lean(),
      Treatment.find().lean(),
      Doctor.find().lean(),
      Hospital.find().lean(),
    ]);

    const treatments = {};
    for (const t of treatmentDocs) {
      if (!treatments[t.categorySlug]) treatments[t.categorySlug] = [];
      treatments[t.categorySlug].push(t);
    }

    res.json({
      success: true,
      data: { categories, treatments, doctors, hospitals },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
