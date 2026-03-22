/* ============================================
   modals.js — Raum- & Gegenstands-Dialoge
   ============================================ */

// ── Raum-Modal ───────────────────────────────
function openAddRoom() {
  editingRoomId      = null;
  selectedRoomIcon   = ROOM_ICONS[0];
  selectedRoomColor  = COLORS[0];
  document.getElementById('room-modal-title').textContent = 'Raum hinzufügen';
  document.getElementById('rm-name').value  = '';
  document.getElementById('rm-notes').value = '';
  buildRoomIconPicker();
  buildRoomColorPicker();
  document.getElementById('room-modal').style.display = 'flex';
}

function editCurrentRoom() {
  const room = state.rooms.find(r => r.id === currentRoomId);
  editingRoomId     = currentRoomId;
  selectedRoomIcon  = room.icon;
  selectedRoomColor = room.color;
  document.getElementById('room-modal-title').textContent = 'Raum bearbeiten';
  document.getElementById('rm-name').value  = room.name;
  document.getElementById('rm-notes').value = room.notes;
  buildRoomIconPicker();
  buildRoomColorPicker();
  document.getElementById('room-modal').style.display = 'flex';
}

function closeRoomModal(e) {
  if (!e || e.target === document.getElementById('room-modal')) {
    document.getElementById('room-modal').style.display = 'none';
  }
}

function buildRoomIconPicker() {
  const picker = document.getElementById('room-icon-picker');
  picker.innerHTML = '';
  ROOM_ICONS.forEach(ic => {
    const btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'icon-option' + (ic === selectedRoomIcon ? ' selected' : '');
    btn.textContent = ic;
    btn.onclick = () => { selectedRoomIcon = ic; buildRoomIconPicker(); };
    picker.appendChild(btn);
  });
}

function buildRoomColorPicker() {
  const picker = document.getElementById('room-color-picker');
  picker.innerHTML = '';
  COLORS.forEach(c => {
    const btn = document.createElement('button');
    btn.type  = 'button';
    btn.style.cssText = `
      width: 28px; height: 28px; border-radius: 50%;
      border: 3px solid ${c === selectedRoomColor ? '#222' : 'transparent'};
      background: ${c}; cursor: pointer; transition: border .15s;
    `;
    btn.onclick = () => { selectedRoomColor = c; buildRoomColorPicker(); };
    picker.appendChild(btn);
  });
}

function saveRoom() {
  const name = document.getElementById('rm-name').value.trim();
  if (!name) { alert('Bitte einen Namen eingeben.'); return; }

  if (editingRoomId) {
    const room  = state.rooms.find(r => r.id === editingRoomId);
    room.name   = name;
    room.icon   = selectedRoomIcon;
    room.color  = selectedRoomColor;
    room.notes  = document.getElementById('rm-notes').value;
    showToast('Raum aktualisiert ✓');
  } else {
    state.rooms.push({
      id:    state.nextRoomId++,
      name,
      icon:  selectedRoomIcon,
      color: selectedRoomColor,
      notes: document.getElementById('rm-notes').value,
    });
    showToast('Raum hinzugefügt ✓');
  }

  saveState();
  document.getElementById('room-modal').style.display = 'none';
  if (currentPage === 'rooms')       renderRooms();
  else if (currentPage === 'room-detail') renderRoomDetail();
  updateNavStats();
}

function deleteCurrentRoom() {
  const room = state.rooms.find(r => r.id === currentRoomId);
  if (!confirm(`Raum "${room?.name}" und alle Gegenstände löschen?`)) return;
  state.rooms = state.rooms.filter(r => r.id !== currentRoomId);
  state.items = state.items.filter(i => i.roomId !== currentRoomId);
  saveState();
  showToast('Raum gelöscht');
  switchPage('rooms');
}

// ── Gegenstands-Modal ────────────────────────
function openAddItem() {
  editingItemId    = null;
  selectedItemIcon = ITEM_ICONS[0];
  document.getElementById('item-modal-title').textContent = 'Gegenstand hinzufügen';
  document.getElementById('it-name').value      = '';
  document.getElementById('it-qty').value       = 1;
  document.getElementById('it-condition').value = 'Gut';
  document.getElementById('it-cat').value       = 'Möbel';
  document.getElementById('it-brand').value     = '';
  document.getElementById('it-year').value      = '';
  document.getElementById('it-notes').value     = '';
  buildItemIconPicker();
  document.getElementById('item-modal').style.display = 'flex';
}

function openEditItem(itemId) {
  const item = state.items.find(i => i.id === itemId);
  editingItemId    = itemId;
  selectedItemIcon = item.icon;
  document.getElementById('item-modal-title').textContent = 'Gegenstand bearbeiten';
  document.getElementById('it-name').value      = item.name;
  document.getElementById('it-qty').value       = item.qty;
  document.getElementById('it-condition').value = item.condition;
  document.getElementById('it-cat').value       = item.category;
  document.getElementById('it-brand').value     = item.brand;
  document.getElementById('it-year').value      = item.year || '';
  document.getElementById('it-notes').value     = item.notes;
  buildItemIconPicker();
  document.getElementById('item-modal').style.display = 'flex';
}

function closeItemModal(e) {
  if (!e || e.target === document.getElementById('item-modal')) {
    document.getElementById('item-modal').style.display = 'none';
  }
}

function buildItemIconPicker() {
  const picker = document.getElementById('item-icon-picker');
  picker.innerHTML = '';
  ITEM_ICONS.forEach(ic => {
    const btn = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'icon-option' + (ic === selectedItemIcon ? ' selected' : '');
    btn.textContent = ic;
    btn.onclick = () => { selectedItemIcon = ic; buildItemIconPicker(); };
    picker.appendChild(btn);
  });
}

function saveItem() {
  const name = document.getElementById('it-name').value.trim();
  if (!name) { alert('Bitte einen Namen eingeben.'); return; }

  const data = {
    name,
    icon:      selectedItemIcon,
    qty:       parseInt(document.getElementById('it-qty').value) || 1,
    condition: document.getElementById('it-condition').value,
    category:  document.getElementById('it-cat').value,
    brand:     document.getElementById('it-brand').value.trim(),
    year:      parseInt(document.getElementById('it-year').value) || null,
    notes:     document.getElementById('it-notes').value.trim(),
  };

  if (editingItemId) {
    Object.assign(state.items.find(i => i.id === editingItemId), data);
    showToast('Gegenstand aktualisiert ✓');
  } else {
    state.items.push({ id: state.nextItemId++, roomId: currentRoomId, ...data });
    showToast('Gegenstand hinzugefügt ✓');
  }

  saveState();
  document.getElementById('item-modal').style.display = 'none';
  if (currentPage === 'room-detail') renderRoomDetail();
  else                               renderAllItems();
  updateNavStats();
}

function deleteItem(itemId) {
  if (!confirm('Gegenstand löschen?')) return;
  state.items = state.items.filter(i => i.id !== itemId);
  saveState();
  showToast('Gegenstand gelöscht');
  if (currentPage === 'room-detail') renderRoomDetail();
  else                               renderAllItems();
  updateNavStats();
}
