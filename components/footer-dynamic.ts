// =====================================================
// DYNAMIC FOOTER SECTION
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================

  // =====================================================
  // DYNAMIC FOOTER SECTION (Nearby Hospitals / Top Specialities / Top Doctors)
  // Reuses already-loaded HOSPITALS / DOCTORS / CATEGORIES — no extra API calls.
  // Pass opts to tailor lists/headings per page (see STEP 4 callers).
  // =====================================================
  function renderDynamicFooterSection(city, opts?: any) {
    city = city || getCurrentCity() || 'Kolkata';
    opts = opts || {};

    const hospitals = (opts.hospitals || HOSPITALS.filter(h =>
      h.city && h.city.toLowerCase() === city.toLowerCase()
    )).slice(0, 12);

    const doctors = (opts.doctors || DOCTORS).slice(0, 20);

    const specialties = (opts.specialties || CATEGORIES).slice(0, 20);

    const hospitalsHeading = opts.hospitalsHeading || `Nearby Hospitals in ${city}`;
    const specialtiesHeading = opts.specialtiesHeading || `Top Doctor Specialities in ${city}`;
    const doctorsHeading = opts.doctorsHeading || `Top Doctors in ${city}`;

    return `
      <div class="dynamic-footer-section">

        ${hospitals.length > 0 ? `
        <div class="dfs-block">
          <h3 class="dfs-heading">${hospitalsHeading}</h3>
          <div class="dfs-links">
            ${hospitals.map(h => `
              <a href="${urlHospital(h)}" class="dfs-link">${h.name}</a>
            `).join('<span class="dfs-dot">•</span>')}
          </div>
        </div>
        ` : ''}

        ${specialties.length > 0 ? `
        <div class="dfs-block">
          <h3 class="dfs-heading">${specialtiesHeading}</h3>
          <div class="dfs-links">
            ${specialties.map(cat => `
              <a href="${urlCategory(cat.slug)}" class="dfs-link">${cat.name} in ${city}</a>
            `).join('<span class="dfs-dot">•</span>')}
          </div>
        </div>
        ` : ''}

        ${doctors.length > 0 ? `
        <div class="dfs-block">
          <h3 class="dfs-heading">${doctorsHeading}</h3>
          <div class="dfs-links">
            ${doctors.map(d => `
              <a href="/surgeons/${(d.categories&&d.categories[0])||'general'}/${d.slug}/s" class="dfs-link">${d.name}${d.specialty ? ` - ${d.specialty}` : ''}</a>
            `).join('<span class="dfs-dot">•</span>')}
          </div>
        </div>
        ` : ''}

      </div>
    `;
  }
