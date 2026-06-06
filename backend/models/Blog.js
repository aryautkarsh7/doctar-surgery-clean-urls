const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, default: '' },
  contentType: { type: String, enum: ['standard', 'html'], default: 'standard' },
  excerpt: String,
  author: { type: String, default: 'Doctar Editorial' },
  category: { type: String, required: true },
  thumbnail: String,
  tags: [String],
  published: { type: Boolean, default: false },
  showOn: { type: [String], default: ['all'] },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
