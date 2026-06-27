// =====================================================
// API / DATA FETCHING
// Blog/video fetch, API base, remote data loader.
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================

  // =====================================================
  // BLOG POSTS DATA (fetched from API, fallback to defaults)
  // =====================================================
  const BLOG_POSTS_FALLBACK = [
    {
      title: 'Thyroglossal Duct Cyst Excision Surgery in Deoghar',
      slug: 'thyroglossal-duct-cyst-excision-surgery-in-deoghar',
      category: 'Surgery',
      createdAt: '2026-06-03',
      thumbnail: 'images/service-general.png',
      excerpt: 'Learn about thyroglossal duct cyst excision surgery, a common procedure to remove cysts at the base of the tongue.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Excision of Branchial Cyst Surgery & Treatment in Deoghar',
      slug: 'excision-of-branchial-cyst-surgery-treatment-in-deoghar',
      category: 'Cyst Surgery',
      createdAt: '2026-06-04',
      thumbnail: 'images/service-cardiac.png',
      excerpt: 'Comprehensive guide to branchial cyst excision — what to expect before, during, and after surgery.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Best Mental Health Doctor Near Me in Kolkata for Expert Care',
      slug: 'best-mental-health-doctor-near-me-in-kolkata',
      category: 'Doctors & Specialists',
      createdAt: '2026-05-29',
      thumbnail: 'images/about-surgery.png',
      excerpt: 'Find the best mental health specialists in Kolkata. Expert guidance on choosing the right psychiatrist or psychologist.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Understanding Knee Replacement Surgery: A Complete Guide',
      slug: 'understanding-knee-replacement-surgery',
      category: 'Orthopedics',
      createdAt: '2026-05-25',
      thumbnail: 'images/service-neuro.png',
      excerpt: 'Everything you need to know about knee replacement — indications, procedure, recovery timeline, and costs in India.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Laparoscopic Gallbladder Surgery: Benefits & Recovery',
      slug: 'laparoscopic-gallbladder-surgery-benefits',
      category: 'General Surgery',
      createdAt: '2026-05-22',
      thumbnail: 'images/service-general.png',
      excerpt: 'Laparoscopic cholecystectomy is the gold standard for gallstone treatment. Here is what the recovery looks like.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Cataract Surgery Cost & Recovery Time in India',
      slug: 'cataract-surgery-cost-recovery-india',
      category: 'Ophthalmology',
      createdAt: '2026-05-18',
      thumbnail: 'images/service-cardiac.png',
      excerpt: 'A detailed breakdown of cataract surgery costs, lens options, and what the recovery period looks like in India.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Piles Treatment Without Surgery: Modern Laser Options',
      slug: 'piles-treatment-without-surgery-laser',
      category: 'Proctology',
      createdAt: '2026-05-15',
      thumbnail: 'images/about-surgery.png',
      excerpt: 'Modern laser treatment for piles (haemorrhoids) offers a painless, day-care alternative to traditional surgery.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Heart Bypass Surgery: When Is It Necessary?',
      slug: 'heart-bypass-surgery-when-necessary',
      category: 'Cardiology',
      createdAt: '2026-05-10',
      thumbnail: 'images/service-neuro.png',
      excerpt: 'Understand what coronary artery bypass grafting (CABG) is, when it is recommended, and what recovery involves.',
      author: 'Doctar Editorial',
    }
  ];

  let BLOG_POSTS = [...BLOG_POSTS_FALLBACK];
  let VIDEOS = [];
  let SUBCATEGORIES = window.STATIC_SUBCATEGORIES || [];
  let SUBSUBCATEGORIES = [];
  let PET_HOSPITALS = [];
  let AVAILABLE_CITIES = ['Kolkata'];
  let CITIES = []; // full city directory from MongoDB (name/slug/state/lat/lng)

  function formatBlogDate(raw) {
    if (!raw) return '';
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // In-memory cache for API GET requests.
  // Stores the Promise itself so concurrent callers share one in-flight request
  // instead of each firing their own fetch (race condition / duplicate network calls).
  const apiCache = new Map();
  async function cachedFetch(url) {
    if (apiCache.has(url)) return apiCache.get(url);
    const promise = fetch(url).then(res => res.json()).catch(err => {
      apiCache.delete(url); // evict on failure so callers can retry
      throw err;
    });
    apiCache.set(url, promise);
    return promise;
  }

  // Fetch blog posts from the API; updates BLOG_POSTS in-place
  async function loadBlogPosts() {
    try {
      const json = await cachedFetch('/api/blogs?page=home');
      if (json.data && json.data.length > 0) {
        const published = json.data.filter(b => b.published !== false);
        if (published.length > 0) BLOG_POSTS = published;
      }
    } catch (e) {
      console.log('Blog API unavailable, using fallback data');
    }
  }

  async function fetchBlogsForPage(pageKey) {
    try {
      const json = await cachedFetch('/api/blogs?page=' + encodeURIComponent(pageKey));
      const blogs = (json.data || []).filter(b => b.published !== false);
      return blogs.length ? blogs : BLOG_POSTS;
    } catch (e) {
      return BLOG_POSTS;
    }
  }

  // Fetch videos for a specific page context.
  // pageKey: 'home' | 'doctor-[slug]' | 'category-[slug]'
  async function fetchVideosForPage(pageKey) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      const res = await fetch('/api/videos?page=' + encodeURIComponent(pageKey), { signal: controller.signal });
      clearTimeout(timeout);
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      return [];
    }
  }

  // Derive YouTube embed URL from a watch/shorts URL
  function getYouTubeEmbedUrl(url) {
    let id = '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        id = u.pathname.slice(1);
      } else {
        id = u.searchParams.get('v') || u.pathname.split('/').pop();
      }
    } catch (e) { id = ''; }
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&modestbranding=1&rel=0&showinfo=0&playsinline=1&controls=1` : '';
  }


  // =====================================================
  const API_BASE = window.DOCTAR_API_BASE || 
    (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
      ? 'http://localhost:3001' 
      : 'https://doctar-subdomain-backend-production.up.railway.app');
  window.API_BASE = API_BASE;

  // Session-level cache so repeat callers (boot, header search, city modal…)
  // share ONE network request instead of each re-fetching the full payload.
  let _dataLoaded = false;
  let _dataLoadPromise = null;

  async function loadRemoteData() {
    if (_dataLoaded) return;              // already loaded this session
    if (_dataLoadPromise) return _dataLoadPromise; // in-flight — dedupe
    _dataLoadPromise = _doLoadRemoteData().then(() => {
      _dataLoaded = true;
    }).catch((err) => {
      // Allow a later retry if this attempt failed (e.g. backend was down).
      _dataLoadPromise = null;
      throw err;
    });
    return _dataLoadPromise;
  }

  function loadScriptData(url, varName) {
    return new Promise((resolve) => {
      window[varName] = null;
      const script = document.createElement('script');
      
      const timeout = setTimeout(() => {
        script.onload = null;
        script.onerror = null;
        script.remove();
        resolve(null);
      }, 5000);

      script.src = window.location.protocol === 'file:' ? url : url + '?v=' + Date.now();
      
      script.onload = () => {
        clearTimeout(timeout);
        const data = window[varName];
        window[varName] = null;
        script.remove();
        resolve(data);
      };
      script.onerror = () => {
        clearTimeout(timeout);
        script.remove();
        resolve(null);
      };
      document.head.appendChild(script);
    });
  }

  async function _doLoadRemoteData() {
    try {
      const city = getCurrentCity();

      // Fetch critical data + city data in parallel so the page renders ONCE with full data.
      // Sequential fetching caused a double-render flicker (skeleton → empty → full).
      
      const controller = new AbortController();
      const fetchTimeout = setTimeout(() => controller.abort(), 3000);

      const [res1, res2] = await Promise.all([
        fetch(API_BASE + '/api/data/critical', { cache: 'no-store', signal: controller.signal })
          .then(res => { clearTimeout(fetchTimeout); return res; })
          .catch(() => { clearTimeout(fetchTimeout); return null; }),
        fetch(API_BASE + '/api/data/city?city=' + encodeURIComponent(city), { cache: 'no-store', signal: controller.signal })
          .then(res => { clearTimeout(fetchTimeout); return res; })
          .catch(() => { clearTimeout(fetchTimeout); return null; }),
      ]);

      // Apply critical data (categories, treatments, subcategories, cities list)
      if (res1 && res1.ok) {

        try {
          const json1 = await res1.json();
          const d1 = (json1 && json1.data) || {};
          if (Array.isArray(d1.categories) && d1.categories.length) {
            CATEGORIES.length = 0;
            CATEGORIES.push(...d1.categories);
          }
          if (d1.treatments && Object.keys(d1.treatments).length) {
            Object.keys(TREATMENTS).forEach(k => delete TREATMENTS[k]);
            Object.assign(TREATMENTS, d1.treatments);
          }
          if (Array.isArray(d1.subcategories)) SUBCATEGORIES = d1.subcategories;
          if (Array.isArray(d1.subsubcategories)) SUBSUBCATEGORIES = d1.subsubcategories;
          if (Array.isArray(d1.availableCities) && d1.availableCities.length) {
            AVAILABLE_CITIES = d1.availableCities;
          }
          if (Array.isArray(d1.cities)) {
            CITIES = d1.cities;
          }
          if (Array.isArray(d1.blogs) && d1.blogs.length) {
            BLOG_POSTS = d1.blogs.filter(b => b.published !== false);
          }
          if (Array.isArray(d1.videos)) {
            VIDEOS = d1.videos;
          }
        } catch(e) { console.warn('Failed to parse critical JSON', e); }
      }

      // Apply city-specific data (doctors and hospitals)
      if (res2 && res2.ok) {
        try {
          const cityJson = await res2.json();
          const d2 = (cityJson && cityJson.data) || {};
          if (Array.isArray(d2.doctors)) {
            DOCTORS.length = 0;
            DOCTORS.push(...d2.doctors);
          }
          if (Array.isArray(d2.hospitals)) {
            HOSPITALS.length = 0;
            HOSPITALS.push(...d2.hospitals.map(h => ({ ...h, city: h.city || city })));
          }
        } catch(e) { console.warn('Failed to parse city JSON', e); }
      }

      console.log('✅ Remote data loaded for', city);
    } catch (err) {
      console.warn('⚠️ Using bundled data.js (backend unavailable):', err.message);
    }
  }

  // Load city-specific data and re-render — used only when the user switches city.
  async function _loadCityData(city) {
    try {
      const res = await fetch(API_BASE + '/api/data/city?city=' + encodeURIComponent(city), { cache: 'no-store' });
      if (res && res.ok) {
        try {
          const cityJson = await res.json();
          const d2 = (cityJson && cityJson.data) || {};
          if (Array.isArray(d2.doctors)) {
            DOCTORS.length = 0;
            DOCTORS.push(...d2.doctors);
          }
          if (Array.isArray(d2.hospitals)) {
            HOSPITALS.length = 0;
            HOSPITALS.push(...d2.hospitals.map(h => ({ ...h, city: h.city || city })));
          }
        } catch(e) { console.warn('Failed to parse city JSON', e); }
      }


      console.log('✅ City data reloaded for', city);
      if (typeof handleRoute === 'function') handleRoute();
    } catch (err) {
      console.warn('⚠️ Failed to reload city data:', err.message);
    }
  }

  // Exposed for city-selector to trigger a reload when the user switches city
  window.reloadCityData = _loadCityData;

  // =====================================================
  // DOCTOR CLAIM MODAL
