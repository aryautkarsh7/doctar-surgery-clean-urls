const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  video_url: String,     // For YouTube links
  embed_code: String,    // For Instagram embed code
  doctor_name: { type: String, required: true },
  specialty: { type: String, required: true },
  thumbnail_url: String,
  platform: { type: String, enum: ['youtube', 'instagram'], required: true },
  type: { type: String, enum: ['reel', 'landscape'], required: true },
  duration: String,
  order: { type: Number, default: 0 },
  showOn: { type: [String], default: ['all'] },
  // Values: 'all' = everywhere, 'home' = homepage only,
  // 'doctor-[slug]' = specific doctor page,
  // 'category-[slug]' = specific category page
}, { timestamps: true });

module.exports = mongoose.model('Video', videoSchema);
