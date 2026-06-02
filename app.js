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
    } else if (hash === '#/doctors') {
      renderAllDoctorsPage();
    } else if (hash === '#/hospitals') {
      renderAllHospitalsPage();
    } else if (hash === '#/categories') {
      renderAllCategoriesPage();
    } else if (hash === '#/procedures') {
      renderAllProceduresPage();
    } else if (hash.startsWith('#/category/')) {
      const slug = hash.replace('#/category/', '');
      renderCategoryPage(slug);
    } else if (hash.startsWith('#/treatment/')) {
      const slug = hash.replace('#/treatment/', '');
      renderTreatmentPage(slug);
    } else if (hash.startsWith('#/doctor/')) {
      const docSlug = hash.replace('#/doctor/', '');
      renderDoctorProfilePage(docSlug);
    } else if (hash.startsWith('#/hospital/')) {
      const hospitalSlug = hash.replace('#/hospital/', '');
      renderHospitalDetailPage(hospitalSlug);
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

  function getHospitalsForCity(city) {
    const cityHospitals = HOSPITALS.filter(hospital =>
      hospital.city.toLowerCase() === city.toLowerCase()
    );

    return cityHospitals.length > 0 ? cityHospitals : HOSPITALS;
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
    const featuredHospitals = getHospitalsForCity(currentCity);

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
        <div class="container hero-new-inner">
          <div class="hero-left">
            <div class="hero-eyebrow">
              <i class="fa-solid fa-shield-halved"></i> ${currentCity}'s Trusted Surgical Network
            </div>
            <h1 class="hero-title-new">
              Simplifying Surgery<br>
              <span>Experience in ${currentCity}</span>
            </h1>
            <p class="hero-sub-new">
              Book appointments with expert surgeons in ${currentCity}. Free consultation, cab drop & zero-cost EMI across 150+ clinics.
            </p>
            <div class="hero-trust-points">
              <div class="hero-tp"><i class="fa-solid fa-circle-check"></i><span>Consultation for 50+ diseases in ${currentCity}</span></div>
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
              <h2 class="tb-title">Find the right <span>treatment</span> in ${currentCity}</h2>
              <p class="tb-sub">Browse by speciality or condition to discover treatments and expert surgeons in ${currentCity}.</p>
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
                      <span class="ds-star-icon">⭐</span>
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
                  <button class="ds-btn-profile" onclick="window.location.hash='#/doctor/${doc.slug}'">View Profile</button>
                  <button class="ds-btn-book" onclick="window.location.hash='#/doctor/${doc.slug}'">
                    <img src="home screen section/Icon.png" alt="" class="ds-btn-icon"> Book Appointment
                  </button>
                </div>
              </div>
`).join('')}
            </div>
          </div>

          <div style="text-align:center; margin-top: 32px;">
            <button class="doctors-view-all" onclick="window.location.hash='#/doctors'">
              View All Surgeons →
            </button>
          </div>
        </div>
      </section>

      <!-- FEATURED HOSPITALS SECTION -->
      <section class="featured-hospitals-section" id="featured-hospitals">
        <div class="fh-city-bg" style="background-image: url('images/image 708.png');"></div>
        <div class="container fh-inner">
          <div class="fh-header">
            <div>
              <div class="treatment-eyebrow">
                <i class="fa-solid fa-hospital"></i> Featured Hospitals
              </div>
              <h2 class="tb-title">Featured Hospitals in ${currentCity}</h2>
              <p class="tb-sub">Verified partner hospitals and surgical clinics with modern OT facilities, insurance support, and guided admission.</p>
            </div>
            <div class="fh-header-actions">
              <a href="tel:+918877772277" class="fh-call-btn">
                <i class="fa-solid fa-phone"></i> Talk to Care Expert
              </a>
              <button class="fh-view-all-btn" onclick="window.location.hash='#/hospitals'">
                View All Hospitals
              </button>
            </div>
          </div>

          <div class="fh-layout">
            <details class="fh-map-details" open>
              <summary>View hospital map</summary>
              <div class="fh-map-panel" aria-label="Featured hospital locations in ${currentCity}">
                <div id="featuredHospitalMap" class="fh-live-map"></div>
                <button type="button" class="fh-location-btn" onclick="centerHospitalMapOnCity()" aria-label="Center map on ${currentCity}">
                  <i class="fa-solid fa-location-crosshairs"></i>
                </button>
                <div class="fh-map-fallback">
                  <i class="fa-solid fa-map-location-dot"></i>
                  <span>Loading live hospital map...</span>
                </div>
              </div>
            </details>

            <div class="fh-cards">
              ${featuredHospitals.map(hospital => `
                <article class="fh-card" data-hospital-card="${hospital.slug}">
                  <div class="fh-card-media">
                    <img src="${hospital.image}" alt="${hospital.name}" onerror="this.src='images/about-surgery.png'">
                  </div>
                  <div class="fh-card-body">
                    <div class="fh-card-top">
                      <h3>${hospital.name}</h3>
                      <span class="fh-rating">${hospital.rating} <i class="fa-solid fa-star"></i></span>
                    </div>
                    <div class="fh-meta">
                      <span><i class="fa-solid fa-location-dot"></i> ${hospital.address}</span>
                      <span><i class="fa-solid fa-route"></i> ${hospital.distance}</span>
                      <span><i class="fa-solid fa-user-doctor"></i> ${hospital.type}</span>
                    </div>
                    <div class="fh-metrics">
                      ${hospital.metrics.slice(0, 2).map(metric => `<span>${metric}</span>`).join('')}
                    </div>
                    <div class="fh-services">
                      ${hospital.services.map(service => `<span>${service}</span>`).join('')}
                    </div>
                    <div class="fh-card-actions">
                      <a href="#/hospital/${hospital.slug}" class="fh-card-primary">View Hospital →</a>
                      <button type="button" class="fh-card-secondary" onclick="highlightHospitalPin('${hospital.slug}')">View on Map</button>
                    </div>
                  </div>
                </article>
              `).join('')}
            </div>
          </div>
        </div>
      </section>

      <!-- PATIENT REVIEWS SECTION -->
      <section class="pr-section" id="patient-reviews">
        <div class="container pr-inner">

          <div class="pr-header pr-fade-in">
            <div class="pr-eyebrow"><i class="fa-solid fa-users"></i> Patient Reviews</div>
            <h2 class="pr-title">Trusted by Thousands of Patients</h2>
            <p class="pr-subtitle">Real experiences from patients who booked consultations, treatments, diagnostics, and healthcare services through <strong>Doctar.</strong></p>
          </div>

          <div class="pr-trust-banner pr-fade-in pr-delay-1">
            <div class="pr-trust-rating">
              <div class="pr-trust-shield-wrap"><i class="fa-solid fa-shield-halved"></i></div>
              <div class="pr-trust-score">
                <div class="pr-score-main">
                  <span class="pr-score-num">4.8/5</span>
                  <span class="pr-score-stars">★★★★★</span>
                </div>
                <div class="pr-score-label">Average Rating</div>
                <div class="pr-score-sub">Trusted by <strong>10,000+</strong> patients across India</div>
              </div>
            </div>
            <div class="pr-trust-sep"></div>
            <div class="pr-trust-indicators">
              <div class="pr-trust-ind">
                <div class="pr-trust-ind-icon"><i class="fa-solid fa-shield-halved"></i></div>
                <span>Verified<br>Reviews</span>
              </div>
              <div class="pr-trust-ind">
                <div class="pr-trust-ind-icon"><i class="fa-solid fa-hospital"></i></div>
                <span>Partner<br>Hospitals</span>
              </div>
              <div class="pr-trust-ind">
                <div class="pr-trust-ind-icon"><i class="fa-solid fa-user-doctor"></i></div>
                <span>Expert<br>Doctors</span>
              </div>
            </div>
          </div>

          <div class="pr-reviews-wrap">
            <button class="pr-nav-btn pr-nav-prev" id="pr-prev" aria-label="Previous review">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <div class="pr-reviews-viewport" id="pr-reviews-viewport">
              <div class="pr-reviews-track" id="pr-reviews-track">
                ${patientReviews.map((r, i) => `
                <div style="background:#fff; border:1.5px solid #ECE6FF; border-radius:22px; padding:26px 24px; display:flex; flex-direction:column; gap:14px; box-shadow:0 2px 18px rgba(109,59,255,0.07); transition:transform 0.25s, box-shadow 0.25s;" onmouseenter="this.style.transform='translateY(-5px)';this.style.boxShadow='0 14px 40px rgba(109,59,255,0.14)'" onmouseleave="this.style.transform='';this.style.boxShadow='0 2px 18px rgba(109,59,255,0.07)'">
                  <!-- Top row -->
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="display:inline-flex; align-items:center; gap:6px; background:#f0ebff; color:#6D3BFF; border-radius:999px; padding:5px 13px; font-size:0.73rem; font-weight:700;">
                      <i class="fa-solid fa-circle-check"></i> Verified Patient
                    </span>
                    <i class="fa-solid fa-quote-left" style="color:#d8d0f7; font-size:1.4rem;"></i>
                  </div>
                  <!-- Patient -->
                  <div style="display:flex; align-items:center; gap:14px;">
                    <div style="width:50px; height:50px; min-width:50px; border-radius:50%; background:linear-gradient(135deg,#7551B3,#6D3BFF); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1rem; font-weight:700; box-shadow:0 2px 10px rgba(109,59,255,0.25);">
                      ${r.name.split(' ').map(w=>w[0]).join('').slice(0,2)}
                    </div>
                    <div>
                      <div style="font-size:1rem; font-weight:700; color:#111827; margin-bottom:3px;">${r.name}</div>
                      <div style="color:#fbbf24; font-size:0.9rem; letter-spacing:2px;">★★★★★</div>
                    </div>
                  </div>
                  <!-- Review text -->
                  <p style="font-size:0.9rem; color:#374151; line-height:1.75; margin:0; flex:1;">${r.review}</p>
                  <!-- Meta -->
                  <div style="border-top:1px solid #f3f0fb; padding-top:14px; display:flex; flex-direction:column; gap:6px;">
                    <div style="display:flex; flex-wrap:wrap; gap:12px;">
                      <span style="display:inline-flex; align-items:center; gap:5px; font-size:0.77rem; color:#6b7280; font-weight:500;"><i class="fa-solid fa-stethoscope" style="color:#6D3BFF;"></i> ${r.consultation}</span>
                      <span style="display:inline-flex; align-items:center; gap:5px; font-size:0.77rem; color:#6b7280; font-weight:500;"><i class="fa-solid fa-hospital" style="color:#6D3BFF;"></i> ${r.hospital}</span>
                    </div>
                    <span style="display:inline-flex; align-items:center; gap:5px; font-size:0.77rem; color:#6b7280; font-weight:500;"><i class="fa-solid fa-location-dot" style="color:#6D3BFF;"></i> ${r.city}</span>
                  </div>
                </div>`).join('')}
              </div>
            </div>
            <button class="pr-nav-btn pr-nav-next" id="pr-next" aria-label="Next review">
              <i class="fa-solid fa-chevron-right"></i>
            </button>
          </div>

          <div class="pr-dots">
            ${patientReviews.map((_, i) => `<button class="pr-dot${i === 0 ? ' active' : ''}" data-slide="${i}"></button>`).join('')}
          </div>

          <div class="pr-metrics pr-fade-in">
            <div class="pr-metric-card">
              <div class="pr-metric-icon"><i class="fa-solid fa-calendar-check"></i></div>
              <div class="pr-metric-num-row"><span class="pr-metric-val" data-pr-count="10000">0</span><span class="pr-metric-suffix">+</span></div>
              <div class="pr-metric-title">Appointments Booked</div>
              <div class="pr-metric-sub">Across 30+ cities</div>
            </div>
            <div class="pr-metric-card">
              <div class="pr-metric-icon"><i class="fa-solid fa-user-doctor"></i></div>
              <div class="pr-metric-num-row"><span class="pr-metric-val" data-pr-count="500">0</span><span class="pr-metric-suffix">+</span></div>
              <div class="pr-metric-title">Verified Doctors</div>
              <div class="pr-metric-sub">Experienced specialists</div>
            </div>
            <div class="pr-metric-card">
              <div class="pr-metric-icon"><i class="fa-solid fa-hospital"></i></div>
              <div class="pr-metric-num-row"><span class="pr-metric-val" data-pr-count="150">0</span><span class="pr-metric-suffix">+</span></div>
              <div class="pr-metric-title">Partner Hospitals</div>
              <div class="pr-metric-sub">NABH &amp; JCI Accredited</div>
            </div>
            <div class="pr-metric-card">
              <div class="pr-metric-icon"><i class="fa-solid fa-star"></i></div>
              <div class="pr-metric-num-row"><span class="pr-metric-val-static">4.8</span><span class="pr-metric-star">★</span></div>
              <div class="pr-metric-title">Average Patient Rating</div>
              <div class="pr-metric-sub">From 10,000+ reviews</div>
            </div>
          </div>

          <div class="pr-cta-row pr-fade-in">
            <button class="pr-cta-primary" onclick="alert('Reviews page coming soon!')">
              View All Reviews <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button class="pr-cta-secondary" onclick="alert('Thank you! Share form coming soon.')">
              Share Your Experience
            </button>
          </div>

        </div>
      </section>

      <!-- HEALTHCARE JOURNEY SECTION -->
      <section class="hj-section">
        <div class="container hj-inner">

          <!-- Header -->
          <div class="hj-header">
            <div class="hj-eyebrow">
              <i class="fa-solid fa-route"></i> How It Works
            </div>
            <h2 class="hj-title">Your Healthcare Journey, <span>Simplified</span></h2>
            <p class="hj-subtitle">From finding the right doctor to post-treatment support, Doctar helps you at every step.</p>
          </div>

          <!-- 2x2 Feature Grid -->
          <div class="hj-features-grid">
            <div class="hj-feature-card">
              <div class="hj-feature-icon" style="--hj-icon-color:#6D3BFF; --hj-icon-bg:#f0ebff;">
                <i class="fa-solid fa-user-doctor"></i>
              </div>
              <div class="hj-feature-content">
                <h3>Find the Right Specialist</h3>
                <p>Connect with experienced doctors, surgeons, and specialists across multiple medical disciplines.</p>
              </div>
            </div>
            <div class="hj-feature-card">
              <div class="hj-feature-icon" style="--hj-icon-color:#0ea5e9; --hj-icon-bg:#e0f2fe;">
                <i class="fa-solid fa-hospital"></i>
              </div>
              <div class="hj-feature-content">
                <h3>Verified Hospitals &amp; Clinics</h3>
                <p>Explore trusted hospitals and healthcare facilities with transparent information and patient reviews.</p>
              </div>
            </div>
            <div class="hj-feature-card">
              <div class="hj-feature-icon" style="--hj-icon-color:#10b981; --hj-icon-bg:#d1fae5;">
                <i class="fa-solid fa-calendar-check"></i>
              </div>
              <div class="hj-feature-content">
                <h3>Easy Appointment Booking</h3>
                <p>Book consultations, diagnostic tests, and treatments in just a few clicks.</p>
              </div>
            </div>
            <div class="hj-feature-card">
              <div class="hj-feature-icon" style="--hj-icon-color:#f59e0b; --hj-icon-bg:#fef3c7;">
                <i class="fa-solid fa-heart-pulse"></i>
              </div>
              <div class="hj-feature-content">
                <h3>Continuous Care Support</h3>
                <p>Receive assistance throughout your healthcare journey, from consultation to recovery.</p>
              </div>
            </div>
          </div>

          <!-- Trust Metrics -->
          <div class="hj-metrics-row">
            <div class="hj-metric-item">
              <div class="hj-metric-value">10,000+</div>
              <div class="hj-metric-label">Appointments Booked</div>
            </div>
            <div class="hj-metric-divider"></div>
            <div class="hj-metric-item">
              <div class="hj-metric-value">150+</div>
              <div class="hj-metric-label">Partner Hospitals</div>
            </div>
            <div class="hj-metric-divider"></div>
            <div class="hj-metric-item">
              <div class="hj-metric-value">500+</div>
              <div class="hj-metric-label">Specialists Available</div>
            </div>
            <div class="hj-metric-divider"></div>
            <div class="hj-metric-item">
              <div class="hj-metric-value">4.8★</div>
              <div class="hj-metric-label">Average Patient Rating</div>
            </div>
          </div>

          <!-- How Doctar Works -->
          <div class="hj-steps-section">
            <h3 class="hj-steps-heading">How Doctar Works</h3>
            <div class="hj-steps-track">
              <div class="hj-step">
                <div class="hj-step-icon"><i class="fa-solid fa-magnifying-glass"></i></div>
                <div class="hj-step-num">Step 01</div>
                <div class="hj-step-title">Search</div>
                <p class="hj-step-desc">Find doctors, hospitals, or treatments by condition or specialty.</p>
              </div>
              <div class="hj-step-connector"></div>
              <div class="hj-step">
                <div class="hj-step-icon"><i class="fa-solid fa-scale-balanced"></i></div>
                <div class="hj-step-num">Step 02</div>
                <div class="hj-step-title">Compare</div>
                <p class="hj-step-desc">Review ratings, fees, and availability side by side.</p>
              </div>
              <div class="hj-step-connector"></div>
              <div class="hj-step">
                <div class="hj-step-icon"><i class="fa-solid fa-calendar-check"></i></div>
                <div class="hj-step-num">Step 03</div>
                <div class="hj-step-title">Book</div>
                <p class="hj-step-desc">Confirm your appointment online in seconds — no waiting on hold.</p>
              </div>
              <div class="hj-step-connector"></div>
              <div class="hj-step">
                <div class="hj-step-icon"><i class="fa-solid fa-shield-heart"></i></div>
                <div class="hj-step-num">Step 04</div>
                <div class="hj-step-title">Get Care</div>
                <p class="hj-step-desc">Receive expert treatment with end-to-end support from our care team.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <!-- DOCTAR.IN CTA BANNER -->
      <section class="db-banner-section">
        <div class="container">
          <div class="db-banner">
            <div class="db-banner-glow"></div>
            <div class="db-banner-content">
              <div class="db-banner-badge"><i class="fa-solid fa-globe"></i> Powered by Doctar.in</div>
              <h2 class="db-banner-title">Looking for Home-Visit Doctors &amp; More?</h2>
              <p class="db-banner-sub">Doctar is India's leading healthcare network — book home-visit doctors, diagnostics, hospitals and specialists across 30+ cities on our main platform.</p>
            </div>
            <a href="https://doctar.in" target="_blank" rel="noopener noreferrer" class="db-banner-btn">
              Visit Doctar.in <i class="fa-solid fa-arrow-right"></i>
            </a>
          </div>
        </div>
      </section>

      <!-- FAQ SECTION -->
      <section class="faq-section" id="faq">
        <div class="container faq-inner">
          <div class="faq-header">
            <div class="faq-eyebrow"><i class="fa-solid fa-circle-question"></i> FAQs</div>
            <h2 class="faq-title">Frequently Asked Questions</h2>
            <p class="faq-subtitle">Everything you need to know about booking surgery and consultations through Doctar.</p>
          </div>
          <div class="faq-list">
            ${[
              { q: 'How do I book a surgery or consultation through Doctar?', a: 'Simply search for your condition or speciality, choose a verified surgeon, and click "Book Appointment". You can also call our 24/7 helpline at +91-8877772277 and our care coordinator will guide you through the entire process.' },
              { q: 'Is the first consultation really free?', a: 'Yes. Your first consultation with our expert surgeons is completely free. You can discuss your condition, explore treatment options, and get a personalised care plan at no cost.' },
              { q: 'Do you accept health insurance?', a: 'We accept all major health insurance providers. Our dedicated insurance team handles all the paperwork and claims processing, making it a cashless and hassle-free experience.' },
              { q: 'What is the No Cost EMI option?', a: 'We offer No Cost EMI plans starting from ₹0 down payment. You can spread your surgery cost over 3 to 24 months at zero interest through our banking partners.' },
              { q: 'Do you provide free cab service?', a: 'Yes. We provide free cab pick-up and drop service from your home to the hospital and back on the day of your surgery.' },
              { q: 'How experienced are the surgeons on Doctar?', a: 'All our surgeons are board-certified with a minimum of 10 years of experience and are trained in the latest minimally invasive and laser techniques.' },
            ].map((faq, i) => `
              <div class="faq-item${i === 0 ? ' open' : ''}" onclick="this.classList.toggle('open')">
                <div class="faq-q">
                  <span>${faq.q}</span>
                  <i class="fa-solid fa-chevron-down faq-chevron"></i>
                </div>
                <div class="faq-a"><p>${faq.a}</p></div>
              </div>
            `).join('')}
          </div>
        </div>
      </section>
    `;

    appContainer.innerHTML = html;
    initFeaturedCarousel();
    initTreatmentCarousel();
    initCarousel('ds-track', 'ds-prev', 'ds-next', 3);
    initHospitalMapHover();
    initFeaturedHospitalMap(featuredHospitals, currentCity);
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
          <a href="#/hospital/${hospital.slug}">View Hospital →</a>
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
              <h3>Popular Procedures in ${getCurrentCity()}</h3>
              <p>Most searched and booked treatments in ${getCurrentCity()}</p>
            </div>
          </div>
          <a href="#/procedures" class="fp-view-all">View All Procedures →</a>
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
  // RENDER ALL PROCEDURES PAGE (city-aware)
  // =====================================================
  function renderAllProceduresPage() {
    const currentCity = getCurrentCity();
    // Gather all treatments across all categories
    const allTreatments = [];
    for (const catSlug in TREATMENTS) {
      const cat = findCategory(catSlug);
      if (!cat) continue;
      TREATMENTS[catSlug].forEach(t => {
        allTreatments.push({ ...t, category: cat });
      });
    }
    const totalDoctors = getDoctorsForCity(currentCity).length;

    const html = `
      <!-- HERO -->
      <div class="all-cat-hero">
        <div class="container all-cat-hero-inner">
          <div class="breadcrumb" style="margin-bottom: 20px;">
            <a href="#/">Home</a> <span>›</span>
            <span>All Procedures</span>
          </div>
          <div class="all-cat-eyebrow">
            <i class="fa-solid fa-stethoscope"></i> Popular Procedures
          </div>
          <h1 class="all-cat-title">Popular Procedures in <span>${currentCity}</span></h1>
          <p class="all-cat-sub">Browse ${allTreatments.length}+ procedures across ${CATEGORIES.length} specialities. Find expert surgeons, costs, and book free consultations in ${currentCity}.</p>
          <div class="all-cat-stats-row">
            <div class="all-cat-stat"><span>${allTreatments.length}+</span><p>Procedures</p></div>
            <div class="all-cat-stat"><span>${CATEGORIES.length}</span><p>Specialities</p></div>
            <div class="all-cat-stat"><span>${totalDoctors}+</span><p>Surgeons</p></div>
            <div class="all-cat-stat"><span>Free</span><p>Consultation</p></div>
          </div>
        </div>
      </div>

      <!-- TRUST STRIP -->
      <div class="cat-trust-strip">
        <div class="container cat-trust-inner">
          <div class="cat-trust-item"><i class="fa-solid fa-shield-halved"></i><span>USFDA Approved</span></div>
          <div class="cat-trust-item"><i class="fa-solid fa-car"></i><span>Free Cab Service</span></div>
          <div class="cat-trust-item"><i class="fa-solid fa-wallet"></i><span>No Cost EMI</span></div>
          <div class="cat-trust-item"><i class="fa-solid fa-clipboard-check"></i><span>Insurance Covered</span></div>
        </div>
      </div>

      <!-- PROCEDURES BY CATEGORY -->
      <div class="container" style="padding: 50px 0 80px;">
        ${CATEGORIES.map(cat => {
          const catTreatments = TREATMENTS[cat.slug] || [];
          if (catTreatments.length === 0) return '';
          return `
            <div class="proc-cat-block" style="margin-bottom: 50px;">
              <div class="proc-cat-header" style="display:flex; align-items:center; gap:14px; margin-bottom:24px;">
                <span style="font-size:1.6rem;">${cat.icon}</span>
                <div>
                  <h2 style="font-size:1.4rem; font-weight:800; color:#1a1a2e; margin:0;">${cat.name} <span class="cat-count-badge">${catTreatments.length}</span></h2>
                  <p style="color:#777; font-size:0.88rem; margin:4px 0 0;">${cat.description.substring(0, 80)}...</p>
                </div>
                <a href="#/category/${cat.slug}" style="margin-left:auto; font-size:0.85rem; font-weight:700; color:${cat.color}; text-decoration:none;">View All →</a>
              </div>
              <div class="cat-treatments-grid">
                ${catTreatments.map(t => `
                  <a href="#/treatment/${t.slug}" class="cat-treatment-card" style="--card-color: ${cat.color}; --card-light: ${cat.colorLight};">
                    <div class="ctc-top">
                      <div class="ctc-icon" style="background: ${cat.colorLight}; color: ${cat.color};">
                        ${cat.icon}
                      </div>
                      <div class="ctc-badge" style="color: ${cat.color};">${cat.name}</div>
                    </div>
                    <h3 class="ctc-name">${t.name}</h3>
                    <p class="ctc-brief">${t.brief}</p>
                    <div class="ctc-meta">
                      <span><i class="fa-regular fa-clock"></i> ${t.recovery}</span>
                      <span><i class="fa-solid fa-indian-rupee-sign"></i> ${t.costRange}</span>
                    </div>
                    <div class="ctc-cta" style="background: ${cat.color};">
                      View Details &nbsp;→
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
    appContainer.innerHTML = html;
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
    const currentCity = getCurrentCity();

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
            <span style="color:${category.color}">${allDoctors.length} Verified</span> ${treatment.name} Surgeons in ${currentCity}
          </h1>
          <p class="tpl-sub">Expert ${treatment.name} specialists in ${currentCity}. Book verified surgeons available for in-clinic consultations with free consultation, insurance support &amp; cab service.</p>
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
                <button class="dc-btn-book" onclick="window.location.hash='#/doctor/${doc.slug}'">📅 Book Appointment</button>
                <button class="dc-btn-call" onclick="window.location.hash='#/doctor/${doc.slug}'">📞 Call</button>
              </div>
            </div>
          `).join('') + `</div>`}

          <!-- FAQ SECTION -->
          <div class="tpl-faq-section">
            <h2>Frequently Asked Questions</h2>
            <p class="tpl-faq-sub">Everything you need to know about ${treatment.name} in ${currentCity}</p>
            ${[
              { q: `How do I find the best ${treatment.name} surgeon in ${currentCity}?`, a: `Use the filters above to narrow by rating, experience, and fee. All our surgeons are board-certified with proven expertise in ${treatment.name}.` },
              { q: `What is the cost of ${treatment.name} in ${currentCity}?`, a: `The estimated cost ranges from ${treatment.costRange}. This may vary based on the hospital, surgeon experience, and complexity of your case.` },
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
  // RENDER DOCTOR PROFILE PAGE
  // =====================================================
  function renderDoctorProfilePage(slug) {
    const doc = DOCTORS.find(d => d.slug === slug);
    if (!doc) { handleRoute(); return; }

    const faqs = [
      { q: `What are ${doc.name}'s qualifications?`, a: `${doc.name} holds ${doc.degree} with ${doc.experience} of clinical experience.` },
      { q: `Where does ${doc.name} practice?`, a: `${doc.name} practices at ${doc.hospital}, ${doc.location}.` },
      { q: `What is the consultation fee?`, a: `The consultation fee is ₹${doc.fee.toLocaleString('en-IN')} per visit (in-clinic).` },
      { q: `What languages does ${doc.name} speak?`, a: `${doc.name} speaks ${doc.language}.` },
      { q: `How do I book an appointment?`, a: `Click the "Book Appointment" button above or call our 24/7 helpline at +91-8877772277.` },
      { q: `Is the first consultation free?`, a: `Yes, the first consultation is completely free. Our care coordinator will reach out to confirm your appointment.` },
    ];

    const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const html = `
      <!-- BREADCRUMB -->
      <div class="container dpp-breadcrumb">
        <a href="#/">Home</a> <span>/</span>
        <a href="#/doctors/${doc.categories[0]}">Doctors</a> <span>/</span>
        <span>${doc.name}</span>
      </div>

      <!-- MAIN LAYOUT -->
      <div class="container dpp-layout">

        <!-- LEFT: PROFILE CARD (purple) -->
        <aside class="dpp-sidebar">
          <div class="dpp-profile-card">
            <div class="dpp-photo-wrap">
              <img src="${doc.image}" alt="${doc.name}" class="dpp-photo" onerror="this.src=''; this.style.fontSize='4rem'; this.style.display='flex'; this.textContent='👨‍⚕️'">
              <img src="home screen section/verified.png" class="dpp-verified" alt="verified">
            </div>
            <h1 class="dpp-name">${doc.name}</h1>
            <p class="dpp-specialty">${doc.specialty}</p>
            <p class="dpp-exp">${doc.experience} experience</p>
            <div class="dpp-rating-row">
              ${'★'.repeat(5)} <span class="dpp-rating-val">${doc.rating}</span>
              <span class="dpp-rating-count">(${doc.reviews} reviews)</span>
            </div>
            <div class="dpp-divider"></div>
            <div class="dpp-info-list">
              <div class="dpp-info-item">
                <span class="dpp-info-label">Qualification</span>
                <span class="dpp-info-val">${doc.degree}</span>
              </div>
              <div class="dpp-info-item">
                <span class="dpp-info-label">Experience</span>
                <span class="dpp-info-val">${doc.experience}</span>
              </div>
              <div class="dpp-info-item">
                <span class="dpp-info-label">Language</span>
                <span class="dpp-info-val">${doc.language}</span>
              </div>
              <div class="dpp-info-item">
                <span class="dpp-info-label">Home Visit</span>
                <span class="dpp-info-val dpp-no">Not Available</span>
              </div>
            </div>
            <div class="dpp-divider"></div>
            <div class="dpp-sidebar-actions">
              <button class="dpp-btn-book" onclick="document.getElementById('dpp-booking-tab').click()">
                <i class="fa-solid fa-calendar-check"></i> Book Appointment
              </button>
              <a href="tel:+918877772277" class="dpp-btn-call">
                <i class="fa-solid fa-phone"></i>
              </a>
            </div>
          </div>

          <!-- Hospital card -->
          <div class="dpp-hospital-card">
            <div class="dpp-hosp-icon"><i class="fa-solid fa-hospital"></i></div>
            <div class="dpp-hosp-info">
              <h4>${doc.hospital}</h4>
              <p>${doc.location}</p>
              <div class="dpp-fee-row">
                <span class="dpp-fee">₹${doc.fee.toLocaleString('en-IN')}</span>
                <span class="dpp-fee-label">Consultation Fee</span>
              </div>
            </div>
          </div>
        </aside>

        <!-- RIGHT: TABS + CONTENT -->
        <div class="dpp-main">

          <!-- TABS -->
          <div class="dpp-tabs">
            <button class="dpp-tab active" data-tab="about" onclick="switchDppTab('about', this)">About</button>
            <button class="dpp-tab" data-tab="reviews" onclick="switchDppTab('reviews', this)">Reviews</button>
            <button class="dpp-tab" id="dpp-booking-tab" data-tab="booking" onclick="switchDppTab('booking', this)">Booking</button>
          </div>

          <!-- ABOUT TAB -->
          <div class="dpp-tab-content" id="dpp-tab-about">
            <div class="dpp-section">
              <h2 class="dpp-section-title"><i class="fa-solid fa-user-doctor"></i> About ${doc.name}</h2>
              <p>${doc.bio}</p>
            </div>

            <div class="dpp-section">
              <h2 class="dpp-section-title"><i class="fa-solid fa-graduation-cap"></i> Education &amp; Qualification</h2>
              <div class="dpp-edu-card">
                <div class="dpp-edu-icon"><i class="fa-solid fa-certificate"></i></div>
                <div>
                  <p class="dpp-edu-degree">${doc.degree}</p>
                  <p class="dpp-edu-exp">${doc.experience} of experience</p>
                </div>
              </div>
            </div>

            <div class="dpp-section">
              <h2 class="dpp-section-title"><i class="fa-solid fa-house-medical"></i> Home Visit Service</h2>
              <div class="dpp-home-visit-card">
                <i class="fa-solid fa-ban" style="color:#e53e3e; font-size:1.5rem;"></i>
                <div>
                  <p class="dpp-hv-title">Home Visits Not Available</p>
                  <p class="dpp-hv-sub">This doctor is available for in-clinic consultations only at ${doc.hospital}.</p>
                </div>
              </div>
            </div>

            <!-- FAQ -->
            <div class="dpp-section">
              <h2 class="dpp-section-title"><i class="fa-solid fa-circle-question"></i> Frequently Asked Questions</h2>
              ${faqs.map(f => `
                <div class="dpp-faq-item" onclick="this.classList.toggle('open')">
                  <div class="dpp-faq-q">${f.q} <i class="fa-solid fa-chevron-down"></i></div>
                  <div class="dpp-faq-a">${f.a}</div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- REVIEWS TAB -->
          <div class="dpp-tab-content" id="dpp-tab-reviews" style="display:none;">
            <div class="dpp-section">
              <h2 class="dpp-section-title"><i class="fa-solid fa-star"></i> Patient Reviews</h2>
              <div class="dpp-rating-summary">
                <div class="dpp-big-rating">${doc.rating}</div>
                <div>
                  <div class="dpp-stars-big">${'★'.repeat(Math.floor(doc.rating))}${'☆'.repeat(5 - Math.floor(doc.rating))}</div>
                  <p>${doc.reviews} reviews</p>
                </div>
              </div>
              ${['Excellent experience with Dr.!', 'Very knowledgeable and caring.', 'Highly recommend for anyone needing treatment.'].map((text, i) => `
                <div class="dpp-review-card">
                  <div class="dpp-review-top">
                    <div class="dpp-reviewer-avatar">${['RK','SM','AP'][i]}</div>
                    <div>
                      <p class="dpp-reviewer-name">${['Rahul Kumar','Sunita Mehta','Arun Patel'][i]}</p>
                      <div class="dpp-review-stars">★★★★★</div>
                    </div>
                    <span class="dpp-review-date">${['2 days ago','1 week ago','2 weeks ago'][i]}</span>
                  </div>
                  <p class="dpp-review-text">${text}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- BOOKING TAB -->
          <div class="dpp-tab-content" id="dpp-tab-booking" style="display:none;">
            <div class="dpp-section">
              <h2 class="dpp-section-title"><i class="fa-solid fa-calendar-check"></i> Book Appointment</h2>
              <p style="color:#666; margin-bottom:20px;">Select a day and time slot to book your consultation with ${doc.name}.</p>

              <!-- Day selector -->
              <div class="dpp-day-selector">
                ${weekDays.map((d, i) => `
                  <button class="dpp-day-btn ${i===0?'active':''}" onclick="document.querySelectorAll('.dpp-day-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active')">${d}</button>
                `).join('')}
              </div>

              <!-- Slots -->
              <div class="dpp-slots-grid">
                ${doc.slots.map(s => `
                  <button class="dpp-slot-btn" onclick="document.querySelectorAll('.dpp-slot-btn').forEach(b=>b.classList.remove('active')); this.classList.add('active')">
                    <i class="fa-regular fa-clock"></i> ${s}
                  </button>
                `).join('')}
              </div>

              <!-- Booking form -->
              <div class="dpp-book-form">
                <h3>Confirm Your Details</h3>
                <div class="dpp-form-row">
                  <input type="text" class="dpp-input" placeholder="Patient Name" required>
                  <input type="tel" class="dpp-input" placeholder="Mobile Number" required>
                </div>
                <input type="text" class="dpp-input" placeholder="Your City" value="${getCurrentCity()}" readonly style="margin-top:10px;">
                <button class="dpp-confirm-btn" onclick="alert('Appointment booked! Our team will call you to confirm.')">
                  <i class="fa-solid fa-calendar-check"></i> Confirm Booking
                </button>
                <p class="dpp-form-note"><i class="fa-solid fa-lock"></i> 100% Private &amp; Confidential</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    `;

    appContainer.innerHTML = html;
  }

  window.switchDppTab = function(tab, btn) {
    document.querySelectorAll('.dpp-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dpp-tab-content').forEach(c => c.style.display = 'none');
    btn.classList.add('active');
    document.getElementById('dpp-tab-' + tab).style.display = 'block';
  };

  // =====================================================
  // RENDER HOSPITAL DETAIL PAGE
  // =====================================================
  function renderHospitalDetailPage(slug) {
    const hospital = findHospital(slug);
    if (!hospital) { handleRoute(); return; }

    const hospitalDoctors = DOCTORS.filter(doc => doc.hospital === hospital.name);
    const faqs = [
      { q: `Where is ${hospital.name} located?`, a: `${hospital.name} is located at ${hospital.address}.` },
      { q: `What type of facility is ${hospital.name}?`, a: `${hospital.name} is a ${hospital.type.toLowerCase()} with support for planned surgical care.` },
      { q: 'Is insurance support available?', a: 'Yes, our care team helps with insurance paperwork, cashless approval, and claim coordination wherever applicable.' },
      { q: 'Can I book a free consultation here?', a: 'Yes, you can request a free consultation and our coordinator will help confirm the best doctor and slot.' },
    ];

    const html = `
      <div class="container dpp-breadcrumb">
        <a href="#/">Home</a> <span>/</span>
        <a href="#/">Hospitals</a> <span>/</span>
        <span>${hospital.name}</span>
      </div>

      <section class="container hpp-hero">
        <div class="hpp-hero-media">
          <img src="${hospital.image}" alt="${hospital.name}">
        </div>
        <div class="hpp-hero-content">
          <div class="treatment-eyebrow">
            <i class="fa-solid fa-hospital"></i> Featured Hospital
          </div>
          <h1>${hospital.name}</h1>
          <p>${hospital.overview}</p>
          <div class="hpp-hero-meta">
            <span><i class="fa-solid fa-star"></i> ${hospital.rating} (${hospital.reviews} reviews)</span>
            <span><i class="fa-solid fa-location-dot"></i> ${hospital.address}</span>
            <span><i class="fa-solid fa-clock"></i> ${hospital.hours}</span>
          </div>
          <div class="hpp-hero-actions">
            <button class="hpp-primary-btn" onclick="document.getElementById('hpp-booking').scrollIntoView({behavior:'smooth'})">
              <i class="fa-solid fa-calendar-check"></i> Book FREE Appointment
            </button>
            <a href="tel:${hospital.phone.replace(/-/g, '')}" class="hpp-secondary-btn">
              <i class="fa-solid fa-phone"></i> Call Hospital
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

          <div class="hpp-map-mini">
            <div class="fh-map-grid"></div>
            <div class="fh-map-road road-one"></div>
            <div class="fh-map-road road-two"></div>
            <span class="fh-map-label label-main">${hospital.city}</span>
            <div class="fh-pin pin-1"><i class="fa-solid fa-location-dot"></i></div>
          </div>
        </aside>

        <main class="hpp-main">
          <section class="hpp-section">
            <h2><i class="fa-solid fa-shield-halved"></i> Services Available</h2>
            <div class="hpp-chip-grid">
              ${hospital.services.map(service => `<span>${service}</span>`).join('')}
            </div>
          </section>

          <section class="hpp-section">
            <h2><i class="fa-solid fa-stethoscope"></i> Specialities</h2>
            <div class="hpp-specialty-grid">
              ${hospital.specialties.map(name => `<span><i class="fa-solid fa-circle-check"></i> ${name}</span>`).join('')}
            </div>
          </section>

          <section class="hpp-section">
            <h2><i class="fa-solid fa-building-circle-check"></i> Amenities</h2>
            <div class="hpp-amenity-grid">
              ${hospital.amenities.map(item => `<div><i class="fa-solid fa-check"></i><span>${item}</span></div>`).join('')}
            </div>
          </section>

          <section class="hpp-section">
            <h2><i class="fa-solid fa-user-doctor"></i> Available Surgeons</h2>
            ${hospitalDoctors.length === 0 ? `
              <p>Our care team will help match you with the right specialist at this hospital.</p>
            ` : `
              <div class="hpp-doctors">
                ${hospitalDoctors.map(doc => `
                  <a href="#/doctor/${doc.slug}" class="hpp-doctor-card">
                    <img src="${doc.image}" alt="${doc.name}">
                    <div>
                      <h3>${doc.name}</h3>
                      <p>${doc.specialty}</p>
                      <span>${doc.rating} ★ · ${doc.experience}</span>
                    </div>
                  </a>
                `).join('')}
              </div>
            `}
          </section>

          <section class="hpp-section" id="hpp-booking">
            <h2><i class="fa-solid fa-calendar-check"></i> Book Appointment</h2>
            <div class="hpp-book-card">
              <input type="text" class="dpp-input" placeholder="Patient Name">
              <input type="tel" class="dpp-input" placeholder="Mobile Number">
              <input type="text" class="dpp-input" value="${hospital.name}, ${hospital.address}" readonly>
              <button class="dpp-confirm-btn" onclick="alert('Appointment request sent! Our care team will call you shortly.')">
                <i class="fa-solid fa-calendar-check"></i> Request Appointment
              </button>
              <p class="dpp-form-note"><i class="fa-solid fa-lock"></i> 100% Private &amp; Confidential</p>
            </div>
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
  }

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
            <span style="color:${category.color}">${doctors.length} Verified</span> ${category.name} Surgeons in ${getCurrentCity()}
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
                  <button class="dl-btn-book" style="background:${category.color};" onclick="window.location.hash='#/doctor/${doc.slug}'">
                    <i class="fa-solid fa-calendar-check"></i> Book Appointment
                  </button>
                  <button class="dl-btn-call" style="color:${category.color}; border-color:${category.color};" onclick="window.location.hash='#/doctor/${doc.slug}'">
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

  // =====================================================
  // RENDER ALL DOCTORS PAGE
  // =====================================================
  function renderAllDoctorsPage(filters) {
    const currentCity = getCurrentCity();
    filters = filters || { availability: 'all', rating: 0, fee: 'all', experience: 'all', gender: 'all' };

    let doctors = getDoctorsForCity(currentCity);

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
      <!-- HERO -->
      <div class="tpl-hero" style="background: linear-gradient(120deg, #7c3aed18 0%, #fff 70%);">
        <div class="container tpl-hero-inner">
          <div class="breadcrumb">
            <a href="#/">Home</a> <span>›</span>
            <span class="breadcrumb-current">All Surgeons</span>
          </div>
          <h1 class="tpl-title">
            <span style="color:#7c3aed">${doctors.length} Verified</span> Surgeons in ${currentCity}
          </h1>
          <p class="tpl-sub">Find the best board-certified surgeons in ${currentCity}. Book verified specialists available for in-clinic consultations with free consultation, insurance support &amp; cab service.</p>
          <div class="tpl-trust-row">
            <span class="tpl-badge"><i class="fa-solid fa-circle-check" style="color:#7c3aed"></i> Licensed &amp; Verified</span>
            <span class="tpl-badge"><i class="fa-solid fa-hospital" style="color:#7c3aed"></i> In-Clinic Available</span>
            <span class="tpl-badge"><i class="fa-solid fa-headset" style="color:#7c3aed"></i> 24/7 On-Call Service</span>
            <span class="tpl-badge"><i class="fa-solid fa-car" style="color:#7c3aed"></i> Free Cab</span>
          </div>
          <div class="tpl-info-pills">
            <span class="tpl-pill"><i class="fa-solid fa-shield-halved"></i> USFDA Approved</span>
            <span class="tpl-pill"><i class="fa-solid fa-calendar-check"></i> Free Consultation</span>
            <span class="tpl-pill"><i class="fa-solid fa-wallet"></i> Insurance Covered</span>
          </div>
        </div>
      </div>

      <!-- MAIN LAYOUT -->
      <div class="container tpl-layout">
        <!-- LEFT SIDEBAR: FILTERS -->
        <aside class="tpl-sidebar">
          <div class="tpl-filter-head">
            <i class="fa-solid fa-sliders"></i> Filter Doctors
            <button class="tpl-reset-btn" onclick="window._allDoctorsFilters={}; renderAllDoctorsPage()">Reset All</button>
          </div>

          <div class="tpl-filter-group">
            <h4>Availability</h4>
            <label class="tpl-radio"><input type="radio" name="all-avail" value="all" ${filters.availability==='all'?'checked':''} onchange="applyAllDoctorsFilter('availability','all')"> Any Time</label>
            <label class="tpl-radio"><input type="radio" name="all-avail" value="today" ${filters.availability==='today'?'checked':''} onchange="applyAllDoctorsFilter('availability','today')"> Available Today</label>
          </div>

          <div class="tpl-filter-group">
            <h4>Minimum Rating</h4>
            ${[4.5,4.0,3.5,3.0].map(r=>`
              <label class="tpl-radio"><input type="radio" name="all-rating" value="${r}" ${filters.rating===r?'checked':''} onchange="applyAllDoctorsFilter('rating',${r})"> ${r}+ ⭐</label>
            `).join('')}
            <label class="tpl-radio"><input type="radio" name="all-rating" value="0" ${filters.rating===0?'checked':''} onchange="applyAllDoctorsFilter('rating',0)"> Any Rating</label>
          </div>

          <div class="tpl-filter-group">
            <h4>Consultation Fee</h4>
            <label class="tpl-radio"><input type="radio" name="all-fee" value="all" ${filters.fee==='all'?'checked':''} onchange="applyAllDoctorsFilter('fee','all')"> Any</label>
            <label class="tpl-radio"><input type="radio" name="all-fee" value="under1000" ${filters.fee==='under1000'?'checked':''} onchange="applyAllDoctorsFilter('fee','under1000')"> Under ₹1,000</label>
            <label class="tpl-radio"><input type="radio" name="all-fee" value="1000-2000" ${filters.fee==='1000-2000'?'checked':''} onchange="applyAllDoctorsFilter('fee','1000-2000')"> ₹1,000 – ₹2,000</label>
            <label class="tpl-radio"><input type="radio" name="all-fee" value="above2000" ${filters.fee==='above2000'?'checked':''} onchange="applyAllDoctorsFilter('fee','above2000')"> Above ₹2,000</label>
          </div>

          <div class="tpl-filter-group">
            <h4>Experience</h4>
            <label class="tpl-radio"><input type="radio" name="all-exp" value="all" ${filters.experience==='all'?'checked':''} onchange="applyAllDoctorsFilter('experience','all')"> Any</label>
            <label class="tpl-radio"><input type="radio" name="all-exp" value="0-10" ${filters.experience==='0-10'?'checked':''} onchange="applyAllDoctorsFilter('experience','0-10')"> 0–10 yrs</label>
            <label class="tpl-radio"><input type="radio" name="all-exp" value="10-20" ${filters.experience==='10-20'?'checked':''} onchange="applyAllDoctorsFilter('experience','10-20')"> 10–20 yrs</label>
            <label class="tpl-radio"><input type="radio" name="all-exp" value="20+" ${filters.experience==='20+'?'checked':''} onchange="applyAllDoctorsFilter('experience','20+')"> 20+ yrs</label>
          </div>

          <div class="tpl-filter-group">
            <h4>Doctor Gender</h4>
            <label class="tpl-radio"><input type="radio" name="all-gender" value="all" ${filters.gender==='all'?'checked':''} onchange="applyAllDoctorsFilter('gender','all')"> Any</label>
            <label class="tpl-radio"><input type="radio" name="all-gender" value="male" ${filters.gender==='male'?'checked':''} onchange="applyAllDoctorsFilter('gender','male')"> Male</label>
            <label class="tpl-radio"><input type="radio" name="all-gender" value="female" ${filters.gender==='female'?'checked':''} onchange="applyAllDoctorsFilter('gender','female')"> Female</label>
          </div>
        </aside>

        <div class="tpl-cards-col">
          <div class="tpl-results-bar">
            <span><strong>${doctors.length}</strong> surgeon${doctors.length !== 1 ? 's' : ''} found in ${currentCity}</span>
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
                  <div class="dc-next-slot">🕐 ${doc.nextSlot || 'TBD'}</div>
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
                <button class="dc-btn-book" onclick="window.location.hash='#/doctor/${doc.slug}'">📅 Book Appointment</button>
                <button class="dc-btn-call" onclick="window.location.hash='#/doctor/${doc.slug}'">📞 Call</button>
              </div>
            </div>
          `).join('') + `</div>`}
        </div>
      </div>
    `;

    appContainer.innerHTML = html;
    window._allDoctorsFilters = filters;
  }

  window.applyAllDoctorsFilter = function(key, value) {
    const filters = Object.assign({}, window._allDoctorsFilters || {}, { [key]: value });
    if (key === 'rating') filters.rating = parseFloat(value);
    renderAllDoctorsPage(filters);
  };

  // =====================================================
  // RENDER ALL HOSPITALS PAGE
  // =====================================================
  function renderAllHospitalsPage(filters) {
    const currentCity = getCurrentCity();
    filters = filters || { type: 'all', rating: 0, accreditation: 'all', service: 'all' };

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
      <div class="tpl-hero" style="background: linear-gradient(120deg, #7c3aed18 0%, #fff 70%);">
        <div class="container tpl-hero-inner">
          <div class="breadcrumb">
            <a href="#/">Home</a> <span>›</span>
            <span class="breadcrumb-current">All Partner Hospitals</span>
          </div>
          <h1 class="tpl-title">
            <span style="color:#7c3aed">${hospitals.length} Partner</span> Hospitals in ${currentCity}
          </h1>
          <p class="tpl-sub">Find the best partner hospitals and surgical clinics in ${currentCity}. Modern modular OT facilities, ICU support, zero cashless billing hassles, and free cab pick-up &amp; drop.</p>
          <div class="tpl-trust-row">
            <span class="tpl-badge"><i class="fa-solid fa-circle-check" style="color:#7c3aed"></i> NABH/JCI Accredited</span>
            <span class="tpl-badge"><i class="fa-solid fa-shield-halved" style="color:#7c3aed"></i> Zero Cashless Hassle</span>
            <span class="tpl-badge"><i class="fa-solid fa-car" style="color:#7c3aed"></i> Free Home-to-Hospital Cab</span>
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
            <span class="tpl-sort-label">Sort: <strong>Relevance</strong> ▾</span>
          </div>

          ${hospitals.length === 0 ? `
            <div class="tpl-empty">
              <i class="fa-solid fa-hospital"></i>
              <p>No partner hospitals match your filters in ${currentCity}. Try adjusting them.</p>
            </div>
          ` : `<div class="hl-list">` + hospitals.map((hospital, index) => `
            <article class="hl-card ${index === 0 ? 'is-highlighted' : ''}">
              <div class="hl-image-wrap">
                <img src="${hospital.image}" alt="${hospital.name}" onerror="this.src='images/about-surgery.png'">
              </div>
              <div class="hl-content">
                <div class="hl-title-row">
                  <div>
                    <h3>${hospital.name}</h3>
                    <div class="hl-meta-list">
                      <span><i class="fa-solid fa-location-dot"></i>${hospital.address}</span>
                      <span><i class="fa-solid fa-route"></i>${hospital.distance}</span>
                      <span><i class="fa-solid fa-user-doctor"></i>${hospital.type}</span>
                    </div>
                  </div>
                  <div class="hl-rating">${hospital.rating} <i class="fa-solid fa-star"></i> <span>(${hospital.reviews} reviews)</span></div>
                </div>

                <div class="hl-metrics">
                  ${hospital.metrics.slice(0, 2).map(metric => `<span>${metric}</span>`).join('')}
                </div>

                <div class="hl-tags">
                  ${hospital.services.map(service => `<span>${service}</span>`).join('')}
                </div>

                <div class="hl-actions">
                  <a href="#/hospital/${hospital.slug}" class="hl-primary">View Hospital Details →</a>
                  <a href="tel:${hospital.phone.replace(/-/g, '')}" class="hl-secondary">
                    <i class="fa-solid fa-phone"></i> Call: ${hospital.phone}
                  </a>
                </div>
              </div>
            </article>
          `).join('') + `</div>`}
        </div>
      </div>
    `;

    appContainer.innerHTML = html;
    window._allHospitalsFilters = filters;
  }

  window.applyAllHospitalsFilter = function(key, value) {
    const filters = Object.assign({}, window._allHospitalsFilters || {}, { [key]: value });
    if (key === 'rating') filters.rating = parseFloat(value);
    renderAllHospitalsPage(filters);
  };


  function initCitySelector() {
    const btn = document.getElementById('citySelectorBtn');
    const menu = document.getElementById('cityDropdownMenu');
    const textSpan = document.getElementById('currentCityText');
    const currentCity = getCurrentCity();

    if (textSpan) {
      textSpan.textContent = `📍 ${currentCity}`;
    }

    if (menu) {
      const items = menu.querySelectorAll('.city-dropdown-item');
      items.forEach(item => {
        if (item.getAttribute('data-city').toLowerCase() === currentCity.toLowerCase()) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }

    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = menu.style.display === 'flex';
      menu.style.display = isVisible ? 'none' : 'flex';
    });

    document.addEventListener('click', () => {
      menu.style.display = 'none';
    });

    menu.addEventListener('click', (e) => {
      const item = e.target.closest('.city-dropdown-item');
      if (!item) return;

      const selectedCity = item.getAttribute('data-city');
      localStorage.setItem('selectedCity', selectedCity);

      if (textSpan) {
        textSpan.textContent = `📍 ${selectedCity}`;
      }

      menu.querySelectorAll('.city-dropdown-item').forEach(el => {
        el.classList.toggle('active', el === item);
      });

      menu.style.display = 'none';
      handleRoute();
    });
  }

  initCitySelector();
  initRouter();
});
