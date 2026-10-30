/* ====================================================
   PAGE ENGINE & CATALOG DATA
   ==================================================== */

const heroImageUrl = "hero-image.jpg";

/* ITEMS ARRAY (MAIN CATALOG) */
const items = [];

/* LIFE PORTFOLIO IMAGES ARRAY
   Add your image file paths here.
*/
const lifePortfolioImages = [
  { img: "0001_1A_1.jpg" },
  { img: "0002_2A_1.jpg" },
  { img: "0003_3A_1.jpg" },
  { img: "0004_4A_1.jpg" },
  { img: "0005_5A_1.jpg" }
];

let currentPage = 'all';

/* DOM ELEMENTS */
const mainGrid = document.getElementById('main');
const controlsBar = document.getElementById('controls-bar');
const pageTitleIndicator = document.getElementById('page-title-indicator');
const aboutSection = document.getElementById('about-section');
const lifeSection = document.getElementById('life-section');
const lifeStreamContainer = document.getElementById('life-stream-container');
const lifeStreamTrack = document.getElementById('life-stream-track');
const navHomeBtn = document.getElementById('nav-home');
const navAboutBtn = document.getElementById('nav-about');
const navLifeBtn = document.getElementById('nav-life');

/* SCROLL ANIMATION STATE */
let scrollY = 0;
let animationFrameId = null;
const scrollSpeed = 0.8; // Speed of auto-scroll in pixels per frame

/* SIZE VARIANTS FOR MASONRY PATTERN */
const sizeVariants = ['size-sm', 'size-md', 'size-lg', 'size-wide'];

/* RENDER LIFE PORTFOLIO MASONRY GRID (PURE IMAGES) */
function renderLifeStream() {
  if (!lifeStreamTrack) return;
  
  // Assign predefined sizes for varied masonry layout (image only)
  const entriesHtml = lifePortfolioImages.map((item, index) => {
    const sizeClass = sizeVariants[index % sizeVariants.length];
    
    return `
      <div class="portfolio-entry ${sizeClass}" onclick="openLightbox('${item.img}')">
        <img src="${item.img}" alt="Portfolio Image" class="portfolio-entry-img" onerror="this.parentNode.style.display='none';" />
      </div>
    `;
  }).join('');

  // Duplicate set to facilitate uninterrupted looping
  lifeStreamTrack.innerHTML = entriesHtml + entriesHtml;
}

/* CONTINUOUS INDEPENDENT AUTO-SCROLL LOOP */
function autoScrollStream() {
  if (!lifeStreamTrack || !lifeSection.classList.contains('active')) return;

  scrollY += scrollSpeed;
  
  // Determine half-height of content track for smooth loop wrap
  const halfHeight = lifeStreamTrack.scrollHeight / 2;

  if (scrollY >= halfHeight) {
    scrollY = 0;
  }

  lifeStreamTrack.style.transform = `translateY(-${scrollY}px)`;
  animationFrameId = requestAnimationFrame(autoScrollStream);
}

function startAutoScroll() {
  if (!animationFrameId) {
    animationFrameId = requestAnimationFrame(autoScrollStream);
  }
}

function stopAutoScroll() {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
}

/* LIGHTBOX HANDLERS */
function openLightbox(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  if (lightbox && lightboxImg) {
    lightboxImg.src = src;
    lightbox.classList.add('active');
  }
}

function closeLightbox() {
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    lightbox.classList.remove('active');
  }
}

/* NAVIGATE TO SUB-PAGE OR HOME */
function navigateToPage(pageName) {
  currentPage = pageName || 'all';
  window.location.hash = currentPage;
  renderPage();
}

