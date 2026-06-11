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
      <section class="all-cat-hero">
        <div class="container all-cat-hero-inner">
          <div class="breadcrumb" style="margin-bottom: 20px;">
            <a href="/">Home</a> <span>›</span>
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

