/* ============================================
   storage.js — Firestore Sync + localStorage
   ============================================
   Eingeloggt  → Daten in Firebase Cloud
   Ausgeloggt  → Daten im Browser (localStorage)

   Migration: Beim Login wird verglichen welche
   Quelle (Cloud oder Browser) mehr Daten hat.
   Die vollständigere Version gewinnt und wird
   automatisch synchronisiert.
   ============================================ */

const STORAGE_KEY  = 'wohnungs_inventar_v1';
let   _currentUser = null;
let   _unsubscribe = null;

// ── Firestore Referenz ────────────────────────
function _docRef(uid) {
  return firebase.firestore()
    .collection('users')
    .doc(uid)
    .collection('inventar')
    .doc('state');
}

// ── Speichern ─────────────────────────────────
async function saveState() {
  // Immer lokal speichern als Backup
  _saveLocal();

  if (_currentUser) {
    try {
      await _docRef(_currentUser.uid).set(JSON.parse(JSON.stringify(state)));
    } catch (err) {
      console.warn('[Inventar] Firestore Speichern fehlgeschlagen:', err);
    }
  }
}

function _saveLocal() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[Inventar] localStorage Fehler:', err);
  }
}

// ── Laden mit smarter Migration ───────────────
async function _loadState(user) {
  const local = _loadLocal();

  if (user) {
    try {
      const doc = await _docRef(user.uid).get();

      if (doc.exists) {
        const cloud = doc.data();

        // Vergleiche: Welche Quelle hat mehr Gegenstände?
        const cloudItems = (cloud?.items?.length  || 0) + (cloud?.rooms?.length  || 0);
        const localItems = (local?.items?.length  || 0) + (local?.rooms?.length  || 0);

        if (localItems > cloudItems) {
          // Lokale Daten sind vollständiger → in Cloud hochladen
          console.log('[Inventar] Lokale Daten vollständiger → wird in Cloud gespeichert');
          state = local;
          await _docRef(user.uid).set(JSON.parse(JSON.stringify(state)));
          showToast('Lokale Daten wurden in die Cloud synchronisiert ✓');
        } else {
          // Cloud-Daten nutzen
          state = cloud;
        }
      } else {
        // Noch kein Cloud-Dokument → lokale Daten hochladen
        state = local || JSON.parse(JSON.stringify(DEFAULT_STATE));
        await _docRef(user.uid).set(JSON.parse(JSON.stringify(state)));
        if (local) showToast('Daten wurden in die Cloud gespeichert ✓');
      }
    } catch (err) {
      console.warn('[Inventar] Firestore Laden fehlgeschlagen:', err);
      state = local || JSON.parse(JSON.stringify(DEFAULT_STATE));
    }
  } else {
    state = local || JSON.parse(JSON.stringify(DEFAULT_STATE));
  }
}

function _loadLocal() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch { return null; }
}

// ── Echtzeit-Sync zwischen Geräten ───────────
function _startSync(uid) {
  _stopSync();
  _unsubscribe = _docRef(uid).onSnapshot(doc => {
    if (!doc.exists) return;
    const incoming = doc.data();

    // Nur aktualisieren wenn die Cloud neuere Daten hat
    const incomingItems = (incoming?.items?.length || 0) + (incoming?.rooms?.length || 0);
    const currentItems  = (state?.items?.length    || 0) + (state?.rooms?.length    || 0);

    if (incomingItems >= currentItems) {
      state = incoming;
      _saveLocal(); // lokal als Backup sichern
      if (typeof renderRooms     === 'function') renderRooms();
      if (typeof renderItems     === 'function') renderItems();
      if (typeof renderStats     === 'function') renderStats();
      if (typeof buildRoomFilter === 'function') buildRoomFilter();
      if (typeof updateNavStats  === 'function') updateNavStats();
    }
  }, err => {
    console.warn('[Inventar] Sync-Fehler:', err);
  });
}

function _stopSync() {
  if (_unsubscribe) { _unsubscribe(); _unsubscribe = null; }
}

// ── App initialisieren ────────────────────────
function initApp(onReady) {
  firebase.auth().onAuthStateChanged(async user => {
    _currentUser = user;

    if (!user) _stopSync();

    await _loadState(user);

    if (user) _startSync(user.uid);

    if (typeof renderNav === 'function') renderNav(user);
    if (typeof onReady   === 'function') onReady(user);
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
