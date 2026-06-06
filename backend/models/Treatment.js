const mongoose = require('mongoose');

// TREATMENTS in data.js is keyed by category slug; we flatten each entry
// and add categorySlug so it can be grouped back for the frontend.
const treatmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categorySlug: { type: String, required: true, index: true },
  subCategorySlug: { type: String, index: true }, // optional grouping under a sub-category
  brief: String,
  recovery: String,
  costRange: String,
  procedure: String,
  benefits: [String],
}, { timestamps: true });

module.exports = mongoose.model('Treatment', treatmentSchema);
