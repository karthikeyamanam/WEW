/* ============================================================
   16. KEYBOARD SHORTCUTS
============================================================ */

window.onkeydown = e => {

  // 🛑 Allow normal text copy/paste in properties panel
  const active = document.activeElement;
  const isTyping =
    active &&
    (
      active.tagName === 'INPUT' ||
      active.tagName === 'TEXTAREA' ||
      active.isContentEditable
    );

  // Allow normal typing
  if (isTyping) {

    // Only block builder shortcuts while typing
    if (
      (e.ctrlKey || e.metaKey) ||
      e.key === 'Delete' ||
      e.key.startsWith('Arrow')
    ) {
      return;
    }
  }

  // -----------------------------------------------
  // ESC cancels component selection
  // -----------------------------------------------
  if (e.key === 'Escape') {
    pendingComponent = null;
    componentsList.querySelectorAll('.component-item')
      .forEach(i => i.classList.remove('active'));
  }

  // -----------------------------------------------
  // DELETE element
  // -----------------------------------------------
  if (e.key === 'Delete' && state.selectedIds.length) {
    if (state.selectedIds.includes('body')) return;
    state.elements = state.elements.filter(el => !state.selectedIds.includes(el.id));
    state.selectedIds = [];
    saveState();
    renderAll();
  }

  // -----------------------------------------------
  // UNDO / REDO
  // -----------------------------------------------
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') undo();
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') redo();

  // -----------------------------------------------
  // LAYER ORDER SHORTCUTS
  // -----------------------------------------------
  if ((e.ctrlKey || e.metaKey) && e.key === ']') {
    if (e.shiftKey) bringToFront();
    else bringForward();
  }
  if ((e.ctrlKey || e.metaKey) && e.key === '[') {
    if (e.shiftKey) sendToBack();
    else sendBackward();
  }

  // -----------------------------------------------
  // COPY (Ctrl + C)
  // -----------------------------------------------
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
    if (state.selectedIds.length && state.selectedIds[0] !== 'body') {
      const id = state.selectedIds[0];
      const el = state.elements.find(x => x.id === id);
      if (el) {
        copiedElement = JSON.parse(JSON.stringify(el)); // deep clone
      }
    }
  }

  // -----------------------------------------------
  // PASTE (Ctrl + V)
  // -----------------------------------------------
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
    if (copiedElement) {
      const clone = JSON.parse(JSON.stringify(copiedElement));

      clone.id = 'id_' + Math.random().toString(36).slice(2, 9);
      clone.x += 30;
      clone.y += 30;

      state.elements.push(clone);
      state.selectedIds = [clone.id];

      saveState();
      renderAll();
    }
  }

  // -----------------------------------------------
  // ARROW KEY MOVEMENT (SMOOTH 1PX)
  // -----------------------------------------------
  if (state.selectedIds.length && state.selectedIds[0] !== 'body') {

    const el = state.elements.find(x => x.id === state.selectedIds[0]);
    if (!el) return;

    let moved = false;
    const step = e.shiftKey ? 10 : 1;  // SHIFT = move 10px

    if (e.key === 'ArrowUp') { el.y -= step; moved = true; }
    if (e.key === 'ArrowDown') { el.y += step; moved = true; }
    if (e.key === 'ArrowLeft') { el.x -= step; moved = true; }
    if (e.key === 'ArrowRight') { el.x += step; moved = true; }

    if (moved) {
      e.preventDefault();
      renderAll();
      saveState();
    }
  }
};
