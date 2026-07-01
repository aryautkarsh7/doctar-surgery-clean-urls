// =====================================================
// HOME PAGE
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================

  function preloadHospitalImages(hospitals) {
    hospitals.slice(0, 3).forEach(h => {
      const src = hospitalImageUrl(h, 400, 300);
      if (!src || !src.startsWith('http')) return;
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  // =====================================================
  // RENDER HOMEPAGE
  // =====================================================
  async function renderHomePage() {
    showSkeleton('home');
    updatePageMeta({
      title: `Surgery & Surgeons in ${getCurrentCity()}`,
      description: `Find expert surgeons for all surgery types in ${getCurrentCity()}. Free consultation, cashless insurance & cab drop. Book your surgery now — 691 hospitals across India.`,
      keywords: `surgery, surgeons, surgery in ${getCurrentCity()}, expert surgeons, surgical hospitals, book surgery India`,
      url: 'https://surgery.doctar.in'
    });
    const treatmentShowcase = [
      { title: 'Orthopedics', slug: 'orthopedics', image: 'images/service-general.webp', icon: 'fa-solid fa-bone', tags: ['Knee', 'Hip', 'Spine'], treatmentCount: 18, color: '#7c3aed' },
      { title: 'Cardiology', slug: 'cardiology', image: 'images/service-cardiac.webp', icon: 'fa-solid fa-heart-pulse', tags: ['Angioplasty', 'Bypass', 'Valve'], treatmentCount: 14, color: '#e85d8f' },
      { title: 'Ophthalmology', slug: 'ophthalmology', image: 'images/service-neuro.webp', icon: 'fa-solid fa-eye', tags: ['Cataract', 'LASIK', 'Retina'], treatmentCount: 15, color: '#8b5cf6' },
      { title: 'ENT', slug: 'ent', image: 'images/about-surgery.webp', icon: 'fa-solid fa-ear-listen', tags: ['Sinus', 'Ear', 'Tonsils'], treatmentCount: 12, color: '#fb923c' },
      { title: 'Gynecology', slug: 'gynaecology', image: 'images/service-general.webp', icon: 'fa-solid fa-venus', tags: ['Fibroid', 'PCOS', 'Pregnancy'], treatmentCount: 16, color: '#e879c4' },
      { title: 'Urology', slug: 'urology', image: 'images/service-neuro.webp', icon: 'fa-solid fa-kit-medical', tags: ['Kidney Stone', 'Prostate', 'UTI'], treatmentCount: 14, color: '#60a5fa' },
      { title: 'General Surgery', slug: 'laparoscopy', image: 'images/service-general.webp', icon: 'fa-solid fa-stethoscope', tags: ['Hernia', 'Gallstone', 'Appendix'], treatmentCount: 20, color: '#34d399' },
      { title: 'Cosmetic & Skin', slug: 'aesthetics', image: 'images/about-surgery.webp', icon: 'fa-solid fa-wand-magic-sparkles', tags: ['Hair', 'Skin', 'Weight Loss'], treatmentCount: 11, color: '#a78bfa' },
      { title: 'Proctology', slug: 'proctology', image: 'images/service-general.webp', icon: 'fa-solid fa-stethoscope', tags: ['Piles', 'Fissure', 'Fistula'], treatmentCount: 5, color: '#8B4513' },
      { title: 'Vascular', slug: 'vascular', image: 'images/service-cardiac.webp', icon: 'fa-solid fa-droplet', tags: ['Varicose Veins', 'DVT', 'AV Fistula'], treatmentCount: 6, color: '#dc2626' },
      { title: 'Fertility', slug: 'fertility', image: 'images/service-general.webp', icon: 'fa-solid fa-baby', tags: ['IVF', 'IUI', 'Egg Freezing'], treatmentCount: 6, color: '#9f1239' },
      { title: 'Weight Loss', slug: 'weight-loss', image: 'images/about-surgery.webp', icon: 'fa-solid fa-weight-scale', tags: ['Bariatric', 'Gastric Balloon', 'Liposuction'], treatmentCount: 3, color: '#65a30d' },
    ];

    const treatmentTrust = [
      { icon: 'fa-solid fa-shield-halved', title: 'USFDA Approved', subtitle: 'Procedures' },
      { icon: 'fa-solid fa-hospital', title: '150+ Clinics', subtitle: 'Pan India' },
      { icon: 'fa-solid fa-wallet', title: 'No Cost EMI', subtitle: 'Easy Payment Options' },
      { icon: 'fa-solid fa-car', title: 'Free Cab', subtitle: 'Home to Hospital' },
      { icon: 'fa-solid fa-clipboard-check', title: 'Insurance Covered', subtitle: 'Top Providers' },
    ];

    const popularProcedures = [
      { id: 'p1', name: 'Knee Replacement', slug: 'knee-replacement', specialty: 'Orthopedics', icon: 'fa-solid fa-bone', color: '#7c3aed', price: '₹80,000*', rating: '95', reviews: '1,240', badge: 'POPULAR', recovery: '2 - 4 weeks' },
      { id: 'p2', name: 'Cataract Surgery', slug: 'cataract-surgery', specialty: 'Ophthalmology', icon: 'fa-solid fa-eye', color: '#3b82f6', price: '₹25,000*', rating: '98', reviews: '3,200', badge: 'RECOMMENDED', recovery: '3 - 7 days' },
      { id: 'p3', name: 'Gallstone Surgery', slug: 'gallbladder-removal', specialty: 'General Surgery', icon: 'fa-solid fa-stethoscope', color: '#22c55e', price: '₹40,000*', rating: '97', reviews: '2,100', badge: 'AVAILABLE', recovery: '3 - 5 days' },
      { id: 'p4', name: 'Angioplasty', slug: 'angioplasty', specialty: 'Cardiology', icon: 'fa-solid fa-heart-pulse', color: '#ef4444', price: '₹1,20,000*', rating: '96', reviews: '1,150', badge: 'POPULAR', recovery: '1 - 3 days' },
      { id: 'p5', name: 'Hair Transplant', slug: 'hair-transplant', specialty: 'Cosmetic Surgery', icon: 'fa-solid fa-wand-magic-sparkles', color: '#a855f7', price: '₹60,000*', rating: '94', reviews: '1,320', badge: 'AVAILABLE', recovery: '7 - 10 days' },
      { id: 'p6', name: 'Piles Treatment', slug: 'piles-treatment', specialty: 'Proctology', icon: 'fa-solid fa-notes-medical', color: '#f59e0b', price: '₹35,000*', rating: '96', reviews: '890', badge: 'POPULAR', recovery: '2 - 3 days' },
    ];

    window.popularProcedures = popularProcedures;
    // Blogs and videos are pre-loaded in BLOG_POSTS / VIDEOS globals via /api/data/critical.
    // No extra API calls needed here.
    const pageVideos = VIDEOS;
    const pageBlogs = BLOG_POSTS;
    const currentCity = getCurrentCity();
    const homeDoctors = getDoctorsForCity(currentCity);
    const isCitySpecific = homeDoctors.some(doc =>
      getDoctorCity(doc).toLowerCase() === currentCity.toLowerCase()
    );
    const doctorsHeading = isCitySpecific ? `Expert Surgeons in <span>${currentCity}</span>` : 'Our Expert <span>Surgeons</span>';
    const doctorsSubtitle = isCitySpecific
      ? `Highly experienced, board-certified doctors available near you in ${currentCity}.`
      : 'Highly experienced, board-certified doctors dedicated to your care.';
    const featuredHospitals = getHospitalsForCity(currentCity).slice(0, 3);
    preloadHospitalImages(featuredHospitals);

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

    const heroServices = [
      { title: 'Find a Surgeon Near Me', sub: 'Expert surgeons near your location', img: 'images/hero-surgeon-near-me.png', icon: 'fa-solid fa-user-doctor', href: urlSurgeonsNearMe() },
      { title: 'Surgeries', sub: 'Safe & trusted procedures', img: 'images/service-general.webp', icon: 'fa-solid fa-scalpel', href: urlSurgeriesInCity(currentCity) },
      { title: 'Hospital Near Me', sub: 'Best hospitals near you', img: 'images/hero-hospital-near-me.png', icon: 'fa-solid fa-hospital', href: urlAllCategories() },
      { title: 'Hospitals', sub: 'Top partner facilities', img: 'images/hero-hospitals.png', icon: 'fa-solid fa-building-columns', href: urlHospitalsInCity(currentCity) },
      { title: 'Pet Surgery Near Me', sub: 'Trusted veterinary surgeons', img: 'images/hero-pet-surgery.png', icon: 'fa-solid fa-paw', href: urlPetSurgeryNearMe() },
      { title: 'Pet Hospitals', sub: 'Pet care facilities near you', img: 'images/hero-pet-hospitals.png', icon: 'fa-solid fa-house-medical', href: urlPetHospitals(currentCity) },
    ];

    let html = `
      <!-- HERO SECTION -->
      <section class="hero-new">
        <div class="container">
          <div class="hero-card">
            <div class="hero-card-grid"></div>
            <div class="hero-card-content">
              <div class="hero-pill"><span class="hero-pill-dot"></span> PREMIUM SURGICAL CARE</div>
              <h1 class="hero-headline">
                Your Health,<br>
                <span>Expertly Managed.</span>
              </h1>
              <p class="hero-tagline">Book expert surgeons in ${currentCity} — free consultation, cab drop &amp; zero-cost EMI across 150+ clinics.</p>
              <div class="hero-services">
                ${heroServices.map(s => `
                  <a href="${s.href}" class="hero-service-card">
                    <div class="hero-service-img"><img src="${s.img}" alt="${s.title}"></div>
                    <div class="hero-service-body">
                      <h3>${s.title}</h3>
                      <p>${s.sub}</p>
                      <span class="hero-service-explore">Explore <i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                  </a>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="hero-stats-bar">
            <div class="hero-stat"><span>3M+</span><p>Happy Patients</p></div>
            <div class="hero-stat"><span>250K+</span><p>Surgeries Done</p></div>
            <div class="hero-stat"><span>150+</span><p>Clinics Pan India</p></div>
            <div class="hero-stat"><span>100+</span><p>Expert Surgeons</p></div>
            <div class="hero-stat"><span>50+</span><p>Cities Covered</p></div>
            <div class="hero-stat"><span>4.9★</span><p>Patient Rating</p></div>
          </div>
        </div>
      </section>

      <!-- TREATMENT BROWSER -->
      <section class="treatment-browser" id="categories">
        <!-- Kolkata city background image -->
        <div class="tb-city-bg" style="background-image: url('images/image 708.webp');"></div>

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
${treatmentShowcase.map(item => {
              // Prefer the admin-uploaded category cover image; fall back to the bundled
              // placeholder, then to a colored gradient + emoji/icon if neither exists.
              const liveCat = (typeof findCategory === 'function') ? findCategory(item.slug) : null;
              // Only use DB image if it's an absolute URL — relative paths like cat-*.png 404
              const liveCatImg = (liveCat && liveCat.image && liveCat.image.startsWith('http')) ? liveCat.image : null;
              const coverImg = liveCatImg || item.image;
              const visual = coverImg
                ? `<img src="${coverImg}" alt="${item.title}" onerror="this.onerror=null;this.style.display='none'">`
                : `<div class="treatment-visual-fallback" style="background:linear-gradient(135deg, ${item.color}, ${item.color}cc);"><i class="${item.icon}"></i></div>`;
              return `
              <a href="${urlCategory(item.slug)}" class="treatment-showcase-card tb-card" style="--card-accent: ${item.color};">
                <div class="treatment-visual">
                  ${visual}
                </div>
                <div class="treatment-content">
                  <h3>${item.title}</h3>
                  <div class="treatment-tags">${item.tags.map(tag => `<span>${tag}</span>`).join('<b>•</b>')}</div>
                  <div class="treatment-pill">${item.treatmentCount} Treatments</div>
                  <div class="treatment-explore">Explore <span>→</span></div>
                </div>
              </a>`;
            }).join('')}
            </div>
          </div>

          <div style="text-align:center; margin-top: 32px;">
            <a href="/specialities/s" class="view-all-cats-btn">
              <i class="fa-solid fa-grid-2"></i> View All Specialities <span>→</span>
            </a>
          </div>
          <div id="fp-carousel-root"></div>
        </div>
      </section>

      <!-- DOCTORS SECTION -->
      <section class="treatment-browser ds-section" id="doctors-section">
        <div class="tb-city-bg" style="background-image: url('images/image 708.webp'); opacity: 0.30;"></div>
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
              <div class="ds-doc-card tb-card" onclick="navigate('/surgeons/${(doc.categories&&doc.categories[0])||'general'}/${doc.slug}/s')">
	                <!-- TOP: photo + name + specialty + rating -->
	                <div class="ds-card-top">
	                  <div class="ds-photo-wrap">
	                    ${doctorAvatarHTML(doc, 'ds-photo')}
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
                  <button class="ds-btn-profile" onclick="navigate('/surgeons/${(doc.categories&&doc.categories[0])||'general'}/${doc.slug}/s')">View Profile</button>
                  <button class="ds-btn-book" onclick="window.openBookingModal('${doc.name}','${doc.hospital}','${doc.slug}')">
                    <img src="home screen section/Icon.png" alt="" class="ds-btn-icon"> Book Appointment
                  </button>
                </div>
              </div>
`).join('')}
            </div>
          </div>

          <div style="text-align:center; margin-top: 32px;">
            <button class="doctors-view-all" onclick="navigate('${urlAllDoctors()}')">
              View All Surgeons →
            </button>
          </div>
        </div>
      </section>

      <!-- FEATURED HOSPITALS SECTION -->
      <section class="featured-hospitals-section" id="featured-hospitals">
        <div class="fh-city-bg" style="background-image: url('images/image 708.webp');"></div>
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
              <button class="fh-view-all-btn" onclick="navigate('${urlHospitalsInCity(currentCity)}')">
                View All Hospitals
              </button>
            </div>
          </div>

          <div class="fh-layout">
            <details class="fh-map-details">
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
                <article class="fh-card${hospital.image ? '' : ' fh-img-failed'}" data-hospital-card="${hospital.slug}">
                  <div class="fh-card-media">
                    <img src="${hospitalImageUrl(hospital, 400, 300)}" alt="${escapeHtmlAttr(hospital.name)}" onerror="this.onerror=null;this.closest('.fh-card').classList.add('fh-img-failed');this.src=window.hospitalPlaceholderImageUrl(this.alt,400,300)">
                    <div class="card-logo-slot is-empty" title="Hospital logo">
                      <i class="fa-solid fa-hospital"></i>
                    </div>
                    <!-- mobile-only image overlays (hidden on desktop via inline display:none) -->
                    ${hospital.rating ? `<div class="fh-ov-rating" style="display:none"><i class="fa-solid fa-star"></i> ${hospital.rating}</div>` : ''}
                    ${hospital.type ? `<div class="fh-ov-type" style="display:none">${hospital.type}</div>` : ''}
                    <div class="fh-ov-fallback" style="display:none"><i class="fa-solid fa-hospital"></i><span>${hospital.name}</span></div>
                  </div>
                  <div class="fh-card-body">
                    <div class="fh-card-top">
                      <h3>${hospital.name}</h3>
                      ${hospital.rating ? `<span class="fh-rating">${hospital.rating} <i class="fa-solid fa-star"></i></span>` : ''}
                    </div>
                    <!-- mobile-only address row (hidden on desktop) -->
                    ${hospital.address ? `<div class="fh-m-addr" style="display:none"><i class="fa-solid fa-location-dot"></i> ${hospital.address}</div>` : ''}
                    <div class="fh-meta">
                      ${hospital.address ? `<span><i class="fa-solid fa-location-dot"></i> ${hospital.address}</span>` : ''}
                      ${hospital.distance && hospital.distance !== 'undefined' ? `<span><i class="fa-solid fa-route"></i> ${hospital.distance}</span>` : ''}
                      ${hospital.type ? `<span><i class="fa-solid fa-user-doctor"></i> ${hospital.type}</span>` : ''}
                    </div>
                    <div class="fh-metrics">
                      ${(hospital.metrics || []).slice(0, 2).map(metric => `<span>${metric}</span>`).join('')}
                    </div>
                    <div class="fh-services">
                      ${(hospital.services || []).map(service => `<span>${service}</span>`).join('')}
                    </div>
                    <div class="fh-card-actions">
                      <a href="${urlHospital(hospital)}" class="fh-card-primary">View Hospital →</a>
                      <button type="button" class="fh-card-secondary" onclick="highlightHospitalPin('${hospital.slug}')">View on Map</button>
                    </div>
                  </div>
                </article>
              `).join('')}
              <a href="${urlHospitalsInCity(currentCity)}" class="view-all-btn">View All Hospitals →</a>
            </div>
          </div>
        </div>
      </section>

      <!-- HOSPITALS NEAR ME SECTION -->
      <section class="hnm2-section">
        <div class="container">
          <div class="hnm2-header">
            <div>
              <div class="treatment-eyebrow"><i class="fa-solid fa-hospital"></i> Nearby</div>
              <h2 class="tb-title">Hospitals Near Me in <span>${currentCity}</span></h2>
              <p class="tb-sub">Top partner hospitals near you with expert surgical facilities and insurance support.</p>
            </div>
            <a href="${urlHospitalsInCity(currentCity)}" class="hnm2-view-all">View All Hospitals →</a>
          </div>
          <div class="hnm2-cards">
            ${featuredHospitals.map(hospital => `
              <a href="/specialities/s" class="hnm2-card">
                <div class="hnm2-card-img">
                  <img src="${hospitalImageUrl(hospital, 400, 300)}" alt="${escapeHtmlAttr(hospital.name)}" loading="lazy" onerror="this.src=window.hospitalPlaceholderImageUrl(this.alt,400,300)">
                </div>
                <div class="hnm2-card-body">
                  <h3>${hospital.name}</h3>
                  <p class="hnm2-address"><i class="fa-solid fa-location-dot"></i> ${hospital.address}</p>
                  <div class="hnm2-tags">
                    ${(hospital.services || []).slice(0, 3).map(s => `<span>${s}</span>`).join('')}
                  </div>
                </div>
              </a>
            `).join('')}
          </div>
        </div>
      </section>

      <!-- PET HOSPITALS NEAR ME SECTION -->
      <section class="ph2-section">
        <div class="container">
          <div class="hnm2-header">
            <div>
              <div class="treatment-eyebrow"><i class="fa-solid fa-paw"></i> Pet Care</div>
              <h2 class="tb-title">Pet Hospitals Near Me in <span>${currentCity}</span></h2>
              <p class="tb-sub">Trusted veterinary hospitals and pet care centers near you.</p>
            </div>
            ${(PET_HOSPITALS.filter(h => h.city && h.city.toLowerCase() === currentCity.toLowerCase()).length > 0) ? `<a href="${urlPetHospitals(currentCity)}" class="hnm2-view-all">View All →</a>` : ''}
          </div>
          ${(() => {
            const cityPetHospitals = PET_HOSPITALS.filter(h => h.city && h.city.toLowerCase() === currentCity.toLowerCase()).slice(0, 3);
            if (cityPetHospitals.length > 0) {
              return `<div class="hnm2-cards">
                ${cityPetHospitals.map(h => `
                  <a href="${urlPetHospitals(currentCity)}" class="hnm2-card">
                    <div class="hnm2-card-img">
                      <img src="${h.image || 'images/about-surgery.webp'}" alt="${h.name}" onerror="this.src='images/about-surgery.webp'">
                    </div>
                    <div class="hnm2-card-body">
                      <h3>${h.name}</h3>
                      <p class="hnm2-address"><i class="fa-solid fa-location-dot"></i> ${h.address || h.city}</p>
                      <div class="hnm2-tags">
                        ${(h.petTypes || []).map(pt => `<span>${pt}</span>`).join('')}
                        ${h.emergencyServices ? '<span style="background:#fef2f2;color:#dc2626;">24/7 Emergency</span>' : ''}
                      </div>
                      ${h.phone ? `<p class="hnm2-address" style="margin-top:6px;"><i class="fa-solid fa-phone"></i> ${h.phone}</p>` : ''}
                    </div>
                  </a>
                `).join('')}
              </div>`;
            }
            return `<div class="hnm2-cards">
              ${[
                { img: 'images/service-general.webp', name: 'Dog Hospital', address: 'Veterinary surgical care for dogs', petTypes: ['Dogs'], phone: '' },
                { img: 'images/service-general.webp', name: 'Cat Hospital', address: 'Feline care and surgery specialists', petTypes: ['Cats'], phone: '' },
                { img: 'images/service-general.webp', name: 'Veterinary Clinic', address: 'General pet health and procedures', petTypes: ['Dogs', 'Cats', 'Birds'], phone: '' },
              ].map(card => `
                <div class="hnm2-card" style="cursor:default;">
                  <div class="hnm2-card-img">
                    <img src="${card.img}" alt="${card.name}">
                  </div>
                  <div class="hnm2-card-body">
                    <h3>${card.name}</h3>
                    <p class="hnm2-address"><i class="fa-solid fa-location-dot"></i> ${card.address}</p>
                    <div class="hnm2-tags">
                      ${card.petTypes.map(pt => `<span>${pt}</span>`).join('')}
                      <span class="ph2-badge" style="background:#fef3c7;color:#92400e;border-radius:999px;padding:2px 8px;font-size:0.72rem;font-weight:700;">Coming Soon</span>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>`;
          })()}
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
                <div style="background:#fff; border:1.5px solid #ECE6FF; border-radius:22px; padding:26px 24px; display:flex; flex-direction:column; gap:14px; box-shadow:0 2px 18px rgba(94, 64, 145,0.07); transition:transform 0.25s, box-shadow 0.25s;" onmouseenter="this.style.transform='translateY(-5px)';this.style.boxShadow='0 14px 40px rgba(94, 64, 145,0.14)'" onmouseleave="this.style.transform='';this.style.boxShadow='0 2px 18px rgba(94, 64, 145,0.07)'">
                  <!-- Top row -->
                  <div style="display:flex; justify-content:space-between; align-items:center;">
                    <span style="display:inline-flex; align-items:center; gap:6px; background:#f0ebff; color:#5e4091; border-radius:999px; padding:5px 13px; font-size:0.73rem; font-weight:700;">
                      <i class="fa-solid fa-circle-check"></i> Verified Patient
                    </span>
                    <i class="fa-solid fa-quote-left" style="color:#d8d0f7; font-size:1.4rem;"></i>
                  </div>
                  <!-- Patient -->
                  <div style="display:flex; align-items:center; gap:14px;">
                    <div style="width:50px; height:50px; min-width:50px; border-radius:50%; background:linear-gradient(135deg,#5e4091,#5e4091); display:flex; align-items:center; justify-content:center; color:#fff; font-size:1rem; font-weight:700; box-shadow:0 2px 10px rgba(94, 64, 145,0.25);">
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
                      <span style="display:inline-flex; align-items:center; gap:5px; font-size:0.77rem; color:#6b7280; font-weight:500;"><i class="fa-solid fa-stethoscope" style="color:#5e4091;"></i> ${r.consultation}</span>
                      <span style="display:inline-flex; align-items:center; gap:5px; font-size:0.77rem; color:#6b7280; font-weight:500;"><i class="fa-solid fa-hospital" style="color:#5e4091;"></i> ${r.hospital}</span>
                    </div>
                    <span style="display:inline-flex; align-items:center; gap:5px; font-size:0.77rem; color:#6b7280; font-weight:500;"><i class="fa-solid fa-location-dot" style="color:#5e4091;"></i> ${r.city}</span>
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
              <div class="hj-feature-icon" style="--hj-icon-color:#5e4091; --hj-icon-bg:#f0ebff;">
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

      <!-- LATEST MEDICAL BLOGS -->
      ${generateBlogSectionHTML('home', pageBlogs)}

      <!-- PATIENT STORIES (Reels) -->
      ${generateReelsSectionHTML('home', pageVideos)}

      <!-- EXPERT HEALTH TIPS (Landscape) -->
      ${generateLandscapeSectionHTML('home', pageVideos)}

      <!-- FAQ SECTION -->
      ${generateFAQSectionHTML([
        { q: 'How do I book a surgery or consultation through Doctar?', a: 'Simply search for your condition or speciality, choose a verified surgeon, and click "Book Appointment". You can also call our 24/7 helpline at +91-8877772277 and our care coordinator will guide you through the entire process.' },
        { q: 'Is the first consultation really free?', a: 'Yes. Your first consultation with our expert surgeons is completely free. You can discuss your condition, explore treatment options, and get a personalised care plan at no cost.' },
        { q: 'Do you accept health insurance?', a: 'We accept all major health insurance providers. Our dedicated insurance team handles all the paperwork and claims processing, making it a cashless and hassle-free experience.' },
        { q: 'What is the No Cost EMI option?', a: 'We offer No Cost EMI plans starting from ₹0 down payment. You can spread your surgery cost over 3 to 24 months at zero interest through our banking partners.' },
        { q: 'Do you provide free cab service?', a: 'Yes. We provide free cab pick-up and drop service from your home to the hospital and back on the day of your surgery.' },
        { q: 'How experienced are the surgeons on Doctar?', a: 'All our surgeons are board-certified with a minimum of 10 years of experience and are trained in the latest minimally invasive and laser techniques.' },
      ])}
    `;

    appContainer.innerHTML = html;
    appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(currentCity));
    initFeaturedCarousel();
    initTreatmentCarousel();
    initCarousel('ds-track', 'ds-prev', 'ds-next', 3);
    initHospitalMapHover();
    // Defer map init until the user opens the details panel — avoids ~20 tile requests on every homepage load
    const mapDetails = document.querySelector('.fh-map-details') as HTMLDetailsElement;
    if (mapDetails) {
      let mapInited = false;
      mapDetails.addEventListener('toggle', function onToggle() {
        if (mapDetails.open && !mapInited) {
          mapInited = true;
          initFeaturedHospitalMap(featuredHospitals, currentCity);
        }
      });
    }
    initPatientReviews();
    initBlogCarousel('home');
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
        metricsEl.querySelectorAll('[data-pr-count]').forEach((el: any) => {
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
    const mapDetails = document.querySelector('.fh-map-details') as HTMLDetailsElement;
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
      const bounds = L.latLngBounds(markers.map((marker: any) => marker.getLatLng()));
      map.fitBounds(bounds, { padding: [36, 36], maxZoom: 13 });
    }
  };

  // =====================================================
  // RENDER ALL CATEGORIES PAGE
