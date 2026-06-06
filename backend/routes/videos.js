const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// GET /api/videos?page=home|doctor-slug|category-slug
// Returns videos that match showOn: ['all'] OR showOn includes the page value.
router.get('/', async (req, res) => {
  try {
    const { page } = req.query;
    let filter = {};
    if (page) {
      // Include videos that are set to 'all' OR explicitly include this page
      filter = { showOn: { $in: ['all', page] } };
    }
    const videos = await Video.find(filter).sort({ order: 1, createdAt: -1 });
    res.json({ success: true, total: videos.length, data: videos });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/videos/:id
router.get('/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, data: video });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/videos
router.post('/', async (req, res) => {
  try {
    const video = await Video.create(req.body);
    res.status(201).json({ success: true, message: 'Video created', data: video });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/videos/:id
router.put('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, message: 'Video updated', data: video });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/videos/:id
router.delete('/:id', async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ success: false, message: 'Video not found' });
    res.json({ success: true, message: 'Video deleted' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
