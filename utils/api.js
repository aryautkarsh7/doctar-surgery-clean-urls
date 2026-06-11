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

  function formatBlogDate(raw) {
    if (!raw) return '';
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Simple in‑memory cache for API GET requests
  const apiCache = new Map();
  async function cachedFetch(url) {
    if (apiCache.has(url)) return apiCache.get(url);
    const res = await fetch(url);
    const json = await res.json();
    apiCache.set(url, json);
    return json;
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
      const res = await fetch('/api/videos?page=' + encodeURIComponent(pageKey));
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
    (window.location.protocol === 'file:' ||
      ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3001')
      ? 'http://localhost:3001'
      : window.location.origin);

  async function loadRemoteData() {
    try {
      const res = await fetch(API_BASE + '/api/data/all', { cache: 'no-store' });
      if (!res.ok) throw new Error('bad status ' + res.status);
      const json = await res.json();
      const d = (json && json.data) || {};

      // Mutate the existing globals in place (they are const arrays/objects).
      if (Array.isArray(d.categories) && d.categories.length) {
        CATEGORIES.length = 0;
        CATEGORIES.push(...d.categories);
      }
      if (d.treatments && Object.keys(d.treatments).length) {
        Object.keys(TREATMENTS).forEach(k => delete TREATMENTS[k]);
        Object.assign(TREATMENTS, d.treatments);
      }
      if (Array.isArray(d.doctors) && d.doctors.length) {
        DOCTORS.length = 0;
        DOCTORS.push(...d.doctors);
        console.log('/api/data/all first doctor from API:', d.doctors[0]);
      }
      if (Array.isArray(d.hospitals) && d.hospitals.length) {
        HOSPITALS.length = 0;
        HOSPITALS.push(...d.hospitals);
      }
      if (Array.isArray(d.subcategories)) {
        SUBCATEGORIES = d.subcategories;
      }
      if (Array.isArray(d.subsubcategories)) {
        SUBSUBCATEGORIES = d.subsubcategories;
      }
      if (Array.isArray(d.pethospitals)) {
        PET_HOSPITALS = d.pethospitals;
      }
      if (Array.isArray(d.hospitals) && d.hospitals.length) {
        const _cityBlocklist = /near |opposite |taluk|kachh| patti |naini |mahewa|mirakhpur|mubark|daiwghat|dadanpur|burhanagar|jhusi|karuvatta|kattanam|kollakadavu|kulanada|kumarapuram|malayambakkam|mannanchery|ashoka circle/i;
        AVAILABLE_CITIES = [...new Set(
          d.hospitals
            .map(h => (h.city || '').trim())
            .filter(c =>
              c.length > 0 &&
              c.length <= 30 &&               // skip full-address values
              !/^\d/.test(c) &&               // skip entries starting with a number
              !/[,/\\]/.test(c) &&            // skip entries with address punctuation
              !/\d{4,}/.test(c) &&            // skip entries containing pin codes
              c.split(/\s+/).length <= 3 &&   // real city names are ≤ 3 words
              !_cityBlocklist.test(c)          // skip known dirty values
            )
            .map(c => c.charAt(0).toUpperCase() + c.slice(1))  // normalise capitalisation
        )].sort();
      }
      console.log('✅ Loaded live data from backend');
    } catch (err) {
      console.warn('⚠️ Using bundled data.js (backend unavailable):', err.message);
    }
  }

  // =====================================================
  // DOCTOR CLAIM MODAL
