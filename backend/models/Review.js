const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: String,
  rating: { type: Number, min: 1, max: 5, default: 5 },
  review: { type: String, required: true },
  consultation: String,   // e.g. "Orthopedics Consultation"
  hospital: String,
  verified: { type: Boolean, default: true },
  showOn: { type: [String], default: ['home'] },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);
