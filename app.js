// =====================================================
// DOCTAR Surgery Website — SPA Application Logic
// Handles routing, rendering, and interactions
// =====================================================
document.addEventListener('DOMContentLoaded', () => {
  const appContainer = document.getElementById('app');

  async function initRouter() {
    await loadBlogPosts();
    window.addEventListener('hashchange', handleRoute);
    handleRoute();
  }

  function handleRoute() {
    try {
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
      } else if (hash === '#/blogs') {
        renderBlogsPage();
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
      } else if (hash.startsWith('#/blog/')) {
        const blogSlug = hash.replace('#/blog/', '');
        renderBlogPage(blogSlug);
      } else if (hash.startsWith('#/search/')) {
        const query = decodeURIComponent(hash.replace('#/search/', ''));
        renderSearchPage(query);
      } else {
        renderHomePage();
      }
    } catch (err) {
      console.error('Routing error:', err);
      alert('Routing error: ' + err.message + '\nStack: ' + err.stack);
    }
  }

  // Render a category icon: PNG/WebP image when `iconImage` is set, otherwise the emoji.
  function catIcon(cat, px) {
    px = px || 28;
    if (cat && cat.iconImage) {
      return `<img src="${cat.iconImage}" alt="${(cat.name || '').replace(/"/g, '')}" style="width:${px}px;height:${px}px;object-fit:contain;display:inline-block;vertical-align:middle;">`;
    }
    return cat ? (cat.icon || '') : '';
  }

  function doctorAvatarHTML(doc, className) {
    const name = (doc && doc.name ? doc.name : 'Doctor').replace(/"/g, '');
    if (doc && doc.iconImage) {
      return `<img src="${doctorImageUrl(doc.iconImage)}" alt="${name}" class="${className} doctor-avatar-img" onerror="this.style.display='none';this.nextElementSibling.style.display='flex'"><div class="${className} doctor-avatar-fallback" style="display:none">👨‍⚕️</div>`;
    }
    return `<div class="${className} doctor-avatar-fallback">👨‍⚕️</div>`;
  }

  function doctorImageUrl(rawUrl) {
    const url = String(rawUrl || '').trim();
    if (!url) return '';
    if (/^(https?:|data:|blob:)/i.test(url)) return url;
    if (url.startsWith('/uploads/')) return API_BASE.replace(/\/$/, '') + url;
    if (url.startsWith('uploads/')) return API_BASE.replace(/\/$/, '') + '/' + url;
    return url;
  }

  function getDoctorCity(doctor) {
    return (doctor.location || '').split(',').pop().trim();
  }

  function getAvailableDoctorCities() {
    return [...new Set(DOCTORS.map(getDoctorCity).filter(Boolean))];
  }

  function getDoctarProfileUrl(doc) {
    const city = (doc.location || '').split(',').pop().trim().toLowerCase().replace(/\s+/g, '-') || 'india';
    const namePart = doc.name.replace(/^Dr\.?\s*/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    const specPart = doc.specialty.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
    const slug = `${namePart}-${specPart}-${city}`;
    return `https://doctar.in/doctors/${city}/${slug}`;
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
  // BLOG POSTS DATA (fetched from API, fallback to defaults)
  // =====================================================
  const BLOG_POSTS_FALLBACK = [
    {
      title: 'Thyroglossal Duct Cyst Excision Surgery in Deoghar',
      slug: 'thyroglossal-duct-cyst-excision-surgery-in-deoghar',
      category: 'Surgery',
      createdAt: '2026-06-03',
      thumbnail: 'images/service-general.png',
      excerpt: 'Learn about thyroglossal duct cyst excision surgery, a common procedure to remove cysts at the base of the tongue.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Excision of Branchial Cyst Surgery & Treatment in Deoghar',
      slug: 'excision-of-branchial-cyst-surgery-treatment-in-deoghar',
      category: 'Cyst Surgery',
      createdAt: '2026-06-04',
      thumbnail: 'images/service-cardiac.png',
      excerpt: 'Comprehensive guide to branchial cyst excision — what to expect before, during, and after surgery.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Best Mental Health Doctor Near Me in Kolkata for Expert Care',
      slug: 'best-mental-health-doctor-near-me-in-kolkata',
      category: 'Doctors & Specialists',
      createdAt: '2026-05-29',
      thumbnail: 'images/about-surgery.png',
      excerpt: 'Find the best mental health specialists in Kolkata. Expert guidance on choosing the right psychiatrist or psychologist.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Understanding Knee Replacement Surgery: A Complete Guide',
      slug: 'understanding-knee-replacement-surgery',
      category: 'Orthopedics',
      createdAt: '2026-05-25',
      thumbnail: 'images/service-neuro.png',
      excerpt: 'Everything you need to know about knee replacement — indications, procedure, recovery timeline, and costs in India.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Laparoscopic Gallbladder Surgery: Benefits & Recovery',
      slug: 'laparoscopic-gallbladder-surgery-benefits',
      category: 'General Surgery',
      createdAt: '2026-05-22',
      thumbnail: 'images/service-general.png',
      excerpt: 'Laparoscopic cholecystectomy is the gold standard for gallstone treatment. Here is what the recovery looks like.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Cataract Surgery Cost & Recovery Time in India',
      slug: 'cataract-surgery-cost-recovery-india',
      category: 'Ophthalmology',
      createdAt: '2026-05-18',
      thumbnail: 'images/service-cardiac.png',
      excerpt: 'A detailed breakdown of cataract surgery costs, lens options, and what the recovery period looks like in India.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Piles Treatment Without Surgery: Modern Laser Options',
      slug: 'piles-treatment-without-surgery-laser',
      category: 'Proctology',
      createdAt: '2026-05-15',
      thumbnail: 'images/about-surgery.png',
      excerpt: 'Modern laser treatment for piles (haemorrhoids) offers a painless, day-care alternative to traditional surgery.',
      author: 'Doctar Editorial',
    },
    {
      title: 'Heart Bypass Surgery: When Is It Necessary?',
      slug: 'heart-bypass-surgery-when-necessary',
      category: 'Cardiology',
      createdAt: '2026-05-10',
      thumbnail: 'images/service-neuro.png',
      excerpt: 'Understand what coronary artery bypass grafting (CABG) is, when it is recommended, and what recovery involves.',
      author: 'Doctar Editorial',
    }
  ];

  let BLOG_POSTS = [...BLOG_POSTS_FALLBACK];
  let VIDEOS = [];
  let SUBCATEGORIES = [];

  function formatBlogDate(raw) {
    if (!raw) return '';
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  // Simple in‑memory cache for API GET requests
  const apiCache = new Map();
  async function cachedFetch(url) {
    if (apiCache.has(url)) return apiCache.get(url);
    const res = await fetch(url);
    const json = await res.json();
    apiCache.set(url, json);
    return json;
  }

  // Fetch blog posts from the API; updates BLOG_POSTS in-place
  async function loadBlogPosts() {
    try {
      const json = await cachedFetch('/api/blogs?page=home');
      if (json.data && json.data.length > 0) {
        const published = json.data.filter(b => b.published !== false);
        if (published.length > 0) BLOG_POSTS = published;
      }
    } catch (e) {
      console.log('Blog API unavailable, using fallback data');
    }
  }

  async function fetchBlogsForPage(pageKey) {
    try {
      const json = await cachedFetch('/api/blogs?page=' + encodeURIComponent(pageKey));
      const blogs = (json.data || []).filter(b => b.published !== false);
      return blogs.length ? blogs : BLOG_POSTS;
    } catch (e) {
      return BLOG_POSTS;
    }
  }

  // Fetch videos for a specific page context.
  // pageKey: 'home' | 'doctor-[slug]' | 'category-[slug]'
  async function fetchVideosForPage(pageKey) {
    try {
      const res = await fetch('/api/videos?page=' + encodeURIComponent(pageKey));
      const json = await res.json();
      return json.data || [];
    } catch (e) {
      return [];
    }
  }

  // Derive YouTube embed URL from a watch/shorts URL
  function getYouTubeEmbedUrl(url) {
    let id = '';
    try {
      const u = new URL(url);
      if (u.hostname.includes('youtu.be')) {
        id = u.pathname.slice(1);
      } else {
        id = u.searchParams.get('v') || u.pathname.split('/').pop();
      }
    } catch (e) { id = ''; }
    return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=0&modestbranding=1&rel=0&showinfo=0&playsinline=1&controls=1` : '';
  }


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
              <a href="#/blogs" class="blog-explore-link">
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
                <a href="#/blog/${post.slug}" class="blog-card">
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

  // =============================================
  // BLOG POST PAGE
  // =============================================
  async function renderBlogPage(slug) {
    // Try to find in already-loaded data first; otherwise fetch
    let post = BLOG_POSTS.find(b => b.slug === slug);
    if (!post) {
      try {
        const res = await fetch('/api/blogs');
        const json = await res.json();
        post = (json.data || []).find(b => b.slug === slug);
      } catch (e) { /* ignore */ }
    }
    if (!post) {
      appContainer.innerHTML = `
        <div class="container" style="padding:80px 20px;text-align:center;">
          <h2>Blog post not found.</h2>
          <a href="#/" style="color:#5e4091;font-weight:700;">← Back to Home</a>
        </div>`;
      return;
    }

    const thumb = post.thumbnail || post.image || 'images/service-general.png';
    const date = formatBlogDate(post.createdAt || post.date);
    const author = post.author || 'Doctar Editorial';
    const tags = Array.isArray(post.tags) ? post.tags : (post.tags ? post.tags.split(',').map(t => t.trim()) : []);
    const rawContent = post.content || '';
    // Explicit contentType wins; fall back to legacy "<"-detection for old posts.
    const isHTML = post.contentType
      ? post.contentType === 'html'
      : rawContent.includes('<');
    const contentHTML = isHTML
      ? rawContent
      : rawContent
        .split('\n\n')
        .filter(p => p.trim())
        .map(p => `<p>${p.trim().replace(/\n/g, '<br>')}</p>`)
        .join('') || `<p>${post.excerpt || 'No content available yet.'}</p>`;
    const relatedBlogs = BLOG_POSTS
      .filter(item => item.slug !== post.slug && item.published !== false)
      .slice(0, 3);

    // HTML mode → render the raw HTML full-width between header & footer,
    // with NO blog chrome (no cover, title, meta, breadcrumb, related, etc).
    if (isHTML) {
      appContainer.innerHTML = `<div class="blog-html-full">${rawContent}</div>`;
      window.scrollTo(0, 0);
      return;
    }

    appContainer.innerHTML = `
      <div class="blog-page">
        <div class="container blog-page-inner">
          <!-- Breadcrumb -->
          <nav class="blog-breadcrumb">
            <a href="#/">Home</a>
            <i class="fa-solid fa-chevron-right"></i>
            <a href="#/blogs">Blog</a>
            <i class="fa-solid fa-chevron-right"></i>
            <span>${post.title}</span>
          </nav>

          <article class="blog-article">
            <!-- Header -->
            <header class="blog-article-header">
              <span class="blog-article-cat">${post.category}</span>
              <h1 class="blog-article-title">${post.title}</h1>
              <div class="blog-article-meta">
                <span><i class="fa-solid fa-user-pen"></i> ${author}</span>
                <span><i class="fa-solid fa-calendar"></i> ${date}</span>
                ${tags.length ? `<span><i class="fa-solid fa-tags"></i> ${tags.join(', ')}</span>` : ''}
              </div>
            </header>

            <!-- Thumbnail -->
            <div class="blog-article-cover">
              <img src="${thumb}" alt="${post.title}" onerror="this.src='images/service-general.png'">
            </div>

            <!-- Excerpt lead -->
            ${post.excerpt ? `<p class="blog-article-lead">${post.excerpt}</p>` : ''}

            <!-- Body content -->
            <div class="blog-article-body">${contentHTML}</div>

            <!-- Tags -->
            ${tags.length ? `
              <div class="blog-article-tags">
                ${tags.map(t => `<span class="blog-tag">${t}</span>`).join('')}
              </div>` : ''}
          </article>

          ${relatedBlogs.length ? `
            <section class="blog-related-section">
              <div class="blog-header" style="margin-bottom:20px;">
                <div class="blog-header-left">
                  <div class="blog-eyebrow"><span class="blog-eyebrow-dot"></span> RELATED READS</div>
                  <h2 class="blog-title">Related Blogs</h2>
                </div>
              </div>
              <div class="blog-related-grid">
                ${relatedBlogs.map(item => `
                  <a href="#/blog/${item.slug}" class="blog-card">
                    <div class="blog-card-media">
                      <img src="${item.thumbnail || item.image || 'images/service-general.png'}" alt="${item.title}" onerror="this.src='images/service-general.png'">
                      <span class="blog-card-category">${item.category}</span>
                    </div>
                    <div class="blog-card-body">
                      <span class="blog-card-date">${formatBlogDate(item.createdAt || item.date)}</span>
                      <h3 class="blog-card-title">${item.title}</h3>
                      <span class="blog-card-readmore">READ MORE <i class="fa-solid fa-chevron-right"></i></span>
                    </div>
                  </a>
                `).join('')}
              </div>
            </section>
          ` : ''}

          <!-- Back link -->
          <div style="margin-top:40px;">
            <a href="#/" class="btn-back-blog"><i class="fa-solid fa-arrow-left"></i> Back to Home</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderBlogsPage() {
    const posts = BLOG_POSTS.filter(post => post.published !== false);
    appContainer.innerHTML = `
      <section class="all-cat-hero">
        <div class="container all-cat-hero-inner">
          <div class="breadcrumb" style="margin-bottom: 20px;">
            <a href="#/">Home</a> <span>›</span>
            <span>Blogs</span>
          </div>
          <div class="all-cat-eyebrow"><i class="fa-solid fa-newspaper"></i> Medical Blogs</div>
          <h1 class="all-cat-title">Latest <span>Medical Blogs</span></h1>
          <p class="all-cat-sub">Helpful guides written by surgeons and care experts to help you prepare for treatment and recovery.</p>
        </div>
      </section>
      <section class="blog-section">
        <div class="container blog-inner">
          <div class="blog-related-grid">
            ${posts.map(post => `
              <a href="#/blog/${post.slug}" class="blog-card">
                <div class="blog-card-media">
                  <img src="${post.thumbnail || post.image || 'images/service-general.png'}" alt="${post.title}" onerror="this.src='images/service-general.png'">
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
      </section>
    `;
  }

  // Initialize blog carousel by ID
  function initBlogCarousel(uniqueId) {
    const id = uniqueId || 'home';
    const track = document.getElementById('blog-track-' + id);
    const prevBtn = document.getElementById('blog-prev-' + id);
    const nextBtn = document.getElementById('blog-next-' + id);
    if (!track || !prevBtn || !nextBtn) return;

    let scrollPos = 0;
    const cardWidth = track.querySelector('.blog-card')?.offsetWidth || 280;
    const gap = 24;
    const step = cardWidth + gap;
    const maxScroll = Math.max(0, track.scrollWidth - track.parentElement.offsetWidth);

    prevBtn.addEventListener('click', () => {
      scrollPos = Math.max(0, scrollPos - step);
      track.style.transform = 'translateX(-' + scrollPos + 'px)';
    });

    nextBtn.addEventListener('click', () => {
      scrollPos = Math.min(maxScroll, scrollPos + step);
      track.style.transform = 'translateX(-' + scrollPos + 'px)';
    });
  }

  // =====================================================
  // RENDER HOMEPAGE
  // =====================================================
  async function renderHomePage() {
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
      { id: 'p1', name: 'Knee Replacement', slug: 'knee-replacement', specialty: 'Orthopedics', icon: 'fa-solid fa-bone', color: '#7c3aed', price: '₹80,000*', rating: '95', reviews: '1,240', badge: 'POPULAR', recovery: '2 - 4 weeks' },
      { id: 'p2', name: 'Cataract Surgery', slug: 'cataract-surgery', specialty: 'Ophthalmology', icon: 'fa-solid fa-eye', color: '#3b82f6', price: '₹25,000*', rating: '98', reviews: '3,200', badge: 'RECOMMENDED', recovery: '3 - 7 days' },
      { id: 'p3', name: 'Gallstone Surgery', slug: 'gallbladder-removal', specialty: 'General Surgery', icon: 'fa-solid fa-stethoscope', color: '#22c55e', price: '₹40,000*', rating: '97', reviews: '2,100', badge: 'AVAILABLE', recovery: '3 - 5 days' },
      { id: 'p4', name: 'Angioplasty', slug: 'angioplasty', specialty: 'Cardiology', icon: 'fa-solid fa-heart-pulse', color: '#ef4444', price: '₹1,20,000*', rating: '96', reviews: '1,150', badge: 'POPULAR', recovery: '1 - 3 days' },
      { id: 'p5', name: 'Hair Transplant', slug: 'hair-transplant', specialty: 'Cosmetic Surgery', icon: 'fa-solid fa-wand-magic-sparkles', color: '#a855f7', price: '₹60,000*', rating: '94', reviews: '1,320', badge: 'AVAILABLE', recovery: '7 - 10 days' },
      { id: 'p6', name: 'Piles Treatment', slug: 'piles-treatment', specialty: 'Proctology', icon: 'fa-solid fa-notes-medical', color: '#f59e0b', price: '₹35,000*', rating: '96', reviews: '890', badge: 'POPULAR', recovery: '2 - 3 days' },
    ];

    window.popularProcedures = popularProcedures;
    const pageVideos = await fetchVideosForPage('home');
    const pageBlogs = await fetchBlogsForPage('home');
    const currentCity = getCurrentCity();
    const homeDoctors = getDoctorsForCity(currentCity);
    const isCitySpecific = homeDoctors.some(doc =>
      getDoctorCity(doc).toLowerCase() === currentCity.toLowerCase()
    );
    const doctorsHeading = isCitySpecific ? `Expert Surgeons in <span>${currentCity}</span>` : 'Our Expert <span>Surgeons</span>';
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

    const heroServices = [
      { title: 'Find a Surgeon', sub: 'Verified expert surgeons', img: 'images/hero-surgery.png', href: '#/doctors' },
      { title: 'Surgeries', sub: 'Safe & trusted procedures', img: 'images/service-general.png', href: '#/procedures' },
      { title: 'Specialities', sub: 'Browse by condition', img: 'images/service-neuro.png', href: '#/categories' },
      { title: 'Hospitals', sub: 'Top partner facilities', img: 'images/service-cardiac.png', href: '#/hospitals' },
      { title: 'Treatments', sub: 'Costs & recovery info', img: 'images/about-surgery.png', href: '#/procedures' },
      { title: 'Free Consultation', sub: 'Talk to our care team', img: 'images/service-general.png', href: 'tel:+918877772277' },
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
${treatmentShowcase.map(item => {
              // Prefer the admin-uploaded category cover image; fall back to the bundled
              // placeholder, then to a colored gradient + emoji/icon if neither exists.
              const liveCat = (typeof findCategory === 'function') ? findCategory(item.slug) : null;
              const coverImg = (liveCat && liveCat.image) ? liveCat.image : item.image;
              const visual = coverImg
                ? `<img src="${coverImg}" alt="${item.title}" onerror="this.onerror=null;this.src='${item.image}'">`
                : `<div class="treatment-visual-fallback" style="background:linear-gradient(135deg, ${item.color}, ${item.color}cc);"><i class="${item.icon}"></i></div>`;
              return `
              <a href="#/category/${item.slug}" class="treatment-showcase-card tb-card" style="--card-accent: ${item.color};">
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
              <div class="ds-doc-card tb-card" onclick="window.location.hash='#/doctor/${doc.slug}'">
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
                  <button class="ds-btn-profile" onclick="window.location.hash='#/doctor/${doc.slug}'">View Profile</button>
                  <button class="ds-btn-book" onclick="window.openBookingModal('${doc.name}','${doc.hospital}','${doc.slug}')">
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
                    <div class="card-logo-slot${hospital.logo ? '' : ' is-empty'}" title="Hospital logo">
                      ${hospital.logo
                        ? `<img src="${hospital.logo}" alt="${hospital.name} logo" onerror="this.closest('.card-logo-slot').classList.add('is-empty');this.remove();">`
                        : `<i class="fa-solid fa-hospital"></i>`}
                    </div>
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
    initFeaturedCarousel();
    initTreatmentCarousel();
    initCarousel('ds-track', 'ds-prev', 'ds-next', 3);
    initHospitalMapHover();
    initFeaturedHospitalMap(featuredHospitals, currentCity);
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
          <a href="#/procedures" class="fp-view-all">View All Procedures →</a>
        </div>
        <div class="fp-equal-grid">
          ${procedures.map(p => `
            <a href="#/treatment/${p.slug}" class="surg-card">
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
        <a href="#/procedures" class="fp-view-all-bottom">View All Procedures <i class="fa-solid fa-arrow-right"></i></a>
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
                <span style="font-size:1.6rem;">${catIcon(cat, 28)}</span>
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
    const category = findCategory(slug);
    if (!category) { handleRoute(); return; }
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

    const subPillsHTML = subcategories.length > 0 ? `
      <div class="cp-subcategories">
        <h3>Browse by Procedure Type</h3>
        <div class="cp-sub-pills">
          ${subcategories.map(sub => `
            <a href="#/treatments?subcategory=${sub.slug}" class="cp-sub-pill">${sub.name}</a>
          `).join('')}
        </div>
      </div>
    ` : '';

    // Single treatment card renderer (reused for grouped + flat layouts)
    const treatmentCardHTML = (t) => `
      <a href="#/treatment/${t.slug}" class="cat-treatment-card" style="--card-color: ${category.color}; --card-light: ${category.colorLight};">
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

    // Group treatments under their sub-categories; ungrouped → "General".
    const catSubcats = SUBCATEGORIES
      .filter(sc => sc.categorySlug === slug)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    let groupedTreatmentsHTML;
    if (catSubcats.length) {
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
            <a href="#/">Home</a> <span>›</span>
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
          <h2>All ${category.name} Treatments <span class="cat-count-badge">${treatments.length}</span></h2>
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
  }


  // =====================================================
  // RENDER TREATMENT PAGE (doctar.in listing style)
  // =====================================================
  async function renderTreatmentPage(slug, filters) {
    document.body.classList.remove('tpl-filter-open');

    const treatment = findTreatment(slug);
    if (!treatment) { handleRoute(); return; }
    const category = findCategory(treatment.categorySlug);
    const currentCity = getCurrentCity();
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
	            <div class="doctor-card dc-clickable" onclick="window.location.hash='#/doctor/${doc.slug}'">
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
                <button class="dc-btn-call" onclick="event.stopPropagation(); window.location.hash='#/doctor/${doc.slug}'">📞 Call</button>
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

    const shouldOpen = open !== undefined ? open : !sidebar.classList.contains('is-open');
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
  // =====================================================
  async function renderDoctorProfilePage(slug) {
    const doc = DOCTORS.find(d => d.slug === slug);
    if (!doc) { handleRoute(); return; }
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
        <a href="#/">Home</a> <span>›</span>
        <a href="#/doctors/${doc.categories[0]}">Doctors</a> <span>›</span>
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
          <img class="dpp-mini-photo" src="${doc.image || ''}" alt="${doc.name}" onerror="this.style.display='none'">
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
                  ${h.slug ? `<a href="#/hospital/${h.slug}" class="dpp-practice-link">View Hospital <i class="fa-solid fa-arrow-right"></i></a>` : ''}
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
  }

  window.dpp2SwitchTab = function(tab, btn) {
    // Works for both dpp-tab/dpp-tab-content (profile page) and dpp2-tab/dpp2-tab-pane
    document.querySelectorAll('.dpp-tab, .dpp2-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.dpp-tab-content, .dpp2-tab-pane').forEach(p => p.style.display = 'none');
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
    document.querySelectorAll('.dpp2-slots-panel').forEach(p => { p.style.display = 'none'; });
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
        const picker   = document.getElementById('bm-date-picker');
        if (otherBtn && picker) {
          otherBtn.click();
          picker.value = iso;
          window._bmState.date = iso;
        }
      }
      // Highlight the slot
      document.querySelectorAll('.bm-slot').forEach(b => {
        b.classList.toggle('active', b.dataset.slot === slot);
      });
    }, 60);
  };

  // Keep legacy switchDppTab for any other pages that reference it
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

    // Doctors at this hospital: match by doc.hospitals[] (slug or name) OR doc.hospital string.
    const hospitalDoctors = DOCTORS.filter(doc => {
      if (Array.isArray(doc.hospitals)) {
        const inList = doc.hospitals.some(h => {
          const name = (typeof h === 'string') ? h : (h.name || '');
          const hslug = (typeof h === 'object') ? (h.slug || '') : '';
          return name === hospital.name || hslug === hospital.slug;
        });
        if (inList) return true;
      }
      return doc.hospital === hospital.name;
    });

    // Group doctors by their primary category (categories[0]); ungrouped → "Other Specialists".
    const doctorsByCategory = (() => {
      const groups = {};
      hospitalDoctors.forEach(doc => {
        const catSlug = (Array.isArray(doc.categories) && doc.categories[0]) ? doc.categories[0] : '_other';
        (groups[catSlug] = groups[catSlug] || []).push(doc);
      });
      return Object.keys(groups).map(catSlug => ({
        label: catSlug === '_other' ? 'Other Specialists' : ((findCategory(catSlug) || {}).name || catSlug),
        doctors: groups[catSlug],
      }));
    })();
    const visitReasons = Array.from(new Set([
      'General Consultation',
      ...(hospital.specialties || []),
      ...(hospital.services || [])
    ].filter(Boolean)));
    const faqs = [
      { q: `Where is ${hospital.name} located?`, a: `${hospital.name} is located at ${hospital.address}.` },
      { q: `What type of facility is ${hospital.name}?`, a: `${hospital.name} is a ${hospital.type.toLowerCase()} with support for planned surgical care.` },
      { q: 'Is insurance support available?', a: 'Yes, our care team helps with insurance paperwork, cashless approval, and claim coordination wherever applicable.' },
      { q: 'Can I book a free consultation here?', a: 'Yes, you can request a free consultation and our coordinator will help confirm the best doctor and slot.' },
    ];

    const html = `
      <div class="container dpp-breadcrumb">
        <a href="#/">Home</a> <span>›</span>
        <a href="#/">Hospitals</a> <span>›</span>
        <span>${hospital.name}</span>
      </div>

      <section class="container hpp-hero">
        <div class="hpp-hero-media">
          <img src="${hospital.image}" alt="${hospital.name}">
          <div class="hpp-hero-logo-slot${hospital.logo ? '' : ' is-empty'}" title="Hospital logo">
            ${hospital.logo
              ? `<img src="${hospital.logo}" alt="${hospital.name} logo" onerror="this.closest('.hpp-hero-logo-slot').classList.add('is-empty');this.remove();">`
              : `<i class="fa-solid fa-hospital"></i>`}
          </div>
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
            <button class="hpp-primary-btn" onclick="window.openBookingModal('','${hospital.name}')">
              <i class="fa-solid fa-calendar-check"></i> Book FREE Appointment
            </button>
            <a href="tel:${hospital.phone.replace(/-/g, '')}" class="hpp-secondary-btn">
              <i class="fa-solid fa-phone"></i> Call Hospital
            </a>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${(hospital.map && hospital.map.lat && hospital.map.lng) ? `${hospital.map.lat},${hospital.map.lng}` : encodeURIComponent((hospital.address || '') + ', ' + (hospital.city || ''))}"
               target="_blank"
               rel="noopener noreferrer"
               class="hpp-secondary-btn"
               style="display:inline-flex; align-items:center; gap:8px;">
              <i class="fa-solid fa-location-arrow"></i> Get Directions
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

          <div id="hpp-real-map" style="width:100%; height:350px; border-radius:12px; z-index:1;"></div>
          <a class="hpp-directions-btn" href="https://www.google.com/maps/dir/?api=1&destination=${(hospital.map && hospital.map.lat && hospital.map.lng) ? `${hospital.map.lat},${hospital.map.lng}` : encodeURIComponent((hospital.address || '') + ', ' + (hospital.city || ''))}" target="_blank" rel="noopener noreferrer">
            <i class="fa-solid fa-location-arrow"></i> Get Directions
          </a>
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
            <h2><i class="fa-solid fa-user-doctor"></i> Available Doctors</h2>
            ${hospitalDoctors.length === 0 ? `
              <p>Our care team will help match you with the right specialist at this hospital.</p>
            ` : doctorsByCategory.map(group => `
              <div class="hpp-doc-group">
                <h3 class="hpp-doc-cat">${group.label}</h3>
                <div class="hpp-doc-row">
                  ${group.doctors.map(doc => `
                    <a href="#/doctor/${doc.slug}" class="hpp-doc-card">
                      <div class="hpp-doc-photo">${doc.image ? `<img src="${doc.image}" alt="${doc.name}" onerror="this.parentNode.textContent='${(doc.name||'').replace(/^Dr\.?\s*/i,'').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase()}'">` : (doc.name||'').replace(/^Dr\.?\s*/i,'').split(/\s+/).map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div>
                      <div class="hpp-doc-info">
                        <h4 class="hpp-doc-name">${doc.name}</h4>
                        <p class="hpp-doc-spec">${doc.specialty || ''}</p>
                        <p class="hpp-doc-meta">${doc.rating ? '⭐ ' + doc.rating : ''}${doc.rating && doc.experience ? ' | ' : ''}${doc.experience || ''}</p>
                        ${doc.hours || doc.nextSlot ? `<p class="hpp-doc-hours"><i class="fa-regular fa-clock"></i> ${doc.hours || ('Next: ' + doc.nextSlot)}</p>` : ''}
                        <span class="hpp-doc-book">Book <i class="fa-solid fa-arrow-right"></i></span>
                      </div>
                    </a>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </section>

          <section class="hpp-section" id="hpp-booking">
            <h2><i class="fa-solid fa-calendar-check"></i> Book Appointment</h2>
            <form class="hpp-book-card" id="hpp-booking-form">
              <input type="text" id="hpp-patient-name" class="dpp-input" placeholder="Patient Name" required>
              <div class="phone-prefix-wrap">
                <span class="phone-prefix-badge">+91</span>
                <input type="tel" id="hpp-patient-phone" class="dpp-input phone-prefix-input" placeholder="XXXXX XXXXX" maxlength="10" inputmode="numeric" required>
              </div>
              <p id="hpp-phone-error" class="phone-error-msg" style="display:none">Please enter a valid 10-digit mobile number</p>
              <input type="email" id="hpp-patient-email" class="dpp-input" placeholder="Email (optional)">
              <select id="hpp-visit-reason" class="dpp-input" required>
                <option value="">Reason of Visit / Select Disease</option>
                ${visitReasons.map(reason => `<option value="${reason}">${reason}</option>`).join('')}
              </select>
              <input type="date" id="hpp-preferred-date" class="dpp-input" aria-label="Preferred Date">
              <select id="hpp-preferred-time" class="dpp-input" aria-label="Preferred Time">
                <option value="">Preferred Time</option>
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:00 AM">11:00 AM</option>
                <option value="12:00 PM">12:00 PM</option>
                <option value="2:00 PM">2:00 PM</option>
                <option value="3:00 PM">3:00 PM</option>
                <option value="4:00 PM">4:00 PM</option>
                <option value="5:00 PM">5:00 PM</option>
              </select>
              <button type="submit" class="dpp-confirm-btn" id="hpp-submit-btn">
                <i class="fa-solid fa-calendar-check"></i> Request Appointment
              </button>
              <p id="hpp-booking-message" class="hpp-booking-message" aria-live="polite"></p>
              <p class="dpp-form-note"><i class="fa-solid fa-lock"></i> 100% Private &amp; Confidential</p>
            </form>
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
    initHospitalDetailMap(hospital);
    setupHospitalBookingForm(hospital);
  }

  function setupHospitalBookingForm(hospital) {
    const form = document.getElementById('hpp-booking-form');
    if (!form) return;

    const phoneInput = document.getElementById('hpp-patient-phone');
    const msgEl = document.getElementById('hpp-booking-message');
    const errEl = document.getElementById('hpp-phone-error');
    const btn = document.getElementById('hpp-submit-btn');
    const defaultBtnHTML = btn ? btn.innerHTML : '';

    if (phoneInput) {
      phoneInput.addEventListener('input', () => {
        phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
        if (errEl) errEl.style.display = 'none';
      });
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      if (!msgEl || !btn) return;

      const name = document.getElementById('hpp-patient-name')?.value.trim() || '';
      const rawPhone = phoneInput?.value.replace(/\D/g, '') || '';
      const email = document.getElementById('hpp-patient-email')?.value.trim() || '';
      const disease = document.getElementById('hpp-visit-reason')?.value || '';
      const appointmentDate = document.getElementById('hpp-preferred-date')?.value || '';
      const appointmentTime = document.getElementById('hpp-preferred-time')?.value || '';

      msgEl.className = 'hpp-booking-message';
      msgEl.textContent = '';

      if (!name || rawPhone.length !== 10 || !disease) {
        if (rawPhone.length !== 10 && errEl) errEl.style.display = 'block';
        msgEl.classList.add('error');
        msgEl.textContent = 'Please fill Patient Name, Phone Number and Reason of Visit.';
        return;
      }
      if (errEl) errEl.style.display = 'none';

      btn.disabled = true;
      btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';

      try {
        const payload = {
          name,
          phone: '+91' + rawPhone,
          disease,
          email,
          hospital: hospital.name,
          location: hospital.city || hospital.address || 'Not specified',
          source: 'surgery.doctar.in',
          appointmentDate,
          appointmentTime
        };

        const res = await fetch('http://localhost:3001/api/bookings/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || json.success === false) throw new Error(json.message || 'Booking failed');

        msgEl.classList.add('success');
        msgEl.textContent = 'Appointment request sent! Our team will call you shortly.';
        form.reset();
      } catch (err) {
        console.error('Hospital booking error:', err);
        msgEl.classList.add('error');
        msgEl.textContent = 'Something went wrong. Please call +91-8877772277';
      } finally {
        btn.disabled = false;
        btn.innerHTML = defaultBtnHTML;
      }
    });
  }

  // Render a real, live OSM/Leaflet map on the hospital detail page when
  // coordinates exist; otherwise the decorative fallback stays in place.
  function initHospitalDetailMap(hospital) {
    const mapEl = document.getElementById('hpp-real-map');
    if (!mapEl || typeof L === 'undefined') return;

    const lat = (hospital.map && hospital.map.lat != null) ? hospital.map.lat : 22.5726;
    const lng = (hospital.map && hospital.map.lng != null) ? hospital.map.lng : 88.3639;

    // Tear down any previous instance (re-navigating between hospitals).
    if (window._hospitalDetailMap) {
      window._hospitalDetailMap.remove();
      window._hospitalDetailMap = null;
    }
    mapEl.innerHTML = '';

    const map = L.map('hpp-real-map', {
      zoomControl: true,
      scrollWheelZoom: false,
    }).setView([lat, lng], 15);

    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap © CARTO',
    }).addTo(map);

    const marker = L.marker([lat, lng]).addTo(map);
    marker.bindPopup(`
      <b>${hospital.name}</b><br>
      ${hospital.address}
    `).openPopup();

    window._hospitalDetailMap = map;
    setTimeout(() => map.invalidateSize(), 100);
  }

  // =====================================================
  // RENDER DOCTORS LISTING PAGE
  // =====================================================
  async function renderDoctorsListingPage(catSlug, filters) {
    document.body.classList.remove('dl-filter-open');

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
	            <div class="dl-card dl-card-clickable" onclick="window.location.hash='#/doctor/${doc.slug}'">
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
                  <button class="dl-btn-call" style="color:${category.color}; border-color:${category.color};" onclick="event.stopPropagation(); window.location.hash='#/doctor/${doc.slug}'">
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
    const currentCity = getCurrentCity();
    filters = filters || { availability: 'all', rating: 0, fee: 'all', experience: 'all', gender: 'all' };

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
            <a href="#/">Home</a> <span>›</span>
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
	            <div class="doctor-card dc-clickable" onclick="window.location.hash='#/doctor/${doc.slug}'">
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
                <button class="dc-btn-call" onclick="event.stopPropagation(); window.location.hash='#/doctor/${doc.slug}'">📞 Call</button>
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
  }

  window.applyAllDoctorsFilter = function(key, value) {
    const filters = Object.assign({}, window._allDoctorsFilters || {}, { [key]: value });
    if (key === 'rating') filters.rating = parseFloat(value);
    renderAllDoctorsPage(filters);
  };

  // =====================================================
  // HOSPITAL DISTANCE (live, via Browser Geolocation)
  // =====================================================
  // Great-circle distance between two lat/lng points (km), no paid API.
  function getHaversineDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  }

  // Ask for location once and update every .hosp-distance span on the page.
  function updateHospitalDistances() {
    const els = document.querySelectorAll('.hosp-distance');
    if (!els.length) return;
    if (!navigator.geolocation) {
      els.forEach(el => { el.textContent = 'Distance unavailable'; });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        document.querySelectorAll('.hosp-distance').forEach(el => {
          const lat = parseFloat(el.dataset.lat);
          const lng = parseFloat(el.dataset.lng);
          if (!isNaN(lat) && !isNaN(lng)) {
            el.textContent = getHaversineDistance(userLat, userLng, lat, lng) + ' km away';
          } else {
            el.textContent = 'Distance unavailable';
          }
        });
      },
      () => {
        document.querySelectorAll('.hosp-distance').forEach(el => {
          el.textContent = 'Distance unavailable';
        });
      },
      { timeout: 8000 }
    );
  }

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
      <div class="tpl-hero" style="background: linear-gradient(120deg, #5e409118 0%, #fff 70%);">
        <div class="container tpl-hero-inner">
          <div class="breadcrumb">
            <a href="#/">Home</a> <span>›</span>
            <span class="breadcrumb-current">All Partner Hospitals</span>
          </div>
          <h1 class="tpl-title">
            <span style="color:#5e4091">${hospitals.length} Partner</span> Hospitals in ${currentCity}
          </h1>
          <p class="tpl-sub">Find the best partner hospitals and surgical clinics in ${currentCity}. Modern modular OT facilities, ICU support, zero cashless billing hassles, and free cab pick-up &amp; drop.</p>
          <div class="tpl-trust-row">
            <span class="tpl-badge"><i class="fa-solid fa-circle-check" style="color:#5e4091"></i> NABH/JCI Accredited</span>
            <span class="tpl-badge"><i class="fa-solid fa-shield-halved" style="color:#5e4091"></i> Zero Cashless Hassle</span>
            <span class="tpl-badge"><i class="fa-solid fa-car" style="color:#5e4091"></i> Free Home-to-Hospital Cab</span>
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
                <div class="card-logo-slot${hospital.logo ? '' : ' is-empty'}" title="Hospital logo">
                  ${hospital.logo
                    ? `<img src="${hospital.logo}" alt="${hospital.name} logo" onerror="this.closest('.card-logo-slot').classList.add('is-empty');this.remove();">`
                    : `<i class="fa-solid fa-hospital"></i>`}
                </div>
              </div>
              <div class="hl-content">
                <div class="hl-title-row">
                  <div>
                    <h3>${hospital.name}</h3>
                    <div class="hl-meta-list">
                      <span><i class="fa-solid fa-location-dot"></i>${hospital.address}</span>
                      <span><i class="fa-solid fa-route"></i> <span class="hosp-distance" data-lat="${hospital.map && hospital.map.lat != null ? hospital.map.lat : ''}" data-lng="${hospital.map && hospital.map.lng != null ? hospital.map.lng : ''}">Locating…</span></span>
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
    updateHospitalDistances();
  }

  window.applyAllHospitalsFilter = function(key, value) {
    const filters = Object.assign({}, window._allHospitalsFilters || {}, { [key]: value });
    if (key === 'rating') filters.rating = parseFloat(value);
    renderAllHospitalsPage(filters);
  };


  // =====================================================
  // LOCATION MODAL
  // =====================================================

  const CITY_DATA = [
    { name: 'Delhi NCR',  lat: 28.6139, lng: 77.2090, available: true  },
    { name: 'Mumbai',     lat: 19.0760, lng: 72.8777, available: true  },
    { name: 'Kolkata',    lat: 22.5726, lng: 88.3639, available: true  },
    { name: 'Bangalore',  lat: 12.9716, lng: 77.5946, available: true  },
    { name: 'Chennai',    lat: 13.0827, lng: 80.2707, available: false },
    { name: 'Hyderabad',  lat: 17.3850, lng: 78.4867, available: false },
    { name: 'Ahmedabad',  lat: 23.0225, lng: 72.5714, available: false },
    { name: 'Pune',       lat: 18.5204, lng: 73.8567, available: false },
    { name: 'Surat',      lat: 21.1702, lng: 72.8311, available: false },
    { name: 'Jaipur',     lat: 26.9124, lng: 75.7873, available: false },
    { name: 'Lucknow',    lat: 26.8467, lng: 80.9462, available: false },
    { name: 'Chandigarh', lat: 30.7333, lng: 76.7794, available: false },
  ];

  function injectLocationModal() {
    if (document.getElementById('loc-overlay')) return;
    const citiesHTML = CITY_DATA.map(c => `
      <div class="loc-city-item${c.available ? '' : ' loc-city-soon'}"
           data-city="${c.name}" data-available="${c.available}"
           onclick="window.locSelectCity('${c.name}',${c.available})">
        <i class="fa-solid fa-location-dot loc-city-icon"></i>
        <span class="loc-city-name">${c.name}</span>
        ${!c.available ? '<span class="loc-city-badge">Soon</span>' : ''}
      </div>`).join('');

    document.body.insertAdjacentHTML('beforeend', `
      <div id="loc-overlay" class="loc-overlay" onclick="if(event.target===this)window.closeLocationModal()">
        <div class="loc-modal">
          <div class="loc-header">
            <div>
              <h2 class="loc-title">Select Location</h2>
              <p class="loc-sub">Find healthcare experts near you</p>
            </div>
            <button class="loc-close" onclick="window.closeLocationModal()">×</button>
          </div>
          <div class="loc-body">
            <div class="loc-left">
              <div class="loc-search-wrap">
                <i class="fa-solid fa-magnifying-glass loc-search-icon"></i>
                <input type="text" id="loc-search-input" class="loc-search-input"
                  placeholder="Search city, area, or zip code..."
                  oninput="window.locFilterCities(this.value)">
              </div>
              <button class="loc-current-btn" onclick="window.locUseCurrentLocation()">
                <i class="fa-solid fa-location-crosshairs"></i> Use Current Location
              </button>
              <button class="loc-global-btn" onclick="this.classList.toggle('open')">
                <span><i class="fa-solid fa-globe"></i> Browse Global Locations</span>
                <i class="fa-solid fa-chevron-down loc-global-chev"></i>
              </button>
              <div class="loc-cities-label">POPULAR CITIES</div>
              <div class="loc-cities-list" id="loc-cities-list">${citiesHTML}</div>
            </div>
            <div class="loc-map-wrap"><div id="loc-map"></div></div>
          </div>
          <div class="loc-footer">
            <div class="loc-footer-hint">
              <i class="fa-solid fa-magnifying-glass"></i>
              <span id="loc-selected-hint">Select a location from the list or map</span>
            </div>
            <div class="loc-footer-btns">
              <button class="loc-cancel-btn" onclick="window.closeLocationModal()">Cancel</button>
              <button class="loc-confirm-btn" id="loc-confirm-btn" onclick="window.locConfirm()" disabled>Confirm</button>
            </div>
          </div>
        </div>
      </div>`);
  }

  window._locPending = null;
  window._locMap = null;

  window.openLocationModal = function() {
    injectLocationModal();
    window._locPending = null;
    document.getElementById('loc-confirm-btn').disabled = true;
    document.getElementById('loc-selected-hint').textContent = 'Select a location from the list or map';
    document.getElementById('loc-search-input').value = '';
    window.locFilterCities('');
    const current = getCurrentCity();
    document.querySelectorAll('.loc-city-item').forEach(el => {
      el.classList.toggle('loc-city-active', el.dataset.city === current);
    });
    document.getElementById('loc-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(window.locInitMap, 100);
  };

  window.closeLocationModal = function() {
    const el = document.getElementById('loc-overlay');
    if (el) { el.classList.remove('open'); document.body.style.overflow = ''; }
  };

  window.locInitMap = function() {
    if (!document.getElementById('loc-map') || typeof L === 'undefined') return;
    if (window._locMap) { window._locMap.invalidateSize(); return; }
    const map = L.map('loc-map', { zoomControl: true, scrollWheelZoom: true, attributionControl: true })
      .setView([22.5, 80.0], 4);
    map.attributionControl.setPrefix('');
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 18, attribution: '© OpenStreetMap contributors © CARTO',
    }).addTo(map);
    CITY_DATA.forEach(city => {
      const icon = L.divIcon({
        className: '',
        html: `<div class="loc-map-pin${city.available ? ' loc-map-pin-avail' : ''}">${city.name}</div>`,
        iconAnchor: [0, 20],
      });
      L.marker([city.lat, city.lng], { icon }).addTo(map)
        .on('click', () => {
          window.locSelectCity(city.name, city.available);
          map.flyTo([city.lat, city.lng], 7, { animate: true, duration: 0.8 });
        });
    });
    window._locMap = map;
  };

  window.locSelectCity = function(cityName, available) {
    window._locPending = cityName;
    document.querySelectorAll('.loc-city-item').forEach(el => {
      el.classList.toggle('loc-city-active', el.dataset.city === cityName);
    });
    const confirmBtn = document.getElementById('loc-confirm-btn');
    const hint = document.getElementById('loc-selected-hint');
    if (available === true || available === 'true') {
      hint.textContent = `📍 ${cityName} selected`;
      confirmBtn.disabled = false;
    } else {
      hint.textContent = `${cityName} — coming soon! Please choose an available city.`;
      confirmBtn.disabled = true;
    }
    const item = document.querySelector(`.loc-city-item[data-city="${cityName}"]`);
    if (item) item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    const cd = CITY_DATA.find(c => c.name === cityName);
    if (cd && window._locMap) window._locMap.flyTo([cd.lat, cd.lng], 7, { animate: true, duration: 0.8 });
  };

  window.locFilterCities = function(query) {
    const q = (query || '').toLowerCase();
    document.querySelectorAll('.loc-city-item').forEach(el => {
      el.style.display = el.dataset.city.toLowerCase().includes(q) ? '' : 'none';
    });
    const label = document.querySelector('.loc-cities-label');
    if (label) label.style.display = q ? 'none' : '';
  };

  window.locUseCurrentLocation = function() {
    if (!navigator.geolocation) { alert('Geolocation not supported.'); return; }
    const btn = document.querySelector('.loc-current-btn');
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Detecting...';
    btn.disabled = true;
    navigator.geolocation.getCurrentPosition(pos => {
      btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Use Current Location';
      btn.disabled = false;
      const { latitude: lat, longitude: lng } = pos.coords;
      let closest = CITY_DATA[0], minDist = Infinity;
      CITY_DATA.forEach(c => {
        const d = Math.hypot(c.lat - lat, c.lng - lng);
        if (d < minDist) { minDist = d; closest = c; }
      });
      window.locSelectCity(closest.name, closest.available);
    }, () => {
      btn.innerHTML = '<i class="fa-solid fa-location-crosshairs"></i> Use Current Location';
      btn.disabled = false;
      alert('Could not detect location. Please select manually.');
    });
  };

  window.locConfirm = function() {
    if (!window._locPending) return;
    localStorage.setItem('selectedCity', window._locPending);
    const textSpan = document.getElementById('currentCityText');
    if (textSpan) textSpan.textContent = window._locPending;
    window.closeLocationModal();
    handleRoute();
  };

  function initCitySelector() {
    const btn = document.getElementById('citySelectorBtn');
    const textSpan = document.getElementById('currentCityText');
    if (textSpan) textSpan.textContent = getCurrentCity();
    if (btn) btn.addEventListener('click', e => { e.stopPropagation(); window.openLocationModal(); });
  }

  // =====================================================
  // LOAD DATA FROM BACKEND (/api/data/all), fall back to data.js
  // =====================================================
  const API_BASE = window.DOCTAR_API_BASE ||
    (window.location.protocol === 'file:' ||
      ((window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') && window.location.port !== '3001')
      ? 'http://localhost:3001'
      : window.location.origin);

  async function loadRemoteData() {
    try {
      const res = await fetch(API_BASE + '/api/data/all', { cache: 'no-store' });
      if (!res.ok) throw new Error('bad status ' + res.status);
      const json = await res.json();
      const d = (json && json.data) || {};

      // Mutate the existing globals in place (they are const arrays/objects).
      if (Array.isArray(d.categories) && d.categories.length) {
        CATEGORIES.length = 0;
        CATEGORIES.push(...d.categories);
      }
      if (d.treatments && Object.keys(d.treatments).length) {
        Object.keys(TREATMENTS).forEach(k => delete TREATMENTS[k]);
        Object.assign(TREATMENTS, d.treatments);
      }
      if (Array.isArray(d.doctors) && d.doctors.length) {
        DOCTORS.length = 0;
        DOCTORS.push(...d.doctors);
        console.log('/api/data/all first doctor from API:', d.doctors[0]);
      }
      if (Array.isArray(d.hospitals) && d.hospitals.length) {
        HOSPITALS.length = 0;
        HOSPITALS.push(...d.hospitals);
      }
      if (Array.isArray(d.subcategories)) {
        SUBCATEGORIES = d.subcategories;
      }
      console.log('✅ Loaded live data from backend');
    } catch (err) {
      console.warn('⚠️ Using bundled data.js (backend unavailable):', err.message);
    }
  }

  // =====================================================
  // DOCTOR CLAIM MODAL
  // =====================================================
  window.openClaimModal = function(slug) {
    const doc = (typeof DOCTORS !== 'undefined') ? DOCTORS.find(d => d.slug === slug) : null;
    const docName = doc ? doc.name : '';
    let overlay = document.getElementById('claim-overlay');
    if (overlay) overlay.remove();
    overlay = document.createElement('div');
    overlay.id = 'claim-overlay';
    overlay.className = 'claim-overlay';
    overlay.innerHTML = `
      <div class="claim-modal" role="dialog" aria-modal="true">
        <button class="claim-close" onclick="closeClaimModal()" aria-label="Close">&times;</button>
        <div class="claim-head">
          <div class="claim-head-icon">👨‍⚕️</div>
          <h2>Claim Your Profile</h2>
          <p>Verify your identity and our team will get you set up within 24 hours.</p>
        </div>
        <div class="claim-body">
          <div class="claim-field">
            <label>Doctor Profile</label>
            <input type="text" id="claim-doctor" value="${docName.replace(/"/g, '&quot;')}" readonly>
            <input type="hidden" id="claim-slug" value="${slug}">
          </div>
          <div class="claim-row">
            <div class="claim-field"><label>Your Full Name *</label>
              <input type="text" id="claim-name" placeholder="Dr. ..."></div>
            <div class="claim-field"><label>Phone *</label>
              <input type="tel" id="claim-phone" placeholder="+91 ..."></div>
          </div>
          <div class="claim-row">
            <div class="claim-field"><label>Email *</label>
              <input type="email" id="claim-email" placeholder="you@example.com"></div>
            <div class="claim-field"><label>Medical Registration No. *</label>
              <input type="text" id="claim-reg" placeholder="e.g. MCI-123456"></div>
          </div>
          <div class="claim-field"><label>Message (optional)</label>
            <textarea id="claim-message" placeholder="Anything you'd like us to know…"></textarea></div>
          <div class="claim-msg" id="claim-msg"></div>
        </div>
        <div class="claim-foot">
          <button class="claim-cancel" onclick="closeClaimModal()">Cancel</button>
          <button class="claim-submit" id="claim-submit" onclick="submitClaim()">Submit Claim</button>
        </div>
      </div>`;
    overlay.addEventListener('click', e => { if (e.target === overlay) closeClaimModal(); });
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';
  };

  window.closeClaimModal = function() {
    const overlay = document.getElementById('claim-overlay');
    if (overlay) overlay.remove();
    document.body.style.overflow = '';
  };

  window.submitClaim = async function() {
    const val = id => (document.getElementById(id)?.value || '').trim();
    const payload = {
      doctorName: val('claim-doctor'),
      doctorSlug: val('claim-slug'),
      claimantName: val('claim-name'),
      email: val('claim-email'),
      phone: val('claim-phone'),
      regNumber: val('claim-reg'),
      message: val('claim-message'),
    };
    const msgEl = document.getElementById('claim-msg');
    if (!payload.claimantName || !payload.email || !payload.phone || !payload.regNumber) {
      msgEl.className = 'claim-msg err';
      msgEl.textContent = 'Please fill in your name, email, phone and registration number.';
      return;
    }
    const btn = document.getElementById('claim-submit');
    btn.disabled = true; btn.textContent = 'Submitting…';
    try {
      const res = await fetch(API_BASE + '/api/doctor-claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success || json.data) {
        const modal = document.querySelector('.claim-modal');
        if (modal) {
          modal.innerHTML = `
            <button class="claim-close" onclick="closeClaimModal()" aria-label="Close">&times;</button>
            <div class="claim-success">
              <div class="claim-success-icon">✅</div>
              <h2>Claim Submitted!</h2>
              <p>Our team will contact you within <strong>24 hours</strong> to verify and activate your profile.</p>
              <button class="claim-submit" onclick="closeClaimModal()">Done</button>
            </div>`;
        }
      } else {
        msgEl.className = 'claim-msg err';
        msgEl.textContent = json.error || json.message || 'Could not submit. Please try again.';
        btn.disabled = false; btn.textContent = 'Submit Claim';
      }
    } catch (e) {
      msgEl.className = 'claim-msg err';
      msgEl.textContent = 'Network error. Please call +91-8877772277.';
      btn.disabled = false; btn.textContent = 'Submit Claim';
    }
  };

  window.submitBooking = async function(name, phone, disease, successMessage, email) {
    if (!name || !phone) {
      alert('Please fill in both Patient Name and Mobile Number.');
      return;
    }
    try {
      const body = { name, phone, disease };
      if (email) body.email = email;
      const res = await fetch(API_BASE + '/api/bookings/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json();
      if (json.success) {
        alert(successMessage || 'Appointment booked successfully! Our team will contact you shortly.');
      } else {
        alert('Failed to book: ' + (json.message || 'Server error'));
      }
    } catch (err) {
      console.error('Booking error:', err);
      // Fallback in case backend is down
      alert(successMessage || 'Appointment booked! Our team will call you to confirm.');
    }
  };

  window.submitDoctorBooking = function(specialty) {
    const name = document.getElementById('dpp-patient-name')?.value.trim();
    const phone = document.getElementById('dpp-patient-phone')?.value.trim();
    const email = document.getElementById('dpp-patient-email')?.value.trim();
    window.submitBooking(name, phone, specialty, 'Appointment booked! Our team will call you to confirm.', email);
  };

  window.submitHospitalBooking = function(hospitalName) {
    const form = document.getElementById('hpp-booking-form');
    if (form) form.requestSubmit();
  };

  // =====================================================
  // BOOKING MODAL
  // =====================================================

  function injectBookingModal() {
    if (document.getElementById('bm-overlay')) return;

    const TIME_SLOTS = ['10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM','1:00 PM','1:30 PM','2:00 PM','2:30 PM','3:00 PM','3:30 PM'];

    const html = `
      <div id="bm-overlay" class="bm-overlay" onclick="if(event.target===this)window.closeBookingModal()">
        <div class="bm-modal" role="dialog" aria-modal="true" aria-labelledby="bm-header-title">
          <!-- HEADER -->
          <div class="bm-header">
            <div>
              <div id="bm-header-title" class="bm-doctor-name"></div>
              <div id="bm-header-hospital" class="bm-hospital-name"></div>
            </div>
            <button class="bm-close" onclick="window.closeBookingModal()" aria-label="Close">×</button>
          </div>

          <!-- BODY -->
          <div class="bm-body">
            <!-- LEFT COLUMN -->
            <div class="bm-left">
              <!-- Booking For -->
              <div class="bm-section">
                <div class="bm-section-label">Booking For</div>
                <div class="bm-toggle-group">
                  <button class="bm-toggle active" id="bm-for-myself" onclick="window.bmSetFor('myself')">Myself</button>
                  <button class="bm-toggle" id="bm-for-someone" onclick="window.bmSetFor('someone')">Someone else</button>
                </div>
              </div>

              <!-- Appointment Mode -->
              <div class="bm-section">
                <div class="bm-section-label">Appointment Mode</div>
                <button class="bm-mode-btn active">
                  <i class="fa-solid fa-hospital"></i> Walk-in / Clinic
                </button>
              </div>

              <!-- Date Selector -->
              <div class="bm-section">
                <div class="bm-section-label">Select Date</div>
                <div class="bm-date-pills">
                  <button class="bm-date-pill active" id="bm-date-today" onclick="window.bmSetDate('today',this)">Today</button>
                  <button class="bm-date-pill" id="bm-date-tomorrow" onclick="window.bmSetDate('tomorrow',this)">Tomorrow</button>
                  <button class="bm-date-pill" id="bm-date-other" onclick="window.bmSetDate('other',this)">Other Days</button>
                </div>
                <input type="date" id="bm-date-picker" class="bm-date-input" style="display:none" onchange="window.bmSetDate('pick',null,this.value)">
              </div>

              <!-- Time Slots -->
              <div class="bm-section bm-slots-section">
                <div class="bm-slots-full">
                  <div class="bm-section-label">Available Slots</div>
                  <div class="bm-slots-grid">
                    ${TIME_SLOTS.map((s,i) => `<button class="bm-slot${i===0?' active':''}" data-slot="${s}" onclick="window.bmSelectSlot(this)">${s}</button>`).join('')}
                  </div>
                </div>
                <div class="bm-slot-summary" id="bm-slot-summary" style="display:none;"></div>
              </div>
            </div>

            <!-- RIGHT COLUMN: FORM -->
            <div class="bm-right bm-patient-details">
              <div class="bm-section-label" style="margin-bottom:14px">Patient Details</div>
              <div class="bm-form">
                <div class="bm-form-row">
                  <div class="bm-field">
                    <label class="bm-label">Full Name <span class="bm-req">*</span></label>
                    <input type="text" id="bm-name" class="bm-input" placeholder="Enter full name">
                  </div>
                  <div class="bm-field">
                    <label class="bm-label">Email <span class="bm-optional">(optional)</span></label>
                    <input type="email" id="bm-email" class="bm-input" placeholder="Enter email">
                  </div>
                </div>
                <div class="bm-form-row">
                  <div class="bm-field">
                    <label class="bm-label">Phone <span class="bm-req">*</span></label>
                    <div class="phone-prefix-wrap phone-prefix-wrap--bm">
                      <span class="phone-prefix-badge phone-prefix-badge--bm">+91</span>
                      <input type="tel" id="bm-phone" class="bm-input phone-prefix-input--bm" placeholder="XXXXX XXXXX" maxlength="10">
                    </div>
                    <p id="bm-phone-error" class="phone-error-msg" style="display:none">Please enter a valid 10-digit mobile number</p>
                  </div>
                  <div class="bm-field">
                    <label class="bm-label">Sex</label>
                    <div class="bm-sex-toggle">
                      <button class="bm-sex-btn active" id="bm-sex-male" onclick="window.bmSetSex('Male',this)">Male</button>
                      <button class="bm-sex-btn" id="bm-sex-female" onclick="window.bmSetSex('Female',this)">Female</button>
                    </div>
                  </div>
                </div>
                <div class="bm-form-row bm-row-extra">
                  <div class="bm-field">
                    <label class="bm-label">Date of Birth</label>
                    <input type="date" id="bm-dob" class="bm-input">
                  </div>
                  <div class="bm-field">
                    <label class="bm-label">Postal Code</label>
                    <input type="text" id="bm-postal" class="bm-input" placeholder="e.g. 700001">
                  </div>
                </div>
                <div class="bm-form-row bm-city-row">
                  <div class="bm-field bm-field-grow">
                    <label class="bm-label">City</label>
                    <div class="bm-city-wrap">
                      <input type="text" id="bm-city" class="bm-input" placeholder="City">
                      <button class="bm-use-city" onclick="window.bmUseCurrentCity()">Use current</button>
                    </div>
                  </div>
                </div>
                <div class="bm-field bm-address-field" style="margin-top:4px">
                  <label class="bm-label">Address</label>
                  <input type="text" id="bm-address" class="bm-input" placeholder="Full address">
                </div>
              </div>
            </div>
          </div>

          <!-- FOOTER -->
          <div class="bm-footer">
            <div id="bm-success-msg" class="bm-success" style="display:none"></div>
            <div class="bm-footer-btns">
              <button class="bm-btn-cancel" onclick="window.closeBookingModal()">Cancel</button>
              <button class="bm-btn-submit" onclick="window.bmSubmit()">
                <i class="fa-solid fa-calendar-check"></i> Send Request
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
  }

  window._bmState = { forSelf: true, date: 'today', slot: '10:00 AM', sex: 'Male', doctorName: '', hospitalName: '', doctorSlug: '' };

  window.openBookingModal = function(doctorName, hospitalName, doctorSlug) {
    injectBookingModal();
    // Reset slots view (modal DOM persists across opens) — show full grid.
    if (typeof window.expandSlots === 'function') window.expandSlots();
    window._bmState.doctorName = doctorName || 'Consultation';
    window._bmState.hospitalName = hospitalName || '';
    window._bmState.doctorSlug = doctorSlug || '';
    document.getElementById('bm-header-title').textContent = doctorName || 'Book Appointment';
    document.getElementById('bm-header-hospital').textContent = hospitalName || '';

    // Reset state
    window.bmSetFor('myself');
    window.bmSetDate('today', document.getElementById('bm-date-today'));

    // Auto-fill City from the city switcher (only if still empty).
    const cityEl = document.getElementById('bm-city');
    if (cityEl && !cityEl.value.trim()) {
      try { cityEl.value = getCurrentCity ? getCurrentCity() : ''; } catch (e) { /* ignore */ }
    }

    document.getElementById('bm-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeBookingModal = function() {
    const overlay = document.getElementById('bm-overlay');
    if (overlay) {
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  window.bmSetFor = function(who) {
    window._bmState.forSelf = (who === 'myself');
    document.getElementById('bm-for-myself').classList.toggle('active', who === 'myself');
    document.getElementById('bm-for-someone').classList.toggle('active', who === 'someone');

    if (who === 'myself') {
      try {
        const user = JSON.parse(localStorage.getItem('doctar_user') || 'null');
        if (user) {
          if (user.name) document.getElementById('bm-name').value = user.name;
          if (user.email) document.getElementById('bm-email').value = user.email;
          if (user.phone) document.getElementById('bm-phone').value = user.phone;
          if (user.sex) window.bmSetSex(user.sex, document.getElementById('bm-sex-' + user.sex.toLowerCase()));
          if (user.dob) document.getElementById('bm-dob').value = user.dob;
          if (user.postal) document.getElementById('bm-postal').value = user.postal;
          if (user.city) document.getElementById('bm-city').value = user.city;
          if (user.address) document.getElementById('bm-address').value = user.address;
        } else {
          bmClearForm();
        }
      } catch(e) { bmClearForm(); }
    } else {
      bmClearForm();
    }
  };

  function bmClearForm() {
    ['bm-name','bm-email','bm-phone','bm-dob','bm-postal','bm-city','bm-address'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    window.bmSetSex('Male', document.getElementById('bm-sex-male'));
  }

  window.bmSetDate = function(type, btn, val) {
    document.querySelectorAll('.bm-date-pill').forEach(b => b.classList.remove('active'));
    const picker = document.getElementById('bm-date-picker');

    if (type === 'today') {
      window._bmState.date = new Date().toISOString().split('T')[0];
      picker.style.display = 'none';
      if (btn) btn.classList.add('active');
    } else if (type === 'tomorrow') {
      const d = new Date(); d.setDate(d.getDate()+1);
      window._bmState.date = d.toISOString().split('T')[0];
      picker.style.display = 'none';
      if (btn) btn.classList.add('active');
    } else if (type === 'other') {
      picker.style.display = 'block';
      if (btn) btn.classList.add('active');
      picker.min = new Date().toISOString().split('T')[0];
    } else if (type === 'pick' && val) {
      window._bmState.date = val;
      document.getElementById('bm-date-other').classList.add('active');
    }
  };

  window.bmSelectSlot = function(btn) {
    document.querySelectorAll('.bm-slot').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    window._bmState.slot = btn.dataset.slot;

    // On mobile, collapse the slots grid into a compact summary (show/hide,
    // no innerHTML swap — so the grid is always available to re-expand).
    if (window.innerWidth <= 768) {
      const full = document.querySelector('.bm-slots-full');
      const summary = document.getElementById('bm-slot-summary');
      const selectedTime = btn.textContent.trim();
      const selectedDate = document.querySelector('.bm-date-pill.active')?.textContent.trim() || '';

      if (full && summary) {
        summary.innerHTML = `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 0; border-bottom:1px solid #f0ebff;">
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="color:#16a34a; font-weight:700; font-size:1rem;">✓ ${selectedTime}</span>
              ${selectedDate ? `<span style="color:#666; font-size:0.85rem;">· ${selectedDate}</span>` : ''}
            </div>
            <button type="button" onclick="window.expandSlots()" style="display:flex; align-items:center; gap:4px; color:#5e4091; font-size:0.85rem; background:#f0ebff; border:none; padding:6px 12px; border-radius:20px; font-weight:600; cursor:pointer;">
              ← Change
            </button>
          </div>`;
        full.style.display = 'none';
        summary.style.display = 'block';
      }

      // After collapse, scroll the modal back to the top (mobile only).
      setTimeout(() => {
        if (window.innerWidth <= 768) {
          const modalPanel = document.querySelector('.bm-modal, .bm-body, .bm-right, .bm-content');
          if (modalPanel) modalPanel.scrollTo({ top: 0, behavior: 'smooth' });
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 400);
    }
  };

  // Re-expand the collapsed slots grid (mobile "← Change" button).
  window.expandSlots = function() {
    const full = document.querySelector('.bm-slots-full');
    const summary = document.getElementById('bm-slot-summary');
    if (full) full.style.display = '';
    if (summary) { summary.style.display = 'none'; summary.innerHTML = ''; }
  };

  window.bmSetSex = function(sex, btn) {
    window._bmState.sex = sex;
    document.querySelectorAll('.bm-sex-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  };

  window.bmUseCurrentCity = function() {
    const city = getCurrentCity ? getCurrentCity() : '';
    if (city) document.getElementById('bm-city').value = city;
  };

  window.bmSubmit = async function() {
    const name = document.getElementById('bm-name').value.trim();
    const email = document.getElementById('bm-email').value.trim();
    const rawPhone = document.getElementById('bm-phone').value.replace(/\D/g, '') || '';
    const bmPhoneErr = document.getElementById('bm-phone-error');

    if (!name) {
      alert('Please enter the patient name.');
      return;
    }
    if (rawPhone.length !== 10) {
      if (bmPhoneErr) bmPhoneErr.style.display = 'block';
      document.getElementById('bm-phone')?.focus();
      return;
    }
    if (bmPhoneErr) bmPhoneErr.style.display = 'none';
    const phone = '+91' + rawPhone;

    // Date pills use class `.bm-date-pill`; slots use `.bm-slot`.
    const activeDateEl = document.querySelector('.bm-date-pill.active');
    const picker = document.getElementById('bm-date-picker');
    // When "Other Days" is chosen the pill text isn't a real date — use the picker value.
    let selectedDate = activeDateEl?.textContent?.trim() || '';
    if (picker && picker.value && (selectedDate === 'Other Days' || activeDateEl?.id === 'bm-date-other')) {
      selectedDate = picker.value;
    }

    const selectedSlot = document.querySelector('.bm-slot.active')?.dataset?.slot
      || document.querySelector('.bm-slot.active')?.textContent?.trim()
      || '';

    console.log('Selected date el:', document.querySelector('.bm-date-pill.active'));
    console.log('Selected slot el:', document.querySelector('.bm-slot.active'));
    console.log('Date text:', selectedDate);
    console.log('Time text:', selectedSlot);

    const payload = {
      name,
      email,
      patientEmail: email,
      phone,
      sex: window._bmState.sex,
      dob: document.getElementById('bm-dob').value,
      postal: document.getElementById('bm-postal').value.trim(),
      city: document.getElementById('bm-city').value.trim(),
      address: document.getElementById('bm-address').value.trim(),
      doctorName: window._bmState.doctorName,
      doctorSlug: window._bmState.doctorSlug,
      hospital: window._bmState.hospitalName,
      date: window._bmState.date,
      slot: window._bmState.slot,
      appointmentDate: selectedDate,
      appointmentTime: selectedSlot,
      disease: 'Consultation',
      location: document.getElementById('bm-city').value.trim(),
    };

    const submitBtn = document.querySelector('.bm-btn-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';

    const resetBtn = () => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Send Request';
    };

    try {
      console.log('Posting to:', API_BASE + '/api/bookings/book');
      const res = await fetch(API_BASE + '/api/bookings/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      const msgEl = document.getElementById('bm-success-msg');
      if (json.success) {
        msgEl.style.cssText = 'display:block;background:#e7f7ee;color:#0a7b43;border:1px solid #9fe3bf;padding:14px 16px;border-radius:10px;font-weight:600;line-height:1.5;white-space:pre-line;';
        msgEl.textContent = '✅ Booking Confirmed!\nOur team will call you within 2 hours.\n+91-8877772277';
        setTimeout(() => window.closeBookingModal(), 4000);
      } else {
        msgEl.style.cssText = 'display:block;background:#fde8e8;color:#c0322e;border:1px solid #f5b5b3;padding:14px 16px;border-radius:10px;font-weight:600;line-height:1.5;';
        msgEl.textContent = '❌ ' + (json.message || 'Booking failed. Please call +91-8877772277.');
        resetBtn();
      }
    } catch (err) {
      console.error('Booking error:', err);
      const msgEl = document.getElementById('bm-success-msg');
      msgEl.style.cssText = 'display:block;background:#fde8e8;color:#c0322e;border:1px solid #f5b5b3;padding:14px 16px;border-radius:10px;font-weight:600;line-height:1.5;';
      msgEl.textContent = err.name === 'AbortError'
        ? '❌ Request timed out. Please try again or call +91-8877772277.'
        : '❌ Network error. Please try again or call +91-8877772277.';
      // Always reset the button so it never gets stuck on "Sending...".
      resetBtn();
    }
  };

  // =====================================================
  // SEARCH RESULTS PAGE
  // =====================================================
  let _srQuery = '';

  function runSiteSearch(qRaw) {
    const q = (qRaw || '').trim().toLowerCase();
    const m = (hay) => String(hay || '').toLowerCase().includes(q);
    const allTreatments = (typeof TREATMENTS !== 'undefined') ? Object.values(TREATMENTS).flat() : [];
    return {
      treatments: allTreatments.filter(t => m(t.name) || m(t.brief) || m(t.categorySlug)),
      doctors: (typeof DOCTORS !== 'undefined' ? DOCTORS : []).filter(d =>
        m(d.name) || m(d.specialty) || m(d.hospital) || m(d.location) ||
        m(d.degree) || m(d.bio) || m(d.language) ||
        (Array.isArray(d.categories) && d.categories.some(c => m(c)))),
      hospitals: (typeof HOSPITALS !== 'undefined' ? HOSPITALS : []).filter(h => m(h.name) || m(h.address) || m(h.city) || m(h.type)),
      categories: (typeof CATEGORIES !== 'undefined' ? CATEGORIES : []).filter(c => m(c.name) || m(c.description) || (Array.isArray(c.tags) && c.tags.some(tag => m(tag)))),
    };
  }

  window.srShowAll = function(section) { renderSearchPage(_srQuery, section); };
  window.srSubmitSearch = function(ev) {
    if (ev) ev.preventDefault();
    const val = (document.getElementById('sr-page-input') || {}).value || '';
    const q = val.trim();
    if (q) window.location.hash = '#/search/' + encodeURIComponent(q);
  };

  function renderSearchPage(query, sectionFilter) {
    _srQuery = query || '';
    const esc = s => String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    // Keep the header search bar in sync with the active query.
    const headerInput = document.querySelector('.header-search input');
    if (headerInput) headerInput.value = query || '';

    const r = runSiteSearch(query);
    const counts = {
      treatments: r.treatments.length,
      doctors: r.doctors.length,
      hospitals: r.hospitals.length,
      categories: r.categories.length,
    };
    const total = counts.treatments + counts.doctors + counts.hospitals + counts.categories;

    const initials = name => String(name || '').replace(/^Dr\.?\s*/i, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const fee = v => v ? '₹' + Number(v).toLocaleString('en-IN') : '';

    // ── Type-specific result cards (proper <a> + <h3>) ──
    const treatmentCard = t => {
      const cat = findCategory(t.categorySlug) || {};
      return `
        <a href="#/treatment/${t.slug}" class="sr-tcard">
          <div class="sr-tcard-head">
            <span class="sr-tcard-cat">${cat.icon ? cat.icon + ' ' : ''}${esc((cat.name || t.categorySlug || '').toUpperCase())}</span>
            ${t.recovery ? `<span class="sr-tcard-recovery">${esc(t.recovery)}</span>` : ''}
          </div>
          <h3 class="sr-tcard-title">${esc(t.name)}</h3>
          ${t.brief ? `<p class="sr-tcard-brief">${esc(t.brief)}</p>` : ''}
          <div class="sr-tcard-foot">
            <span class="sr-tcard-price">${esc(t.costRange || '')}</span>
            <span class="sr-cta">View Details <i class="fa-solid fa-arrow-right"></i></span>
          </div>
        </a>`;
    };

    const doctorCard = d => `
      <a href="#/doctor/${d.slug}" class="sr-dcard">
        <div class="sr-dcard-top">
          <div class="sr-dcard-photo">${d.image ? `<img src="${esc(d.image)}" alt="${esc(d.name)}" onerror="this.parentNode.textContent='${initials(d.name)}'">` : initials(d.name)}</div>
          <div class="sr-dcard-info">
            <div class="sr-dcard-row1">
              <h3 class="sr-dcard-name">${esc(d.name)}</h3>
              ${d.rating ? `<span class="sr-rating">⭐ ${esc(d.rating)}${d.reviews ? ` (${esc(d.reviews)})` : ''}</span>` : ''}
            </div>
            <p class="sr-dcard-spec">${esc(d.specialty || '')}</p>
            ${d.degree ? `<p class="sr-dcard-degree">${esc(d.degree)}</p>` : ''}
          </div>
        </div>
        ${d.hospital ? `<p class="sr-dcard-line"><i class="fa-solid fa-hospital"></i> ${esc(d.hospital)}${d.location ? ', ' + esc(d.location) : ''}</p>` : ''}
        <p class="sr-dcard-line sr-dcard-stats">
          ${d.fee ? `<span><i class="fa-solid fa-indian-rupee-sign"></i> ${esc(fee(d.fee))}</span>` : ''}
          ${d.nextSlot ? `<span><i class="fa-regular fa-clock"></i> ${esc(d.nextSlot)}</span>` : ''}
        </p>
        <span class="sr-cta sr-cta-block">Book Appointment <i class="fa-solid fa-arrow-right"></i></span>
      </a>`;

    const hospitalCard = h => `
      <a href="#/hospital/${h.slug}" class="sr-hcard">
        <div class="sr-hcard-img">${h.image ? `<img src="${esc(h.image)}" alt="${esc(h.name)}" onerror="this.style.display='none';this.parentNode.innerHTML='🏨'">` : '🏨'}</div>
        <div class="sr-hcard-body">
          <div class="sr-hcard-row1">
            <h3 class="sr-hcard-name">${esc(h.name)}</h3>
            ${h.rating ? `<span class="sr-rating">⭐ ${esc(h.rating)}</span>` : ''}
          </div>
          ${h.address ? `<p class="sr-hcard-loc"><i class="fa-solid fa-location-dot"></i> ${esc(h.address)}</p>` : ''}
          ${h.type ? `<p class="sr-hcard-type">${esc(h.type)}</p>` : ''}
          ${Array.isArray(h.metrics) && h.metrics.length ? `<p class="sr-hcard-metrics">${esc(h.metrics.join(' | '))}</p>` : ''}
          ${Array.isArray(h.services) && h.services.length ? `<div class="sr-hcard-chips">${h.services.slice(0, 3).map(s => `<span>${esc(s)}</span>`).join('')}</div>` : ''}
          <span class="sr-cta">View Hospital <i class="fa-solid fa-arrow-right"></i></span>
        </div>
      </a>`;

    const categoryCard = c => `
      <a href="#/category/${c.slug}" class="sr-ccard" style="--acc:${c.color || '#5e4091'}; --acc-light:${c.colorLight || '#f0ebff'};">
        <div class="sr-ccard-ic">${catIcon(c, 30)}</div>
        <h3 class="sr-ccard-name">${esc(c.name)}</h3>
        ${c.treatmentCount ? `<p class="sr-ccard-count">${esc(c.treatmentCount)} Treatments</p>` : ''}
        ${Array.isArray(c.tags) && c.tags.length ? `<p class="sr-ccard-tags">${c.tags.slice(0, 3).map(esc).join(' • ')}</p>` : ''}
        <span class="sr-cta">Explore <i class="fa-solid fa-arrow-right"></i></span>
      </a>`;

    const cardFor = { treatments: treatmentCard, doctors: doctorCard, hospitals: hospitalCard, categories: categoryCard };
    const gridClass = { treatments: 'sr-grid-2', doctors: 'sr-grid-2', hospitals: 'sr-grid-2', categories: 'sr-grid-3' };
    const titles = { treatments: 'Treatments', doctors: 'Doctors', hospitals: 'Hospitals', categories: 'Categories' };

    function sectionBlock(key) {
      const items = r[key];
      if (!items.length) return '';
      const showingAll = sectionFilter === key;
      const shown = showingAll ? items : items.slice(0, 4);
      const moreLink = (!showingAll && items.length > 4)
        ? `<button class="sr-showall" onclick="srShowAll('${key}')">Show all ${titles[key].toLowerCase()} (${items.length}) <i class="fa-solid fa-arrow-right"></i></button>`
        : '';
      return `
        <section class="sr-section">
          <div class="sr-section-head">
            <h2>${titles[key]} <span class="sr-count">${items.length}</span></h2>
          </div>
          <div class="sr-grid ${gridClass[key]}">${shown.map(cardFor[key]).join('')}</div>
          ${moreLink}
        </section>`;
    }

    const sectionsOrder = ['treatments', 'doctors', 'hospitals', 'categories'];
    let body;
    if (!total) {
      body = `<div class="sr-empty">
        <div class="sr-empty-ic">🔍</div>
        <h3>No results found for "${esc(query)}"</h3>
        <p>Try a different keyword — e.g. a treatment, doctor, hospital or speciality.</p>
        <a href="#/" class="sr-empty-home">← Back to Home</a>
      </div>`;
    } else if (sectionFilter && counts[sectionFilter] != null) {
      body = `<div style="margin-bottom:18px;"><button class="sr-showall" onclick="srShowAll('')"><i class="fa-solid fa-arrow-left"></i> Back to all results</button></div>`
        + sectionBlock(sectionFilter);
    } else {
      body = sectionsOrder.map(sectionBlock).join('');
    }

    appContainer.innerHTML = `
      <div class="sr-page">
        <div class="container sr-inner">
          <nav class="sr-breadcrumb">
            <a href="#/">Home</a>
            <i class="fa-solid fa-chevron-right"></i>
            <span>Search</span>
            <i class="fa-solid fa-chevron-right"></i>
            <span class="sr-crumb-current">"${esc(query)}"</span>
          </nav>

          <div class="sr-hero">
            <h1><i class="fa-solid fa-magnifying-glass"></i> Search results for "<span>${esc(query)}</span>"</h1>
            <p class="sr-result-count">${total} result${total === 1 ? '' : 's'} found</p>
            <form class="sr-searchbar" onsubmit="srSubmitSearch(event)">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" id="sr-page-input" value="${esc(query)}" placeholder="Search doctors, hospitals, treatments...">
              <button type="submit">Search</button>
            </form>
          </div>

          ${body}
        </div>
      </div>`;
    window.scrollTo(0, 0);
  }

  // =====================================================
  // HEADER SEARCH
  // =====================================================
  function initHeaderSearch() {
    const wrap = document.querySelector('.header-search');
    if (!wrap) return;
    const input = wrap.querySelector('input');
    const goBtn = wrap.querySelector('.search-go');
    if (!input) return;

    wrap.style.position = 'relative';
    let dropdown = document.getElementById('hsDropdown');
    if (!dropdown) {
      dropdown = document.createElement('div');
      dropdown.id = 'hsDropdown';
      dropdown.className = 'hs-dropdown';
      dropdown.style.display = 'none';
      wrap.appendChild(dropdown);
    }

    const esc = s => String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

    function matches(hay, q) { return String(hay || '').toLowerCase().includes(q); }

    function search(qRaw) {
      const q = qRaw.trim().toLowerCase();
      if (!q) { closeDropdown(); return; }

      const allTreatments = (typeof TREATMENTS !== 'undefined') ? Object.values(TREATMENTS).flat() : [];
      const treatments = allTreatments.filter(t =>
        matches(t.name, q) || matches(t.brief, q) || matches(t.categorySlug, q)
      ).slice(0, 3);

      const doctors = (typeof DOCTORS !== 'undefined' ? DOCTORS : []).filter(d =>
        matches(d.name, q) || matches(d.specialty, q) || matches(d.hospital, q) || matches(d.location, q)
      ).slice(0, 3);

      const categories = (typeof CATEGORIES !== 'undefined' ? CATEGORIES : []).filter(c =>
        matches(c.name, q) || matches(c.description, q) || (Array.isArray(c.tags) && c.tags.some(tag => matches(tag, q)))
      ).slice(0, 3);

      const hospitals = (typeof HOSPITALS !== 'undefined' ? HOSPITALS : []).filter(h =>
        matches(h.name, q) || matches(h.address, q) || matches(h.city, q) || matches(h.type, q)
      ).slice(0, 3);

      renderResults(qRaw.trim(), { treatments, doctors, categories, hospitals });
    }

    function group(title, items, mapper) {
      if (!items.length) return '';
      return `
        <div class="hs-group">
          <div class="hs-group-title">${title}</div>
          ${items.map(mapper).join('')}
        </div>`;
    }

    function row(href, icon, label, sub) {
      return `<a href="${href}" class="hs-result" data-hs-link>
        <span class="hs-result-ic">${icon}</span>
        <span class="hs-result-text"><span class="hs-result-label">${esc(label)}</span>${sub ? `<span class="hs-result-sub">${esc(sub)}</span>` : ''}</span>
        <i class="fa-solid fa-arrow-right hs-result-arrow"></i>
      </a>`;
    }

    function renderResults(q, r) {
      const total = r.treatments.length + r.doctors.length + r.categories.length + r.hospitals.length;
      let html = `<div class="hs-head"><i class="fa-solid fa-magnifying-glass"></i> "${esc(q)}"</div>`;
      if (!total) {
        html += `<div class="hs-empty">No results found for "<strong>${esc(q)}</strong>"</div>`;
      } else {
        html += group('Treatments', r.treatments, t =>
          row(`#/treatment/${t.slug}`, '🏥', t.name, (findCategory(t.categorySlug) || {}).name || ''));
        html += group('Doctors', r.doctors, d =>
          row(`#/doctor/${d.slug}`, '👨‍⚕️', d.name, d.specialty || ''));
        html += group('Categories', r.categories, c =>
          row(`#/category/${c.slug}`, '🩺', c.name, ''));
        html += group('Hospitals', r.hospitals, h =>
          row(`#/hospital/${h.slug}`, '🏨', h.name, h.city || ''));
      }
      dropdown.innerHTML = html;
      dropdown.style.display = 'block';
      dropdown.querySelectorAll('[data-hs-link]').forEach(a => {
        a.addEventListener('click', () => closeDropdown());
      });
    }

    function closeDropdown() { dropdown.style.display = 'none'; }

    let debounceTimer = null;
    input.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => search(input.value), 300);
    });
    function goToSearchPage() {
      const query = input.value.trim();
      if (query.length > 0) {
        closeDropdown();
        window.location.hash = '#/search/' + encodeURIComponent(query);
      }
    }
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); clearTimeout(debounceTimer); goToSearchPage(); }
      else if (e.key === 'Escape') { closeDropdown(); input.blur(); }
    });
    input.addEventListener('focus', () => { if (input.value.trim()) search(input.value); });
    if (goBtn) goBtn.addEventListener('click', goToSearchPage);

    document.addEventListener('click', e => {
      if (!wrap.contains(e.target)) closeDropdown();
    });
  }

  try {
    initCitySelector();
    initHeaderSearch();
    loadRemoteData().finally(initRouter);
  } catch (err) {
    console.error('Initialization error:', err);
    alert('Initialization error: ' + err.message + '\nStack: ' + err.stack);
  }
});
