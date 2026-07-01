// =====================================================
// TREATMENT PAGE
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================
  // =====================================================
  async function renderTreatmentPage(slug, filters) {
    showSkeleton('detail');
    document.body.classList.remove('tpl-filter-open');

    const treatment = findTreatment(slug);
    if (!treatment) { handleRoute(); return; }
    const category = findCategory(treatment.categorySlug);
    const currentCity = getCurrentCity();
    
    updatePageMeta({
      title: `${treatment.name} Surgery - Cost & Surgeons`,
      description: `${treatment.name} surgery cost, procedure & recovery guide. Find expert ${treatment.name} surgeons near you in ${currentCity}. Free consultation. Book surgery now.`,
      keywords: `${treatment.name} surgery, ${treatment.name} surgeons ${currentCity}, ${treatment.name} surgery cost, book surgery`,
      url: window.location.href
    });

    const pageVideos = await fetchVideosForPage('treatment-' + slug);

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
            <a href="/">Home</a> <span>›</span>
            <a href="${urlCategory(category.slug)}">${category.name}</a> <span>›</span>
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
      <div class="container tpl-layout tpl-treatment-layout">

        <div class="tpl-filter-bar" style="display:none">
          <button type="button" class="tpl-filter-fab" aria-expanded="false" onclick="toggleTPLFilter(true)">
            <i class="fa-solid fa-filter"></i>
            <span>FILTER</span>
            <span class="tpl-filter-count">1</span>
          </button>
        </div>
        <div class="tpl-filter-backdrop" id="tpl-filter-backdrop" style="display:none" onclick="toggleTPLFilter(false)"></div>

        <!-- LEFT SIDEBAR: FILTERS -->
        <aside class="tpl-sidebar">
          <button type="button" class="tpl-filter-close" style="display:none" onclick="toggleTPLFilter(false)" aria-label="Close filters">✕</button>
          <div class="tpl-filter-head">
            <i class="fa-solid fa-sliders"></i> Filter Doctors
            <button type="button" class="tpl-reset-btn" onclick="window._tplFilters={}; renderTreatmentPageGlobal('${slug}')">Reset All</button>
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

          <button type="button" class="tpl-filter-apply-btn" onclick="toggleTPLFilter(false)">Apply Filter</button>
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
	            <div class="doctor-card dc-clickable" onclick="navigate('/surgeons/${(doc.categories&&doc.categories[0])||'general'}/${doc.slug}/s')">
	              <div class="dc-top">
	                ${doctorAvatarHTML(doc, 'dc-avatar')}
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
                <button class="dc-btn-book" onclick="event.stopPropagation(); window.openBookingModal('${doc.name}','${doc.hospital}','${doc.slug}')">📅 Book Appointment</button>
                <button class="dc-btn-call" onclick="event.stopPropagation(); navigate('/surgeons/${(doc.categories&&doc.categories[0])||'general'}/${doc.slug}/s')">📞 Call</button>
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

      <!-- PATIENT STORIES (Reels) -->
      ${generateReelsSectionHTML('tpl-' + slug, pageVideos)}

      <!-- EXPERT HEALTH TIPS (Landscape) -->
      ${generateLandscapeSectionHTML('tpl-' + slug, pageVideos)}
    `;

    appContainer.innerHTML = html;
    window._tplFilters = filters;
    window._tplSlug = slug;
    appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(getCurrentCity() || 'Kolkata'));
  }

  // Called by filter radio buttons on treatment page
  window.applyTPLFilter = function(slug, key, value) {
    const filters = Object.assign({}, window._tplFilters || {}, { [key]: value });
    if (key === 'rating') filters.rating = parseFloat(value);
    renderTreatmentPage(slug, filters);
  };

  window.toggleTPLFilter = function(open) {
    const sidebar = document.querySelector('.tpl-treatment-layout .tpl-sidebar');
    const backdrop = document.getElementById('tpl-filter-backdrop');
    const trigger = document.querySelector('.tpl-filter-fab');

    if (!sidebar || !backdrop) return;

    const shouldOpen = typeof open === 'boolean' ? open : !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', shouldOpen);
    backdrop.classList.toggle('is-open', shouldOpen);
    document.body.classList.toggle('tpl-filter-open', shouldOpen);

    if (trigger) {
      trigger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
  };

  window.renderTreatmentPageGlobal = function(slug) {
    renderTreatmentPage(slug, {});
  };

  // =====================================================
  // RENDER DOCTOR PROFILE PAGE
