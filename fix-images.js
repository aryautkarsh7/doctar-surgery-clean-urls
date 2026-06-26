const fs = require('fs');
const path = require('path');

const HOSPITALS_DIR = path.join(__dirname, 'data/hospitals');

// 5 High-quality royalty-free hospital stock photos
const STOCK_IMAGES = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&q=80',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800&q=80',
  'https://images.unsplash.com/photo-1551076805-e1869043e560?w=800&q=80',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?w=800&q=80',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800&q=80'
];

let updatedCount = 0;

fs.readdirSync(HOSPITALS_DIR).forEach(file => {
  if (!file.endsWith('.json')) return;
  const filePath = path.join(HOSPITALS_DIR, file);
  let data;
  try {
    data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return;
  }
  
  let modified = false;
  if (Array.isArray(data)) {
    data.forEach((hospital, index) => {
      // If the image is a Google Maps link, replace it with a real image
      if (hospital.image && hospital.image.includes('google.com/maps')) {
        hospital.map_url = hospital.image; // Keep the map URL safe
        hospital.image = STOCK_IMAGES[index % STOCK_IMAGES.length];
        modified = true;
      }
    });
  }
  
  if (modified) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    updatedCount++;
  }
});

console.log(`Successfully assigned beautiful stock images to ${updatedCount} cities!`);
