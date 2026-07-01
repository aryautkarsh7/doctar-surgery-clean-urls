// =====================================================
// PET SURGERY PAGES
// Static, no DB yet. Loaded as a classic script — shares global scope.
//   /pet-surgery-in-:city/s    -> renderPetSurgery(city)
//   /pet-hospitals-in-:city/s  -> renderPetHospitals(city)  (Coming Soon)
// =====================================================

  // Shared static list of pet surgery types (used on the homepage section too).
  const PET_SURGERIES = [
    { name: 'Dog Surgery', icon: 'fa-solid fa-dog', color: '#7c3aed', desc: 'Spaying, fractures, soft-tissue & more' },
    { name: 'Cat Surgery', icon: 'fa-solid fa-cat', color: '#e85d8f', desc: 'Neutering, dental & emergency care' },
    { name: 'Veterinary Surgery', icon: 'fa-solid fa-paw', color: '#0ea5e9', desc: 'General veterinary surgical care' },
    { name: 'Pet Dental Surgery', icon: 'fa-solid fa-tooth', color: '#10b981', desc: 'Extractions & oral procedures' },
    { name: 'Orthopedic (Pets)', icon: 'fa-solid fa-bone', color: '#f59e0b', desc: 'Bone & joint repair for pets' },
    { name: 'Exotic Pet Surgery', icon: 'fa-solid fa-dove', color: '#06b6d4', desc: 'Birds, rabbits & exotic animals' },
  ];

  function renderPetSurgery(city) {
    const c = city || getCurrentCity();
    updatePageMeta({
      title: `Pet Surgery & Veterinary Surgeons Near Me in ${c}`,
      description: `Expert veterinary surgery for dogs, cats, birds & cattle near you in ${c}. Find trusted pet surgeons for all surgery types. Book now.`,
      keywords: `pet surgery ${c}, veterinary surgeons ${c}, dog surgery, cat surgery, book pet surgery`,
      url: window.location.href
    });
    appContainer.innerHTML = `
      <div class="all-cat-hero">
        <div class="container all-cat-hero-inner">
          <div class="breadcrumb" style="margin-bottom: 20px;">
            <a href="/">Home</a> <span>›</span>
            <span>Pet Surgery</span>
          </div>
          <div class="all-cat-eyebrow"><i class="fa-solid fa-paw"></i> Pet Care</div>
          <h1 class="all-cat-title">Pet Surgery in <span>${c}</span></h1>
          <p class="all-cat-sub">Surgical care for your pets in ${c}. Connect with trusted veterinary surgeons for routine and emergency procedures.</p>
        </div>
      </div>

      <div class="container" style="padding:40px 0 70px;">
        <div style="display:grid; grid-template-columns:repeat(auto-fill,minmax(220px,1fr)); gap:20px;">
          ${PET_SURGERIES.map(p => `
            <div style="display:flex; flex-direction:column; gap:12px; padding:26px 22px; background:#fff; border:1.5px solid #ECE6FF; border-radius:18px; box-shadow:0 2px 14px rgba(94,64,145,0.06);">
              <div style="width:56px;height:56px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:${p.color}1a;color:${p.color};font-size:1.5rem;">
                <i class="${p.icon}"></i>
              </div>
              <h3 style="font-size:1.05rem; font-weight:800; color:#1a1a2e; margin:0;">${p.name}</h3>
              <p style="font-size:0.85rem; color:#6b7280; margin:0; flex:1;">${p.desc}</p>
              <a href="tel:+918877772277" style="display:inline-flex; align-items:center; gap:6px; color:#5e4091; font-weight:700; font-size:0.85rem; text-decoration:none;">
                <i class="fa-solid fa-phone"></i> Enquire Now
              </a>
            </div>
          `).join('')}
        </div>

        <div style="margin-top:36px; padding:28px; background:#f0ebff; border-radius:18px; text-align:center;">
          <h3 style="margin:0 0 8px; color:#1a1a2e;">More pet surgery options coming soon</h3>
          <p style="margin:0; color:#6b7280;">We're onboarding veterinary surgical partners in ${c}. Call <strong>+91-8877772277</strong> to enquire.</p>
        </div>
      </div>
    `;
    appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(c || 'Kolkata'));
  }

  function renderPetHospitals(city) {
    const c = city || getCurrentCity();
    updatePageMeta({
      title: `Pet Surgery Hospitals & Veterinary Surgeons in ${c}`,
      description: `Trusted veterinary surgery hospitals in ${c} with expert pet surgeons. Dog, cat, bird & cattle surgery facilities. Book pet surgery consultation.`,
      keywords: `pet surgery hospitals ${c}, veterinary surgeons ${c}, animal surgery, pet surgery, book pet surgery`,
      url: window.location.href
    });
    const cityHospitals = (typeof PET_HOSPITALS !== 'undefined' ? PET_HOSPITALS : [])
      .filter(h => h.city && h.city.toLowerCase() === c.toLowerCase());

    const cardsHTML = cityHospitals.length
      ? cityHospitals.map(h => `
        <article class="fh-card" style="display:flex;flex-direction:column;">
          <div class="fh-card-media">
            <img src="${h.image || 'images/service-general.png'}" alt="${h.name}" onerror="this.src='images/service-general.png'">
            <div class="card-logo-slot is-empty"><i class="fa-solid fa-paw"></i></div>
          </div>
          <div class="fh-card-body" style="flex:1;display:flex;flex-direction:column;">
            <div class="fh-card-top">
              <h3>${h.name}</h3>
              ${h.rating ? `<span class="fh-rating">${h.rating} <i class="fa-solid fa-star"></i></span>` : ''}
            </div>
            <div class="fh-meta">
              ${h.address ? `<span><i class="fa-solid fa-location-dot"></i> ${h.address}</span>` : ''}
              ${h.phone ? `<span><i class="fa-solid fa-phone"></i> ${h.phone}</span>` : ''}
              ${h.hours ? `<span><i class="fa-solid fa-clock"></i> ${h.hours}</span>` : ''}
            </div>
            <div class="fh-services" style="margin-top:8px;">
              ${(h.petTypes || []).map(pt => `<span>${pt}</span>`).join('')}
              <span style="background:#f0ebff;color:#5e4091;">${h.type || 'Veterinary Clinic'}</span>
              ${h.emergencyServices ? '<span style="background:#fef2f2;color:#dc2626;">24/7 Emergency</span>' : ''}
            </div>
            <div class="fh-card-actions" style="margin-top:auto;padding-top:12px;">
              ${h.phone ? `<a href="tel:${h.phone}" class="fh-card-primary">Call Now</a>` : '<span></span>'}
              <button class="fh-card-secondary" onclick="window.openBookingModal('${h.name}','${h.name}','${h.slug}')">Book Visit</button>
            </div>
          </div>
        </article>
      `).join('')
      : `<div style="grid-column:1/-1;text-align:center;padding:80px 20px;">
          <i class="fa-solid fa-paw" style="font-size:3rem;color:#5e4091;margin-bottom:16px;display:block;"></i>
          <h3 style="color:#1a1a2e;margin:0 0 8px;">No pet hospitals found in ${c}</h3>
          <p style="color:#6b7280;max-width:440px;margin:0 auto;">We're partnering with veterinary hospitals in ${c}. Call <strong>+91-8877772277</strong> to enquire.</p>
          <a href="/" style="display:inline-block;margin-top:20px;color:#5e4091;font-weight:700;text-decoration:none;">← Back to Home</a>
        </div>`;

    appContainer.innerHTML = `
      <div class="all-cat-hero">
        <div class="container all-cat-hero-inner">
          <div class="breadcrumb" style="margin-bottom:20px;">
            <a href="/">Home</a> <span>›</span>
            <span>Pet Hospitals</span>
          </div>
          <div class="all-cat-eyebrow"><i class="fa-solid fa-paw"></i> Pet Care</div>
          <h1 class="all-cat-title">Pet Hospitals in <span>${c}</span></h1>
          <p class="all-cat-sub">Verified veterinary hospitals and pet care centers in ${c}.</p>
        </div>
      </div>
      <div class="container" style="padding:40px 0 70px;">
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:24px;">
          ${cardsHTML}
        </div>
      </div>
    `;
    appContainer.insertAdjacentHTML('beforeend', renderDynamicFooterSection(c));
  }