/* SHOW / HIDE VIEWS BASED ON CURRENT ROUTE */
function showView(view) {
  if (view === 'about') {
    window.location.hash = 'about';
    stopAutoScroll();
    
    mainGrid.style.display = 'none';
    controlsBar.style.display = 'none';
    if (pageTitleIndicator) pageTitleIndicator.style.display = 'none';
    aboutSection.classList.add('active');
    if (lifeSection) lifeSection.classList.remove('active');

    navHomeBtn.classList.remove('active');
    navAboutBtn.classList.add('active');
    if (navLifeBtn) navLifeBtn.classList.remove('active');
    
    document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));
  } else if (view === 'life') {
    window.location.hash = 'life';

    mainGrid.style.display = 'none';
    controlsBar.style.display = 'none';
    if (pageTitleIndicator) pageTitleIndicator.style.display = 'none';
    if (aboutSection) aboutSection.classList.remove('active');
    lifeSection.classList.add('active');

    navHomeBtn.classList.remove('active');
    navAboutBtn.classList.remove('active');
    if (navLifeBtn) navLifeBtn.classList.add('active');

    document.querySelectorAll('.control-btn').forEach(btn => btn.classList.remove('active'));

    // Start independent scroll loop
    startAutoScroll();
  } else {
    window.location.hash = '';
    stopAutoScroll();

    mainGrid.style.display = 'grid';
    controlsBar.style.display = 'flex';
    if (pageTitleIndicator) pageTitleIndicator.style.display = 'block';
    if (aboutSection) aboutSection.classList.remove('active');
    if (lifeSection) lifeSection.classList.remove('active');

    navHomeBtn.classList.add('active');
    navAboutBtn.classList.remove('active');
    if (navLifeBtn) navLifeBtn.classList.remove('active');
  }
}

/* RENDER CONTENTS OF THE ACTIVE SUB-PAGE */
function renderPage() {
  showView('home');

  if (pageTitleIndicator) {
    pageTitleIndicator.textContent = `[ page / ${currentPage} ]`;
  }

  const buttons = document.querySelectorAll('.control-btn');
  buttons.forEach(btn => {
    const btnPage = btn.getAttribute('data-page');
    btn.classList.toggle('active', btnPage === currentPage);
  });

  const filtered = items.filter(item => {
    if (currentPage === 'all') return true;
    return item.page === currentPage || item.cat === currentPage || item.discipline === currentPage;
  });

  mainGrid.innerHTML = '';

  if (filtered.length === 0) {
    mainGrid.innerHTML = `
      <div class="hero-container">
        <img src="${heroImageUrl}" alt="Julian Quintana Cañez" class="hero-image" onerror="this.style.display='none'; this.parentNode.innerText='[ image placeholder ]';" />
      </div>
    `;
    return;
  }

  filtered.forEach(item => {
    const card = document.createElement('div');
    card.className = 'item-card';

    const imageContent = item.img 
      ? `<img src="${item.img}" alt="${item.title}">` 
      : `<span>[ image placeholder ]</span>`;

    const detailsHtml = (item.details || []).map(d => `<div class="item-detail">${d}</div>`).join('');

    card.innerHTML = `
      <div class="item-num">${item.num || ''}</div>
      <div class="item-title">${item.title || ''}</div>
      <div class="item-price">${item.price || ''}</div>
      ${detailsHtml}
      <div class="item-img-box">${imageContent}</div>
      <button class="item-btn" onclick="alert('Viewing: ${item.title}')">${item.btnLabel || 'view'}</button>
      <div class="item-divider">\\//\\</div>
    `;

    mainGrid.appendChild(card);
  });
}

/* HASH ROUTER */
function handleHashChange() {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'about') {
    showView('about');
  } else if (hash === 'life') {
    showView('life');
  } else if (hash) {
    currentPage = hash;
    renderPage();
  } else {
    currentPage = 'all';
    renderPage();
  }
}

window.addEventListener('hashchange', handleHashChange);

/* DAWN / DUSK THEME TOGGLE */
function toggleTheme() {
  const currentTheme = document.body.getAttribute('data-theme');
  if (currentTheme === 'dark') {
    document.body.removeAttribute('data-theme');
  } else {
    document.body.setAttribute('data-theme', 'dark');
  }
}

/* LIVE 14-DIGIT COUNTER */
let counterValue = 0;

function updateCounter() {
  counterValue++;
  const formatted = String(counterValue).padStart(14, '0');
  const counterEl = document.getElementById('live-counter');
  if (counterEl) {
    counterEl.textContent = formatted;
  }
}

setInterval(updateCounter, 1000);
updateCounter();

// Initialize page content
renderLifeStream();
handleHashChange();