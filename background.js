/* ============================================================
   5. GLOBAL FIXED BACKGROUND (video / image)
============================================================ */

let globalBG = null;

function renderGlobalBackground() {
  if (globalBG && globalBG.parentElement) {
    globalBG.remove();
    globalBG = null;
  }

  const cfg = state.body;

  // RESET BODY BACKGROUND COMPLETELY
  document.body.style.background = 'transparent';
  document.body.style.backgroundImage = 'none';

  // ================= COLOR BG =================
  if (cfg.backgroundType === 'color') {
    document.body.style.background = cfg.styles.background || '#ffffff';
    return;
  }

  // ================= IMAGE BG =================
  if (cfg.backgroundType === 'image' && cfg.bgSrc) {
    const img = document.createElement('img');
    img.src = cfg.bgSrc;

    Object.assign(img.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      zIndex: '-9999',
      pointerEvents: 'none'
    });

    img.setAttribute('aria-hidden', 'true');
    document.body.appendChild(img);
    globalBG = img;
    return;
  }

  // ================= VIDEO BG =================
  if (cfg.backgroundType === 'video' && cfg.bgSrc) {
    const vid = document.createElement('video');
    const vp = cfg.bgVideoProps || {};

    vid.src = cfg.bgSrc;
    vid.autoplay = !!vp.autoplay;
    vid.loop = !!vp.loop;
    vid.controls = !!vp.controls;
    vid.muted = !!vp.muted;
    vid.playsInline = true;

    Object.assign(vid.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      objectFit: 'cover',
      zIndex: '-9999',
      pointerEvents: 'none'
    });

    document.body.appendChild(vid);
    globalBG = vid;

    try { vid.play().catch(() => {}); } catch (e) {}
  }
}

/* ================= GRID VISIBILITY ================= */

function shouldShowGrid() {
  return !(
    state.body.backgroundType === 'image' ||
    state.body.backgroundType === 'video'
  );
}

/* ================= GLOBAL EXPORTS ================= */

window.renderGlobalBackground = renderGlobalBackground;
window.shouldShowGrid = shouldShowGrid;
