const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  specialty: String,
  degree: String,
  experience: String,
  rating: Number,
  reviews: Number,
  fee: Number,
  image: String,
  hospital: String,
  location: String,
  slots: [String],
  nextSlot: String,
  language: String,
  bio: String,
  categories: [String],
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
