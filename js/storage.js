/* ============================================
   storage.js — Firestore Sync + localStorage Fallback
   ============================================
   Eingeloggt  → Daten in Firebase Cloud (alle Geräte)
   Ausgeloggt  → Daten nur im Browser (localStorage)
   ============================================ */

const STORAGE_KEY  = 'wohnungs_inventar_v1';
let   _currentUser = null;
let   _unsubscribe = null;

// ── Firestore Dokument-Referenz ───────────────
function _docRef(uid) {
  return firebase.firestore()
    .collection('users')
    .doc(uid)
    .collection('inventar')
    .doc('state');
}

// ── Speichern ─────────────────────────────────
async function saveState() {
  if (_currentUser) {
    try {
      await _docRef(_currentUser.uid).set(JSON.parse(JSON.stringify(state)));
    } catch (err) {
      console.warn('[Inventar] Firestore Fehler beim Speichern:', err);
      _saveLocal();
    }
  } else {
    _saveLocal();
  }
}

function _saveLocal() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[Inventar] localStorage Fehler:', err);
  }
}

// ── Laden ─────────────────────────────────────
async function _loadState(user) {
  if (user) {
    try {
      const doc = await _docRef(user.uid).get();
      if (doc.exists) {
        // Cloud-Daten laden
        state = doc.data();
      } else {
        // Neues Konto: lokale Daten hochladen (Migration)
        const local = _loadLocal();
        state = local || JSON.parse(JSON.stringify(DEFAULT_STATE));
        await _docRef(user.uid).set(JSON.parse(JSON.stringify(state)));
      }
    } catch (err) {
      console.warn('[Inventar] Firestore Fehler beim Laden:', err);
      state = _loadLocal() || JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  } else {
    state = _loadLocal() || JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

function _loadLocal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

// ── Echtzeit-Sync (live zwischen Geräten) ─────
function _startSync(uid) {
  _stopSync();
  _unsubscribe = _docRef(uid).onSnapshot(doc => {
    if (!doc.exists) return;
    state = doc.data();
    // Alle Render-Funktionen aufrufen die auf der Seite vorhanden sind
    if (typeof renderRooms     === 'function') renderRooms();
    if (typeof renderItems     === 'function') renderItems();
    if (typeof renderStats     === 'function') renderStats();
    if (typeof buildRoomFilter === 'function') buildRoomFilter();
    if (typeof updateNavStats  === 'function') updateNavStats();
  }, err => {
    console.warn('[Inventar] Sync-Fehler:', err);
  });
}

function _stopSync() {
  if (_unsubscribe) { _unsubscribe(); _unsubscribe = null; }
}

// ── App initialisieren ────────────────────────
function initApp(onReady) {
  // Warten bis Firebase Auth den Login-Status kennt
  firebase.auth().onAuthStateChanged(async user => {
    _currentUser = user;

    // Sync stoppen wenn ausgeloggt
    if (!user) _stopSync();

    // Daten laden
    await _loadState(user);

    // Sync starten wenn eingeloggt
    if (user) _startSync(user.uid);

    // Navigation rendern
    if (typeof renderNav === 'function') renderNav(user);

    // Seite initialisieren
    if (typeof onReady === 'function') onReady(user);
  });
}

// ── Hilfsfunktionen ───────────────────────────
function updateNavStats() {
  const r = document.getElementById('stat-rooms');
  const i = document.getElementById('stat-items');
  if (r) r.textContent = state?.rooms?.length ?? 0;
  if (i) i.textContent = state?.items?.length ?? 0;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
