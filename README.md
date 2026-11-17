# Smart College Website Portal
### Dr. D. Y. Patil College of Engineering, Akurdi, Pune
**Course:** Web Technology 1 (CCE-5) | **Unit V:** Single Page Application (SPA) Concepts  
**Academic Year:** 2026–2027 | **Affiliation:** Savitribai Phule Pune University (SPPU)

---

## 1. Project Title
**Smart College Website Portal – Dr. D. Y. Patil College of Engineering, Akurdi, Pune**

A modern, responsive, and fully functional **Single Page Application (SPA)** built exclusively with vanilla web technologies (HTML5, CSS3, JavaScript ES6+, Fetch API, HTML5 History API, and LocalStorage).

---

## 2. Project Introduction
The **Smart College Website Portal** is an individual mini-project developed for the **Web Technology 1 (CCE-5)** continuous evaluation. The portal represents a production-grade digital presence for **Dr. D. Y. Patil College of Engineering (DYPCOE), Akurdi, Pune** (Estd. 1984, NAAC 'A+' Grade with 3.29 CGPA, NBA Accredited, AICTE Approved, DTE Institute Code: 6272).

Unlike traditional multi-page college websites that trigger full-page white flashes and reloads on every menu click, this portal employs **Single Page Application (SPA)** architecture. Navigation occurs smoothly without page refreshes, views are rendered dynamically into the DOM, and data is retrieved asynchronously via the Fetch API from structured JSON files.

---

## 3. Problem Identification
Traditional university and college web portals suffer from several usability and architectural drawbacks:
1. **Full Page Reloads & High Latency:** Clicking between departments, faculty lists, and circulars re-downloads the entire page (header, footer, styles, scripts) repeatedly, wasting bandwidth and causing jarring screen flashes.
2. **Fragmented Data Architecture:** Information is often hardcoded in multiple static HTML files, making syllabus, fee structures, faculty rosters, and notices tedious to update and maintain.
3. **Poor Mobile Experience:** Rigid multi-page layouts cause horizontal scrolling, layout shifts, and non-responsive tables on smaller smartphone viewports.
4. **Lack of Instant Feedback:** Enquiry forms submit synchronously, requiring full page submission cycles without real-time client-side regex validation.

---

## 4. Project Objectives
The key objectives of this project are:
- **Demonstrate SPA Concepts:** Implement client-side routing using the **HTML5 History API** (`pushState`, `replaceState`, `popstate` event) without third-party frameworks like React, Angular, or Vue.
- **Asynchronous Data Handling:** Fetch and display dynamic academic departments, courses, faculty directories, and notices from separated JSON data files using the modern **Fetch API** and `async/await`.
- **Dynamic DOM Rendering:** Generate and update page views, cards, modals, and tables dynamically inside `<main id="app">`.
- **Client-Side Form Validation:** Enforce strict client-side validation rules (regex-based email validation, 10-digit Indian phone validation, required fields) with immediate inline error feedback.
- **State Persistence:** Leverage browser **LocalStorage** to maintain submitted enquiries and demonstrate data persistence without a dedicated backend server.
- **Responsive & Accessible Design:** Provide an intuitive mobile-first experience using modern CSS Grid, Flexbox, custom properties, and accessible touch targets.

---

## 5. Technologies Used

