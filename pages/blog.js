// =====================================================
// BLOG PAGES
// Loaded as a classic script — shares global scope with data.js & siblings.
// =====================================================

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
          <a href="/" style="color:#5e4091;font-weight:700;">← Back to Home</a>
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
            <a href="/">Home</a>
            <i class="fa-solid fa-chevron-right"></i>
            <a href="/blogs/s">Blog</a>
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
                  <a href="/blog/${item.slug}/s" class="blog-card">
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
            <a href="/" class="btn-back-blog"><i class="fa-solid fa-arrow-left"></i> Back to Home</a>
          </div>
        </div>
      </div>
    `;
  }

  function renderBlogsPage() {
    const posts = BLOG_POSTS.filter(post => post.published !== false);
    appContainer.innerHTML = `
      <div class="static-page">
        <div class="static-page-header">
          <h1>The Surgery Blog</h1>
          <p>Everything you read here exists to answer the question patients ask us most often before a consultation: “What is actually about to happen to me?”</p>
        </div>
        <div class="static-layout-container">
          <aside class="static-sidebar">
            <h4>On this page</h4>
            <nav class="static-sidebar-nav">
              <a href="#what-we-write" class="static-sidebar-link">What We Write About</a>
              <a href="#articles" class="static-sidebar-link">A Few Articles to Start With</a>
              <a href="#disclaimer" class="static-sidebar-link">One Honest Disclaimer</a>
            </nav>
          </aside>
          <div class="static-content">
            <div class="static-card" style="margin-bottom: 20px;">
              <h3 id="what-we-write">What We Write About</h3>
              
              <h4 style="margin-top: 20px; color: var(--text-main);">Before the Operating Table</h4>
              <p>What a procedure actually involves — step by step, in plain language — along with the kind of anesthesia typically used, how long it takes, and what a same-day versus multi-day hospital stay looks like.</p>

              <h4 style="margin-top: 20px; color: var(--text-main);">The Real Cost Conversation</h4>
              <p>Price ranges across Indian cities, what drives a bill up or down (room category, surgeon's experience, complications), and how to approach insurance pre-authorization or no-cost EMI without getting blindsided later.</p>

              <h4 style="margin-top: 20px; color: var(--text-main);">Recovery, Honestly</h4>
              <p>Week-by-week recovery timelines for common procedures — what pain is normal, what isn't, when to call your surgeon versus when to wait it out, and how long before you're back to ordinary life.</p>

              <h4 style="margin-top: 20px; color: var(--text-main);">Choosing Who Operates on You</h4>
              <p>How to read a surgeon's profile properly, which credentials actually matter, what questions are worth asking in a first consultation, and how to interpret patient reviews without over- or under-weighting them.</p>

              <h4 style="margin-top: 20px; color: var(--text-main);">Getting Ready</h4>
              <p>Fasting windows, medications to pause, what to pack for a hospital admission, and the small logistical details that get overlooked until the morning of the surgery.</p>
            </div>

            <h3 id="articles" style="margin-top: 20px; margin-bottom: 20px;">A Few Articles to Start With</h3>
            <div class="blog-related-grid" style="padding-bottom: 20px;">
              ${posts.map(post => `
                <a href="/blog/${post.slug}/s" class="blog-card">
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

            <div class="static-card">
              <h3 id="disclaimer">One Honest Disclaimer</h3>
              <p>Nothing on this blog replaces a conversation with your own doctor. Every case is different, and a general article can't account for your specific history, scans, or risk factors. Treat what you read here as preparation for that conversation — not a substitute for it.</p>
              <p style="margin-top: 20px; font-weight: 600;">Want personalised guidance instead? Search for a surgeon near you or speak to a care coordinator on our free helpline.</p>
            </div>
          </div>
        </div>
      </div>
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

