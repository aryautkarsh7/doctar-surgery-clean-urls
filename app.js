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
    } else {
      renderHomePage();
    }
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

      <!-- PREMIUM TREATMENT BROWSER -->
      <section class="treatment-browser" id="categories">
        <img class="treatment-artwork-bg" src="indiaartwork.png" alt="" aria-hidden="true">
        <div class="container">
          <div class="treatment-browser-hero">
            <div class="treatment-copy">
              <div class="treatment-eyebrow">
                <i class="fa-solid fa-star"></i>
                Explore Treatments
              </div>
              <h2>Find the right <span>treatment</span> for you</h2>
              <p>Browse by speciality or condition to discover treatments and expert surgeons.</p>
            </div>
            <div class="treatment-artwork-space" aria-hidden="true"></div>
          </div>
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
          <div class="treatment-showcase-grid">
${treatmentShowcase.map(item => `
              <a href="#/category/${item.slug}" class="treatment-showcase-card" style="--card-accent: ${item.color};">
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
          <div style="text-align:center; margin-top: 36px;">
            <a href="#/categories" class="view-all-cats-btn">
              <i class="fa-solid fa-grid-2"></i> View All Specialities
              <span>→</span>
            </a>
          </div>
          <div id="fp-carousel-root"></div>

        </div>
      </section>

      <!-- DOCTORS SECTION -->
      <section class="container" style="padding: 60px 0;">
        <h2 class="section-title">Our Expert Surgeons</h2>
        <p class="section-subtitle">Highly experienced, board-certified doctors dedicated to your care.</p>
        <div class="doctors-grid">
${DOCTORS.slice(0, 6).map(doc => `
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
          `).join('')}
        </div>
        <div style="text-align:center; margin-top: 36px;">
          <button class="doctors-view-all" onclick="alert('All doctors coming soon')">View All Surgeons →</button>
        </div>
      </section>
    `;

    appContainer.innerHTML = html;
    initFeaturedCarousel();
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
  // RENDER TREATMENT PAGE
  // =====================================================
  function renderTreatmentPage(slug) {
    const treatment = findTreatment(slug);
    if (!treatment) { handleRoute(); return; }
    const category = findCategory(treatment.categorySlug);
    const otherTreatments = (TREATMENTS[treatment.categorySlug] || [])
      .filter(t => t.slug !== slug).slice(0, 3);

    let html = `
      <!-- TREATMENT HERO -->
      <div class="tp-hero" style="--cat-color: ${category.color}; --cat-light: ${category.colorLight};">
        <div class="container">
          <div class="breadcrumb" style="margin-bottom: 20px;">
            <a href="#/">Home</a> <span>›</span>
            <a href="#/category/${category.slug}">${category.name}</a> <span>›</span>
            <span>${treatment.name}</span>
          </div>
          <div class="tp-hero-badge" style="background:${category.colorLight}; color:${category.color};">
            ${category.icon} &nbsp;${category.name}
          </div>
          <h1 class="tp-hero-title">${treatment.name}</h1>
          <p class="tp-hero-brief">${treatment.brief}</p>
        </div>
      </div>

      <!-- MAIN LAYOUT -->
      <div class="container tp-layout">

        <!-- LEFT: CONTENT -->
        <div class="tp-main">

          <!-- QUICK INFO CARDS -->
          <div class="tp-info-cards">
            <div class="tp-info-card">
              <i class="fa-solid fa-indian-rupee-sign" style="color:${category.color};"></i>
              <div>
                <h4>Estimated Cost</h4>
                <p>${treatment.costRange}</p>
              </div>
            </div>
            <div class="tp-info-card">
              <i class="fa-regular fa-clock" style="color:${category.color};"></i>
              <div>
                <h4>Recovery Time</h4>
                <p>${treatment.recovery}</p>
              </div>
            </div>
            <div class="tp-info-card">
              <i class="fa-solid fa-shield-halved" style="color:${category.color};"></i>
              <div>
                <h4>Insurance</h4>
                <p>Covered by most plans</p>
              </div>
            </div>
            <div class="tp-info-card">
              <i class="fa-solid fa-calendar-check" style="color:${category.color};"></i>
              <div>
                <h4>Consultation</h4>
                <p>Free &amp; No Obligation</p>
              </div>
            </div>
          </div>

          <!-- ABOUT THE PROCEDURE -->
          <div class="tp-section">
            <h2>About the Procedure</h2>
            <p>${treatment.procedure}</p>
          </div>

          <!-- KEY BENEFITS -->
          <div class="tp-section">
            <h2>Key Benefits</h2>
            <div class="tp-benefits-grid">
              ${treatment.benefits.map(b => `
                <div class="tp-benefit-item">
                  <i class="fa-solid fa-circle-check" style="color:${category.color};"></i>
                  <span>${b}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- OTHER TREATMENTS FROM CATEGORY -->
          ${otherTreatments.length > 0 ? `
          <div class="tp-section">
            <h2>Other ${category.name} Treatments</h2>
            <div class="tp-related-grid">
              ${otherTreatments.map(t => `
                <a href="#/treatment/${t.slug}" class="tp-related-card" style="border-color:${category.colorLight};">
                  <div class="tp-related-icon" style="background:${category.colorLight}; color:${category.color};">${category.icon}</div>
                  <div>
                    <h4>${t.name}</h4>
                    <p>${t.brief}</p>
                    <span style="color:${category.color}; font-size:13px; font-weight:600;">View Details →</span>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </div>

        <!-- RIGHT: BOOKING SIDEBAR -->
        <div class="tp-sidebar">
          <div class="tp-booking-card" style="--cat-color:${category.color};">
            <div class="tp-booking-header" style="background:${category.color};">
              <i class="fa-solid fa-calendar-check"></i>
              <div>
                <h3>Book Free Consultation</h3>
                <p>For ${treatment.name}</p>
              </div>
            </div>
            <form class="tp-booking-form" onsubmit="event.preventDefault(); alert('Consultation booked! Our care coordinator will call you shortly.');">
              <div class="tp-form-group">
                <label>Patient Name</label>
                <input type="text" class="tp-input" placeholder="Enter full name" required>
              </div>
              <div class="tp-form-group">
                <label>Mobile Number</label>
                <input type="tel" class="tp-input" placeholder="+91 XXXXX XXXXX" required>
              </div>
              <div class="tp-form-group">
                <label>City</label>
                <input type="text" class="tp-input" value="Kolkata" readonly>
              </div>
              <button type="submit" class="tp-submit-btn" style="background:${category.color};">
                <i class="fa-solid fa-phone"></i> Get Free Callback
              </button>
            </form>
            <div class="tp-booking-trust">
              <span><i class="fa-solid fa-lock"></i> 100% Private</span>
              <span><i class="fa-solid fa-shield-halved"></i> Insurance Help</span>
              <span><i class="fa-solid fa-car"></i> Free Cab</span>
            </div>
          </div>

          <!-- HELPLINE CARD -->
          <div class="tp-helpline-card">
            <i class="fa-solid fa-headset" style="color:${category.color}; font-size:28px;"></i>
            <div>
              <h4>24/7 Helpline</h4>
              <a href="tel:+918877772277" style="color:${category.color}; font-weight:700; font-size:16px;">+91-8877772277</a>
            </div>
          </div>
        </div>

      </div>
    `;
    appContainer.innerHTML = html;
  }

  initRouter();
});