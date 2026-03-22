/* ============================================
   nav.js — Gemeinsame Navigation
   ============================================ */

// Aktuelle Seite ermitteln
const _page = window.location.pathname.split('/').pop() || 'index.html';

function renderNav(user) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  nav.innerHTML = `
    <div class="nav-logo" onclick="window.location.href='index.html'" style="cursor:pointer">🏠 <span>Inventar</span></div>

    <!-- Hamburger (Mobile) -->
    <button class="nav-hamburger" id="nav-hamburger" onclick="toggleMobileMenu()" aria-label="Menü">
      <span></span><span></span><span></span>
    </button>

    <div class="nav-menu" id="nav-menu">
      <div class="nav-tabs">
        <a class="nav-tab ${_page === 'index.html' || _page === '' ? 'active' : ''}"
           href="index.html">🏠 Räume</a>
        <a class="nav-tab ${_page === 'alle-gegenstaende.html' ? 'active' : ''}"
           href="alle-gegenstaende.html">📋 Alle</a>
        <a class="nav-tab ${_page === 'statistik.html' ? 'active' : ''}"
           href="statistik.html">📊 Statistik</a>
      </div>

      <div class="nav-right">
        <div class="nav-stats">
          <span><strong id="stat-rooms">0</strong> Räume</span>
          <span><strong id="stat-items">0</strong> Gegenstände</span>
        </div>
        ${user
          ? `<a href="konto.html" class="nav-account nav-account--in" title="${user.email}">
               <span class="nav-account-avatar">${(user.displayName || user.email)[0].toUpperCase()}</span>
               <span class="nav-account-label">${user.displayName || 'Konto'}</span>
             </a>`
          : `<a href="konto.html" class="nav-account nav-account--out ${_page === 'konto.html' ? 'active' : ''}">
               🔐 Anmelden
             </a>`
        }
      </div>
    </div>
  `;

  updateNavStats();
}

function toggleMobileMenu() {
  const menu = document.getElementById('nav-menu');
  const btn  = document.getElementById('nav-hamburger');
  menu.classList.toggle('open');
  btn.classList.toggle('open');
}

// Schließe Menü bei Klick außerhalb
document.addEventListener('click', e => {
  const menu = document.getElementById('nav-menu');
  const btn  = document.getElementById('nav-hamburger');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
    btn.classList.remove('open');
  }
});
