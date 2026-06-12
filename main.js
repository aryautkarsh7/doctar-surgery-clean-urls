// =====================================================
// DOCTAR Surgery Website — Router / App Entry
// Clean-URL routing via the History API (no hash routing).
// Loaded LAST as a classic <script defer>; shares global scope with
// data.js and every module in utils/ pages/ components/.
// =====================================================

// Shared container reference used by every page renderer.
const appContainer = document.getElementById('app');

// -----------------------------------------------------
// Loading skeletons
// -----------------------------------------------------
function showSkeleton(type) {
  const appContainer = document.getElementById('app');
  const card = `<div class="sk-card">
    <div class="sk-img sk-box"></div>
    <div class="sk-line sk-box" style="width:70%"></div>
    <div class="sk-line sk-box" style="width:50%"></div>
    <div class="sk-line sk-box" style="width:40%"></div>
  </div>`;
  const skeletons = {
    list: `<div class="sk-wrapper"><div class="sk-list">
      ${Array(6).fill(card).join('')}
    </div></div>`,
    detail: `<div class="sk-wrapper"><div class="sk-detail">
      <div class="sk-hero sk-box"></div>
      <div class="sk-line sk-box" style="width:60%"></div>
      <div class="sk-line sk-box" style="width:80%"></div>
      <div class="sk-line sk-box" style="width:40%"></div>
      <div class="sk-line sk-box" style="width:90%"></div>
    </div></div>`,
    home: `<div class="sk-wrapper"><div class="sk-home">
      <div class="sk-hero sk-box"></div>
      <div class="sk-section">
        ${Array(4).fill(card).join('')}
      </div>
    </div></div>`
  };
  appContainer.innerHTML = skeletons[type] || skeletons.list;
}

// -----------------------------------------------------
// Navigation (History API)
// -----------------------------------------------------
// Programmatic navigation used by inline onclick handlers and search.
function navigate(path) {
  if (!path) return;
  const current = window.location.pathname + window.location.search;
  if (path !== current) window.history.pushState({}, '', path);
  handleRoute();
}
window.navigate = navigate;

