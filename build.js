const { minify } = require('terser');
const CleanCSS = require('clean-css');
const fs = require('fs');
const path = require('path');

// Minify all JS files in pages/, components/, utils/
const jsFiles = [
  'main.js',
  'data.js',
  'utils/api.js',
  'utils/helpers.js',
  'pages/home.js',
  'pages/hospitals.js',
  'pages/doctors.js',
  'pages/category.js',
  'pages/treatment.js',
  'pages/search.js',
  'pages/blog.js',
  'pages/pet.js',
  'pages/static.js',
  'components/header.js',
  'components/booking-modal.js',
  'components/footer-dynamic.js',
  'components/sections.js'
];

async function buildJS() {
  for(const file of jsFiles) {
    const src = fs.readFileSync(file, 'utf8');
    const result = await minify(src, { compress: true, mangle: true });
    const outDir = path.join('dist', path.dirname(file));
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(path.join('dist', file), result.code);
    console.log('Minified:', file);
  }
}

function buildCSS() {
  const src = fs.readFileSync('styles.css', 'utf8');
  const result = new CleanCSS({}).minify(src);
  fs.mkdirSync('dist', { recursive: true });
  fs.writeFileSync('dist/styles.css', result.styles);
  console.log('Minified: styles.css',
    Math.round(src.length/1024) + 'KB →',
    Math.round(result.styles.length/1024) + 'KB'
  );
}

async function build() {
  console.log('Building...');
  fs.mkdirSync('dist', { recursive: true });
  await buildJS();
  buildCSS();
  
  // Copy index.html to dist, update script paths
  let html = fs.readFileSync('index.html', 'utf8');
  fs.writeFileSync('dist/index.html', html);

  // Copy the service worker verbatim so dist (served first in production)
  // never ships a stale cache version behind the source.
  fs.copyFileSync('sw.js', 'dist/sw.js');
  console.log('Copied: sw.js');

  // Copy images directory to dist
  if (fs.existsSync('images')) {
    fs.cpSync('images', 'dist/images', { recursive: true });
    console.log('Copied: images/');
  }

  console.log('Build complete!');
}

build().catch(console.error);
