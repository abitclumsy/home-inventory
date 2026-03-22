/* ============================================
   app.js — Routing, UI-State & Initialisierung
   ============================================ */

// ── UI-State ─────────────────────────────────
let currentPage      = 'rooms';
let currentRoomId    = null;
let editingRoomId    = null;
let editingItemId    = null;
let selectedRoomIcon  = ROOM_ICONS[0];
let selectedRoomColor = COLORS[0];
let selectedItemIcon  = ITEM_ICONS[0];
let currentView      = 'grid';
let currentAllView   = 'grid';
let roomSearchFilter = '';
let roomCondFilter   = '';
let allSearchFilter  = '';
let allRoomFilter    = '';
let allCondFilter    = '';

// ── Seitennavigation ─────────────────────────
function switchPage(page, roomId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

  if (page === 'room-detail') {
    currentRoomId = roomId;
    currentPage   = 'room-detail';
    // Filter zurücksetzen beim Raumwechsel
    roomSearchFilter = '';
    roomCondFilter   = '';
    document.getElementById('page-room-detail').classList.add('active');
    renderRoomDetail();
  } else {
    currentPage = page;
    document.getElementById('page-' + page).classList.add('active');
    const tabIndex = { rooms: 0, all: 1, stats: 2 };
    const tab = document.querySelectorAll('.nav-tab')[tabIndex[page]];
    if (tab) tab.classList.add('active');
  }

  if (page === 'all')   renderAllItems();
  if (page === 'stats') renderStats();
  if (page === 'rooms') renderRooms();
  updateNavStats();
}

// ── Navigationsleiste aktualisieren ──────────
function updateNavStats() {
  document.getElementById('stat-rooms').textContent = state.rooms.length;
  document.getElementById('stat-items').textContent = state.items.length;
}

// ── Toast-Benachrichtigungen ─────────────────
function showToast(msg) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

// ── Initialisierung ──────────────────────────
loadState();       // Gespeicherten State laden (storage.js)
renderRooms();     // Startseite rendern
updateNavStats();  // Statistik in der Nav aktualisieren