// -----------------------------------------------------
// Route table — clean URLs (all end with the "/s" marker segment)
//   /                                                  -> home
//   /specialities/s                                    -> all categories
//   /specialities/:cat/s                               -> category page
//   /specialities/:cat/:sub/surgeons-in-:city/s        -> treatment / doctors-by-subcategory
//   /specialities/:cat/:sub/hospital-near-me/s         -> hospitals near me (by specialty)
//   /specialities/:cat/:sub/hospital-in-:location/s    -> hospitals near a specific area+city
//   /surgeons/:cat/s                                   -> doctors listing by category
//   /surgeons/:cat/:slug/s                             -> doctor profile
//   /surgeons-in-:city/s                               -> all doctors in a city
//   /surgeons-near-me/s                                -> surgeons near me (GPS)
//   /pet-surgery-near-me/s                             -> pet surgery (GPS)
//   /hospitals/s                                       -> all hospitals
//   /hospitals-in-:city/s                              -> hospitals in a city
//   /hospital/:slug/:area-city/s                       -> hospital detail
//   /surgeries-in-:city/s                              -> all procedures in a city
//   /pet-surgery-in-:city/s                            -> pet surgery
//   /pet-hospitals-in-:city/s                          -> pet hospitals (coming soon)
//   /procedures/s                                      -> all procedures
//   /blogs/s                                           -> all blogs
//   /blog/:slug/s                                      -> blog post
//   /search/:query/s                                   -> search
// -----------------------------------------------------
function handleRoute() {
  try {
    appContainer.innerHTML = '';
    window.scrollTo(0, 0);

    const seg = window.location.pathname.split('/').filter(Boolean);
    // Drop the trailing "/s" marker segment if present.
    if (seg.length && seg[seg.length - 1] === 's') seg.pop();

    if (seg.length === 0) return renderHomePage();

    const a = seg[0], b = seg[1], c = seg[2];

    // Prefix routes (the trailing token carries the city/area):
    if (a === 'surgeons-near-me')      return renderSurgeonsNearMe();
    if (a === 'pet-surgery-near-me')   return renderPetSurgery();
    if (a.startsWith('surgeons-in-'))  return renderAllDoctorsPage();                 // all doctors in a city
    if (a.startsWith('surgeries-in-')) return renderAllProceduresPage(cityFromSlug(a.slice('surgeries-in-'.length)));
    if (a.startsWith('hospitals-in-')) return renderAllHospitalsPage(null, cityFromSlug(a.slice('hospitals-in-'.length)));
    if (a.startsWith('pet-surgery-in-'))   return renderPetSurgery(cityFromSlug(a.slice('pet-surgery-in-'.length)));
    if (a.startsWith('pet-hospitals-in-')) return renderPetHospitals(cityFromSlug(a.slice('pet-hospitals-in-'.length)));

    switch (a) {
      case 'specialities':
        // /specialities/s -> all categories
        if (seg.length === 1) return renderAllCategoriesPage();
        // /specialities/:cat/s -> category page
        if (seg.length === 2) return renderCategoryPage(b);
        // /specialities/:cat/:sub/hospital-near-me/s -> hospitals near me (by specialty)
        if (seg[3] === 'hospital-near-me') return renderHospitalsNearMe(b, c);
        // /specialities/:cat/:sub/hospital-in-:location/s -> hospitals near a specific area+city
        if (seg[3] && seg[3].startsWith('hospital-in-')) return renderHospitalsNearMe(b, c, seg[3].slice('hospital-in-'.length));
        // /specialities/:cat/:sub/surgeons-in-:city/s -> treatment / doctors-by-subcategory
        return renderTreatmentPage(c);

      case 'surgeons':
        // /surgeons/:cat/:slug/s -> profile ; /surgeons/:cat/s -> listing
        return seg.length >= 3 ? renderDoctorProfilePage(c) : renderDoctorsListingPage(b);

      case 'hospitals':           return renderAllHospitalsPage();
      case 'hospital':            return renderHospitalDetailPage(b); // :area-city segment is decorative
      case 'procedures':          return renderAllProceduresPage();
      case 'blogs':               return renderBlogsPage();
      case 'blog':                return renderBlogPage(b);
      case 'search':              return renderSearchPage(decodeURIComponent(b || ''));

      // Back-compat: old single-segment treatment links.
      case 'treatment':           return renderTreatmentPage(b);

      default:
        // Unknown -> home.
        return renderHomePage();
    }
  } catch (err) {
    console.error('Routing error:', err);
  }
}

function initRouter() {
  // Don't block first paint on blog data — each page that needs blogs fetches
  // them itself (fetchBlogsForPage). Prime the shared fallback in the background.
  loadBlogPosts().catch(() => {});
  window.addEventListener('popstate', handleRoute);
  handleRoute();
}

// -----------------------------------------------------
// Delegated link interception — turns same-origin <a href="/..."> clicks
// into History-API navigations instead of full page reloads.
// -----------------------------------------------------
function setupLinkInterception() {
  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const anchor = e.target.closest && e.target.closest('a');
    if (!anchor) return;
    const href = anchor.getAttribute('href');
    if (!href || !href.startsWith('/') || href.startsWith('//')) return; // internal paths only
    if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;
    e.preventDefault();
    navigate(href);
  });
}

// -----------------------------------------------------
// Real-location priming (GPS -> area+city slug, cached for the session).
// Kicked off once at boot. When a more specific location than the selected
// city resolves, re-render the current route so already-rendered "surgeons-in-"
// links (and the address bar) pick up the real location.
// -----------------------------------------------------
let _locationPrimed = false;
function primeUserLocation() {
  if (_locationPrimed) return;
  _locationPrimed = true;
  const fallback = cityToSlug(getCurrentCity());
  getUserLocationSlug()
    .then((slug) => {
      if (slug && slug !== fallback) handleRoute();
    })
    .catch(() => {});
}

// -----------------------------------------------------
// Boot
// -----------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  try {
    initCitySelector();
    initHeaderSearch();
    setupLinkInterception();
    primeUserLocation();
    loadRemoteData().finally(initRouter);
  } catch (err) {
    console.error('Initialization error:', err);
  }
});
