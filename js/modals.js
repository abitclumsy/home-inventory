/* ============================================
   modals.js — Raum- & Gegenstands-Modals
   (wird auf index.html, room.html & alle-gegenstaende.html verwendet)
   ============================================ */

// ── Raum-Modal ───────────────────────────────
function openAddRoom() {
  if (typeof editingRoomId !== 'undefined')    editingRoomId    = null;
  if (typeof selectedRoomIcon !== 'undefined') selectedRoomIcon  = ROOM_ICONS[0];
  if (typeof selectedRoomColor !== 'undefined') selectedRoomColor = COLORS[0];

  const titleEl = document.getElementById('room-modal-title');
  if (titleEl) titleEl.textContent = 'Raum hinzufügen';
  const nameEl  = document.getElementById('rm-name');
  const notesEl = document.getElementById('rm-notes');
  if (nameEl)  nameEl.value  = '';
  if (notesEl) notesEl.value = '';

  buildRoomIconPicker();
  buildRoomColorPicker();
  document.getElementById('room-modal').style.display = 'flex';
}

function closeRoomModal(e) {
  const overlay = document.getElementById('room-modal');
  if (!e || e.target === overlay) overlay.style.display = 'none';
}

function buildRoomIconPicker() {
  const picker = document.getElementById('room-icon-picker');
  if (!picker) return;
  picker.innerHTML = '';
  const currentIcon = (typeof selectedRoomIcon !== 'undefined') ? selectedRoomIcon : ROOM_ICONS[0];
  ROOM_ICONS.forEach(ic => {
    const btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'icon-option' + (ic === currentIcon ? ' selected' : '');
    btn.textContent = ic;
    btn.onclick = () => {
      if (typeof selectedRoomIcon !== 'undefined') selectedRoomIcon = ic;
      buildRoomIconPicker();
    };
    picker.appendChild(btn);
  });
}

function buildRoomColorPicker() {
  const picker = document.getElementById('room-color-picker');
  if (!picker) return;
  picker.innerHTML = '';
  const currentColor = (typeof selectedRoomColor !== 'undefined') ? selectedRoomColor : COLORS[0];
  COLORS.forEach(c => {
    const btn = document.createElement('button');
    btn.type  = 'button';
    btn.style.cssText = `width:28px;height:28px;border-radius:50%;border:3px solid ${c===currentColor?'#222':'transparent'};background:${c};cursor:pointer;transition:border .15s;`;
    btn.onclick = () => {
      if (typeof selectedRoomColor !== 'undefined') selectedRoomColor = c;
      buildRoomColorPicker();
    };
    picker.appendChild(btn);
  });
}

// ── Gegenstands-Modal ─────────────────────────
function openAddItem() {
  if (typeof editingItemId    !== 'undefined') editingItemId    = null;
  if (typeof selectedItemIcon !== 'undefined') selectedItemIcon = ITEM_ICONS[0];

  const titleEl = document.getElementById('item-modal-title');
  if (titleEl) titleEl.textContent = 'Gegenstand hinzufügen';

  ['it-name','it-brand','it-notes','it-year'].forEach(id => {
    const el = document.getElementById(id); if (el) el.value = '';
  });
  const qtyEl  = document.getElementById('it-qty');
  const condEl = document.getElementById('it-condition');
  const catEl  = document.getElementById('it-cat');
  if (qtyEl)  qtyEl.value  = 1;
  if (condEl) condEl.value = 'Gut';
  if (catEl)  catEl.value  = 'Möbel';

  buildItemIconPicker();
  document.getElementById('item-modal').style.display = 'flex';
}

function openEditItem(itemId) {
  const item = state.items.find(i => i.id === itemId);
  if (!item) return;
  if (typeof editingItemId    !== 'undefined') editingItemId    = itemId;
  if (typeof selectedItemIcon !== 'undefined') selectedItemIcon = item.icon;

  const titleEl = document.getElementById('item-modal-title');
  if (titleEl) titleEl.textContent = 'Gegenstand bearbeiten';

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
  set('it-name',      item.name);
  set('it-qty',       item.qty);
  set('it-condition', item.condition);
  set('it-cat',       item.category);
  set('it-brand',     item.brand);
  set('it-year',      item.year || '');
  set('it-notes',     item.notes);

  buildItemIconPicker();
  document.getElementById('item-modal').style.display = 'flex';
}

function closeItemModal(e) {
  const overlay = document.getElementById('item-modal');
  if (!e || e.target === overlay) overlay.style.display = 'none';
}

function buildItemIconPicker() {
  const picker = document.getElementById('item-icon-picker');
  if (!picker) return;
  picker.innerHTML = '';
  const currentIcon = (typeof selectedItemIcon !== 'undefined') ? selectedItemIcon : ITEM_ICONS[0];
  ITEM_ICONS.forEach(ic => {
    const btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'icon-option' + (ic === currentIcon ? ' selected' : '');
    btn.textContent = ic;
    btn.onclick = () => {
      if (typeof selectedItemIcon !== 'undefined') selectedItemIcon = ic;
      buildItemIconPicker();
    };
    picker.appendChild(btn);
  });
}
