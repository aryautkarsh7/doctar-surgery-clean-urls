const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const bookingRoutes = require('./routes/booking');
const dataRoutes = require('./routes/data');
const doctorsRouter = require('./routes/doctors');
const videoRoutes = require('./routes/videos');
const blogRoutes = require('./routes/blogs');
const uploadRoutes = require('./routes/upload');
const { verifyMailer } = require('./utils/mailer');

const DoctorClaim = require('./models/DoctorClaim');
const resourceRouter = require('./routes/resource');

const Hospital = require('./models/Hospital');
const Doctor = require('./models/Doctor');
const Category = require('./models/Category');
const Treatment = require('./models/Treatment');

// Connect to the database
connectDB();

// Verify the email transporter config
verifyMailer();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// Routes
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', require('./routes/categories'));
app.use('/api/treatments', require('./routes/treatments'));
app.use('/api/doctors', doctorsRouter);
app.use('/api/hospitals', require('./routes/hospitals'));
app.use('/api/blogs', blogRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/faqs', require('./routes/faqs'));
app.use('/api/subcategories', require('./routes/subCategories'));
app.use('/api/subsubcategories', require('./routes/subSubCategories'));
app.use('/api/doctor-claims', resourceRouter(DoctorClaim, 'DoctorClaim'));
app.use('/api/pet-hospitals', require('./routes/petHospitals'));
app.use('/api/data', dataRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded images (WebP/AVIF) at /uploads/<file>
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Admin panel (static HTML)
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// Dedicated fullscreen video manager
app.get('/video-manager', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'video-manager.html'));
});

// Block access to sensitive server-side folders/files
app.use((req, res, next) => {
  const normalizedPath = req.path.toLowerCase();
  if (
    normalizedPath.startsWith('/backend') ||
    normalizedPath.startsWith('/.') ||
    normalizedPath.includes('package')
  ) {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }
  next();
});

// Serve frontend static files from the parent directory
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.use(express.static(path.join(__dirname, '../')));
} else {
  app.use(express.static(path.join(__dirname, '../')));
}

// ==========================================
// SEO ROUTES (Robots.txt & Sitemap)
// ==========================================

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://surgery.doctar.in/sitemap-index.xml`);
});

app.get('/sitemap-index.xml', async (req, res) => {
  const baseUrl = 'https://surgery.doctar.in';
  const today = new Date().toISOString().split('T')[0];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

  res.header('Content-Type', 'application/xml');
  res.send(xml);
});

app.get('/sitemap.xml', async (req, res) => {
  try {
    const baseUrl = 'https://surgery.doctar.in';
    
    const [hospitals, doctors, categories, treatments] = 
      await Promise.all([
        Hospital.find({}).select('slug city locality'),
        Doctor.find({}).select('slug categories'),
        Category.find({}).select('slug'),
        Treatment.find({}).select('slug')
      ]);

    const urls = [];

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/specialities/s', priority: '0.9', changefreq: 'weekly' },
      { url: '/surgeons-near-me/s', priority: '0.8', changefreq: 'daily' },
    ];

    // City pages from hospitals
    const cities = [...new Set(hospitals.map(h => h.city).filter(Boolean))];
    cities.forEach(city => {
      const citySlug = city.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      staticPages.push(
        { url: `/hospitals-in-${citySlug}/s`, priority: '0.8', changefreq: 'daily' },
        { url: `/surgeries-in-${citySlug}/s`, priority: '0.7', changefreq: 'weekly' },
        { url: `/surgeons-in-${citySlug}/s`, priority: '0.8', changefreq: 'daily' }
      );
    });

    staticPages.forEach(page => {
      urls.push(`
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
    });

    // Category pages
    categories.forEach(cat => {
      urls.push(`
  <url>
    <loc>${baseUrl}/specialities/${cat.slug}/s</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
    });

    // Treatment pages
    treatments.forEach(t => {
      urls.push(`
  <url>
    <loc>${baseUrl}/treatment/${t.slug}/s</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
    });

    // Hospital pages
    hospitals.forEach(h => {
      const area = (h.locality || h.city || 'india')
        .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      const city = (h.city || 'india')
        .toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      urls.push(`
  <url>
    <loc>${baseUrl}/hospital/${h.slug}/${area}-${city}/s</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
    });

    // Doctor pages
    doctors.forEach(d => {
      const catSlug = (d.categories && d.categories[0]) || 'general';
      urls.push(`
  <url>
    <loc>${baseUrl}/surgeons/${catSlug}/${d.slug}/s</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
  </url>`);
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('')}
</urlset>`;

    res.header('Content-Type', 'application/xml');
    res.send(xml);

  } catch(err) {
    res.status(500).send('Sitemap error: ' + err.message);
  }
});

// SPA catch-all: any non-API GET that didn't match a static file returns the
// app shell so clean URLs (e.g. /hospitals/s) work on direct load / refresh.
// (Express 5 dropped the bare '*' string route, so use a path-less middleware.)
app.use((req, res, next) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return next();
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '..', 'dist', 'index.html'));
  } else {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  }
});

// 404 fallback (unmatched API routes + non-GET)
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
