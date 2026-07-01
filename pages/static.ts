// =====================================================
// STATIC PAGES
// Privacy, Terms, About, Contact, Careers — simple content pages.
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
      <div class="static-page-header">
        <h1>Privacy Policy</h1>
        <p>Researching a surgery usually means you're already carrying enough weight. The least we can do is be straightforward about what happens to your information.</p>
      </div>
      <div class="static-layout-container">
        <aside class="static-sidebar">
          <h4>On this page</h4>
          <nav class="static-sidebar-nav">
            <a href="#covers" class="static-sidebar-link">What This Policy Covers</a>
            <a href="#short-version" class="static-sidebar-link">The Short Version</a>
            <a href="#collect" class="static-sidebar-link">What We Collect and Why</a>
            <a href="#visit-first" class="static-sidebar-link">The "Visit-First" Rule</a>
            <a href="#money" class="static-sidebar-link">Why We Never Touch Your Money</a>
            <a href="#sees-data" class="static-sidebar-link">Who Actually Sees Your Data</a>
            <a href="#rights" class="static-sidebar-link">Your Rights Under DPDPA</a>
            <a href="#regulatory" class="static-sidebar-link">Regulatory Details</a>
            <a href="#scheduling" class="static-sidebar-link">A Note on Scheduling</a>
          </nav>
        </aside>
        <div class="static-content">
          <div class="static-card">
            <h3 id="covers">1. What This Policy Covers</h3>
            <p>This policy explains how the surgery section of Doctar.in collects, uses, and protects your information when you search procedures, compare surgeons and hospitals, or book a consultation. Surgery is not a separate platform — it is part of Doctar.in, owned and operated by the same legal entity: Doctar Connect Worldwide Private Limited. This policy works alongside, and does not replace, the main Doctar.in Privacy Policy.</p>
            
            <h3 id="short-version">2. The Short Version</h3>
            <p>We collect the minimum needed to connect you with the right surgical care — nothing is sold, nothing is used to profile you for advertising, and your financial details never pass through our systems.</p>

            <h3 id="collect">3. What We Collect and Why</h3>
            <p>We do not collect diagnostic reports, scans, or detailed clinical history through this platform. Anything you share directly with a hospital or surgeon afterward is governed by that provider's own data practices, not ours.</p>

            <h3 id="visit-first">4. The “Visit-First” Rule</h3>
            <p>Only a patient with a verified completed visit can leave a review of a surgeon or hospital. It's a small rule that does most of the heavy lifting in keeping our reviews trustworthy.</p>

            <h3 id="money">5. Why We Never Touch Your Money</h3>
            <p>We don't ask for card numbers, UPI PINs, or bank details — ever. All fees are paid directly to your hospital or surgeon. Removing ourselves from the payment chain removes an entire category of fraud risk from the equation.</p>

            <h3 id="sees-data">6. Who Actually Sees Your Data</h3>
            <ul>
              <li><strong>The hospital or surgeon you book with:</strong> sees your name and number to confirm and manage the appointment.</li>
              <li><strong>Our helpline team:</strong> sees basic details only if you call in, so you're not repeating your situation twice.</li>
              <li><strong>Nobody else.</strong> We do not sell your number or procedure interest to insurers, pharma companies, or telemarketers, under any circumstance.</li>
            </ul>

            <h3 id="rights">7. Your Rights Under the DPDPA, 2023</h3>
            <ul>
              <li>Access the data we hold about you</li>
              <li>Correct anything inaccurate</li>
              <li>Request deletion of your account and associated data</li>
              <li>Withdraw consent for processing at any time</li>
            </ul>

            <h3 id="regulatory">8. Regulatory Details</h3>
            <p><strong>Data Fiduciary:</strong> Doctar Connect Worldwide Private Limited, registered office at BL-EE 64 2013, Rajdanga Main Rd, Sector E, East Kolkata Twp, Kolkata, West Bengal 700107.</p>
            <p><strong>Categories of Data Processed:</strong> Personal Data: name, age, gender, contact details. Sensitive Personal Data: procedure or specialty interest, appointment history — never used for behavioral advertising or profiling.</p>
            <p><strong>Third-Party Processors:</strong> Cloud hosting and security infrastructure providers. Encrypted SMS/WhatsApp gateways for appointment updates. Internal analytics used solely for platform stability.</p>
            <p><strong>Retention:</strong> Accounts inactive for 24 consecutive months are flagged for deletion, unless Indian law requires longer retention.</p>
            <p><strong>Grievance Officer:</strong> Sarang.S.Shaw — doctar.in@outlook.com — same registered address as above. Grievances are acknowledged within 24 hours and, where possible, resolved within 15 days.</p>

            <h3 id="scheduling">9. A Note on Surgical Scheduling</h3>
            <p>Operating theatre time depends on the surgeon and hospital's availability, emergencies, and case load on a given day. A booking made through this platform is a request, not a fixed-minute guarantee — we'll show you what we know through Live Token and queue status, but the hospital sets the final schedule.</p>

            <h3>10. Contact Us About This Policy</h3>
            <p>This page should be read together with the full Doctar.in Privacy Policy, which governs the broader platform.</p>
          </div>
        </div>
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
      <div class="static-page-header">
        <h1>Terms & Conditions</h1>
        <p>Please read this carefully — it's the agreement that governs how this platform and your surgical search relate to each other.</p>
      </div>
      <div class="static-layout-container">
        <aside class="static-sidebar">
          <h4>On this page</h4>
          <nav class="static-sidebar-nav">
            <a href="#acceptance" class="static-sidebar-link">Acceptance of These Terms</a>
            <a href="#rankings" class="static-sidebar-link">Our Position on Rankings</a>
            <a href="#what-this-is" class="static-sidebar-link">What This Platform Is</a>
            <a href="#direct-pay" class="static-sidebar-link">Direct-Pay Policy</a>
            <a href="#reviews" class="static-sidebar-link">Reviews We Accept</a>
            <a href="#scheduling" class="static-sidebar-link">Scheduling Reality</a>
            <a href="#care" class="static-sidebar-link">Pre- and Post-Operative Care</a>
            <a href="#helpline" class="static-sidebar-link">The Free Helpline</a>
            <a href="#liability" class="static-sidebar-link">Limitation of Liability</a>
            <a href="#legal" class="static-sidebar-link">Legal Terms</a>
          </nav>
        </aside>
        <div class="static-content">
          <div class="static-card">
            <h3 id="acceptance">1. Acceptance of These Terms</h3>
            <p>This page sets out the terms for the surgery section of Doctar.in (referred to here as the "Platform") — it is not a separate website or a separate company, but a dedicated part of Doctar.in covering surgical procedures, surgeons, and hospitals. Doctar.in, including this section, is owned and operated by Doctar Connect Worldwide Private Limited (the "Company"). By using this Platform, including the website and our free helpline (+91-8877772277, available 24 hours a day, 365 days a year), you ("User," "Patient," or "Relative") agree to be bound by these Terms, read together with the main Doctar.in Terms & Conditions.</p>
            <p>Users must be at least 18 years old to accept this agreement. A minor may use the Platform only under the supervision of a parent or legal guardian who accepts these Terms on their behalf.</p>

            <h3 id="rankings">2. Our Position on Rankings</h3>
            <p>No surgeon or hospital can pay for a higher position in our results, a "Featured" badge, or placement at the top of a search. Rankings are driven by proximity, specialty match, and verified patient feedback — nothing else.</p>

            <h3 id="what-this-is">3. What This Platform Is — and Isn't</h3>
            <p>The surgery section of Doctar.in is a technology platform. It is not a hospital, clinic, or surgical provider of any kind.</p>
            <p><strong>This Platform IS:</strong></p>
            <ul>
              <li>A discovery tool for surgical procedures, surgeons, and hospitals</li>
              <li>A consultation booking coordinator</li>
              <li>A verified-feedback aggregator</li>
              <li>A reference point for average procedure costs</li>
            </ul>
            <p><strong>This Platform is NOT:</strong></p>
            <ul>
              <li>A hospital, clinic, or surgical center</li>
              <li>A diagnostic authority or second-opinion service</li>
              <li>An emergency response service</li>
            </ul>
            <p>Every surgeon, hospital, and clinic listed is an independent contractor. None are employees, agents, or partners of the Company.</p>
            <p><strong>Emergency notice:</strong> this Platform is not built for emergencies. In a life-threatening situation, call 102/108 or go directly to the nearest hospital Emergency Room.</p>
            <p><strong>On pricing:</strong> figures shown for any procedure are indicative averages drawn from market research — they are not quotes. Your actual cost depends on diagnosis, hospital, room category, the surgeon's fee, and any complications, and must be confirmed directly with the provider.</p>

            <h3 id="direct-pay">4. Direct-Pay Policy</h3>
            <ul>
              <li><strong>Zero booking fees:</strong> searching, comparing, and booking a consultation is always free.</li>
              <li><strong>Direct settlement:</strong> all payment for consultations and procedures goes straight to the hospital or surgeon.</li>
              <li><strong>No billing liability:</strong> we are not responsible for prices set by individual providers; billing disputes are resolved between you and that provider.</li>
            </ul>

            <h3 id="reviews">5. Reviews We Accept</h3>
            <p>A review can only be posted after a visit is verified through our Live Token or clinic check-in system. Relatives may comment on hospital hospitality, nursing conduct, or billing transparency, but may not review a clinical or surgical outcome they did not personally experience.</p>

            <h3 id="scheduling">6. Scheduling Reality</h3>
            <p>Final authority over operating theatre time and case sequencing rests with the surgeon and hospital. Live Token and queue-status tools are estimates meant to reduce uncertainty — not a binding appointment guarantee. Medical scheduling can shift due to emergencies or pre-operative findings; the Company is not liable for resulting inconvenience.</p>

            <h3 id="care">7. Pre- and Post-Operative Care</h3>
            <p>If you arrange home-care services (nursing, physiotherapy, compounder visits) through the broader Doctar platform for recovery support:</p>
            <ul>
              <li>Verify the ID and credentials of any visiting professional</li>
              <li>Maintain a safe, respectful environment for visiting staff — abuse results in a permanent ban</li>
              <li>Confirm equipment requirements with the provider or helpline before the visit</li>
            </ul>

            <h3 id="helpline">8. The Free Helpline</h3>
            <p>Our free helpline is available 24 hours a day, 365 days a year. Helpline advisors help you shortlist surgeons and hospitals using our internal review data. They do not provide medical advice, diagnoses, or an opinion on whether you need surgery. Calls may be recorded for quality and training; calling means you consent to that.</p>

            <h3 id="liability">9. Limitation of Liability</h3>
            <p>To the maximum extent the law allows, the Company is not liable for:</p>
            <ul>
              <li><strong>Medical or surgical outcomes:</strong> any complication or result from a procedure performed by an independent provider found through this Platform.</li>
              <li><strong>Listing inaccuracies:</strong> errors in prices, timings, or hospital details, since this information is supplied and managed by the listed providers themselves.</li>
              <li><strong>Service interruptions:</strong> downtime from maintenance, updates, or technical issues.</li>
              <li><strong>Third-party conduct:</strong> actions or omissions of any hospital, surgeon, or clinic accessed through the Platform.</li>
            </ul>
            <p>Our role is strictly to facilitate discovery and booking — we carry no responsibility for the quality, safety, or clinical outcome of any procedure.</p>

            <h3 id="legal">10. Legal & General</h3>
            <p><strong>Intellectual Property:</strong> All proprietary systems — our surgeon and hospital database structure, the Live Token system, and our review-verification logic — belong exclusively to Doctar Connect Worldwide Private Limited. Unauthorized scraping or copying of this data is prohibited and may result in legal action.</p>
            <p><strong>Indemnification:</strong> You agree to indemnify and hold harmless the Company, its officers, employees, and affiliates against claims arising from your use of the Platform, breach of these Terms, content you post, or disputes between you and any surgical provider accessed through the Platform.</p>
            <p><strong>Changes to These Terms:</strong> We may update these Terms as our network and services grow. Continuing to use the Platform after an update means you accept the revised Terms.</p>
            <p><strong>Suspension and Termination:</strong> We may suspend or terminate access for fraudulent reviews, abuse toward staff or providers, repeated no-shows, or any breach of these Terms.</p>
            <p><strong>Governing Law:</strong> These Terms are governed by the laws of the Republic of India. Disputes fall under the exclusive jurisdiction of the courts in Kolkata, West Bengal. Both parties agree to attempt good-faith negotiation for 30 days before pursuing legal remedies.</p>

            <h3>A Closing Note</h3>
            <p>A surgical decision is one of the heaviest calls a person makes for themselves or a loved one. This Platform exists to make that decision more informed — never to replace the judgment of you, your family, and the medical team you ultimately choose.</p>
            <p><strong>Legal inquiries:</strong> doctar.in@outlook.com <br><strong>Support:</strong> +91-8877772277 (24 hours a day, 365 days a year)</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAboutPage() {
  updatePageMeta({
    title: "About Doctar Surgery - India's Largest Surgical Care Platform",
    description: "Doctar Surgery connects patients with expert surgeons across India.",
    robots: 'noindex'
  });
  document.getElementById('app').innerHTML = `
    <div class="static-page">
      <div class="static-page-header">
        <h1>About Doctar Surgery</h1>
        <p>Doctar Surgery is built on one idea: the hardest part of needing an operation shouldn't be figuring out who to trust with it.</p>
      </div>
      <div class="static-layout-container">
        <aside class="static-sidebar">
          <h4>On this page</h4>
          <nav class="static-sidebar-nav">
            <a href="#why-exist" class="static-sidebar-link">Why We Exist</a>
            <a href="#not-apart" class="static-sidebar-link">Part of Doctar.in, Not Apart From It</a>
            <a href="#principles" class="static-sidebar-link">The Principles Behind Every Listing</a>
            <a href="#inside" class="static-sidebar-link">What's Inside the Platform</a>
            <a href="#headed" class="static-sidebar-link">Where We're Headed</a>
          </nav>
        </aside>
        <div class="static-content">
          <div class="static-card">
            <h3 id="why-exist">Why We Exist</h3>
            <p>Most people who land on a surgery booking page are already anxious. They've just heard a diagnosis, or they're trying to make a decision on behalf of an ageing parent, and the last thing they need is a maze of unclear pricing and unverifiable claims about who the "best" surgeon actually is.</p>
            <p>Doctar Surgery is the dedicated surgical-care section within Doctar.in — built purely for people researching an operation. One search shows you the procedure, the surgeons who perform it, the hospitals that offer it, and a realistic sense of what it costs, before you commit to a single phone call.</p>

            <h3 id="not-apart">Part of Doctar.in, Not Apart From It</h3>
            <p>Surgery is not a separate company or a separate product — it's a dedicated section of Doctar.in, built so that anyone researching an operation lands directly on the information that matters, instead of wading through unrelated listings. Doctar.in is owned and operated by Doctar Connect Worldwide Private Limited, and every policy that governs trust on the main platform — no paid rankings, no fake reviews, no platform handling of your money — applies here without exception. We didn't build a separate set of rules for surgery; we built a faster, clearer route to the same platform.</p>

            <h3 id="principles">The Principles Behind Every Listing</h3>
            <ul>
              <li><strong>Outcomes over advertising.</strong> A surgeon's position in our results is never something a hospital can purchase. It reflects experience, credentials, and the feedback of patients who actually walked through that hospital's doors.</li>
              <li><strong>One verified review per visit.</strong> We only accept a review once a booking has been confirmed as a genuine visit. That single rule does more for trust than any star rating ever could.</li>
              <li><strong>Pricing you can actually plan around.</strong> Every procedure carries an average price range pulled from real market data, so you walk into a consultation with a baseline — not a blank cheque.</li>
              <li><strong>Your money never touches our platform.</strong> We coordinate the booking; you pay the hospital or surgeon directly. There's no commission for us to protect, which means no incentive to push you toward a particular provider.</li>
            </ul>

            <h3 id="inside">What's Inside the Platform</h3>
            <p>Twelve surgical specialties, over a hundred procedures, and a network of NABH/JCI-accredited hospitals across India's major cities — from orthopaedics and cardiology to cosmetic, robotic, and transplant surgery. Every listing includes surgeon qualifications, hospital accreditation, an average price range, and a route to book a free consultation.</p>

            <h3 id="headed">Where We're Headed</h3>
            <p>Surgical care in India is improving fast — robotic procedures, shorter recovery windows, better outcomes — but the information patients get to act on hasn't kept pace. Our goal is to close that gap: a country where nobody picks a surgeon out of fear or guesswork, because the information they needed was sitting right in front of them.</p>

            <p style="margin-top: 20px; font-weight: 600;">Questions about a procedure? Call our free care line at +91-8877772277, available 24 hours a day, 365 days a year.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderContactPage() {
  updatePageMeta({
    title: 'Contact Us | Doctar Surgery',
    description: 'Get in touch with the Doctar Surgery team.',
    robots: 'noindex'
  });
  document.getElementById('app').innerHTML = `
    <div class="static-page">
      <div class="static-page-header">
        <h1>Contact Us</h1>
        <p>Most questions we get aren't complicated — they're just urgent. Here's the fastest way to reach an actual person.</p>
      </div>
      <div class="static-layout-container">
        <aside class="static-sidebar">
          <h4>On this page</h4>
          <nav class="static-sidebar-nav">
            <a href="#reach" class="static-sidebar-link">Reach a Care Coordinator</a>
            <a href="#faq" class="static-sidebar-link">Questions We Hear Most</a>
          </nav>
        </aside>
        <div class="static-content">
          <div class="static-card">
            <h3 id="reach">Reach a Care Coordinator</h3>
            <p>Our free helpline is available 24 hours a day, 365 days a year.</p>
            <p style="font-size: 1.5rem; color: var(--primary); font-weight: bold; margin: 16px 0;">+91-8877772277</p>
            <p><strong>Email:</strong> doctar.in@outlook.com</p>
            
            <h3 id="faq" style="margin-top: 40px;">Questions We Hear Most</h3>
            
            <h4 style="margin-top: 20px; color: var(--text-main);">How do I actually find a surgeon for my procedure?</h4>
            <p>Search by procedure name or specialty on our surgery search page, filter by city, and compare verified surgeon and hospital profiles side by side.</p>
            
            <h4 style="margin-top: 20px; color: var(--text-main);">Are the prices you show actually what I'll pay?</h4>
            <p>They're average ranges built from real market data — a planning tool, not a quote. Your final cost depends on your specific case, the room category you choose, and the surgeon's own fee, all confirmed directly with the hospital before you commit.</p>
            
            <h4 style="margin-top: 20px; color: var(--text-main);">Does Doctar Surgery take a cut of my payment?</h4>
            <p>No. We never collect payment for medical services. Every rupee for your consultation or procedure goes straight to the hospital or surgeon — there's no platform fee in between.</p>
            
            <h4 style="margin-top: 20px; color: var(--text-main);">Is this a separate company from Doctar.in?</h4>
            <p>It's not a separate company at all — surgery is simply a dedicated section within Doctar.in. Both are owned and operated by Doctar Connect Worldwide Private Limited. We organized surgical care into its own space so patients researching an operation aren't wading through unrelated content to get there.</p>
            
            <h4 style="margin-top: 20px; color: var(--text-main);">Can I get help understanding insurance or EMI options?</h4>
            <p>Yes. Many partner hospitals accept insurance and offer no-cost EMI. Call the helpline and a care coordinator will walk you through what's realistic for your situation.</p>
            
            <h4 style="margin-top: 20px; color: var(--text-main);">How do I cancel or reschedule a consultation?</h4>
            <p>Through your dashboard, up to 24 hours before your scheduled time — or just call us directly and we'll handle it.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderCareersPage() {
  updatePageMeta({
    title: 'Careers | Doctar Surgery',
    description: 'Join the team building India’s most trusted surgical care platform.',
    robots: 'noindex'
  });
  document.getElementById('app').innerHTML = `
    <div class="static-page">
      <div class="static-page-header">
        <h1>Careers at Doctar Surgery</h1>
        <p>We're a small team trying to fix a problem most people only think about on the worst day of their year. If that sounds like work worth doing, we'd like to hear from you.</p>
      </div>
      <div class="static-layout-container">
        <aside class="static-sidebar">
          <h4>On this page</h4>
          <nav class="static-sidebar-nav">
            <a href="#building" class="static-sidebar-link">What We're Actually Building</a>
            <a href="#stay" class="static-sidebar-link">Why People Stay</a>
            <a href="#roles" class="static-sidebar-link">Roles We Typically Hire For</a>
            <a href="#hiring" class="static-sidebar-link">How Hiring Works</a>
          </nav>
        </aside>
        <div class="static-content">
          <div class="static-card">
            <h3 id="building">What We're Actually Building</h3>
            <p>Doctar Surgery sits inside the wider Doctar ecosystem, focused entirely on the surgical side of healthcare — the verified surgeon and hospital database, the pricing engine that keeps cost estimates honest, and the Live Token system that tells a patient where they stand in a real queue instead of leaving them guessing in a waiting room.</p>

            <h3 id="stay">Why People Stay</h3>
            <ul>
              <li><strong>Remote-first, genuinely.</strong> Work from anywhere in India. We've built our processes around async collaboration from day one, not as a pandemic-era afterthought.</li>
              <li><strong>Work that's hard to feel cynical about.</strong> Every feature shipped potentially changes how a family experiences a surgery — that tends to keep a team honest about quality.</li>
              <li><strong>Health coverage that matches our mission.</strong> Comprehensive insurance for you and your family, because asking people to build a healthcare company without good healthcare of their own felt backwards.</li>
              <li><strong>A flat, fast-moving team.</strong> We're still small enough that a good idea from a new hire's first month can ship in their second.</li>
            </ul>

            <h3 id="roles">Roles We Typically Hire For</h3>
            <ul>
              <li>Frontend Developer</li>
              <li>Backend Developer</li>
              <li>Fullstack Developer</li>
              <li>Medical Content Writer / Editor</li>
              <li>Operations Manager — Hospital Partnerships</li>
              <li>UX/UI Designer</li>
              <li>Data Entry Specialist</li>
              <li>Other / Not Listed — tell us what you do</li>
            </ul>

            <h3 id="hiring">How Hiring Works</h3>
            <p>Since Doctar Surgery shares its team and infrastructure with the main Doctar platform, all applications go through one central process:</p>
            <ol style="padding-left: 20px; margin-bottom: 16px; color: var(--text-muted); font-size: 1.05rem;">
              <li style="margin-bottom: 8px;">Submit your application and resume through the Doctar careers form</li>
              <li style="margin-bottom: 8px;">Resume review</li>
              <li style="margin-bottom: 8px;">Initial screening call</li>
              <li style="margin-bottom: 8px;">A short technical or role-specific task</li>
              <li style="margin-bottom: 8px;">Final interview</li>
            </ol>
            <p>If you're specifically interested in the surgical-care side of the business, just say so in your application — mention “Surgery Vertical” and it'll route to the right team.</p>
            <p style="margin-top: 20px; font-weight: 600;">Questions before you apply? Reach us directly at doctar.in@outlook.com.</p>
          </div>
        </div>
      </div>
    </div>
  `;
}
