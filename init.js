/* ============================================================
   18. INIT (FIXED & SAFE)
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ------------------------------------------------------------
     DOM BINDINGS (CRITICAL)
  ------------------------------------------------------------ */
  // Bind DOM elements ONCE, safely
  window.canvasWrapper = document.getElementById('canvasWrapper');
  window.canvas = document.getElementById('canvas');

  /* ------------------------------------------------------------
     SAFETY CHECK
  ------------------------------------------------------------ */
  if (!window.canvas || !window.canvasWrapper) {
    console.error('[INIT] Canvas elements not found');
    return;
  }

  canvasWrapper.style.overflowY = 'auto';
  canvasWrapper.style.overflowX = 'hidden';

  /* ------------------------------------------------------------
     INITIALIZE UI
  ------------------------------------------------------------ */
  if (typeof renderComponentsList === 'function') {
    renderComponentsList();
  }

  if (typeof saveState === 'function') {
    saveState();
  }

  if (typeof renderAll === 'function') {
    renderAll();
  }

  /* ------------------------------------------------------------
     DEBUG ACCESS (OPTIONAL)
  ------------------------------------------------------------ */
  window.__mini_ui_state = window.state;
  window.__mini_ui_renderAll = window.renderAll;
  window.__mini_ui_set_snap = v => {
    window.snapToGrid = !!v;
    renderAll();
  };

});
