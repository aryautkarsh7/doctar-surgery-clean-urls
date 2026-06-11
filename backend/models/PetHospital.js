const mongoose = require('mongoose');
const petHospitalSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  type: { type: String, default: 'Veterinary Clinic' },
  petTypes: [String],
  phone: String,
  alternatePhone: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  locality: String,
  landmark: String,
  overview: String,
  image: String,
  logo: String,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  emergencyServices: { type: Boolean, default: false },
  hours: String,
  website: String,
  map: {
    lat: Number,
    lng: Number,
    label: String
  },
  services: [String],
  amenities: [String]
}, { timestamps: true });
module.exports = mongoose.model('PetHospital', petHospitalSchema);
