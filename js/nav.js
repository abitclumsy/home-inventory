/* ============================================
   nav.js — Navigation & Footer
   ============================================ */

const _page = window.location.pathname.split('/').pop() || 'index.html';

// ── Topbar ────────────────────────────────────
function renderNav(user) {
  const nav = document.getElementById('main-nav');
  if (!nav) return;

  const trashCount = (state.trash || []).length;
  const trashBadge = trashCount > 0
    ? `<span class="nav-trash-badge">${trashCount}</span>`
    : '';

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
           href="alle-gegenstaende.html">📋 Alle</a>
        <a class="nav-tab ${_page === 'statistik.html' ? 'active' : ''}"
           href="statistik.html">📊 Statistik</a>
        <a class="nav-tab nav-tab--trash ${_page === 'papierkorb.html' ? 'active' : ''}"
           href="papierkorb.html">🗑 Papierkorb${trashBadge}</a>
      </div>

      <div class="nav-right">
        <!-- Globale Suche -->
        <div class="nav-search-box">
          <span class="nav-search-icon">🔍</span>
          <input type="text" id="nav-search-input"
                 placeholder="Suchen…"
                 oninput="globalSearch(this.value)"
                 onfocus="showSearchResults()"
                 autocomplete="off">
          <div class="nav-search-results" id="nav-search-results" style="display:none"></div>
        </div>

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

  // Suche bei Klick außerhalb schließen
  document.addEventListener('click', e => {
    const box = document.getElementById('nav-search-results');
    const inp = document.getElementById('nav-search-input');
    if (box && inp && !box.contains(e.target) && e.target !== inp) {
      box.style.display = 'none';
    }
  });
}

// ── Globale Suche ─────────────────────────────
function globalSearch(query) {
  const results = document.getElementById('nav-search-results');
  if (!results) return;

  const q = query.trim().toLowerCase();
  if (!q) { results.style.display = 'none'; return; }

  const matchedItems = state.items.filter(i =>
    i.name.toLowerCase().includes(q) ||
    (i.brand  || '').toLowerCase().includes(q) ||
    (i.notes  || '').toLowerCase().includes(q) ||
    (i.category || '').toLowerCase().includes(q)
  ).slice(0, 6);

  const matchedRooms = state.rooms.filter(r =>
    r.name.toLowerCase().includes(q)
  ).slice(0, 3);

  if (!matchedItems.length && !matchedRooms.length) {
    results.innerHTML = `<div class="search-no-results">Keine Ergebnisse für „${query}"</div>`;
    results.style.display = 'block';
    return;
  }

  let html = '';

  if (matchedRooms.length) {
    html += `<div class="search-section-label">Räume</div>`;
    matchedRooms.forEach(r => {
      const count = state.items.filter(i => i.roomId === r.id).length;
      html += `
        <a href="room.html?id=${r.id}" class="search-result-item" onclick="closeSearch()">
          <span class="search-result-icon">${r.icon}</span>
          <div class="search-result-info">
            <div class="search-result-name">${highlight(r.name, q)}</div>
            <div class="search-result-meta">${count} Gegenstände</div>
          </div>
        </a>`;
    });
  }

  if (matchedItems.length) {
    html += `<div class="search-section-label">Gegenstände</div>`;
    matchedItems.forEach(item => {
      const room = state.rooms.find(r => r.id === item.roomId);
      html += `
        <a href="room.html?id=${item.roomId}" class="search-result-item" onclick="closeSearch()">
          <span class="search-result-icon">${item.icon}</span>
          <div class="search-result-info">
            <div class="search-result-name">${highlight(item.name, q)}</div>
            <div class="search-result-meta">${item.category}${room ? ' · 📍 ' + room.name : ''}</div>
          </div>
          <span class="search-result-badge">${item.condition}</span>
        </a>`;
    });
  }

  results.innerHTML = html;
  results.style.display = 'block';
}

function highlight(text, query) {
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return text.slice(0, idx)
    + `<mark class="search-highlight">${text.slice(idx, idx + query.length)}</mark>`
    + text.slice(idx + query.length);
}

function showSearchResults() {
  const inp = document.getElementById('nav-search-input');
  if (inp && inp.value.trim()) globalSearch(inp.value);
}

function closeSearch() {
  const results = document.getElementById('nav-search-results');
  const inp     = document.getElementById('nav-search-input');
  if (results) results.style.display = 'none';
  if (inp)     inp.value = '';
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
          <a href="index.html"             class="footer-link ${_page === 'index.html'             ? 'footer-link--active' : ''}">🏠 Räume</a>
          <a href="alle-gegenstaende.html" class="footer-link ${_page === 'alle-gegenstaende.html' ? 'footer-link--active' : ''}">📋 Alle Gegenstände</a>
          <a href="statistik.html"         class="footer-link ${_page === 'statistik.html'         ? 'footer-link--active' : ''}">📊 Statistik</a>
          <a href="papierkorb.html"        class="footer-link ${_page === 'papierkorb.html'        ? 'footer-link--active' : ''}">🗑 Papierkorb</a>
          <a href="konto.html"             class="footer-link ${_page === 'konto.html'             ? 'footer-link--active' : ''}">🔐 Konto</a>
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
