/* ============================================
   render.js — Darstellungsfunktionen
   ============================================ */

// ── Räume-Übersicht ──────────────────────────
function renderRooms() {
  const grid = document.getElementById('rooms-grid');
  grid.innerHTML = '';

  state.rooms.forEach(room => {
    const items = state.items.filter(i => i.roomId === room.id);
    const cats  = [...new Set(items.map(i => i.category))].slice(0, 3);

    const card = document.createElement('div');
    card.className = 'room-card';
    card.style.setProperty('--room-color', room.color);
    card.innerHTML = `
      <span class="room-icon">${room.icon}</span>
      <div class="room-name">${room.name}</div>
      <div class="room-count"><strong>${items.length}</strong> Gegenstände</div>
      <div class="room-tags">
        ${cats.map(c => `<span class="room-tag">${c}</span>`).join('')}
      </div>
    `;
    card.onclick = () => switchPage('room-detail', room.id);
    grid.appendChild(card);
  });

  // "+ Raum hinzufügen"-Kachel
  const add = document.createElement('button');
  add.className = 'add-room-card';
  add.innerHTML = `<span style="font-size:1.8rem">＋</span><span>Raum hinzufügen</span>`;
  add.onclick = openAddRoom;
  grid.appendChild(add);
}

// ── Raum-Detail ──────────────────────────────
function renderRoomDetail() {
  const room = state.rooms.find(r => r.id === currentRoomId);
  if (!room) { switchPage('rooms'); return; }

  document.getElementById('room-detail-name').textContent  = room.name;
  document.getElementById('room-detail-title').textContent = room.icon + ' ' + room.name;

  let items = state.items.filter(i => i.roomId === currentRoomId);
  if (roomSearchFilter) items = items.filter(i => i.name.toLowerCase().includes(roomSearchFilter));
  if (roomCondFilter)   items = items.filter(i => i.condition === roomCondFilter);

  const total = state.items.filter(i => i.roomId === currentRoomId).length;
  document.getElementById('room-detail-sub').textContent = `${total} Gegenstände erfasst`;

  const container = document.getElementById('room-items-container');
  container.innerHTML = '';

  if (!items.length) {
    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">📦</div>
        <p>Noch keine Gegenstände in diesem Raum.</p>
        <br>
        <button class="btn btn-primary" onclick="openAddItem()">＋ Ersten Gegenstand hinzufügen</button>
      </div>`;
    return;
  }

  if (currentView === 'grid') renderItemsGrid(items, 'room-items-container');
  else                        renderItemsList(items, 'room-items-container');
}

// ── Alle Gegenstände ─────────────────────────
function renderAllItems() {
  // Raumfilter-Dropdown befüllen
  const sel = document.getElementById('room-filter-select');
  sel.innerHTML = '<option value="">Alle Räume</option>';
  state.rooms.forEach(r => {
    const o = document.createElement('option');
    o.value       = r.id;
    o.textContent = r.icon + ' ' + r.name;
    sel.appendChild(o);
  });

  let items = [...state.items];
  if (allSearchFilter) items = items.filter(i => i.name.toLowerCase().includes(allSearchFilter));
  if (allRoomFilter)   items = items.filter(i => i.roomId == allRoomFilter);
  if (allCondFilter)   items = items.filter(i => i.condition === allCondFilter);

  const container = document.getElementById('all-items-container');
  container.innerHTML = '';

  if (!items.length) {
    container.innerHTML = `
      <div class="empty">
        <div class="empty-icon">📋</div>
        <p>Keine Gegenstände gefunden.</p>
      </div>`;
    return;
  }

  if (currentAllView === 'grid') renderItemsGrid(items, 'all-items-container', true);
  else                           renderItemsList(items, 'all-items-container', true);
}

// ── Filter-Handler ───────────────────────────
function filterRoomItems(val)      { roomSearchFilter = val.toLowerCase(); renderRoomDetail(); }
function filterByCondition(val)    { roomCondFilter   = val;               renderRoomDetail(); }
function filterAllItems(val)       { allSearchFilter  = val.toLowerCase(); renderAllItems(); }
function filterAllByRoom(val)      { allRoomFilter    = val;               renderAllItems(); }
function filterAllByCondition(val) { allCondFilter    = val;               renderAllItems(); }

// ── Kachel-Darstellung ───────────────────────
function renderItemsGrid(items, containerId, showRoom = false) {
  const grid = document.createElement('div');
  grid.className = 'items-grid';

  items.forEach(item => {
    const room = state.rooms.find(r => r.id === item.roomId);
    const card = document.createElement('div');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-actions">
        <button class="icon-btn icon-btn-edit" onclick="openEditItem(${item.id})" title="Bearbeiten">✏️</button>
        <button class="icon-btn icon-btn-del"  onclick="deleteItem(${item.id})"   title="Löschen">🗑</button>
      </div>
      <span class="item-icon">${item.icon}</span>
      <div class="item-name">${item.name}</div>
      <div class="item-meta">
        ${item.category}${item.brand ? ' · ' + item.brand : ''}
        ${showRoom && room ? '<br>📍 ' + room.icon + ' ' + room.name : ''}
      </div>
      <span class="item-qty">× ${item.qty}</span>
      <span class="condition-badge ${condClass(item.condition)}">${item.condition}</span>
      ${item.notes ? `<div class="item-meta" style="margin-top:.4rem;font-style:italic">${item.notes}</div>` : ''}
    `;
    grid.appendChild(card);
  });

  document.getElementById(containerId).appendChild(grid);
}

// ── Listen-Darstellung ───────────────────────
function renderItemsList(items, containerId, showRoom = false) {
  const list = document.createElement('div');
  list.className = 'items-list';

  items.forEach(item => {
    const room = state.rooms.find(r => r.id === item.roomId);
    const row  = document.createElement('div');
    row.className = 'list-item';
    row.innerHTML = `
      <span class="list-icon">${item.icon}</span>
      <div class="list-info">
        <div class="list-name">${item.name}</div>
        <div class="list-sub">
          ${item.category}${item.brand ? ' · ' + item.brand : ''}${item.year ? ' · ' + item.year : ''}
          ${showRoom && room ? ' · 📍 ' + room.name : ''}
        </div>
      </div>
      <span class="item-qty" style="flex-shrink:0">× ${item.qty}</span>
      <span class="condition-badge ${condClass(item.condition)}" style="flex-shrink:0">${item.condition}</span>
      <div class="list-actions">
        <button class="icon-btn icon-btn-edit" onclick="openEditItem(${item.id})" title="Bearbeiten">✏️</button>
        <button class="icon-btn icon-btn-del"  onclick="deleteItem(${item.id})"   title="Löschen">🗑</button>
      </div>
    `;
    list.appendChild(row);
  });

  document.getElementById(containerId).appendChild(list);
}

// ── Ansicht umschalten ───────────────────────
function setView(v) {
  currentView = v;
  document.getElementById('vbtn-grid').classList.toggle('active', v === 'grid');
  document.getElementById('vbtn-list').classList.toggle('active', v === 'list');
  renderRoomDetail();
}

function setAllView(v) {
  currentAllView = v;
  document.getElementById('avbtn-grid').classList.toggle('active', v === 'grid');
  document.getElementById('avbtn-list').classList.toggle('active', v === 'list');
  renderAllItems();
}

// ── Hilfsfunktion: Zustand → CSS-Klasse ──────
function condClass(c) {
  return c === 'Gut' ? 'cond-gut' : c === 'Mittel' ? 'cond-mittel' : 'cond-schlecht';
}
