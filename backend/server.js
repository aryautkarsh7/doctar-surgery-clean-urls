const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const connectDB = require('./config/db');
const bookingRoutes = require('./routes/booking');
const dataRoutes = require('./routes/data');
const resourceRouter = require('./routes/resource');
const doctorsRouter = require('./routes/doctors');
const videoRoutes = require('./routes/videos');
const blogRoutes = require('./routes/blogs');
const uploadRoutes = require('./routes/upload');
const { verifyMailer } = require('./utils/mailer');

const Category = require('./models/Category');
const Treatment = require('./models/Treatment');
const Doctor = require('./models/Doctor');
const Hospital = require('./models/Hospital');
const Review = require('./models/Review');
const FAQ = require('./models/FAQ');
const SubCategory = require('./models/SubCategory');

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
app.use('/api/categories', resourceRouter(Category, 'Category'));
app.use('/api/treatments', resourceRouter(Treatment, 'Treatment'));
app.use('/api/doctors', doctorsRouter);
app.use('/api/hospitals', resourceRouter(Hospital, 'Hospital'));
app.use('/api/blogs', blogRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/reviews', resourceRouter(Review, 'Review'));
app.use('/api/faqs', resourceRouter(FAQ, 'FAQ'));
app.use('/api/subcategories', resourceRouter(SubCategory, 'SubCategory'));
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
app.use(express.static(path.join(__dirname, '..')));

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
