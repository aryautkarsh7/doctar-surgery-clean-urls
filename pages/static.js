// =====================================================
// STATIC PAGES
// Privacy, Terms, About, Contact — simple content pages (noindex).
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================

function renderPrivacyPage() {
  updatePageMeta({
    title: 'Privacy Policy | Doctar Surgery',
    description: 'Privacy policy for Doctar Surgery platform.',
    robots: 'noindex'
  });
  document.getElementById('app').innerHTML = `
    <div class="static-page">
      <div class="static-container">
        <h1>Privacy Policy</h1>
        <p class="static-updated">Last updated: June 2026</p>

        <h2>1. Information We Collect</h2>
        <p>We collect information you provide when booking appointments,
        including name, phone number, email, and medical preferences.</p>

        <h2>2. How We Use Your Information</h2>
        <p>We use your information to connect you with surgeons and hospitals,
        send appointment confirmations, and improve our services.</p>

        <h2>3. Data Security</h2>
        <p>Your data is encrypted and stored securely. We never sell
        your personal information to third parties.</p>

        <h2>4. Cookies</h2>
        <p>We use cookies to remember your city preference and
        improve your browsing experience.</p>

        <h2>5. Third Party Services</h2>
        <p>We use Cloudinary for image storage and Twilio for SMS notifications.
        These services have their own privacy policies.</p>

        <h2>6. Contact Us</h2>
        <p>For privacy concerns, email us at:
        <a href="mailto:privacy@surgery.doctar.in">privacy@surgery.doctar.in</a></p>
      </div>
    </div>
  `;
}

function renderTermsPage() {
  updatePageMeta({
    title: 'Terms & Conditions | Doctar Surgery',
    description: 'Terms and conditions for using Doctar Surgery platform.',
    robots: 'noindex'
  });
  document.getElementById('app').innerHTML = `
    <div class="static-page">
      <div class="static-container">
        <h1>Terms & Conditions</h1>
        <p class="static-updated">Last updated: June 2026</p>

        <h2>1. Medical Disclaimer</h2>
        <p>Doctar Surgery is a platform that connects patients with
        healthcare providers. We do not provide medical advice.
        Always consult a qualified doctor for medical decisions.</p>

        <h2>2. Booking Terms</h2>
        <p>Appointments booked through our platform are subject to
        availability. We facilitate connections but are not responsible
        for the quality of medical services provided.</p>

        <h2>3. User Responsibilities</h2>
        <p>Users must provide accurate information when booking.
        Misuse of the platform may result in account termination.</p>

        <h2>4. Cancellation Policy</h2>
        <p>Cancellations must be made at least 24 hours before
        the scheduled appointment. Contact the hospital directly
        for refund policies.</p>

        <h2>5. Contact</h2>
        <p>For queries:
        <a href="mailto:legal@surgery.doctar.in">legal@surgery.doctar.in</a></p>
      </div>
    </div>
  `;
}

function renderAboutPage() {
  updatePageMeta({
    title: "About Doctar Surgery - India's Largest Surgical Care Platform",
    description: "Doctar Surgery connects patients with expert surgeons across India. 13,000+ hospitals, 1,053+ cities.",
    robots: 'noindex'
  });
  document.getElementById('app').innerHTML = `
    <div class="static-page">
      <div class="static-container">
        <h1>About Doctar Surgery</h1>
        <p class="static-subtitle">India's Largest Surgical Care Platform</p>

        <div class="about-stats">
          <div class="about-stat">
            <span class="about-stat-num">13,000+</span>
            <span class="about-stat-label">Partner Hospitals</span>
          </div>
          <div class="about-stat">
            <span class="about-stat-num">1,053+</span>
            <span class="about-stat-label">Cities</span>
          </div>
          <div class="about-stat">
            <span class="about-stat-num">3M+</span>
            <span class="about-stat-label">Happy Patients</span>
          </div>
          <div class="about-stat">
            <span class="about-stat-num">Free</span>
            <span class="about-stat-label">Consultation</span>
          </div>
        </div>

        <h2>Our Mission</h2>
        <p>To make quality surgical care accessible to every Indian,
        regardless of location or economic background. We connect patients
        with verified surgeons and hospitals across India.</p>

        <h2>What We Do</h2>
        <p>Doctar Surgery is a healthcare platform that helps patients find
        the right surgeon, compare hospitals, understand treatment costs,
        and book appointments — all in one place.</p>

        <h2>Why Choose Us</h2>
        <ul>
          <li>✅ Free consultation with expert surgeons</li>
          <li>✅ Cashless insurance support</li>
          <li>✅ Free cab assistance</li>
          <li>✅ Zero cost EMI options</li>
          <li>✅ 24/7 helpline support</li>
        </ul>

        <h2>Contact Us</h2>
        <p>📞 +91-88777-72277<br>
        📧 <a href="mailto:support@surgery.doctar.in">support@surgery.doctar.in</a><br>
        📍 4th Floor, Tower B, DLF Cyber City, Gurugram</p>
      </div>
    </div>
  `;
}

function renderContactPage() {
  updatePageMeta({
    title: 'Contact Us | Doctar Surgery',
    description: 'Get in touch with Doctar Surgery team.',
    robots: 'noindex'
  });
  document.getElementById('app').innerHTML = `
    <div class="static-page">
      <div class="static-container">
        <h1>Contact Us</h1>

        <div class="contact-grid">
          <div class="contact-info">
            <h2>Get In Touch</h2>
            <div class="contact-item">
              <span>📞</span>
              <div>
                <strong>24/7 Helpline</strong>
                <p>+91-88777-72277</p>
              </div>
            </div>
            <div class="contact-item">
              <span>📧</span>
              <div>
                <strong>Email</strong>
                <p>support@surgery.doctar.in</p>
              </div>
            </div>
            <div class="contact-item">
              <span>📍</span>
              <div>
                <strong>Address</strong>
                <p>4th Floor, Tower B, DLF Cyber City,
                Gurugram, Haryana 122002</p>
              </div>
            </div>
          </div>

          <div class="contact-form">
            <h2>Send a Message</h2>
            <div class="form-group">
              <input type="text" placeholder="Your Name" class="form-input">
            </div>
            <div class="form-group">
              <input type="email" placeholder="Your Email" class="form-input">
            </div>
            <div class="form-group">
              <input type="tel" placeholder="Phone Number" class="form-input">
            </div>
            <div class="form-group">
              <textarea placeholder="Your Message" class="form-input" rows="4"></textarea>
            </div>
            <button class="btn-primary" onclick="alert('Message sent! We will contact you soon.')">
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}
