/* ============================================================
   RENDER.JS — FINAL (BOX PROPERTIES ENABLED)
   Logic preserved. No UI redesign. No breaking changes.
============================================================ */

/* ---------------- SAFETY ---------------- */


/* ---------------- GRID ---------------- */
function shouldShowGrid() {
  return !(state.body.backgroundType === 'image' ||
           state.body.backgroundType === 'video');
}

/* ---------------- TEXT STYLES ---------------- */
function applyTextStyles(node, el) {
  node.style.fontFamily = el.styles.fontFamily || 'Inter, sans-serif';
  node.style.fontStyle = el.styles.fontStyle || 'normal';
  node.style.fontWeight = el.styles.fontWeight || '400';
  node.style.textAlign = el.styles.textAlign || 'center';
  node.style.fontSize = el.styles.fontSize || '14px';
  node.style.letterSpacing = el.styles.letterSpacing || '';
  node.style.lineHeight = el.styles.lineHeight || '';
  node.style.textTransform = el.styles.textTransform || '';
  node.style.textShadow = el.styles.textShadow || '';
}

/* ---------------- SCROLL OBSERVER ---------------- */
/* ---------------- SCROLL OBSERVER (FINAL) ---------------- */
const scrollObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const el = entry.target;

    const animIn = el.dataset.animate;
    const animOut = el.dataset.animateOut;  // reverse animation
    const once = el.dataset.once === "true";

    // ENTER VIEWPORT → PLAY IN ANIMATION
    if (entry.isIntersecting) {
      el.style.animation = "none";
      el.offsetHeight;
      el.style.animation = animIn;
      el.style.opacity = "1";

      if (once) {
        scrollObserver.unobserve(el);
      }
      return;
    }

    // EXIT VIEWPORT → ONLY for once=false
    if (!once) {
      // If reverse available → play OUT animation
      if (animOut) {
        el.style.animation = "none";
        el.offsetHeight;
        el.style.animation = animOut;
      } else {
        // otherwise hide it to reset
        el.style.opacity = "0";
      }
    }
  });
}, { threshold: 0.25 });



