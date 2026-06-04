const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  id: Number,
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  icon: String,
  iconImage: String, // optional PNG/WebP icon; overrides emoji `icon` on the frontend
  color: String,
  colorLight: String,
  treatmentCount: Number,
  tags: [String],
  description: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model('Category', categorySchema);
