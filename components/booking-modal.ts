// =====================================================
// BOOKING & CLAIM MODALS
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================
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
    const val = id => ((document.getElementById(id) as any)?.value || '').trim();
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
    const btn = document.getElementById('claim-submit') as any;
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
        if (btn) { btn.disabled = false; btn.textContent = 'Submit Claim'; }
      }
    } catch (e) {
      msgEl.className = 'claim-msg err';
      msgEl.textContent = 'Network error. Please call +91-8877772277.';
      if (btn) { btn.disabled = false; btn.textContent = 'Submit Claim'; }
    }
  };

  window.submitBooking = async function(name, phone, disease, successMessage, email) {
    if (!name || !phone) {
      alert('Please fill in both Patient Name and Mobile Number.');
      return;
    }
    try {
      const body: any = { name, phone, disease };
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
    const name = (document.getElementById('dpp-patient-name') as any)?.value.trim();
    const phone = (document.getElementById('dpp-patient-phone') as any)?.value.trim();
    const email = (document.getElementById('dpp-patient-email') as any)?.value.trim();
    window.submitBooking(name, phone, specialty, 'Appointment booked! Our team will call you to confirm.', email);
  };

  window.submitHospitalBooking = function(hospitalName) {
    const form = document.getElementById('hpp-booking-form') as HTMLFormElement;
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
    const cityEl = document.getElementById('bm-city') as any;
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
          if (user.name) (document.getElementById('bm-name') as any).value = user.name;
          if (user.email) (document.getElementById('bm-email') as any).value = user.email;
          if (user.phone) (document.getElementById('bm-phone') as any).value = user.phone;
          if (user.sex) window.bmSetSex(user.sex, document.getElementById('bm-sex-' + user.sex.toLowerCase()));
          if (user.dob) (document.getElementById('bm-dob') as any).value = user.dob;
          if (user.postal) (document.getElementById('bm-postal') as any).value = user.postal;
          if (user.city) (document.getElementById('bm-city') as any).value = user.city;
          if (user.address) (document.getElementById('bm-address') as any).value = user.address;
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
      const el = document.getElementById(id) as any;
      if (el) el.value = '';
    });
    window.bmSetSex('Male', document.getElementById('bm-sex-male'));
  }

  window.bmSetDate = function(type, btn, val) {
    document.querySelectorAll('.bm-date-pill').forEach(b => b.classList.remove('active'));
    const picker = document.getElementById('bm-date-picker') as any;

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
      if (picker) picker.min = new Date().toISOString().split('T')[0];
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
      const full = document.querySelector('.bm-slots-full') as any;
      const summary = document.getElementById('bm-slot-summary') as any;
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
    const full = document.querySelector('.bm-slots-full') as any;
    const summary = document.getElementById('bm-slot-summary') as any;
    if (full) full.style.display = '';
    if (summary) { summary.style.display = 'none'; summary.innerHTML = ''; }
  };

  window.bmSetSex = function(sex, btn) {
    window._bmState.sex = sex;
    document.querySelectorAll('.bm-sex-btn').forEach((b: any) => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  };

  window.bmUseCurrentCity = function() {
    const city = getCurrentCity ? getCurrentCity() : '';
    if (city) (document.getElementById('bm-city') as any).value = city;
  };

  window.bmSubmit = async function() {
    const name = (document.getElementById('bm-name') as any).value.trim();
    const email = (document.getElementById('bm-email') as any).value.trim();
    const rawPhone = (document.getElementById('bm-phone') as any).value.replace(/\D/g, '') || '';
    const bmPhoneErr = document.getElementById('bm-phone-error') as any;

    if (!name) {
      alert('Please enter the patient name.');
      return;
    }
    if (rawPhone.length !== 10) {
      if (bmPhoneErr) bmPhoneErr.style.display = 'block';
      (document.getElementById('bm-phone') as any)?.focus();
      return;
    }
    if (bmPhoneErr) bmPhoneErr.style.display = 'none';
    const phone = '+91' + rawPhone;

    // Date pills use class `.bm-date-pill`; slots use `.bm-slot`.
    const activeDateEl = document.querySelector('.bm-date-pill.active');
    const picker = document.getElementById('bm-date-picker') as any;
    // When "Other Days" is chosen the pill text isn't a real date — use the picker value.
    let selectedDate = activeDateEl?.textContent?.trim() || '';
    if (picker && picker.value && (selectedDate === 'Other Days' || activeDateEl?.id === 'bm-date-other')) {
      selectedDate = picker.value;
    }

    const selectedSlot = (document.querySelector('.bm-slot.active') as any)?.dataset?.slot
      || (document.querySelector('.bm-slot.active') as any)?.textContent?.trim()
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
      dob: (document.getElementById('bm-dob') as any).value,
      postal: (document.getElementById('bm-postal') as any).value.trim(),
      city: (document.getElementById('bm-city') as any).value.trim(),
      address: (document.getElementById('bm-address') as any).value.trim(),
      doctorName: window._bmState.doctorName,
      doctorSlug: window._bmState.doctorSlug,
      hospital: window._bmState.hospitalName,
      date: window._bmState.date,
      slot: window._bmState.slot,
      appointmentDate: selectedDate,
      appointmentTime: selectedSlot,
      disease: 'Consultation',
      location: (document.getElementById('bm-city') as any).value.trim(),
    };

    const submitBtn = document.querySelector('.bm-btn-submit') as any;
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';
    }

    const resetBtn = () => {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-calendar-check"></i> Send Request';
      }
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

  // Search SubSubCategory keywords (currently General Surgery only).
