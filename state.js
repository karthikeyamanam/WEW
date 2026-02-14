/* ============================================================
   3. STATE
============================================================ */

const gridSize = 20;
const fontsList = [
  'Inter','Arial','Poppins','Roboto','Montserrat',
  'Open Sans','Lato','Courier New','Georgia','Times New Roman'
];

let snapToGrid = true;
let copiedElement = null;

const defaultBody = () => ({
  backgroundType: 'color',
  styles: { background: '#ffffff' },
  bgSrc: '',
  bgVideoProps: {
    controls: false,
    loop: true,
    muted: true,
    autoplay: true
  }
});

let state = {
  elements: [],
  selectedIds: ['body'],
  undoStack: [],
  redoStack: [],
  zoom: 1,
  body: defaultBody()
};

const createId = () => 'id_' + Math.random().toString(36).slice(2, 9);

function clamp(v, a, b) {
  return Math.max(a, Math.min(b, v));
}

/* ============================================================
   4. UNDO / REDO
============================================================ */

const saveState = () => {
  state.undoStack.push(JSON.stringify({
    elements: state.elements,
    body: state.body
  }));

  if (state.undoStack.length > 80) {
    state.undoStack.shift();
  }

  state.redoStack = [];
  updateButtons();
};

const undo = () => {
  if (!state.undoStack.length) return;

  state.redoStack.push(JSON.stringify({
    elements: state.elements,
    body: state.body
  }));

  const snap = JSON.parse(state.undoStack.pop());
  state.elements = snap.elements || [];
  state.body = snap.body || defaultBody();
  state.selectedIds = [];

  renderAll();
  updateButtons();
};

const redo = () => {
  if (!state.redoStack.length) return;

  state.undoStack.push(JSON.stringify({
    elements: state.elements,
    body: state.body
  }));

  const snap = JSON.parse(state.redoStack.pop());
  state.elements = snap.elements || [];
  state.body = snap.body || defaultBody();
  state.selectedIds = [];

  renderAll();
  updateButtons();
};

const updateButtons = () => {
  if (window.undoBtn) undoBtn.disabled = !state.undoStack.length;
  if (window.redoBtn) redoBtn.disabled = !state.redoStack.length;
};

/* ============================================================
   GLOBAL EXPORTS (MANDATORY)
============================================================ */

window.gridSize = gridSize;
window.fontsList = fontsList;
window.snapToGrid = snapToGrid;
window.copiedElement = copiedElement;

window.defaultBody = defaultBody;
window.state = state;

window.createId = createId;
window.clamp = clamp;

window.saveState = saveState;
window.undo = undo;
window.redo = redo;
window.updateButtons = updateButtons;
