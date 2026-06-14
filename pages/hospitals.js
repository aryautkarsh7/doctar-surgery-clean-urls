// =====================================================
// HOSPITAL DETAIL & HOSPITAL LISTING PAGES
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================

  // =====================================================
  function renderHospitalDetailPage(slug) {
    showSkeleton('detail');
    const hospital = findHospital(slug);
    // Not found: redirect to the hospitals listing instead of re-running
    // handleRoute() on the SAME url, which would recurse infinitely (stack overflow).
    if (!hospital) { navigate('/hospitals'); return; }

    updatePageMeta({
      title: `${hospital.name} - Surgery Hospital in ${hospital.city}`,
      description: `${hospital.name} offers expert surgery services in ${hospital.city}. Advanced surgical facilities, expert surgeons & cashless insurance. Book surgery consultation free.`,
      keywords: `${hospital.name}, surgery hospital in ${hospital.city}, surgeons in ${hospital.city}, surgical facilities, book surgery`,
      image: hospital.image,
      url: window.location.href
    });


    // Doctors at this hospital: match by doc.hospitals[] (slug or name) OR doc.hospital string.
    const hospitalDoctors = DOCTORS.filter(doc => {
      if (Array.isArray(doc.hospitals)) {
        const inList = doc.hospitals.some(h => {
          const name = (typeof h === 'string') ? h : (h.name || '');
          const hslug = (typeof h === 'object') ? (h.slug || '') : '';
          return name === hospital.name || hslug === hospital.slug;
        });
        if (inList) return true;
      }
      return doc.hospital === hospital.name;
    });

    // Group doctors by their primary category (categories[0]); ungrouped → "Other Specialists".
    const doctorsByCategory = (() => {
      const groups = {};
      hospitalDoctors.forEach(doc => {
        const catSlug = (Array.isArray(doc.categories) && doc.categories[0]) ? doc.categories[0] : '_other';
        (groups[catSlug] = groups[catSlug] || []).push(doc);
      });
      return Object.keys(groups).map(catSlug => ({
        label: catSlug === '_other' ? 'Other Specialists' : ((findCategory(catSlug) || {}).name || catSlug),
        doctors: groups[catSlug],
      }));
    })();
    const visitReasons = Array.from(new Set([
      'General Consultation',
      ...(hospital.specialties || []),
      ...(hospital.services || [])
    ].filter(Boolean)));
    const faqs = [
      { q: `Where is ${hospital.name} located?`, a: `${hospital.name} is located at ${hospital.address}.` },
      { q: `What type of facility is ${hospital.name}?`, a: `${hospital.name} is a ${(hospital.type || 'hospital').toLowerCase()} with support for planned surgical care.` },
      { q: 'Is insurance support available?', a: 'Yes, our care team helps with insurance paperwork, cashless approval, and claim coordination wherever applicable.' },
      { q: 'Can I book a free consultation here?', a: 'Yes, you can request a free consultation and our coordinator will help confirm the best doctor and slot.' },
    ];

    const html = `
      <div class="container dpp-breadcrumb">
        <a href="/">Home</a> <span>›</span>
        <a href="/">Hospitals</a> <span>›</span>
        <span>${hospital.name}</span>
      </div>

      <section class="container hpp-hero">
        <div class="hpp-hero-media">
          <img loading="lazy" src="${hospital.image || 'images/about-surgery.webp'}" alt="${hospital.name}" onerror="this.src='images/about-surgery.webp'">
          <div class="hpp-hero-logo-slot${hospital.logo ? '' : ' is-empty'}" title="Hospital logo">
            ${hospital.logo
              ? `<img src="${hospital.logo}" alt="${hospital.name} logo" onerror="this.closest('.hpp-hero-logo-slot').classList.add('is-empty');this.remove();">`
              : `<i class="fa-solid fa-hospital"></i>`}
          </div>
        </div>
        <div class="hpp-hero-content">
          <div class="treatment-eyebrow">
            <i class="fa-solid fa-hospital"></i> Featured Hospital
          </div>
          <h1>${hospital.name}</h1>
          <p>${hospital.overview}</p>
          <div class="hpp-hero-meta">
            <span><i class="fa-solid fa-star"></i> ${hospital.rating} (${hospital.reviews || 0} reviews)</span>
            <span><i class="fa-solid fa-location-dot"></i> ${hospital.address}</span>
            <span><i class="fa-solid fa-clock"></i> ${hospital.hours}</span>
          </div>
          <div class="hpp-hero-actions">
            <button class="hpp-primary-btn" onclick="window.openBookingModal('','${hospital.name}')">
              <i class="fa-solid fa-calendar-check"></i> Book FREE Appointment
            </button>
            <a href="tel:${(hospital.phone || '').replace(/-/g, '')}" class="hpp-secondary-btn">
              <i class="fa-solid fa-phone"></i> Call Hospital
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${(hospital.map && hospital.map.lat && hospital.map.lng) ? `${hospital.map.lat},${hospital.map.lng}` : encodeURIComponent((hospital.address || '') + ', ' + (hospital.city || ''))}"
               target="_blank"
               rel="noopener noreferrer"
               class="hpp-secondary-btn"
               style="display:inline-flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-location-arrow"></i> Get Directions
            </a>
          </div>
        </div>
      </section>

      <div class="container hpp-layout">
        <aside class="hpp-sidebar">
          <div class="hpp-summary-card">
            <h3>Hospital Details</h3>
            <div class="hpp-summary-row">
              <span>Facility Type</span>
              <strong>${hospital.type}</strong>
            </div>
            <div class="hpp-summary-row">
              <span>Location</span>
              <strong>${hospital.address}</strong>
            </div>
            <div class="hpp-summary-row">
              <span>Timings</span>
              <strong>${hospital.hours}</strong>
            </div>
            <div class="hpp-summary-row">
              <span>Helpline</span>
              <strong>${hospital.phone}</strong>
            </div>
          </div>

          <div id="hpp-real-map" style="width:100%; height:350px; border-radius:12px; z-index:1;"></div>
          <a class="hpp-directions-btn" href="https://www.google.com/maps/dir/?api=1&destination=${(hospital.map && hospital.map.lat && hospital.map.lng) ? `${hospital.map.lat},${hospital.map.lng}` : encodeURIComponent((hospital.address || '') + ', ' + (hospital.city || ''))}" target="_blank" rel="noopener noreferrer">
            <i class="fa-solid fa-location-arrow"></i> Get Directions
          </a>
        </aside>

        <main class="hpp-main">
          <section class="hpp-section">
            <h2><i class="fa-solid fa-shield-halved"></i> Services Available</h2>
            <div class="hpp-chip-grid">
              ${(hospital.services || []).map(service => `<span>${service}</span>`).join('')}
            </div>
          </section>

          <section class="hpp-section">
            <h2><i class="fa-solid fa-stethoscope"></i> Specialities</h2>
            <div class="hpp-specialty-grid">
              ${(hospital.specialties || []).map(name => `<span><i class="fa-solid fa-circle-check"></i> ${name}</span>`).join('')}
            </div>
          </section>

          <section class="hpp-section">
            <h2><i class="fa-solid fa-building-circle-check"></i> Amenities</h2>
            <div class="hpp-amenity-grid">
              ${(hospital.amenities || []).map(item => `<div><i class="fa-solid fa-check"></i><span>${item}</span></div>`).join('')}
            </div>
          </section>

          <section class="hpp-section">
            <h2><i class="fa-solid fa-user-doctor"></i> Available Doctors</h2>
            ${hospitalDoctors.length === 0 ? `
              <p>Our care team will help match you with the right specialist at this hospital.</p>
            ` : doctorsByCategory.map(group => `
              <div class="hpp-doc-group">
                <h3 class="hpp-doc-cat">${group.label}</h3>
                <div class="hpp-doc-row">
                  ${group.doctors.map(doc => `
                    <a href="/surgeons/${(doc.categories&&doc.categories[0])||'general'}/${doc.slug}/s" class="hpp-doc-card">
                      <div class="hpp-doc-photo">${doc.image ? `<img src="${doc.image}" alt="${doc.name}" onerror="this.parentNode.textContent='${(doc.name||'').replace(/^Dr\.?\s*/i,'').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase()}'">` : (doc.name||'').replace(/^Dr\.?\s*/i,'').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
                      <div class="hpp-doc-info">
                        <h4 class="hpp-doc-name">${doc.name}</h4>
                        <p class="hpp-doc-spec">${doc.specialty || ''}</p>
                        <p class="hpp-doc-meta">${doc.rating ? '⭐ ' + doc.rating : ''}${doc.rating && doc.experience ? ' | ' : ''}${doc.experience || ''}</p>
                        ${doc.hours || doc.nextSlot ? `<p class="hpp-doc-hours"><i class="fa-regular fa-clock"></i> ${doc.hours || ('Next: ' + doc.nextSlot)}</p>` : ''}
                        <span class="hpp-doc-book">Book <i class="fa-solid fa-arrow-right"></i></span>
                      </div>
                    </a>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </section>

          <section class="hpp-section" id="hpp-booking">
            <h2><i class="fa-solid fa-calendar-check"></i> Book Appointment</h2>
            <form class="hpp-book-card" id="hpp-booking-form">
              <input type="text" id="hpp-patient-name" class="dpp-input" placeholder="Patient Name" required>
              <div class="phone-prefix-wrap">
                <span class="phone-prefix-badge">+91</span>
                <input type="tel" id="hpp-patient-phone" class="dpp-input phone-prefix-input" placeholder="XXXXX XXXXX" maxlength="10" inputmode="numeric" required>
              </div>
              <p id="hpp-phone-error" class="phone-error-msg" style="display:none">Please enter a valid 10-digit mobile number</p>
              <input type="email" id="hpp-patient-email" class="dpp-input" placeholder="Email (optional)">
              <select id="hpp-visit-reason" class="dpp-input" required>
                <option value="">Reason of Visit / Select Disease</option>
                ${visitReasons.map(reason => `<option value="${reason}">${reason}</option>`).join('')}
              </select>
              <input type="date" id="hpp-preferred-date" class="dpp-input" aria-label="Preferred Date">
              <select id="hpp-preferred-time" class="dpp-input" aria-label="Preferred Time">
                <option value="">Preferred Time</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="5:00 PM">5:00 PM</option>
              </select>
              <button type="submit" class="dpp-confirm-btn" id="hpp-submit-btn">
                <i class="fa-solid fa-calendar-check"></i> Request Appointment
              </button>
              <p id="hpp-booking-message" class="hpp-booking-message" aria-live="polite"></p>
              <p class="dpp-form-note"><i class="fa-solid fa-lock"></i> 100% Private &amp; Confidential</p>
            </form>
          </section>

          <section class="hpp-section">
            <h2><i class="fa-solid fa-circle-question"></i> Frequently Asked Questions</h2>
            ${faqs.map(faq => `
              <div class="dpp-faq-item" onclick="this.classList.toggle('open')">
                <div class="dpp-faq-q">${faq.q} <i class="fa-solid fa-chevron-down"></i></div>
                <div class="dpp-faq-a">${faq.a}</div>
              </div>
            `).join('')}
          </section>
        </main>
      </div>
    `;

    appContainer.innerHTML = html;
    initHospitalDetailMap(hospital);
    setupHospitalBookingForm(hospital);
    {
      const city = hospital.city || getCurrentCity() || 'Kolkata';
      const sameCity = HOSPITALS.filter(h =>
        h.slug !== hospital.slug && h.city && h.city.toLowerCase() === city.toLowerCase()
      );
      appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(city, {
        hospitals: sameCity.length ? sameCity : undefined,
      }));
    }
  }

  function setupHospitalBookingForm(hospital) {
    const form = document.getElementById('hpp-booking-form');
    if (!form) return;

    const phoneInput = document.getElementById('hpp-patient-phone');
    const msgEl = document.getElementById('hpp-booking-message');
    const errEl = document.getElementById('hpp-phone-error');
    const btn = document.getElementById('hpp-submit-btn');
    const defaultBtnHTML = btn ? btn.innerHTML : '';

    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        if (errEl) errEl.style.display = 'none';
      });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!msgEl || !btn) return;

      const name = document.getElementById('hpp-patient-name')?.value.trim() || '';
      const rawPhone = phoneInput?.value.replace(/\D/g, '') || '';
      const email = document.getElementById('hpp-patient-email')?.value.trim() || '';
      const disease = document.getElementById('hpp-visit-reason')?.value || '';
      const appointmentDate = document.getElementById('hpp-preferred-date')?.value || '';
      const appointmentTime = document.getElementById('hpp-preferred-time')?.value || '';

      msgEl.className = 'hpp-booking-message';
      msgEl.textContent = '';

      if (!name || rawPhone.length !== 10 || !disease) {
        if (rawPhone.length !== 10 && errEl) errEl.style.display = 'block';
        msgEl.classList.add('error');
        msgEl.textContent = 'Please fill Patient Name, Phone Number and Reason of Visit.';
        return;
      }
      if (errEl) errEl.style.display = 'none';

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      try {
        const payload = {
          name,
          phone: '+91' + rawPhone,
          disease,
          email,
          hospital: hospital.name,
          location: hospital.city || hospital.address || 'Not specified',
          source: 'surgery.doctar.in',
          appointmentDate,
          appointmentTime
        };

        const res = await fetch('http://localhost:3001/api/bookings/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === false) throw new Error(json.message || 'Booking failed');

        msgEl.classList.add('success');
        msgEl.textContent = 'Appointment request sent! Our team will call you shortly.';
        form.reset();
      } catch (err) {
        console.error('Hospital booking error:', err);
        msgEl.classList.add('error');
        msgEl.textContent = 'Something went wrong. Please call +91-8877772277';
      } finally {
        btn.disabled = false;
        btn.innerHTML = defaultBtnHTML;
      }
    });
  }

  // Render a real, live OSM/Leaflet map on the hospital detail page when
  // coordinates exist; otherwise the decorative fallback stays in place.
  function initHospitalDetailMap(hospital) {
    const mapEl = document.getElementById('hpp-real-map');
    if (!mapEl || typeof L === 'undefined') return;

    // Tear down any previous instance (re-navigating between hospitals).
    if (window._hospitalDetailMap) {
      window._hospitalDetailMap.remove();
      window._hospitalDetailMap = null;
    }
    mapEl.innerHTML = '';

    // No real coordinates on record → show a clear message instead of a wrong pin.
    const hasCoords = hospital.map && hospital.map.lat != null && hospital.map.lng != null;
    if (!hasCoords) {
      mapEl.innerHTML = '<div class="hpp-map-missing"><i class="fa-solid fa-location-dot"></i><span>Location not available</span></div>';
      return;
    }

    const lat = hospital.map.lat;
    const lng = hospital.map.lng;

    const map = L.map('hpp-real-map', {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap © CARTO',
    }).addTo(map);

    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`
      <b>${hospital.name}</b><br>
      ${hospital.address}
    `).openPopup();

    window._hospitalDetailMap = map;
    setTimeout(() => map.invalidateSize(), 100);
  }

  // =====================================================
  // RENDER DOCTORS LISTING PAGE

  // Great-circle distance between two lat/lng points (km), no paid API.
  function getHaversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  }

  // Ask for location once and update every .hosp-distance span on the page.
  function updateHospitalDistances() {
    const els = document.querySelectorAll('.hosp-distance');
    if (!els.length) return;
    if (!navigator.geolocation) {
      els.forEach(el => { el.textContent = 'Distance unavailable'; });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        document.querySelectorAll('.hosp-distance').forEach(el => {
          const lat = parseFloat(el.dataset.lat);
          const lng = parseFloat(el.dataset.lng);
          if (!isNaN(lat) && !isNaN(lng)) {
            el.textContent = getHaversineDistance(userLat, userLng, lat, lng) + ' km away';
          } else {
            el.textContent = 'Distance unavailable';
          }
        });
      },
      () => {
        document.querySelectorAll('.hosp-distance').forEach(el => {
          el.textContent = 'Distance unavailable';
        });
      },
      { timeout: 8000 }
    );
  }

  // =====================================================
  // RENDER ALL HOSPITALS PAGE
  // =====================================================
  function renderAllHospitalsPage(filters, cityOverride) {
    showSkeleton('list');
    const currentCity = cityOverride || getCurrentCity();
    filters = filters || { type: 'all', rating: 0, accreditation: 'all', service: 'all' };

    updatePageMeta({
      title: `Best Surgery Hospitals in ${currentCity}`,
      description: `Top surgery hospitals in ${currentCity} with expert surgeons. Laparoscopic, orthopedic, cardiac & all surgery types. Free consultation. Book now.`,
      keywords: `surgery hospitals in ${currentCity}, surgeons in ${currentCity}, best surgical hospitals, laparoscopic surgery, book surgery`,
      url: window.location.href
    });

    let hospitals = getHospitalsForCity(currentCity);

    // Filter by type
    if (filters.type !== 'all') {
      hospitals = hospitals.filter(h => {
        const typeStr = h.type.toLowerCase();
        if (filters.type === 'multispeciality') return typeStr.includes('multispeciality');
        if (filters.type === 'surgery-centre') return typeStr.includes('surgery centre') || typeStr.includes('surgery center') || typeStr.includes('advanced surgery');
        if (filters.type === 'clinic') return typeStr.includes('clinic') || typeStr.includes('surgical clinic');
        return true;
      });
    }

    // Filter by rating
    if (filters.rating > 0) {
      hospitals = hospitals.filter(h => h.rating >= filters.rating);
    }

    // Filter by accreditation
    if (filters.accreditation !== 'all') {
      hospitals = hospitals.filter(h => {
        const metricsStr = h.metrics.join(' ').toLowerCase();
        if (filters.accreditation === 'jci') return metricsStr.includes('jci');
        if (filters.accreditation === 'nabh') return metricsStr.includes('nabh');
        return true;
      });
    }

    // Filter by services/amenities
    if (filters.service !== 'all') {
      hospitals = hospitals.filter(h => {
        const allServices = [...h.services, ...h.amenities].map(s => s.toLowerCase());
        if (filters.service === 'cashless') return allServices.some(s => s.includes('cashless') || s.includes('insurance'));
        if (filters.service === 'consultation') return allServices.some(s => s.includes('consultation'));
        if (filters.service === 'cab') return allServices.some(s => s.includes('cab'));
        if (filters.service === 'ot') return allServices.some(s => s.includes('ot') || s.includes('operation'));
        return true;
      });
    }

    const html = `
      <!-- HERO -->
      <div class="tpl-hero" style="background: linear-gradient(120deg, #5e409118 0%, #fff 70%);">
        <div class="container tpl-hero-inner">
          <div class="breadcrumb">
            <a href="/">Home</a> <span>›</span>
            <span class="breadcrumb-current">All Partner Hospitals</span>
          </div>
          <h1 class="tpl-title">
            <span style="color:#5e4091">${hospitals.length} Partner</span> Hospitals in ${currentCity}
          </h1>
          <p class="tpl-sub">Find the best partner hospitals and surgical clinics in ${currentCity}. Modern modular OT facilities, ICU support, zero cashless billing hassles, and free cab pick-up &amp; drop.</p>
          <div class="tpl-trust-row">
            <span class="tpl-badge"><i class="fa-solid fa-circle-check" style="color:#5e4091"></i> NABH/JCI Accredited</span>
            <span class="tpl-badge"><i class="fa-solid fa-shield-halved" style="color:#5e4091"></i> Zero Cashless Hassle</span>
            <span class="tpl-badge"><i class="fa-solid fa-car" style="color:#5e4091"></i> Free Home-to-Hospital Cab</span>
          </div>
        </div>
      </div>

      <!-- MAIN LAYOUT -->
      <div class="container tpl-layout">
        <!-- LEFT SIDEBAR: FILTERS -->
        <aside class="tpl-sidebar">
          <div class="tpl-filter-head">
            <i class="fa-solid fa-sliders"></i> Filter Hospitals
            <button class="tpl-reset-btn" onclick="window._allHospitalsFilters={}; renderAllHospitalsPage()">Reset All</button>
          </div>

          <div class="tpl-filter-group">
            <h4>Facility Type</h4>
            <label class="tpl-radio"><input type="radio" name="hosp-type" value="all" ${filters.type==='all'?'checked':''} onchange="applyAllHospitalsFilter('type','all')"> Any Type</label>
            <label class="tpl-radio"><input type="radio" name="hosp-type" value="multispeciality" ${filters.type==='multispeciality'?'checked':''} onchange="applyAllHospitalsFilter('type','multispeciality')"> Multispeciality Hospital</label>
            <label class="tpl-radio"><input type="radio" name="hosp-type" value="surgery-centre" ${filters.type==='surgery-centre'?'checked':''} onchange="applyAllHospitalsFilter('type','surgery-centre')"> Surgery Centre</label>
            <label class="tpl-radio"><input type="radio" name="hosp-type" value="clinic" ${filters.type==='clinic'?'checked':''} onchange="applyAllHospitalsFilter('type','clinic')"> Surgical Clinic</label>
          </div>

          <div class="tpl-filter-group">
            <h4>Minimum Rating</h4>
            ${[4.8, 4.7, 4.6].map(r => `
              <label class="tpl-radio"><input type="radio" name="hosp-rating" value="${r}" ${filters.rating===r?'checked':''} onchange="applyAllHospitalsFilter('rating',${r})"> ${r}+ ⭐</label>
            `).join('')}
            <label class="tpl-radio"><input type="radio" name="hosp-rating" value="0" ${filters.rating===0?'checked':''} onchange="applyAllHospitalsFilter('rating',0)"> Any Rating</label>
          </div>

          <div class="tpl-filter-group">
            <h4>Accreditation</h4>
            <label class="tpl-radio"><input type="radio" name="hosp-accred" value="all" ${filters.accreditation==='all'?'checked':''} onchange="applyAllHospitalsFilter('accreditation','all')"> Any</label>
            <label class="tpl-radio"><input type="radio" name="hosp-accred" value="jci" ${filters.accreditation==='jci'?'checked':''} onchange="applyAllHospitalsFilter('accreditation','jci')"> JCI Accredited</label>
            <label class="tpl-radio"><input type="radio" name="hosp-accred" value="nabh" ${filters.accreditation==='nabh'?'checked':''} onchange="applyAllHospitalsFilter('accreditation','nabh')"> NABH Accredited</label>
          </div>

          <div class="tpl-filter-group">
            <h4>Featured Amenities</h4>
            <label class="tpl-radio"><input type="radio" name="hosp-serv" value="all" ${filters.service==='all'?'checked':''} onchange="applyAllHospitalsFilter('service','all')"> Any</label>
            <label class="tpl-radio"><input type="radio" name="hosp-serv" value="cashless" ${filters.service==='cashless'?'checked':''} onchange="applyAllHospitalsFilter('service','cashless')"> Cashless Billing</label>
            <label class="tpl-radio"><input type="radio" name="hosp-serv" value="consultation" ${filters.service==='consultation'?'checked':''} onchange="applyAllHospitalsFilter('service','consultation')"> Free Consultation</label>
            <label class="tpl-radio"><input type="radio" name="hosp-serv" value="cab" ${filters.service==='cab'?'checked':''} onchange="applyAllHospitalsFilter('service','cab')"> Cab Drop Assistance</label>
          </div>
        </aside>

        <div class="tpl-cards-col">
          <div class="tpl-results-bar">
            <span><strong>${hospitals.length}</strong> hospital${hospitals.length !== 1 ? 's' : ''} found in ${currentCity}</span>
            <div class="hosp-view-toggle" role="tablist" aria-label="Hospitals view">
              <button class="hvt-btn is-active" data-view="list" onclick="setHospitalsView('list')"><i class="fa-solid fa-list-ul"></i> List</button>
              <button class="hvt-btn" data-view="map" onclick="setHospitalsView('map')"><i class="fa-solid fa-map-location-dot"></i> Map</button>
            </div>
          </div>

          <div id="hospitalsMapView" class="hosp-map-view" style="display:none;">
            <div id="allHospitalsMap"></div>
          </div>

          ${hospitals.length === 0 ? `
            <div class="tpl-empty">
              <i class="fa-solid fa-hospital"></i>
              <p>No partner hospitals match your filters in ${currentCity}. Try adjusting them.</p>
            </div>
          ` : `<div class="hl-list" id="hospitalsListView">` + hospitals.map((hospital, index) => `
            <article class="hl-card ${index === 0 ? 'is-highlighted' : ''}${hospital.image ? '' : ' hl-img-failed'}">
              <div class="hl-image-wrap">
                <img src="${hospital.image || 'images/about-surgery.webp'}" alt="${hospital.name}" loading="lazy" onerror="this.onerror=null;this.closest('.hl-card').classList.add('hl-img-failed');this.src='images/about-surgery.webp'">
                <div class="card-logo-slot${hospital.logo ? '' : ' is-empty'}" title="Hospital logo">
                  ${hospital.logo
                    ? `<img src="${hospital.logo}" alt="${hospital.name} logo" onerror="this.closest('.card-logo-slot').classList.add('is-empty');this.remove();">`
                    : `<i class="fa-solid fa-hospital"></i>`}
                </div>
                <!-- mobile-only image overlays (hidden on desktop via inline display:none) -->
                ${hospital.rating ? `<div class="hl-ov-rating" style="display:none"><i class="fa-solid fa-star"></i> ${hospital.rating}</div>` : ''}
                ${hospital.type ? `<div class="hl-ov-type" style="display:none">${hospital.type}</div>` : ''}
                <div class="hl-ov-fallback" style="display:none"><i class="fa-solid fa-hospital"></i><span>${hospital.name}</span></div>
              </div>
              <div class="hl-content">
                <div class="hl-title-row">
                  <div>
                    <h3>${hospital.name}</h3>
                    <div class="hl-meta-list">
                      ${hospital.address ? `<span><i class="fa-solid fa-location-dot"></i>${hospital.address}</span>` : ''}
                      <span><i class="fa-solid fa-route"></i> <span class="hosp-distance" data-lat="${hospital.map && hospital.map.lat != null ? hospital.map.lat : ''}" data-lng="${hospital.map && hospital.map.lng != null ? hospital.map.lng : ''}">Locating…</span></span>
                      ${hospital.type ? `<span><i class="fa-solid fa-user-doctor"></i>${hospital.type}</span>` : ''}
                    </div>
                  </div>
                  ${hospital.rating ? `<div class="hl-rating">${hospital.rating} <i class="fa-solid fa-star"></i> <span>(${hospital.reviews || 0} reviews)</span></div>` : ''}
                </div>

                <!-- mobile-only address row (hidden on desktop) -->
                ${hospital.address ? `<div class="hl-m-addr" style="display:none"><i class="fa-solid fa-location-dot"></i> ${hospital.address}</div>` : ''}

                <div class="hl-metrics">
                  ${(hospital.metrics || []).slice(0, 2).map(metric => `<span>${metric}</span>`).join('')}
                </div>

                <div class="hl-tags">
                  ${(hospital.services || []).map(service => `<span>${service}</span>`).join('')}
                </div>

                <div class="hl-actions">
                  <a href="${urlHospital(hospital)}" class="hl-primary">View Hospital Details →</a>
                  ${hospital.phone ? `<a href="tel:${hospital.phone.replace(/-/g, '')}" class="hl-secondary">
                    <i class="fa-solid fa-phone"></i> Call: ${hospital.phone}
                  </a>` : ''}
                  <!-- mobile-only "View on Map" (hidden on desktop); replaces Call per mobile design -->
                  <a href="https://www.google.com/maps/dir/?api=1&destination=${(hospital.map && hospital.map.lat && hospital.map.lng) ? `${hospital.map.lat},${hospital.map.lng}` : encodeURIComponent((hospital.address || '') + ', ' + (hospital.city || ''))}" target="_blank" rel="noopener noreferrer" class="hl-m-map" style="display:none">View on Map</a>
                </div>
              </div>
            </article>
          `).join('') + `</div>`}
        </div>
      </div>
    `;

    appContainer.innerHTML = html;
    window._allHospitalsFilters = filters;
    window._allHospitalsList = hospitals;
    window._allHospitalsView = 'list';
    updateHospitalDistances();
    appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(getCurrentCity() || 'Kolkata'));

    // ── Mobile filter: FAB button + bottom-sheet overlay ──
    // Clean up any previous mobile filter elements (re-render safe)
    const oldBtn = document.getElementById('filterBtnMobile');
    const oldOverlay = document.getElementById('filterOverlay');
    const oldBackdrop = document.getElementById('filterBackdrop');
    if (oldBtn) oldBtn.remove();
    if (oldOverlay) oldOverlay.remove();
    if (oldBackdrop) oldBackdrop.remove();

    // 1. Create the floating filter button
    const filterBtn = document.createElement('button');
    filterBtn.className = 'filter-btn-mobile';
    filterBtn.innerHTML = '<i class="fa-solid fa-sliders"></i> Filter Hospitals';
    filterBtn.id = 'filterBtnMobile';
    document.body.appendChild(filterBtn);

    // 2. Create the backdrop
    const backdrop = document.createElement('div');
    backdrop.className = 'filter-overlay-backdrop';
    backdrop.id = 'filterBackdrop';
    document.body.appendChild(backdrop);

    // 3. Create the bottom-sheet overlay and clone sidebar filter content into it
    const overlay = document.createElement('div');
    overlay.className = 'filter-overlay';
    overlay.id = 'filterOverlay';

    const sidebar = appContainer.querySelector('.tpl-sidebar');
    if (sidebar) {
      // Close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'filter-overlay-close';
      closeBtn.innerHTML = '✕';
      closeBtn.onclick = function() { window.closeFilter(); };
      overlay.appendChild(closeBtn);

      // Clone all filter groups from the sidebar
      sidebar.querySelectorAll('.tpl-filter-head, .tpl-filter-group').forEach(function(el) {
        overlay.appendChild(el.cloneNode(true));
      });

      // Apply button
      const applyBtn = document.createElement('button');
      applyBtn.className = 'filter-overlay-apply';
      applyBtn.textContent = 'Apply Filters';
      applyBtn.onclick = function() { window.closeFilter(); };
      overlay.appendChild(applyBtn);
    }
    document.body.appendChild(overlay);

    // 4. Wire up the radio buttons inside the overlay to use the same filter logic
    overlay.querySelectorAll('input[type="radio"]').forEach(function(radio) {
      radio.addEventListener('change', function() {
        const name = this.name;
        const value = this.value;
        if (name === 'hosp-type') applyAllHospitalsFilter('type', value);
        else if (name === 'hosp-rating') applyAllHospitalsFilter('rating', parseFloat(value));
        else if (name === 'hosp-accred') applyAllHospitalsFilter('accreditation', value);
        else if (name === 'hosp-serv') applyAllHospitalsFilter('service', value);
      });
    });

    // 5. Toggle logic
    filterBtn.onclick = function() {
      overlay.classList.add('open');
      backdrop.classList.add('open');
    };

    window.closeFilter = function() {
      overlay.classList.remove('open');
      backdrop.classList.remove('open');
    };

    backdrop.onclick = window.closeFilter;
  }

  window.applyAllHospitalsFilter = function(key, value) {
    const filters = Object.assign({}, window._allHospitalsFilters || {}, { [key]: value });
    if (key === 'rating') filters.rating = parseFloat(value);
    renderAllHospitalsPage(filters);
  };

  // =====================================================
  // HOSPITALS NEAR ME
  //   /specialities/:cat/:sub/hospital-near-me/s
  //   /specialities/:cat/:sub/hospital-in-:location/s
  // Lists hospitals close to the user, filtered by the requested specialty.
  // =====================================================
  function renderHospitalsNearMe(catSlug, subSlug, location) {
    showSkeleton('list');
    const city = getCurrentCity();
    const cat = (typeof findCategory === 'function') ? findCategory(catSlug) : null;
    const catName = cat ? cat.name : String(catSlug || '').replace(/-/g, ' ');
    const treatment = (typeof findTreatment === 'function') ? findTreatment(subSlug) : null;
    const subName = treatment ? treatment.name : String(subSlug || '').replace(/-/g, ' ');
    // Pretty location label, e.g. "salt-lake-kolkata" -> "Salt Lake Kolkata".
    const locLabel = location
      ? String(location).replace(/-/g, ' ').replace(/\b\w/g, ch => ch.toUpperCase())
      : city;

    updatePageMeta({
      title: `${subName || catName} Surgery Hospitals near ${locLabel}`,
      description: `Top surgery hospitals near ${locLabel} with expert ${catName} surgeons. Advanced surgical facilities, insurance support & guided admission. Book surgery consultation free.`,
      keywords: `${subName} surgery hospitals ${locLabel}, ${catName} surgeons near me, surgery hospitals near me, book surgery`,
      url: window.location.href
    });


    let hospitals = getHospitalsForCity(city);
    if (catSlug) {
      const filtered = hospitals.filter(h =>
        Array.isArray(h.specialties) &&
        h.specialties.some(s => slugify(s) === catSlug || s.toLowerCase() === catName.toLowerCase())
      );
      if (filtered.length) hospitals = filtered;
    }

    const cards = hospitals.length === 0
      ? `<div class="tpl-empty"><i class="fa-solid fa-hospital"></i><p>No hospitals found near you for this specialty.</p></div>`
      : `<div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:20px;">` + hospitals.map(h => `
          <a href="${urlHospital(h)}" style="display:block; background:#fff; border:1.5px solid #ECE6FF; border-radius:18px; overflow:hidden; text-decoration:none; color:inherit; box-shadow:0 2px 14px rgba(94,64,145,0.06);">
            <div style="height:150px; background:#f0ebff; overflow:hidden;">
              <img loading="lazy" src="${h.image || 'images/about-surgery.webp'}" alt="${h.name}" style="width:100%;height:100%;object-fit:cover;" onerror="this.src='images/about-surgery.webp'">
            </div>
            <div style="padding:18px;">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:8px;">
                <h3 style="font-size:1.02rem; font-weight:800; color:#1a1a2e; margin:0;">${h.name}</h3>
                ${h.rating ? `<span style="white-space:nowrap; color:#5e4091; font-weight:700; font-size:0.85rem;">${h.rating} <i class="fa-solid fa-star" style="color:#fbbf24;"></i></span>` : ''}
              </div>
              <p style="font-size:0.84rem; color:#6b7280; margin:8px 0 12px;"><i class="fa-solid fa-location-dot" style="color:#5e4091;"></i> ${h.address || h.city || ''}</p>
              <span style="display:inline-flex; align-items:center; gap:6px; color:#5e4091; font-weight:700; font-size:0.85rem;">View Hospital <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </a>
        `).join('') + `</div>`;

    appContainer.innerHTML = `
      <div class="tpl-hero" style="background: linear-gradient(120deg, #5e409118 0%, #fff 70%);">
        <div class="container tpl-hero-inner">
          <div class="breadcrumb">
            <a href="/">Home</a> <span>›</span>
            ${cat ? `<a href="${urlCategory(cat.slug)}">${cat.name}</a> <span>›</span>` : ''}
            <span class="breadcrumb-current">Hospitals Near Me</span>
          </div>
          <h1 class="tpl-title">
            <span style="color:#5e4091">${hospitals.length}</span> Hospitals for ${subName || catName} near ${locLabel}
          </h1>
          <p class="tpl-sub">Top hospitals near ${locLabel}${cat ? ` offering ${catName} care` : ''}, with insurance support and guided admission.</p>
        </div>
      </div>
      <div class="container" style="padding:32px 0 80px;">
        ${cards}
      </div>
    `;
    appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(city || 'Kolkata'));
  }

  // Resolve a city name → [lat, lng] using the CITY_DATA table (Kolkata fallback).
  function getCityCoords(cityName) {
    const cd = CITY_DATA.find(c => c.name.toLowerCase() === String(cityName || '').toLowerCase());
    return cd ? [cd.lat, cd.lng] : [22.5726, 88.3639];
  }

  // Toggle the All Hospitals page between List and Map views.
  window.setHospitalsView = function(view) {
    const listEl = document.getElementById('hospitalsListView');
    const emptyEl = document.querySelector('.tpl-cards-col .tpl-empty');
    const mapView = document.getElementById('hospitalsMapView');
    document.querySelectorAll('.hvt-btn').forEach(b => b.classList.toggle('is-active', b.dataset.view === view));
    window._allHospitalsView = view;
    if (view === 'map') {
      if (listEl) listEl.style.display = 'none';
      if (emptyEl) emptyEl.style.display = 'none';
      if (mapView) mapView.style.display = 'block';
      initAllHospitalsMap(window._allHospitalsList || []);
    } else {
      if (mapView) mapView.style.display = 'none';
      if (listEl) listEl.style.display = '';
      if (emptyEl) emptyEl.style.display = '';
    }
  };

  // Build a clustered Leaflet map of all (currently filtered) hospitals.
  function initAllHospitalsMap(hospitals) {
    const el = document.getElementById('allHospitalsMap');
    if (!el || typeof L === 'undefined') return;

    if (window._allHospitalsMap) { window._allHospitalsMap.remove(); window._allHospitalsMap = null; }
    el.innerHTML = '';

    const center = getCityCoords(getCurrentCity());
    const map = L.map(el, { scrollWheelZoom: true }).setView(center, 11);
    map.attributionControl.setPrefix('');
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(map);

    const mapped = hospitals.filter(h => h.map && h.map.lat != null && h.map.lng != null);

    // Cluster nearby markers when the plugin is available; otherwise plot plainly.
    const layer = (typeof L.markerClusterGroup === 'function')
      ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 50 })
      : L.layerGroup();

    mapped.forEach(h => {
      const marker = L.marker([h.map.lat, h.map.lng], { title: h.name });
      marker.bindPopup(`
        <div class="hosp-map-popup">
          <strong>${h.name}</strong>
          <span class="hmp-type">${h.type || ''}</span>
          <span class="hmp-rating">⭐ ${h.rating != null ? h.rating : '—'}${h.reviews ? ` (${h.reviews} reviews)` : ''}</span>
          <a href="${urlHospital(h)}">View Details →</a>
        </div>
      `);
      layer.addLayer(marker);
    });
    map.addLayer(layer);

    if (mapped.length > 1) {
      try { map.fitBounds(L.latLngBounds(mapped.map(h => [h.map.lat, h.map.lng])), { padding: [40, 40], maxZoom: 13 }); }
      catch (e) { /* keep city-centred view */ }
    } else if (mapped.length === 1) {
      map.setView([mapped[0].map.lat, mapped[0].map.lng], 14);
    }

    window._allHospitalsMap = map;
    setTimeout(() => map.invalidateSize(), 160);

    if (!mapped.length) {
      el.insertAdjacentHTML('beforeend', '<div class="hosp-map-overlay-note">No mapped hospital locations for this filter yet.</div>');
    }
  }


  // =====================================================
  // LOCATION MODAL
  // =====================================================

  const CITY_DATA = [
    { name: 'Delhi NCR',  lat: 28.6139, lng: 77.2090, available: true  },
    { name: 'Mumbai',     lat: 19.0760, lng: 72.8777, available: true  },
    { name: 'Kolkata',    lat: 22.5726, lng: 88.3639, available: true  },
    { name: 'Bangalore',  lat: 12.9716, lng: 77.5946, available: true  },
    { name: 'Chennai',    lat: 13.0827, lng: 80.2707, available: false },
    { name: 'Hyderabad',  lat: 17.3850, lng: 78.4867, available: false },
    { name: 'Ahmedabad',  lat: 23.0225, lng: 72.5714, available: false },
    { name: 'Pune',       lat: 18.5204, lng: 73.8567, available: false },
    { name: 'Surat',      lat: 21.1702, lng: 72.8311, available: false },
    { name: 'Jaipur',     lat: 26.9124, lng: 75.7873, available: false },
    { name: 'Lucknow',    lat: 26.8467, lng: 80.9462, available: false },
    { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, available: false },
  ];
