/**
 * ============================================================================
 * MAIN APPLICATION MODULE (js/app.js)
 * D. Y. Patil College of Engineering, Akurdi - Web Technology 1 (CCE-5)
 * Unit V: Single Page Application (SPA) Concepts
 * Design: Prestige Academic Layout adapted to DYPCOE Brand (Deep Maroon & Gold)
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

    // Hero Carousel State
    this.currentSlide = 0;
    this.heroSlides = [
      {
        image: 'assets/images/campus-gate.jpg',
        title: 'Inspiring Excellence,<br />Building <span class="gold-accent">Futures</span>',
        desc: 'At Dr. D. Y. Patil College of Engineering, Akurdi, Pune (Estd. 1984), we nurture engineering minds with strong fundamentals, NAAC \'A\' accredited quality, and boundless global opportunities.'
      },
      {
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1600&q=80',
        title: 'Empowering Engineers<br />Through <span class="gold-accent">Innovation</span>',
        desc: 'Affiliated to Savitribai Phule Pune University (SPPU) & AICTE Approved (DTE Code: 6272), featuring NVIDIA GPU AI Labs, Industry 4.0 Centres, and 150+ corporate recruiters.'
      },
      {
        image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1600&q=80',
        title: 'Four Decades of<br />Engineering <span class="gold-accent">Legacy</span>',
        desc: 'Situated in the Pimpri-Chinchwad automotive and IT industrial corridor, preparing socially responsible technocrats with packages up to 43 LPA.'
      }
    ];

    this.initUIListeners();
    this.registerRoutes();
  }

  /**
   * Initializes global UI event listeners
   */
  initUIListeners() {
    // Sticky header shadow & back-to-top visibility
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.site-header');
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 25);
      }
      if (this.backToTopBtn) {
        this.backToTopBtn.classList.toggle('visible', window.scrollY > 350);
      }
    });

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

    // Modal close handlers
    const modalCloseBtn = document.getElementById('modal-close-btn');
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => this.closeModal());
    }
    if (this.modalBackdrop) {
      this.modalBackdrop.addEventListener('click', (e) => {
        if (e.target === this.modalBackdrop) this.closeModal();
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeModal();
        this.closeMobileNav();
      }
    });

    // Footer Newsletter Form (Client-side validation + Toast)
    const newsletterForm = document.getElementById('footer-newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('footer-newsletter-email');
        const email = emailInput ? emailInput.value.trim() : '';
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!emailRegex.test(email)) {
          this.showToast('Please enter a valid email address to subscribe.', 'danger');
          return;
        }

        this.showToast(`Subscribed ${email} to DYPCOE campus circulars & updates!`, 'success');
        newsletterForm.reset();
      });
    }
  }

  /**
   * Hero Slider Controls
   */
  updateHeroSlide(index) {
    this.currentSlide = (index + this.heroSlides.length) % this.heroSlides.length;
    const slide = this.heroSlides[this.currentSlide];

    const bgEl = document.getElementById('hero-bg-layer');
    const titleEl = document.getElementById('hero-slide-title');
    const descEl = document.getElementById('hero-slide-desc');
    const dots = document.querySelectorAll('.hero-dot');

    if (bgEl) bgEl.style.backgroundImage = `url('${slide.image}')`;
    if (titleEl) titleEl.innerHTML = slide.title;
    if (descEl) descEl.textContent = slide.desc;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentSlide);
    });
  }

  prevHeroSlide() {
    this.updateHeroSlide(this.currentSlide - 1);
  }

  nextHeroSlide() {
    this.updateHeroSlide(this.currentSlide + 1);
  }

  goToHeroSlide(index) {
    this.updateHeroSlide(index);
  }

  /**
   * Mobile navigation drawer controls
   */
  toggleMobileNav() {
    if (!this.mobileDrawer) return;
    if (this.mobileDrawer.classList.contains('open')) {
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
   */
  showToast(message, type = 'info', duration = 4000) {
    if (!this.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let icon = 'ℹ️';
    let title = 'Notification';
    if (type === 'success') { icon = '✅'; title = 'Success'; }
    else if (type === 'danger') { icon = '❌'; title = 'Attention'; }
    else if (type === 'warning') { icon = '⚠️'; title = 'Notice'; }

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
        if (toast.parentNode) toast.parentNode.removeChild(toast);
      }, 300);
    }, duration);
  }

  /**
   * Registers all SPA routes with window.router
   */
  registerRoutes() {
    const router = window.router;
    if (!router) return;

    router.addRoute('/', () => this.renderHomePage(), 'Home | D. Y. Patil College of Engineering, Akurdi');
    router.addRoute('/home', () => this.renderHomePage(), 'Home | D. Y. Patil College of Engineering, Akurdi');
    router.addRoute('/about', () => this.renderAboutPage(), 'About Us | D. Y. Patil College of Engineering, Akurdi');

    router.addRoute(
      '/departments',
      () => window.DepartmentsModule.renderDepartmentsPage(),
      'Academic Departments | DYPCOE Pune'
    );

    router.addRoute(
      '/departments/:id',
      (params) => window.DepartmentsModule.renderDepartmentDetail(params),
      'Department Details | DYPCOE Pune'
    );

    router.routes.push({
      path: '/courses',
      view: () => window.CoursesModule.renderCoursesPage(),
      title: 'Engineering Courses | DYPCOE Pune',
      regex: router.pathToRegex('/courses'),
      afterRender: () => window.CoursesModule.initEvents()
    });

    router.routes.push({
      path: '/faculty',
      view: () => window.FacultyModule.renderFacultyPage(),
      title: 'Faculty Directory | DYPCOE Pune',
      regex: router.pathToRegex('/faculty'),
      afterRender: () => window.FacultyModule.initEvents()
    });

    router.routes.push({
      path: '/notices',
      view: () => window.NoticesModule.renderNoticesPage(),
      title: 'Notice Board & Circulars | DYPCOE Pune',
      regex: router.pathToRegex('/notices'),
      afterRender: () => window.NoticesModule.initEvents()
    });

    router.routes.push({
      path: '/contact',
      view: () => window.ValidationModule.renderContactPage(),
      title: 'Contact & Admissions | DYPCOE Pune',
      regex: router.pathToRegex('/contact'),
      afterRender: () => window.ValidationModule.initEvents()
    });
  }

  /**
   * Renders the Home Page matching the Reference Design adapted to DYPCOE Akurdi
   */
  async renderHomePage() {
    const departmentsOverviewHTML = await window.DepartmentsModule.renderHomeOverview();
    const noticesWidgetHTML = await window.NoticesModule.renderHomeNotices();
    const firstSlide = this.heroSlides[0];
    this.currentSlide = 0;

    return `
      <!-- 1. Full-Bleed Hero Banner with Slider Controls -->
      <section class="hero-slider">
        <div
          id="hero-bg-layer"
          class="hero-bg-layer"
          style="background-image: url('${firstSlide.image}');"
        ></div>
        <div class="hero-overlay"></div>

        <button class="hero-arrow hero-arrow-prev" onclick="window.app.prevHeroSlide()" aria-label="Previous slide">‹</button>
        <button class="hero-arrow hero-arrow-next" onclick="window.app.nextHeroSlide()" aria-label="Next slide">›</button>

        <div class="container">
          <div class="hero-inner">
            <h1 id="hero-slide-title" class="hero-title">${firstSlide.title}</h1>
            <p id="hero-slide-desc" class="hero-description">${firstSlide.desc}</p>
            <div class="hero-buttons">
              <a href="/contact" data-link class="btn btn-gold btn-lg">
                ADMISSIONS OPEN →
              </a>
              <a href="/departments" data-link class="btn btn-outline-white btn-lg">
                EXPLORE DEPARTMENTS →
              </a>
            </div>
          </div>
        </div>

        <div class="hero-dots" aria-label="Slide indicators">
          <button class="hero-dot active" onclick="window.app.goToHeroSlide(0)" aria-label="Slide 1"></button>
          <button class="hero-dot" onclick="window.app.goToHeroSlide(1)" aria-label="Slide 2"></button>
          <button class="hero-dot" onclick="window.app.goToHeroSlide(2)" aria-label="Slide 3"></button>
        </div>
      </section>

      <!-- 2. Floating 5-Column Feature Bar (Overlapping Hero Bottom Edge) -->
      <div class="feature-strip-wrap">
        <div class="container">
          <div class="feature-strip-card">
            <div class="feature-strip-item">
              <div class="feature-strip-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
              </div>
              <div>
                <div class="feature-strip-title">Smart Classrooms</div>
                <div class="feature-strip-sub">ICT-enabled interactive lecture halls</div>
              </div>
            </div>

            <div class="feature-strip-item">
              <div class="feature-strip-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <div class="feature-strip-title">Experienced Faculty</div>
                <div class="feature-strip-sub">70+ Ph.D. & senior mentors</div>
              </div>
            </div>

            <div class="feature-strip-item">
              <div class="feature-strip-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>
              </div>
              <div>
                <div class="feature-strip-title">PCMC Industrial Hub</div>
                <div class="feature-strip-sub">150+ IT & automotive recruiters</div>
              </div>
            </div>

            <div class="feature-strip-item">
              <div class="feature-strip-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
              </div>
              <div>
                <div class="feature-strip-title">Holistic Excellence</div>
                <div class="feature-strip-sub">BAJA SAE, Hackathons & clubs</div>
              </div>
            </div>

            <div class="feature-strip-item">
              <div class="feature-strip-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6"/><path d="M10 9V3"/><path d="M14 9V3"/><path d="m7.5 14.5 2.5-5.5h4l2.5 5.5A4 4 0 0 1 13 21h-2a4 4 0 0 1-3.5-6.5Z"/></svg>
              </div>
              <div>
                <div class="feature-strip-title">75+ Modern Labs</div>
                <div class="feature-strip-sub">NVIDIA AI, VLSI & CAD centres</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Welcome Section (Left Real Campus Photo + Right Intro & 4 Inline Stats) -->
      <section class="section section-white">
        <div class="container">
          <div class="welcome-grid">
            <div class="welcome-photo-frame">
              <img
                src="assets/images/campus-gate.jpg"
                alt="Dr. D. Y. Patil College of Engineering Akurdi Campus Gate"
                class="welcome-img-main"
              />
              <div class="welcome-photo-caption">
                Dr. D. Y. Patil Educational Complex • Sector 29, Nigdi Pradhikaran, Akurdi, Pune
              </div>
            </div>

            <div class="welcome-content">
              <span class="section-eyebrow">WELCOME TO</span>
              <h2 class="section-title">D. Y. Patil College of Engineering</h2>
              <p>
                Established in 1984 under Padma Shri Dr. D. Y. Patil, DYPCOE Akurdi is a premier engineering institution affiliated with Savitribai Phule Pune University (SPPU), approved by AICTE, and recognized by DTE Maharashtra (Code: 6272). We blend strong engineering fundamentals with industrial innovation to prepare confident global technocrats.
              </p>

              <!-- Principal's Desk Quote -->
              <div class="principal-quote-box">
                <p class="principal-quote-text">
                  "We are dedicated to preparing engineers with strong fundamentals, creative problem-solving abilities, and high ethical standards, bridging academia and industry in Pune's automotive and IT corridor."
                </p>
                <div class="principal-quote-author">— Dr. Mrs. P. Malathi, Principal, DYPCOE Akurdi</div>
              </div>

              <!-- 4 Inline Stats Row (Matches Reference Layout) -->
              <div class="inline-stats-row">
                <div class="inline-stat-item">
                  <span class="inline-stat-value">NAAC 'A'</span>
                  <span class="inline-stat-label">Accredited Grade</span>
                </div>
                <div class="inline-stat-item">
                  <span class="inline-stat-value">SPPU</span>
                  <span class="inline-stat-label">Pune University</span>
                </div>
                <div class="inline-stat-item">
                  <span class="inline-stat-value">40+</span>
                  <span class="inline-stat-label">Years of Legacy</span>
                </div>
                <div class="inline-stat-item">
                  <span class="inline-stat-value">43 LPA</span>
                  <span class="inline-stat-label">Highest Package</span>
                </div>
              </div>

              <a href="/about" data-link class="btn btn-primary">
                READ MORE ABOUT US →
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Academics Section ("Explore. Learn. Excel." + 4 Cards + Circular Visual Ribbon) -->
      <section class="section section-light">
        <div class="container">
          <div class="academics-layout">
            <div>
              <span class="section-eyebrow">ACADEMICS</span>
              <h2 class="section-title">Explore. Learn. Excel.</h2>

              <div class="academics-cards-grid">
                <div class="academic-mini-card">
                  <div class="academic-mini-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                  </div>
                  <h3 class="academic-mini-title">SPPU Curriculum</h3>
                  <p class="academic-mini-desc">Outcome-based B.Tech, M.Tech & Ph.D. programs with NBA accreditation.</p>
                </div>

                <div class="academic-mini-card">
                  <div class="academic-mini-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
                  </div>
                  <h3 class="academic-mini-title">Ph.D. Mentors</h3>
                  <p class="academic-mini-desc">Acclaimed professors guiding IEEE research papers, patents & projects.</p>
                </div>

                <div class="academic-mini-card">
                  <div class="academic-mini-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>
                  </div>
                  <h3 class="academic-mini-title">Innovative Labs</h3>
                  <p class="academic-mini-desc">Hands-on learning in NVIDIA AI, Cadence VLSI, Cloud & Robotics labs.</p>
                </div>

                <div class="academic-mini-card">
                  <div class="academic-mini-icon">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
                  </div>
                  <h3 class="academic-mini-title">Career Driven</h3>
                  <p class="academic-mini-desc">Dedicated Training & Placement Cell with 150+ corporate recruiters.</p>
                </div>
              </div>
            </div>

            <!-- Right Circular Visual + Maroon Ribbon -->
            <div class="holistic-circle-wrap">
              <div class="holistic-circle-img-box">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=700&q=80"
                  alt="DYPCOE Engineering Students"
                  class="holistic-circle-img"
                  loading="lazy"
                />
              </div>
              <div class="holistic-ribbon-card">
                <div class="holistic-ribbon-title">Holistic Growth</div>
                <div class="holistic-ribbon-sub">Innovation • Research • Values</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. World-Class Infrastructure (4 Icon-Overlap Photo Cards Matching Reference) -->
      <section class="section section-white">
        <div class="container">
          <div style="margin-bottom: 2rem;">
            <span class="section-eyebrow">FACILITIES</span>
            <h2 class="section-title">World-Class Infrastructure</h2>
          </div>

          <div class="infra-4-grid">
            <div class="ref-photo-card">
              <div class="ref-card-img-wrap">
                <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=700&q=80" alt="Smart Classrooms" class="ref-card-img" loading="lazy" />
              </div>
              <div class="ref-card-icon-badge" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
              </div>
              <div class="ref-card-body">
                <h3 class="ref-card-title">Smart Classrooms</h3>
                <p class="ref-card-desc">Air-conditioned interactive lecture halls with projectors and high-speed campus Wi-Fi.</p>
              </div>
            </div>

            <div class="ref-photo-card">
              <div class="ref-card-img-wrap">
                <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=700&q=80" alt="Engineering Laboratories" class="ref-card-img" loading="lazy" />
              </div>
              <div class="ref-card-icon-badge" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6"/><path d="M10 9V3"/><path d="M14 9V3"/><path d="m7.5 14.5 2.5-5.5h4l2.5 5.5A4 4 0 0 1 13 21h-2a4 4 0 0 1-3.5-6.5Z"/></svg>
              </div>
              <div class="ref-card-body">
                <h3 class="ref-card-title">75+ Engineering Labs</h3>
                <p class="ref-card-desc">NVIDIA GPU computing, Cadence VLSI, ANSYS CAD/CAM, and NABL testing facilities.</p>
              </div>
            </div>

            <div class="ref-photo-card">
              <div class="ref-card-img-wrap">
                <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=700&q=80" alt="Central Digital Library" class="ref-card-img" loading="lazy" />
              </div>
              <div class="ref-card-icon-badge" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
              </div>
              <div class="ref-card-body">
                <h3 class="ref-card-title">Central Digital Library</h3>
                <p class="ref-card-desc">52,000+ engineering books, IEEE Xplore & ScienceDirect access, and 200-seat reading hall.</p>
              </div>
            </div>

            <div class="ref-photo-card">
              <div class="ref-card-img-wrap">
                <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=700&q=80" alt="Hostels & Campus Amenities" class="ref-card-img" loading="lazy" />
              </div>
              <div class="ref-card-icon-badge" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <div class="ref-card-body">
                <h3 class="ref-card-title">Hostels & Sports Arena</h3>
                <p class="ref-card-desc">Secure boys & girls residential hostels, sports grounds, gym, and 29-acre green campus.</p>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 2.25rem;">
            <a href="/about" data-link class="btn btn-outline-dark">
              VIEW ALL FACILITIES →
            </a>
          </div>
        </div>
      </section>

      <!-- 6. Academic Departments Overview (Loaded Dynamically from departments.json) -->
      <section class="section section-light">
        <div class="container">
          <div class="section-header-row">
            <div>
              <span class="section-eyebrow">ENGINEERING BRANCHES</span>
              <h2 class="section-title" style="margin-bottom: 0;">Academic Departments</h2>
            </div>
            <a href="/departments" data-link class="btn btn-outline-dark btn-sm">
              VIEW ALL DEPARTMENTS →
            </a>
          </div>

          <div class="departments-grid">
            ${departmentsOverviewHTML}
          </div>
        </div>
      </section>

      <!-- 7. Latest Notices & Circulars (Loaded Dynamically from notices.json) -->
      <section class="section section-white">
        <div class="container">
          <div class="section-header-row">
            <div>
              <span class="section-eyebrow">CAMPUS BULLETIN</span>
              <h2 class="section-title" style="margin-bottom: 0;">Latest Notices & Circulars</h2>
            </div>
            <a href="/notices" data-link class="btn btn-outline-dark btn-sm">
              VIEW ALL NOTICES →
            </a>
          </div>

          <div class="notices-grid">
            ${noticesWidgetHTML}
          </div>
        </div>
      </section>

      <!-- 8. Student Life ("Learning Beyond Classrooms" — 5-Image Horizontal Strip) -->
      <section class="section section-light">
        <div class="container">
          <div class="section-header-row">
            <div>
              <span class="section-eyebrow">STUDENT LIFE</span>
              <h2 class="section-title" style="margin-bottom: 0;">Learning Beyond Classrooms</h2>
            </div>
            <a href="/about" data-link class="btn btn-outline-dark btn-sm">
              EXPLORE CAMPUS →
            </a>
          </div>

          <div class="student-life-strip">
            <div class="life-thumb" onclick="window.app.previewImage('D. Y. Patil Akurdi Campus Entrance Gate', 'assets/images/campus-gate.jpg')">
              <img src="assets/images/campus-gate.jpg" alt="Akurdi Campus Gate" loading="lazy" />
              <div class="life-thumb-overlay">
                <span class="life-thumb-cat">Campus</span>
                <span class="life-thumb-title">Akurdi Entrance Gate</span>
              </div>
            </div>

            <div class="life-thumb" onclick="window.app.previewImage('AI & Computer Engineering Labs', 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80')">
              <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80" alt="Computing Labs" loading="lazy" />
              <div class="life-thumb-overlay">
                <span class="life-thumb-cat">Innovation</span>
                <span class="life-thumb-title">Computing & AI Labs</span>
              </div>
            </div>

            <div class="life-thumb" onclick="window.app.previewImage('Technovision National Tech Fest', 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80')">
              <img src="https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80" alt="Technovision Fest" loading="lazy" />
              <div class="life-thumb-overlay">
                <span class="life-thumb-cat">Events</span>
                <span class="life-thumb-title">Technovision Symposium</span>
              </div>
            </div>

            <div class="life-thumb" onclick="window.app.previewImage('Central Reference Library', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80')">
              <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=600&q=80" alt="Digital Library" loading="lazy" />
              <div class="life-thumb-overlay">
                <span class="life-thumb-cat">Knowledge</span>
                <span class="life-thumb-title">Central Digital Library</span>
              </div>
            </div>

            <div class="life-thumb" onclick="window.app.previewImage('Multi-Sport Athletic Complex', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80')">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80" alt="Sports Complex" loading="lazy" />
              <div class="life-thumb-overlay">
                <span class="life-thumb-cat">Sports</span>
                <span class="life-thumb-title">Athletics & BAJA SAE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 9. Rounded Deep Maroon Admissions CTA Banner (Exact Reference Match) -->
      <section class="cta-banner-section">
        <div class="container">
          <div class="cta-banner-box">
            <div class="cta-banner-left">
              <div class="cta-banner-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
              </div>
              <h2 class="cta-banner-heading">
                Admissions Open for<br />Academic Year 2026–27
              </h2>
            </div>

            <div class="cta-banner-divider"></div>

            <p class="cta-banner-copy">
              Give your engineering career the best start at D. Y. Patil College of Engineering, Akurdi, Pune.
            </p>

            <a href="/contact" data-link class="btn btn-gold btn-lg">
              ENQUIRE NOW →
            </a>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Renders the About Page (/about) with all official DYPCOE Akurdi info
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
            <span>About Us</span>
          </div>
        </div>
      </section>

      <!-- Introduction Section -->
      <section class="section section-white">
        <div class="container">
          <div class="welcome-grid">
            <div>
              <span class="section-eyebrow">INSTITUTION PROFILE</span>
              <h2 class="section-title">Four Decades of Engineering Stature</h2>
              <p style="font-weight: 600; color: var(--primary-brand); margin-bottom: 1rem;">
                D. Y. Patil College of Engineering, Akurdi was established in 1984 under the visionary leadership of Padma Shri Dr. D. Y. Patil, former Governor of Bihar, West Bengal, and Tripura.
              </p>
              <p style="color: var(--text-secondary); line-height: 1.72; margin-bottom: 1rem;">
                Over the past 40 years, the institute has earned distinction as one of Maharashtra's premier technical institutions affiliated with Savitribai Phule Pune University (SPPU). The college is accredited by NAAC with an 'A' Grade, approved by AICTE, and recognized by DTE Maharashtra (Institute Code: 6272).
              </p>
              <p style="color: var(--text-secondary); line-height: 1.72;">
                Nestled within the 29-acre Dr. D. Y. Patil Educational Complex at Sector 29, Nigdi Pradhikaran, Akurdi, Pune, the college fosters an ecosystem where students gain theoretical depth, laboratory expertise, and direct exposure to the Pimpri-Chinchwad automotive and software industrial belt.
              </p>
            </div>

            <div class="welcome-photo-frame">
              <img
                src="assets/images/campus-gate.jpg"
                alt="D. Y. Patil Akurdi Campus Entrance Gate"
                class="welcome-img-main"
              />
              <div class="welcome-photo-caption">
                Dr. D. Y. Patil Educational Complex • Main Campus Entrance Gate, Akurdi, Pune
              </div>
            </div>
          </div>

          <!-- Principal Desk Section -->
          <div style="background: var(--bg-light); border-radius: var(--radius-md); padding: 2rem; margin: 3rem 0; border-left: 4px solid var(--primary-brand); display: flex; gap: 1.75rem; align-items: center; flex-wrap: wrap;">
            <div style="width: 84px; height: 84px; border-radius: 50%; background: var(--primary-brand); color: var(--accent-gold); display: flex; align-items: center; justify-content: center; font-size: 2rem; flex-shrink: 0;">
              🎓
            </div>
            <div style="flex: 1; min-width: 260px;">
              <span class="section-eyebrow">LEADERSHIP MESSAGE</span>
              <h3 style="font-size: 1.45rem; color: var(--text-primary); margin-bottom: 0.4rem;">
                Principal's Desk — Dr. Mrs. P. Malathi
              </h3>
              <p style="color: var(--text-secondary); font-size: 0.94rem; line-height: 1.7; font-style: italic;">
                "At Dr. D. Y. Patil College of Engineering, Akurdi, Pune, we are committed to imparting world-class technical education through academic rigor, state-of-the-art laboratory infrastructure, and active industry-institute partnerships. Our aim is to develop socially responsible, competent engineers equipped for lifelong leadership."
              </p>
              <div style="margin-top: 0.5rem; font-size: 0.84rem; color: var(--primary-brand); font-weight: 700;">
                Principal, Dr. D. Y. Patil College of Engineering, Akurdi, Pune
              </div>
            </div>
          </div>

          <!-- Official Vision & Mission (from dypcoeakurdi.ac.in) -->
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
              <h4 class="accred-name">Grade 'A'</h4>
              <p class="accred-desc">Accredited by National Assessment & Accreditation Council for academic excellence.</p>
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
            <span class="section-eyebrow">WORLD-CLASS INFRASTRUCTURE</span>
            <h2 class="section-title">Campus Facilities & Laboratories</h2>
            <p class="section-subtitle">
              A comprehensive educational environment equipped with smart classrooms, advanced research labs, sporting facilities, and student amenity hubs.
            </p>
          </div>

          <div class="facilities-grid">
            <div class="facility-card">
              <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80" alt="Central Library" class="facility-card-img" loading="lazy" />
              <div class="facility-card-body">
                <h4 class="facility-card-title">Central Digital Library</h4>
                <p class="facility-card-text">Spread across 12,000 sq.ft., housing 52,000+ volumes, IEEE Xplore & ScienceDirect digital journals, and a 200-seat silent reading hall.</p>
              </div>
            </div>

            <div class="facility-card">
              <img src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80" alt="Research Laboratories" class="facility-card-img" loading="lazy" />
              <div class="facility-card-body">
                <h4 class="facility-card-title">75+ Advanced Laboratories</h4>
                <p class="facility-card-text">Specialized labs including NVIDIA GPU Deep Learning lab, Texas Instruments IoT lab, ANSYS CAD/CAM facility, and NABL concrete testing lab.</p>
              </div>
            </div>

            <div class="facility-card">
              <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80" alt="Smart Classrooms" class="facility-card-img" loading="lazy" />
              <div class="facility-card-body">
                <h4 class="facility-card-title">Smart Air-Conditioned Classrooms</h4>
                <p class="facility-card-text">Acoustically treated interactive lecture halls equipped with projectors, audio systems, and high-speed campus Wi-Fi.</p>
              </div>
            </div>

            <div class="facility-card">
              <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80" alt="Sports Complex" class="facility-card-img" loading="lazy" />
              <div class="facility-card-body">
                <h4 class="facility-card-title">Sports Complex & Gymnasium</h4>
                <p class="facility-card-text">Sprawling athletic grounds for cricket, football, basketball, badminton arena, and a modern fitness gym with trainers.</p>
              </div>
            </div>

            <div class="facility-card">
              <img src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80" alt="Student Hostels" class="facility-card-img" loading="lazy" />
              <div class="facility-card-body">
                <h4 class="facility-card-title">Residential Hostels</h4>
                <p class="facility-card-text">Separate on-campus secure hostels for boys and girls with 24/7 CCTV surveillance, biometric access, hygienic mess, and Wi-Fi.</p>
              </div>
            </div>

            <div class="facility-card">
              <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80" alt="Incubation Center" class="facility-card-img" loading="lazy" />
              <div class="facility-card-body">
                <h4 class="facility-card-title">Innovation & Incubation Centre</h4>
                <p class="facility-card-text">Maker-space equipped with 3D printers, embedded development kits, and dedicated mentorship for patent filings and student startups.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Image Preview Lightbox Modal
   */
  previewImage(title, imgUrl) {
    const content = `
      <div style="text-align: center;">
        <img
          src="${imgUrl}"
          alt="${title}"
          style="width: 100%; max-height: 480px; object-fit: contain; border-radius: var(--radius-sm);"
        />
        <h4 style="margin-top: 1rem; color: var(--primary-brand); font-size: 1.15rem;">
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
      <div style="display: flex; flex-direction: column; gap: 1.15rem; font-size: 0.9rem; color: var(--text-secondary); line-height: 1.6;">
        <div style="background: var(--primary-soft); padding: 1rem; border-radius: var(--radius-sm); border-left: 4px solid var(--primary-brand);">
          <strong style="color: var(--primary-brand);">Project:</strong> Smart College Website Portal (D. Y. Patil College of Engineering, Akurdi)<br />
          <strong style="color: var(--primary-brand);">Subject:</strong> Web Technology 1 – CCE-5 | Unit V: SPA Concepts
        </div>

        <div>
          <h4 style="color: var(--primary-brand); margin-bottom: 0.3rem;">1. Single Page Application (SPA) Routing Engine</h4>
          <p>Implemented in <code>js/router.js</code> using the HTML5 <strong>History API</strong>:</p>
          <ul style="margin-left: 1.25rem; list-style-type: disc;">
            <li><code>history.pushState()</code> updates the browser URL without a full page reload.</li>
            <li><code>popstate</code> event handles browser Back & Forward buttons seamlessly.</li>
            <li>Dynamic parameter routes like <code>/departments/:id</code> extract branch IDs using regex.</li>
          </ul>
        </div>

        <div>
          <h4 style="color: var(--primary-brand); margin-bottom: 0.3rem;">2. Dynamic JSON Data (Fetch API)</h4>
          <ul style="margin-left: 1.25rem; list-style-type: disc;">
            <li><code>data/departments.json</code> (6 branches), <code>data/courses.json</code> (11 programs), <code>data/faculty.json</code> (14 profiles), <code>data/notices.json</code> (8 circulars).</li>
            <li>Fetched asynchronously via <code>fetch()</code> + <code>async/await</code> with in-memory caching and <code>file:///</code> fallback.</li>
          </ul>
        </div>

        <div>
          <h4 style="color: var(--primary-brand); margin-bottom: 0.3rem;">3. Client-Side Validation & LocalStorage</h4>
          <ul style="margin-left: 1.25rem; list-style-type: disc;">
            <li>Real-time regex validation for Email and 10-digit Indian Mobile numbers in <code>js/validation.js</code>.</li>
            <li>Submitted enquiries are stored client-side in <code>localStorage</code> and displayed in a live table.</li>
          </ul>
        </div>
      </div>
    `;
    this.openModal('SPA Architecture & Viva Guide (CCE-5)', guideContent);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.app = new App();
});
