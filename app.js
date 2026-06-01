// =====================================================
// DOCTAR Surgery Website — SPA Application Logic
// Handles routing, rendering, and interactions
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');

  function initRouter() {
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  function handleRoute() {
    const hash = window.location.hash || '#/';
    appContainer.innerHTML = '';
    window.scrollTo(0, 0);
    if (hash === '#/') {
      renderHomePage();
    } else if (hash === '#/categories') {
      renderAllCategoriesPage();
    } else if (hash.startsWith('#/category/')) {
      const slug = hash.replace('#/category/', '');
      renderCategoryPage(slug);
    } else if (hash.startsWith('#/treatment/')) {
      const slug = hash.replace('#/treatment/', '');
      renderTreatmentPage(slug);
    } else if (hash.startsWith('#/doctors/')) {
      const catSlug = hash.replace('#/doctors/', '');
      renderDoctorsListingPage(catSlug);
    } else {
      renderHomePage();
    }
  }

  function getDoctorCity(doctor) {
    return (doctor.location || '').split(',').pop().trim();
  }

  function getAvailableDoctorCities() {
    return [...new Set(DOCTORS.map(getDoctorCity).filter(Boolean))];
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
      const matchedCity = availableCities.find(city =>
        candidate.toLowerCase().includes(city.toLowerCase())
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

  // =====================================================
  // RENDER HOMEPAGE
  // =====================================================
  function renderHomePage() {
    const treatmentShowcase = [
      { title: 'Orthopedics', slug: 'orthopedics', image: 'images/service-general.png', icon: 'fa-solid fa-bone', tags: ['Knee', 'Hip', 'Spine'], treatmentCount: 18, color: '#7c3aed' },
      { title: 'Cardiology', slug: 'cardiology', image: 'images/service-cardiac.png', icon: 'fa-solid fa-heart-pulse', tags: ['Angioplasty', 'Bypass', 'Valve'], treatmentCount: 14, color: '#e85d8f' },
      { title: 'Ophthalmology', slug: 'ophthalmology', image: 'images/service-neuro.png', icon: 'fa-solid fa-eye', tags: ['Cataract', 'LASIK', 'Retina'], treatmentCount: 15, color: '#8b5cf6' },
      { title: 'ENT', slug: 'ent', image: 'images/about-surgery.png', icon: 'fa-solid fa-ear-listen', tags: ['Sinus', 'Ear', 'Tonsils'], treatmentCount: 12, color: '#fb923c' },
      { title: 'Gynecology', slug: 'gynaecology', image: 'images/service-general.png', icon: 'fa-solid fa-venus', tags: ['Fibroid', 'PCOS', 'Pregnancy'], treatmentCount: 16, color: '#e879c4' },
      { title: 'Urology', slug: 'urology', image: 'images/service-neuro.png', icon: 'fa-solid fa-kit-medical', tags: ['Kidney Stone', 'Prostate', 'UTI'], treatmentCount: 14, color: '#60a5fa' },
      { title: 'General Surgery', slug: 'laparoscopy', image: 'images/service-general.png', icon: 'fa-solid fa-stethoscope', tags: ['Hernia', 'Gallstone', 'Appendix'], treatmentCount: 20, color: '#34d399' },
      { title: 'Cosmetic & Skin', slug: 'aesthetics', image: 'images/about-surgery.png', icon: 'fa-solid fa-wand-magic-sparkles', tags: ['Hair', 'Skin', 'Weight Loss'], treatmentCount: 11, color: '#a78bfa' },
      { title: 'Proctology', slug: 'proctology', image: 'images/service-general.png', icon: 'fa-solid fa-stethoscope', tags: ['Piles', 'Fissure', 'Fistula'], treatmentCount: 5, color: '#8B4513' },
      { title: 'Vascular', slug: 'vascular', image: 'images/service-cardiac.png', icon: 'fa-solid fa-droplet', tags: ['Varicose Veins', 'DVT', 'AV Fistula'], treatmentCount: 6, color: '#dc2626' },
      { title: 'Fertility', slug: 'fertility', image: 'images/service-general.png', icon: 'fa-solid fa-baby', tags: ['IVF', 'IUI', 'Egg Freezing'], treatmentCount: 6, color: '#9f1239' },
      { title: 'Weight Loss', slug: 'weight-loss', image: 'images/about-surgery.png', icon: 'fa-solid fa-weight-scale', tags: ['Bariatric', 'Gastric Balloon', 'Liposuction'], treatmentCount: 3, color: '#65a30d' },
    ];

    const treatmentTrust = [
      { icon: 'fa-solid fa-shield-halved', title: 'USFDA Approved', subtitle: 'Procedures' },
      { icon: 'fa-solid fa-hospital', title: '150+ Clinics', subtitle: 'Pan India' },
      { icon: 'fa-solid fa-wallet', title: 'No Cost EMI', subtitle: 'Easy Payment Options' },
      { icon: 'fa-solid fa-car', title: 'Free Cab', subtitle: 'Home to Hospital' },
      { icon: 'fa-solid fa-clipboard-check', title: 'Insurance Covered', subtitle: 'Top Providers' },
    ];

    const popularProcedures = [
      { id: 'p1', name: 'Knee Replacement', slug: 'knee-replacement', specialty: 'Orthopedics', image: 'images/service-general.png', rating: '4.8', reviews: '1,245', recovery: '2 - 4 weeks' },
      { id: 'p2', name: 'Cataract Surgery', slug: 'cataract-surgery', specialty: 'Ophthalmology', image: 'images/service-neuro.png', rating: '4.9', reviews: '980', recovery: '3 - 7 days' },
      { id: 'p3', name: 'Angioplasty', slug: 'angioplasty', specialty: 'Cardiology', image: 'images/service-cardiac.png', rating: '4.7', reviews: '1,150', recovery: '1 - 3 days' },
      { id: 'p4', name: 'Gallstone Surgery', slug: 'gallbladder-removal', specialty: 'General Surgery', image: 'images/about-surgery.png', rating: '4.6', reviews: '870', recovery: '3 - 5 days' },
      { id: 'p5', name: 'Hair Transplant', slug: 'hair-transplant', specialty: 'Cosmetic Surgery', image: 'images/service-general.png', rating: '4.8', reviews: '1,320', recovery: '7 - 10 days' },
    ];

    window.popularProcedures = popularProcedures;
    const currentCity = getCurrentCity();
    const homeDoctors = getDoctorsForCity(currentCity);
    const isCitySpecific = homeDoctors.some(doc =>
      getDoctorCity(doc).toLowerCase() === currentCity.toLowerCase()
    );
    const doctorsHeading = isCitySpecific ? `Expert Surgeons in ${currentCity}` : 'Our Expert Surgeons';
    const doctorsSubtitle = isCitySpecific
      ? `Highly experienced, board-certified doctors available near you in ${currentCity}.`
      : 'Highly experienced, board-certified doctors dedicated to your care.';

    let html = `
      <!-- HERO SECTION -->
      <section class="hero-new">
        <div class="container hero-new-inner">
          <div class="hero-left">
            <div class="hero-eyebrow">
              <i class="fa-solid fa-shield-halved"></i> India's Trusted Surgical Network
            </div>
            <h1 class="hero-title-new">
              Simplifying Surgery<br>
              <span>Experience in India</span>
            </h1>
            <p class="hero-sub-new">
              Book appointments with expert surgeons near you. Free consultation, cab drop & zero-cost EMI across 150+ clinics.
            </p>
            <div class="hero-trust-points">
              <div class="hero-tp"><i class="fa-solid fa-circle-check"></i><span>Consultation for 50+ diseases across India</span></div>
              <div class="hero-tp"><i class="fa-solid fa-circle-check"></i><span>In-person & online with expert doctors</span></div>
              <div class="hero-tp"><i class="fa-solid fa-circle-check"></i><span>Insurance covered & No Cost EMI</span></div>
            </div>
            <a href="tel:+918877772277" class="hero-call-btn">
              <i class="fa-solid fa-phone"></i> Call Us: +91-8877772277
            </a>
          </div>
          <div class="hero-right">
            <div class="hero-form-card">
              <div class="hero-form-header">
                <i class="fa-solid fa-calendar-check"></i>
                <h3>Book FREE Doctor Appointment</h3>
              </div>
              <div class="hero-form-body">
                <input type="text" class="hero-input" placeholder="Patient Name" />
                <input type="tel" class="hero-input" placeholder="Mobile Number" />
                <div class="hero-select-wrap">
                  <select class="hero-input hero-select">
                    <option value="" disabled selected>Select Disease</option>
                    ${POPULAR_TREATMENTS.map(t => `<option value="${t.slug}">${t.name}</option>`).join('')}
                  </select>
                  <i class="fa-solid fa-chevron-down hero-select-icon"></i>
                </div>
                <button class="hero-submit-btn" onclick="alert('Our team will contact you shortly!')">
                  <i class="fa-solid fa-calendar-check"></i> Book Free Appointment
                </button>
                <p class="hero-form-note">
                  <i class="fa-solid fa-lock"></i> 100% Private & Confidential
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="hero-stats-bar">
          <div class="hero-stat"><span>3M+</span><p>Happy Patients</p></div>
          <div class="hero-stat"><span>250K+</span><p>Surgeries Done</p></div>
          <div class="hero-stat"><span>150+</span><p>Clinics Pan India</p></div>
          <div class="hero-stat"><span>100+</span><p>Expert Surgeons</p></div>
          <div class="hero-stat"><span>50+</span><p>Cities Covered</p></div>
          <div class="hero-stat"><span>4.9★</span><p>Patient Rating</p></div>
        </div>
      </section>

      <!-- TREATMENT BROWSER -->
      <section class="treatment-browser" id="categories">
        <!-- Kolkata city background image -->
        <div class="tb-city-bg" style="background-image: url('images/image 708.png');"></div>

        <div class="container tb-inner">
          <!-- Header row -->
          <div class="tb-header">
            <div class="tb-copy">
              <div class="treatment-eyebrow">
                <i class="fa-solid fa-star"></i> Explore Treatments
              </div>
              <h2 class="tb-title">Find the right <span>treatment</span> for you</h2>
              <p class="tb-sub">Browse by speciality or condition to discover treatments and expert surgeons.</p>
            </div>
            <!-- Arrow buttons -->
            <div class="tb-arrows">
              <button class="tb-arrow" id="tb-prev" aria-label="Previous">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <button class="tb-arrow" id="tb-next" aria-label="Next">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Trust bar -->
          <div class="treatment-trust-bar">
${treatmentTrust.map(item => `
            <div class="treatment-trust-item">
              <div class="trust-icon"><i class="${item.icon}"></i></div>
              <div>
                <h4>${item.title}</h4>
                <p>${item.subtitle}</p>
              </div>
            </div>
          `).join('')}
          </div>

          <!-- Carousel track -->
          <div class="tb-carousel-wrap">
            <div class="tb-track" id="tb-track">
${treatmentShowcase.map(item => `
              <a href="#/category/${item.slug}" class="treatment-showcase-card tb-card" style="--card-accent: ${item.color};">
                <div class="treatment-visual">
                  <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="treatment-content">
                  <h3>${item.title}</h3>
                  <div class="treatment-tags">${item.tags.map(tag => `<span>${tag}</span>`).join('<b>•</b>')}</div>
                  <div class="treatment-pill">${item.treatmentCount} Treatments</div>
                  <div class="treatment-explore">Explore <span>→</span></div>
                </div>
              </a>
`).join('')}
            </div>
          </div>

          <div style="text-align:center; margin-top: 32px;">
            <a href="#/categories" class="view-all-cats-btn">
              <i class="fa-solid fa-grid-2"></i> View All Specialities <span>→</span>
            </a>
          </div>
          <div id="fp-carousel-root"></div>
        </div>
      </section>

      <!-- DOCTORS SECTION -->
      <section class="treatment-browser ds-section" id="doctors-section">
        <div class="tb-city-bg" style="background-image: url('images/image 708.png'); opacity: 0.30;"></div>
        <div class="container tb-inner">
          <!-- Header row — same as Explore Treatments -->
          <div class="tb-header">
            <div class="tb-copy">
              <div class="treatment-eyebrow">
                <i class="fa-solid fa-user-doctor"></i> Expert Surgeons
              </div>
              <h2 class="tb-title">${doctorsHeading}</h2>
              <p class="tb-sub">${doctorsSubtitle}</p>
            </div>
            <div class="tb-arrows">
              <button class="tb-arrow" id="ds-prev" aria-label="Previous">
                <i class="fa-solid fa-chevron-left"></i>
              </button>
              <button class="tb-arrow" id="ds-next" aria-label="Next">
                <i class="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Carousel track -->
          <div class="tb-carousel-wrap">
            <div class="tb-track" id="ds-track">
${homeDoctors.slice(0, 8).map(doc => `
              <div class="ds-doc-card tb-card">
                <!-- TOP: photo + name + specialty + rating -->
                <div class="ds-card-top">
                  <div class="ds-photo-wrap">
                    <img src="${doc.image}" alt="${doc.name}" class="ds-photo" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                    <div class="ds-photo-fallback" style="display:none">👨‍⚕️</div>
                    <img src="home screen section/verified.png" class="ds-verified" alt="verified">
                  </div>
                  <div class="ds-top-info">
                    <h3 class="ds-doc-name">${doc.name}</h3>
                    <p class="ds-specialty">${doc.specialty}</p>
                    <div class="ds-rating-row">
                      <img src="home screen section/Calendar.png" class="ds-star-icon" alt="rating">
                      <span class="ds-rating-val">${doc.rating}</span>
                      <span class="ds-divider">|</span>
                      <span class="ds-reviews">${doc.reviews} Reviews</span>
                    </div>
                  </div>
                </div>

                <!-- DIVIDER -->
                <div class="ds-divider-line"></div>

                <!-- MIDDLE: info rows -->
                <div class="ds-info-rows">
                  <div class="ds-info-row">
                    <div class="ds-info-icon-wrap">
                      <img src="home screen section/Calendar.png" alt="experience">
                    </div>
                    <span class="ds-info-label">Experience</span>
                    <span class="ds-info-val">${doc.experience}</span>
                  </div>
                  <div class="ds-info-row">
                    <div class="ds-info-icon-wrap">
                      <img src="home screen section/ruppe.png" alt="fee">
                    </div>
                    <span class="ds-info-label">Consultation Fee</span>
                    <span class="ds-info-val">₹${doc.fee.toLocaleString('en-IN')}</span>
                  </div>
                  <div class="ds-info-row">
                    <div class="ds-info-icon-wrap">
                      <img src="home screen section/languane.png" alt="language">
                    </div>
                    <span class="ds-info-label">Language</span>
                    <span class="ds-info-val">${doc.language}</span>
                  </div>
                </div>

                <!-- BOTTOM: buttons -->
                <div class="ds-card-actions">
                  <button class="ds-btn-profile" onclick="alert('Profile coming soon')">View Profile</button>
                  <button class="ds-btn-book" onclick="alert('Booking coming soon')">
                    <img src="home screen section/Icon.png" alt="" class="ds-btn-icon"> Book Appointment
                  </button>
                </div>
              </div>
`).join('')}
            </div>
          </div>

          <div style="text-align:center; margin-top: 32px;">
            <button class="doctors-view-all" onclick="alert('All doctors coming soon')">
              View All Surgeons →
            </button>
          </div>
        </div>
      </section>
    `;

    appContainer.innerHTML = html;
    initFeaturedCarousel();
    initTreatmentCarousel();
    initCarousel('ds-track', 'ds-prev', 'ds-next', 3);
  }

  // =====================================================
  // RENDER ALL CATEGORIES PAGE
  // =====================================================
  function renderAllCategoriesPage() {
    const totalTreatments = CATEGORIES.reduce((sum, c) => sum + c.treatmentCount, 0);

    const html = `
      <!-- ALL CATEGORIES HERO -->
      <div class="all-cat-hero">
        <div class="container all-cat-hero-inner">
          <div class="breadcrumb" style="margin-bottom: 20px;">
            <a href="#/">Home</a> <span>›</span>
            <span>All Specialities</span>
          </div>
          <div class="all-cat-eyebrow">
            <i class="fa-solid fa-grid-2"></i> Browse All Specialities
          </div>
          <h1 class="all-cat-title">Find Your <span>Treatment</span></h1>
          <p class="all-cat-sub">Explore ${CATEGORIES.length} specialities and ${totalTreatments}+ treatments. Expert surgeons, free consultations &amp; insurance support across 150+ clinics in India.</p>
          <div class="all-cat-stats-row">
            <div class="all-cat-stat"><span>${CATEGORIES.length}</span><p>Specialities</p></div>
            <div class="all-cat-stat"><span>${totalTreatments}+</span><p>Treatments</p></div>
            <div class="all-cat-stat"><span>150+</span><p>Clinics</p></div>
            <div class="all-cat-stat"><span>Free</span><p>Consultation</p></div>
          </div>
        </div>
      </div>

      <!-- TRUST STRIP -->
      <div class="cat-trust-strip">
        <div class="container cat-trust-inner">
          <div class="cat-trust-item"><i class="fa-solid fa-shield-halved"></i><span>USFDA Approved Procedures</span></div>
          <div class="cat-trust-item"><i class="fa-solid fa-car"></i><span>Free Cab Service</span></div>
          <div class="cat-trust-item"><i class="fa-solid fa-wallet"></i><span>No Cost EMI</span></div>
          <div class="cat-trust-item"><i class="fa-solid fa-clipboard-check"></i><span>Insurance Covered</span></div>
        </div>
      </div>

      <!-- ALL CATEGORIES GRID -->
      <div class="container all-cat-grid-section">
        <div class="all-cat-section-header">
          <h2>All Specialities <span class="cat-count-badge">${CATEGORIES.length}</span></h2>
          <p>Click on a speciality to see all available treatments, costs, and doctors.</p>
        </div>
        <div class="all-cat-main-grid">
          ${CATEGORIES.map(cat => `
            <a href="#/category/${cat.slug}" class="all-cat-card" style="--acc: ${cat.color}; --acc-light: ${cat.colorLight};">
              <div class="acc-icon-wrap" style="background: ${cat.colorLight}; color: ${cat.color};">
                <span class="acc-emoji">${cat.icon}</span>
              </div>
              <div class="acc-body">
                <h3 class="acc-name">${cat.name}</h3>
                <p class="acc-desc">${cat.description}</p>
                <div class="acc-tags">
                  ${cat.tags.map(t => `<span class="acc-tag" style="border-color:${cat.color}; color:${cat.color};">${t}</span>`).join('')}
                </div>
                <div class="acc-footer">
                  <span class="acc-count" style="background:${cat.colorLight}; color:${cat.color};">
                    <i class="fa-solid fa-list-check"></i> ${cat.treatmentCount} Treatments
                  </span>
                  <span class="acc-explore" style="color:${cat.color};">Explore →</span>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;
    appContainer.innerHTML = html;
  }

  // =====================================================
  // FEATURED CAROUSEL COMPONENT LOGIC
  // =====================================================
  function initTreatmentCarousel() {
    initCarousel('tb-track', 'tb-prev', 'tb-next', 3);
  }

  function initCarousel(trackId, prevId, nextId, visible) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevId);
    const nextBtn = document.getElementById(nextId);
    if (!track || !prevBtn || !nextBtn) return;

    let index = 0;
    const cards = track.querySelectorAll('.tb-card');
    const total = cards.length;

    function getCardWidth() {
      if (!cards[0]) return 0;
      return cards[0].offsetWidth + 20; // 20 = gap
    }

    function update() {
      track.style.transform = `translateX(-${index * getCardWidth()}px)`;
      prevBtn.style.opacity = index === 0 ? '0.4' : '1';
      nextBtn.style.opacity = index >= total - visible ? '0.4' : '1';
    }

    prevBtn.addEventListener('click', () => { if (index > 0) { index--; update(); } });
    nextBtn.addEventListener('click', () => { if (index < total - visible) { index++; update(); } });
    update();
  }

  function initFeaturedCarousel() {
    const root = document.getElementById('fp-carousel-root');
    if (!root) return;

    const procedures = [...window.popularProcedures];

    const html = `
      <div class="fp-new-section">
        <div class="fp-new-header">
          <div class="fp-header-left">
            <div class="fp-icon-badge"><i class="fa-regular fa-star"></i></div>
            <div class="fp-header-text">
              <h3>Popular Procedures</h3>
              <p>Most searched and booked treatments across India</p>
            </div>
          </div>
          <a href="#/" class="fp-view-all">View All Procedures →</a>
        </div>
        <div class="fp-equal-grid">
          ${procedures.map(p => `
            <a href="#/treatment/${p.slug}" class="fp-eq-card">
              <div class="fp-eq-icon-area">
                <i class="fa-solid fa-stethoscope"></i>
                <span class="fp-eq-specialty-tag">${p.specialty}</span>
              </div>
              <div class="fp-eq-body">
                <div class="fp-eq-name">${p.name}</div>
                <div class="fp-eq-meta"><i class="fa-solid fa-star"></i><span>${p.rating} (${p.reviews} reviews)</span></div>
                <div class="fp-eq-meta"><i class="fa-regular fa-clock"></i><span>Recovery ${p.recovery}</span></div>
                <div class="fp-eq-btn">Learn More →</div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;

    root.innerHTML = html;
  }

  // =====================================================
  // RENDER CATEGORY PAGE
  // =====================================================
  function renderCategoryPage(slug) {
    const category = findCategory(slug);
    if (!category) { handleRoute(); return; }
    const treatments = TREATMENTS[slug] || [];
    const relatedDoctors = getDoctorsForCategory(slug).slice(0, 3);

    let html = `
      <!-- CATEGORY HERO BANNER -->
      <div class="cat-page-hero" style="--cat-color: ${category.color}; --cat-light: ${category.colorLight};">
        <div class="container cat-page-hero-inner">
          <div class="breadcrumb" style="margin-bottom: 20px;">
            <a href="#/">Home</a> <span>›</span>
            <span>${category.name}</span>
          </div>
          <div class="cat-hero-badge" style="background: ${category.colorLight}; color: ${category.color};">
            ${category.icon} &nbsp;${category.name}
          </div>
          <h1 class="cat-page-title">${category.name} Treatments</h1>
          <p class="cat-page-desc">${category.description}</p>
          <div class="cat-page-tags">
            ${category.tags.map(tag => `<span class="cat-tag" style="border-color:${category.color}; color:${category.color};">${tag}</span>`).join('')}
          </div>
          <div class="cat-page-stats">
            <div class="cat-stat"><span>${category.treatmentCount}+</span><p>Treatments</p></div>
            <div class="cat-stat"><span>${relatedDoctors.length > 0 ? relatedDoctors.length + '+' : '10+'}</span><p>Expert Surgeons</p></div>
            <div class="cat-stat"><span>4.8★</span><p>Avg. Rating</p></div>
            <div class="cat-stat"><span>Free</span><p>Consultation</p></div>
          </div>
        </div>
      </div>

      <!-- TRUST BAR -->
      <div class="cat-trust-strip">
        <div class="container cat-trust-inner">
          <div class="cat-trust-item"><i class="fa-solid fa-shield-halved"></i><span>USFDA Approved Procedures</span></div>
          <div class="cat-trust-item"><i class="fa-solid fa-car"></i><span>Free Cab Service</span></div>
          <div class="cat-trust-item"><i class="fa-solid fa-wallet"></i><span>No Cost EMI</span></div>
          <div class="cat-trust-item"><i class="fa-solid fa-clipboard-check"></i><span>Insurance Covered</span></div>
        </div>
      </div>

      <!-- TREATMENTS GRID -->
      <div class="container" style="padding: 50px 0 80px;">
        <div class="cat-section-header">
          <h2>All ${category.name} Treatments <span class="cat-count-badge">${treatments.length}</span></h2>
          <p>Click any treatment to see full details, cost, and book a free consultation.</p>
        </div>

        <div class="cat-treatments-grid">
          ${treatments.map((t, i) => `
            <a href="#/treatment/${t.slug}" class="cat-treatment-card" style="--card-color: ${category.color}; --card-light: ${category.colorLight};">
              <div class="ctc-top">
                <div class="ctc-icon" style="background: ${category.colorLight}; color: ${category.color};">
                  ${category.icon}
                </div>
                <div class="ctc-badge" style="color: ${category.color};">${category.name}</div>
              </div>
              <h3 class="ctc-name">${t.name}</h3>
              <p class="ctc-brief">${t.brief}</p>
              <div class="ctc-meta">
                <span><i class="fa-regular fa-clock"></i> ${t.recovery}</span>
                <span><i class="fa-solid fa-indian-rupee-sign"></i> ${t.costRange}</span>
              </div>
              <div class="ctc-cta" style="background: ${category.color};">
                View Details &nbsp;→
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;
    appContainer.innerHTML = html;
  }


  // =====================================================
  // RENDER TREATMENT PAGE (doctar.in listing style)
  // =====================================================
  function renderTreatmentPage(slug, filters) {
    const treatment = findTreatment(slug);
    if (!treatment) { handleRoute(); return; }
    const category = findCategory(treatment.categorySlug);

    filters = filters || { availability: 'all', rating: 0, fee: 'all', experience: 'all', gender: 'all' };

    let doctors = getDoctorsForCategory(treatment.categorySlug);

    // Apply filters
    if (filters.rating > 0)            doctors = doctors.filter(d => d.rating >= filters.rating);
    if (filters.gender !== 'all')       doctors = doctors.filter(d => (d.gender || 'male') === filters.gender);
    if (filters.availability === 'today') doctors = doctors.filter(d => d.nextSlot);
    if (filters.fee === 'under1000')    doctors = doctors.filter(d => d.fee < 1000);
    if (filters.fee === '1000-2000')    doctors = doctors.filter(d => d.fee >= 1000 && d.fee <= 2000);
    if (filters.fee === 'above2000')    doctors = doctors.filter(d => d.fee > 2000);
    if (filters.experience === '0-10')  doctors = doctors.filter(d => parseInt(d.experience) <= 10);
    if (filters.experience === '10-20') doctors = doctors.filter(d => parseInt(d.experience) > 10 && parseInt(d.experience) <= 20);
    if (filters.experience === '20+')   doctors = doctors.filter(d => parseInt(d.experience) > 20);

    const allDoctors = getDoctorsForCategory(treatment.categorySlug);

    const html = `
      <!-- TOP HERO STRIP -->
      <div class="tpl-hero" style="background: linear-gradient(120deg, ${category.color}18 0%, #fff 70%);">
        <div class="container tpl-hero-inner">
          <div class="breadcrumb">
            <a href="#/">Home</a> <span>›</span>
            <a href="#/category/${category.slug}">${category.name}</a> <span>›</span>
            <span>${treatment.name}</span>
          </div>
          <h1 class="tpl-title">
            <span style="color:${category.color}">${allDoctors.length} Verified</span> ${treatment.name} Surgeons in Kolkata
          </h1>
          <p class="tpl-sub">Expert ${treatment.name} specialists in Kolkata. Book verified surgeons available for in-clinic consultations with free consultation, insurance support &amp; cab service.</p>
          <div class="tpl-trust-row">
            <span class="tpl-badge"><i class="fa-solid fa-circle-check" style="color:${category.color}"></i> Licensed &amp; Verified</span>
            <span class="tpl-badge"><i class="fa-solid fa-hospital" style="color:${category.color}"></i> In-Clinic Available</span>
            <span class="tpl-badge"><i class="fa-solid fa-headset" style="color:${category.color}"></i> 24/7 On-Call Service</span>
            <span class="tpl-badge"><i class="fa-solid fa-car" style="color:${category.color}"></i> Free Cab</span>
          </div>
          <!-- Quick info pills -->
          <div class="tpl-info-pills">
            <span class="tpl-pill"><i class="fa-solid fa-indian-rupee-sign"></i> ${treatment.costRange}</span>
            <span class="tpl-pill"><i class="fa-regular fa-clock"></i> ${treatment.recovery} Recovery</span>
            <span class="tpl-pill"><i class="fa-solid fa-shield-halved"></i> Insurance Covered</span>
            <span class="tpl-pill"><i class="fa-solid fa-calendar-check"></i> Free Consultation</span>
          </div>
        </div>
      </div>

      <!-- MAIN: SIDEBAR + CARDS -->
      <div class="container tpl-layout">

        <!-- LEFT SIDEBAR: FILTERS -->
        <aside class="tpl-sidebar">
          <div class="tpl-filter-head">
            <i class="fa-solid fa-sliders"></i> Filter Doctors
            <button class="tpl-reset-btn" onclick="window._tplFilters={}; renderTreatmentPageGlobal('${slug}')">Reset All</button>
          </div>

          <div class="tpl-filter-group">
            <h4>Availability</h4>
            <label class="tpl-radio"><input type="radio" name="tpl-avail" value="all" ${filters.availability==='all'?'checked':''} onchange="applyTPLFilter('${slug}','availability','all')"> Any Time</label>
            <label class="tpl-radio"><input type="radio" name="tpl-avail" value="today" ${filters.availability==='today'?'checked':''} onchange="applyTPLFilter('${slug}','availability','today')"> Available Today</label>
          </div>

          <div class="tpl-filter-group">
            <h4>Minimum Rating</h4>
            ${[4.5,4.0,3.5,3.0].map(r=>`
              <label class="tpl-radio"><input type="radio" name="tpl-rating" value="${r}" ${filters.rating===r?'checked':''} onchange="applyTPLFilter('${slug}','rating',${r})"> ${r}+ ⭐</label>
            `).join('')}
            <label class="tpl-radio"><input type="radio" name="tpl-rating" value="0" ${filters.rating===0?'checked':''} onchange="applyTPLFilter('${slug}','rating',0)"> Any Rating</label>
          </div>

          <div class="tpl-filter-group">
            <h4>Consultation Fee</h4>
            <label class="tpl-radio"><input type="radio" name="tpl-fee" value="all" ${filters.fee==='all'?'checked':''} onchange="applyTPLFilter('${slug}','fee','all')"> Any</label>
            <label class="tpl-radio"><input type="radio" name="tpl-fee" value="under1000" ${filters.fee==='under1000'?'checked':''} onchange="applyTPLFilter('${slug}','fee','under1000')"> Under ₹1,000</label>
            <label class="tpl-radio"><input type="radio" name="tpl-fee" value="1000-2000" ${filters.fee==='1000-2000'?'checked':''} onchange="applyTPLFilter('${slug}','fee','1000-2000')"> ₹1,000 – ₹2,000</label>
            <label class="tpl-radio"><input type="radio" name="tpl-fee" value="above2000" ${filters.fee==='above2000'?'checked':''} onchange="applyTPLFilter('${slug}','fee','above2000')"> Above ₹2,000</label>
          </div>

          <div class="tpl-filter-group">
            <h4>Experience</h4>
            <label class="tpl-radio"><input type="radio" name="tpl-exp" value="all" ${filters.experience==='all'?'checked':''} onchange="applyTPLFilter('${slug}','experience','all')"> Any</label>
            <label class="tpl-radio"><input type="radio" name="tpl-exp" value="0-10" ${filters.experience==='0-10'?'checked':''} onchange="applyTPLFilter('${slug}','experience','0-10')"> 0–10 yrs</label>
            <label class="tpl-radio"><input type="radio" name="tpl-exp" value="10-20" ${filters.experience==='10-20'?'checked':''} onchange="applyTPLFilter('${slug}','experience','10-20')"> 10–20 yrs</label>
            <label class="tpl-radio"><input type="radio" name="tpl-exp" value="20+" ${filters.experience==='20+'?'checked':''} onchange="applyTPLFilter('${slug}','experience','20+')"> 20+ yrs</label>
          </div>

          <div class="tpl-filter-group">
            <h4>Doctor Gender</h4>
            <label class="tpl-radio"><input type="radio" name="tpl-gender" value="all" ${filters.gender==='all'?'checked':''} onchange="applyTPLFilter('${slug}','gender','all')"> Any</label>
            <label class="tpl-radio"><input type="radio" name="tpl-gender" value="male" ${filters.gender==='male'?'checked':''} onchange="applyTPLFilter('${slug}','gender','male')"> Male</label>
            <label class="tpl-radio"><input type="radio" name="tpl-gender" value="female" ${filters.gender==='female'?'checked':''} onchange="applyTPLFilter('${slug}','gender','female')"> Female</label>
          </div>

          <!-- About procedure box in sidebar -->
          <div class="tpl-about-box" style="border-color:${category.colorLight};">
            <h4 style="color:${category.color};">About ${treatment.name}</h4>
            <p>${treatment.brief}</p>
          </div>
        </aside>

        <!-- RIGHT: DOCTOR CARDS -->
        <div class="tpl-cards-col">
          <div class="tpl-results-bar">
            <span><strong>${doctors.length}</strong> surgeon${doctors.length !== 1 ? 's' : ''} found for <em>${treatment.name}</em></span>
            <span class="tpl-sort-label">Sort: <strong>Relevance</strong> ▾</span>
          </div>

          ${doctors.length === 0 ? `
            <div class="tpl-empty">
              <i class="fa-solid fa-user-doctor"></i>
              <p>No doctors match your filters. Try adjusting them.</p>
            </div>
          ` : `<div class="doctors-grid tpl-doctors-grid">` + doctors.map(doc => `
            <div class="doctor-card">
              <div class="dc-top">
                <div class="dc-avatar">👨‍⚕️</div>
                <div class="dc-header-info">
                  <h3 class="dc-name">${doc.name}</h3>
                  <span class="dc-specialty-badge">🩺 ${doc.specialty}</span>
                  <p class="dc-degree">${doc.degree}</p>
                  <div class="dc-meta">
                    <span class="dc-rating">⭐ ${doc.rating} (${doc.reviews} Reviews)</span>
                    <span class="dc-dot">•</span>
                    <span class="dc-exp">👥 ${doc.experience} Experience</span>
                  </div>
                </div>
              </div>
              <div class="dc-middle">
                <div class="dc-fee-box">
                  <div class="dc-fee">₹${doc.fee.toLocaleString('en-IN')}</div>
                  <div class="dc-fee-label">Consultation fee</div>
                  <div class="dc-mode">🏥 In - Clinic</div>
                </div>
                <div class="dc-avail-box">
                  <div class="dc-avail-status"><span class="dc-avail-dot"></span> Available</div>
                  <div class="dc-avail-label">Today Next Slot</div>
                  <div class="dc-next-slot">🕐 ${doc.nextSlot}</div>
                </div>
              </div>
              <div class="dc-hospital">
                <span class="dc-hosp-icon">🏢</span>
                <div>
                  <div class="dc-hosp-name">${doc.hospital}</div>
                  <div class="dc-hosp-loc">📍 ${doc.location}</div>
                </div>
              </div>
              <div class="dc-slots">
                <span class="dc-slots-label">Available Slots</span>
                <div class="dc-slots-list">
                  ${doc.slots.map(s => `<span class="dc-slot">🕐 ${s}</span>`).join('')}
                  <span class="dc-slot dc-slot-more">+ 2 More</span>
                </div>
              </div>
              <div class="dc-actions">
                <button class="dc-btn-book" onclick="alert('Booking coming soon')">📅 Book Appointment</button>
                <button class="dc-btn-call" onclick="alert('Calling coming soon')">📞 Call</button>
              </div>
            </div>
          `).join('') + `</div>`}

          <!-- FAQ SECTION -->
          <div class="tpl-faq-section">
            <h2>Frequently Asked Questions</h2>
            <p class="tpl-faq-sub">Everything you need to know about ${treatment.name} in Kolkata</p>
            ${[
              { q: `How do I find the best ${treatment.name} surgeon in Kolkata?`, a: `Use the filters above to narrow by rating, experience, and fee. All our surgeons are board-certified with proven expertise in ${treatment.name}.` },
              { q: `What is the cost of ${treatment.name} in Kolkata?`, a: `The estimated cost ranges from ${treatment.costRange}. This may vary based on the hospital, surgeon experience, and complexity of your case.` },
              { q: `How long is the recovery after ${treatment.name}?`, a: `Typical recovery time is ${treatment.recovery}. Your surgeon will give you a personalised recovery plan during your consultation.` },
              { q: `Is ${treatment.name} covered by insurance?`, a: `Yes, ${treatment.name} is covered by most major health insurance plans. Our team handles all paperwork and claims processing for a cashless experience.` },
              { q: `Is the consultation free?`, a: `Yes, the first consultation with our surgeons is completely free. Book an appointment above or call our 24/7 helpline.` },
            ].map((faq, i) => `
              <div class="tpl-faq-item" onclick="this.classList.toggle('open')">
                <div class="tpl-faq-q">
                  <span>${faq.q}</span>
                  <i class="fa-solid fa-chevron-down tpl-faq-icon"></i>
                </div>
                <div class="tpl-faq-a">${faq.a}</div>
              </div>
            `).join('')}
          </div>

        </div>
      </div>
    `;

    appContainer.innerHTML = html;
    window._tplFilters = filters;
    window._tplSlug = slug;
  }

  // Called by filter radio buttons on treatment page
  window.applyTPLFilter = function(slug, key, value) {
    const filters = Object.assign({}, window._tplFilters || {}, { [key]: value });
    if (key === 'rating') filters.rating = parseFloat(value);
    renderTreatmentPage(slug, filters);
  };

  window.renderTreatmentPageGlobal = function(slug) {
    renderTreatmentPage(slug, {});
  };

  // =====================================================
  // RENDER DOCTORS LISTING PAGE
  // =====================================================
  function renderDoctorsListingPage(catSlug, filters) {
    const category = findCategory(catSlug);
    if (!category) { handleRoute(); return; }

    filters = filters || { availability: 'all', rating: 0, fee: 'all', experience: 'all', gender: 'all' };

    let doctors = getDoctorsForCategory(catSlug);

    // Apply filters
    if (filters.rating > 0) doctors = doctors.filter(d => d.rating >= filters.rating);
    if (filters.gender !== 'all') doctors = doctors.filter(d => (d.gender || 'male') === filters.gender);
    if (filters.availability === 'today') doctors = doctors.filter(d => d.nextSlot);
    if (filters.fee === 'under1000') doctors = doctors.filter(d => d.fee < 1000);
    if (filters.fee === '1000-2000') doctors = doctors.filter(d => d.fee >= 1000 && d.fee <= 2000);
    if (filters.fee === 'above2000') doctors = doctors.filter(d => d.fee > 2000);
    if (filters.experience === '0-10') doctors = doctors.filter(d => parseInt(d.experience) <= 10);
    if (filters.experience === '10-20') doctors = doctors.filter(d => parseInt(d.experience) > 10 && parseInt(d.experience) <= 20);
    if (filters.experience === '20+') doctors = doctors.filter(d => parseInt(d.experience) > 20);

    const html = `
      <!-- LISTING HERO -->
      <div class="dl-hero" style="background: linear-gradient(135deg, ${category.color}15 0%, #fff 60%);">
        <div class="container dl-hero-inner">
          <div class="breadcrumb" style="margin-bottom:14px;">
            <a href="#/">Home</a> <span>›</span>
            <a href="#/category/${category.slug}">${category.name}</a> <span>›</span>
            <span>Surgeons</span>
          </div>
          <h1 class="dl-hero-title">
            <span style="color:${category.color}">${doctors.length} Verified</span> ${category.name} Surgeons in Kolkata
          </h1>
          <p class="dl-hero-sub">Board-certified specialists with proven expertise. Free consultation, insurance support &amp; cab service.</p>
          <div class="dl-trust-badges">
            <span class="dl-badge"><i class="fa-solid fa-circle-check" style="color:${category.color}"></i> Licensed &amp; Verified</span>
            <span class="dl-badge"><i class="fa-solid fa-hospital" style="color:${category.color}"></i> In-Clinic Available</span>
            <span class="dl-badge"><i class="fa-solid fa-headset" style="color:${category.color}"></i> 24/7 On-Call Service</span>
          </div>
        </div>
      </div>

      <!-- LAYOUT: SIDEBAR + CARDS -->
      <div class="container dl-layout">

        <!-- LEFT SIDEBAR: FILTERS -->
        <aside class="dl-sidebar">
          <div class="dl-filter-header">
            <i class="fa-solid fa-sliders"></i> Filter Doctors
          </div>

          <div class="dl-filter-group">
            <h4>Availability</h4>
            <label class="dl-radio"><input type="radio" name="avail" value="all" ${filters.availability==='all'?'checked':''} onchange="applyDLFilter('${catSlug}','availability','all')"> Any Time</label>
            <label class="dl-radio"><input type="radio" name="avail" value="today" ${filters.availability==='today'?'checked':''} onchange="applyDLFilter('${catSlug}','availability','today')"> Available Today</label>
          </div>

          <div class="dl-filter-group">
            <h4>Minimum Rating</h4>
            ${[4.5,4.0,3.5,3.0].map(r => `
              <label class="dl-radio"><input type="radio" name="rating" value="${r}" ${filters.rating===r?'checked':''} onchange="applyDLFilter('${catSlug}','rating',${r})"> ${r}+ ⭐</label>
            `).join('')}
            <label class="dl-radio"><input type="radio" name="rating" value="0" ${filters.rating===0?'checked':''} onchange="applyDLFilter('${catSlug}','rating',0)"> Any Rating</label>
          </div>

          <div class="dl-filter-group">
            <h4>Consultation Fee</h4>
            <label class="dl-radio"><input type="radio" name="fee" value="all" ${filters.fee==='all'?'checked':''} onchange="applyDLFilter('${catSlug}','fee','all')"> Any</label>
            <label class="dl-radio"><input type="radio" name="fee" value="under1000" ${filters.fee==='under1000'?'checked':''} onchange="applyDLFilter('${catSlug}','fee','under1000')"> Under ₹1,000</label>
            <label class="dl-radio"><input type="radio" name="fee" value="1000-2000" ${filters.fee==='1000-2000'?'checked':''} onchange="applyDLFilter('${catSlug}','fee','1000-2000')"> ₹1,000 – ₹2,000</label>
            <label class="dl-radio"><input type="radio" name="fee" value="above2000" ${filters.fee==='above2000'?'checked':''} onchange="applyDLFilter('${catSlug}','fee','above2000')"> Above ₹2,000</label>
          </div>

          <div class="dl-filter-group">
            <h4>Experience</h4>
            <label class="dl-radio"><input type="radio" name="exp" value="all" ${filters.experience==='all'?'checked':''} onchange="applyDLFilter('${catSlug}','experience','all')"> Any</label>
            <label class="dl-radio"><input type="radio" name="exp" value="0-10" ${filters.experience==='0-10'?'checked':''} onchange="applyDLFilter('${catSlug}','experience','0-10')"> 0–10 yrs</label>
            <label class="dl-radio"><input type="radio" name="exp" value="10-20" ${filters.experience==='10-20'?'checked':''} onchange="applyDLFilter('${catSlug}','experience','10-20')"> 10–20 yrs</label>
            <label class="dl-radio"><input type="radio" name="exp" value="20+" ${filters.experience==='20+'?'checked':''} onchange="applyDLFilter('${catSlug}','experience','20+')"> 20+ yrs</label>
          </div>

          <div class="dl-filter-group">
            <h4>Doctor Gender</h4>
            <label class="dl-radio"><input type="radio" name="gender" value="all" ${filters.gender==='all'?'checked':''} onchange="applyDLFilter('${catSlug}','gender','all')"> Any</label>
            <label class="dl-radio"><input type="radio" name="gender" value="male" ${filters.gender==='male'?'checked':''} onchange="applyDLFilter('${catSlug}','gender','male')"> Male</label>
            <label class="dl-radio"><input type="radio" name="gender" value="female" ${filters.gender==='female'?'checked':''} onchange="applyDLFilter('${catSlug}','gender','female')"> Female</label>
          </div>
        </aside>

        <!-- RIGHT: DOCTOR CARDS -->
        <div class="dl-cards">
          <div class="dl-results-bar">
            <span><strong>${doctors.length}</strong> surgeons found</span>
            <span class="dl-sort">Sort by: <strong>Relevance</strong> ▾</span>
          </div>

          ${doctors.length === 0 ? `
            <div class="dl-empty">
              <i class="fa-solid fa-user-doctor" style="font-size:3rem; color:#ccc;"></i>
              <p>No doctors match your filters. Try adjusting them.</p>
            </div>
          ` : doctors.map(doc => `
            <div class="dl-card">
              <div class="dl-card-left">
                <div class="dl-card-avatar">👨‍⚕️</div>
              </div>
              <div class="dl-card-body">
                <div class="dl-card-top">
                  <div>
                    <h3 class="dl-doc-name">${doc.name}</h3>
                    <span class="dl-doc-badge" style="background:${category.colorLight}; color:${category.color};">🩺 ${doc.specialty}</span>
                    <p class="dl-doc-degree">${doc.degree}</p>
                    <div class="dl-doc-meta">
                      <span>⭐ ${doc.rating} <span style="color:#aaa;">(${doc.reviews} reviews)</span></span>
                      <span class="dl-sep">•</span>
                      <span>👥 ${doc.experience} experience</span>
                    </div>
                  </div>
                  <div class="dl-card-fee-block">
                    <div class="dl-fee">₹${doc.fee.toLocaleString('en-IN')}</div>
                    <div class="dl-fee-label">Consultation fee</div>
                    <div class="dl-clinic-mode">🏥 In-Clinic</div>
                  </div>
                </div>

                <div class="dl-hospital-row">
                  <span class="dl-hosp-icon">🏢</span>
                  <div>
                    <span class="dl-hosp-name">${doc.hospital}</span>
                    <span class="dl-hosp-loc"> &nbsp;📍 ${doc.location}</span>
                  </div>
                </div>

                <div class="dl-avail-row">
                  <div class="dl-avail-left">
                    <span class="dl-avail-status"><span class="dl-avail-dot"></span> Available Today</span>
                    <span class="dl-next-slot">Next Slot: <strong>${doc.nextSlot}</strong></span>
                  </div>
                  <div class="dl-slots">
                    ${doc.slots.map(s => `<span class="dl-slot">🕐 ${s}</span>`).join('')}
                    <span class="dl-slot dl-slot-more">+2 More</span>
                  </div>
                </div>

                <div class="dl-card-actions">
                  <button class="dl-btn-book" style="background:${category.color};" onclick="alert('Booking coming soon')">
                    <i class="fa-solid fa-calendar-check"></i> Book Appointment
                  </button>
                  <button class="dl-btn-call" style="color:${category.color}; border-color:${category.color};" onclick="alert('Calling coming soon')">
                    <i class="fa-solid fa-phone"></i> Call
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    appContainer.innerHTML = html;

    // Store current filters on window for filter changes
    window._dlFilters = filters;
  }

  // Called by filter radio buttons
  window.applyDLFilter = function(catSlug, key, value) {
    const filters = Object.assign({}, window._dlFilters || {}, { [key]: value });
    // parse numeric rating
    if (key === 'rating') filters.rating = parseFloat(value);
    renderDoctorsListingPage(catSlug, filters);
  };

  initRouter();
});
