/**
 * ============================================================================
 * MAIN APPLICATION MODULE (js/app.js)
 * D. Y. Patil College of Engineering, Akurdi - Web Technology 1 (CCE-5)
 * Unit V: Single Page Application (SPA) Concepts
 * ============================================================================
 *
 * Concepts Demonstrated for Viva:
 * 1. Single Page Application Architecture:
 *    - Route registration mapping paths to asynchronous view generators
 *    - HTML5 History API (`pushState`, `popstate`)
 *    - Intercepting links to prevent page refreshes
 * 2. Asynchronous dynamic content loading (Fetch API + JSON)
 * 3. Modal and Toast notification global controller
 * 4. Responsive mobile menu & scroll interactions
 * 5. Interactive Viva Help Sheet for examiners
 * ============================================================================
 */

class App {
  constructor() {
    this.modalBackdrop = document.getElementById('global-modal');
    this.modalTitle = document.getElementById('modal-title');
    this.modalBody = document.getElementById('modal-body');
    this.toastContainer = document.getElementById('toast-container');
    this.menuToggle = document.getElementById('menu-toggle');
    this.mobileDrawer = document.getElementById('mobile-drawer');
    this.mobileBackdrop = document.getElementById('mobile-backdrop');
    this.backToTopBtn = document.getElementById('back-to-top');

    this.initUIListeners();
    this.registerRoutes();
  }

  /**
   * Initializes global UI event listeners
   */
  initUIListeners() {
    // Header shadow on scroll
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (header) {
        if (window.scrollY > 30) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      // Back to top visibility
      if (this.backToTopBtn) {
        if (window.scrollY > 350) {
          this.backToTopBtn.classList.add('visible');
        } else {
          this.backToTopBtn.classList.remove('visible');
        }
      }
    });

