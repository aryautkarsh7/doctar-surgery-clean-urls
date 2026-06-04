const fs = require('fs');

function createMockElement() {
  const el = {
    innerHTML: '',
    textContent: '',
    style: {},
    classList: {
      add: () => {},
      remove: () => {},
      toggle: () => {},
      contains: () => false
    },
    setAttribute: () => {},
    addEventListener: () => {}
  };
  el.querySelector = () => createMockElement();
  el.querySelectorAll = () => [];
  el.closest = () => createMockElement();
  return el;
}

// Mock browser globals
global.window = {
  addEventListener: () => {},
  scrollTo: () => {},
  location: { hash: '' }
};
global.document = {
  addEventListener: (event, callback) => {
    if (event === 'DOMContentLoaded') {
      setTimeout(callback, 10);
    }
  },
  getElementById: (id) => createMockElement(),
  querySelector: (selector) => createMockElement(),
  querySelectorAll: (selector) => []
};
global.IntersectionObserver = class {
  constructor(callback) { this.callback = callback; }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Load data.js into global scope
let dataJs = fs.readFileSync('data.js', 'utf8');
dataJs = dataJs.replace(/const\s+(CATEGORIES|TREATMENTS|DOCTORS|HOSPITALS|SITE_CONFIG)\s*=/g, 'global.$1 =');
eval(dataJs);

// Load app.js into global scope
const appJs = fs.readFileSync('app.js', 'utf8');
eval(appJs);

console.log("Scripts loaded and executed. If no error, DOMContentLoaded hasn't thrown yet.");

setTimeout(() => {
  console.log("DOMContentLoaded executed. Test complete.");
}, 100);
