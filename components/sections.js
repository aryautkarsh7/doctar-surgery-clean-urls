// =====================================================
// REUSABLE SECTIONS
// Reels, landscape videos, reviews, blog & FAQ section generators.
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================

  // =============================================
  // PATIENT STORIES (Reels) section
  // =============================================
  function generateReelsSectionHTML(uniqueId, videos, opts) {
    opts = opts || {};
    const reels = (videos || VIDEOS).filter(v => v.type === 'reel');
    if (!reels.length) return '';
    const id = uniqueId || 'home';
    const eyebrow = opts.eyebrow || 'PATIENT STORIES';
    const heading = opts.title || 'Real Stories, Real Results';
    const cards = reels.map(v => {
      let mediaContent = v.embed_code || '';
      if (v.platform === 'youtube' && v.video_url) {
        const embedUrl = getYouTubeEmbedUrl(v.video_url);
        if (embedUrl) {
          mediaContent = `<iframe loading="lazy" src="${embedUrl}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media" style="display:block;width:100%;height:100%;border-radius:18px 18px 0 0;border:none;"></iframe>`;
        }
      }
      return `
        <div class="reel-card">
          <div class="reel-media">
            ${mediaContent}
          </div>
          <div class="reel-footer">
            <span class="reel-doctor">${v.doctor_name}</span>
            <span class="reel-specialty">${v.specialty}</span>
          </div>
        </div>
      `;
    }).join('');
    return `
      <section class="reels-section" id="reels-section-${id}">
        <div class="container">
          <div class="section-eyebrow"><span class="eyebrow-dot"></span> ${eyebrow}</div>
          <h2 class="section-heading">${heading}</h2>
          ${opts.subtitle ? `<p class="section-subheading">${opts.subtitle}</p>` : ''}
          <div class="reels-scroll-row">${cards}</div>
        </div>
      </section>
    `;
  }



  // =============================================
  // EXPERT HEALTH TIPS (Landscape Videos) section
  // =============================================
  function generateLandscapeSectionHTML(uniqueId, videos, opts) {
    opts = opts || {};
    const vids = (videos || VIDEOS).filter(v => v.type === 'landscape');
    if (!vids.length) return '';
    const eyebrow = opts.eyebrow || 'EXPERT HEALTH TIPS';
    const heading = opts.title || 'Learn from Our Specialists';
    const cards = vids.slice(0, 3).map(v => {
      let mediaContent = v.embed_code || '';
      if (v.platform === 'youtube' && v.video_url) {
        const embedUrl = getYouTubeEmbedUrl(v.video_url);
        if (embedUrl) {
          mediaContent = `<iframe src="${embedUrl}" frameborder="0" allowfullscreen allow="autoplay; encrypted-media" style="display:block;width:100%;height:100%;border-radius:16px 16px 0 0;border:none;"></iframe>`;
        }
      }
      return `
        <div class="lv-card">
          <div class="lv-media">
            ${mediaContent}
          </div>
          <div class="lv-body">
            <h3 class="lv-title">${v.title}</h3>
            <div class="lv-meta">
              <span class="lv-doctor"><i class="fa-solid fa-user-doctor"></i> ${v.doctor_name}</span>
              <span class="lv-spec">${v.specialty}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');
    return `
      <section class="landscape-section" id="lv-section-${uniqueId || 'home'}">
        <div class="container">
          <div class="section-eyebrow"><span class="eyebrow-dot"></span> ${eyebrow}</div>
          <h2 class="section-heading">${heading}</h2>
          ${opts.subtitle ? `<p class="section-subheading">${opts.subtitle}</p>` : ''}
          <div class="lv-grid">${cards}</div>
        </div>
      </section>
    `;
  }

  // =============================================
  // Reusable PATIENT REVIEWS section (3 cards) — same design as homepage
  // =============================================
  const PATIENT_REVIEWS_DATA = [
    {
      name: 'Riya Sharma', city: 'Kolkata',
      consultation: 'Orthopedics Consultation', hospital: 'Apollo Hospitals',
      review: 'Booking through Doctar was incredibly smooth. The hospital information was transparent and the doctor consultation was scheduled within minutes.'
    },
    {
      name: 'Arjun Banerjee', city: 'Kolkata',
      consultation: 'Cardiology Consultation', hospital: 'Fortis Hospital',
      review: 'The entire process from finding a specialist to treatment was seamless. Highly recommended.'
    },
    {
      name: 'Priya Das', city: 'Kolkata',
      consultation: 'Gynecology Consultation', hospital: 'AMRI Hospital',
      review: 'Very easy appointment booking and excellent follow-up support after treatment.'
    },
  ];

  function generatePatientReviewsHTML() {
    const reviews = PATIENT_REVIEWS_DATA;
    return `
      <section class="pr-section" id="patient-reviews">
        <div class="container pr-inner">
          <div class="pr-header pr-fade-in">
            <div class="pr-eyebrow"><i class="fa-solid fa-users"></i> Patient Reviews</div>
            <h2 class="pr-title">Trusted by Thousands of Patients</h2>
            <p class="pr-subtitle">Real experiences from patients who booked consultations, treatments, diagnostics, and healthcare services through <strong>Doctar.</strong></p>
          </div>

          <div class="pr-reviews-wrap">
            <button class="pr-nav-btn pr-nav-prev" id="pr-prev" aria-label="Previous review">
              <i class="fa-solid fa-chevron-left"></i>
            </button>
            <div class="pr-reviews-viewport" id="pr-reviews-viewport">
              <div class="pr-reviews-track" id="pr-reviews-track">
                ${reviews.map(r => `
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
            ${reviews.map((_, i) => `<button class="pr-dot${i === 0 ? ' active' : ''}" data-slide="${i}"></button>`).join('')}
          </div>
        </div>
      </section>
    `;
  }

  // FAQ questions for a doctor specialty/category listing page
  function doctorListingFAQs(specialty) {
    const s = specialty || 'specialist';
    return [
      { q: `How do I find the best ${s} doctor near me?`, a: `Browse our list of verified ${s} doctors above. You can filter by rating, consultation fee, experience and availability to find the best match in your city, then book a free consultation in a few clicks.` },
      { q: `What is the consultation fee for a ${s} doctor?`, a: `Consultation fees vary by doctor and are clearly shown on each doctor's card above. Many of our ${s} specialists offer your first consultation free of charge.` },
      { q: `Is the first consultation free?`, a: `Yes. Your first consultation with our ${s} specialists is completely free. You can discuss your condition, explore treatment options, and get a personalised care plan at no cost.` },
      { q: `How do I book an appointment?`, a: `Click the "Book Appointment" button on any doctor's card, fill in your details, and our care coordinator will call you within 2 hours to confirm. You can also call our 24/7 helpline at +91-8877772277.` },
      { q: `Is insurance covered?`, a: `Yes. We accept all major health insurance providers and our dedicated insurance team handles the paperwork and claims processing for a cashless, hassle-free experience.` },
    ];
  }



  // Generate Blog Section HTML
  function generateBlogSectionHTML(uniqueId, posts) {
    const id = uniqueId || 'home';
    const blogPosts = Array.isArray(posts) && posts.length ? posts : BLOG_POSTS;
    return `
      <section class="blog-section" id="blog-section-${id}">
        <div class="container blog-inner">
          <div class="blog-header">
            <div class="blog-header-left">
              <div class="blog-eyebrow"><span class="blog-eyebrow-dot"></span> KNOWLEDGE BASE</div>
              <h2 class="blog-title">Latest Medical Blogs</h2>
            </div>
            <div class="blog-header-right">
              <a href="/blogs/s" class="blog-explore-link">
                EXPLORE ALL POSTS <i class="fa-solid fa-arrow-right"></i>
              </a>
              <div class="blog-nav-arrows">
                <button class="blog-nav-btn" id="blog-prev-${id}" aria-label="Previous blog">
                  <i class="fa-solid fa-chevron-left"></i>
                </button>
                <button class="blog-nav-btn" id="blog-next-${id}" aria-label="Next blog">
                  <i class="fa-solid fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="blog-carousel-wrap">
            <div class="blog-track" id="blog-track-${id}">
              ${blogPosts.map(post => `
                <a href="/blog/${post.slug}/s" class="blog-card">
                  <div class="blog-card-media">
                    <img loading="lazy" src="${post.thumbnail || post.image || 'images/service-general.png'}" alt="${post.title}" onerror="this.src='images/service-general.png'">
                    <span class="blog-card-category">${post.category}</span>
                  </div>
                  <div class="blog-card-body">
                    <span class="blog-card-date">${formatBlogDate(post.createdAt || post.date)}</span>
                    <h3 class="blog-card-title">${post.title}</h3>
                    <span class="blog-card-readmore">READ MORE <i class="fa-solid fa-chevron-right"></i></span>
                  </div>
                </a>
              `).join('')}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Generate FAQ Section HTML (reusable)
  function generateFAQSectionHTML(faqs, title, subtitle) {
    title = title || 'Frequently Asked Questions';
    subtitle = subtitle || 'Everything you need to know about booking surgery and consultations through Doctar.';
    return `
      <section class="faq-section" id="faq">
        <div class="container faq-inner">
          <div class="faq-header">
            <div class="faq-eyebrow"><i class="fa-solid fa-circle-question"></i> FAQs</div>
            <h2 class="faq-title">${title}</h2>
            <p class="faq-subtitle">${subtitle}</p>
          </div>
          <div class="faq-list">
            ${faqs.map((faq, i) => `
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
  }
