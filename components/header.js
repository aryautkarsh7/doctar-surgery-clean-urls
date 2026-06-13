// =====================================================
// HEADER
// Location modal, city selector, header search.
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================

  function buildCityListHTML() {
    // Cities with real hospital data (from MongoDB) — immediately selectable.
    const liveCities = (typeof AVAILABLE_CITIES !== 'undefined' && AVAILABLE_CITIES.length)
      ? AVAILABLE_CITIES
      : ['Kolkata'];
    const liveSet = new Set(liveCities.map(c => c.toLowerCase()));
    const esc = s => String(s == null ? '' : s).replace(/'/g, "\\'");

    // Full city directory from MongoDB (602 cities). When present, show every
    // city with its state; cities with live hospital data are selectable,
    // the rest are flagged "Soon".
    if (typeof CITIES !== 'undefined' && CITIES.length) {
      const sorted = CITIES.slice().sort((a, b) => {
        const aAvail = liveSet.has((a.name || '').toLowerCase());
        const bAvail = liveSet.has((b.name || '').toLowerCase());
        if (aAvail !== bAvail) return aAvail ? -1 : 1; // available first
        return (a.name || '').localeCompare(b.name || '');
      });
      return sorted.map(c => {
        const name = c.name || '';
        const available = liveSet.has(name.toLowerCase());
        return `
      <div class="loc-city-item${available ? '' : ' loc-city-soon'}"
           data-city="${name}" data-state="${c.state || ''}" data-available="${available}"
           onclick="window.locSelectCity('${esc(name)}', ${available})">
        <i class="fa-solid fa-location-dot loc-city-icon"></i>
        <span class="loc-city-text">
          <span class="loc-city-name">${name}</span>
          ${c.state ? `<span class="loc-city-state">${c.state}</span>` : ''}
        </span>
        ${available ? '' : '<span class="loc-city-badge">Soon</span>'}
      </div>`;
      }).join('');
    }

    // Fallback (backend unavailable): live list + CITY_DATA "Coming Soon".
    const comingSoon = (typeof CITY_DATA !== 'undefined' ? CITY_DATA : [])
      .filter(c => !liveSet.has(c.name.toLowerCase()) && !c.available);

    const liveHTML = liveCities.map(name => `
      <div class="loc-city-item"
           data-city="${name}" data-available="true"
           onclick="window.locSelectCity('${esc(name)}', true)">
        <i class="fa-solid fa-location-dot loc-city-icon"></i>
        <span class="loc-city-name">${name}</span>
      </div>`).join('');

    const soonHTML = comingSoon.map(c => `
      <div class="loc-city-item loc-city-soon"
           data-city="${c.name}" data-available="false"
           onclick="window.locSelectCity('${esc(c.name)}', false)">
        <i class="fa-solid fa-location-dot loc-city-icon"></i>
        <span class="loc-city-name">${c.name}</span>
        <span class="loc-city-badge">Soon</span>
      </div>`).join('');

    return liveHTML + soonHTML;
  }

  function injectLocationModal() {
    // If already injected, refresh the city list in case data loaded after first open.
    const existing = document.getElementById('loc-overlay');
    if (existing) {
      const list = document.getElementById('loc-cities-list');
      if (list) list.innerHTML = buildCityListHTML();
      return;
    }
    const citiesHTML = buildCityListHTML();

    document.body.insertAdjacentHTML('beforeend', `
      <div id="loc-overlay" class="loc-overlay" onclick="if(event.target===this)window.closeLocationModal()">
        <div class="loc-modal">
          <div class="loc-header">
            <div>
              <h2 class="loc-title">Select Location</h2>
              <p class="loc-sub">Find healthcare experts near you</p>
            </div>
            <button class="loc-close" onclick="window.closeLocationModal()">×</button>
          </div>
          <div class="loc-body">
            <div class="loc-left">
              <div class="loc-search-wrap">
                <i class="fa-solid fa-magnifying-glass loc-search-icon"></i>
                <input type="text" id="loc-search-input" class="loc-search-input"
                  placeholder="Search city, area, or zip code..."
                  oninput="window.locFilterCities(this.value)">
              </div>
              <button class="loc-current-btn" onclick="window.locUseCurrentLocation()">
                <i class="fa-solid fa-location-crosshairs"></i> Use Current Location
              </button>
              <button class="loc-global-btn" onclick="this.classList.toggle('open')">
                <span><i class="fa-solid fa-globe"></i> Browse Global Locations</span>
                <i class="fa-solid fa-chevron-down loc-global-chev"></i>
              </button>
              <div class="loc-cities-label">ALL CITIES</div>
              <div class="loc-cities-list" id="loc-cities-list">${citiesHTML}</div>
            </div>
            <div class="loc-map-wrap"><div id="loc-map"></div></div>
          </div>
          <div class="loc-footer">
            <div class="loc-footer-hint">
              <i class="fa-solid fa-magnifying-glass"></i>
              <span id="loc-selected-hint">Select a location from the list or map</span>
            </div>
            <div class="loc-footer-btns">
              <button class="loc-cancel-btn" onclick="window.closeLocationModal()">Cancel</button>
              <button class="loc-confirm-btn" id="loc-confirm-btn" onclick="window.locConfirm()" disabled>Confirm</button>
            </div>
          </div>
        </div>
      </div>`);
  }

  window._locPending = null;
  window._locMap = null;

  // Rebuild the city list from the CURRENT AVAILABLE_CITIES and re-apply the
  // active-city highlight. Safe to call repeatedly (e.g. after data loads).
  function refreshCityList() {
    const list = document.getElementById('loc-cities-list');
    if (!list) return;
    list.innerHTML = buildCityListHTML();
    const current = getCurrentCity();
    document.querySelectorAll('.loc-city-item').forEach(el => {
      el.classList.toggle('loc-city-active', el.dataset.city === current);
    });
    // Keep the current search filter applied to the freshly-built list.
    const searchInput = document.getElementById('loc-search-input');
    if (searchInput && searchInput.value) window.locFilterCities(searchInput.value);
  }

  window.openLocationModal = function() {
    injectLocationModal();
    window._locPending = null;
    document.getElementById('loc-confirm-btn').disabled = true;
    document.getElementById('loc-selected-hint').textContent = 'Select a location from the list or map';
    document.getElementById('loc-search-input').value = '';
    window.locFilterCities('');
    // Always rebuild the list from the latest AVAILABLE_CITIES on every open.
    refreshCityList();
    document.getElementById('loc-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(window.locInitMap, 100);

    // If hospital data hasn't loaded yet (only the Kolkata fallback is present),
    // load it then rebuild so all cities appear without needing a reopen.
    if ((typeof AVAILABLE_CITIES === 'undefined' || AVAILABLE_CITIES.length <= 1)
        && typeof loadRemoteData === 'function') {
      loadRemoteData().then(refreshCityList).catch(() => {});
    }
  };

  window.closeLocationModal = function() {
    const el = document.getElementById('loc-overlay');
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  };

  // Resolve [lat, lng] for a city name. Prefers the full CITIES directory
  // (all 602 have coords), then CITY_DATA, then a fuzzy match so names like
  // "Bokaro Steel City" still find "Bokaro". Returns null if unknown.
  function locCityCoords(name) {
    const lc = String(name || '').toLowerCase();
    if (!lc) return null;
    const cities = (typeof CITIES !== 'undefined') ? CITIES : [];
    const exact = cities.find(c => (c.name || '').toLowerCase() === lc);
    if (exact && exact.lat != null) return [exact.lat, exact.lng];
    const cd = (typeof CITY_DATA !== 'undefined' ? CITY_DATA : []).find(c => c.name.toLowerCase() === lc);
    if (cd && cd.lat != null) return [cd.lat, cd.lng];
    const fuzzy = cities.find(c => {
      const cl = (c.name || '').toLowerCase();
      return cl && (lc.includes(cl) || cl.includes(lc));
    });
    if (fuzzy && fuzzy.lat != null) return [fuzzy.lat, fuzzy.lng];
    return null;
  }

  window.locInitMap = function() {
    if (!document.getElementById('loc-map') || typeof L === 'undefined') return;
    if (window._locMap) { window._locMap.invalidateSize(); return; }
    const map = L.map('loc-map', { zoomControl: true, scrollWheelZoom: true, attributionControl: true })
      .setView([22.5, 80.0], 4);
    map.attributionControl.setPrefix('');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19, attribution: '© OpenStreetMap',
    }).addTo(map);
    CITY_DATA.forEach(city => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="loc-map-pin${city.available ? ' loc-map-pin-avail' : ''}">${city.name}</div>`,
        iconAnchor: [0, 20],
      });
      L.marker([city.lat, city.lng], { icon }).addTo(map)
        .on('click', () => {
          window.locSelectCity(city.name, city.available); // handles zoom to city
        });
    });
    window._locMap = map;
  };

  window.locSelectCity = function(cityName, available) {
    // When called with only a name (e.g. from GPS detection), derive
    // availability from the live hospital-data city set so Confirm enables
    // for any city we actually have data for.
    if (available === undefined) {
      const live = (typeof AVAILABLE_CITIES !== 'undefined') ? AVAILABLE_CITIES : [];
      available = live.some(c => c.toLowerCase() === String(cityName).toLowerCase());
    }
    window._locPending = cityName;
    const lcName = String(cityName).toLowerCase();
    document.querySelectorAll('.loc-city-item').forEach(el => {
      el.classList.toggle('loc-city-active', (el.dataset.city || '').toLowerCase() === lcName);
    });
    const confirmBtn = document.getElementById('loc-confirm-btn');
    const hint = document.getElementById('loc-selected-hint');
    if (available === true || available === 'true') {
      hint.textContent = `📍 ${cityName} selected`;
      confirmBtn.disabled = false;
    } else {
      hint.textContent = `${cityName} — coming soon! Please choose an available city.`;
      confirmBtn.disabled = true;
    }
    const item = [...document.querySelectorAll('.loc-city-item')]
      .find(el => (el.dataset.city || '').toLowerCase() === lcName);
    if (item) item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    // Zoom the map into the selected city.
    const coords = locCityCoords(cityName);
    if (coords && window._locMap) {
      window._locMap.setView(coords, 12, { animate: true });
    }
  };

  window.locFilterCities = function(query) {
    const q = (query || '').toLowerCase();
    document.querySelectorAll('.loc-city-item').forEach(el => {
      const name = (el.dataset.city || '').toLowerCase();
      const state = (el.dataset.state || '').toLowerCase();
      el.style.display = (name.includes(q) || state.includes(q)) ? '' : 'none';
    });
    const label = document.querySelector('.loc-cities-label');
    if (label) label.style.display = q ? 'none' : '';
  };

  // Resolve the user's EXACT city from GPS via Nominatim reverse geocoding.
  // The old approach snapped coords to the nearest CITY_DATA entry (major
  // cities only), so e.g. Bokaro collapsed to Kolkata. Reverse geocoding
  // returns the real city/town name.
  function detectCurrentLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          // Remember the precise GPS point so the map can zoom to the exact
          // detected location, not just the matched city's centroid.
          window._locLastGPS = [pos.coords.latitude, pos.coords.longitude];
          try {
            const res = await fetch(
              'https://nominatim.openstreetmap.org/reverse?' +
              'lat=' + pos.coords.latitude +
              '&lon=' + pos.coords.longitude +
              '&format=json',
              { headers: { 'Accept-Language': 'en' } }
            );
            const data = await res.json();

            const rawCity =
              data.address.city ||
              data.address.town ||
              data.address.county ||
              data.address.state_district ||
              data.address.village || '';

            // Fuzzy match the raw name (Nominatim returns e.g. "Bokaro Steel
            // City" while our lists may have "Bokaro"). Prefer AVAILABLE_CITIES
            // — those have real hospital data — so the user lands on a city we
            // can actually serve; fall back to the CITIES directory otherwise.
            const rawLower = rawCity.toLowerCase();
            const available = (typeof AVAILABLE_CITIES !== 'undefined') ? AVAILABLE_CITIES : [];
            const cities = (typeof CITIES !== 'undefined') ? CITIES : [];

            // Match against AVAILABLE_CITIES first (has real hospital data)
            const availableMatch = rawLower && available.find(city => {
              const cityLower = city.toLowerCase();
              return rawLower.includes(cityLower) ||
                     cityLower.includes(rawLower) ||
                     rawLower.startsWith(cityLower) ||
                     cityLower.startsWith(rawLower);
            });

            if (availableMatch) {
              resolve(availableMatch);
              return;
            }

            // Fallback to CITIES directory
            const directoryMatch = rawLower && cities.find(c => {
              const cityLower = (c.name || '').toLowerCase();
              if (!cityLower) return false;
              return rawLower.includes(cityLower) ||
                     cityLower.includes(rawLower);
            });

            const finalCity = directoryMatch
              ? directoryMatch.name
              : (rawCity || 'Kolkata');
            resolve(finalCity);
          } catch (e) {
            resolve('Kolkata');
          }
        },
        () => reject('Permission denied'),
        { timeout: 8000 }
      );
    });
  }

  window.locUseCurrentLocation = function() {
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    const btn = document.querySelector('.loc-current-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Detecting...';
    btn.disabled = true;
    detectCurrentLocation()
      .then(city => {
        btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Use Current Location';
        btn.disabled = false;
        window.locSelectCity(city);
        // Zoom the map into the detected location (precise GPS if available,
        // else the matched city's coords) and drop a marker.
        const map = window._locMap;
        const target = window._locLastGPS || locCityCoords(city);
        if (map && target) {
          map.setView(target, 13, { animate: false });
          if (window._locDetectedMarker) map.removeLayer(window._locDetectedMarker);
          window._locDetectedMarker = L.circleMarker(target, {
            radius: 9, color: '#fff', weight: 2,
            fillColor: '#6c3fc5', fillOpacity: 1,
          }).addTo(map).bindPopup(city).openPopup();
        }
      })
      .catch(err => {
        btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Use Current Location';
        btn.disabled = false;
        alert(err === 'Permission denied'
          ? 'Could not detect location. Please select manually.'
          : 'Location detection failed. Please select manually.');
      });
  };

  window.locConfirm = function() {
    if (!window._locPending) return;
    const city = window._locPending;
    localStorage.setItem('selectedCity', city);
    // Clear GPS slug cache so URL builders use the newly selected city.
    try { sessionStorage.removeItem('userLocationSlug'); } catch (e) {}
    const textSpan = document.getElementById('currentCityText');
    if (textSpan) textSpan.textContent = city;
    window.closeLocationModal();
    // Reload city-specific data then re-render; falls back to immediate re-render if unavailable
    if (typeof window.reloadCityData === 'function') {
      window.reloadCityData(city).catch(() => {}).finally(() => handleRoute());
    } else {
      handleRoute();
    }
  };

  function initCitySelector() {
    const btn = document.getElementById('citySelectorBtn');
    const textSpan = document.getElementById('currentCityText');
    if (textSpan) textSpan.textContent = getCurrentCity();
    if (btn) btn.addEventListener('click', e => { e.stopPropagation(); window.openLocationModal(); });
  }

  // =====================================================
  // LOAD DATA FROM BACKEND (/api/data/all), fall back to data.js

  // =====================================================
  function initHeaderSearch() {
    const wrap = document.querySelector('.header-search');
    if (!wrap) return;
    const input = wrap.querySelector('input');
    const goBtn = wrap.querySelector('.search-go');
    if (!input) return;

    wrap.style.position = 'relative';
    let dropdown = document.getElementById('hsDropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'hsDropdown';
      dropdown.className = 'hs-dropdown';
      dropdown.style.display = 'none';
      wrap.appendChild(dropdown);
    }

    const esc = s => String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    function matches(hay, q) { return String(hay || '').toLowerCase().includes(q); }

    async function search(qRaw) {
      const q = qRaw.trim().toLowerCase();
      if (!q) { closeDropdown(); return; }

      // If data hasn't loaded yet, fetch it before searching
      if (!DOCTORS.length && !HOSPITALS.length) {
        await loadRemoteData();
      }

      const allTreatments = (typeof TREATMENTS !== 'undefined') ? Object.values(TREATMENTS).flat() : [];
      const treatments = allTreatments.filter(t =>
        matches(t.name, q) || matches(t.brief, q) || matches(t.categorySlug, q)
      ).slice(0, 3);

      const doctors = (typeof DOCTORS !== 'undefined' ? DOCTORS : []).filter(d =>
        matches(d.name, q) || matches(d.specialty, q) || matches(d.hospital, q) || matches(d.location, q)
      ).slice(0, 3);

      const categories = (typeof CATEGORIES !== 'undefined' ? CATEGORIES : []).filter(c =>
        matches(c.name, q) || matches(c.description, q) || (Array.isArray(c.tags) && c.tags.some(tag => matches(tag, q)))
      ).slice(0, 3);

      const hospitals = (typeof HOSPITALS !== 'undefined' ? HOSPITALS : []).filter(h =>
        matches(h.name, q) || matches(h.address, q) || matches(h.city, q) || matches(h.type, q)
      ).slice(0, 3);

      const procedures = searchSubSubKeywords(q, 3);

      renderResults(qRaw.trim(), { treatments, doctors, categories, hospitals, procedures });
    }

    function group(title, items, mapper) {
      if (!items.length) return '';
      return `
        <div class="hs-group">
          <div class="hs-group-title">${title}</div>
          ${items.map(mapper).join('')}
        </div>`;
    }

    function row(href, icon, label, sub) {
      return `<a href="${href}" class="hs-result" data-hs-link>
        <span class="hs-result-ic">${icon}</span>
        <span class="hs-result-text"><span class="hs-result-label">${esc(label)}</span>${sub ? `<span class="hs-result-sub">${esc(sub)}</span>` : ''}</span>
        <i class="fa-solid fa-arrow-right hs-result-arrow"></i>
      </a>`;
    }

    function renderResults(q, r) {
      const procedures = r.procedures || [];
      const total = r.treatments.length + r.doctors.length + r.categories.length + r.hospitals.length + procedures.length;
      let html = `<div class="hs-head"><i class="fa-solid fa-magnifying-glass"></i> "${esc(q)}"</div>`;
      if (!total) {
        html += `<div class="hs-empty">No results found for "<strong>${esc(q)}</strong>"</div>`;
      } else {
        html += group('Procedures', procedures, p =>
          row(urlCategory(p.categorySlug), '🔪', p.keyword, p.groupName || ''));
        html += group('Treatments', r.treatments, t =>
          row(urlTreatment(t.slug, t.categorySlug), '🏥', t.name, (findCategory(t.categorySlug) || {}).name || ''));
        html += group('Doctors', r.doctors, d =>
          row(urlDoctor(d), '👨‍⚕️', d.name, d.specialty || ''));
        html += group('Categories', r.categories, c =>
          row(urlCategory(c.slug), '🩺', c.name, ''));
        html += group('Hospitals', r.hospitals, h =>
          row(urlHospital(h), '🏨', h.name, h.city || ''));
      }
      dropdown.innerHTML = html;
      dropdown.style.display = 'block';
      dropdown.querySelectorAll('[data-hs-link]').forEach(a => {
        a.addEventListener('click', () => closeDropdown());
      });
    }

    function closeDropdown() { dropdown.style.display = 'none'; }

    let debounceTimer = null;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => search(input.value), 300);
    });
    function goToSearchPage() {
      const query = input.value.trim();
      if (query.length > 0) {
        closeDropdown();
        navigate('/search/' + encodeURIComponent(query) + '/s');
      }
    }
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); clearTimeout(debounceTimer); goToSearchPage(); }
      else if (e.key === 'Escape') { closeDropdown(); input.blur(); }
    });
    input.addEventListener('focus', () => { if (input.value.trim()) search(input.value); });
    if (goBtn) goBtn.addEventListener('click', goToSearchPage);

    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) closeDropdown();
    });
  }
