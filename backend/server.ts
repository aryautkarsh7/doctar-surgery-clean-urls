import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import path from 'path';

// Load .env from the backend root (one level up from dist-server)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import connectDB from './config/db';
import bookingRoutes from './routes/booking';
import dataRoutes from './routes/data';
import doctorsRouter from './routes/doctors';
import videoRoutes from './routes/videos';
import blogRoutes from './routes/blogs';
import uploadRoutes from './routes/upload';
import { verifyMailer } from './utils/mailer';

import DoctorClaim from './models/DoctorClaim';
import resourceRouter from './routes/resource';

import Hospital from './models/Hospital';
import Doctor from './models/Doctor';
import Category from './models/Category';
import Treatment from './models/Treatment';

// Connect to the database
connectDB();

// Verify the email transporter config
verifyMailer();

const app = express();
const PORT = process.env.PORT || 3001;

// Simple in-memory cache middleware
const _cache: Record<string, { data: any; time: number }> = {};
function cacheMiddleware(duration: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    const key = req.url;
    if (_cache[key] && Date.now() - _cache[key].time < duration) {
      res.json(_cache[key].data);
      return;
    }
    const origJson = res.json.bind(res);
    res.json = (data: any) => {
      _cache[key] = { data, time: Date.now() };
      return origJson(data);
    };
    next();
  };
}

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// Routes
app.use('/api/data/critical', cacheMiddleware(10 * 60 * 1000));  // 10 min
app.use('/api/data/city',     cacheMiddleware(5  * 60 * 1000));  // 5 min
app.use('/api/categories',    cacheMiddleware(10 * 60 * 1000));  // 10 min
app.use('/api/bookings', bookingRoutes);

import categoriesRoute from './routes/categories';
app.use('/api/categories', categoriesRoute);

import treatmentsRoute from './routes/treatments';
app.use('/api/treatments', treatmentsRoute);

app.use('/api/doctors', doctorsRouter);

import hospitalsRoute from './routes/hospitals';
app.use('/api/hospitals', hospitalsRoute);

app.use('/api/blogs', blogRoutes);
app.use('/api/videos', videoRoutes);

import reviewsRoute from './routes/reviews';
app.use('/api/reviews', reviewsRoute);

import faqsRoute from './routes/faqs';
app.use('/api/faqs', faqsRoute);

import subCategoriesRoute from './routes/subCategories';
app.use('/api/subcategories', subCategoriesRoute);

import subSubCategoriesRoute from './routes/subSubCategories';
app.use('/api/subsubcategories', subSubCategoriesRoute);

app.use('/api/doctor-claims', resourceRouter(DoctorClaim, 'DoctorClaim'));

import petHospitalsRoute from './routes/petHospitals';
app.use('/api/pet-hospitals', petHospitalsRoute);

app.use('/api/data', dataRoutes);
app.use('/api/upload', uploadRoutes);

// Serve uploaded images (WebP/AVIF) at /uploads/<file>
// Adjusted path: __dirname is dist-server, so public is at ../public
app.use('/uploads', express.static(path.join(__dirname, '../public', 'uploads')));

// Admin panel (static HTML)
app.get('/admin', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public', 'admin.html'));
});

// Dedicated fullscreen video manager
app.get('/video-manager', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../public', 'video-manager.html'));
});

// Block access to sensitive server-side folders/files
app.use((req: Request, res: Response, next: NextFunction) => {
  const normalizedPath = req.path.toLowerCase();
  if (
    normalizedPath.startsWith('/backend') ||
    normalizedPath.startsWith('/.') ||
    normalizedPath.includes('package')
  ) {
    res.status(403).json({ success: false, message: 'Access denied' });
    return;
  }
  next();
});

// Serve frontend static files from the parent directory
// Since __dirname is backend/dist-server, we need to go up two levels to reach the root project
const projectRoot = path.join(__dirname, '../../');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(projectRoot, 'dist')));
  app.use(express.static(projectRoot));
} else {
  app.use(express.static(projectRoot));
}

// ==========================================
// SEO ROUTES (Robots.txt & Sitemap)
// ==========================================

app.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: https://surgery.doctar.in/sitemap-index.xml`);
});

app.get('/sitemap-index.xml', async (req: Request, res: Response) => {
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

app.get('/sitemap.xml', async (req: Request, res: Response) => {
  try {
    const baseUrl = 'https://surgery.doctar.in';
    
    const [hospitals, doctors, categories, treatments] = 
      await Promise.all([
        Hospital.find({}).select('slug city locality'),
        Doctor.find({}).select('slug categories'),
        Category.find({}).select('slug'),
        Treatment.find({}).select('slug')
      ]);

    const urls: string[] = [];

    // Static pages
    const staticPages = [
      { url: '/', priority: '1.0', changefreq: 'daily' },
      { url: '/specialities/s', priority: '0.9', changefreq: 'weekly' },
      { url: '/surgeons-near-me/s', priority: '0.8', changefreq: 'daily' },
    ];

    // City pages from hospitals
    const cities = [...new Set(hospitals.map(h => h.city).filter(Boolean))];
    cities.forEach(city => {
      const citySlug = (city as string).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
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

  } catch(err: any) {
    res.status(500).send('Sitemap error: ' + err.message);
  }
});

// SPA catch-all: any non-API GET that didn't match a static file returns the
// app shell so clean URLs (e.g. /hospitals/s) work on direct load / refresh.
// (Express 5 dropped the bare '*' string route, so use a path-less middleware.)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) {
    next();
    return;
  }
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(projectRoot, 'dist', 'index.html'));
  } else {
    res.sendFile(path.join(projectRoot, 'index.html'));
  }
});

// 404 fallback (unmatched API routes + non-GET)
app.use((req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