/* ============================================================
   CREATE ELEMENT NODE
============================================================ */
function createElementNode(el) {
  const n = document.createElement('div');
  n.className = 'canvas-element';
  n.dataset.id = el.id;
  n.dataset.type = el.type;

  if (state.selectedIds.includes(el.id)) {
    n.classList.add('selected');
  }

  /* ---------------- POSITION & SIZE ---------------- */
  n.style.left = el.x + 'px';
  n.style.top = el.y + 'px';
  n.style.width = el.width + 'px';
  n.style.height = el.height + 'px';

  /* ---------------- BOX STYLES ---------------- */
  Object.assign(n.style, {
    background: el.styles.background || 'transparent',
    color: el.styles.color || '#000',
    borderRadius: el.styles.borderRadius || '',
    padding: el.styles.padding || '',
    margin: el.styles.margin || '',
    borderWidth: el.styles.borderWidth || '',
    borderStyle: el.styles.borderStyle || '',
    borderColor: el.styles.borderColor || '',
    boxShadow: el.styles.boxShadow || '',
    backgroundImage: el.styles.backgroundImage || '',
    backgroundSize: el.styles.backgroundSize || '',
    backgroundRepeat: el.styles.backgroundRepeat || '',
    position: el.styles.position || 'absolute',
    zIndex: el.styles.zIndex || 1
  });

  if (!['icon','image','video'].includes(el.type)) {
    applyTextStyles(n, el);
  }

  /* ---------------- CONTENT RENDERING ---------------- */
  if (el.type === 'heading') {
    const h = document.createElement('h2');
    h.textContent = el.content || 'Heading';
    h.style.margin = '0';
    h.style.pointerEvents = 'none';
    applyTextStyles(h, el);
    n.appendChild(h);
  }

  else if (el.type === 'paragraph') {
    const p = document.createElement('p');
    p.textContent = el.content || 'Paragraph';
    p.style.margin = '0';
    p.style.pointerEvents = 'none';
    applyTextStyles(p, el);
    n.appendChild(p);
  }

  else if (el.type === 'button') {
    const b = document.createElement('button');
    b.textContent = el.content || 'Button';
    b.style.all = 'unset';
    b.style.pointerEvents = 'none';
    n.appendChild(b);
  }

  else if (el.type === 'input') {
    const i = document.createElement('input');
    i.type = 'text';
    i.value = el.content || '';
    i.style.width = '100%';
    i.style.height = '100%';
    i.style.pointerEvents = 'none';
    n.appendChild(i);
  }

  else if (el.type === 'textarea') {
    const t = document.createElement('textarea');
    t.value = el.content || '';
    t.style.width = '100%';
    t.style.height = '100%';
    t.style.pointerEvents = 'none';
    n.appendChild(t);
  }

  else if (el.type === 'select') {
    const s = document.createElement('select');
    (el.options || []).forEach(o => {
      const op = document.createElement('option');
      op.textContent = o;
      s.appendChild(op);
    });
    s.style.width = '100%';
    s.style.height = '100%';
    s.style.pointerEvents = 'none';
    n.appendChild(s);
  }

  else if (el.type === 'icon') {
    const i = document.createElement('i');
    i.className = el.iconClass || 'fa-solid fa-star';
    i.style.fontSize = el.styles.fontSize || '32px';
    i.style.color = el.styles.color || '#000';
    i.style.pointerEvents = 'none';
    n.appendChild(i);
  }

  else if (el.type === 'image') {
    const img = document.createElement('img');
    img.src = el.src || '';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.style.pointerEvents = 'none';
    n.appendChild(img);
  }

  else if (el.type === 'video') {
    const v = document.createElement('video');
    v.src = el.src || '';
    v.style.width = '100%';
    v.style.height = '100%';
    v.style.objectFit = el.styles.objectFit || 'cover';

    v.controls = el.controls !== false;
    v.autoplay = el.autoplay === true;
    v.loop = el.loop === true;
    v.muted = el.muted === true;

    v.playsInline = true;
    v.pointerEvents = 'none';
    n.appendChild(v);
  }

  /* ------------------------------------------------------
      ANIMATION ENGINE — NORMAL / SCROLL / HOVER
  ------------------------------------------------------ */

  el.animation ||= {
    name: '',
    duration: 800,
    delay: 0,
    fromX: 0,
    fromY: 0,
    trigger: 'normal',
    autoReverse: true,
    once: true
  };

  const reverseMap = {
    scaleIn: "scaleOut",
    scaleOut: "scaleIn",
    scaleInSmall: "scaleOutSmall",
    scaleInBig: "scaleOutBig",
    fadeIn: "fadeOut",
    fadeInUp: "fadeOutDown",
    fadeInDown: "fadeOutUp",
    fadeInLeft: "fadeOutLeft",
    fadeInRight: "fadeOutRight",
    slideInLeft: "slideOutLeft",
    slideInRight: "slideOutRight",
    slideInUp: "slideDown",
    slideInDown: "slideUp"
  };

  if (el.animation.name && animations[el.animation.name]) {

    const animIn =
      `${animations[el.animation.name]} ${el.animation.duration}ms ease ${el.animation.delay}ms both`;

    const animOut = reverseMap[el.animation.name]
      ? `${reverseMap[el.animation.name]} ${el.animation.duration}ms ease 0ms both`
      : null;

    /* Initial transform offsets */
    n.style.setProperty("--tx", (el.animation.fromX || 0) + "px");
    n.style.setProperty("--ty", (el.animation.fromY || 0) + "px");

    /* ----------- SCROLL TRIGGER ----------- */
    /* ----------- SCROLL TRIGGER (ALWAYS RESET) ----------- */
/* ----------- SCROLL TRIGGER (ALWAYS RESET) ----------- */
if (el.animation.trigger === "scroll") {

  n.style.opacity = "0";

  // Store IN animation
  n.dataset.animate = animIn;

  // Store OUT animation (reverse)
  if (animOut) {
    n.dataset.animateOut = animOut;
  } else {
    n.dataset.animateOut = "";
  }

  // Scroll animations always replay
  n.dataset.once = "false";

  scrollObserver.observe(n);
}



    /* ----------- HOVER TRIGGER ----------- */
    else if (el.animation.trigger === "hover") {

      n.style.opacity = "1";

      n.onmouseenter = () => {
        n.style.animation = "none";
        n.offsetHeight;
        n.style.animation = animIn;
      };

      n.onmouseleave = () => {
        if (el.animation.autoReverse && animOut) {
          n.style.animation = "none";
          n.offsetHeight;
          n.style.animation = animOut;
        }
      };
    }

    /* ----------- NORMAL (DEFAULT) ----------- */
    else {
      n.style.animation = "none";
      n.offsetHeight;
      n.style.animation = animIn;
    }
  }

  /* ------------------------------------------------------
      ELEMENT EVENTS
  ------------------------------------------------------ */

  n.onclick = e => {
    e.stopPropagation();
    selectElement(el.id);
  };

  n.onmousedown = e => {
    e.stopPropagation();
    startDrag(e, el.id);
  };

  if (state.selectedIds.includes(el.id)) {
    ["nw","ne","sw","se"].forEach(pos => {
      const h = document.createElement("div");
      h.className = `resize-handle ${pos}`;
      h.onmousedown = e => {
        e.stopPropagation();
        startResize(e, el.id, pos);
      };
      n.appendChild(h);
    });
  }

  return n;
}




