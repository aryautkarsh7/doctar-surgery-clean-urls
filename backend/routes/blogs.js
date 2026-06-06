const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeBlogPayload(body) {
  const payload = { ...body };

  if (!payload.slug && payload.title) payload.slug = slugify(payload.title);
  if (typeof payload.published === 'string') {
    payload.published = payload.published === 'true' || payload.published === 'on';
  }
  if (typeof payload.tags === 'string') {
    payload.tags = payload.tags.split(',').map(tag => tag.trim()).filter(Boolean);
  }
  if (!Array.isArray(payload.showOn) || payload.showOn.length === 0) {
    payload.showOn = ['all'];
  }

  return payload;
}

// GET /api/blogs?page=home|category-slug|doctor-slug|treatment-slug
// With page query, return only published blogs matching showOn: all OR page.
// Without page query, return all blogs for the admin panel.
router.get('/', async (req, res) => {
  try {
    const { page } = req.query;
    const filter = page
      ? { published: true, showOn: { $in: ['all', page] } }
      : {};

    const blogs = await Blog.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, total: blogs.length, data: blogs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const blog = await Blog.create(normalizeBlogPayload(req.body));
    res.status(201).json({ success: true, message: 'Blog created', data: blog });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, normalizeBlogPayload(req.body), {
      new: true,
      runValidators: true,
    });
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, message: 'Blog updated', data: blog });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.json({ success: true, message: 'Blog deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
