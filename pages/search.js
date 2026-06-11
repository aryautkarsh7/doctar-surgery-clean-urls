// =====================================================
// SEARCH PAGE
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================
  // Returns matched keyword entries that link to the parent category page.
  function searchSubSubKeywords(q, limit) {
    const out = [];
    const seen = new Set();
    if (!q || typeof SUBSUBCATEGORIES === 'undefined') return out;
    for (const ssc of SUBSUBCATEGORIES) {
      if (!ssc || !Array.isArray(ssc.keywords)) continue;
      for (const kw of ssc.keywords) {
        if (!String(kw || '').toLowerCase().includes(q)) continue;
        const key = String(kw).toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        out.push({
          keyword: kw,
          groupName: ssc.name,
          categorySlug: ssc.categorySlug,
          subCategorySlug: ssc.subCategorySlug,
        });
        if (limit && out.length >= limit) return out;
      }
    }
    return out;
  }

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
      procedures: q ? searchSubSubKeywords(q) : [],
    };
  }

  window.srShowAll = function(section) { renderSearchPage(_srQuery, section); };
  window.srSubmitSearch = function(ev) {
    if (ev) ev.preventDefault();
    const val = (document.getElementById('sr-page-input') || {}).value || '';
    const q = val.trim();
    if (q) navigate('/search/' + encodeURIComponent(q) + '/s');
  };

  function renderSearchPage(query, sectionFilter) {
    _srQuery = query || '';
    
    updatePageMeta({
      title: `Search results for "${query}" - Doctar`,
      description: `Search results for doctors, hospitals, and treatments matching "${query}".`,
      keywords: `search ${query}, doctar search`,
      url: window.location.href
    });

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
      procedures: r.procedures.length,
    };
    const total = counts.treatments + counts.doctors + counts.hospitals + counts.categories + counts.procedures;

    const initials = name => String(name || '').replace(/^Dr\.?\s*/i, '').split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
    const fee = v => v ? '₹' + Number(v).toLocaleString('en-IN') : '';

    // ── Type-specific result cards (proper <a> + <h3>) ──
    const treatmentCard = t => {
      const cat = findCategory(t.categorySlug) || {};
      return `
        <a href="${urlTreatment(t.slug, t.categorySlug)}" class="sr-tcard">
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
      <a href="/surgeons/${(d.categories&&d.categories[0])||'general'}/${d.slug}/s" class="sr-dcard">
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
      <a href="${urlHospital(h)}" class="sr-hcard">
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
      <a href="${urlCategory(c.slug)}" class="sr-ccard" style="--acc:${c.color || '#5e4091'}; --acc-light:${c.colorLight || '#f0ebff'};">
        <div class="sr-ccard-ic">${catIcon(c, 30)}</div>
        <h3 class="sr-ccard-name">${esc(c.name)}</h3>
        ${c.treatmentCount ? `<p class="sr-ccard-count">${esc(c.treatmentCount)} Treatments</p>` : ''}
        ${Array.isArray(c.tags) && c.tags.length ? `<p class="sr-ccard-tags">${c.tags.slice(0, 3).map(esc).join(' • ')}</p>` : ''}
        <span class="sr-cta">Explore <i class="fa-solid fa-arrow-right"></i></span>
      </a>`;

    const procedureCard = p => `
      <a href="${urlCategory(p.categorySlug)}" class="sr-ccard" style="--acc:#5e4091; --acc-light:#f0ebff;">
        <div class="sr-ccard-ic"><i class="fa-solid fa-scalpel" style="font-size:24px;"></i></div>
        <h3 class="sr-ccard-name">${esc(p.keyword)}</h3>
        ${p.groupName ? `<p class="sr-ccard-tags">${esc(p.groupName)}</p>` : ''}
        <span class="sr-cta">View Category <i class="fa-solid fa-arrow-right"></i></span>
      </a>`;

    const cardFor = { treatments: treatmentCard, doctors: doctorCard, hospitals: hospitalCard, categories: categoryCard, procedures: procedureCard };
    const gridClass = { treatments: 'sr-grid-2', doctors: 'sr-grid-2', hospitals: 'sr-grid-2', categories: 'sr-grid-3', procedures: 'sr-grid-3' };
    const titles = { treatments: 'Treatments', doctors: 'Doctors', hospitals: 'Hospitals', categories: 'Categories', procedures: 'Procedures' };

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

    const sectionsOrder = ['treatments', 'procedures', 'doctors', 'hospitals', 'categories'];
    let body;
    if (!total) {
      body = `<div class="sr-empty">
        <div class="sr-empty-ic">🔍</div>
        <h3>No results found for "${esc(query)}"</h3>
        <p>Try a different keyword — e.g. a treatment, doctor, hospital or speciality.</p>
        <a href="/" class="sr-empty-home">← Back to Home</a>
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
            <a href="/">Home</a>
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
