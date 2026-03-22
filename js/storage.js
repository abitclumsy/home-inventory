/* ============================================
   storage.js — Firestore + localStorage Hybrid
   ============================================
   - Eingeloggt: Daten werden in Firestore gespeichert
     → geräteübergreifende Synchronisation
   - Nicht eingeloggt: localStorage als Fallback
     → Daten bleiben lokal im Browser
   ============================================ */

const STORAGE_KEY    = 'wohnungs_inventar_v1';
let   _currentUser   = null;
let   _stateLoaded   = false;
let   _onReadyCallbacks = [];

// ── Firestore-Referenz ────────────────────────
function userDocRef(uid) {
  return firebase.firestore().collection('users').doc(uid).collection('inventar').doc('state');
}

// ── Speichern ─────────────────────────────────
async function saveState() {
  if (_currentUser) {
    try {
      await userDocRef(_currentUser.uid).set(state);
    } catch (err) {
      console.warn('[Inventar] Firestore-Speichern fehlgeschlagen, nutze localStorage:', err);
      _saveLocal();
    }
  } else {
    _saveLocal();
  }
}

function _saveLocal() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }
  catch (err) { console.warn('[Inventar] localStorage-Speichern fehlgeschlagen:', err); }
}

// ── Laden ──────────────────────────────────────
async function loadState(user) {
  if (user) {
    try {
      const doc = await userDocRef(user.uid).get();
      if (doc.exists) {
        state = doc.data();
      } else {
        // Neuer Nutzer: lokale Daten (falls vorhanden) migrieren
        const local = _loadLocal();
        state = local || JSON.parse(JSON.stringify(DEFAULT_STATE));
        await userDocRef(user.uid).set(state); // In Cloud sichern
      }
    } catch (err) {
      console.warn('[Inventar] Firestore-Laden fehlgeschlagen, nutze localStorage:', err);
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

// ── Echtzeit-Sync (Firestore-Listener) ─────────
let _unsubscribeSync = null;

function startRealtimeSync(uid) {
  stopRealtimeSync();
  _unsubscribeSync = userDocRef(uid).onSnapshot(doc => {
    if (doc.exists && _stateLoaded) {
      state = doc.data();
      // Seite neu rendern falls eine render-Funktion vorhanden ist
      if (typeof renderRooms    === 'function') renderRooms();
      if (typeof renderItems    === 'function') renderItems();
      if (typeof renderStats    === 'function') renderStats();
      if (typeof buildRoomFilter === 'function') buildRoomFilter();
      if (typeof updateNavStats === 'function') updateNavStats();
    }
  }, err => { console.warn('[Inventar] Realtime-Sync Fehler:', err); });
}

function stopRealtimeSync() {
  if (_unsubscribeSync) { _unsubscribeSync(); _unsubscribeSync = null; }
}

// ── App initialisieren ────────────────────────
function initApp(onReady) {
  firebase.auth().onAuthStateChanged(async user => {
    _currentUser = user;
    await loadState(user);
    _stateLoaded = true;

    if (user) {
      startRealtimeSync(user.uid);
    } else {
      stopRealtimeSync();
    }

    if (typeof renderNav === 'function') renderNav(user);
    if (typeof onReady   === 'function') onReady(user);
  });
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
