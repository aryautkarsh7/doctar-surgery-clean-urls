const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const router = express.Router();

// Where processed images are written. Served statically at /uploads.
const UPLOAD_DIR = path.join(__dirname, '..', 'public', 'uploads');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Keep the original bytes in memory; we only persist the converted versions.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB max input
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png'].includes(file.mimetype);
    cb(ok ? null : new Error('Only JPG and PNG files are allowed'), ok);
  },
});

// Build a unique, filesystem-safe base name from the original filename.
function buildBaseName(originalName) {
  const stem = path
    .basename(originalName, path.extname(originalName))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40) || 'image';
  const suffix = crypto.randomBytes(4).toString('hex');
  return `${stem}-${Date.now()}-${suffix}`;
}

// POST /api/upload  (multipart/form-data, field name: "image")
// Converts the uploaded JPG/PNG to WebP (+ AVIF when possible) and returns the URL.
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image file received' });
    }

    const base = buildBaseName(req.file.originalname);
    const pipeline = sharp(req.file.buffer).rotate(); // respect EXIF orientation

    // Cap very large images so the WebP/AVIF stays small (no upscaling).
    pipeline.resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true });

    // Primary format: WebP — the URL we hand back to the client.
    const webpName = `${base}.webp`;
    await pipeline
      .clone()
      .webp({ quality: 80, effort: 4 })
      .toFile(path.join(UPLOAD_DIR, webpName));

    // Best-effort AVIF for browsers that support it. Failure is non-fatal.
    let avifUrl = null;
    try {
      const avifName = `${base}.avif`;
      await pipeline
        .clone()
        .avif({ quality: 55, effort: 4 })
        .toFile(path.join(UPLOAD_DIR, avifName));
      avifUrl = `/uploads/${avifName}`;
    } catch (avifErr) {
      console.warn('AVIF conversion skipped:', avifErr.message);
    }

    res.json({
      success: true,
      url: `/uploads/${webpName}`,
      avif: avifUrl,
    });
  } catch (err) {
    console.error('Image upload failed:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
});

// Surface multer/file-filter errors as clean JSON.
router.use((err, req, res, next) => {
  if (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
  next();
});

module.exports = router;
