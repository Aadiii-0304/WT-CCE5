/**
 * ============================================================================
 * NOTICES & CIRCULARS MODULE (js/notices.js)
 * D. Y. Patil College of Engineering, Akurdi - Web Technology 1 (CCE-5)
 * ============================================================================
 *
 * Concepts Demonstrated for Viva:
 * 1. Fetch API loading dynamic announcements from `data/notices.json`
 * 2. Category tab filtering & search index filtering
 * 3. Urgent notice ticker alert logic
 * 4. Dynamic DOM generation for Notice Cards, Home Widget & Modal reader
 * ============================================================================
 */

const NoticesModule = (function () {
  let noticesCache = null;
  let activeCategory = 'ALL';
  let searchQuery = '';

  /**
   * Fetches notices from data/notices.json
   */
  async function fetchNotices() {
    if (noticesCache) {
      return noticesCache;
    }

    try {
      const response = await fetch('data/notices.json');
      if (!response.ok) {
        throw new Error(`HTTP Error: Failed to fetch notices. Status: ${response.status}`);
      }
      noticesCache = await response.json();
      return noticesCache;
    } catch (error) {
      console.warn('[NoticesModule] Fetch encounter:', error.message);
      if (window.DYPCOE_DATA && window.DYPCOE_DATA.notices) {
        console.info('[NoticesModule] Utilizing fallback data registry for file:// compatibility.');
        noticesCache = window.DYPCOE_DATA.notices;
        return noticesCache;
      }
      throw error;
    }
  }

  /**
   * Renders the complete Notices Page (/notices)
   */
  async function renderNoticesPage() {
    const notices = await fetchNotices();
    const urgentNotices = notices.filter(n => n.isUrgent);

    return `
      <!-- Page Banner -->
      <section class="page-banner">
        <div class="container">
          <h1 class="page-banner-title">College Notice Board</h1>
          <div class="page-banner-breadcrumb">
            <a href="/" data-link>Home</a>
            <span>/</span>
            <span>Notices</span>
          </div>
        </div>
      </section>

      <!-- Main Notices Section -->
      <section class="section section-light">
        <div class="container">
          <!-- Urgent Notices Ticker -->
          ${urgentNotices.length > 0 ? `
            <div class="urgent-notice-ticker">
              <span class="urgent-badge">Urgent Notice</span>
              <div class="urgent-text">
                📢 ${urgentNotices[0].title} (${urgentNotices[0].date}) — ${urgentNotices[0].shortDescription}
              </div>
            </div>
          ` : ''}

          <div class="section-header">
            <span class="section-badge">Official Circulars</span>
            <h2 class="section-title">Announcements & Circulars</h2>
            <p class="section-subtitle">
              Stay updated with academic schedules, SPPU examination timetables, admissions, campus events, and administrative directives.
            </p>
          </div>

          <!-- Category Filters & Search Controls -->
          <div class="filter-search-bar">
            <!-- Filter Pills -->
            <div class="filter-pills" id="notice-filter-pills">
              <button class="filter-pill-btn active" data-category="ALL">All Notices</button>
              <button class="filter-pill-btn" data-category="Academic">Academic</button>
              <button class="filter-pill-btn" data-category="Examination">Examination</button>
              <button class="filter-pill-btn" data-category="Events">Events</button>
              <button class="filter-pill-btn" data-category="Admission">Admission</button>
              <button class="filter-pill-btn" data-category="Circulars">Circulars</button>
            </div>

            <!-- Search Input -->
            <div class="search-input-wrap">
              <span class="search-icon-inside">🔍</span>
              <input
                type="text"
                id="notice-search-input"
                class="search-input"
                placeholder="Search circulars or notices..."
                value="${searchQuery}"
              />
            </div>
          </div>

          <!-- Dynamic Notices Container -->
          <div id="notices-results-container">
            ${renderNoticesGrid(notices, activeCategory, searchQuery)}
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Generates the Notices Grid based on active category & query
   */
  function renderNoticesGrid(notices, category, query) {
    let filtered = notices;

    // Filter by Category
    if (category !== 'ALL') {
      filtered = filtered.filter(n => n.category.toLowerCase() === category.toLowerCase());
    }

    // Filter by Search Query
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.shortDescription.toLowerCase().includes(q) ||
        n.author.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      return `
        <div style="text-align: center; padding: 4rem 1rem; background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">📋</div>
          <h3 style="font-size: 1.3rem; color: var(--primary-navy); margin-bottom: 0.5rem;">No Notices Found</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            No notices match your current category selection or search keywords.
          </p>
        </div>
      `;
    }

    return `
      <div style="margin-bottom: 1.25rem; font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">
        Showing ${filtered.length} notices & circulars
      </div>
      <div class="notices-grid">
        ${filtered.map(notice => renderNoticeCard(notice)).join('')}
      </div>
    `;
  }

  /**
   * Generates HTML markup for an individual Notice Card
   */
  function renderNoticeCard(notice) {
    // Parse date for visual day/month box (e.g. "15 Nov 2026")
    const dateParts = notice.date.split(' ');
    const day = dateParts[0] || '15';
    const month = dateParts[1] || 'NOV';

    return `
      <div class="notice-card ${notice.isUrgent ? 'urgent' : ''}">
        <div class="notice-date-box">
          <span class="notice-date-day">${day}</span>
          <span class="notice-date-month">${month}</span>
        </div>
        <div class="notice-body">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <span class="notice-category-badge">${notice.category}</span>
            ${notice.isUrgent ? '<span style="color: var(--color-danger); font-size: 0.75rem; font-weight: 800;">● PRIORITY</span>' : ''}
          </div>
          <h3 class="notice-title">${notice.title}</h3>
          <p class="notice-desc">${notice.shortDescription}</p>
          <div class="notice-meta-footer">
            <span class="notice-author">Issued by: ${notice.author}</span>
            <button
              class="btn btn-outline btn-sm"
              onclick="window.NoticesModule.showNoticeModal('${notice.id}')"
            >
              Read More →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Helper to render latest notices on the Home page
   */
  async function renderHomeNotices() {
    try {
      const notices = await fetchNotices();
      // Show top 4 notices
      return notices.slice(0, 4).map(notice => renderNoticeCard(notice)).join('');
    } catch (error) {
      return `<p style="text-align: center; color: var(--text-muted);">Unable to load notices widget.</p>`;
    }
  }

  /**
   * Initializes event listeners for categories and search
   */
  function initEvents() {
    const filterButtons = document.querySelectorAll('#notice-filter-pills .filter-pill-btn');
    const searchInput = document.getElementById('notice-search-input');
    const container = document.getElementById('notices-results-container');

    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.getAttribute('data-category');

        if (container && noticesCache) {
          container.innerHTML = renderNoticesGrid(noticesCache, activeCategory, searchQuery);
        }
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (container && noticesCache) {
          container.innerHTML = renderNoticesGrid(noticesCache, activeCategory, searchQuery);
        }
      });
    }
  }

  /**
   * Displays full notice modal with simulated download
   */
  async function showNoticeModal(noticeId) {
    const notices = await fetchNotices();
    const notice = notices.find(n => n.id === noticeId);
    if (!notice) return;

    const modalBody = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="notice-category-badge" style="background: var(--secondary-blue-light); color: var(--secondary-blue);">
            Category: ${notice.category}
          </span>
          <span style="font-size: 0.85rem; color: var(--text-muted); font-weight: 600;">
            📅 Date: ${notice.date}
          </span>
        </div>

        <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--primary-navy); line-height: 1.35;">
          ${notice.title}
        </h3>

        <div style="background: var(--bg-light); padding: 1.25rem; border-radius: var(--radius-md); border-left: 4px solid var(--secondary-blue); font-size: 0.95rem; color: var(--text-secondary); line-height: 1.7;">
          ${notice.fullText}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 1rem; border-top: 1px solid var(--border-light); flex-wrap: gap; gap: 1rem;">
          <div>
            <div style="font-size: 0.78rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">ISSUING AUTHORITY</div>
            <div style="font-weight: 700; color: var(--primary-navy); font-size: 0.95rem;">${notice.author}</div>
            <div style="font-size: 0.75rem; color: var(--text-muted);">D. Y. Patil College of Engineering, Akurdi</div>
          </div>

          <button
            class="btn btn-outline btn-sm"
            onclick="window.app.showToast('Downloaded: ${notice.attachment || 'Notice_Document.pdf'}', 'success')"
          >
            📥 Download Circular PDF
          </button>
        </div>
      </div>
    `;

    if (window.app && typeof window.app.openModal === 'function') {
      window.app.openModal('Official Circular Details', modalBody);
    }
  }

  return {
    fetchNotices,
    renderNoticesPage,
    renderHomeNotices,
    initEvents,
    showNoticeModal
  };
})();

window.NoticesModule = NoticesModule;
