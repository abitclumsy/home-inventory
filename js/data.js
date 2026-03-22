/* ============================================
   data.js — Standarddaten & Konstanten
   ============================================ */

const ROOM_ICONS = [
  '🛋️','🛏️','🍽️','🚿','🚽','🪴','📚','💻',
  '🎮','🪟','🏠','🧺','🛁','🚗','⚙️','🎨',
  '🏋️','🧸','🌟','🍷','🗄️','🏚️','🔑','🪣'
];

const ITEM_ICONS = [
  '🛋️','🪑','🛏️','🖥️','📺','🎮','🎵','📚',
  '🧊','🍳','☕','🫖','🪴','💡','🕯️','🪞',
  '🧴','🧹','🔧','🪛','⚡','📦','🧺','🛁',
  '🚿','🏋️','🎨','🖼️','🪟','🚪','🛗','🔑',
  '📷','🎸','🎹','🧸','🎁','🌡️','🔋','🪣',
  '🧲','🪓','⌚','📱','💻','🖨️','🎒','👔','🏺'
];

const COLORS = [
  '#C4622D', // Terrakotta
  '#7B9E6B', // Salbeigrün
  '#5B6E8A', // Stahlblau
  '#9B6B9B', // Mauve
  '#C4A22D', // Gold
  '#2D9B8A', // Teal
  '#8A6B5B', // Braun
  '#6B7B4A', // Olivgrün
];

/** Standarddaten (werden nur beim ersten Start geladen) */
const DEFAULT_STATE = {
  rooms: [
    { id: 1, name: 'Wohnzimmer',       icon: '🛋️', color: '#C4622D', notes: '' },
    { id: 2, name: 'Schlafzimmer',     icon: '🛏️', color: '#5B6E8A', notes: '' },
    { id: 3, name: 'Küche',            icon: '🍽️', color: '#7B9E6B', notes: '' },
    { id: 4, name: 'Badezimmer',       icon: '🚿', color: '#2D9B8A', notes: '' },
    { id: 5, name: 'Arbeitszimmer',    icon: '💻', color: '#9B6B9B', notes: '' },
    { id: 6, name: 'Flur',             icon: '🚪', color: '#C4A22D', notes: '' },
    { id: 7, name: 'Keller',           icon: '🏚️', color: '#8A6B5B', notes: '' },
    { id: 8, name: 'Einbauschrank Flur', icon: '🗄️', color: '#5B6E8A', notes: '' },
  ],
  items: [
    { id: 1,  roomId: 1, name: 'Sofa',          icon: '🛋️', qty: 1, condition: 'Gut',    category: 'Möbel',   brand: 'IKEA',       year: 2020, notes: '' },
    { id: 2,  roomId: 1, name: 'Fernseher',      icon: '📺', qty: 1, condition: 'Gut',    category: 'Elektro', brand: 'Samsung',    year: 2021, notes: '55"' },
    { id: 3,  roomId: 1, name: 'Couchtisch',     icon: '🪑', qty: 1, condition: 'Mittel', category: 'Möbel',   brand: '',           year: 2018, notes: '' },
    { id: 4,  roomId: 1, name: 'Stehlampe',      icon: '💡', qty: 2, condition: 'Gut',    category: 'Beleuchtung', brand: '',       year: 2019, notes: '' },
    { id: 5,  roomId: 2, name: 'Bett',           icon: '🛏️', qty: 1, condition: 'Gut',    category: 'Möbel',   brand: 'IKEA',       year: 2019, notes: '180x200' },
    { id: 6,  roomId: 2, name: 'Kleiderschrank', icon: '🚪', qty: 1, condition: 'Gut',    category: 'Möbel',   brand: 'IKEA',       year: 2019, notes: '' },
    { id: 7,  roomId: 2, name: 'Nachttisch',     icon: '🪑', qty: 2, condition: 'Gut',    category: 'Möbel',   brand: '',           year: 2019, notes: '' },
    { id: 8,  roomId: 3, name: 'Kühlschrank',    icon: '🧊', qty: 1, condition: 'Gut',    category: 'Elektro', brand: 'Bosch',      year: 2020, notes: '' },
    { id: 9,  roomId: 3, name: 'Herd',           icon: '🍳', qty: 1, condition: 'Gut',    category: 'Elektro', brand: 'Siemens',    year: 2020, notes: '' },
    { id: 10, roomId: 3, name: 'Kaffeemaschine', icon: '☕', qty: 1, condition: 'Mittel', category: 'Elektro', brand: "De'Longhi",  year: 2018, notes: '' },
    { id: 11, roomId: 4, name: 'Waschmaschine',  icon: '🧺', qty: 1, condition: 'Gut',    category: 'Elektro', brand: 'Miele',      year: 2021, notes: '' },
    { id: 12, roomId: 4, name: 'Badewanne',      icon: '🛁', qty: 1, condition: 'Gut',    category: 'Bad',     brand: '',           year: 2015, notes: '' },
    { id: 13, roomId: 5, name: 'Schreibtisch',   icon: '💻', qty: 1, condition: 'Gut',    category: 'Möbel',   brand: 'IKEA',       year: 2020, notes: '' },
    { id: 14, roomId: 5, name: 'Laptop',         icon: '💻', qty: 1, condition: 'Gut',    category: 'Elektro', brand: 'Apple',      year: 2022, notes: 'MacBook Pro' },
    { id: 15, roomId: 6, name: 'Garderobe',      icon: '🎒', qty: 1, condition: 'Gut',    category: 'Möbel',   brand: '',           year: 2017, notes: '' },
  ],
  nextRoomId: 9,
  nextItemId: 16,
};

// Aktiver App-State (wird durch storage.js befüllt)
let state = JSON.parse(JSON.stringify(DEFAULT_STATE));
