const mongoose = require('mongoose');

const subSubCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  categorySlug: { type: String, required: true },
  subCategorySlug: { type: String, required: true },
  keywords: [String],
  order: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('SubSubCategory', subSubCategorySchema);
