/**
 * ============================================================================
 * DEPARTMENTS MODULE (js/departments.js)
 * D. Y. Patil College of Engineering, Akurdi - Web Technology 1 (CCE-5)
 * ============================================================================
 *
 * Concepts Demonstrated for Viva:
 * 1. Fetch API to asynchronously retrieve JSON data from `data/departments.json`
 * 2. In-memory caching of fetched JSON data to optimize network requests
 * 3. Dynamic DOM generation for Department Cards and Detailed Views
 * 4. Dynamic sub-route handling (`/departments/:id`) with parametric navigation
 * 5. Robust error handling with user-friendly retry states
 * ============================================================================
 */

const DepartmentsModule = (function () {
  // In-memory cache for departments data
  let departmentsCache = null;

  /**
   * Fetches departments data from data/departments.json
   * @returns {Promise<Array>} List of departments
   */
  async function fetchDepartments() {
    if (departmentsCache) {
      return departmentsCache;
    }

    try {
      const response = await fetch('data/departments.json');
      if (!response.ok) {
        throw new Error(`HTTP Error: Failed to fetch departments. Status: ${response.status}`);
      }
      departmentsCache = await response.json();
      return departmentsCache;
    } catch (error) {
      console.warn('[DepartmentsModule] Fetch encounter:', error.message);
      if (window.DYPCOE_DATA && window.DYPCOE_DATA.departments) {
        console.info('[DepartmentsModule] Utilizing fallback data registry for file:// compatibility.');
        departmentsCache = window.DYPCOE_DATA.departments;
        return departmentsCache;
      }
      throw error;
    }
  }

  /**
   * Renders the main Departments Listing Page (/departments)
   */
  async function renderDepartmentsPage() {
    const departments = await fetchDepartments();

    return `
      <!-- Page Banner -->
      <section class="page-banner">
        <div class="container">
          <h1 class="page-banner-title">Academic Departments</h1>
          <div class="page-banner-breadcrumb">
            <a href="/" data-link>Home</a>
            <span>/</span>
            <span>Departments</span>
          </div>
        </div>
      </section>

      <!-- Departments Grid Section -->
      <section class="section section-light">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Centres of Excellence</span>
            <h2 class="section-title">Explore Engineering Branches</h2>
            <p class="section-subtitle">
              DYPCOE offers NBA-accredited, industry-aligned engineering degree programs equipped with cutting-edge research labs, experienced faculty, and global career opportunities.
            </p>
          </div>

          <div class="departments-grid">
            ${departments.map(dept => renderDepartmentCard(dept)).join('')}
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Generates HTML markup for a single Department Card
   * @param {Object} dept - Department data object
   */
  function renderDepartmentCard(dept) {
    return `
      <div class="dept-card">
        <div class="dept-card-image-wrap">
          <img src="${dept.image}" alt="${dept.name}" class="dept-card-image" loading="lazy" />
          <span class="dept-card-badge">${dept.code} • ESTD ${dept.establishedYear}</span>
          <span class="dept-card-intake">Intake: ${dept.intake}</span>
        </div>
        <div class="dept-card-body">
          <h3 class="dept-card-title">${dept.name}</h3>
          <p class="dept-card-desc">${dept.shortDesc}</p>
          <div class="dept-card-meta">
            <span style="font-size: 0.82rem; color: var(--text-muted); font-weight: 600;">
              Labs: ${dept.laboratories ? dept.laboratories.length : 3}+
            </span>
            <a href="/departments/${dept.id}" data-link class="btn btn-outline btn-sm">
              View Details →
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Renders the Department Overview section for the Home Page
   */
  async function renderHomeOverview() {
    try {
      const departments = await fetchDepartments();
      // Show first 6 departments
      return departments.slice(0, 6).map(dept => renderDepartmentCard(dept)).join('');
    } catch (error) {
      return `<p style="text-align: center; color: var(--text-muted);">Unable to load department overview.</p>`;
    }
  }

  /**
   * Renders a Single Department Detail View (/departments/:id)
   * @param {Object} params - URL route params, containing { id: 'aids' | 'comp' | ... }
   */
  async function renderDepartmentDetail(params) {
    const deptId = params.id;
    const departments = await fetchDepartments();
    const dept = departments.find(d => d.id === deptId);

    if (!dept) {
      return `
        <section class="section">
          <div class="container" style="text-align: center; padding: 4rem 1rem;">
            <h2>Department Not Found</h2>
            <p style="margin: 1rem 0 2rem 0; color: var(--text-muted);">
              The department '${deptId}' could not be identified in the records.
            </p>
            <a href="/departments" data-link class="btn btn-primary">Back to Departments</a>
          </div>
        </section>
      `;
    }

    return `
      <!-- Department Detail Hero -->
      <section class="dept-detail-hero">
        <div class="container">
          <a href="/departments" data-link class="dept-back-link">
            ← Back to All Departments
          </a>
          <div class="dept-detail-header">
            <div>
              <span class="section-badge section-badge-white">Code: ${dept.code}</span>
              <h1 class="dept-detail-title">Department of ${dept.name}</h1>
              <p style="color: #CBD5E1; font-size: 1.1rem; max-width: 680px; line-height: 1.6;">
                ${dept.shortDesc}
              </p>
            </div>
            <div class="dept-detail-stats">
              <div class="dept-stat-item">
                <span class="dept-stat-num">${dept.intake}</span>
                <span class="dept-stat-lbl">Annual Intake</span>
              </div>
              <div class="dept-stat-item">
                <span class="dept-stat-num">${dept.establishedYear}</span>
                <span class="dept-stat-lbl">Established</span>
              </div>
              <div class="dept-stat-item">
                <span class="dept-stat-num">${dept.laboratories ? dept.laboratories.length : 3}</span>
                <span class="dept-stat-lbl">Modern Labs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Department Detail Content Layout -->
      <section class="section section-light">
        <div class="container">
          <div class="dept-detail-layout">
            <!-- Left Main Column -->
            <div class="dept-main-col">
              <!-- Overview Block -->
              <div class="dept-section-block">
                <h3 class="dept-block-title">Department Overview</h3>
                <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.5rem;">
                  ${dept.longDesc}
                </p>

                <!-- Vision & Mission -->
                <div style="display: grid; grid-template-columns: 1fr; gap: 1.25rem; margin-top: 1.5rem;">
                  <div style="background: var(--bg-light); padding: 1.25rem; border-left: 4px solid var(--secondary-blue); border-radius: var(--radius-sm);">
                    <h4 style="color: var(--primary-navy); margin-bottom: 0.35rem; font-weight: 700;">Department Vision</h4>
                    <p style="color: var(--text-secondary); font-size: 0.95rem;">${dept.vision}</p>
                  </div>
                  <div style="background: var(--bg-light); padding: 1.25rem; border-left: 4px solid var(--accent-gold); border-radius: var(--radius-sm);">
                    <h4 style="color: var(--primary-navy); margin-bottom: 0.5rem; font-weight: 700;">Department Mission</h4>
                    <ul style="display: flex; flex-direction: column; gap: 0.4rem;">
                      ${dept.mission.map(m => `
                        <li style="display: flex; gap: 0.5rem; color: var(--text-secondary); font-size: 0.93rem;">
                          <span style="color: var(--accent-gold); font-weight: bold;">•</span>
                          <span>${m}</span>
                        </li>
                      `).join('')}
                    </ul>
                  </div>
                </div>
              </div>

              <!-- Laboratories & Facilities Block -->
              <div class="dept-section-block">
                <h3 class="dept-block-title">Specialized Laboratories & Infrastructure</h3>
                <p style="color: var(--text-muted); font-size: 0.92rem; margin-bottom: 1.25rem;">
                  Advanced hands-on learning environments equipped with modern hardware, computational servers, and licensed engineering software suites.
                </p>
                <div class="labs-grid">
                  ${dept.laboratories.map(lab => `
                    <div class="lab-card">
                      <h4 class="lab-name">${lab.name}</h4>
                      <p class="lab-equipment">Key Hardware / Software: ${lab.equipment}</p>
                      <p class="lab-desc">${lab.description}</p>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- Programs Offered Under Department -->
              <div class="dept-section-block">
                <h3 class="dept-block-title">Academic Programs Offered</h3>
                <ul style="display: flex; flex-direction: column; gap: 0.75rem;">
                  ${dept.coursesOffered.map(course => `
                    <li style="display: flex; align-items: center; justify-content: space-between; padding: 0.85rem 1rem; background: var(--bg-light); border-radius: var(--radius-md);">
                      <div style="display: flex; align-items: center; gap: 0.75rem;">
                        <span style="color: var(--color-success); font-weight: bold;">✔</span>
                        <strong style="color: var(--primary-navy); font-size: 0.95rem;">${course}</strong>
                      </div>
                      <a href="/courses" data-link class="btn btn-outline btn-sm">Explore Course</a>
                    </li>
                  `).join('')}
                </ul>
              </div>

              <!-- Key Achievements -->
              <div class="dept-section-block">
                <h3 class="dept-block-title">Student & Faculty Achievements</h3>
                <ul style="display: flex; flex-direction: column; gap: 0.65rem;">
                  ${dept.studentAchievements.map(ach => `
                    <li style="display: flex; gap: 0.65rem; color: var(--text-secondary); font-size: 0.93rem;">
                      <span style="color: var(--accent-gold); font-size: 1.1rem;">🏆</span>
                      <span>${ach}</span>
                    </li>
                  `).join('')}
                </ul>
              </div>
            </div>

            <!-- Right Sidebar Column -->
            <div class="dept-sidebar-col">
              <!-- HOD Profile Card -->
              <div class="hod-card">
                <img src="${dept.hod.photo}" alt="${dept.hod.name}" class="hod-photo" />
                <h4 class="hod-name">${dept.hod.name}</h4>
                <p class="hod-qualification">${dept.hod.qualification}</p>
                <span class="hod-designation">${dept.hod.designation}</span>
                <p style="font-size: 0.85rem; color: var(--secondary-blue); margin-bottom: 1rem;">
                  📧 ${dept.hod.email}
                </p>
                <div class="hod-message">
                  "${dept.hod.message}"
                </div>
              </div>

              <!-- Career Opportunities Card -->
              <div class="dept-section-block">
                <h4 style="font-size: 1.15rem; font-weight: 800; color: var(--primary-navy); margin-bottom: 1rem;">
                  Career Pathways
                </h4>
                <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
                  ${dept.careerOpportunities.map(career => `
                    <span style="background: var(--secondary-blue-light); color: var(--secondary-blue); font-size: 0.8rem; font-weight: 600; padding: 0.35rem 0.75rem; border-radius: var(--radius-full);">
                      ${career}
                    </span>
                  `).join('')}
                </div>
                <div style="margin-top: 1.75rem;">
                  <a href="/faculty" data-link class="btn btn-secondary btn-sm" style="width: 100%;">
                    Meet Department Faculty →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  // Public API
  return {
    fetchDepartments,
    renderDepartmentsPage,
    renderDepartmentDetail,
    renderHomeOverview
  };
})();

// Attach to window object for global module accessibility
window.DepartmentsModule = DepartmentsModule;
