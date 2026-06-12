const mongoose = require('mongoose');

// Per-day operating hours entry (Step 6 of the onboarding wizard).
const operatingHourSchema = new mongoose.Schema({
  day: String,            // 'Monday' … 'Sunday'
  enabled: Boolean,       // is the hospital open this day
  open24: Boolean,        // open 24 hours (ignores open/close)
  open: String,           // 'HH:MM' 24h string from a time picker
  close: String,          // 'HH:MM'
}, { _id: false });

const hospitalSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  name: { type: String, required: true },

  // ── Step 1 · Basic Information ──────────────────────────────
  type: String,                 // Government Hospital, Private Hospital, …
  ownershipType: String,        // Individual, Trust, Government, …
  registrationNumber: String,
  registrationAuthority: String,
  registrationYear: String,
  totalBeds: Number,
  icuBeds: Number,
  totalStaff: Number,
  overview: String,             // "Description" textarea (shown on public site)

  // ── Step 2 · Location & Contact ─────────────────────────────
  email: String,
  phone: String,
  alternatePhone: String,
  website: String,
  address: String,
  city: String,
  state: String,
  pincode: String,
  locality: String,
  landmark: String,
  emergencyContact: String,
  emergencyServices: Boolean,   // 24/7 emergency available
  // Social links (kept flat so the generic admin save picks them up directly)
  facebook: String,
  twitter: String,
  instagram: String,
  linkedin: String,
  youtube: String,

  // ── Step 3 · Services & Specialties ─────────────────────────
  specialties: [String],
  services: [String],
  amenities: [String],
  metrics: [String],

  // ── Step 4 · Media ──────────────────────────────────────────
  image: String,                // cover image (16:9)
  logo: String,
  gallery: [String],            // up to 5 image URLs

  // ── Step 5 · Documents ──────────────────────────────────────
  accreditations: [String],     // NABH, JCI, ISO …
  awards: [String],
  establishedYear: String,

  // ── Step 6 · Operating Hours ────────────────────────────────
  operatingHours: [operatingHourSchema],

  // ── Map / coordinates (search or GPS) ───────────────────────
  map: {
    left: Number,
    top: Number,
    label: String,
    lat: Number,
    lng: Number,
  },

  // ── Legacy / display fields (kept for backwards compatibility) ──
  rating: Number,
  reviews: Number,
  distance: String,
  hours: String,                // legacy free-text hours string
}, { timestamps: true });

hospitalSchema.index({ city: 1 });

module.exports = mongoose.model('Hospital', hospitalSchema);
