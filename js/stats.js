/* ============================================
   stats.js — Statistik-Seite
   ============================================ */

function renderStats() {
  const total    = state.items.length;
  const totalQty = state.items.reduce((s, i) => s + i.qty, 0);
  const gut      = state.items.filter(i => i.condition === 'Gut').length;
  const rooms    = state.rooms.length;

  // Kennzahlen-Karten
  document.getElementById('stats-cards').innerHTML = `
    <div class="stat-card">
      <div class="stat-value">${rooms}</div>
      <div class="stat-label">🏠 Räume</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${total}</div>
      <div class="stat-label">📋 Positionen</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${totalQty}</div>
      <div class="stat-label">📦 Gegenstände gesamt</div>
    </div>
    <div class="stat-card">
      <div class="stat-value">${Math.round((gut / (total || 1)) * 100)}%</div>
      <div class="stat-label">✅ In gutem Zustand</div>
    </div>
  `;

  // Balkendiagramm: Gegenstände pro Raum
  const maxItems = Math.max(...state.rooms.map(r => state.items.filter(i => i.roomId === r.id).length), 1);
  document.getElementById('chart-rooms').innerHTML = state.rooms.map(r => {
    const count = state.items.filter(i => i.roomId === r.id).length;
    const pct   = ((count / maxItems) * 100).toFixed(1);
    return `
      <div class="bar-row">
        <div class="bar-label">${r.icon} ${r.name}</div>
        <div class="bar-track">
          <div class="bar-fill" style="width:${pct}%; background:${r.color}"></div>
        </div>
        <div class="bar-num">${count}</div>
      </div>`;
  }).join('');

  // Donut-Chart: Zustandsverteilung
  const conds  = ['Gut', 'Mittel', 'Schlecht'];
  const colors = ['#7B9E6B', '#C4A22D', '#C4622D'];
  const counts = conds.map(c => state.items.filter(i => i.condition === c).length);
  const total2 = counts.reduce((a, b) => a + b, 1);

  document.getElementById('chart-conditions').innerHTML = `
    <div class="donut-wrap">
      <canvas id="cond-canvas" width="110" height="110"></canvas>
      <div class="legend">
        ${conds.map((c, i) => `
          <div class="legend-item">
            <div class="legend-dot" style="background:${colors[i]}"></div>
            <span>${c}: <strong>${counts[i]}</strong></span>
          </div>`).join('')}
      </div>
    </div>`;

  // Donut zeichnen
  setTimeout(() => {
    const canvas = document.getElementById('cond-canvas');
    if (!canvas) return;
    const ctx   = canvas.getContext('2d');
    let start   = -Math.PI / 2;

    counts.forEach((c, i) => {
      if (c === 0) return;
      const angle = (c / total2) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(55, 55);
      ctx.arc(55, 55, 46, start, start + angle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
      start += angle;
    });

    // Donut-Loch
    ctx.beginPath();
    ctx.arc(55, 55, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFDF8';
    ctx.fill();
  }, 50);
}
