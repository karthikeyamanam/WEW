/* ============================================================
   15. FLOATING PANES DRAGGING & MINIMIZE
============================================================ */

function dragPaneStart(e, pane) {
  if (!pane || pane.classList.contains('minimized')) return;

  const sx = e.clientX;
  const sy = e.clientY;
  const rect = pane.getBoundingClientRect();

  const sl = rect.left;
  const st = rect.top;

  const move = ev => {
    let x = ev.clientX - sx + sl;
    let y = ev.clientY - sy + st;

    x = clamp(x, 10, window.innerWidth - pane.offsetWidth - 10);
    y = clamp(y, 10, window.innerHeight - pane.offsetHeight - 10);

    pane.style.left = x + 'px';
    pane.style.top = y + 'px';
  };

  const stop = () => {
    window.removeEventListener('mousemove', move);
    window.removeEventListener('mouseup', stop);
  };

  window.addEventListener('mousemove', move);
  window.addEventListener('mouseup', stop);
}

/* ============================================================
   DOM BINDINGS (SAFE)
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const topPane = document.getElementById('floating-topbar');
  const leftPane = document.getElementById('floating-left');
  const rightPane = document.getElementById('floating-right');

  const dragTop = document.getElementById('drag-topbar');
  const dragLeft = document.getElementById('drag-left');
  const dragRight = document.getElementById('drag-right');

  const minTopbar = document.getElementById('minTopbar');
  const minLeft = document.getElementById('minLeft');
  const minRight = document.getElementById('minRight');

  /* ================= DRAG HANDLERS ================= */

  if (dragTop && topPane) {
    dragTop.onmousedown = e => dragPaneStart(e, topPane);
  }

  if (dragLeft && leftPane) {
    dragLeft.onmousedown = e => dragPaneStart(e, leftPane);
  }

  if (dragRight && rightPane) {
    dragRight.onmousedown = e => dragPaneStart(e, rightPane);
  }

  /* ================= MINIMIZE HANDLERS ================= */

  if (minTopbar && topPane) {
    minTopbar.onclick = () => {
      topPane.classList.toggle('minimized');
      const actions = document.getElementById('topbar-actions');
      if (actions) {
        actions.style.display =
          topPane.classList.contains('minimized') ? 'none' : 'flex';
      }
    };
  }

  if (minLeft && leftPane) {
    minLeft.onclick = () => leftPane.classList.toggle('minimized');
  }

  if (minRight && rightPane) {
    minRight.onclick = () => rightPane.classList.toggle('minimized');
  }

});
/* ============================================================
   PROPERTIES: ANIMATION UI (FINAL)
============================================================ */

function renderAnimationProperties() {
  if (!window.propsPanel) return;

  const id = state.selectedIds?.[0];
  if (!id || id === 'body') return;

  const el = state.elements.find(e => e.id === id);
  if (!el) return;

  /* ---------- GROUP ---------- */
  const group = document.createElement('div');
  group.className = 'prop-group';

  const label = document.createElement('label');
  label.textContent = 'Animation';

  const select = document.createElement('select');

  /* Default */
  select.innerHTML = `<option value="">None</option>`;

  /* 🔑 Populate from global animations */
  Object.keys(window.animations || {}).forEach(name => {
    const opt = document.createElement('option');
    opt.value = name;
    opt.textContent = name;
    select.appendChild(opt);
  });

  /* Current value */
  select.value = el.animation?.name || '';

  /* Apply animation */
  select.onchange = () => {
    el.animation.name = select.value || '';
    el._played = false;
    saveState();
    renderAll();
  };

  group.appendChild(label);
  group.appendChild(select);
  propsPanel.appendChild(group);
}