/* ============================================================
   CANVAS
============================================================ */
function renderCanvas() {
  canvas.style.width = '100%';

  let maxBottom = 0;
  state.elements.forEach(el => {
    maxBottom = Math.max(maxBottom, el.y + el.height);
  });

  canvas.style.height = maxBottom + 800 + 'px';
  canvas.style.transform = `scale(${state.zoom})`;
  canvas.style.transformOrigin = '0 0';

  canvas.style.backgroundColor =
    state.body.backgroundType === 'color'
      ? state.body.styles.background || 'transparent'
      : 'transparent';
  /* ================= BODY BG VISIBILITY FIX ================= */
if (state.body.backgroundType === 'video') {
  document.body.style.background = 'transparent';
  canvasWrapper.style.background = 'transparent';
} else {
  document.body.style.background = 'var(--bg)';
  canvasWrapper.style.background = 'var(--bg)';
}

      /* ================= BODY VIDEO BACKGROUND ================= */

/* remove old bg video if exists */
/* ================= BODY VIDEO BACKGROUND (FIXED) ================= */

/* remove old bg video if exists */
const oldBgVideo = document.querySelector('.canvas-bg-video');
if (oldBgVideo) oldBgVideo.remove();

if (state.body.backgroundType === 'video' && state.body.bgSrc) {
  const bgVideo = document.createElement('video');
  bgVideo.className = 'canvas-bg-video';

  bgVideo.src = state.body.bgSrc;

  const vp = state.body.bgVideoProps || {};
  bgVideo.autoplay = vp.autoplay !== false;
  bgVideo.loop = vp.loop !== false;
  bgVideo.muted = vp.muted !== false;
  bgVideo.controls = false;

  bgVideo.playsInline = true;

  Object.assign(bgVideo.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    objectFit: 'cover',
    zIndex: '0',
    pointerEvents: 'none'
  });

  document.body.prepend(bgVideo);
}


  if (shouldShowGrid()) {
  canvas.style.backgroundImage =
    'linear-gradient(#e5e8ec 1px, transparent 1px), ' +
    'linear-gradient(90deg, #e5e8ec 1px, transparent 1px)';
  canvas.style.backgroundSize = `${gridSize}px ${gridSize}px`;
} else {
  canvas.style.backgroundImage = 'none';
}

  canvas.querySelectorAll('.canvas-element').forEach(n => {
  scrollObserver.unobserve(n);
  n.remove();
});

  state.elements.forEach(el => canvas.appendChild(createElementNode(el)));
}

