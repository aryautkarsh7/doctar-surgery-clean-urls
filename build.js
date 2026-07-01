const { minify } = require('terser');
const CleanCSS = require('clean-css');
const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

// Base module filenames (without extensions) in dependency load order
const modules = [
  'data',
  'utils/helpers',
  'utils/api',
  'components/sections',
  'components/footer-dynamic',
  'components/header',
  'components/booking-modal',
  'pages/blog',
  'pages/home',
  'pages/category',
  'pages/treatment',
  'pages/doctors',
  'pages/hospitals',
  'pages/search',
  'pages/pet',
  'pages/static',
  'main'
];

async function loadModuleSource(base) {
  const tsPath = base + '.ts';
  const jsPath = base + '.js';
  
  if (fs.existsSync(tsPath)) {
    const ts = fs.readFileSync(tsPath, 'utf8');
    // Transpile TypeScript code to JS without modules bundling/resolution
    const out = await esbuild.transform(ts, {
      loader: 'ts',
      target: 'es2020',
    });
    return out.code;
  }
  
  if (fs.existsSync(jsPath)) {
    return fs.readFileSync(jsPath, 'utf8');
  }
  
  throw new Error(`Source not found for module: ${base} (.ts or .js)`);
}

async function buildJS() {
  let combinedJS = '';
  for (const base of modules) {
    try {
      const code = await loadModuleSource(base);
      combinedJS += `\n/* --- ${base} --- */\n` + code;
    } catch (err) {
      console.error(`Error loading source for module ${base}:`, err.message);
      throw err;
    }
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

  // Copy the service worker verbatim
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

  // Copy home screen section directory to dist
  if (fs.existsSync('home screen section')) {
    fs.cpSync('home screen section', 'dist/home screen section', { recursive: true });
    console.log('Copied: home screen section/');
  }

  console.log('Build complete!');
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
