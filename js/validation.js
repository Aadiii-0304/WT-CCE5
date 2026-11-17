/**
 * ============================================================================
 * CONTACT & ENQUIRY FORM VALIDATION MODULE (js/validation.js)
 * D. Y. Patil College of Engineering, Akurdi - Web Technology 1 (CCE-5)
 * ============================================================================
 *
 * Concepts Demonstrated for Viva:
 * 1. JavaScript Client-Side Form Validation:
 *    - Real-time field validation on 'input' and 'blur' events
 *    - Regular Expressions for Email (`/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/`)
 *    - Regular Expressions for 10-digit Indian Mobile Numbers (`/^[6-9]\d{9}$/`)
 *    - Character length and required field constraints
 *    - Dynamic error message rendering and CSS state toggling (.is-invalid, .is-valid)
 * 2. LocalStorage Persistence:
 *    - Storing submitted enquiries client-side as JSON in `localStorage`
 *    - Displaying a dynamic table of past submissions
 *    - Client-side deletion / clearing of stored data
 * 3. User feedback via Toast notifications
 * ============================================================================
 */

const ValidationModule = (function () {
  const LOCAL_STORAGE_KEY = 'dypcoe_enquiries_list';

  /**
   * Validation Rules and Regular Expressions
   */
  const rules = {
    name: {
      required: true,
      minLength: 3,
      regex: /^[a-zA-Z\s.]+$/,
      errorMsg: 'Please enter a valid student name (at least 3 letters, alphabets only).'
    },
    email: {
      required: true,
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      errorMsg: 'Please enter a valid email address (e.g. student@example.com).'
    },
    phone: {
      required: true,
      regex: /^[6-9]\d{9}$/,
      errorMsg: 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9.'
    },
    department: {
      required: true,
      validate: (val) => val !== '' && val !== 'SELECT',
      errorMsg: 'Please choose an engineering department.'
    },
    subject: {
      required: true,
      minLength: 4,
      errorMsg: 'Please enter an enquiry subject (minimum 4 characters).'
    },
    message: {
      required: true,
      minLength: 15,
      errorMsg: 'Please enter a detailed enquiry message (minimum 15 characters).'
    }
  };

  /**
   * Validates a single input field
   * @param {string} fieldId - ID of form element
   * @param {string} value - Current value
   * @returns {Object} { isValid: boolean, message: string }
   */
  function validateField(fieldId, value) {
    const rule = rules[fieldId];
    if (!rule) return { isValid: true, message: '' };

    const trimmed = (value || '').trim();

    if (rule.required && trimmed === '') {
      return { isValid: false, message: 'This field is required.' };
    }

    if (rule.minLength && trimmed.length < rule.minLength) {
      return { isValid: false, message: rule.errorMsg };
    }

    if (rule.regex && !rule.regex.test(trimmed)) {
      return { isValid: false, message: rule.errorMsg };
    }

    if (typeof rule.validate === 'function' && !rule.validate(trimmed)) {
      return { isValid: false, message: rule.errorMsg };
    }

    return { isValid: true, message: '' };
  }

  /**
   * Applies visual validation state to the input field
   */
  function setFieldState(inputEl, errorEl, result) {
    if (result.isValid) {
      inputEl.classList.remove('is-invalid');
      inputEl.classList.add('is-valid');
      if (errorEl) {
        errorEl.textContent = '';
        errorEl.style.display = 'none';
      }
    } else {
      inputEl.classList.remove('is-valid');
      inputEl.classList.add('is-invalid');
      if (errorEl) {
        errorEl.textContent = result.message;
        errorEl.style.display = 'block';
      }
    }
  }

  /**
   * Renders the complete Contact & Enquiry Page (/contact)
   */
  function renderContactPage() {
    return `
      <!-- Page Banner -->
      <section class="page-banner">
        <div class="container">
          <h1 class="page-banner-title">Contact & Campus Admissions</h1>
          <div class="page-banner-breadcrumb">
            <a href="/" data-link>Home</a>
            <span>/</span>
            <span>Contact</span>
          </div>
        </div>
      </section>

      <!-- Main Contact & Form Section -->
      <section class="section section-light">
        <div class="container">
          <div class="contact-layout">
            <!-- Left Column: Campus Details & Office Hours -->
            <div class="contact-info-card">
              <span class="section-badge section-badge-white">Get in Touch</span>
              <h2 class="contact-info-title">D. Y. Patil College of Engineering</h2>
              <p class="contact-info-desc">
                Located in the heart of the automotive and IT industrial corridor in Akurdi, Pune. Our academic counsel and admission desk are open to help you navigate engineering aspirations.
              </p>

              <div class="contact-info-items">
                <div class="contact-info-item">
                  <div class="contact-info-icon">📍</div>
                  <div>
                    <h4 class="contact-item-title">Campus Address</h4>
                    <p class="contact-item-text">
                      D. Y. Patil Educational Complex, Sector 29, Nigdi Pradhikaran, Akurdi, Pune - 411044, Maharashtra, India.
                    </p>
                  </div>
                </div>

                <div class="contact-info-item">
                  <div class="contact-info-icon">📞</div>
                  <div>
                    <h4 class="contact-item-title">Telephone Numbers</h4>
                    <p class="contact-item-text">
                      Administrative Office: +91 (020) 27653058<br />
                      Admission Helpline: +91 97637 14455 / 98509 99999
                    </p>
                  </div>
                </div>

                <div class="contact-info-item">
                  <div class="contact-info-icon">✉️</div>
                  <div>
                    <h4 class="contact-item-title">Official Email Addresses</h4>
                    <p class="contact-item-text">
                      Principal Office: principal@dypcoeakurdi.ac.in<br />
                      Admissions Cell: admissions@dypcoeakurdi.ac.in
                    </p>
                  </div>
                </div>

                <div class="contact-info-item">
                  <div class="contact-info-icon">⏰</div>
                  <div>
                    <h4 class="contact-item-title">Visiting & Office Hours</h4>
                    <p class="contact-item-text">
                      Monday to Saturday: 9:00 AM – 5:30 PM<br />
                      Closed on Sundays and Public Holidays
                    </p>
                  </div>
                </div>
              </div>

              <!-- Map Embed Placeholder -->
              <div style="background: rgba(255,255,255,0.08); padding: 1.25rem; border-radius: var(--radius-md); border: 1px solid rgba(255,255,255,0.15);">
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 0.5rem;">
                  <span style="font-weight: 700; color: #FFFFFF; font-size: 0.9rem;">Interactive Campus Map</span>
                  <span style="font-size: 0.75rem; background: var(--secondary-blue); padding: 0.15rem 0.5rem; border-radius: var(--radius-sm); color: #FFF;">Akurdi Station (500m)</span>
                </div>
                <p style="font-size: 0.82rem; color: #CBD5E1; margin-bottom: 0.75rem;">
                  Walking distance from Akurdi Railway Station and Old Mumbai-Pune National Highway (NH-48).
                </p>
                <a
                  href="https://maps.google.com/?q=D.+Y.+Patil+College+of+Engineering+Akurdi+Pune"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="btn btn-outline-white btn-sm"
                  style="width: 100%; text-align: center;"
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>

            <!-- Right Column: Enquiry Form -->
            <div class="enquiry-form-card">
              <div class="enquiry-form-header">
                <span class="section-badge">Client-Side Validated</span>
                <h3 class="enquiry-form-title">Student Admission Enquiry</h3>
                <p class="enquiry-form-subtitle">
                  Fill in your details below. This form demonstrates complete JavaScript client-side validation and LocalStorage saving as part of the CCE-5 SPA project requirements.
                </p>
              </div>

              <form id="enquiry-form" novalidate>
                <div class="form-grid">
                  <!-- Student Name -->
                  <div class="form-group">
                    <label for="name" class="form-label">
                      Full Name <span class="form-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      class="form-control"
                      placeholder="e.g. Aarav Sharma"
                      required
                    />
                    <div id="error-name" class="form-error-feedback"></div>
                  </div>

                  <!-- Email Address -->
                  <div class="form-group">
                    <label for="email" class="form-label">
                      Email Address <span class="form-required">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      class="form-control"
                      placeholder="e.g. aarav@example.com"
                      required
                    />
                    <div id="error-email" class="form-error-feedback"></div>
                  </div>

                  <!-- Mobile Number -->
                  <div class="form-group">
                    <label for="phone" class="form-label">
                      Mobile Number <span class="form-required">*</span>
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      class="form-control"
                      placeholder="10-digit Indian Mobile (e.g. 9876543210)"
                      maxlength="10"
                      required
                    />
                    <div id="error-phone" class="form-error-feedback"></div>
                  </div>

                  <!-- Department Selection -->
                  <div class="form-group">
                    <label for="department" class="form-label">
                      Interested Department <span class="form-required">*</span>
                    </label>
                    <select id="department" name="department" class="form-control" required>
                      <option value="">-- Select Engineering Department --</option>
                      <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                      <option value="Computer Engineering">Computer Engineering</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                      <option value="Civil Engineering">Civil Engineering</option>
                      <option value="Electronics & Telecommunication">Electronics & Telecommunication</option>
                    </select>
                    <div id="error-department" class="form-error-feedback"></div>
                  </div>

                  <!-- Enquiry Subject -->
                  <div class="form-group full-width">
                    <label for="subject" class="form-label">
                      Enquiry Subject <span class="form-required">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      class="form-control"
                      placeholder="e.g. Admission Criteria for B.Tech Direct Second Year 2026"
                      required
                    />
                    <div id="error-subject" class="form-error-feedback"></div>
                  </div>

                  <!-- Message -->
                  <div class="form-group full-width">
                    <label for="message" class="form-label">
                      Enquiry Message / Queries <span class="form-required">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      class="form-control"
                      placeholder="Please write your questions regarding eligibility, cutoff, hostel facilities, or campus placement..."
                      rows="4"
                      required
                    ></textarea>
                    <div id="error-message" class="form-error-feedback"></div>
                  </div>
                </div>

                <div style="margin-top: 1.5rem; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1rem;">
                  <button type="submit" id="submit-enquiry-btn" class="btn btn-primary btn-lg">
                    Submit Enquiry Form →
                  </button>
                  <button type="button" id="reset-form-btn" class="btn btn-outline btn-sm">
                    Reset Form
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- LocalStorage Demonstration Box (CCE-5 Practical Demonstration) -->
          <div class="enquiries-history-box" id="enquiries-history-box">
            <div class="history-box-header">
              <div style="display: flex; align-items: center; gap: 0.75rem;">
                <h3 class="history-title">Submitted Enquiries Log</h3>
                <span class="history-badge">LocalStorage Stored</span>
              </div>
              <button
                type="button"
                id="clear-enquiries-btn"
                class="btn btn-outline btn-sm"
                style="color: var(--color-danger); border-color: var(--color-danger);"
              >
                Clear Saved Submissions
              </button>
            </div>
            <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
              <strong>Viva Demonstration Note:</strong> Demonstrating client-side form submission & browser LocalStorage data storage without an external server backend.
            </p>
            <div class="history-table-responsive" id="enquiries-table-wrap">
              ${renderEnquiriesTable()}
            </div>
          </div>
        </div>
      </section>
    `;
  }

  /**
   * Retrieves saved enquiries from LocalStorage
   * @returns {Array} List of enquiries
   */
  function getSavedEnquiries() {
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return [];
    }
  }

  /**
   * Saves a new enquiry into LocalStorage
   */
  function saveEnquiry(enquiry) {
    try {
      const list = getSavedEnquiries();
      list.unshift(enquiry); // newest first
      // Keep up to 20 entries
      if (list.length > 20) list.pop();
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage write error:', e);
    }
  }

  /**
   * Clears saved enquiries from LocalStorage
   */
  function clearEnquiries() {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.warn('LocalStorage remove error:', e);
    }
  }

  /**
   * Renders the HTML table of LocalStorage enquiries
   */
  function renderEnquiriesTable() {
    const list = getSavedEnquiries();

    if (list.length === 0) {
      return `
        <div style="text-align: center; padding: 2rem 1rem; color: var(--text-muted); font-size: 0.9rem;">
          No enquiries submitted yet in this browser session. Fill and submit the form above to see live LocalStorage persistence!
        </div>
      `;
    }

    return `
      <table class="history-table">
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>Candidate Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Department</th>
            <th>Subject</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(item => `
            <tr>
              <td><strong>${item.date}</strong></td>
              <td>${item.name}</td>
              <td>${item.email}</td>
              <td>${item.phone}</td>
              <td><span style="font-weight: 600; color: var(--secondary-blue);">${item.department}</span></td>
              <td>${item.subject}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  /**
   * Initializes event listeners on the Enquiry Form after DOM is injected
   */
  function initEvents() {
    const form = document.getElementById('enquiry-form');
    if (!form) return;

    const fields = ['name', 'email', 'phone', 'department', 'subject', 'message'];

    // Real-time validation on blur & input
    fields.forEach(fieldId => {
      const input = document.getElementById(fieldId);
      const error = document.getElementById(`error-${fieldId}`);
      if (!input) return;

      input.addEventListener('blur', () => {
        const result = validateField(fieldId, input.value);
        setFieldState(input, error, result);
      });

      input.addEventListener('input', () => {
        // If it was already invalid, re-validate to clear error immediately as user types
        if (input.classList.contains('is-invalid')) {
          const result = validateField(fieldId, input.value);
          setFieldState(input, error, result);
        }
      });
    });

    // Form submission handler
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let isFormValid = true;
      const formData = {};

      fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        const error = document.getElementById(`error-${fieldId}`);
        if (!input) return;

        const result = validateField(fieldId, input.value);
        setFieldState(input, error, result);

        if (!result.isValid) {
          isFormValid = false;
        } else {
          formData[fieldId] = input.value.trim();
        }
      });

      if (!isFormValid) {
        if (window.app && typeof window.app.showToast === 'function') {
          window.app.showToast('Please correct the highlighted form errors.', 'danger');
        }
        return;
      }

      // Add timestamp
      const now = new Date();
      formData.date = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      // Save to LocalStorage
      saveEnquiry(formData);

      // Show success toast
      if (window.app && typeof window.app.showToast === 'function') {
        window.app.showToast(
          `Thank you ${formData.name}! Your enquiry for ${formData.department} has been recorded successfully.`,
          'success',
          5000
        );
      }

      // Reset form
      form.reset();
      fields.forEach(fieldId => {
        const input = document.getElementById(fieldId);
        if (input) {
          input.classList.remove('is-valid', 'is-invalid');
        }
      });

      // Re-render enquiries table
      const tableWrap = document.getElementById('enquiries-table-wrap');
      if (tableWrap) {
        tableWrap.innerHTML = renderEnquiriesTable();
      }
    });

    // Reset button
    const resetBtn = document.getElementById('reset-form-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        form.reset();
        fields.forEach(fieldId => {
          const input = document.getElementById(fieldId);
          const error = document.getElementById(`error-${fieldId}`);
          if (input) input.classList.remove('is-valid', 'is-invalid');
          if (error) {
            error.textContent = '';
            error.style.display = 'none';
          }
        });
      });
    }

    // Clear saved submissions button
    const clearBtn = document.getElementById('clear-enquiries-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all client-side saved enquiries from LocalStorage?')) {
          clearEnquiries();
          const tableWrap = document.getElementById('enquiries-table-wrap');
          if (tableWrap) {
            tableWrap.innerHTML = renderEnquiriesTable();
          }
          if (window.app && typeof window.app.showToast === 'function') {
            window.app.showToast('Saved enquiry records cleared.', 'warning');
          }
        }
      });
    }
  }

  return {
    renderContactPage,
    initEvents,
    getSavedEnquiries,
    saveEnquiry,
    clearEnquiries
  };
})();

window.ValidationModule = ValidationModule;
