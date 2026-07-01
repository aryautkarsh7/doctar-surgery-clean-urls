// =====================================================
// DOCTOR PROFILE & DOCTOR LISTING PAGES
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================
  // =====================================================
  async function renderDoctorProfilePage(slug) {
    showSkeleton('detail');
    const doc = DOCTORS.find(d => d.slug === slug);
    if (!doc) { handleRoute(); return; }
    
    const _docName = String(doc.name || '').replace(/^Dr\.?\s*/i, '');
    const _docCity = getDoctorCity(doc);
    updatePageMeta({
      title: `Dr. ${_docName} - ${doc.specialty} Surgery Specialist in ${_docCity}`,
      description: `Book surgery with Dr. ${_docName}, among the best ${doc.specialty} surgeons in ${_docCity}. ${doc.experience} of surgical experience. Free surgery consultation available.`,
      keywords: `Dr. ${_docName}, ${doc.specialty} surgeon ${_docCity}, surgery specialist, surgeons in ${_docCity}, book surgery`,
      image: doc.image,
      url: window.location.href
    });

    const pageVideos = await fetchVideosForPage('doctor-' + slug);
    const pageBlogs = await fetchBlogsForPage('doctor-' + slug);

    // Find hospital record for image
    const hospRecord = (typeof HOSPITALS !== 'undefined')
      ? HOSPITALS.find(h => h.name === doc.hospital) : null;
    const hospImg = hospRecord && hospRecord.image ? hospRecord.image : '';
    const hospAddress = hospRecord ? hospRecord.address : doc.location;

    // Generate next 7 days
    const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function buildDateRows() {
      const rows = [];
      const today = new Date();
      for (let i = 0; i < 7; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() + i);
        const label = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayLabels[d.getDay()];
        const dateStr = d.getDate() + ' ' + monthNames[d.getMonth()];
        const iso = d.toISOString().split('T')[0];
        rows.push({ label, dateStr, iso });
      }
      return rows;
    }
    const dateRows = buildDateRows();

    // All 12 time slots
    const ALL_SLOTS = ['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM'];

    // Calculate end time given a start time string and duration in minutes
    const slotDuration = doc.slotDuration || 30;
    function calcEndTime(startStr, durationMin) {
      const match = startStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
      if (!match) return startStr;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3].toUpperCase();
      // Convert to 24-hour
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      // Add duration
      let totalMin = hours * 60 + minutes + durationMin;
      let endH = Math.floor(totalMin / 60) % 24;
      let endM = totalMin % 60;
      // Convert back to 12-hour
      const endPeriod = endH >= 12 ? 'PM' : 'AM';
      endH = endH % 12 || 12;
      return endH + ':' + String(endM).padStart(2, '0') + ' ' + endPeriod;
    }

    const faqs = [
      { q: `What are ${doc.name}'s qualifications?`, a: `${doc.name} holds ${doc.degree} with ${doc.experience} of clinical experience.` },
      { q: `Where does ${doc.name} practice?`, a: `${doc.name} practices at ${doc.hospital}, ${doc.location}.` },
      { q: `What is the consultation fee?`, a: `The consultation fee is ₹${doc.fee.toLocaleString('en-IN')} per visit (in-clinic).` },
      { q: `What languages does ${doc.name} speak?`, a: `${doc.name} speaks ${doc.language}.` },
      { q: `How do I book an appointment?`, a: `Click the "Book Appointment" button above or call our 24/7 helpline at +91-8877772277.` },
      { q: `Is the first consultation free?`, a: `Yes, the first consultation is completely free. Our care coordinator will reach out to confirm your appointment.` },
    ];

    const reviewsData = [
      { initials: 'RK', name: 'Rahul Kumar',   ago: '2 days ago',   text: `Dr. ${doc.name.split(' ')[1]} was incredibly thorough and made me feel comfortable throughout the procedure. Highly recommended!` },
      { initials: 'SM', name: 'Sunita Mehta',  ago: '1 week ago',   text: 'Very knowledgeable and caring. The staff was also very helpful. Would definitely visit again.' },
      { initials: 'AP', name: 'Arun Patel',    ago: '2 weeks ago',  text: 'Excellent experience overall. The appointment was on time and the consultation was very detailed.' },
      { initials: 'NV', name: 'Neha Verma',    ago: '3 weeks ago',  text: 'Best doctor I have visited. Explained everything in simple language and the treatment was very effective.' },
    ];

    // Build the list of hospitals this doctor practices at.
    // Supports doc.hospitals (array of strings or {name, location, hours, slug});
    // falls back to the single doc.hospital string.
    const practiceList = (() => {
      const raw = (Array.isArray(doc.hospitals) && doc.hospitals.length)
        ? doc.hospitals
        : [{ name: doc.hospital, location: doc.location, hours: doc.hours }];
      return raw.map(item => {
        const name = (typeof item === 'string') ? item : (item.name || '');
        const rec = (typeof HOSPITALS !== 'undefined') ? HOSPITALS.find(h => h.name === name) : null;
        const obj = (typeof item === 'object') ? item : {};
        return {
          name,
          location: obj.location || (rec ? rec.address : (name === doc.hospital ? doc.location : '')),
          hours: obj.hours || (rec ? rec.hours : ''),
          slug: obj.slug || (rec ? rec.slug : ''),
        };
      }).filter(h => h.name);
    })();

    const html = `
      <div class="container dpp-breadcrumb">
        <a href="/">Home</a> <span>›</span>
        <a href="${urlDoctorsByCat((doc.categories&&doc.categories[0])||'general')}">Doctors</a> <span>›</span>
        <span>${doc.name}</span>
      </div>

      <div class="container dpp-layout">

        <!-- MOBILE-ONLY STICKY TABS (hidden on desktop via CSS) -->
        <div class="dpp-tabs-wrapper">
          <div class="dpp-tabs">
            <button class="dpp-tab active" data-tab="about" onclick="dpp2SwitchTab('about',this)">About</button>
            <button class="dpp-tab" data-tab="reviews" onclick="dpp2SwitchTab('reviews',this)">Reviews</button>
            <button class="dpp-tab" data-tab="booking" onclick="dpp2SwitchTab('booking',this)">Booking</button>
          </div>
        </div>

        <!-- MOBILE-ONLY MINI DOCTOR BAR (shown on Reviews/Booking) -->
        <div class="dpp-mini-bar" id="dpp-mini-bar">
          <img class="dpp-mini-photo" src="${doc.image ? (doc.image.startsWith('doctor_images_webp/') ? doc.image.replace('doctor_images_webp/', 'images/doctors/') : doc.image) : 'images/doctor-placeholder.svg'}" alt="${doc.name}">
          <div>
            <div class="dpp-mini-name">${doc.name}</div>
            <div class="dpp-mini-info">${doc.specialty} | ₹${doc.fee.toLocaleString('en-IN')}</div>
          </div>
          <div class="dpp-mini-rating">${doc.rating}⭐</div>
        </div>

        <!-- LEFT: PROFILE CARD (purple) -->
        <aside class="dpp-sidebar">
	          <div class="dpp-profile-card">
	            <div class="dpp-photo-wrap">
	              ${doctorAvatarHTML(doc, 'dpp-photo')}
	              <img src="home screen section/verified.png" class="dpp-verified" alt="verified"
                   onerror="this.style.display='none'">
            </div>
            <h1 class="dpp-name">${doc.name}</h1>
            <p class="dpp-specialty">${doc.specialty}</p>
            <p class="dpp-exp">${doc.experience} experience</p>
            <div class="dpp-rating-row">
              ${'★'.repeat(Math.floor(doc.rating))}${'☆'.repeat(5-Math.floor(doc.rating))}
              <span class="dpp-rating-val">${doc.rating}</span>
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
              <button class="dpp-btn-book" onclick="window.openBookingModal('${doc.name}','${doc.hospital}','${doc.slug}')">
                <i class="fa-solid fa-calendar-check"></i> Book Appointment
              </button>
              <a href="tel:+918877772277" class="dpp-btn-call">
                <i class="fa-solid fa-phone"></i>
              </a>
            </div>
          </div>

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

          <!-- PRACTICES AT -->
          ${practiceList.length ? `
          <div class="dpp-practices-card">
            <h4 class="dpp-practices-title"><i class="fa-solid fa-location-dot"></i> Practices At</h4>
            ${practiceList.map(h => `
              <div class="dpp-practice-item">
                <div class="dpp-practice-ic">🏥</div>
                <div class="dpp-practice-info">
                  <h5>${h.name}</h5>
                  ${h.location ? `<p>${h.location}</p>` : ''}
                  ${h.hours ? `<p class="dpp-practice-hours"><i class="fa-regular fa-clock"></i> ${h.hours}</p>` : ''}
                  ${h.slug ? `<a href="${urlHospital(h.slug)}" class="dpp-practice-link">View Hospital <i class="fa-solid fa-arrow-right"></i></a>` : ''}
                </div>
              </div>
            `).join('')}
          </div>` : ''}

          <!-- CLAIM PROFILE CARD -->
          <div class="dpp-claim-card">
            <div class="dpp-claim-icon">👨‍⚕️</div>
            <h4 class="dpp-claim-title">Is this you?</h4>
            <p class="dpp-claim-sub">Claim this profile to manage your details and appointments.</p>
            <button class="dpp-claim-btn" onclick="openClaimModal('${doc.slug}')">
              Claim Your Profile <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </aside>

        <!-- RIGHT: TABS + CONTENT -->
        <div class="dpp-main">
          <div class="dpp-tabs">
            <button class="dpp-tab active" data-tab="about" onclick="dpp2SwitchTab('about',this)">About</button>
            <button class="dpp-tab" data-tab="reviews" onclick="dpp2SwitchTab('reviews',this)">Reviews</button>
            <button class="dpp-tab" id="dpp2-booking-tab" data-tab="booking" onclick="dpp2SwitchTab('booking',this)">Booking</button>
          </div>

          <!-- ABOUT TAB (default) -->
          <div class="dpp-tab-content" id="dpp2-pane-about">
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
          <div class="dpp-tab-content" id="dpp2-pane-reviews" style="display:none">
            <div class="dpp-section">
              <h2 class="dpp-section-title"><i class="fa-solid fa-star"></i> Patient Reviews</h2>
              <div class="dpp-rating-summary">
                <div class="dpp-big-rating">${doc.rating}</div>
                <div>
                  <div class="dpp-stars-big">${'★'.repeat(Math.floor(doc.rating))}${'☆'.repeat(5-Math.floor(doc.rating))}</div>
                  <p>${doc.reviews} verified reviews</p>
                </div>
              </div>
              ${reviewsData.map(r => `
                <div class="dpp-review-card">
                  <div class="dpp-review-top">
                    <div class="dpp-reviewer-avatar">${r.initials}</div>
                    <div>
                      <p class="dpp-reviewer-name">${r.name}</p>
                      <div class="dpp-review-stars">★★★★★</div>
                    </div>
                    <span class="dpp-review-date">${r.ago}</span>
                  </div>
                  <p class="dpp-review-text">${r.text}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- BOOKING TAB -->
          <div class="dpp-tab-content" id="dpp2-pane-booking" style="display:none">
            <div class="dpp-section">
              <h2 class="dpp-section-title"><i class="fa-solid fa-location-dot"></i> Practice Locations &amp; Availability</h2>

              <div class="dpp2-hosp-card">
                ${hospImg ? `<img src="${hospImg}" alt="${doc.hospital}" class="dpp2-hosp-img" onerror="this.style.display='none'">` : `<div class="dpp2-hosp-img-fallback"><i class="fa-solid fa-hospital"></i></div>`}
                <div class="dpp2-hosp-body">
                  <div class="dpp2-hosp-top">
                    <div>
                      <h3 class="dpp2-hosp-name">${doc.hospital}</h3>
                      <p class="dpp2-hosp-addr"><i class="fa-solid fa-location-dot"></i> ${hospAddress}</p>
                    </div>
                    <div class="dpp2-hosp-fee-wrap">
                      <span class="dpp2-hosp-fee">₹${doc.fee.toLocaleString('en-IN')}</span>
                      <span class="dpp2-hosp-fee-label">Consultation fee</span>
                    </div>
                  </div>
                  <div class="dpp2-hosp-bottom">
                    <span class="dpp2-hosp-badge"><i class="fa-solid fa-shield-halved"></i> Verified</span>
                    <a href="https://maps.google.com/?q=${encodeURIComponent(doc.hospital + ' ' + hospAddress)}" target="_blank" rel="noopener" class="dpp2-directions-link">
                      <i class="fa-solid fa-diamond-turn-right"></i> Get Directions
                    </a>
                  </div>
                </div>
              </div>

              <div class="dpp2-date-rows" style="margin-top:16px">
                ${dateRows.map((row, idx) => `
                  <div class="dpp2-date-row" id="dpp2-row-${idx}">
                    <div class="dpp2-date-info">
                      <span class="dpp2-date-label">${row.label}</span>
                      <span class="dpp2-date-val">${row.dateStr}</span>
                    </div>
                    <span class="dpp2-time-range">10:00 AM – 04:00 PM</span>
                    <button class="dpp2-view-slots-btn" onclick="dpp2ToggleSlots(${idx},'${row.iso}','${row.label} ${row.dateStr}')">
                      View Slots <i class="fa-solid fa-chevron-down dpp2-chevron" id="dpp2-chev-${idx}"></i>
                    </button>
                    <div class="dpp2-slots-panel" id="dpp2-slots-${idx}" style="display:none">
                      <div class="dpp2-slots-grid">
                        ${ALL_SLOTS.map((s, si) => {
                          const endTime = calcEndTime(s, slotDuration);
                          const isBooked = si < 2;
                          const timeDisplay = isBooked ? 'Booked' : s + ' - ' + endTime;
                          const feeDisplay = isBooked ? '' : '₹' + doc.fee.toLocaleString('en-IN');
                          return `
                          <button class="dpp2-slot-pill ${isBooked ? 'dpp2-slot-unavail' : ''}"
                            ${isBooked ? 'disabled title="Already booked"' : `onclick="dpp2BookSlot('${doc.name}','${doc.hospital}','${row.iso}','${s}','${row.label} ${row.dateStr}','${doc.slug}')"`}>
                            <span class="dpp2-slot-time">${timeDisplay}</span>
                            ${feeDisplay ? '<span class="dpp2-slot-fee dpp2-slot-fee-green">' + feeDisplay + '</span>' : ''}
                          </button>`;
                        }).join('')}
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <div class="dpp-section">
              <h2 class="dpp-section-title"><i class="fa-solid fa-address-card"></i> Contact Information</h2>
              <div class="dpp2-contact-grid">
                <div class="dpp2-contact-item">
                  <div class="dpp2-contact-icon"><i class="fa-solid fa-phone"></i></div>
                  <div><p class="dpp2-contact-label">Helpline</p><a href="tel:+918877772277" class="dpp2-contact-val">+91-8877772277</a></div>
                </div>
                <div class="dpp2-contact-item">
                  <div class="dpp2-contact-icon"><i class="fa-solid fa-envelope"></i></div>
                  <div><p class="dpp2-contact-label">Email</p><a href="mailto:care@doctar.in" class="dpp2-contact-val">care@doctar.in</a></div>
                </div>
                <div class="dpp2-contact-item">
                  <div class="dpp2-contact-icon"><i class="fa-solid fa-hospital"></i></div>
                  <div><p class="dpp2-contact-label">Hospital</p><span class="dpp2-contact-val">${doc.hospital}</span></div>
                </div>
                <div class="dpp2-contact-item">
                  <div class="dpp2-contact-icon"><i class="fa-solid fa-clock"></i></div>
                  <div><p class="dpp2-contact-label">OPD Hours</p><span class="dpp2-contact-val">10:00 AM – 4:00 PM</span></div>
                </div>
              </div>
            </div>
          </div>

        </div><!-- /dpp-main -->
      </div><!-- /dpp-layout -->

      <!-- LATEST MEDICAL BLOGS -->
      ${generateBlogSectionHTML('doc-' + slug, pageBlogs)}

      <!-- PATIENT STORIES (Reels) -->
      ${generateReelsSectionHTML('doc-' + slug, pageVideos)}

      <!-- EXPERT HEALTH TIPS (Landscape) -->
      ${generateLandscapeSectionHTML('doc-' + slug, pageVideos)}

      <!-- FAQ SECTION -->
      ${generateFAQSectionHTML([
        { q: "What are " + doc.name + "'s qualifications?", a: doc.name + " holds " + doc.degree + " with " + doc.experience + " of clinical experience in " + doc.specialty + "." },
        { q: "Where does " + doc.name + " practice?", a: doc.name + " practices at " + doc.hospital + ", " + doc.location + "." },
        { q: "What is the consultation fee?", a: "The consultation fee is ₹" + doc.fee.toLocaleString("en-IN") + " per visit (in-clinic)." },
        { q: "What languages does " + doc.name + " speak?", a: doc.name + " speaks " + doc.language + "." },
        { q: "How do I book an appointment with " + doc.name + "?", a: 'Click the "Book Appointment" button above or call our 24/7 helpline at +91-8877772277.' },
        { q: "Is the first consultation free?", a: "Yes, the first consultation is completely free. Our care coordinator will reach out to confirm your appointment." },
      ], "Frequently Asked Questions — " + doc.name, "Everything you need to know about consulting " + doc.name + " through Doctar.")}
    `;

    appContainer.innerHTML = html;
    initBlogCarousel('doc-' + slug);
    window.scrollTo(0, 0);
    {
      const city = getCurrentCity() || 'Kolkata';
      const sameSpecialty = DOCTORS.filter(d =>
        d.slug !== doc.slug && d.specialty && doc.specialty &&
        d.specialty.toLowerCase() === doc.specialty.toLowerCase()
      );
      appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(city, {
        doctors: sameSpecialty.length ? sameSpecialty : undefined,
        doctorsHeading: doc.specialty ? `Top ${doc.specialty}s in ${city}` : `Top Doctors in ${city}`,
      }));
    }
  }

  window.dpp2SwitchTab = function(tab, btn) {
    // Works for both dpp-tab/dpp-tab-content (profile page) and dpp2-tab/dpp2-tab-pane
    document.querySelectorAll('.dpp-tab, .dpp2-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dpp-tab-content, .dpp2-tab-pane').forEach((p: any) => p.style.display = 'none');
    // Sync active state across BOTH tab sets (mobile top bar + in-main bar).
    document.querySelectorAll('.dpp-tab[data-tab="' + tab + '"], .dpp2-tab[data-tab="' + tab + '"]')
      .forEach(t => t.classList.add('active'));
    if (btn) btn.classList.add('active');
    const pane = document.getElementById('dpp2-pane-' + tab);
    if (pane) pane.style.display = 'block';

    // Mobile only (CSS-gated): collapse the full doctor card into a mini bar
    // on Reviews/Booking; restore it on About. Class toggle = no effect on desktop.
    const layout = (btn && btn.closest('.dpp-layout')) || document.querySelector('.dpp-layout');
    if (layout) layout.classList.toggle('dpp-collapsed', tab !== 'about');
  };

  window.dpp2ToggleSlots = function(idx, iso, dateLabel) {
    const panel = document.getElementById('dpp2-slots-' + idx);
    const chev  = document.getElementById('dpp2-chev-' + idx);
    const btn   = panel.previousElementSibling;
    const open  = panel.style.display === 'none';

    // Close all others
    document.querySelectorAll('.dpp2-slots-panel').forEach((p: any) => { p.style.display = 'none'; });
    document.querySelectorAll('.dpp2-chevron').forEach(c => c.classList.remove('rotated'));
    document.querySelectorAll('.dpp2-view-slots-btn').forEach(b => b.classList.remove('active'));

    if (open) {
      panel.style.display = 'block';
      chev.classList.add('rotated');
      btn.classList.add('active');
    }
  };

  window.dpp2BookSlot = function(docName, hospital, iso, slot, dateLabel, docSlug) {
    // Pre-fill booking modal state before opening
    window._bmState = window._bmState || {};
    window._bmState.date = iso;
    window._bmState.slot = slot;
    window.openBookingModal(docName, hospital, docSlug);
    // Highlight the right date pill after modal opens
    setTimeout(() => {
      const today = new Date().toISOString().split('T')[0];
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      if (iso === today) {
        document.getElementById('bm-date-today')?.click();
      } else if (iso === tomorrow) {
        document.getElementById('bm-date-tomorrow')?.click();
      } else {
        const otherBtn = document.getElementById('bm-date-other');
        const picker   = document.getElementById('bm-date-picker') as any;
        if (otherBtn && picker) {
          otherBtn.click();
          picker.value = iso;
          window._bmState.date = iso;
        }
      }
      // Highlight the slot
      document.querySelectorAll('.bm-slot').forEach((b: any) => {
        b.classList.toggle('active', b.dataset.slot === slot);
      });
    }, 60);
  };

  // Keep legacy switchDppTab for any other pages that reference it
  window.switchDppTab = function(tab, btn) {
    document.querySelectorAll('.dpp-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dpp-tab-content').forEach((c: any) => c.style.display = 'none');
    btn.classList.add('active');
    (document.getElementById('dpp-tab-' + tab) as any).style.display = 'block';
  };

  // =====================================================
  // RENDER HOSPITAL DETAIL PAGE

  // =====================================================
  async function renderDoctorsListingPage(catSlug, filters) {
    showSkeleton('list');
    document.body.classList.remove('dl-filter-open');

    const category = findCategory(catSlug);
    if (!category) { handleRoute(); return; }

    updatePageMeta({
      title: `Best ${category.name} Surgery Specialists & Surgeons in ${getCurrentCity()}`,
      description: `Find expert ${category.name} surgeons in ${getCurrentCity()}. ${category.name} surgery procedures, costs & recovery details. Free surgery consultation with verified surgeons.`,
      keywords: `${category.name} surgeons ${getCurrentCity()}, ${category.name} surgery, surgery specialists, book surgery, surgeons in ${getCurrentCity()}`,
      url: window.location.href
    });

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
            <a href="/">Home</a> <span>›</span>
            <a href="${urlCategory(category.slug)}">${category.name}</a> <span>›</span>
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

        <!-- Mobile-only filter trigger + backdrop (hidden on desktop via inline display:none) -->
        <div class="dl-filter-bar" style="display:none">
          <button type="button" class="dl-filter-fab" aria-expanded="false" onclick="toggleDLFilter(true)">
            <i class="fa-solid fa-sliders"></i> Filter
          </button>
        </div>
        <div class="dl-filter-backdrop" id="dl-filter-backdrop" style="display:none" onclick="toggleDLFilter(false)"></div>

        <!-- LEFT SIDEBAR: FILTERS -->
        <aside class="dl-sidebar">
          <button type="button" class="dl-filter-close" style="display:none" onclick="toggleDLFilter(false)" aria-label="Close filters">✕</button>
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
	            <div class="dl-card dl-card-clickable" onclick="navigate('/surgeons/${(doc.categories&&doc.categories[0])||'general'}/${doc.slug}/s')">
	              <div class="dl-card-left">
	                ${doctorAvatarHTML(doc, 'dl-card-avatar')}
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
                  <button class="dl-btn-book" style="background:${category.color};" onclick="event.stopPropagation(); window.openBookingModal('${doc.name}','${doc.hospital}','${doc.slug}')">
                    <i class="fa-solid fa-calendar-check"></i> Book Appointment
                  </button>
                  <button class="dl-btn-call" style="color:${category.color}; border-color:${category.color};" onclick="event.stopPropagation(); navigate('/surgeons/${(doc.categories&&doc.categories[0])||'general'}/${doc.slug}/s')">
                    <i class="fa-solid fa-phone"></i> Call
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

      </div>
    `;

    // Fetch category-specific videos for the bottom sections.
    const pageVideos = await fetchVideosForPage('category-' + catSlug);

    const bottomSections = `
      ${generatePatientReviewsHTML()}
      ${generateLandscapeSectionHTML('dl-' + catSlug, pageVideos, {
        eyebrow: 'EXPERT HEALTH TIPS',
        title: `Videos by ${category.name} Specialists`,
        subtitle: 'Expert health tips from our doctors',
      })}
      ${generateReelsSectionHTML('dl-' + catSlug, pageVideos, {
        eyebrow: 'PATIENT STORIES',
        title: `Patient Stories — ${category.name}`,
      })}
      ${generateFAQSectionHTML(doctorListingFAQs(category.name),
        `${category.name} — Frequently Asked Questions`,
        `Everything you need to know about consulting ${category.name} specialists through Doctar.`)}
    `;

    appContainer.innerHTML = html + bottomSections;
    initPatientReviews();

    // Store current filters on window for filter changes
    window._dlFilters = filters;
    appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(getCurrentCity() || 'Kolkata'));
  }

  // Called by filter radio buttons
  window.applyDLFilter = function(catSlug, key, value) {
    const filters = Object.assign({}, window._dlFilters || {}, { [key]: value });
    // parse numeric rating
    if (key === 'rating') filters.rating = parseFloat(value);
    renderDoctorsListingPage(catSlug, filters);
  };

  window.toggleDLFilter = function(open) {
    const sidebar = document.querySelector('.dl-sidebar');
    const backdrop = document.getElementById('dl-filter-backdrop');
    const trigger = document.querySelector('.dl-filter-fab');

    if (!sidebar || !backdrop) return;

    const shouldOpen = open !== undefined ? open : !sidebar.classList.contains('is-open');
    sidebar.classList.toggle('is-open', shouldOpen);
    backdrop.classList.toggle('is-open', shouldOpen);
    document.body.classList.toggle('dl-filter-open', shouldOpen);

    if (trigger) {
      trigger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    }
  };

  // =====================================================
  // RENDER ALL DOCTORS PAGE
  // =====================================================
  async function renderAllDoctorsPage(filters) {
    showSkeleton('list');
    const currentCity = getCurrentCity();
    filters = filters || { availability: 'all', rating: 0, fee: 'all', experience: 'all', gender: 'all' };

    updatePageMeta({
      title: `Best Surgery Specialists & Surgeons in ${currentCity}`,
      description: `Find verified surgery specialists in ${currentCity}. All surgery types — laparoscopic, orthopedic, cardiac & more. Free consultation, cashless surgery with expert surgeons.`,
      keywords: `surgery specialists ${currentCity}, surgeons in ${currentCity}, best surgery doctors, laparoscopic surgery, book surgery`,
      url: window.location.href
    });

    let doctors = getDoctorsForCity(currentCity);
    console.log('renderAllDoctorsPage first doctor:', doctors[0] || null);

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
      <div class="tpl-hero" style="background: linear-gradient(120deg, #5e409118 0%, #fff 70%);">
        <div class="container tpl-hero-inner">
          <div class="breadcrumb">
            <a href="/">Home</a> <span>›</span>
            <span class="breadcrumb-current">All Surgeons</span>
          </div>
          <h1 class="tpl-title">
            <span style="color:#5e4091">${doctors.length} Verified</span> Surgeons in ${currentCity}
          </h1>
          <p class="tpl-sub">Find the best board-certified surgeons in ${currentCity}. Book verified specialists available for in-clinic consultations with free consultation, insurance support &amp; cab service.</p>
          <div class="tpl-trust-row">
            <span class="tpl-badge"><i class="fa-solid fa-circle-check" style="color:#5e4091"></i> Licensed &amp; Verified</span>
            <span class="tpl-badge"><i class="fa-solid fa-hospital" style="color:#5e4091"></i> In-Clinic Available</span>
            <span class="tpl-badge"><i class="fa-solid fa-headset" style="color:#5e4091"></i> 24/7 On-Call Service</span>
            <span class="tpl-badge"><i class="fa-solid fa-car" style="color:#5e4091"></i> Free Cab</span>
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
                <button class="dc-btn-book" onclick="event.stopPropagation(); window.openBookingModal('${doc.name}','${doc.hospital}','${doc.slug}')">📅 Book Appointment</button>
                <button class="dc-btn-call" onclick="event.stopPropagation(); navigate('/surgeons/${(doc.categories&&doc.categories[0])||'general'}/${doc.slug}/s')">📞 Call</button>
              </div>
            </div>
          `).join('') + `</div>`}
        </div>
      </div>
    `;

    // All-doctors page has no single category — pull all videos via the home page key.
    const pageVideos = await fetchVideosForPage('home');

    const bottomSections = `
      ${generatePatientReviewsHTML()}
      ${generateLandscapeSectionHTML('all-docs', pageVideos, {
        eyebrow: 'EXPERT HEALTH TIPS',
        title: 'Videos by Our Specialists',
        subtitle: 'Expert health tips from our doctors',
      })}
      ${generateReelsSectionHTML('all-docs', pageVideos, {
        eyebrow: 'PATIENT STORIES',
        title: 'Patient Stories — Our Doctors',
      })}
      ${generateFAQSectionHTML(doctorListingFAQs('specialist'),
        'Frequently Asked Questions',
        'Everything you need to know about booking verified doctors through Doctar.')}
    `;

    appContainer.innerHTML = html + bottomSections;
    initPatientReviews();
    window._allDoctorsFilters = filters;
    appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(getCurrentCity() || 'Kolkata'));

    // ── Mobile filter: pill button + bottom-sheet overlay (same pattern as
    // the hospitals listing; sidebar radios keep their inline onchange when cloned) ──
    ['filterBtnMobile', 'filterOverlay', 'filterBackdrop'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });

    const filterBtn = document.createElement('button');
    filterBtn.className = 'filter-btn-mobile';
    filterBtn.innerHTML = '<i class="fa-solid fa-sliders"></i> Filter Doctors';
    filterBtn.id = 'filterBtnMobile';
    document.body.appendChild(filterBtn);

    const backdrop = document.createElement('div');
    backdrop.className = 'filter-overlay-backdrop';
    backdrop.id = 'filterBackdrop';
    document.body.appendChild(backdrop);

    const overlay = document.createElement('div');
    overlay.className = 'filter-overlay';
    overlay.id = 'filterOverlay';

    const sidebar = appContainer.querySelector('.tpl-sidebar');
    if (sidebar) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'filter-overlay-close';
      closeBtn.innerHTML = '✕';
      closeBtn.onclick = function() { window.closeFilter(); };
      overlay.appendChild(closeBtn);

      sidebar.querySelectorAll('.tpl-filter-head, .tpl-filter-group').forEach(function(el) {
        overlay.appendChild(el.cloneNode(true));
      });

      const applyBtn = document.createElement('button');
      applyBtn.className = 'filter-overlay-apply';
      applyBtn.textContent = 'Apply Filters';
      applyBtn.onclick = function() { window.closeFilter(); };
      overlay.appendChild(applyBtn);
    }
    document.body.appendChild(overlay);

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

  window.applyAllDoctorsFilter = function(key, value) {
    const filters = Object.assign({}, window._allDoctorsFilters || {}, { [key]: value });
    if (key === 'rating') filters.rating = parseFloat(value);
    renderAllDoctorsPage(filters);
  };

  // =====================================================
  // SURGEONS NEAR ME  (/surgeons-near-me/s)
  // Uses the user's real GPS location to find the nearest city, then lists the
  // surgeons there. Falls back to the selected city when GPS is unavailable.
  // =====================================================
  async function renderSurgeonsNearMe() {
    showSkeleton('list');
    const locSlug = await getUserLocationSlug();   // "salt-lake-kolkata" / "kolkata"
    const city = cityFromSlug(locSlug);

    updatePageMeta({
      title: `Surgery Specialists & Surgeons Near Me in ${city}`,
      description: `Find expert surgeons for all surgery types near you in ${city}. GPS-based results connect you to top surgery specialists. Free surgery consultation available.`,
      keywords: `surgeons near me ${city}, surgery specialists near me, surgery in ${city}, book surgery, expert surgeons`,
      url: window.location.href
    });

    const doctors = getDoctorsForCity(city);
    const pageVideos = await fetchVideosForPage('home');

    const cards = doctors.length === 0
      ? `<div class="tpl-empty"><i class="fa-solid fa-user-doctor"></i><p>No surgeons found near you. Try selecting a different city.</p></div>`
      : `<div class="doctors-grid tpl-doctors-grid">` + doctors.map(doc => `
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
                <button class="dc-btn-book" onclick="event.stopPropagation(); window.openBookingModal('${doc.name}','${doc.hospital}','${doc.slug}')">📅 Book Appointment</button>
                <button class="dc-btn-call" onclick="event.stopPropagation(); navigate('/surgeons/${(doc.categories&&doc.categories[0])||'general'}/${doc.slug}/s')">📞 Call</button>
              </div>
            </div>
          `).join('') + `</div>`;

    const html = `
      <div class="tpl-hero" style="background: linear-gradient(120deg, #5e409118 0%, #fff 70%);">
        <div class="container tpl-hero-inner">
          <div class="breadcrumb">
            <a href="/">Home</a> <span>›</span>
            <span class="breadcrumb-current">Surgeons Near Me</span>
          </div>
          <h1 class="tpl-title">
            <span style="color:#5e4091">${doctors.length} Verified</span> Surgeons Near Me
          </h1>
          <p class="tpl-sub">Board-certified surgeons closest to you${city ? ` in ${city}` : ''}. Book verified specialists available for in-clinic consultations with free consultation, insurance support &amp; cab service.</p>
          <div class="tpl-trust-row">
            <span class="tpl-badge"><i class="fa-solid fa-location-crosshairs" style="color:#5e4091"></i> Based on Your Location</span>
            <span class="tpl-badge"><i class="fa-solid fa-circle-check" style="color:#5e4091"></i> Licensed &amp; Verified</span>
            <span class="tpl-badge"><i class="fa-solid fa-headset" style="color:#5e4091"></i> 24/7 On-Call Service</span>
          </div>
        </div>
      </div>

      <div class="container tpl-layout" style="grid-template-columns:1fr;">
        <div class="tpl-cards-col">
          <div class="tpl-results-bar">
            <span><strong>${doctors.length}</strong> surgeon${doctors.length !== 1 ? 's' : ''} near you${city ? ` in ${city}` : ''}</span>
            <span class="tpl-sort-label">Sort: <strong>Nearest</strong> ▾</span>
          </div>
          ${cards}
        </div>
      </div>

      ${generatePatientReviewsHTML()}
    `;

    appContainer.innerHTML = html;
    initPatientReviews();
    appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(city || 'Kolkata'));
  }

  // =====================================================
  // HOSPITAL DISTANCE (live, via Browser Geolocation)
  // =====================================================
