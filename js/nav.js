/* ============================================
   nav.js — Navigation & Footer
   ============================================ */

const _page = window.location.pathname.split('/').pop() || 'index.html';

// ── Topbar ────────────────────────────────────
function renderNav(user) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  // Rechts: Anmelden-Button ODER Nutzername
  const accountBtn = user
    ? `<a href="konto.html" class="nav-account nav-account--in" title="Konto: ${user.email}">
         <span class="nav-account-avatar">${(user.displayName || user.email)[0].toUpperCase()}</span>
         <span class="nav-account-label">${user.displayName || user.email.split('@')[0]}</span>
       </a>`
    : `<a href="konto.html" class="nav-account nav-account--out ${_page === 'konto.html' ? 'active' : ''}">
         🔐 Anmelden
       </a>`;

  nav.innerHTML = `
    <a class="nav-logo" href="index.html">🏠 <span>Inventar</span></a>

    <button class="nav-hamburger" id="nav-hamburger" onclick="toggleMobileMenu()" aria-label="Menü öffnen">
      <span></span><span></span><span></span>
    </button>

    <div class="nav-menu" id="nav-menu">
      <div class="nav-tabs">
        <a class="nav-tab ${_page === 'index.html' || _page === '' ? 'active' : ''}"
           href="index.html">🏠 Räume</a>
        <a class="nav-tab ${_page === 'alle-gegenstaende.html' ? 'active' : ''}"
           href="alle-gegenstaende.html">📋 Alle Gegenstände</a>
        <a class="nav-tab ${_page === 'statistik.html' ? 'active' : ''}"
           href="statistik.html">📊 Statistik</a>
      </div>

      <div class="nav-right">
        <div class="nav-stats">
          <span><strong id="stat-rooms">0</strong> Räume</span>
          <span><strong id="stat-items">0</strong> Gegenstände</span>
        </div>
        ${accountBtn}
      </div>
    </div>
  `;

  updateNavStats();
  renderFooter(user);
}

// ── Footer ────────────────────────────────────
function renderFooter(user) {
  const existing = document.getElementById('main-footer');
  if (existing) existing.remove();

  const footer = document.createElement('footer');
  footer.id = 'main-footer';
  footer.innerHTML = `
    <div class="footer-inner">

      <div class="footer-brand">
        <div class="footer-logo">🏠 <span>Wohnungs-Inventar</span></div>
        <p class="footer-tagline">Alle Gegenstände deiner Wohnung<br>übersichtlich im Blick.</p>
        <div class="footer-stats-row">
          <span class="footer-stat-pill"><strong id="fstat-rooms">–</strong> Räume</span>
          <span class="footer-stat-pill"><strong id="fstat-items">–</strong> Gegenstände</span>
        </div>
      </div>

      <nav class="footer-nav" aria-label="Seitennavigation">
        <div class="footer-nav-col">
          <div class="footer-col-title">Navigation</div>
          <a href="index.html"             class="footer-link ${_page === 'index.html' ? 'footer-link--active' : ''}">🏠 Räume</a>
          <a href="alle-gegenstaende.html" class="footer-link ${_page === 'alle-gegenstaende.html' ? 'footer-link--active' : ''}">📋 Alle Gegenstände</a>
          <a href="statistik.html"         class="footer-link ${_page === 'statistik.html' ? 'footer-link--active' : ''}">📊 Statistik</a>
          <a href="konto.html"             class="footer-link ${_page === 'konto.html' ? 'footer-link--active' : ''}">🔐 Konto</a>
        </div>

        <div class="footer-nav-col">
          <div class="footer-col-title">Konto</div>
          ${user
            ? `<div class="footer-user">
                 <span class="footer-user-dot"></span>
                 Angemeldet als<br><strong>${user.email}</strong>
               </div>
               <a href="konto.html" class="footer-link">Profil ansehen →</a>`
            : `<p class="footer-hint">Melde dich an für geräteübergreifende Synchronisation.</p>
               <a href="konto.html" class="footer-cta">🔐 Jetzt anmelden</a>`
          }
        </div>
      </nav>

    </div>

    <div class="footer-bottom">
      <span>Wohnungs-Inventar</span>
      <span class="footer-sep">·</span>
      <span>${user ? '☁️ Cloud-Synchronisation aktiv' : '💾 Lokal gespeichert'}</span>
    </div>
  `;

  document.body.appendChild(footer);

  const fr = document.getElementById('fstat-rooms');
  const fi = document.getElementById('fstat-items');
  if (fr) fr.textContent = state?.rooms?.length ?? '–';
  if (fi) fi.textContent = state?.items?.length ?? '–';
}

// ── Mobile Hamburger ──────────────────────────
function toggleMobileMenu() {
  document.getElementById('nav-menu')?.classList.toggle('open');
  document.getElementById('nav-hamburger')?.classList.toggle('open');
}

document.addEventListener('click', e => {
  const menu = document.getElementById('nav-menu');
  const btn  = document.getElementById('nav-hamburger');
  if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
    menu.classList.remove('open');
    btn.classList.remove('open');
  }
});
