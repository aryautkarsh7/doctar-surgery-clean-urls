// =====================================================
// CATEGORY & PROCEDURES PAGES
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================
  // =====================================================
  function renderAllCategoriesPage() {
    const totalTreatments = CATEGORIES.reduce((sum, c) => sum + c.treatmentCount, 0);

    updatePageMeta({
      title: `All Surgery Specialities & Surgeons in ${getCurrentCity()}`,
      description: `Browse all surgery specialities in ${getCurrentCity()}. Find expert surgeons for laparoscopy, orthopedics, urology, proctology & more. Book free surgery consultation.`,
      keywords: `surgery specialities, surgeons in ${getCurrentCity()}, laparoscopy surgery, orthopedic surgery, book surgery`,
      url: window.location.href
    });

    const html = `
      <!-- ALL CATEGORIES HERO -->
      <div class="all-cat-hero">
        <div class="container all-cat-hero-inner">
          <div class="breadcrumb" style="margin-bottom: 20px;">
            <a href="/">Home</a> <span>›</span>
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
            <a href="${urlCategory(cat.slug)}" class="all-cat-card" style="--acc: ${cat.color}; --acc-light: ${cat.colorLight};">
              <div class="acc-icon-wrap">
                <span class="acc-emoji">${catIcon(cat, 32)}</span>
              </div>
              <div class="acc-body">
                <h3 class="acc-name">${cat.name}</h3>
                <p class="acc-desc">${cat.description}</p>
                <div class="acc-tags">
                  ${cat.tags.map(t => `<span class="acc-tag">${t}</span>`).join('')}
                </div>
                <div class="acc-footer">
                  <span class="acc-count">
                    <i class="fa-solid fa-list-check"></i> ${cat.treatmentCount} Treatments
                  </span>
                  <span class="acc-explore">Explore →</span>
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

    const scroller = track.closest('.tb-carousel-wrap') || track;
    const cards = track.querySelectorAll('.tb-card');
    let isDragging = false;
    let dragMoved = false; // became a real drag (moved past threshold)?
    let startX = 0;
    let startScrollLeft = 0;
    const DRAG_THRESHOLD = 6; // px of movement before we treat it as a drag

    function getCardWidth() {
      if (!cards[0]) return 0;
      return cards[0].offsetWidth + 20; // 20 = gap
    }

    function update() {
      const maxScroll = scroller.scrollWidth - scroller.clientWidth;
      prevBtn.style.opacity = scroller.scrollLeft <= 2 ? '0.4' : '1';
      nextBtn.style.opacity = scroller.scrollLeft >= maxScroll - 2 ? '0.4' : '1';
    }

    prevBtn.addEventListener('click', () => {
      scroller.scrollBy({ left: -getCardWidth(), behavior: 'smooth' });
    });

    nextBtn.addEventListener('click', () => {
      scroller.scrollBy({ left: getCardWidth(), behavior: 'smooth' });
    });

    scroller.addEventListener('scroll', update, { passive: true });

    scroller.addEventListener('pointerdown', (event) => {
      isDragging = true;
      dragMoved = false;
      startX = event.clientX;
      startScrollLeft = scroller.scrollLeft;
    });

    scroller.addEventListener('pointermove', (event) => {
      if (!isDragging) return;
      const delta = event.clientX - startX;
      // Only start dragging once the pointer moves past the threshold, so a
      // plain click (with sub-pixel jitter) still reaches the card's onclick.
      if (!dragMoved && Math.abs(delta) < DRAG_THRESHOLD) return;
      if (!dragMoved) {
        dragMoved = true;
        scroller.classList.add('is-dragging');
      }
      event.preventDefault();
      scroller.scrollLeft = startScrollLeft - delta;
    });

    ['pointerup', 'pointerleave', 'pointercancel'].forEach(eventName => {
      scroller.addEventListener(eventName, () => {
        isDragging = false;
        scroller.classList.remove('is-dragging');
      });
    });

    // If the gesture was an actual drag, swallow the click that follows so it
    // doesn't accidentally open a card while the user was just scrolling.
    scroller.addEventListener('click', (event) => {
      if (dragMoved) {
        event.stopPropagation();
        event.preventDefault();
        dragMoved = false;
      }
    }, true);

    window.addEventListener('resize', update);
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
              <h3>Popular Procedures in <span style="color:var(--primary)">${getCurrentCity()}</span></h3>
              <p>Most searched and booked treatments in ${getCurrentCity()}</p>
            </div>
          </div>
          <a href="/procedures/s" class="fp-view-all">View All Procedures →</a>
        </div>
        <div class="fp-equal-grid">
          ${procedures.map(p => `
            <a href="${urlTreatment(p.slug)}" class="surg-card">
              <div class="surg-card-head">
                <div class="surg-icon" style="background:${p.color}1a; color:${p.color};"><i class="${p.icon}"></i></div>
                <div class="surg-title-wrap">
                  <h3 class="surg-name">${p.name}</h3>
                  <span class="surg-specialty">${p.specialty}</span>
                </div>
                <span class="surg-badge surg-badge-${p.badge.toLowerCase()}">${p.badge}</span>
              </div>
              <div class="surg-rows">
                <div class="surg-row">
                  <span class="surg-row-label">AVG PRICE</span>
                  <span class="surg-row-val">${p.price}</span>
                </div>
                <div class="surg-row">
                  <span class="surg-row-label">RATING</span>
                  <span class="surg-row-val"><i class="fa-solid fa-star" style="color:#fbbf24;"></i> ${p.rating}% <span class="surg-reviews">(${p.reviews})</span></span>
                </div>
              </div>
              <span class="surg-book">BOOK NOW <i class="fa-solid fa-arrow-right"></i></span>
            </a>
          `).join('')}
        </div>
        <a href="/procedures/s" class="fp-view-all-bottom">View All Procedures <i class="fa-solid fa-arrow-right"></i></a>
      </div>
    `;

    root.innerHTML = html;
  }

  // =====================================================
  // RENDER ALL PROCEDURES PAGE (city-aware)
  // =====================================================
  function renderAllProceduresPage(cityOverride) {
    const currentCity = cityOverride || getCurrentCity();
    
    updatePageMeta({
      title: `All Surgery Types & Procedures in ${currentCity}`,
      description: `Complete list of surgery procedures available in ${currentCity}. Find expert surgeons & know surgery costs. Book free surgery consultation.`,
      keywords: `surgery types ${currentCity}, surgery procedures, surgeons in ${currentCity}, surgery cost, book surgery`,
      url: window.location.href
    });

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
            <a href="/">Home</a> <span>›</span>
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
                <span style="font-size:1.6rem;">${catIcon(cat, 28)}</span>
                <div>
                  <h2 style="font-size:1.4rem; font-weight:800; color:#1a1a2e; margin:0;">${cat.name} <span class="cat-count-badge">${catTreatments.length}</span></h2>
                  <p style="color:#777; font-size:0.88rem; margin:4px 0 0;">${cat.description.substring(0, 80)}...</p>
                </div>
                <a href="${urlCategory(cat.slug)}" style="margin-left:auto; font-size:0.85rem; font-weight:700; color:${cat.color}; text-decoration:none;">View All →</a>
              </div>
              <div class="cat-treatments-grid">
                ${catTreatments.map(t => `
                  <a href="${urlTreatment(t.slug, cat.slug)}" class="cat-treatment-card" style="--card-color: ${cat.color}; --card-light: ${cat.colorLight};">
                    <div class="ctc-top">
                      <div class="ctc-icon" style="background: ${cat.colorLight}; color: ${cat.color};">
                        ${catIcon(cat, 28)}
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
  async function renderCategoryPage(slug) {
    showSkeleton('list');
    const category = findCategory(slug);
    if (!category) { handleRoute(); return; }

    updatePageMeta({
      title: `${category.name} Surgery Specialists in ${getCurrentCity()}`,
      description: `Expert ${category.name} surgeons in ${getCurrentCity()}. Know surgery cost, recovery time & procedure details. Book free surgery consultation now.`,
      keywords: `${category.name} surgery, ${category.name} surgeons ${getCurrentCity()}, surgery specialists, book surgery, ${category.tags.join(', ')}`,
      url: window.location.href
    });

    const treatments = TREATMENTS[slug] || [];
    const relatedDoctors = getDoctorsForCategory(slug).slice(0, 3);
    const pageVideos = await fetchVideosForPage('category-' + slug);
    const pageBlogs = await fetchBlogsForPage('category-' + slug);

    // Fetch sub-categories for this category (live, filtered by categorySlug).
    let subcategories = [];
    try {
      const subRes = await fetch(API_BASE + `/api/subcategories?categorySlug=${encodeURIComponent(category.slug)}`);
      const subJson = await subRes.json();
      subcategories = Array.isArray(subJson) ? subJson : (subJson.data || []);
    } catch (e) {
      // Fallback to the bundled global if the API is unavailable
      subcategories = SUBCATEGORIES.filter(sc => sc.categorySlug === category.slug);
    }
    subcategories.sort((a, b) => (a.order || 0) - (b.order || 0));

    // General Surgery only: show the 33 sub-categories AS the treatment cards.
    const showSubsAsCards = slug === 'general-surgery' && subcategories.length > 0;

    // Hide the "Browse by Procedure Type" pills for General Surgery (the
    // sub-categories are now the main cards). All other categories unchanged.
    const subPillsHTML = (subcategories.length > 0 && !showSubsAsCards) ? `
      <div class="cp-subcategories">
        <h3>Browse by Procedure Type</h3>
        <div class="cp-sub-pills">
          ${subcategories.map(sub => `
            <a href="${urlCategory(category.slug)}?subcategory=${sub.slug}" class="cp-sub-pill">${sub.name}</a>
          `).join('')}
        </div>
      </div>
    ` : '';

    // Single treatment card renderer (reused for grouped + flat layouts)
    const treatmentCardHTML = (t) => `
      <a href="${urlTreatment(t.slug, category.slug)}" class="cat-treatment-card" style="--card-color: ${category.color}; --card-light: ${category.colorLight};">
        <div class="ctc-top">
          <div class="ctc-icon" style="background: ${category.colorLight}; color: ${category.color};">
            ${catIcon(category, 28)}
          </div>
          <div class="ctc-badge" style="color: ${category.color};">${category.name}</div>
        </div>
        <h3 class="ctc-name">${t.name}</h3>
        <p class="ctc-brief">${t.brief || ''}</p>
        <div class="ctc-meta">
          <span><i class="fa-regular fa-clock"></i> ${t.recovery || '—'}</span>
          <span><i class="fa-solid fa-indian-rupee-sign"></i> ${t.costRange || '—'}</span>
        </div>
        <div class="ctc-cta" style="background: ${category.color};">View Details &nbsp;→</div>
      </a>`;

    // Sub-category card (General Surgery): name + label + view button, no price/recovery.
    const subcategoryCardHTML = (sc) => `
      <a href="${urlCategory('general-surgery')}" class="cat-treatment-card" style="--card-color: ${category.color}; --card-light: ${category.colorLight};">
        <div class="ctc-top">
          <div class="ctc-icon" style="background: ${category.colorLight}; color: ${category.color};">
            ${catIcon(category, 28)}
          </div>
          <div class="ctc-badge" style="color: ${category.color};">${category.name}</div>
        </div>
        <h3 class="ctc-name">${sc.name}</h3>
        <div class="ctc-cta" style="background: ${category.color};">View Details &nbsp;→</div>
      </a>`;

    // Group treatments under their sub-categories; ungrouped → "General".
    const catSubcats = subcategories
      .filter(sc => sc.categorySlug === slug)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    let groupedTreatmentsHTML;
    if (showSubsAsCards) {
      // General Surgery: render each sub-category as a flat card.
      groupedTreatmentsHTML = `<div class="cat-treatments-grid">${subcategories.map(subcategoryCardHTML).join('')}</div>`;
    } else if (catSubcats.length) {
      const usedSlugs = new Set();
      const groups = [];
      catSubcats.forEach(sc => {
        const items = treatments.filter(t => t.subCategorySlug === sc.slug);
        items.forEach(t => usedSlugs.add(t.slug));
        if (items.length) groups.push({ name: sc.name, icon: sc.icon || '', items });
      });
      const leftovers = treatments.filter(t => !usedSlugs.has(t.slug));
      if (leftovers.length) groups.push({ name: 'General', icon: '', items: leftovers });

      groupedTreatmentsHTML = groups.map(g => `
        <div class="cat-subgroup">
          <h3 class="cat-subgroup-title">${g.icon ? g.icon + ' ' : ''}${g.name}
            <span class="cat-count-badge">${g.items.length}</span>
          </h3>
          <div class="cat-treatments-grid">
            ${g.items.map(treatmentCardHTML).join('')}
          </div>
        </div>
      `).join('');
    } else {
      // No sub-categories defined → original flat grid
      groupedTreatmentsHTML = `<div class="cat-treatments-grid">${treatments.map(treatmentCardHTML).join('')}</div>`;
    }

    let html = `
      <!-- CATEGORY HERO BANNER -->
      <div class="cat-page-hero" style="--cat-color: ${category.color}; --cat-light: ${category.colorLight};">
        <div class="container cat-page-hero-inner">
          <div class="breadcrumb" style="margin-bottom: 20px;">
            <a href="/">Home</a> <span>›</span>
            <span>${category.name}</span>
          </div>
          <div class="cat-hero-badge" style="background: ${category.colorLight}; color: ${category.color};">
            ${catIcon(category, 22)} &nbsp;${category.name}
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
          <h2>All ${category.name} Treatments <span class="cat-count-badge">${showSubsAsCards ? subcategories.length : treatments.length}</span></h2>
          <p>Click any treatment to see full details, cost, and book a free consultation.</p>
        </div>

        ${subPillsHTML}

        ${groupedTreatmentsHTML}
      </div>

      <!-- LATEST MEDICAL BLOGS -->
      ${generateBlogSectionHTML('cat-' + slug, pageBlogs)}

      <!-- PATIENT STORIES (Reels) -->
      ${generateReelsSectionHTML('cat-' + slug, pageVideos)}

      <!-- EXPERT HEALTH TIPS (Landscape) -->
      ${generateLandscapeSectionHTML('cat-' + slug, pageVideos)}

      <!-- FAQ SECTION -->
      ${generateFAQSectionHTML([
        { q: "What " + category.name + " treatments are available on Doctar?", a: "Doctar offers " + treatments.length + "+ " + category.name.toLowerCase() + " treatments performed by board-certified specialists. Browse the treatment cards above to see details, costs, and recovery times for each procedure." },
        { q: "How do I find the best " + category.name + " surgeon near me?", a: "Click on any treatment above to see a list of verified " + category.name.toLowerCase() + " surgeons in your city. You can filter by experience, rating, consultation fee, and availability." },
        { q: "Is the first " + category.name + " consultation free?", a: "Yes. Your first consultation with our " + category.name.toLowerCase() + " specialists is completely free. Discuss your condition, explore treatment options, and get a personalised care plan at no cost." },
        { q: "Are " + category.name + " procedures covered by insurance?", a: "Most " + category.name.toLowerCase() + " procedures listed on Doctar are covered by major health insurance providers. Our dedicated insurance team handles all paperwork and claims processing for a cashless experience." },
        { q: "What is the recovery time for " + category.name + " surgeries?", a: "Recovery time varies by procedure. Each treatment card above shows the estimated recovery period. Your surgeon will provide a detailed recovery plan during your consultation." },
        { q: "Do you provide post-surgery support?", a: "Yes. Doctar provides end-to-end support including free cab service, post-operative care guidance, follow-up appointments, and 24/7 helpline access at +91-8877772277." },
      ], category.name + " — Frequently Asked Questions", "Everything you need to know about " + category.name.toLowerCase() + " treatments, procedures, and consultations through Doctar.")}
    `;
    appContainer.innerHTML = html;
    initBlogCarousel('cat-' + slug);
    {
      const city = getCurrentCity() || 'Kolkata';
      const catName = (category.name || '').toLowerCase();
      const catHospitals = HOSPITALS.filter(h =>
        Array.isArray(h.specialties) &&
        h.specialties.some(s => catName.includes(s.toLowerCase()) || s.toLowerCase().includes(catName))
      );
      appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(city, {
        hospitals: catHospitals.length ? catHospitals : undefined,
        hospitalsHeading: `Hospitals for ${category.name} in ${city}`,
      }));
    }
  }


  // =====================================================
  // RENDER TREATMENT PAGE (doctar.in listing style)
