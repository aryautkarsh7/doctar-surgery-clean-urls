// =====================================================
// HEADER
// Location modal, city selector, header search.
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================

  function injectLocationModal() {
    if (document.getElementById('loc-overlay')) return;
    const citiesHTML = CITY_DATA.map(c => `
      <div class="loc-city-item${c.available ? '' : ' loc-city-soon'}"
           data-city="${c.name}" data-available="${c.available}"
           onclick="window.locSelectCity('${c.name}',${c.available})">
        <i class="fa-solid fa-location-dot loc-city-icon"></i>
        <span class="loc-city-name">${c.name}</span>
        ${!c.available ? '<span class="loc-city-badge">Soon</span>' : ''}
      </div>`).join('');

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
              <div class="loc-cities-label">POPULAR CITIES</div>
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

  window.openLocationModal = function() {
    injectLocationModal();
    window._locPending = null;
    document.getElementById('loc-confirm-btn').disabled = true;
    document.getElementById('loc-selected-hint').textContent = 'Select a location from the list or map';
    document.getElementById('loc-search-input').value = '';
    window.locFilterCities('');
    const current = getCurrentCity();
    document.querySelectorAll('.loc-city-item').forEach(el => {
      el.classList.toggle('loc-city-active', el.dataset.city === current);
    });
    document.getElementById('loc-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(window.locInitMap, 100);
  };

  window.closeLocationModal = function() {
    const el = document.getElementById('loc-overlay');
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  };

  window.locInitMap = function() {
    if (!document.getElementById('loc-map') || typeof L === 'undefined') return;
    if (window._locMap) { window._locMap.invalidateSize(); return; }
    const map = L.map('loc-map', { zoomControl: true, scrollWheelZoom: true, attributionControl: true })
      .setView([22.5, 80.0], 4);
    map.attributionControl.setPrefix('');
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18, attribution: '© OpenStreetMap contributors © CARTO',
    }).addTo(map);
    CITY_DATA.forEach(city => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="loc-map-pin${city.available ? ' loc-map-pin-avail' : ''}">${city.name}</div>`,
        iconAnchor: [0, 20],
      });
      L.marker([city.lat, city.lng], { icon }).addTo(map)
        .on('click', () => {
          window.locSelectCity(city.name, city.available);
          map.flyTo([city.lat, city.lng], 7, { animate: true, duration: 0.8 });
        });
    });
    window._locMap = map;
  };

  window.locSelectCity = function(cityName, available) {
    window._locPending = cityName;
    document.querySelectorAll('.loc-city-item').forEach(el => {
      el.classList.toggle('loc-city-active', el.dataset.city === cityName);
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
    const item = document.querySelector(`.loc-city-item[data-city="${cityName}"]`);
    if (item) item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    const cd = CITY_DATA.find(c => c.name === cityName);
    if (cd && window._locMap) window._locMap.flyTo([cd.lat, cd.lng], 7, { animate: true, duration: 0.8 });
  };

  window.locFilterCities = function(query) {
    const q = (query || '').toLowerCase();
    document.querySelectorAll('.loc-city-item').forEach(el => {
      el.style.display = el.dataset.city.toLowerCase().includes(q) ? '' : 'none';
    });
    const label = document.querySelector('.loc-cities-label');
    if (label) label.style.display = q ? 'none' : '';
  };

  window.locUseCurrentLocation = function() {
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    const btn = document.querySelector('.loc-current-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Detecting...';
    btn.disabled = true;
    navigator.geolocation.getCurrentPosition(pos => {
      btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Use Current Location';
      btn.disabled = false;
      const { latitude: lat, longitude: lng } = pos.coords;
      let closest = CITY_DATA[0], minDist = Infinity;
      CITY_DATA.forEach(c => {
        const d = Math.hypot(c.lat - lat, c.lng - lng);
        if (d < minDist) { minDist = d; closest = c; }
      });
      window.locSelectCity(closest.name, closest.available);
    }, () => {
      btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Use Current Location';
      btn.disabled = false;
      alert('Could not detect location. Please select manually.');
    });
  };

  window.locConfirm = function() {
    if (!window._locPending) return;
    localStorage.setItem('selectedCity', window._locPending);
    const textSpan = document.getElementById('currentCityText');
    if (textSpan) textSpan.textContent = window._locPending;
    window.closeLocationModal();
    handleRoute();
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
