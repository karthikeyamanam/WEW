/* ============================================================
   ELEMENT CREATION (FIXED)
============================================================ */

/* ❗ DO NOT shadow pendingComponent */
window.pendingComponent = window.pendingComponent || null;

/* ============================================================
   BIND CANVAS CLICK AFTER DOM READY
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  if (!window.canvas) {
    console.error('[CREATE] canvas not found');
    return;
  }

  /* Canvas click = place component */
  canvas.addEventListener('mousedown', e => {

    if (!window.pendingComponent) return;

    const rect = canvas.getBoundingClientRect();
    const scale = state.zoom || 1;

    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const c = window.pendingComponent;

    const el = {
  id: createId(),
  type: c.type,
  x: snapToGrid ? Math.round(x / gridSize) * gridSize : x,
  y: snapToGrid ? Math.round(y / gridSize) * gridSize : y,
  width: c.width,
  height: c.height,
  content: c.content || '',
  options: c.options || [],
  src: c.src || '',

  /* ✅ ADD THESE (VIDEO DEFAULTS) */
  controls: true,
  autoplay: false,
  loop: false,
  muted: false,

  iconClass: c.iconClass || '',
  styles: JSON.parse(JSON.stringify(c.styles || {})),
  animation: {
    name: '',
    duration: 800,
    delay: 0,
    fromX: 0,
    fromY: 0,
    trigger: 'load',
    once: true
  }
};


    state.elements.push(el);
    state.selectedIds = [el.id];

    /* reset component selection */
    window.pendingComponent = null;

    document.querySelectorAll('.component-item')
      .forEach(i => i.classList.remove('active'));

    saveState();
    renderAll();
  });

});