    // Back to top click
    if (this.backToTopBtn) {
      this.backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Mobile Hamburger Menu
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.toggleMobileNav());
    }
    if (this.mobileBackdrop) {
      this.mobileBackdrop.addEventListener('click', () => this.closeMobileNav());
    }

    // Modal Close Button & Backdrop click
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => this.closeModal());
    }
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.modalBackdrop) {
          this.closeModal();
        }
      });
    }

    // Escape key closes modal & mobile nav
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        this.closeMobileNav();
      }
    });
  }

  /**
   * Mobile navigation drawer toggles
   */
  toggleMobileNav() {
    if (!this.mobileDrawer) return;
    const isOpen = this.mobileDrawer.classList.contains('open');
    if (isOpen) {
      this.closeMobileNav();
    } else {
      this.openMobileNav();
    }
  }

  openMobileNav() {
    if (this.menuToggle) this.menuToggle.classList.add('active');
    if (this.mobileDrawer) this.mobileDrawer.classList.add('open');
    if (this.mobileBackdrop) this.mobileBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  closeMobileNav() {
    if (this.menuToggle) this.menuToggle.classList.remove('active');
    if (this.mobileDrawer) this.mobileDrawer.classList.remove('open');
    if (this.mobileBackdrop) this.mobileBackdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  /**
   * Global Modal Controller
   */
  openModal(title, htmlContent) {
    if (this.modalTitle) this.modalTitle.textContent = title;
    if (this.modalBody) this.modalBody.innerHTML = htmlContent;
    if (this.modalBackdrop) {
      this.modalBackdrop.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeModal() {
    if (this.modalBackdrop) {
      this.modalBackdrop.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  /**
   * Global Toast Notification Controller
   * @param {string} message - Notification text
   * @param {string} type - 'success' | 'danger' | 'warning' | 'info'
   * @param {number} duration - Milliseconds before auto dismiss
   */
  showToast(message, type = 'info', duration = 4000) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    let title = 'Notification';
    if (type === 'success') {
      icon = '✅';
      title = 'Success';
    } else if (type === 'danger') {
      icon = '❌';
      title = 'Notice';
    } else if (type === 'warning') {
      icon = '⚠️';
      title = 'Warning';
    }

    toast.innerHTML = `
      <span class="toast-icon">${icon}</span>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease-out';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, duration);
  }

  /**
   * Registers all SPA routes with window.router
   */
  registerRoutes() {
    const router = window.router;
    if (!router) return;

    // Route: / (Home)
    router.addRoute('/', () => this.renderHomePage(), 'Home | D. Y. Patil College of Engineering, Akurdi');
    router.addRoute('/home', () => this.renderHomePage(), 'Home | D. Y. Patil College of Engineering, Akurdi');

    // Route: /about
    router.addRoute('/about', () => this.renderAboutPage(), 'About Us | D. Y. Patil College of Engineering, Akurdi');

    // Route: /departments
    router.addRoute(
      '/departments',
      () => window.DepartmentsModule.renderDepartmentsPage(),
      'Academic Departments | DYPCOE Pune'
    );

    // Route: /departments/:id (Dynamic parameter)
    router.addRoute(
      '/departments/:id',
      (params) => window.DepartmentsModule.renderDepartmentDetail(params),
      'Department Details | DYPCOE Pune'
    );

    // Route: /courses
    router.routes.push({
      path: '/courses',
      view: () => window.CoursesModule.renderCoursesPage(),
      title: 'Engineering Courses | DYPCOE Pune',
      regex: router.pathToRegex('/courses'),
      afterRender: () => window.CoursesModule.initEvents()
    });

    // Route: /faculty
    router.routes.push({
      path: '/faculty',
      view: () => window.FacultyModule.renderFacultyPage(),
      title: 'Faculty Directory | DYPCOE Pune',
      regex: router.pathToRegex('/faculty'),
      afterRender: () => window.FacultyModule.initEvents()
    });

    // Route: /notices
    router.routes.push({
      path: '/notices',
      view: () => window.NoticesModule.renderNoticesPage(),
      title: 'Notice Board & Circulars | DYPCOE Pune',
      regex: router.pathToRegex('/notices'),
      afterRender: () => window.NoticesModule.initEvents()
    });

    // Route: /contact
    router.routes.push({
      path: '/contact',
      view: () => window.ValidationModule.renderContactPage(),
      title: 'Contact & Admissions | DYPCOE Pune',
      regex: router.pathToRegex('/contact'),
      afterRender: () => window.ValidationModule.initEvents()
    });
  }

  /**
   * Generates markup for the comprehensive Home Page
   */
  async renderHomePage() {
    const departmentsOverviewHTML = await window.DepartmentsModule.renderHomeOverview();
    const noticesWidgetHTML = await window.NoticesModule.renderHomeNotices();

    return `
      <!-- 1. Hero Section -->
      <section class="hero-section">
        <div class="container">
          <div class="hero-grid">
            <div class="hero-content">
              <div class="hero-pill">
                <span>🏛️ Dr. D. Y. Patil Pratishthan's</span>
                <span>•</span>
                <span>NAAC 'A' Accredited</span>
                <span>•</span>
                <span>SPPU Affiliated</span>
              </div>
              <h1 class="hero-title">
                Building Future Through <br />
                <span class="highlight">Innovation & Excellence</span>
              </h1>
              <p class="hero-description">
                Dr. D. Y. Patil College of Engineering, Akurdi, Pune (Estd. 1984) is approved by AICTE, affiliated with Savitribai Phule Pune University, and recognized by DTE Maharashtra (Code: 6272). Empowering students with outcome-based engineering education and high-impact industrial exposure.
              </p>
              <div class="hero-buttons">
                <a href="/departments" data-link class="btn btn-gold btn-lg">
                  Explore Departments →
                </a>
                <a href="/contact" data-link class="btn btn-outline-white btn-lg">
                  Admissions & Enquiry
                </a>
                <button onclick="window.app.showVivaGuide()" class="btn btn-sm" style="color: #FCD34D; border: 1px dashed rgba(251, 191, 36, 0.5); border-radius: var(--radius-sm); margin-left: 0.5rem;">
                  💡 Viva Guide
                </button>
              </div>
            </div>

            <!-- Campus Entrance Showcase Card -->
            <div class="hero-campus-card">
              <img
                src="assets/images/campus-gate.jpg"
                alt="D. Y. Patil Akurdi Campus Entrance Gate"
                class="hero-campus-img"
              />
              <div class="hero-campus-badge">
                <div class="hero-campus-title">Dr. D. Y. Patil Educational Complex</div>
                <div class="hero-campus-subtitle">Main Campus Entrance Gate • Sector 29, Nigdi Pradhikaran, Akurdi, Pune</div>
              </div>
            </div>
          </div>

          <!-- Hero Stats Bar -->
          <div class="hero-stats-grid">
            <div class="hero-stat-card">
              <span class="hero-stat-number">40+</span>
              <span class="hero-stat-label">Years of Academic Legacy</span>
            </div>
            <div class="hero-stat-card">
              <span class="hero-stat-number">1080+</span>
              <span class="hero-stat-label">Annual Engineering Intake</span>
            </div>
            <div class="hero-stat-card">
              <span class="hero-stat-number">43 LPA</span>
              <span class="hero-stat-label">Highest Campus Package</span>
            </div>
            <div class="hero-stat-card">
              <span class="hero-stat-number">15,000+</span>
              <span class="hero-stat-label">Global Alumni Network</span>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Welcome / About College Snippet -->
      <section class="section">
        <div class="container">
          <div class="welcome-grid">
            <div class="welcome-image-stack">
              <img
                src="assets/images/campus-gate.jpg"
                alt="Dr. D. Y. Patil College of Engineering Akurdi Campus"
                class="welcome-img-main"
                loading="lazy"
              />
              <div class="welcome-badge-float">
                <div class="welcome-badge-icon">🏆</div>
                <div>
                  <div class="welcome-badge-title">Grade 'A'</div>
                  <div class="welcome-badge-text">NAAC Accredited • DTE Code: 6272</div>
                </div>
              </div>
            </div>

            <div class="welcome-content">
              <span class="section-badge">Welcome to DYPCOE</span>
              <h2 class="section-title">A Heritage of Engineering Leadership in Pune</h2>
              <p class="lead">
                Transforming ambitious young minds into globally competitive technocrats, innovators, and entrepreneurs since 1984.
              </p>
              <p>
                Situated in the bustling industrial corridor of Pimpri-Chinchwad, Pune, Dr. D. Y. Patil College of Engineering offers students direct proximity to leading automotive, IT, and manufacturing hubs like Tata Motors, Infosys, and Bharat Forge.
              </p>

              <!-- Principal Desk Highlight -->
              <div style="background: var(--bg-light); border-left: 4px solid var(--secondary-blue); padding: 1rem 1.25rem; border-radius: var(--radius-sm); margin: 1.25rem 0;">
                <div style="font-weight: 700; color: var(--primary-navy); font-size: 0.95rem;">From the Principal's Desk:</div>
                <p style="font-size: 0.9rem; color: var(--text-secondary); font-style: italic; margin-top: 0.35rem;">
                  "We are dedicated to preparing engineers with strong fundamentals, creative problem-solving abilities, and high ethical standards, bridging academia and industry in the heart of Pune's automotive and IT corridor."
                </p>
                <div style="font-size: 0.82rem; font-weight: 700; color: var(--secondary-blue); margin-top: 0.4rem;">
                  — Dr. Mrs. P. Malathi, Principal, DYPCOE Akurdi
                </div>
              </div>

              <div class="feature-checklist">
                <div class="feature-check-item">
                  <span class="check-icon">✔</span> Savitribai Phule Pune University
                </div>
                <div class="feature-check-item">
                  <span class="check-icon">✔</span> NBA Accredited Departments
                </div>
                <div class="feature-check-item">
                  <span class="check-icon">✔</span> AICTE Approved Institution
                </div>
                <div class="feature-check-item">
                  <span class="check-icon">✔</span> DTE Institute Code: 6272
                </div>
                <div class="feature-check-item">
                  <span class="check-icon">✔</span> NVIDIA & AWS AI Innovation Labs
                </div>
                <div class="feature-check-item">
                  <span class="check-icon">✔</span> 100% Placement Assistance Cell
                </div>
              </div>

              <div style="margin-top: 1.5rem;">
                <a href="/about" data-link class="btn btn-primary">
                  Learn More About College →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Academic Highlights Section -->
      <section class="section section-light">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Academic Highlights</span>
            <h2 class="section-title">Designed for Modern Engineering</h2>
            <p class="section-subtitle">
              Our campus blends rigorous university curriculum with industrial certifications, research opportunities, and startup incubation.
            </p>
          </div>

          <div class="highlights-grid">
            <div class="highlight-card">
              <div class="highlight-icon-box">🧠</div>
              <h3 class="highlight-title">AI & Cognitive Computing</h3>
              <p class="highlight-text">
                Dedicated GPU workstation clusters powering machine learning, computer vision, natural language processing, and generative AI research.
              </p>
            </div>

            <div class="highlight-card">
              <div class="highlight-icon-box">🏢</div>
              <h3 class="highlight-title">Industry Hub Synergies</h3>
              <p class="highlight-text">
                Strategic industrial location in PCMC offering internships, live client capstone projects, and mentorship with over 150+ corporate partners.
              </p>
            </div>

            <div class="highlight-card">
              <div class="highlight-icon-box">🔬</div>
              <h3 class="highlight-title">Advanced Research Centres</h3>
              <p class="highlight-text">
                Recognized Ph.D. research centres affiliated with SPPU, equipped with Cadence EDA suites, ANSYS simulation tools, and material testing labs.
              </p>
            </div>

            <div class="highlight-card">
              <div class="highlight-icon-box">🚀</div>
              <h3 class="highlight-title">Innovation & Startup Cell</h3>
              <p class="highlight-text">
                Active incubation centre fostering student entrepreneurship, patent filing support, seed funding access, and national hackathon sponsorships.
              </p>
            </div>

            <div class="highlight-card">
              <div class="highlight-icon-box">📚</div>
              <h3 class="highlight-title">Digital Knowledge Centre</h3>
              <p class="highlight-text">
                Fully automated Central Library housing 52,000+ volumes, IEEE/ACM digital repository access, national and international journal archives.
              </p>
            </div>

            <div class="highlight-card">
              <div class="highlight-icon-box">🌍</div>
              <h3 class="highlight-title">Global Placement Records</h3>
              <p class="highlight-text">
                Tier-1 software and core engineering firms recruit on campus annually with packages reaching up to 43 LPA and average package of 6.8 LPA.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Departments Overview Section -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Engineering Disciplines</span>
            <h2 class="section-title">Departments Overview</h2>
            <p class="section-subtitle">
              Choose from 6 premier engineering branches tailored to future industry requirements.
            </p>
          </div>

          <div class="departments-grid">
            ${departmentsOverviewHTML}
          </div>

          <div style="text-align: center; margin-top: 3rem;">
            <a href="/departments" data-link class="btn btn-secondary btn-lg">
              View All Department Details & Labs →
            </a>
          </div>
        </div>
      </section>

      <!-- 5. Latest Notices Section -->
      <section class="section section-light">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Campus Updates</span>
            <h2 class="section-title">Latest Notices & Circulars</h2>
            <p class="section-subtitle">
              Live bulletin board for examinations, academic deadlines, technical festivals, and administrative circulars.
            </p>
          </div>

          <div class="notices-grid">
            ${noticesWidgetHTML}
          </div>

          <div style="text-align: center; margin-top: 2.5rem;">
            <a href="/notices" data-link class="btn btn-outline btn-lg">
              View Complete Notice Board →
            </a>
          </div>
        </div>
      </section>

      <!-- 6. Why Choose Us Section -->
      <section class="section section-navy-dark">
        <div class="container">
          <div class="section-header">
            <span class="section-badge section-badge-white">Why DYPCOE</span>
            <h2 class="section-title" style="color: #FFFFFF;">Why Choose D. Y. Patil Akurdi?</h2>
            <p class="section-subtitle">
              Here is why thousands of aspiring engineers from across Maharashtra and India choose DYPCOE every academic year.
            </p>
          </div>

          <div class="why-grid">
            <div class="why-card">
              <div class="why-icon">🏅</div>
              <h3 class="why-title">NAAC 'A+' & NBA Accreditations</h3>
              <p class="why-desc">
                High educational quality benchmarks verified by national accrediting councils ensuring valid degree recognition worldwide.
              </p>
            </div>

            <div class="why-card">
              <div class="why-icon">💡</div>
              <h3 class="why-title">Experiential Learning</h3>
              <p class="why-desc">
                Focus on project-based learning, hackathons, open-source development, and laboratory experimentation from first year itself.
              </p>
            </div>

            <div class="why-card">
              <div class="why-icon">🚗</div>
              <h3 class="why-title">BAJA & Formula Racing Teams</h3>
              <p class="why-desc">
                Renowned student automotive squads (Team Predators Racing) consistently scoring top podium positions at national SAE BAJA events.
              </p>
            </div>

            <div class="why-card">
              <div class="why-icon">🌐</div>
              <h3 class="why-title">Industry 4.0 Center of Excellence</h3>
              <p class="why-desc">
                Direct MoUs with global leaders: Intel, AWS Academy, Red Hat, Capgemini, Bosch, and Tata Technologies.
              </p>
            </div>

            <div class="why-card">
              <div class="why-icon">👥</div>
              <h3 class="why-title">Renowned Ph.D. Faculty</h3>
              <p class="why-desc">
                Over 70+ doctorate holders and master researchers mentoring student publications in IEEE, Springer, and Scopus journals.
              </p>
            </div>

            <div class="why-card">
              <div class="why-icon">🎯</div>
              <h3 class="why-title">Robust Career Training</h3>
              <p class="why-desc">
                Dedicated soft-skills training, mock interview bootcamps, coding test simulations, and high-volume placement drives.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Campus Life Gallery -->
      <section class="section">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">Life At DYPCOE</span>
            <h2 class="section-title">Campus Life & Infrastructure</h2>
            <p class="section-subtitle">
              A vibrant 29-acre lush green campus designed for academic concentration, sports, cultural harmony, and personal development.
            </p>
          </div>

          <div class="gallery-grid">
            <div class="gallery-item" onclick="window.app.previewImage('D. Y. Patil Akurdi Campus Entrance Gate', 'assets/images/campus-gate.jpg')">
              <img src="assets/images/campus-gate.jpg" alt="D. Y. Patil Akurdi Campus Entrance Gate" loading="lazy" />
              <div class="gallery-overlay">
                <span class="gallery-category">Campus Landmark</span>
                <h4 class="gallery-title">Akurdi Campus Entrance Gate</h4>
              </div>
            </div>

            <div class="gallery-item" onclick="window.app.previewImage('AI & Computer Labs', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80')">
              <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80" alt="Computer Labs" loading="lazy" />
              <div class="gallery-overlay">
                <span class="gallery-category">Laboratories</span>
                <h4 class="gallery-title">Advanced Computing Lab</h4>
              </div>
            </div>

            <div class="gallery-item" onclick="window.app.previewImage('Central Digital Library', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80')">
              <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80" alt="Central Library" loading="lazy" />
              <div class="gallery-overlay">
                <span class="gallery-category">Library</span>
                <h4 class="gallery-title">Central Reference Library</h4>
              </div>
            </div>

            <div class="gallery-item" onclick="window.app.previewImage('Robotics & Automation Lab', 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80')">
              <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" alt="Robotics Lab" loading="lazy" />
              <div class="gallery-overlay">
                <span class="gallery-category">Engineering</span>
                <h4 class="gallery-title">Robotics & Mechatronics Lab</h4>
              </div>
            </div>

            <div class="gallery-item" onclick="window.app.previewImage('Technovision Cultural & Tech Fest', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80')">
              <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80" alt="Tech Fest" loading="lazy" />
              <div class="gallery-overlay">
                <span class="gallery-category">Events</span>
                <h4 class="gallery-title">Technovision National Fest</h4>
              </div>
            </div>

            <div class="gallery-item" onclick="window.app.previewImage('Sports Complex & Grounds', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80')">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" alt="Sports Grounds" loading="lazy" />
              <div class="gallery-overlay">
                <span class="gallery-category">Sports</span>
                <h4 class="gallery-title">Multi-sport Athletic Complex</h4>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 8. Admission CTA Banner -->
      <section class="section section-navy" style="text-align: center; background: linear-gradient(135deg, var(--primary-navy-dark) 0%, var(--primary-navy) 100%);">
        <div class="container">
          <span class="section-badge section-badge-white">Admissions Open 2026-27</span>
          <h2 class="section-title" style="color: #FFFFFF; max-width: 700px; margin: 0.5rem auto 1rem auto;">
            Ready to Begin Your Engineering Journey at DYPCOE?
          </h2>
          <p class="section-subtitle" style="max-width: 650px; margin: 0 auto 2.5rem auto;">
            Connect with our Central Admission Guidance Cell for MHT-CET / JEE Main cutoff trends, fee concessions, and branch counselling.
          </p>
          <div style="display: flex; justify-content: center; gap: 1rem; flex-wrap: wrap;">
            <a href="/contact" data-link class="btn btn-gold btn-lg">
              Submit Admission Enquiry Form →
            </a>
            <a href="/courses" data-link class="btn btn-outline-white btn-lg">
              Browse All Courses
            </a>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Generates markup for the comprehensive About Page (/about)
   */
  renderAboutPage() {
    return `
      <!-- Page Banner -->
      <section class="page-banner">
        <div class="container">
          <h1 class="page-banner-title">About Our Institution</h1>
          <div class="page-banner-breadcrumb">
            <a href="/" data-link>Home</a>
            <span>/</span>
            <span>About</span>
          </div>
        </div>
      </section>

      <!-- Introduction Section -->
      <section class="section">
        <div class="container">
          <div class="welcome-grid">
            <div>
              <span class="section-badge">Institution Profile</span>
              <h2 class="section-title">Four Decades of Engineering Stature</h2>
              <p class="lead">
                D. Y. Patil College of Engineering, Akurdi was established in 1984 under the visionary leadership of Padma Shri Dr. D. Y. Patil, former Governor of Bihar, West Bengal, and Tripura.
              </p>
              <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: 1.25rem;">
                Over the past 40 years, the institute has earned distinction as one of Maharashtra's premier technical institutions affiliated with Savitribai Phule Pune University (SPPU). The college holds NAAC 'A+' accreditation with an impressive 3.29 CGPA, and its undergraduate programs are accredited by the National Board of Accreditation (NBA).
              </p>
              <p style="color: var(--text-secondary); line-height: 1.7;">
                Nestled within the 29-acre D. Y. Patil Educational Complex at Akurdi, Pune, the college fosters an ecosystem where students gain theoretical depth, rigorous laboratory expertise, and direct exposure to the Pimpri-Chinchwad automotive and software industrial belt.
              </p>
            </div>

            <div style="position: relative;">
              <img
                src="assets/images/campus-gate.jpg"
                alt="D. Y. Patil Akurdi Campus Entrance Gate"
                style="width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); height: 420px; object-fit: cover;"
                loading="lazy"
              />
              <div style="position: absolute; bottom: 15px; left: 15px; right: 15px; background: rgba(11, 29, 58, 0.9); padding: 0.85rem 1.25rem; border-radius: var(--radius-md); color: #FFFFFF; font-size: 0.88rem;">
                <strong>D. Y. Patil Educational Complex</strong> • Akurdi, Pune - 411044
              </div>
            </div>
          </div>

          <!-- Principal Desk Section -->
          <div style="background: #FFFFFF; border-radius: var(--radius-lg); padding: 2.25rem; margin: 3rem 0; box-shadow: var(--shadow-md); border-left: 5px solid var(--secondary-blue); display: grid; grid-template-columns: auto 1fr; gap: 2rem; align-items: center;">
            <div style="width: 100px; height: 100px; border-radius: 50%; background: var(--secondary-blue-light); display: flex; align-items: center; justify-content: center; font-size: 2.5rem; flex-shrink: 0; color: var(--secondary-blue);">
              🎓
            </div>
            <div>
              <span class="section-badge">Leadership Message</span>
              <h3 style="font-size: 1.4rem; font-weight: 800; color: var(--primary-navy); margin-bottom: 0.35rem;">
                Principal's Desk — Dr. Mrs. P. Malathi
              </h3>
              <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.7; font-style: italic;">
                "At Dr. D. Y. Patil College of Engineering, Akurdi, Pune, we are committed to imparting world-class technical education through academic rigor, state-of-the-art laboratory infrastructure, and active industry-institute partnerships. Our aim is to develop socially responsible, competent engineers equipped for lifelong leadership."
              </p>
              <div style="margin-top: 0.5rem; font-size: 0.85rem; color: var(--secondary-blue); font-weight: 700;">
                Principal, Dr. D. Y. Patil College of Engineering, Akurdi, Pune
              </div>
            </div>
          </div>

          <!-- Vision & Mission (Official dypcoeakurdi.ac.in) -->
          <div class="vision-mission-grid">
            <div class="vm-card">
              <div class="vm-header">
                <div class="vm-icon">🎯</div>
                <h3 class="vm-title">Our Vision</h3>
              </div>
              <p class="vm-text">
                To develop a functionally suitable and conducive environment for students and staff for academic purposes, to evolve the departments into centers of excellence, and to build a digitally empowered e-learning campus.
              </p>
            </div>

            <div class="vm-card mission">
              <div class="vm-header">
                <div class="vm-icon">🚀</div>
                <h3 class="vm-title">Our Mission</h3>
              </div>
              <ul class="vm-list">
                <li class="vm-list-item">
                  <span class="vm-list-bullet">✦</span>
                  <span>To produce technically competent, quality-conscious engineers with strong fundamentals.</span>
                </li>
                <li class="vm-list-item">
                  <span class="vm-list-bullet">✦</span>
                  <span>To implement effective and efficient teaching-learning methodologies combined with personality development.</span>
                </li>
                <li class="vm-list-item">
                  <span class="vm-list-bullet">✦</span>
                  <span>To strengthen industry-institute interaction significantly and increase overall campus placements.</span>
                </li>
                <li class="vm-list-item">
                  <span class="vm-list-bullet">✦</span>
                  <span>To impart long-lasting solutions to real-life problems through analysis and system design tailored to societal needs.</span>
                </li>
                <li class="vm-list-item">
                  <span class="vm-list-bullet">✦</span>
                  <span>To cultivate teamwork, leadership, and commitment to lifelong continuous improvement.</span>
                </li>
              </ul>
            </div>
          </div>

          <!-- Accreditations Row -->
          <div class="accreditations-row">
            <div class="accred-card">
              <span class="accred-badge-pill">NAAC</span>
              <h4 class="accred-name">Grade 'A+'</h4>
              <p class="accred-desc">Accredited by National Assessment & Accreditation Council with 3.29 CGPA.</p>
            </div>

            <div class="accred-card">
              <span class="accred-badge-pill">NBA</span>
              <h4 class="accred-name">Accredited Programs</h4>
              <p class="accred-desc">Flagship engineering departments accredited under Tier-II Washington Accord.</p>
            </div>

            <div class="accred-card">
              <span class="accred-badge-pill">AICTE</span>
              <h4 class="accred-name">Approved Institution</h4>
              <p class="accred-desc">Approved by All India Council for Technical Education, New Delhi.</p>
            </div>

            <div class="accred-card">
              <span class="accred-badge-pill">SPPU</span>
              <h4 class="accred-name">Affiliated University</h4>
              <p class="accred-desc">Affiliated to Savitribai Phule Pune University (DTE Code: 6272).</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Campus Facilities & Infrastructure -->
      <section class="section section-light">
        <div class="container">
          <div class="section-header">
            <span class="section-badge">World-Class Infrastructure</span>
            <h2 class="section-title">Campus Facilities & Laboratories</h2>
            <p class="section-subtitle">
              A comprehensive educational environment equipped with smart classrooms, advanced research labs, sporting facilities, and student amenity hubs.
            </p>
          </div>

          <div class="facilities-grid">
            <div class="facility-card">
              <img
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80"
                alt="Central Library"
                class="facility-card-img"
                loading="lazy"
              />
              <div class="facility-card-body">
                <h4 class="facility-card-title">Central Digital Library</h4>
                <p class="facility-card-text">
                  Spread across 12,000 sq.ft., containing over 52,000 textbooks, reference volumes, subscription to IEEE Xplore, ScienceDirect, and a 200-seat silent reading hall open till late evenings.
                </p>
              </div>
            </div>

            <div class="facility-card">
              <img
                src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
                alt="Research Laboratories"
                class="facility-card-img"
                loading="lazy"
              />
              <div class="facility-card-body">
                <h4 class="facility-card-title">75+ Advanced Laboratories</h4>
                <p class="facility-card-text">
                  Specialized departmental labs including NVIDIA GPU Deep Learning lab, Texas Instruments IoT lab, ANSYS CAD/CAM simulation facility, and NABL concrete testing lab.
                </p>
              </div>
            </div>

            <div class="facility-card">
              <img
                src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80"
                alt="Smart Classrooms"
                class="facility-card-img"
                loading="lazy"
              />
              <div class="facility-card-body">
                <h4 class="facility-card-title">Smart Air-Conditioned Classrooms</h4>
                <p class="facility-card-text">
                  Acoustically treated interactive lecture halls equipped with ultra-short throw interactive projectors, high-definition audio systems, and high-speed campus Wi-Fi.
                </p>
              </div>
            </div>

            <div class="facility-card">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80"
                alt="Sports Complex"
                class="facility-card-img"
                loading="lazy"
              />
              <div class="facility-card-body">
                <h4 class="facility-card-title">Sports Complex & Gymnasium</h4>
                <p class="facility-card-text">
                  Sprawling athletic playground for cricket, football, basketball courts, badminton arena, and a modern fitness gym with qualified physical trainers.
                </p>
              </div>
            </div>

            <div class="facility-card">
              <img
                src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80"
                alt="Student Hostels"
                class="facility-card-img"
                loading="lazy"
              />
              <div class="facility-card-body">
                <h4 class="facility-card-title">Residential Hostels</h4>
                <p class="facility-card-text">
                  Separate on-campus secure hostels for boys and girls with 24/7 CCTV surveillance, biometric access, hygienic mess dining, and high-speed Wi-Fi connectivity.
                </p>
              </div>
            </div>

            <div class="facility-card">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80"
                alt="Incubation Center"
                class="facility-card-img"
                loading="lazy"
              />
              <div class="facility-card-body">
                <h4 class="facility-card-title">Innovation & Incubation Centre</h4>
                <p class="facility-card-text">
                  Maker-space equipped with 3D printers, laser cutters, embedded development kits, and dedicated legal mentorship for student patent filings and venture startups.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Shows a full image preview modal for gallery
   */
  previewImage(title, imgUrl) {
    const content = `
      <div style="text-align: center;">
        <img
          src="${imgUrl}"
          alt="${title}"
          style="width: 100%; max-height: 500px; object-fit: contain; border-radius: var(--radius-md); box-shadow: var(--shadow-lg);"
        />
        <h4 style="margin-top: 1rem; color: var(--primary-navy); font-size: 1.2rem; font-weight: 700;">
          ${title}
        </h4>
      </div>
    `;
    this.openModal(title, content);
  }

  /**
   * Interactive Viva Examination Help Sheet Modal
   */
  showVivaGuide() {
    const guideContent = `
      <div style="display: flex; flex-direction: column; gap: 1.25rem; font-size: 0.92rem; color: var(--text-secondary); line-height: 1.6;">
        <div style="background: #EFF6FF; padding: 1rem; border-radius: var(--radius-md); border-left: 4px solid var(--secondary-blue);">
          <strong style="color: var(--primary-navy); font-size: 1rem;">Project Title:</strong>
          Smart College Website Portal (DYPCOE Akurdi)<br />
          <strong style="color: var(--primary-navy);">Subject:</strong> Web Technology 1 – CCE-5 | Unit V: SPA Concepts
        </div>

        <div>
          <h4 style="color: var(--primary-navy); font-weight: 700; margin-bottom: 0.35rem;">
            1. Single Page Application (SPA) Routing Engine
          </h4>
          <p>
            Implemented in <code>js/router.js</code> using the HTML5 <strong>History API</strong>:
          </p>
          <ul style="margin-left: 1.25rem; list-style-type: disc;">
            <li><code>history.pushState(state, title, url)</code> updates the browser URL bar without triggering a full page reload.</li>
            <li><code>window.addEventListener('popstate', callback)</code> enables browser Back and Forward navigation buttons.</li>
            <li>All internal links intercept click events via <code>e.preventDefault()</code> and pass control to <code>router.navigateTo()</code>.</li>
            <li>Dynamic routes like <code>/departments/:id</code> extract URL parameters using regular expression matching.</li>
          </ul>
        </div>

        <div>
          <h4 style="color: var(--primary-navy); font-weight: 700; margin-bottom: 0.35rem;">
            2. Dynamic JSON Data Management (Fetch API)
          </h4>
          <p>
            Separation of concerns is maintained with structured JSON files in the <code>data/</code> folder:
          </p>
          <ul style="margin-left: 1.25rem; list-style-type: disc;">
            <li><code>data/departments.json</code>: 6 Engineering departments with vision, mission, labs, and HOD profile.</li>
            <li><code>data/courses.json</code>: UG, PG, and Ph.D. course catalog with search and eligibility criteria.</li>
            <li><code>data/faculty.json</code>: Department-wise faculty directory marked as sample demonstration data.</li>
            <li><code>data/notices.json</code>: Academic circulars with priority tags, dates, and category filtering.</li>
          </ul>
        </div>

        <div>
          <h4 style="color: var(--primary-navy); font-weight: 700; margin-bottom: 0.35rem;">
            3. Client-Side Form Validation & LocalStorage
          </h4>
          <p>
            Implemented in <code>js/validation.js</code>:
          </p>
          <ul style="margin-left: 1.25rem; list-style-type: disc;">
            <li>Regex Email Validation: <code>/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$/</code></li>
            <li>Regex 10-digit Indian Mobile: <code>/^[6-9]\\d{9}$/</code></li>
            <li>Required fields, character length constraints, real-time input error indicators.</li>
            <li>Submitted enquiries are saved into browser <code>localStorage</code> under key <code>'dypcoe_enquiries_list'</code> and dynamically displayed in a live log table.</li>
          </ul>
        </div>
      </div>
    `;
    this.openModal('SPA Architecture & Viva Guide (CCE-5)', guideContent);
  }
}

// Instantiate global app instance on page load
window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
