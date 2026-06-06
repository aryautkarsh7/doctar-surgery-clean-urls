const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: String,   // which specialty/category this FAQ relates to
  order: { type: Number, default: 0 },
  showOn: { type: [String], default: ['all'] },
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema);
