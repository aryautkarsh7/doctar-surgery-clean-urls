// =====================================================
// UTILITY HELPERS
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================

  // Render a category icon: PNG/WebP image when `iconImage` is set, otherwise the emoji.
  function catIcon(cat, px) {
    px = px || 28;
    if (cat && cat.iconImage) {
      return `<img src="${cat.iconImage}" alt="${(cat.name || '').replace(/"/g, '')}" style="width:${px}px;height:${px}px;object-fit:contain;display:inline-block;vertical-align:middle;">`;
    }
    return cat ? (cat.icon || '') : '';
  }

  function doctorAvatarHTML(doc, className) {
    const name = (doc && doc.name ? doc.name : 'Doctor').replace(/"/g, '');
    const img = doc && doc.image;
    let src = 'images/doctor-placeholder.svg';
    if (img) {
      if (img.startsWith('http')) {
        src = img;
      } else if (img.startsWith('images/') || img.startsWith('doctor_images_webp/')) {
        src = img.replace('doctor_images_webp/', 'images/doctors/');
      }
    }
    return `<img src="${src}" alt="${name}" class="${className} doctor-avatar-img">`;
  }

  function doctorImageUrl(rawUrl) {
    const url = String(rawUrl || '').trim();
    if (!url) return '';
    if (/^(https?:|data:|blob:)/i.test(url)) return url;
    if (url.startsWith('/uploads/')) return API_BASE.replace(/\/$/, '') + url;
    if (url.startsWith('uploads/')) return API_BASE.replace(/\/$/, '') + '/' + url;
    return url;
  }

  function getDoctorCity(doctor) {
    return (doctor.location || '').split(',').pop().trim();
  }

  function getAvailableDoctorCities() {
    return [...new Set(DOCTORS.map(getDoctorCity).filter(Boolean))];
  }

  function getDoctarProfileUrl(doc) {
    const city = (doc.location || '').split(',').pop().trim().toLowerCase().replace(/\s+/g, '-') || 'india';
    const namePart = doc.name.replace(/^Dr\.?\s*/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    const specPart = doc.specialty.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    const slug = `${namePart}-${specPart}-${city}`;
    return `https://doctar.in/doctors/${city}/${slug}`;
  }

  function getCurrentCity() {
    const availableCities = getAvailableDoctorCities();
    const candidates = [];

    try {
      const params = new URLSearchParams(window.location.search || '');
      candidates.push(params.get('city'));
    } catch (e) {
      // Ignore URL parsing issues and continue with DOM/config fallbacks.
    }

    try {
      candidates.push(localStorage.getItem('selectedCity'));
    } catch (e) {
      // localStorage can be unavailable in restricted browser contexts.
    }

    if (typeof document.querySelector === 'function') {
      const citySelector = document.querySelector('.city-selector');
      if (citySelector) candidates.push(citySelector.textContent);
    }

    candidates.push(SITE_CONFIG.city);

    for (const candidate of candidates) {
      if (!candidate) continue;
      const c = candidate.toLowerCase().trim();
      // Prefer exact match against CITY_DATA names so user selection is always honoured
      if (typeof CITY_DATA !== 'undefined') {
        const direct = CITY_DATA.find(cd => cd.name.toLowerCase() === c);
        if (direct) return direct.name;
      }
      // Honour an exact match against cities that have real hospital data
      // (the set offered by the city switcher), e.g. hospital-only cities
      // like "Agra" that aren't in CITY_DATA and have no listed doctors.
      if (typeof AVAILABLE_CITIES !== 'undefined') {
        const liveMatch = AVAILABLE_CITIES.find(name => name.toLowerCase() === c);
        if (liveMatch) return liveMatch;
      }
      // Fuzzy match against CITY_DATA (e.g. 'Bokaro Steel City' → 'Bokaro')
      if (typeof CITY_DATA !== 'undefined') {
        const fuzzyCD = CITY_DATA.find(cd => {
          const n = cd.name.toLowerCase();
          return n && (c.includes(n) || n.includes(c));
        });
        if (fuzzyCD) return fuzzyCD.name;
      }
      // Fuzzy match against AVAILABLE_CITIES
      if (typeof AVAILABLE_CITIES !== 'undefined') {
        const fuzzyAC = AVAILABLE_CITIES.find(name => {
          const n = name.toLowerCase();
          return c.includes(n) || n.includes(c);
        });
        if (fuzzyAC) return fuzzyAC;
      }
      // Fuzzy match against cities derived from doctor locations
      const matchedCity = availableCities.find(city =>
        c.includes(city.toLowerCase())
      );
      if (matchedCity) return matchedCity;
    }

    return availableCities[0] || 'India';
  }

  function getDoctorsForCity(city) {
    const cityDoctors = DOCTORS.filter(doc =>
      getDoctorCity(doc).toLowerCase() === city.toLowerCase()
    );

    return cityDoctors.length > 0 ? cityDoctors : DOCTORS;
  }

  function getHospitalsForCity(city) {
    // Hospitals are already loaded per-city from the hospital JSON file,
    // so all entries in HOSPITALS belong to the selected city/region.
    // No need to filter by exact city name (which excluded sub-localities
    // like "Bokaro Steel City", "Chas", etc.)
    return HOSPITALS.length > 0 ? HOSPITALS : [];
  }

  // =====================================================
  // CLEAN-URL BUILDERS
  // Single source of truth for the site's URL scheme so every page/component
  // produces identical links. See main.js handleRoute() for the parser.
  // =====================================================
  function slugify(str) {
    return String(str || '').toLowerCase().trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Slug for a city (defaults to the currently-selected city).
  function citySlug(city) {
    return slugify(city || getCurrentCity() || 'kolkata');
  }

  // Slug a "<area>-<city>" / city string for use in URLs (keeps hyphens).
  function cityToSlug(city) {
    return (city || 'kolkata')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }

  // Resolve the user's real area+city slug via GPS + reverse geocoding,
  // e.g. "jayanagar-bangalore" or "salt-lake-kolkata". Cached per session.
  // Falls back to the currently-selected city when GPS is denied/unavailable.
  async function getUserLocationSlug() {
    return new Promise((resolve) => {
      // Use the cached value for the rest of the session (no repeat GPS calls).
      let cached = null;
      try { cached = sessionStorage.getItem('userLocationSlug'); } catch (e) {}
      if (cached) return resolve(cached);

      if (!navigator.geolocation) {
        return resolve(cityToSlug(getCurrentCity()));
      }

      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json`,
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();
            const addr = (data && data.address) || {};
            const area = addr.suburb || addr.neighbourhood || addr.county || addr.locality || '';
            const city = addr.city || addr.town || addr.state_district || '';

            let slug = '';
            if (area && city) {
              slug = cityToSlug(area + '-' + city);
            } else if (city) {
              slug = cityToSlug(city);
            } else {
              slug = cityToSlug(getCurrentCity());
            }

            try { sessionStorage.setItem('userLocationSlug', slug); } catch (e) {}
            resolve(slug);
          } catch (e) {
            resolve(cityToSlug(getCurrentCity()));
          }
        },
        () => resolve(cityToSlug(getCurrentCity())),
        { timeout: 5000 }
      );
    });
  }

  // Synchronous accessor used by the URL builders: returns the cached GPS slug
  // if available, otherwise the selected-city slug. getUserLocationSlug() (kicked
  // off at boot) fills the cache so links pick up the real location.
  function currentLocationSlug() {
    try {
      const cached = sessionStorage.getItem('userLocationSlug');
      if (cached) return cached;
    } catch (e) {}
    return cityToSlug(getCurrentCity());
  }

  // Find which category a treatment slug belongs to (TREATMENTS is keyed by
  // category slug). Falls back to 'general' when unknown.
  function categorySlugForTreatment(treatmentSlug) {
    if (typeof TREATMENTS !== 'undefined' && TREATMENTS) {
      for (const catSlug in TREATMENTS) {
        if ((TREATMENTS[catSlug] || []).some(t => t.slug === treatmentSlug)) return catSlug;
      }
    }
    return 'general';
  }

  function urlAllCategories() { return '/specialities/s'; }
  function urlCategory(catSlug) { return `/specialities/${catSlug}/s`; }

  // Treatment / sub-category page: doctors for a sub-category at the user's
  // real area+city (from GPS), e.g. /specialities/proctology/piles-treatment/surgeons-in-salt-lake-kolkata/s
  function urlTreatment(subSlug, catSlug, city) {
    const cs = catSlug || categorySlugForTreatment(subSlug);
    const loc = city ? cityToSlug(city) : currentLocationSlug();
    return `/specialities/${cs}/${subSlug}/surgeons-in-${loc}/s`;
  }

  function urlDoctor(doc) {
    const cat = (doc && doc.categories && doc.categories[0]) || 'general';
    return `/surgeons/${cat}/${doc.slug}/s`;
  }
  function urlDoctorsByCat(catSlug) { return `/surgeons/${catSlug}/s`; }
  function urlAllDoctors(city) {
    const loc = city ? cityToSlug(city) : currentLocationSlug();
    return `/surgeons-in-${loc}/s`;
  }
  function urlSurgeonsNearMe() { return '/surgeons-near-me/s'; }
  function urlSurgeriesInCity(city) { return `/surgeries-in-${cityToSlug(city || getCurrentCity())}/s`; }
  function urlHospitalsInCity(city) { return `/hospitals-in-${cityToSlug(city || getCurrentCity())}/s`; }
  function urlPetSurgery(city) { return `/pet-surgery-in-${cityToSlug(city || getCurrentCity())}/s`; }
  function urlPetSurgeryNearMe() { return '/pet-surgery-near-me/s'; }
  function urlPetHospitals(city) { return `/pet-hospitals-in-${cityToSlug(city || getCurrentCity())}/s`; }

  // Resolve a city slug (e.g. "kolkata" or "salt-lake-kolkata") back to a known
  // city NAME for display/lookup. Falls back to the currently-selected city.
  function cityFromSlug(slug) {
    if (!slug) return getCurrentCity();
    const s = String(slug).toLowerCase();
    const names = ((typeof CITY_DATA !== 'undefined') ? CITY_DATA.map(c => c.name) : [])
      .concat(getAvailableDoctorCities());
    const hit = names.find(name => {
      const cs = cityToSlug(name);
      return cs === s || s.endsWith('-' + cs);
    });
    return hit || getCurrentCity();
  }

  // Link used by the homepage "Hospitals Near You" cards. Derives a category +
  // sub-category from a hospital's primary specialty:
  //   /specialities/{cat}/{sub}/hospital-near-me/s
  function hospitalNearMeUrl(hospital) {
    const specName = (hospital && hospital.specialties && hospital.specialties[0]) || 'General Surgery';
    let cat = (typeof findCategory === 'function') ? findCategory(slugify(specName)) : null;
    if (!cat && typeof CATEGORIES !== 'undefined') {
      cat = CATEGORIES.find(c => c.name.toLowerCase() === specName.toLowerCase());
    }
    const catSlug = cat ? cat.slug : 'laparoscopy';
    const subSlug = (typeof TREATMENTS !== 'undefined' && TREATMENTS[catSlug] && TREATMENTS[catSlug][0] && TREATMENTS[catSlug][0].slug) || catSlug;
    return `/specialities/${catSlug}/${subSlug}/hospital-near-me/s`;
  }

  // Hospital detail: /hospital/{slug}/{area}-{city}/s
  // Resolves area + city from the canonical HOSPITALS record so the link is
  // correct even when only a slug (or a partial object) is available.
  function urlHospital(hospitalOrSlug) {
    const slug = typeof hospitalOrSlug === 'string'
      ? hospitalOrSlug
      : (hospitalOrSlug && hospitalOrSlug.slug) || '';
    let full = (typeof HOSPITALS !== 'undefined') ? HOSPITALS.find(h => h.slug === slug) : null;
    if (!full && typeof hospitalOrSlug === 'object') full = hospitalOrSlug;
    full = full || {};
    // Area = locality (live data) > area > map label (only if it isn't the name).
    const mapLabel = (full.map && full.map.label && full.map.label !== full.name) ? full.map.label : '';
    const area = slugify(full.locality || full.area || mapLabel);
    const city = slugify(full.city || getCurrentCity() || 'kolkata');
    const tail = area ? `${area}-${city}` : city;
    return `/hospital/${slug}/${tail}/s`;
  }

  // =====================================================
  // SEO META TAGS UPDATER
  // =====================================================
  window.updatePageMeta = function({ title, description, keywords, image, url, robots }) {
    // Idempotent suffix: some callers (e.g. static pages) already include the
    // brand in their title — don't append it twice.
    const fullTitle = title
      ? (/doctar surgery/i.test(title) ? title : title + ' | Doctar Surgery')
      : '';
    if (title) document.title = fullTitle;

    function setMeta(name, content) {
      if (!content) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }
    
    function setOG(property, content) {
      if (!content) return;
      let el = document.querySelector(`meta[property="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', property);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    }

    setMeta('description', description);
    setMeta('keywords', keywords);
    // Default back to index,follow so a noindex page doesn't stay noindexed
    // after navigating elsewhere (renderers share one persistent <meta>).
    setMeta('robots', robots || 'index, follow');

    setOG('og:title', fullTitle);
    setOG('og:description', description);
    setOG('og:image', image || 'https://surgery.doctar.in/images/about-surgery.png');
    setOG('og:url', url || window.location.href);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url || window.location.href);
  };
