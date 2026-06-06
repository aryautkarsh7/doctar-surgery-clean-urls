const mongoose = require('mongoose');

const subCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categorySlug: { type: String, required: true, index: true }, // parent category
  description: String,
  icon: String,
  order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('SubCategory', subCategorySchema);
