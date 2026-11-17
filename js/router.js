/**
 * ============================================================================
 * SPA ROUTER (Single Page Application Router)
 * D. Y. Patil College of Engineering, Akurdi - Web Technology 1 (CCE-5)
 * ============================================================================
 *
 * Concepts Demonstrated for Viva:
 * 1. HTML5 History API: `history.pushState()`, `history.replaceState()`
 * 2. `popstate` event listener: Handles browser forward & back buttons
 * 3. Event Delegation & Interception: Prevents default browser full-page reload
 * 4. Dynamic Parameterized Routes: Matches patterns like `/departments/:id`
 * 5. Hash Fallback: Seamless execution whether hosted on HTTP server or file://
 * 6. Dynamic DOM injection into `<main id="app">`
 * 7. Active navigation state synchronization
 * 8. Dynamic Document Title updating
 * ============================================================================
 */

class Router {
  constructor() {
    // Array of registered routes: { path, view, title }
    this.routes = [];

    // Reference to the main content container
    this.appContainer = document.getElementById('app');

    // Current active path
    this.currentPath = '';

    // Initialize the router listeners
    this.init();
  }

  /**
   * Registers a route mapping a URL pattern to a render function
   * @param {string} path - URL path (e.g. '/about', '/departments/:id')
   * @param {Function} viewFunction - Function that renders the page
   * @param {string} pageTitle - Title for the browser tab
   */
  addRoute(path, viewFunction, pageTitle) {
    this.routes.push({
      path,
      view: viewFunction,
      title: pageTitle || 'D. Y. Patil College of Engineering, Akurdi',
      // Convert path to regex for dynamic parameter extraction (e.g. :id)
      regex: this.pathToRegex(path)
    });
  }

  /**
   * Converts a route path string into a Regular Expression
   * e.g. '/departments/:id' -> /^\/departments\/([^\/]+)$/
   */
  pathToRegex(path) {
    return new RegExp('^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '([^\\/]+)') + '$');
  }

  /**
   * Extracts parameter values from a matching URL
   */
  getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

    return Object.fromEntries(
      keys.map((key, i) => {
        return [key, values[i]];
      })
    );
  }

  /**
   * Initialize event listeners for SPA routing:
   * 1. Window popstate event (browser back/forward buttons)
   * 2. Click interception on anchor tags
   */
  init() {
    // Listen for browser Back/Forward navigation
    window.addEventListener('popstate', () => {
      this.resolveCurrentRoute();
    });

    // Intercept navigation link clicks globally (Event Delegation)
    document.addEventListener('click', (e) => {
      // Find closest anchor tag with [data-link] or internal link
      const target = e.target.closest('a');
      if (!target) return;

      const href = target.getAttribute('href');

      // Check if link is an internal SPA route (starts with '/' or '#' or is relative without external protocol)
      if (
        target.matches('[data-link]') ||
        (href && !href.startsWith('http') && !href.startsWith('mailto:') && !href.startsWith('tel:') && !href.startsWith('javascript:'))
      ) {
        // Prevent default browser behavior (which causes a full page reload!)
        e.preventDefault();

        // Close mobile menu if open
        if (window.app && typeof window.app.closeMobileNav === 'function') {
          window.app.closeMobileNav();
        }

        // Navigate to the target route using History API
        this.navigateTo(href);
      }
    });

    // Run initial route resolution on DOM load
    window.addEventListener('DOMContentLoaded', () => {
      this.resolveCurrentRoute();
    });
  }

  /**
   * Navigates to a new URL using HTML5 History API pushState
   * @param {string} url - Target URL path (e.g. '/departments')
   */
  navigateTo(url) {
    if (!url) return;

    // Normalize URL
    let cleanUrl = url;
    if (cleanUrl.startsWith('#/')) {
      cleanUrl = cleanUrl.substring(1);
    } else if (cleanUrl.startsWith('#') && cleanUrl.length > 1) {
      cleanUrl = '/' + cleanUrl.substring(1);
    }

    if (!cleanUrl.startsWith('/')) {
      cleanUrl = '/' + cleanUrl;
    }

    // Check if we are running under file:/// protocol or web server
    const isFileProtocol = window.location.protocol === 'file:';

    if (isFileProtocol) {
      // Under file://, use hash to prevent browser attempting to look for filesystem files
      window.location.hash = cleanUrl;
    } else {
      // Standard SPA: Push new state to browser history without reloading
      window.history.pushState(null, null, cleanUrl);
    }

    // Resolve and render the view for the new URL
    this.resolveCurrentRoute();
  }