| Technology | Purpose in Project |
| :--- | :--- |
| **HTML5** | Semantic structure (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<aside>`) |
| **CSS3** | Custom design system with CSS Variables, Flexbox, Grid, keyframe animations, and media queries |
| **Vanilla JavaScript (ES6+)** | Object-oriented SPA router, event delegation, dynamic DOM rendering, and modular architecture |
| **HTML5 History API** | `history.pushState()`, `history.replaceState()`, and `window.onpopstate` for SPA routing |
| **Fetch API** | Asynchronous retrieval of JSON files (`fetch()`, Promises, and `async/await`) |
| **JSON** | Lightweight dynamic data stores for departments, courses, faculty, and circulars |
| **LocalStorage API** | Client-side persistent storage for student admission enquiry submissions |

*Note: No frontend frameworks (React, Angular, Vue, jQuery, Bootstrap) were used. All logic is pure vanilla JavaScript.*

---

## 6. Features & Highlights

### A. Single Page Application (SPA) Engine
- **Zero Full-Page Reloads:** Navigation between views happens instantly in-memory.
- **History API Navigation:** Changes the browser URL dynamically (`/`, `/about`, `/departments`, `/courses`, `/faculty`, `/notices`, `/contact`) and updates browser history.
- **Browser Back & Forward Support:** Seamlessly handles browser navigation buttons via `popstate` event listening.
- **Dynamic Parameterized Routes:** Supports sub-views such as `/departments/:id` (e.g. `/departments/comp`, `/departments/aids`).
- **Active Navigation Highlighting:** Navigation links automatically highlight the active section.
- **Dual Mode Support:** Operates seamlessly over standard HTTP/HTTPS servers as well as local `file:///` protocol environments.

### B. Header & Navigation
- **Sticky Navbar:** Smooth glassmorphic transition and drop-shadow on page scroll.
- **College Brand Crest:** Custom SVG vector college emblem with engineering gear, torch of knowledge, and affiliation details.
- **Responsive Hamburger Drawer:** Mobile drawer menu with slide-in animation and backdrop blur.

### C. Home Page View
- **Hero Section:** High-impact engineering campus imagery, primary call-to-actions, and key metric counters (40+ Years Legacy, 1080+ Intake, 43 LPA Highest Package, 15,000+ Alumni).
- **Welcome & Accreditation Section:** Highlighting NAAC 'A+' Grade (3.29 CGPA), NBA Accreditations, and SPPU affiliation.
- **Academic Highlights:** Centers of Excellence, Industry 4.0 Labs, Digital Knowledge Center, and Placement Records.
- **Departments Showcase:** Live preview cards for all 6 engineering branches.
- **Live Circulars Widget:** Real-time top notices loaded from `data/notices.json`.
- **Why Choose DYPCOE:** 6 institutional pillars including racing teams (BAJA SAE), tech incubation, and top faculty.
- **Interactive Campus Life Gallery:** Filterable campus photography with full-screen modal preview.

### D. Academic Departments View (`/departments` and `/departments/:id`)
- 6 Engineering Disciplines:
  1. Artificial Intelligence & Data Science (AIDS)
  2. Computer Engineering (COMP)
  3. Information Technology (IT)
  4. Mechanical Engineering (MECH)
  5. Civil Engineering (CIVIL)
  6. Electronics & Telecommunication (E&TC)
- Detailed Department View featuring:
  - Department overview, vision, and mission points
  - Specialized laboratories with hardware and software inventory
  - Academic degrees offered
  - Head of Department (HOD) profile, message, and direct contact
  - Career opportunities and student achievements

### E. Courses & Academic Catalog (`/courses`)
- Comprehensive list of B.Tech (UG), M.Tech (PG), and Ph.D. degree programs.
- **Interactive Degree Filtering:** Real-time filter pills ("All Programs", "Undergraduate", "Postgraduate", "Doctoral").
- **Live Search Bar:** Instant debounced search filtering by course title or department.
- **Detailed Program Modal:** Pop-up dialog with full eligibility criteria, intake, fee structure, and curriculum highlights.

### F. Faculty Directory (`/faculty`)
- Faculty profiles featuring designation, qualification, teaching experience, email, and research interests.
- **Department-wise Filter Dropdown:** View professors by specific department.
- **Live Faculty Search:** Instant search by professor name, subject, or research specialization.
- **Sample Data Disclaimer:** Clearly marked demonstration badges as required for academic evaluations.
- **Faculty Profile Modal:** Comprehensive biography, publication count, and subjects handled.

### G. Dynamic Notice Board (`/notices`)
- Filter circulars by category: Academic, Examination, Events, Admission, and Circulars.
- **Priority / Urgent Alert Banner:** Top scrolling alert for time-sensitive circulars.
- **Notice Reader Modal:** Official announcement view with issuing authority and PDF download simulation.

### H. Contact & Enquiry Form (`/contact`)
- Campus location details, telephone extensions, visiting hours, and Google Maps link.
- **Client-Side Form Validation:**
  - Full Name: Required, minimum 3 characters, alphabets only.
  - Email Address: Regex validation (`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`).
  - Mobile Number: 10-digit Indian mobile validation starting with 6, 7, 8, or 9 (`^[6-9]\d{9}$`).
  - Department: Required dropdown selection.
  - Subject: Required, minimum 4 characters.
  - Message: Required, minimum 15 characters.
  - Real-time feedback on input and blur events.
- **LocalStorage Data Persistence:**
  - Form submissions are stored client-side in browser `localStorage`.
  - Live "Submitted Enquiries Log" table rendered beneath the form.
  - Clear history button to reset stored submissions.
- **Interactive Toast Notifications:** Animated success and error toasts for user feedback.

---

## 7. Single Page Application (SPA) Implementation Details

### How the SPA Routing Engine Works
1. **Route Mapping:**  
   The application initializes a `Router` instance in `js/router.js`. Each route registers a URL path pattern, a render function, and a page title:
   ```javascript
   router.addRoute('/departments', () => DepartmentsModule.renderDepartmentsPage(), 'Departments | DYPCOE');
   router.addRoute('/departments/:id', (params) => DepartmentsModule.renderDepartmentDetail(params), 'Department Details | DYPCOE');
   ```

2. **Intercepting Navigation:**  
   A global click listener intercepts clicks on internal anchor links (`<a href="/courses">`):
   ```javascript
   document.addEventListener('click', (e) => {
     const target = e.target.closest('a');
     if (target && isInternalLink(target)) {
       e.preventDefault(); // Prevents full-page reload
       router.navigateTo(target.getAttribute('href'));
     }
   });
   ```

3. **History API (`pushState`):**  
   The `navigateTo` method updates the browser URL bar and pushes the new state onto the browser history stack without making a server request:
   ```javascript
   window.history.pushState(null, null, cleanUrl);
   ```

4. **Handling Browser Back/Forward (`popstate`):**  
   When the user clicks the browser Back or Forward button, a `popstate` event fires, triggering route resolution:
   ```javascript
   window.addEventListener('popstate', () => {
     this.resolveCurrentRoute();
   });
   ```

5. **Dynamic DOM Injection:**  
   The matched route view function executes asynchronously (fetching JSON data if needed) and returns an HTML string, which is injected into `<main id="app">`:
   ```javascript
   const htmlContent = await match.route.view(params);
   this.appContainer.innerHTML = `<div class="page-view">${htmlContent}</div>`;
   ```

---

## 8. JSON Data Architecture

Data is decoupled from HTML templates and stored cleanly in the `data/` folder:

| File | Content | Sample Record Count |
| :--- | :--- | :--- |
| `data/departments.json` | Engineering branches, HOD info, labs, achievements, vision, and mission | 6 Departments |
| `data/courses.json` | UG, PG, and Ph.D. degree offerings, duration, eligibility, fees, and highlights | 11 Courses |
| `data/faculty.json` | Professors, designations, qualifications, research areas, and contact | 13 Profiles |
| `data/notices.json` | SPPU exams, admissions, symposia, placement drives, and circulars | 8 Notices |

### Fetch API Workflow
```javascript
async function fetchDepartments() {
  if (departmentsCache) return departmentsCache;
  const response = await fetch('data/departments.json');
  if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
  departmentsCache = await response.json();
  return departmentsCache;
}
```

---

## 9. Project Folder Structure

```
smart-college-portal/
│
├── index.html                  # Single Page Application main entry file
│
├── css/
│   └── style.css               # Complete responsive design system & theme
│
├── js/
│   ├── app.js                  # Application initialization & page view renderers
│   ├── router.js               # HTML5 History API SPA routing engine
│   ├── departments.js          # Department cards, details & labs controller
│   ├── courses.js              # Course catalog, search & filtering logic
│   ├── faculty.js              # Faculty directory, search & profile modal
│   ├── notices.js              # Notice board, categories & ticker system
│   └── validation.js           # Client-side form validation & LocalStorage
│
├── data/
│   ├── departments.json        # Academic departments JSON data
│   ├── courses.json            # Degree courses & eligibility JSON data
│   ├── faculty.json            # Faculty directory JSON data
│   ├── notices.json            # Circulars and notice board JSON data
│   └── fallback-data.js        # Offline & file:/// protocol fallback registry
│
├── assets/
│   ├── icons/
│   │   └── college-logo.svg    # Official DYPCOE college emblem vector SVG
│   └── images/                 # Campus, lab, and event graphics
│
└── README.md                   # Comprehensive project documentation
```

---

## 10. Instructions to Run the Project

### Method 1: Using VS Code Live Server (Recommended)
1. Open the project folder in **Visual Studio Code**.
2. Install the **Live Server** extension by *Ritwick Dey* (if not already installed).
3. Right-click `index.html` and click **"Open with Live Server"**.
4. The website will launch automatically at `http://127.0.0.1:5500/`.

### Method 2: Using Python HTTP Server
Open PowerShell or Terminal in the project root folder and execute:
```bash
# Python 3
python -m http.server 8000
```
Open your browser and visit: `http://localhost:8000`

### Method 3: Using Node.js `serve` / `npx`
```bash
npx serve .
```

### Method 4: Direct Browser Double-Click (`file:///`)
Thanks to the included `data/fallback-data.js` registry and hash fallback in `js/router.js`, you can also double-click `index.html` to open it directly in Google Chrome, Microsoft Edge, or Mozilla Firefox!

---

## 11. Viva Voce Preparation Guide (CCE-5 Unit V)

### Q1: What is a Single Page Application (SPA)?
**Answer:** An SPA is a web application that loads a single HTML page (`index.html`) once. Subsequent navigation occurs dynamically by updating the Document Object Model (DOM) via JavaScript without reloading the entire page from the server.

### Q2: What is the HTML5 History API and why is it used?
**Answer:** The History API provides programmatic control over the browser session history stack. Methods like `history.pushState(state, title, url)` allow changing the URL displayed in the address bar without triggering a network fetch or browser page reload. The `popstate` event listens for when the user navigates using the Back or Forward buttons.

### Q3: How is data loaded dynamically?
**Answer:** Using the native JavaScript **Fetch API**. `fetch('data/departments.json')` returns a Promise resolving to the Response object. Using `await response.json()`, the JSON text is parsed into JavaScript objects, and dynamic HTML template strings are generated and injected into `<main id="app">`.

### Q4: How is client-side validation implemented?
**Answer:** Event listeners on `input` and `blur` events evaluate fields against regular expressions (`/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` for email and `/^[6-9]\d{9}$/` for Indian mobile numbers). If validation fails, error messages are injected and the `.is-invalid` CSS class is applied, preventing form submission until all criteria are met.

### Q5: How is LocalStorage used in this project?
**Answer:** When the student enquiry form passes validation, the form data is saved into browser `localStorage` as a JSON string under the key `'dypcoe_enquiries_list'`. It is retrieved using `localStorage.getItem()` and dynamically rendered into a submission history log table.

---

## 12. Verification & Testing Checklist

- [x] All 7 main navigation links work without full-page reload
- [x] Browser Back and Forward buttons work via `popstate`
- [x] Dynamic sub-route `/departments/:id` renders detailed department view
- [x] All 4 JSON files (`departments.json`, `courses.json`, `faculty.json`, `notices.json`) load asynchronously via Fetch API
- [x] Course catalog degree filtering (UG, PG, PhD) and live search work
- [x] Faculty directory search and department filter work
- [x] Notice board category tabs and urgent notice ticker work
- [x] Enquiry form validates empty fields, email regex, and 10-digit phone regex
- [x] LocalStorage saves and renders enquiry submissions
- [x] Responsive layout verified on mobile, tablet, laptop, and desktop viewports
- [x] Zero JavaScript console errors

---

## 13. College Details & Acknowledgments
- **Institution:** Dr. D. Y. Patil College of Engineering, Akurdi, Pune - 411044
- **Department:** Computer Engineering / Information Technology
- **Course:** Web Technology 1 (CCE-5)
- **Topic:** Unit V – Single Page Application (SPA) Concepts
- **Academic Year:** 2026–2027
