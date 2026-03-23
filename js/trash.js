/* ============================================
   trash.js — Papierkorb (30 Tage)
   ============================================
   Gelöschte Räume und Gegenstände werden 30
   Tage im Papierkorb aufbewahrt und können
   wiederhergestellt werden.
   ============================================ */

const TRASH_DAYS = 30;

// ── In Papierkorb verschieben ─────────────────

function trashRoom(roomId) {
  const room  = state.rooms.find(r => r.id === roomId);
  if (!room) return;
  const items = state.items.filter(i => i.roomId === roomId);

  if (!state.trash) state.trash = [];
  state.trash.push({
    id:        'trash_' + Date.now(),
    type:      'room',
    data:      { ...room },
    items:     items.map(i => ({ ...i })),
    deletedAt: Date.now(),
  });

  state.rooms = state.rooms.filter(r => r.id !== roomId);
  state.items = state.items.filter(i => i.roomId !== roomId);
  saveState();
  showToast('Raum in Papierkorb verschoben 🗑');
}

function trashItem(itemId) {
  const item = state.items.find(i => i.id === itemId);
  if (!item) return;

  if (!state.trash) state.trash = [];
  state.trash.push({
    id:        'trash_' + Date.now(),
    type:      'item',
    data:      { ...item },
    deletedAt: Date.now(),
  });

  state.items = state.items.filter(i => i.id !== itemId);
  saveState();
  showToast('Gegenstand in Papierkorb verschoben 🗑');
}

// ── Wiederherstellen ──────────────────────────

function restoreFromTrash(trashId) {
  if (!state.trash) return;
  const entry = state.trash.find(t => t.id === trashId);
  if (!entry) return;

  if (entry.type === 'room') {
    // Raum wiederherstellen
    if (!state.rooms.find(r => r.id === entry.data.id)) {
      state.rooms.push(entry.data);
    }
    // Gegenstände wiederherstellen
    if (entry.items) {
      entry.items.forEach(item => {
        if (!state.items.find(i => i.id === item.id)) {
          state.items.push(item);
        }
      });
    }
    showToast('Raum wiederhergestellt ✓');
  } else {
    // Gegenstand wiederherstellen
    if (!state.items.find(i => i.id === entry.data.id)) {
      state.items.push(entry.data);
    }
    showToast('Gegenstand wiederhergestellt ✓');
  }

  state.trash = state.trash.filter(t => t.id !== trashId);
  saveState();
}

// ── Endgültig löschen ─────────────────────────

function permanentDelete(trashId) {
  if (!state.trash) return;
  state.trash = state.trash.filter(t => t.id !== trashId);
  saveState();
  showToast('Endgültig gelöscht');
}

function emptyTrash() {
  if (!state.trash || !state.trash.length) return;
  if (!confirm('Papierkorb wirklich leeren? Alle Einträge werden endgültig gelöscht.')) return;
  state.trash = [];
  saveState();
  showToast('Papierkorb geleert 🗑');
}

// ── Alte Einträge aufräumen (>30 Tage) ────────

function cleanupTrash() {
  if (!state.trash) { state.trash = []; return; }
  const cutoff = Date.now() - TRASH_DAYS * 24 * 60 * 60 * 1000;
  const before = state.trash.length;
  state.trash = state.trash.filter(t => t.deletedAt > cutoff);
  if (state.trash.length < before) saveState();
}

// ── Tage bis Ablauf berechnen ─────────────────

function daysLeft(deletedAt) {
  const msLeft = (deletedAt + TRASH_DAYS * 24 * 60 * 60 * 1000) - Date.now();
  return Math.max(0, Math.ceil(msLeft / (24 * 60 * 60 * 1000)));
}
