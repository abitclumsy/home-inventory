/* ============================================
   storage.js — Lokaler Browserspeicher
   ============================================
   Alle Änderungen werden automatisch im Browser
   gespeichert (localStorage). Kein Login, kein
   Server, kein Setup nötig.
   ============================================ */

const STORAGE_KEY = 'wohnungs_inventar_v1';

// ── App starten ───────────────────────────────
function initApp(onReady) {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) state = JSON.parse(saved);
  } catch (err) {
    console.warn('[Inventar] Laden fehlgeschlagen:', err);
  }
  if (typeof renderNav === 'function') renderNav();
  if (typeof onReady   === 'function') onReady();
}

// ── Speichern ─────────────────────────────────
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[Inventar] Speichern fehlgeschlagen:', err);
  }
}

// ── Hilfsfunktionen ───────────────────────────
function updateNavStats() {
  const r = document.getElementById('stat-rooms');
  const i = document.getElementById('stat-items');
  if (r) r.textContent = state.rooms.length;
  if (i) i.textContent = state.items.length;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
