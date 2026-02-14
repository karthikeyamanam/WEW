/* ============================================================
   9. SELECTION & DRAGGING
============================================================ */

const selectElement = id => {
  state.selectedIds = [id];
  renderAll();
};

let dragInfo = null;

function startDrag(e, id) {
  const el = state.elements.find(x => x.id === id);
  if (!el || !window.canvas) return;

  const node = canvas.querySelector(`.canvas-element[data-id="${id}"]`);
  if (!node) return;

  const canvasRect = canvas.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  const scale = state.zoom || 1;

  const offsetX = (e.clientX - nodeRect.left) / scale;
  const offsetY = (e.clientY - nodeRect.top) / scale;

  dragInfo = {
    el,
    node,
    offsetX,
    offsetY,
    canvasLeft: canvasRect.left,
    canvasTop: canvasRect.top
  };

  selectElement(id);

  dragInfo.node.style.animation = 'none';

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', endDrag);
}

function onDrag(e) {
  if (!dragInfo) return;

  const scale = state.zoom || 1;

  let nx = (e.clientX - dragInfo.canvasLeft) / scale - dragInfo.offsetX;
  let ny = (e.clientY - dragInfo.canvasTop) / scale - dragInfo.offsetY;

  if (window.snapToGrid && window.gridSize) {
    nx = Math.round(nx / gridSize) * gridSize;
    ny = Math.round(ny / gridSize) * gridSize;
  }

  dragInfo.el.x = nx;
  dragInfo.el.y = ny;

  if (dragInfo.node) {
    dragInfo.node.style.left = nx + 'px';
    dragInfo.node.style.top = ny + 'px';
  }
}

function endDrag() {
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', endDrag);

  if (dragInfo?.el) dragInfo.el._played = false;

  dragInfo = null;
  saveState();
  renderAll();
}

/* ============================================================
   10. RESIZING
============================================================ */

let resizeInfo = null;

function startResize(e, id) {
  const el = state.elements.find(x => x.id === id);
  if (!el || !window.canvas) return;

  const node = canvas.querySelector(`.canvas-element[data-id="${id}"]`);
  if (!node) return;

  resizeInfo = {
    el,
    node,
    startX: e.clientX,
    startY: e.clientY,
    w: el.width,
    h: el.height
  };

  window.addEventListener('mousemove', onResize);
  window.addEventListener('mouseup', endResize);
}

function onResize(e) {
  if (!resizeInfo) return;

  const dx = (e.clientX - resizeInfo.startX) / (state.zoom || 1);
  const dy = (e.clientY - resizeInfo.startY) / (state.zoom || 1);

  let newW = resizeInfo.w + dx;
  let newH = resizeInfo.h + dy;

  newW = Math.max(20, newW);
  newH = Math.max(20, newH);

  if (window.snapToGrid && window.gridSize) {
    newW = Math.round(newW / gridSize) * gridSize;
    newH = Math.round(newH / gridSize) * gridSize;
  }

  resizeInfo.el.width = newW;
  resizeInfo.el.height = newH;

  if (resizeInfo.node) {
    resizeInfo.node.style.width = newW + 'px';
    resizeInfo.node.style.height = newH + 'px';
  }
}

function endResize() {
  window.removeEventListener('mousemove', onResize);
  window.removeEventListener('mouseup', endResize);

  state.elements.forEach(el => el._played = false);

  resizeInfo = null;
  saveState();
  renderAll();
}

/* ============================================================
   11. ORDERING CONTROLS
============================================================ */

function bringToFront() {
  if (state.selectedIds[0] === 'body') return;
  const i = state.elements.findIndex(e => e.id === state.selectedIds[0]);
  if (i === -1) return;
  state.elements.push(state.elements.splice(i, 1)[0]);
  saveState();
  renderAll();
}

function sendToBack() {
  if (state.selectedIds[0] === 'body') return;
  const i = state.elements.findIndex(e => e.id === state.selectedIds[0]);
  if (i === -1) return;
  state.elements.unshift(state.elements.splice(i, 1)[0]);
  saveState();
  renderAll();
}

function bringForward() {
  if (state.selectedIds[0] === 'body') return;
  const i = state.elements.findIndex(e => e.id === state.selectedIds[0]);
  if (i < 0 || i >= state.elements.length - 1) return;
  [state.elements[i], state.elements[i + 1]] =
    [state.elements[i + 1], state.elements[i]];
  saveState();
  renderAll();
}

function sendBackward() {
  if (state.selectedIds[0] === 'body') return;
  const i = state.elements.findIndex(e => e.id === state.selectedIds[0]);
  if (i <= 0) return;
  [state.elements[i], state.elements[i - 1]] =
    [state.elements[i - 1], state.elements[i]];
  saveState();
  renderAll();
}

/* ============================================================
   16. KEYBOARD SHORTCUTS (SAFE)
============================================================ */

window.addEventListener('keydown', e => {

  const active = document.activeElement;
  const isTyping =
    active &&
    (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable
    );

  if (isTyping) return;

  if (e.key === 'Escape' && window.componentsList) {
    window.pendingComponent = null;
    componentsList.querySelectorAll('.component-item')
      .forEach(i => i.classList.remove('active'));
  }

  if (e.key === 'Delete' && state.selectedIds.length) {
    if (state.selectedIds.includes('body')) return;
    state.elements = state.elements.filter(el => !state.selectedIds.includes(el.id));
    state.selectedIds = [];
    saveState();
    renderAll();
  }

  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && typeof undo === 'function') undo();
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y' && typeof redo === 'function') redo();

  if ((e.ctrlKey || e.metaKey) && e.key === ']') {
    e.shiftKey ? bringToFront() : bringForward();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === '[') {
    e.shiftKey ? sendToBack() : sendBackward();
  }
});

/* ============================================================
   GLOBAL EXPORTS
============================================================ */

window.selectElement = selectElement;
window.startDrag = startDrag;
window.startResize = startResize;
window.bringToFront = bringToFront;
window.sendToBack = sendToBack;
window.bringForward = bringForward;
window.sendBackward = sendBackward;