/* ============================================================
   LAYERS
============================================================ */
function renderLayers() {
  layersPanel.innerHTML = '';

  const bodyLayer = document.createElement('div');
  bodyLayer.className = 'layer-item';
  bodyLayer.textContent = 'Body';
  bodyLayer.onclick = () => {
    state.selectedIds = ['body'];
    renderAll();
  };
  layersPanel.appendChild(bodyLayer);

  state.elements.slice().reverse().forEach(el => {
    const d = document.createElement('div');
    d.className = 'layer-item';
    d.textContent = `${el.type} (${el.id.slice(-4)})`;
    d.onclick = () => selectElement(el.id);
    layersPanel.appendChild(d);
  });
}

/* ============================================================
   PROPERTIES HELPERS
============================================================ */
function section(title) {
  const h = document.createElement('h4');
  h.textContent = title;
  h.style.margin = '14px 0 6px';
  h.style.fontSize = '13px';
  h.style.color = '#374151';
  propsPanel.appendChild(h);
}

function field(label, type, value, onChange) {
  const g = document.createElement('div');
  g.className = 'prop-group';

  const l = document.createElement('label');
  l.textContent = label;

  const i = document.createElement('input');
  i.type = type;
  i.value = value ?? '';

  /* 🔑 Update state while typing (NO re-render) */
  i.addEventListener('input', () => {
    onChange(i.value);
  });

  /* 🔑 Commit change AFTER typing is done */
  i.addEventListener('blur', () => {
    saveState();
    renderAll();
  });

  g.append(l, i);
  propsPanel.appendChild(g);
}


