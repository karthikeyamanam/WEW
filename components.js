/* ============================================================
   COMPONENT DEFINITIONS
============================================================ */

const components = [
  { type: 'div', label: 'Box / Div', width: 200, height: 100, content: 'Box',
    styles: { background: '#eee', color: '#222' }},

  { type: 'button', label: 'Button', width: 100, height: 40, content: 'Click Me',
    styles: { background: '#1f6feb', color: '#fff', borderRadius: '4px' }},

  { type: 'heading', label: 'Heading (H2)', width: 320, height: 50, content: 'Heading',
    styles: { fontWeight: '700', fontSize: '24px', color: '#222' }},

  { type: 'paragraph', label: 'Paragraph', width: 320, height: 80,
    content: 'Lorem ipsum dolor sit.',
    styles: { fontSize: '14px', color: '#333' }},

  { type: 'input', label: 'Input Field', width: 240, height: 36, content: '',
    styles: { background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }},

  { type: 'textarea', label: 'Textarea', width: 320, height: 90, content: '',
    styles: { background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }},

  { type: 'select', label: 'Select Dropdown', width: 200, height: 36,
    options: ['Option 1', 'Option 2'],
    styles: { background: '#fff', border: '1px solid #ccc', borderRadius: '4px' }},

  /* 🔧 Checkbox rendered as input (no logic change) */
  { type: 'input', label: 'Checkbox', width: 20, height: 20, content: '',
    styles: { background: 'transparent' }, _asCheckbox: true },

  { type: 'image', label: 'Image', width: 320, height: 180,
    src: 'https://picsum.photos/320/180',
    styles: { borderRadius: '6px' }},

  { type: 'video', label: 'Video', width: 360, height: 240,
    src: 'https://www.w3schools.com/html/mov_bbb.mp4',
    styles: { borderRadius: '6px' }},

  { type: 'icon', label: 'Icon', width: 40, height: 40,
    iconClass: 'fa-solid fa-star',
    styles: { color: '#111827' }}
];


/* ============================================================
   ANIMATION MAP (GLOBAL, REQUIRED)
============================================================ */

const animations = {
  'fade-in': 'fadeIn',
  'fade-out': 'fadeOut',
  'fade-in-up': 'fadeInUp',
  'fade-in-down': 'fadeInDown',
  'fade-in-left': 'fadeInLeft',
  'fade-in-right': 'fadeInRight',
  'fade-out-up': 'fadeOutUp',
  'fade-out-down': 'fadeOutDown',

  'slide-in-left': 'slideInLeft',
  'slide-in-right': 'slideInRight',
  'slide-in-up': 'slideInUp',
  'slide-in-down': 'slideInDown',
  'slide-out-left': 'slideOutLeft',
  'slide-out-right': 'slideOutRight',
  'slide-up': 'slideUp',
  'slide-down': 'slideDown',

  'scale-in': 'scaleIn',
  'scale-in-small': 'scaleInSmall',
  'scale-in-big': 'scaleInBig',
  'scale-out': 'scaleOut',
  'scale-out-small': 'scaleOutSmall',
  'scale-out-big': 'scaleOutBig',

  'pulse': 'pulse',
  'bounce-scale': 'bounceScale'
};

/* 🔧 GUARANTEE GLOBALS */
window.animations = animations;
window.pendingComponent = null;


/* ============================================================
   ANIMATION POPUP
============================================================ */

function openAnimationPopup(el) {
  if (!el) return;

  const name = prompt(
    'Enter animation name:\n' + Object.keys(animations).join(', '),
    el.animation?.name || ''
  );

  if (!name || !animations[name]) return;

  const duration = parseInt(
    prompt('Duration (ms):', el.animation?.duration || 800),
    10
  );

  const delay = parseInt(
    prompt('Delay (ms):', el.animation?.delay || 0),
    10
  );

  el.animation = el.animation || {};
  el.animation.name = name;
  el.animation.duration = isNaN(duration) ? 800 : duration;
  el.animation.delay = isNaN(delay) ? 0 : delay;

  el._played = false;
  saveState();
  renderAll();
}


/* ============================================================
   COMPONENTS PANEL RENDER
============================================================ */

function renderComponentsList() {
  if (!window.componentsList) return;

  componentsList.innerHTML = '';

  components.forEach(c => {
    const div = document.createElement('div');
    div.className = 'component-item';
    div.textContent = c.label;

    div.onclick = () => {
      window.pendingComponent = c;

      componentsList
        .querySelectorAll('.component-item')
        .forEach(i => i.classList.remove('active'));

      div.classList.add('active');
    };

    componentsList.appendChild(div);
  });
}


/* ============================================================
   GLOBAL EXPORTS (MANDATORY)
============================================================ */

window.components = components;
window.openAnimationPopup = openAnimationPopup;
window.renderComponentsList = renderComponentsList;
