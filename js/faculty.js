/**
 * ============================================================================
 * FACULTY DIRECTORY MODULE (js/faculty.js)
 * D. Y. Patil College of Engineering, Akurdi - Web Technology 1 (CCE-5)
 * ============================================================================
 *
 * Concepts Demonstrated for Viva:
 * 1. Fetch API loading dynamic profiles from `data/faculty.json`
 * 2. Multi-factor search & department filtering (department + keyword)
 * 3. Prominent labeling of sample academic data as required by the specification
 * 4. DOM generation for faculty directory cards and rich profile modal
 * ============================================================================
 */

const FacultyModule = (function () {
  let facultyCache = null;
  let activeDeptFilter = 'ALL';
  let searchQuery = '';

  /**
   * Fetches faculty records from data/faculty.json
   */
  async function fetchFaculty() {
    if (facultyCache) {
      return facultyCache;
    }

    try {
      const response = await fetch('data/faculty.json');
      if (!response.ok) {
        throw new Error(`HTTP Error: Failed to fetch faculty. Status: ${response.status}`);
      }
      facultyCache = await response.json();
      return facultyCache;
    } catch (error) {
      console.warn('[FacultyModule] Fetch encounter:', error.message);
      if (window.DYPCOE_DATA && window.DYPCOE_DATA.faculty) {
        console.info('[FacultyModule] Utilizing fallback data registry for file:// compatibility.');
        facultyCache = window.DYPCOE_DATA.faculty;
        return facultyCache;
      }
      throw error;
    }
  }

  /**
   * Renders the complete Faculty Directory Page (/faculty)
   */
  async function renderFacultyPage() {
    const faculty = await fetchFaculty();

    return `
      <!-- Page Banner -->
      <section class="page-banner">
        <div class="container">
          <h1 class="page-banner-title">Faculty Directory</h1>
          <div class="page-banner-breadcrumb">
            <a href="/" data-link>Home</a>
            <span>/</span>
            <span>Faculty</span>
          </div>
        </div>
      </section>

      <!-- Faculty Directory Section -->
      <section class="section section-light">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Distinguished Mentors</span>
            <h2 class="section-title">Our Professors & Research Guides</h2>
            <p class="section-subtitle">
              Learn from acclaimed academicians, Ph.D. scholars, patent holders, and industry consultants dedicated to nurturing future engineers.
            </p>
          </div>

          <!-- Academic Demonstration Disclaimer Banner -->
          <div class="faculty-disclaimer-banner">
            <span class="faculty-disclaimer-icon" style="font-size: 1.5rem;">ℹ️</span>
            <div>
              <strong>Sample Academic Demonstration:</strong>
              Faculty profiles displayed on this portal represent sample demonstration data for Web Technology 1 (CCE-5) Single Page Application evaluation. Official verified records can be validated at the DYPCOE administrative registrar office.
            </div>
          </div>

          <!-- Filter & Search Controls -->
          <div class="filter-search-bar">
            <!-- Department Dropdown / Filter -->
            <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
              <label for="faculty-dept-select" style="font-weight: 700; font-size: 0.9rem; color: var(--primary-navy);">
                Department:
              </label>
              <select id="faculty-dept-select" class="form-control" style="width: auto; min-width: 260px; padding: 0.5rem 1rem;">
                <option value="ALL">All Departments (All Branches)</option>
                <option value="aids">Artificial Intelligence & Data Science</option>
                <option value="comp">Computer Engineering</option>
                <option value="it">Information Technology</option>
                <option value="mech">Mechanical Engineering</option>
                <option value="civil">Civil Engineering</option>
                <option value="entc">Electronics & Telecommunication</option>
              </select>
            </div>

            <!-- Search Input -->
            <div class="search-input-wrap">
              <span class="search-icon-inside">🔍</span>
              <input
                type="text"
                id="faculty-search-input"
                class="search-input"
                placeholder="Search faculty by name, subject, or research..."
                value="${searchQuery}"
              />
            </div>
          </div>

          <!-- Dynamic Faculty Results Grid -->
          <div id="faculty-results-container">
            ${renderFacultyGrid(faculty, activeDeptFilter, searchQuery)}
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Generates the Faculty Cards Grid based on filters
   */
  function renderFacultyGrid(faculty, deptFilter, query) {
    let filtered = faculty;

    // Filter by Department
    if (deptFilter !== 'ALL') {
      filtered = filtered.filter(f => f.departmentId.toLowerCase() === deptFilter.toLowerCase());
    }

    // Filter by Search Query
    if (query && query.trim() !== '') {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(f =>
        f.name.toLowerCase().includes(q) ||
        f.designation.toLowerCase().includes(q) ||
        f.department.toLowerCase().includes(q) ||
        f.specialization.toLowerCase().includes(q) ||
        f.qualification.toLowerCase().includes(q)
      );
    }

    if (filtered.length === 0) {
      return `
        <div style="text-align: center; padding: 4rem 1rem; background: #FFFFFF; border-radius: var(--radius-lg); border: 1px solid var(--border-light);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">👨‍🏫</div>
          <h3 style="font-size: 1.3rem; color: var(--primary-navy); margin-bottom: 0.5rem;">No Faculty Members Found</h3>
          <p style="color: var(--text-muted); font-size: 0.95rem;">
            No faculty profiles match your selected department or search keywords. Please adjust your criteria.
          </p>
        </div>
      `;
    }

    return `
      <div style="margin-bottom: 1.25rem; font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">
        Showing ${filtered.length} faculty profiles
      </div>
      <div class="faculty-grid">
        ${filtered.map(f => renderFacultyCard(f)).join('')}
      </div>
    `;
  }

  /**
   * Generates HTML markup for an individual Faculty Card
   */
  function renderFacultyCard(f) {
    return `
      <div class="faculty-card">
        <div class="faculty-photo-wrap">
          <img src="${f.photo}" alt="${f.name}" class="faculty-photo" loading="lazy" />
          <span class="faculty-sample-tag">Sample Profile</span>
        </div>
        <div class="faculty-body">
          <h3 class="faculty-name">${f.name}</h3>
          <div class="faculty-designation">${f.designation}</div>
          <div class="faculty-department">${f.department}</div>
          <div class="faculty-qual">${f.qualification}</div>

          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin-bottom: 1rem; text-align: left;">
            <strong>Expertise:</strong> ${f.specialization}
          </p>

          <div class="faculty-btn-wrap">
            <button
              class="btn btn-outline btn-sm"
              style="width: 100%;"
              onclick="window.FacultyModule.showProfile('${f.id}')"
            >
              View Full Profile →
            </button>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Initializes event listeners for search and dropdown
   */
  function initEvents() {
    const deptSelect = document.getElementById('faculty-dept-select');
    const searchInput = document.getElementById('faculty-search-input');
    const container = document.getElementById('faculty-results-container');

    if (deptSelect) {
      deptSelect.value = activeDeptFilter;
      deptSelect.addEventListener('change', (e) => {
        activeDeptFilter = e.target.value;
        if (container && facultyCache) {
          container.innerHTML = renderFacultyGrid(facultyCache, activeDeptFilter, searchQuery);
        }
      });
    }

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (container && facultyCache) {
          container.innerHTML = renderFacultyGrid(facultyCache, activeDeptFilter, searchQuery);
        }
      });
    }
  }

  /**
   * Displays full faculty profile modal
   */
  async function showProfile(facultyId) {
    const faculty = await fetchFaculty();
    const f = faculty.find(item => item.id === facultyId);
    if (!f) return;

    const modalBody = `
      <div style="display: flex; gap: 1.5rem; flex-wrap: wrap; align-items: flex-start;">
        <img
          src="${f.photo}"
          alt="${f.name}"
          style="width: 130px; height: 130px; border-radius: var(--radius-md); object-fit: cover; box-shadow: var(--shadow-md); border: 3px solid var(--secondary-blue-light);"
        />
        <div style="flex: 1; min-width: 250px;">
          <span style="background: #FEF3C7; color: #92400E; font-size: 0.72rem; font-weight: 700; padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); border: 1px solid #FCD34D;">
            Sample Verified Faculty Profile
          </span>
          <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--primary-navy); margin-top: 0.35rem;">
            ${f.name}
          </h3>
          <div style="color: var(--secondary-blue); font-weight: 700; font-size: 0.95rem;">
            ${f.designation}
          </div>
          <div style="color: var(--text-muted); font-size: 0.88rem;">
            Department of ${f.department}
          </div>
          <div style="font-size: 0.88rem; margin-top: 0.35rem; color: var(--primary-navy);">
            🎓 <strong>${f.qualification}</strong>
          </div>
          <div style="font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.2rem;">
            ⏳ <strong>Academic Experience:</strong> ${f.experience}
          </div>
        </div>
      </div>

      <hr style="margin: 1.25rem 0; border: none; border-top: 1px solid var(--border-light);" />

      <div style="display: flex; flex-direction: column; gap: 1rem;">
        <div>
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary-navy); margin-bottom: 0.35rem;">
            Biography & Research Background
          </h4>
          <p style="font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
            ${f.shortBio}
          </p>
        </div>

        <div style="background: var(--bg-light); padding: 1rem; border-radius: var(--radius-md); display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
          <div>
            <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">RESEARCH INTERESTS</div>
            <div style="font-size: 0.88rem; font-weight: 700; color: var(--primary-navy);">${f.specialization}</div>
          </div>
          <div>
            <div style="font-size: 0.78rem; color: var(--text-muted); font-weight: 600;">RESEARCH PUBLICATIONS</div>
            <div style="font-size: 0.88rem; font-weight: 700; color: var(--secondary-blue);">${f.publicationsCount}+ Scopus / IEEE Papers</div>
          </div>
        </div>

        <div>
          <h4 style="font-size: 0.95rem; font-weight: 700; color: var(--primary-navy); margin-bottom: 0.35rem;">
            Subjects & Courses Handled
          </h4>
          <div style="display: flex; flex-wrap: wrap; gap: 0.4rem;">
            ${f.coursesHandled.map(c => `
              <span style="background: var(--secondary-blue-light); color: var(--secondary-blue); font-size: 0.82rem; font-weight: 600; padding: 0.25rem 0.65rem; border-radius: var(--radius-full);">
                📘 ${c}
              </span>
            `).join('')}
          </div>
        </div>

        <div style="font-size: 0.88rem; color: var(--text-secondary);">
          <strong>Official Contact:</strong> <a href="mailto:${f.email}">${f.email}</a>
        </div>
      </div>
    `;

    if (window.app && typeof window.app.openModal === 'function') {
      window.app.openModal('Faculty Profile Details', modalBody);
    }
  }

  return {
    fetchFaculty,
    renderFacultyPage,
    initEvents,
    showProfile
  };
})();

window.FacultyModule = FacultyModule;