function selectField(label, options, value, onChange) {
  const g = document.createElement('div');
  g.className = 'prop-group';

  const l = document.createElement('label');
  l.textContent = label;

  const s = document.createElement('select');

  options.forEach(o => {
    const op = document.createElement('option');
    op.value = o;
    op.textContent = o;

    // 🔥 LIVE FONT PREVIEW
    if (label === 'Font Family') {
      op.style.fontFamily = o;

      // load font dynamically
      if (!document.querySelector(`link[data-font="${o}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href =
          `https://fonts.googleapis.com/css2?family=${o.replace(/ /g, '+')}:wght@300;400;600;700&display=swap`;
        link.setAttribute("data-font", o);
        document.head.appendChild(link);
      }
    }

    if (o === value) op.selected = true;
    s.appendChild(op);
  });

  s.onchange = () => {
    onChange(s.value);
    saveState();
    renderAll();
  };

  g.append(l, s);
  propsPanel.appendChild(g);
}



/* ============================================================
   BOX PROPERTIES (DIV)
============================================================ */
function renderBoxProps(el) {

  section('Layout');
  field('Width', 'number', el.width, v => el.width = parseInt(v) || el.width);
  field('Height', 'number', el.height, v => el.height = parseInt(v) || el.height);
  field('Padding', 'text', el.styles.padding || '', v => el.styles.padding = v);
  field('Margin', 'text', el.styles.margin || '', v => el.styles.margin = v);

  section('Border');
  field('Border Width', 'text', el.styles.borderWidth || '', v => el.styles.borderWidth = v);
  selectField(
    'Border Style',
    ['none','solid','dashed','dotted'],
    el.styles.borderStyle || 'none',
    v => el.styles.borderStyle = v
  );
  field('Border Color', 'color', el.styles.borderColor || '#000', v => el.styles.borderColor = v);
  field('Border Radius', 'text', el.styles.borderRadius || '', v => el.styles.borderRadius = v);

  section('Shadow');
  field('Box Shadow', 'text', el.styles.boxShadow || '', v => el.styles.boxShadow = v);

  section('Background');
  field('Background Color', 'color', el.styles.background || '', v => el.styles.background = v);
  field(
    'Background Image URL',
    'text',
    el.styles.backgroundImage?.replace(/^url\(|\)$/g, '') || '',
    v => el.styles.backgroundImage = v ? `url(${v})` : ''
  );

  section('Position');
  selectField(
    'Position',
    ['absolute','relative','fixed'],
    el.styles.position || 'absolute',
    v => el.styles.position = v
  );
  field('X', 'number', el.x, v => el.x = parseInt(v) || 0);
  field('Y', 'number', el.y, v => el.y = parseInt(v) || 0);
  field('Z-Index', 'number', el.styles.zIndex || 1, v => el.styles.zIndex = parseInt(v) || 1);


  /* =====================================================
        ANIMATION SETTINGS  (FINAL, CORRECT)
  ====================================================== */
  section('Animation');

  /* Animation Trigger Mode: normal / scroll / hover */
  selectField(
    'Animation Mode',
    ['normal', 'scroll', 'hover'],
    el.animation.trigger || 'normal',
    v => el.animation.trigger = v
  );

  /* Animation Name */
  selectField(
    'Animation Name',
    ['None', ...Object.keys(window.animations || {})],
    el.animation.name || 'None',
    v => {
      el.animation.name = v === 'None' ? '' : v;
      el._played = false;
    }
  );

  /* Duration (seconds → ms) */
  field(
    'Duration (seconds)',
    'number',
    (el.animation.duration || 800) / 1000,
    v => el.animation.duration = (parseFloat(v) || 0) * 1000
  );

  /* Delay (seconds → ms) */
  field(
    'Delay (seconds)',
    'number',
    (el.animation.delay || 0) / 1000,
    v => el.animation.delay = (parseFloat(v) || 0) * 1000
  );

  /* Auto Reverse */
  checkboxField(
    'Auto Reverse (hover only)',
    el.animation.autoReverse !== false,
    v => el.animation.autoReverse = v
  );
}



function renderTextProps(el) {

  section('Content');
  field('Text', 'text', el.content || '', v => el.content = v);

  section('Typography');

  /* -------------------------------
       FONT FAMILY DROPDOWN
  --------------------------------*/
  selectField(
    'Font Family',
    [
      'Inter', 'Poppins', 'Roboto', 'Montserrat', 'Nunito',
      'Open Sans', 'Lato', 'Oswald', 'Raleway',
      'Playfair Display', 'Merriweather'
    ],
    el.styles.fontFamily || 'Inter',
    v => el.styles.fontFamily = v
  );

  field(
    'Font Size (px)',
    'number',
    parseInt(el.styles.fontSize) || 16,
    v => el.styles.fontSize = v + 'px'
  );

  selectField(
    'Font Weight',
    ['300','400','500','600','700','800'],
    el.styles.fontWeight || '400',
    v => el.styles.fontWeight = v
  );

  checkboxField(
    'Italic',
    el.styles.fontStyle === 'italic',
    v => el.styles.fontStyle = v ? 'italic' : 'normal'
  );

  section('Text Style');

  field(
    'Text Color',
    'color',
    el.styles.color || '#000000',
    v => el.styles.color = v
  );

  selectField(
    'Text Align',
    ['left','center','right','justify'],
    el.styles.textAlign || 'center',
    v => el.styles.textAlign = v
  );

  selectField(
    'Transform',
    ['none','uppercase','lowercase','capitalize'],
    el.styles.textTransform || 'none',
    v => el.styles.textTransform = v
  );

  field(
    'Letter Spacing (px)',
    'number',
    parseInt(el.styles.letterSpacing) || 0,
    v => el.styles.letterSpacing = v + 'px'
  );

  field(
    'Line Height',
    'number',
    parseFloat(el.styles.lineHeight) || 1.4,
    v => el.styles.lineHeight = v
  );

  section('Spacing');

  field('Margin', 'text', el.styles.margin || '', v => el.styles.margin = v);
  field('Padding', 'text', el.styles.padding || '', v => el.styles.padding = v);


  /* ============================================================
        ANIMATION SETTINGS — NEW TRIGGER ENGINE
  ============================================================ */
  section('Animation');

  /* Animation Trigger: normal | scroll | hover */
  selectField(
    'Animation Mode',
    ['normal', 'scroll', 'hover'],
    el.animation.trigger || 'normal',
    v => el.animation.trigger = v
  );

  /* Animation Name */
  selectField(
    'Animation Name',
    ['None', ...Object.keys(window.animations || {})],
    el.animation.name || 'None',
    v => {
      el.animation.name = v === 'None' ? '' : v;
      el._played = false;
    }
  );

  /* Duration (seconds → ms) */
  field(
    'Duration (seconds)',
    'number',
    (el.animation.duration || 800) / 1000,
    v => el.animation.duration = (parseFloat(v) || 0) * 1000
  );

  /* Delay (seconds → ms) */
  field(
    'Delay (seconds)',
    'number',
    (el.animation.delay || 0) / 1000,
    v => el.animation.delay = (parseFloat(v) || 0) * 1000
  );

  /* Auto Reverse only for hover */
  checkboxField(
    'Auto Reverse (hover only)',
    el.animation.autoReverse !== false,
    v => el.animation.autoReverse = v
  );
}
function renderButtonProps(el) {

  section('Content');
  field('Button Text', 'text', el.content || '', v => el.content = v);

  section('Typography');

  /* -------------------------------
       FONT FAMILY DROPDOWN
  --------------------------------*/
  selectField(
    'Font Family',
    [
      'Inter', 'Poppins', 'Roboto', 'Montserrat', 'Nunito',
      'Open Sans', 'Lato', 'Oswald', 'Raleway',
      'Playfair Display', 'Merriweather'
    ],
    el.styles.fontFamily || 'Inter',
    v => el.styles.fontFamily = v
  );

  field(
    'Font Size (px)',
    'number',
    parseInt(el.styles.fontSize) || 14,
    v => el.styles.fontSize = v + 'px'
  );

  field(
    'Text Color',
    'color',
    el.styles.color || '#ffffff',
    v => el.styles.color = v
  );

  section('Box');

  field(
    'Padding',
    'text',
    el.styles.padding || '8px 16px',
    v => el.styles.padding = v
  );

  field(
    'Background Color',
    'color',
    el.styles.background || '#2563eb',
    v => el.styles.background = v
  );

  field(
    'Border Radius',
    'text',
    el.styles.borderRadius || '6px',
    v => el.styles.borderRadius = v
  );

  field(
    'Box Shadow',
    'text',
    el.styles.boxShadow || '',
    v => el.styles.boxShadow = v
  );


  /* ============================================================
        ANIMATION SETTINGS — FINAL
  ============================================================ */
  section('Animation');

  /* Animation Trigger: normal | scroll | hover */
  selectField(
    'Animation Mode',
    ['normal', 'scroll', 'hover'],
    el.animation.trigger || 'normal',
    v => el.animation.trigger = v
  );

  /* Animation Name */
  selectField(
    'Animation Name',
    ['None', ...Object.keys(window.animations || {})],
    el.animation.name || 'None',
    v => {
      el.animation.name = v === 'None' ? '' : v;
      el._played = false;
    }
  );

  /* Duration (seconds → ms) */
  field(
    'Duration (seconds)',
    'number',
    (el.animation.duration || 800) / 1000,
    v => el.animation.duration = (parseFloat(v) || 0) * 1000
  );

  /* Delay (seconds → ms) */
  field(
    'Delay (seconds)',
    'number',
    (el.animation.delay || 0) / 1000,
    v => el.animation.delay = (parseFloat(v) || 0) * 1000
  );

  /* Auto Reverse (Hover Only) */
  checkboxField(
    'Auto Reverse (hover only)',
    el.animation.autoReverse !== false,
    v => el.animation.autoReverse = v
  );
}





function renderImageProps(el) {

  section('Source');
  field('Image URL', 'text', el.src || '', v => el.src = v);
  field('Alt Text', 'text', el.alt || '', v => el.alt = v);

  section('Layout');
  field('Width', 'number', el.width, v => el.width = parseInt(v) || el.width);
  field('Height', 'number', el.height, v => el.height = parseInt(v) || el.height);

  selectField(
    'Object Fit',
    ['cover', 'contain', 'fill', 'none'],
    el.styles.objectFit || 'cover',
    v => el.styles.objectFit = v
  );

  field(
    'Border Radius',
    'text',
    el.styles.borderRadius || '',
    v => el.styles.borderRadius = v
  );

  field(
    'Box Shadow',
    'text',
    el.styles.boxShadow || '',
    v => el.styles.boxShadow = v
  );


  /* =====================================================
        ANIMATION SETTINGS — FINAL
  ====================================================== */
  section('Animation');

  /* Animation Trigger: normal / scroll / hover */
  selectField(
    'Animation Mode',
    ['normal', 'scroll', 'hover'],
    el.animation.trigger || 'normal',
    v => el.animation.trigger = v
  );

  /* Animation Name */
  selectField(
    'Animation Name',
    ['None', ...Object.keys(window.animations || {})],
    el.animation.name || 'None',
    v => {
      el.animation.name = v === 'None' ? '' : v;
      el._played = false;
    }
  );

  /* Duration (seconds → ms) */
  field(
    'Duration (seconds)',
    'number',
    (el.animation.duration || 800) / 1000,
    v => el.animation.duration = (parseFloat(v) || 0) * 1000
  );

  /* Delay (seconds → ms) */
  field(
    'Delay (seconds)',
    'number',
    (el.animation.delay || 0) / 1000,
    v => el.animation.delay = (parseFloat(v) || 0) * 1000
  );

  /* Auto Reverse (Hover Only) */
  checkboxField(
    'Auto Reverse (hover only)',
    el.animation.autoReverse !== false,
    v => el.animation.autoReverse = v
  );
}




/* ============================================================
   INPUT / TEXTAREA / SELECT PROPERTIES
============================================================ */
function renderInputProps(el) {

  section('Content');
  field('Value', 'text', el.content || '', v => el.content = v);

  section('Layout');
  field('Width', 'number', el.width, v => el.width = parseInt(v) || el.width);
  field('Height', 'number', el.height, v => el.height = parseInt(v) || el.height);

  section('Style');
  field('Background Color', 'color', el.styles.background || '#ffffff',
    v => el.styles.background = v
  );
  field('Text Color', 'color', el.styles.color || '#000000',
    v => el.styles.color = v
  );
  field('Border Radius', 'text', el.styles.borderRadius || '',
    v => el.styles.borderRadius = v
  );
  field('Box Shadow', 'text', el.styles.boxShadow || '',
    v => el.styles.boxShadow = v
  );
}

/* ============================================================
   VIDEO PROPERTIES
============================================================ */
function renderVideoProps(el) {

  section('Source');
  field('Video URL', 'text', el.src || '',
    v => el.src = v
  );

  section('Layout');
  field('Width', 'number', el.width, v => el.width = parseInt(v) || el.width);
  field('Height', 'number', el.height, v => el.height = parseInt(v) || el.height);

  section('Playback');
  checkboxField('Show Controls', el.controls !== false,
    v => el.controls = v
  );

  checkboxField('Autoplay', el.autoplay !== false,
    v => el.autoplay = v
  );

  checkboxField('Loop', el.loop !== false,
    v => el.loop = v
  );

  checkboxField('Muted', el.muted !== false,
    v => el.muted = v
  );

  section('Style');
  field('Border Radius', 'text', el.styles.borderRadius || '',
    v => el.styles.borderRadius = v
  );

  field('Box Shadow', 'text', el.styles.boxShadow || '',
    v => el.styles.boxShadow = v
  );


  /* =====================================================
        ANIMATION SETTINGS — ADDED (FINAL)
  ====================================================== */
  section('Animation');

  selectField(
    'Animation Mode',
    ['normal', 'scroll', 'hover'],
    el.animation.trigger || 'normal',
    v => el.animation.trigger = v
  );

  selectField(
    'Animation Name',
    ['None', ...Object.keys(window.animations || {})],
    el.animation.name || 'None',
    v => {
      el.animation.name = v === 'None' ? '' : v;
      el._played = false;
    }
  );

  field(
    'Duration (seconds)',
    'number',
    (el.animation.duration || 800) / 1000,
    v => el.animation.duration = (parseFloat(v) || 0) * 1000
  );

  field(
    'Delay (seconds)',
    'number',
    (el.animation.delay || 0) / 1000,
    v => el.animation.delay = (parseFloat(v) || 0) * 1000
  );

  checkboxField(
    'Auto Reverse (hover only)',
    el.animation.autoReverse !== false,
    v => el.animation.autoReverse = v
  );
}


function renderBodyProps() {

  section('Background');
  selectField(
    'Background Type',
    ['color','image','video'],
    state.body.backgroundType,
    v => state.body.backgroundType = v
  );

  if (state.body.backgroundType === 'color') {
    field('Background Color', 'color',
      state.body.styles.background || '#ffffff',
      v => state.body.styles.background = v
    );
  }

  if (state.body.backgroundType !== 'color') {
    field('Source URL', 'text', state.body.bgSrc || '', v => state.body.bgSrc = v);
  }

  section('Layout');
  field('Max Width (px)', 'number',
    state.body.maxWidth || 1200,
    v => state.body.maxWidth = parseInt(v) || 1200
  );

  checkboxField(
    'Center Layout',
    state.body.centered !== false,
    v => state.body.centered = v
  );
}
function checkboxField(label, checked, onChange) {
  const g = document.createElement('div');
  g.className = 'prop-group';
  g.style.display = 'flex';
  g.style.alignItems = 'center';
  g.style.gap = '8px';

  const i = document.createElement('input');
  i.type = 'checkbox';
  i.checked = !!checked;

  const l = document.createElement('label');
  l.textContent = label;

  i.onchange = () => {
    onChange(i.checked);
    saveState();
    renderAll();
  };

  g.append(i, l);
  propsPanel.appendChild(g);
}

/* ============================================================
   PROPERTIES ROUTER
============================================================ */
function renderProps() {
  propsPanel.innerHTML = '';

  if (!state.selectedIds.length) {
    propsPanel.textContent = 'Select an element';
    return;
  }

  const id = state.selectedIds[0];

  /* ---------- BODY ---------- */
  if (id === 'body') {
    renderBodyProps();
    return;
  }

  const el = state.elements.find(e => e.id === id);
  if (!el) return;

  /* ---------- ELEMENT ROUTING ---------- */
  if (el.type === 'div') {
  renderBoxProps(el);
}
else if (el.type === 'heading' || el.type === 'paragraph') {
  renderTextProps(el);
}
else if (el.type === 'button') {
  renderButtonProps(el);
}
else if (el.type === 'image') {
  renderImageProps(el);
}
else if (el.type === 'input' || el.type === 'textarea' || el.type === 'select') {
  renderInputProps(el);
}
else if (el.type === 'video') {
  renderVideoProps(el);
}
else {
  propsPanel.textContent = `${el.type} properties coming next…`;
}

}


/* ============================================================
   MAIN RENDER
============================================================ */
function renderAll() {
  renderCanvas();
  renderLayers();
  renderProps();
  if (elCount) elCount.textContent = state.elements.length;
  if (zoomVal) zoomVal.textContent = Math.round(state.zoom * 100) + '%';
}

/* ---------------- EXPORTS ---------------- */
window.renderAll = renderAll;
window.renderCanvas = renderCanvas;
window.renderLayers = renderLayers;
window.renderProps = renderProps;
