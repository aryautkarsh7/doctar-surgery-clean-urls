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
          <div id="fp-carousel-root"></div>
        </div>
      </section>

      <!-- DOCTORS SECTION -->
      <section class="container" style="padding: 60px 0;">
        <h2 class="section-title">Our Expert Surgeons</h2>
        <p class="section-subtitle">Highly experienced, board-certified doctors dedicated to your care.</p>
        <div class="doctors-grid">
${DOCTORS.slice(0, 4).map(doc => `
            <div class="doctor-card">
              <div class="doctor-img" style="background: var(--primary-light); display:flex; align-items:center; justify-content:center; font-size:4rem;">👨‍⚕️</div>
              <div class="doctor-info">
                <h3>${doc.name}</h3>
                <p class="doctor-specialty">${doc.specialty}</p>
                <div class="doctor-stats">
                  <div class="stat"><span>⭐</span> ${doc.rating} (${doc.reviews})</div>
                  <div class="stat"><span>💼</span> ${doc.experience}</div>
                </div>
                <div class="doctor-actions">
                  <button class="btn-secondary" onclick="alert('Profile viewing coming soon')">View Profile</button>
                  <button class="btn-book" onclick="alert('Booking modal coming soon')">Book Visit</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </section>
    `;

    appContainer.innerHTML = html;
    initFeaturedCarousel();
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
    let html = `
      <div class="container">
        <div class="breadcrumb">
          <a href="#/">Home</a> <span>›</span>
          <span>${category.name}</span>
        </div>
        <div class="category-hero">
          <div class="cat-hero-icon" style="background-color: ${category.colorLight}; color: ${category.color};">
            ${category.icon}
          </div>
          <div class="cat-hero-info">
            <h1>${category.name}</h1>
            <p>${category.description}</p>
          </div>
        </div>
        <h2 class="section-title" style="text-align: left; font-size: 1.8rem; margin-bottom: 30px;">
          Available Treatments (${category.treatmentCount})
        </h2>
        <div class="treatments-grid">
          ${treatments.map(t => `
            <div class="treatment-card">
              <h3>${t.name}</h3>
              <p>${t.brief}</p>
              <div class="treatment-meta">
                <span class="meta-item">⏱️ ${t.recovery} Recovery</span>
                <span class="meta-item">💰 ${t.costRange}</span>
              </div>
              <div class="treatment-actions">
                <a href="#/treatment/${t.slug}" class="btn-secondary">Know More</a>
                <button class="btn-book" onclick="alert('Booking modal coming soon')">Book Now</button>
              </div>
            </div>
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
    let html = `
      <div class="container">
        <div class="breadcrumb">
          <a href="#/">Home</a> <span>›</span>
          <a href="#/category/${category.slug}">${category.name}</a> <span>›</span>
          <span>${treatment.name}</span>
        </div>
        <div class="treatment-layout">
          <div class="treatment-main">
            <div class="treatment-header">
              <h1>${treatment.name}</h1>
              <p>${treatment.brief}</p>
            </div>
            <div class="info-blocks">
              <div class="info-block"><h4>Estimated Cost</h4><p>${treatment.costRange}</p></div>
              <div class="info-block"><h4>Recovery Time</h4><p>${treatment.recovery}</p></div>
            </div>
            <div class="content-section">
              <h2>About the Procedure</h2>
              <p>${treatment.procedure}</p>
            </div>
            <div class="content-section">
              <h2>Key Benefits</h2>
              <ul class="benefits-list">
                ${treatment.benefits.map(b => `<li>${b}</li>`).join('')}
              </ul>
            </div>
          </div>
          <div class="treatment-sidebar">
            <div class="booking-card">
              <h3>Book Free Consultation</h3>
              <p>For ${treatment.name}</p>
              <form id="bookingForm" onsubmit="event.preventDefault(); alert('Consultation booked successfully! Our team will contact you shortly.');">
                <div class="form-group"><input type="text" class="form-control" placeholder="Patient Name" required></div>
                <div class="form-group"><input type="tel" class="form-control" placeholder="Mobile Number" required></div>
                <div class="form-group"><input type="text" class="form-control" value="Kolkata" readonly></div>
                <button type="submit" class="btn-submit">Submit Details</button>
              </form>
              <p style="text-align: center; margin-top: 15px; font-size: 0.85rem; opacity: 0.8;">By submitting, you agree to our T&C</p>
            </div>
          </div>
        </div>
      </div>
    `;
    appContainer.innerHTML = html;
  }

  initRouter();
});