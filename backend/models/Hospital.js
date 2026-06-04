const mongoose = require('mongoose');

const hospitalSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: String,
  logo: String,
  rating: Number,
  reviews: Number,
  address: String,
  distance: String,
  city: String,
  type: String,
  phone: String,
  hours: String,
  overview: String,
  services: [String],
  metrics: [String],
  specialties: [String],
  amenities: [String],
  map: {
    left: Number,
    top: Number,
    label: String,
    lat: Number,
    lng: Number,
  },
}, { timestamps: true });

module.exports = mongoose.model('Hospital', hospitalSchema);
