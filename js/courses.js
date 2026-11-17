/**
 * ============================================================================
 * COURSES MODULE (js/courses.js)
 * D. Y. Patil College of Engineering, Akurdi - Web Technology 1 (CCE-5)
 * ============================================================================
 *
 * Concepts Demonstrated for Viva:
 * 1. Fetch API to load dynamic course information from `data/courses.json`
 * 2. Real-time client-side array filtering & searching using Array methods (.filter, .includes)
 * 3. Dynamic DOM updates on user interaction (pills and search bar)
 * 4. Interactive modal dialog generation with escape key and outside click handling
 * ============================================================================
 */

const CoursesModule = (function () {
  let coursesCache = null;
  let activeFilter = 'ALL';
  let searchQuery = '';

  /**
   * Fetches courses from data/courses.json
   */
  async function fetchCourses() {
    if (coursesCache) {
      return coursesCache;
    }

    try {
      const response = await fetch('data/courses.json');
      if (!response.ok) {
        throw new Error(`HTTP Error: Failed to fetch courses. Status: ${response.status}`);
      }
      coursesCache = await response.json();
      return coursesCache;
    } catch (error) {
      console.warn('[CoursesModule] Fetch encounter:', error.message);
      if (window.DYPCOE_DATA && window.DYPCOE_DATA.courses) {
        console.info('[CoursesModule] Utilizing fallback data registry for file:// compatibility.');
        coursesCache = window.DYPCOE_DATA.courses;
        return coursesCache;
      }
      throw error;
    }
  }

  /**
   * Renders the complete Courses Page (/courses)
   */
  async function renderCoursesPage() {
    const courses = await fetchCourses();

    return `
      <!-- Page Banner -->
      <section class="page-banner">
        <div class="container">
          <h1 class="page-banner-title">Engineering Degree Programs</h1>
          <div class="page-banner-breadcrumb">
            <a href="/" data-link>Home</a>
            <span>/</span>
            <span>Courses</span>
          </div>
        </div>
      </section>

      <!-- Main Courses Section -->
      <section class="section section-light">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Academic Curriculum</span>
            <h2 class="section-title">Undergraduate, Postgraduate & Doctoral Degrees</h2>
            <p class="section-subtitle">
              Savitribai Phule Pune University (SPPU) affiliated programmes with industry-driven syllabi, experiential lab exercises, and global research standards.
            </p>
          </div>

          <!-- Filter & Search Controls Bar -->
          <div class="filter-search-bar">
            <!-- Filter Pills -->
            <div class="filter-pills" id="course-filter-pills">
              <button class="filter-pill-btn active" data-filter="ALL">All Programs</button>
              <button class="filter-pill-btn" data-filter="UG">Undergraduate (B.Tech)</button>
              <button class="filter-pill-btn" data-filter="PG">Postgraduate (M.Tech)</button>
              <button class="filter-pill-btn" data-filter="PhD">Doctoral (Ph.D.)</button>
            </div>

            <!-- Search Input -->
            <div class="search-input-wrap">
              <span class="search-icon-inside">🔍</span>
              <input
                type="text"
                id="course-search-input"
                class="search-input"
                placeholder="Search courses by name or department..."
                value="${searchQuery}"
              />
            </div>
          </div>

          <!-- Dynamic Courses Container -->
          <div id="courses-results-container">
            ${renderCoursesGrid(courses, activeFilter, searchQuery)}
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Generates the Courses Grid based on filter criteria
   */
  function renderCoursesGrid(courses, filter, query) {
    let filtered = courses;

    // Filter by Degree Level
    if (filter !== 'ALL') {
      filtered = filtered.filter(c => c.degreeLevel.toUpperCase() === filter.toUpperCase());
    }

    // Filter by search query
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.departmentName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      return `
        <div style="text-align: center; padding: 4rem 1rem; background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">🔍</div>
          <h3 style="font-size: 1.3rem; color: var(--primary-navy); margin-bottom: 0.5rem;">No Courses Found</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            No programs match your current filter or search criteria "${query}". Try adjusting your keywords.
          </p>
        </div>
      `;
    }

    return `
      <div style="margin-bottom: 1.25rem; font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">
        Showing ${filtered.length} of ${courses.length} academic courses
      </div>
      <div class="courses-grid">
        ${filtered.map(course => renderCourseCard(course)).join('')}
      </div>
    `;
  }

  /**
   * Generates a single Course Card HTML
   */
  function renderCourseCard(course) {
    return `
      <div class="course-card">
        <div class="course-card-header">
          <span class="course-degree-badge">${course.degreeType}</span>
          <span class="course-dept-tag">${course.duration}</span>
        </div>
        <h3 class="course-title">${course.name}</h3>
        <p class="course-desc">${course.description}</p>

        <div class="course-meta-list">
          <div class="course-meta-row">
            <span class="course-meta-label">Department:</span>
            <span class="course-meta-val">${course.departmentName}</span>
          </div>
          <div class="course-meta-row">
            <span class="course-meta-label">Annual Intake:</span>
            <span class="course-meta-val">${course.intake} Seats</span>
          </div>
          <div class="course-meta-row">
            <span class="course-meta-label">Tuition Fee:</span>
            <span class="course-meta-val" style="color: var(--secondary-blue);">${course.feesPerYear}</span>
          </div>
        </div>

        <div style="background: var(--bg-light); padding: 0.75rem 1rem; border-radius: var(--radius-sm); margin-bottom: 1.5rem; font-size: 0.82rem; color: var(--text-secondary);">
          <strong>Eligibility:</strong> ${course.eligibility}
        </div>

        <div style="margin-top: auto; display: flex; gap: 0.75rem;">
          <button
            class="btn btn-outline btn-sm"
            style="flex: 1;"
            onclick="window.CoursesModule.showDetails('${course.id}')"
          >
            Course Syllabus Details
          </button>
          <a href="/contact" data-link class="btn btn-primary btn-sm">
            Enquire
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Initializes event listeners on the Courses Page after rendering
   */
  function initEvents() {
    const filterButtons = document.querySelectorAll('#course-filter-pills .filter-pill-btn');
    const searchInput = document.getElementById('course-search-input');
    const container = document.getElementById('courses-results-container');

    // Filter button clicks
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.getAttribute('data-filter');

        if (container && coursesCache) {
          container.innerHTML = renderCoursesGrid(coursesCache, activeFilter, searchQuery);
        }
      });
    });

    // Search input typing (debounced)
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (container && coursesCache) {
          container.innerHTML = renderCoursesGrid(coursesCache, activeFilter, searchQuery);
        }
      });
    }
  }

  /**
   * Opens dynamic modal with rich course details
   */
  async function showDetails(courseId) {
    const courses = await fetchCourses();
    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    const modalBody = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem;">
        <div>
          <span class="course-degree-badge">${course.degreeType}</span>
          <h3 style="font-size: 1.5rem; color: var(--primary-navy); margin-top: 0.5rem; font-weight: 800;">
            ${course.name}
          </h3>
          <p style="color: var(--secondary-blue); font-weight: 600; font-size: 0.95rem;">
            Affiliated to Savitribai Phule Pune University (SPPU)
          </p>
        </div>

        <p style="color: var(--text-secondary); line-height: 1.6;">
          ${course.description}
        </p>

        <!-- Details Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; background: var(--bg-light); padding: 1.25rem; border-radius: var(--radius-md);">
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">DURATION</div>
            <div style="font-weight: 700; color: var(--primary-navy);">${course.duration}</div>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">SANCTIONED INTAKE</div>
            <div style="font-weight: 700; color: var(--primary-navy);">${course.intake} Students</div>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">DEPARTMENT</div>
            <div style="font-weight: 700; color: var(--primary-navy);">${course.departmentName}</div>
          </div>
          <div>
            <div style="font-size: 0.8rem; color: var(--text-muted); font-weight: 600;">FEES STRUCTURE</div>
            <div style="font-weight: 700; color: var(--secondary-blue);">${course.feesPerYear}</div>
          </div>
        </div>

        <!-- Eligibility -->
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--primary-navy); margin-bottom: 0.4rem;">
            Eligibility & Admission Criteria
          </h4>
          <p style="font-size: 0.9rem; color: var(--text-secondary); line-height: 1.5; background: #EFF6FF; padding: 0.85rem; border-radius: var(--radius-sm); border-left: 4px solid var(--secondary-blue);">
            ${course.eligibility}
          </p>
        </div>

        <!-- Key Curriculum Highlights -->
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--primary-navy); margin-bottom: 0.5rem;">
            Key Curriculum Highlights
          </h4>
          <ul style="display: flex; flex-direction: column; gap: 0.4rem;">
            ${course.highlights.map(h => `
              <li style="display: flex; gap: 0.5rem; font-size: 0.9rem; color: var(--text-secondary);">
                <span style="color: var(--color-success); font-weight: bold;">✔</span>
                <span>${h}</span>
              </li>
            `).join('')}
          </ul>
        </div>

        <!-- Career Paths -->
        <div>
          <h4 style="font-size: 1.05rem; font-weight: 700; color: var(--primary-navy); margin-bottom: 0.5rem;">
            Graduate Career Prospects
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
            ${course.careerPaths.map(cp => `
              <span style="background: var(--bg-light); color: var(--primary-navy); border: 1px solid var(--border-light); font-size: 0.82rem; font-weight: 600; padding: 0.3rem 0.75rem; border-radius: var(--radius-full);">
                💼 ${cp}
              </span>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    if (window.app && typeof window.app.openModal === 'function') {
      window.app.openModal('Program Details', modalBody);
    }
  }

  return {
    fetchCourses,
    renderCoursesPage,
    initEvents,
    showDetails
  };
})();

window.CoursesModule = CoursesModule;
