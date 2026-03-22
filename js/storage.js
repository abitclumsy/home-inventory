/* ============================================
   storage.js — localStorage Persistenz
   ============================================
   Alle Änderungen werden automatisch im Browser
   gespeichert. Kein Server nötig — funktioniert
   sowohl lokal als auch beim Online-Hosting.
   ============================================ */

const STORAGE_KEY = 'wohnungs_inventar_v1';

/**
 * Lädt den gespeicherten State aus dem localStorage.
 * Falls noch kein State vorhanden ist, bleiben die
 * Standarddaten aus data.js erhalten.
 */
function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      state = JSON.parse(saved);
    }
  } catch (err) {
    console.warn('[Inventar] State konnte nicht geladen werden:', err);
  }
}

/**
 * Speichert den aktuellen State im localStorage.
 * Wird nach jeder Änderung (hinzufügen, bearbeiten,
 * löschen) automatisch aufgerufen.
 */
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.warn('[Inventar] State konnte nicht gespeichert werden:', err);
  }
}

/**
 * Setzt alle Daten auf die Standardwerte zurück.
 * Löscht den localStorage-Eintrag.
 */
function resetState() {
  if (!confirm('Alle Daten zurücksetzen? Diese Aktion kann nicht rückgängig gemacht werden.')) return;
  localStorage.removeItem(STORAGE_KEY);
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  saveState();
  switchPage('rooms');
  showToast('Daten zurückgesetzt ↺');
}
