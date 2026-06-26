const { minify } = require('terser');
const CleanCSS = require('clean-css');
const fs = require('fs');
const path = require('path');

// Correct order of scripts as loaded in index.html
const jsFiles = [
  'data.js',
  'utils/helpers.js',
  'utils/api.js',
  'components/sections.js',
  'components/footer-dynamic.js',
  'components/header.js',
  'components/booking-modal.js',
  'pages/blog.js',
  'pages/home.js',
  'pages/category.js',
  'pages/treatment.js',
  'pages/doctors.js',
  'pages/hospitals.js',
  'pages/search.js',
  'pages/pet.js',
  'pages/static.js',
  'main.js'
];

async function buildJS() {
  let combinedJS = '';
  for(const file of jsFiles) {
    const src = fs.readFileSync(file, 'utf8');
    combinedJS += `\n/* --- ${file} --- */\n` + src;
  }
  const result = await minify(combinedJS, { compress: true, mangle: true });
  fs.mkdirSync('dist', { recursive: true });
  fs.writeFileSync(path.join('dist', 'bundle.js'), result.code);
  console.log('Bundled and minified into bundle.js');
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
  
  // Copy index.html to dist, update script paths to use bundle.js
  let html = fs.readFileSync('index.html', 'utf8');
  
  // Remove all the individual script tags for our app
  const scriptsRegex = /<!-- Data layer[\s\S]*?main\.js\?v=[^>]+><\/script>/;
  html = html.replace(scriptsRegex, '<!-- App Bundle -->\n  <script defer src="bundle.js"></script>');
  
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

  // Copy data directory to dist so JSON files are served
  if (fs.existsSync('data')) {
    fs.cpSync('data', 'dist/data', { recursive: true });
    console.log('Copied: data/');
  }

  console.log('Build complete!');
}

build().catch(console.error);