  /**
   * Identifies current path from location pathname or hash and renders the matching route
   */
  async resolveCurrentRoute() {
    let path = window.location.pathname;

    // If there is a hash route, prioritize hash (supports file:/// and direct hash links)
    if (window.location.hash) {
      path = window.location.hash.slice(1);
      if (!path.startsWith('/')) path = '/' + path;
    }

    // Handle base path normalization (e.g., if hosted in subfolder)
    if (!path || path === '' || path === '/index.html') {
      path = '/';
    }

    // Save current path
    this.currentPath = path;

    // Test each registered route against current path
    const potentialMatches = this.routes.map(route => {
      return {
        route: route,
        result: path.match(route.regex)
      };
    });

    let match = potentialMatches.find(potentialMatch => potentialMatch.result !== null);

    // If no route matches, fallback to 404 view
    if (!match) {
      match = {
        route: {
          path: '/404',
          view: () => this.renderNotFound(),
          title: '404 - Page Not Found | DYPCOE'
        },
        result: [path]
      };
    }

    // Update document title for viva demonstration
    document.title = match.route.title;

    // Highlight active link in header & mobile drawer
    this.updateActiveLinks(path);

    // Render loading indicator before view resolution
    this.renderLoading();

    try {
      // Extract dynamic URL parameters (e.g. :id)
      const params = this.getParams(match);

      // Execute view render function
      const htmlContent = await match.route.view(params);

      // Inject rendered view into main container
      this.appContainer.innerHTML = `
        <div class="page-view">
          ${htmlContent}
        </div>
      `;

      // Scroll smoothly to top on route change
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Trigger post-render callbacks if registered (e.g., event listeners on new DOM)
      if (typeof match.route.afterRender === 'function') {
        match.route.afterRender(params);
      }
    } catch (error) {
      console.error('[SPA Router Error]: Failed to render route:', error);
      this.appContainer.innerHTML = this.renderError(error);
    }
  }

  /**
   * Synchronizes active classes on navigation links
   */
  updateActiveLinks(path) {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      // Match base path (e.g. /departments/aids matches /departments)
      const linkBase = href ? href.split('/')[1] : '';
      const currentBase = path ? path.split('/')[1] : '';

      if (
        (href === '/' && (path === '/' || path === '')) ||
        (linkBase && currentBase && linkBase === currentBase)
      ) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  /**
   * Renders a sleek loading spinner during data fetch
   */
  renderLoading() {
    this.appContainer.innerHTML = `
      <div class="loading-indicator">
        <div class="spinner"></div>
        <p class="loading-text">Loading portal resources...</p>
      </div>
    `;
  }

  /**
   * 404 Page Not Found View
   */
  renderNotFound() {
    return `
      <section class="section">
        <div class="container" style="text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 5rem; font-weight: 900; color: var(--secondary-blue); line-height: 1;">404</div>
          <h2 style="font-size: 2rem; color: var(--primary-navy); margin: 1rem 0;">Page Not Found</h2>
          <p style="color: var(--text-muted); max-width: 500px; margin: 0 auto 2rem auto;">
            The requested page does not exist or may have been relocated in the single page routing table.
          </p>
          <a href="/" data-link class="btn btn-primary btn-lg">
            Return to Homepage
          </a>
        </div>
      </section>
    `;
  }

  /**
   * Error View with friendly recovery
   */
  renderError(error) {
    return `
      <section class="section">
        <div class="container" style="text-align: center; padding: 4rem 1rem;">
          <div style="font-size: 3rem; color: var(--color-danger); margin-bottom: 1rem;">⚠️</div>
          <h2 style="font-size: 1.8rem; color: var(--primary-navy); margin-bottom: 0.75rem;">Error Loading Content</h2>
          <p style="color: var(--text-secondary); max-width: 550px; margin: 0 auto 1.5rem auto;">
            ${error.message || 'Unable to fetch dynamic JSON data. Please ensure the local server or data connection is active.'}
          </p>
          <button onclick="window.router.resolveCurrentRoute()" class="btn btn-outline">
            Retry Loading
          </button>
        </div>
      </section>
    `;
  }
}

// Create global router instance
window.router = new Router();
