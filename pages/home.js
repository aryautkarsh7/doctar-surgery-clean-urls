// =====================================================
// HOME PAGE
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================

  // =====================================================
  // RENDER HOMEPAGE
  // =====================================================
  async function renderHomePage() {
    showSkeleton('home');
    updatePageMeta({
      title: 'City Surgical Directories Across India',
      description: 'Explore city surgical care directories across India. Find local healthcare and hospital information for major Indian cities.',
      keywords: 'surgery directories, healthcare India, local healthcare directories, surgical clinics',
      url: 'https://surgery.doctar.in'
    });

    const currentCity = getCurrentCity();

    const patientReviews = [
      {
        name: 'Riya Sharma',
        photo: 'https://randomuser.me/api/portraits/women/44.jpg',
        city: 'Kolkata', consultation: 'Orthopedics Consultation', hospital: 'Apollo Hospitals',
        review: 'Booking through Doctar was incredibly smooth. The hospital information was transparent and the doctor consultation was scheduled within minutes.'
      },
      {
        name: 'Arjun Banerjee',
        photo: 'https://randomuser.me/api/portraits/men/32.jpg',
        city: 'Kolkata', consultation: 'Cardiology Consultation', hospital: 'Fortis Hospital',
        review: 'The entire process from finding a specialist to treatment was seamless. Highly recommended.'
      },
      {
        name: 'Priya Das',
        photo: 'https://randomuser.me/api/portraits/women/68.jpg',
        city: 'Kolkata', consultation: 'Gynecology Consultation', hospital: 'AMRI Hospital',
        review: 'Very easy appointment booking and excellent follow-up support after treatment.'
      },
    ];

    let html = `
      <!-- HERO SECTION -->
      <section class="hero-new">
        <div class="container">
          <div class="hero-card">
            <div class="hero-card-grid"></div>
            <div class="hero-card-content" style="text-align:center; padding: 40px 20px;">
              <div class="hero-pill" style="margin: 0 auto 20px auto; display: inline-flex; align-items: center; gap: 6px; background: rgba(94, 64, 145, 0.08); color: #5e4091; border-radius: 999px; padding: 6px 14px; font-size: 0.8rem; font-weight: 700;">
                <span class="hero-pill-dot" style="width: 8px; height: 8px; border-radius: 50%; background: #5e4091; display: inline-block;"></span>
                DOCTAR CITIES DIRECTORY
              </div>
              <h1 class="hero-headline" style="margin-bottom: 20px; font-size: 2.8rem; font-weight: 800; color: #111827;">
                Find Surgical Care<br>
                Across <span style="color: #5e4091;">India</span>
              </h1>
              <p class="hero-tagline" style="margin: 0 auto 40px auto; max-width: 600px; color: #4b5563; font-size: 1.1rem; line-height: 1.6;">
                Explore surgical care availability, partner clinics, and coverage networks in major Indian cities. Select your city below to get started.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CITIES DIRECTORY -->
      <section class="cities-section" id="cities-section" style="padding: 60px 0; background: #faf9ff;">
        <div class="container">
          <div class="cities-header" style="text-align:center; margin-bottom:40px;">
            <h2 style="font-size:2.2rem; font-weight:800; color:#5e4091; margin-bottom:12px;">Supported <span>Cities & Regions</span></h2>
            <p style="color:#666; font-size:1.1rem; max-width:600px; margin:0 auto;">Switch your active location to browse city-specific healthcare availability.</p>
          </div>
          <div class="cities-grid" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(180px, 1fr)); gap:20px;">
            ${['Kolkata', 'Delhi NCR', 'Mumbai', 'Bangalore', 'Chennai', 'Hyderabad', 'Ahmedabad', 'Pune', 'Surat', 'Jaipur', 'Lucknow', 'Chandigarh', 'Deoghar', 'Bokaro', 'Patna', 'Indore', 'Bhopal', 'Guwahati', 'Bhubaneshwar', 'Cochin'].map(city => `
              <div class="city-card" style="background:#fff; border:1.5px solid #ECE6FF; border-radius:16px; padding:24px 16px; text-align:center; cursor:pointer; box-shadow:0 4px 12px rgba(94,64,145,0.03); transition:all 0.25s;" onmouseenter="this.style.transform='translateY(-4px)';this.style.boxShadow='0 12px 30px rgba(94,64,145,0.12)';this.style.borderColor='#5e4091';" onmouseleave="this.style.transform='';this.style.boxShadow='0 4px 12px rgba(94,64,145,0.03)';this.style.borderColor='#ECE6FF';" onclick="window.reloadCityData && window.reloadCityData('${city}')">
                <div style="width:48px; height:48px; border-radius:50%; background:#f0ebff; display:flex; align-items:center; justify-content:center; margin:0 auto 14px auto; color:#5e4091; font-size:1.2rem;">
                  <i class="fa-solid fa-location-dot"></i>
                </div>
                <span style="font-weight:700; color:#1f2937; font-size:1.05rem; display:block;">${city}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- PATIENT REVIEWS SECTION -->
      <section class="pr-section" id="patient-reviews" style="padding: 60px 0;">
        <div class="container pr-inner">
          <div class="pr-header pr-fade-in" style="text-align:center; margin-bottom:40px;">
            <div class="pr-eyebrow" style="margin:0 auto 10px auto;"><i class="fa-solid fa-users"></i> Patient Reviews</div>
            <h2 class="pr-title">Trusted by Thousands of Patients</h2>
            <p class="pr-subtitle" style="margin:0 auto;">Real experiences from patients who booked services through Doctar.</p>
          </div>

          <div class="pr-reviews-wrap">
            <button class="pr-nav-btn pr-nav-prev" id="pr-prev" aria-label="Previous review">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <div class="pr-reviews-viewport" id="pr-reviews-viewport">
              <div class="pr-reviews-track" id="pr-reviews-track">
                ${patientReviews.map((r, i) => `
                <div class="pr-review-card" style="background:#fff; border:1.5px solid #ECE6FF; border-radius:22px; padding:26px 24px; display:flex; flex-direction:column; gap:14px; box-shadow:0 2px 18px rgba(94, 64, 145,0.07); transition:transform 0.25s, box-shadow 0.25s;" onmouseenter="this.style.transform='translateY(-5px)';this.style.boxShadow='0 14px 40px rgba(94, 64, 145,0.14)'" onmouseleave="this.style.transform='';this.style.boxShadow='0 2px 18px rgba(94, 64, 145,0.07)'">
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="display:inline-flex; align-items:center; gap:6px; background:#f0ebff; color:#5e4091; border-radius:999px; padding:5px 13px; font-size:0.73rem; font-weight:700;">
                      <i class="fa-solid fa-circle-check"></i> Verified Patient
                    </span>
                    <i class="fa-solid fa-quote-left" style="color:#d8d0f7; font-size:1.4rem;"></i>
                  </div>
                  <div style="display:flex; align-items:center; gap:14px;">
                    <div style="width:50px; height:50px; min-width:50px; border-radius:50%; background:linear-gradient(135deg,#5e4091,#5e4091); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1rem; font-weight:700; box-shadow:0 2px 10px rgba(94, 64, 145,0.25);">
                      ${r.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div style="font-size:1rem; font-weight:700; color:#111827; margin-bottom:3px;">${r.name}</div>
                      <div style="color:#fbbf24; font-size:0.9rem; letter-spacing:2px;">★★★★★</div>
                    </div>
                  </div>
                  <p style="font-size:0.9rem; color:#374151; line-height:1.75; margin:0; flex:1;">${r.review}</p>
                </div>`).join('')}
              </div>
            </div>
            <button class="pr-nav-btn pr-nav-next" id="pr-next" aria-label="Next review">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </section>

      <!-- DOCTAR.IN CTA BANNER -->
      <section class="db-banner-section" style="padding-bottom: 60px;">
        <div class="container">
          <div class="db-banner">
            <div class="db-banner-glow"></div>
            <div class="db-banner-content">
              <div class="db-banner-badge"><i class="fa-solid fa-globe"></i> Powered by Doctar.in</div>
              <h2 class="db-banner-title">Looking for Surgical Specialists &amp; Care?</h2>
              <p class="db-banner-sub">Doctar is India's leading healthcare network — book consultations, diagnostics, hospitals and specialists across 30+ cities on our main platform.</p>
            </div>
            <a href="https://doctar.in" target="_blank" rel="noopener noreferrer" class="db-banner-btn">
              Visit Doctar.in <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </section>
    `;

    appContainer.innerHTML = html;
    appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(currentCity));
    initPatientReviews();
  }

  function initPatientReviews() {
    const viewport = document.getElementById('pr-reviews-viewport');
    const prevBtn = document.getElementById('pr-prev');
    const nextBtn = document.getElementById('pr-next');
    const dots = document.querySelectorAll('.pr-dot');
    if (!viewport || !prevBtn || !nextBtn) return;

    let currentSlide = 0;
    const totalSlides = dots.length || 3;

    function isMobile() { return window.innerWidth < 768; }

    function goToSlide(n) {
      if (!isMobile()) return;
      currentSlide = ((n % totalSlides) + totalSlides) % totalSlides;
      const cards = viewport.querySelectorAll('.pr-review-card');
      if (cards[currentSlide]) {
        cards[currentSlide].scrollIntoView({ behavior: 'smooth', inline: 'start', block: 'nearest' });
      }
      dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));
    dots.forEach((dot, i) => dot.addEventListener('click', () => goToSlide(i)));

    viewport.addEventListener('scroll', () => {
      if (!isMobile()) return;
      const cards = viewport.querySelectorAll('.pr-review-card');
      let closest = 0, minDist = Infinity;
      const vpLeft = viewport.getBoundingClientRect().left;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.getBoundingClientRect().left - vpLeft);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      if (closest !== currentSlide) {
        currentSlide = closest;
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
      }
    }, { passive: true });

    // Counter animation on scroll
    const metricsEl = document.querySelector('.pr-metrics');
    if (metricsEl) {
      let counted = false;
      new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting || counted) return;
        counted = true;
        metricsEl.querySelectorAll('[data-pr-count]').forEach(el => {
          const target = parseInt(el.dataset.prCount, 10);
          const startTime = performance.now();
          const duration = 1600;
          function tick(now) {
            const p = Math.min((now - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target).toLocaleString('en-IN');
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        });
      }, { threshold: 0.3 }).observe(metricsEl);
    }

    // Fade-in on scroll
    document.querySelectorAll('.pr-section .pr-fade-in').forEach(el => {
      new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, { threshold: 0.1 }).observe(el);
    });
  }

  function getHospitalMapCenter(hospitals) {
    const mappedHospitals = hospitals.filter(hospital => hospital.map && hospital.map.lat && hospital.map.lng);
    if (!mappedHospitals.length) return [22.5726, 88.3639];

    const lat = mappedHospitals.reduce((sum, hospital) => sum + hospital.map.lat, 0) / mappedHospitals.length;
    const lng = mappedHospitals.reduce((sum, hospital) => sum + hospital.map.lng, 0) / mappedHospitals.length;
    return [lat, lng];
  }

  function createHospitalMarkerIcon(isActive) {
    return L.divIcon({
      className: `fh-live-marker${isActive ? ' is-active' : ''}`,
      html: '<span><i class="fa-solid fa-hospital"></i></span>',
      iconSize: [42, 42],
      iconAnchor: [21, 21],
      popupAnchor: [0, -20],
    });
  }

  function setFeaturedHospitalMarkerActive(slug) {
    if (typeof L === 'undefined') return;

    const markers = window._featuredHospitalMarkers || {};

    Object.keys(markers).forEach(markerSlug => {
      const marker = markers[markerSlug];
      marker.setIcon(createHospitalMarkerIcon(markerSlug === slug));
    });
  }

  function initFeaturedHospitalMap(hospitals, city) {
    const mapEl = document.getElementById('featuredHospitalMap');
    if (!mapEl) return;

    if (typeof L === 'undefined') {
      mapEl.closest('.fh-map-panel')?.classList.add('map-unavailable');
      return;
    }

    if (window._featuredHospitalMap) {
      window._featuredHospitalMap.remove();
      window._featuredHospitalMap = null;
      window._featuredHospitalMarkers = {};
    }

    const mappedHospitals = hospitals.filter(hospital => hospital.map && hospital.map.lat && hospital.map.lng);
    const center = getHospitalMapCenter(mappedHospitals);
    const map = L.map(mapEl, {
      zoomControl: true,
      scrollWheelZoom: false,
      attributionControl: true,
    }).setView(center, 12);

    map.attributionControl.setPrefix('');

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(map);

    window._featuredHospitalMap = map;
    window._featuredHospitalMarkers = {};

    mappedHospitals.forEach(hospital => {
      const marker = L.marker([hospital.map.lat, hospital.map.lng], {
        icon: createHospitalMarkerIcon(false),
        title: hospital.name,
      }).addTo(map);

      marker.bindPopup(`
        <div class="fh-map-popup">
          <strong>${hospital.name}</strong>
          <span>${hospital.address}</span>
          <a href="${urlHospital(hospital)}">View Hospital →</a>
        </div>
      `);

      marker.on('mouseover', () => {
        setFeaturedHospitalMarkerActive(hospital.slug);
        marker.openPopup();
      });

      marker.on('mouseout', () => {
        setFeaturedHospitalMarkerActive(null);
      });

      window._featuredHospitalMarkers[hospital.slug] = marker;
    });

    if (mappedHospitals.length > 1) {
      const bounds = L.latLngBounds(mappedHospitals.map(hospital => [hospital.map.lat, hospital.map.lng]));
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 13 });
    }

    setTimeout(() => map.invalidateSize(), 120);
  }

  function initHospitalMapHover() {
    const cards = document.querySelectorAll('[data-hospital-card]');
    if (!cards.length) return;

    const clearActivePins = () => {
      document.querySelectorAll('[data-hospital-pin]').forEach(pin => pin.classList.remove('is-active'));
      setFeaturedHospitalMarkerActive(null);
    };

    cards.forEach(card => {
      const slug = card.getAttribute('data-hospital-card');
      const pin = document.querySelector(`[data-hospital-pin="${slug}"]`);

      card.addEventListener('mouseenter', () => {
        clearActivePins();
        if (pin) pin.classList.add('is-active');
        setFeaturedHospitalMarkerActive(slug);
      });

      card.addEventListener('mouseleave', clearActivePins);
    });
  }

  window.highlightHospitalPin = function(slug) {
    const mapDetails = document.querySelector('.fh-map-details');
    if (mapDetails) mapDetails.open = true;

    const map = document.querySelector('.fh-map-panel');
    const pin = document.querySelector(`[data-hospital-pin="${slug}"]`);
    if (!map) return;

    document.querySelectorAll('[data-hospital-pin]').forEach(item => item.classList.remove('is-active'));
    if (pin) pin.classList.add('is-active');

    setFeaturedHospitalMarkerActive(slug);
    const marker = window._featuredHospitalMarkers && window._featuredHospitalMarkers[slug];
    if (window._featuredHospitalMap && marker) {
      window._featuredHospitalMap.setView(marker.getLatLng(), 14, { animate: true });
      marker.openPopup();
      setTimeout(() => window._featuredHospitalMap.invalidateSize(), 100);
    }

    map.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  window.centerHospitalMapOnCity = function() {
    const map = window._featuredHospitalMap;
    if (!map) return;

    const markers = Object.values(window._featuredHospitalMarkers || {});
    if (markers.length > 1) {
      const bounds = L.latLngBounds(markers.map(marker => marker.getLatLng()));
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 13 });
    }
  };

  // =====================================================
  // RENDER ALL CATEGORIES PAGE
