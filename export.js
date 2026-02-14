/* ============================================================
   12. EXPORT (FIXED & HYPER-STABLE — MATCHES EDITOR ENGINE)
============================================================ */

const generateExportHTML = () => {

  const animationsMap = window.animations || {};

const gf = `
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&family=Poppins:wght@400;700&family=Roboto:wght@400;700&family=Montserrat:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
`;

  const indent = n => '  '.repeat(n);
  const bodyCfg = state.body;

  let html = `<!DOCTYPE html>
<html lang="en">
<head>
${indent(1)}<meta charset="UTF-8"/>
${indent(1)}<meta name="viewport" content="width=device-width, initial-scale=1"/>
${indent(1)}${gf}
${indent(1)}<title>Exported UI</title>
${indent(1)}<style>

html,body{
  margin:0;
  padding:0;
  width:100%;
  height:100%;
  overflow-x:hidden;
  overflow-y:auto;
  background:${bodyCfg.backgroundType === 'color'
    ? (bodyCfg.styles.background || '#ffffff')
    : 'transparent'};
}

.artboard{
  position:relative;
  width:100%;
  min-height:100vh;
}

.bg-media{
  position:fixed;
  inset:0;
  width:100vw;
  height:100vh;
  object-fit:cover;
  z-index:-9999;
  pointer-events:none;
}

img,video{
  max-width:100%;
  border-radius:8px;
}

/* ============================================================
   TRANSFORM PIPELINE (MATCHES EDITOR)
   Using --tx and --ty instead of --from-x / --from-y
============================================================ */
[data-animate], .anim {
  transform:
     translate(var(--tx, 0px), var(--ty, 0px))
     scale(var(--scale, 1));
  will-change: transform, opacity;
}

/* ========= KEYFRAMES (default animations) ============ */
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes fadeOut{from{opacity:1}to{opacity:0}}

@keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1}}
@keyframes fadeInDown{from{opacity:0;transform:translateY(-20px)}to{opacity:1}}
@keyframes fadeInLeft{from{opacity:0;transform:translateX(-20px)}to{opacity:1}}
@keyframes fadeInRight{from{opacity:0;transform:translateX(20px)}to{opacity:1}}

@keyframes fadeOutUp{to{opacity:0;transform:translateY(-20px)}}
@keyframes fadeOutDown{to{opacity:0;transform:translateY(20px)}}

@keyframes slideInLeft{from{transform:translateX(-100%)}to{transform:none}}
@keyframes slideInRight{from{transform:translateX(100%)}to{transform:none}}
@keyframes slideInUp{from{transform:translateY(100%)}to{transform:none}}
@keyframes slideInDown{from{transform:translateY(-100%)}to{transform:none}}

@keyframes slideOutLeft{to{transform:translateX(-100%)}}
@keyframes slideOutRight{to{transform:translateX(100%)}}
@keyframes slideUp{to{transform:translateY(-100%)}}
@keyframes slideDown{to{transform:translateY(100%)}}

/* SCALE */
@keyframes scaleIn{from{--scale:0;opacity:0}to{--scale:1;opacity:1}}
@keyframes scaleInSmall{from{--scale:.5;opacity:0}to{--scale:1;opacity:1}}
@keyframes scaleInBig{from{--scale:1.5;opacity:0}to{--scale:1;opacity:1}}
@keyframes scaleOut{from{--scale:1;opacity:1}to{--scale:0;opacity:0}}
@keyframes scaleOutSmall{from{--scale:1;opacity:1}to{--scale:.5;opacity:0}}
@keyframes scaleOutBig{from{--scale:1;opacity:1}to{--scale:1.5;opacity:0}}

</style>
</head>
<body>
${indent(1)}<div class="artboard">
`;

  /* ---------- BACKGROUND RENDER ---------- */
  if (bodyCfg.backgroundType === 'image' && bodyCfg.bgSrc) {
    html += `${indent(2)}<img src="${bodyCfg.bgSrc}" class="bg-media"/>\n`;
  }

  if (bodyCfg.backgroundType === 'video' && bodyCfg.bgSrc) {
    const vp = bodyCfg.bgVideoProps || {};
    html += `${indent(2)}<video src="${bodyCfg.bgSrc}" class="bg-media"
      ${vp.loop ? 'loop' : ''}
      ${vp.autoplay ? 'autoplay muted' : 'muted'}
      playsinline></video>\n`;
  }

  /* ---------- ELEMENTS ---------- */
  state.elements.forEach(el => {

  const bg = el.styles.background ? `background:${el.styles.background};` : '';
  const color = el.styles.color ? `color:${el.styles.color};` : '';
  const br = el.styles.borderRadius ? `border-radius:${el.styles.borderRadius};` : '';

  let style =
    `position:absolute;left:${el.x}px;top:${el.y}px;` +
    `width:${el.width}px;height:${el.height}px;` +
    `${bg}${color}${br}` +
    `font-family:${el.styles.fontFamily || 'inherit'};` +
    `font-size:${el.styles.fontSize || '16px'};` +
    `display:flex;align-items:center;justify-content:center;` +
    `box-sizing:border-box;overflow:hidden;` +

    /* MATCH EDITOR ENGINE */
    `--tx:${el.animation?.fromX || 0}px;` +
    `--ty:${el.animation?.fromY || 0}px;`;

  let animAttr = "";
  let animOutAttr = "";
  let onceAttr = "";

  /* ---------- ANIMATION BUILD ---------- */
  if (el.animation?.name && animationsMap[el.animation.name]) {

    let animIn =
      `${animationsMap[el.animation.name]} ${el.animation.duration}ms ease ${el.animation.delay}ms both`;

    /* Build reverse animations */
    const reverseMap = {
      fadeIn:"fadeOut",
      fadeInUp:"fadeOutDown",
      fadeInDown:"fadeOutUp",
      fadeInLeft:"fadeOutLeft",
      fadeInRight:"fadeOutRight",
      slideInLeft:"slideOutLeft",
      slideInRight:"slideOutRight",
      slideInUp:"slideDown",
      slideInDown:"slideUp",
      scaleIn:"scaleOut",
      scaleInSmall:"scaleOutSmall",
      scaleInBig:"scaleOutBig"
    };

    const rev = reverseMap[el.animation.name];
    if (rev && animationsMap[rev]) {
      animOutAttr = `data-animate-out="${animationsMap[rev]} ${el.animation.duration}ms ease 0ms both"`;
    }

    /* Scroll-trigger */
    if (el.animation.trigger === "scroll") {
      animAttr = `data-animate="${animIn}"`;
      onceAttr = `data-once="${el.animation.once !== false}"`;
      style += `opacity:0;`;
    }
    else {
      style += `animation:${animIn};`;
    }
  }

  /* ---------- TAG ---------- */
  const tagMap = {
    div: 'div',
    button: 'button',
    heading: 'h2',
    paragraph: 'p',
    input: 'input',
    textarea: 'textarea',
    image: 'img',
    video: 'video'
  };
  const tag = tagMap[el.type] || "div";

  /* ---------- ICON ---------- */
  if (el.type === 'icon') {
    html += `${indent(2)}<i class="${el.iconClass}" 
      style="position:absolute;left:${el.x}px;top:${el.y}px;
      font-size:${el.styles.fontSize || '32px'};
      color:${el.styles.color || '#000'}"></i>\n`;
    return;
  }

  /* ---------- IMAGE ---------- */
  if (el.type === 'image') {
    html += `${indent(2)}<img src="${el.src || ''}" style="${style}
      object-fit:${el.styles.objectFit || 'cover'};
      border-radius:${el.styles.borderRadius || '0'};
      box-shadow:${el.styles.boxShadow || 'none'};" />\n`;
    return;
  }

  /* ---------- VIDEO ---------- */
  if (el.type === 'video') {
    html += `${indent(2)}<video 
      src="${el.src || ''}"
      ${el.controls !== false ? "controls" : ""}
      ${el.autoplay ? "autoplay muted" : ""}
      ${el.loop ? "loop" : ""}
      ${el.muted ? "muted" : ""}
      playsinline
      style="${style}
      object-fit:${el.styles.objectFit || 'cover'};
      border-radius:${el.styles.borderRadius || '0'};
      box-shadow:${el.styles.boxShadow || 'none'};"></video>\n`;
    return;
  }

  /* ---------- GENERIC ELEMENT ---------- */
  html += `${indent(2)}<${tag} ${animAttr} ${animOutAttr} ${onceAttr} style="${style}">
    ${el.content || ""}
  </${tag}>\n`;

});

  /* ---------- INTERSECTION OBSERVER ---------- */
html += `
<script>
const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    const el = entry.target;
    const animIn = el.dataset.animate;
    const animOut = el.dataset.animateOut;
    const once = el.dataset.once === "true";

    if (entry.isIntersecting) {
      el.style.animation = "none";
      el.offsetHeight;
      el.style.animation = animIn;
      el.style.opacity = "1";
      if (once) io.unobserve(el);
    } 
    else if (!once) {
      if (animOut) {
        el.style.animation = "none";
        el.offsetHeight;
        el.style.animation = animOut;
      } else {
        el.style.opacity = "0";
      }
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll("[data-animate]").forEach(el=>io.observe(el));
</script>

</div>
</body>
</html>`;

  return html;
};

/* ============================================================
   EXPORT HANDLERS
============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  const exportBtn = document.getElementById("exportBtn");
  const livePreviewBtn = document.getElementById("livePreviewBtn");
  let livePrev = null;

  if (exportBtn) {
    exportBtn.onclick = () => {
      const h = generateExportHTML();
      const b = new Blob([h], { type: "text/html" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(b);
      a.download = "exported_ui.html";
      a.click();
    };
  }

  if (livePreviewBtn) {
    livePreviewBtn.onclick = () => {
      const h = generateExportHTML();
      try {
        if (!livePrev || livePrev.closed) {
          livePrev = window.open("", "_blank", "width=1400,height=800,scrollbars=yes");
        }
        livePrev.document.open();
        livePrev.document.write(h);
        livePrev.document.close();
        livePrev.focus();
      } catch (e) {
        console.warn("Popup blocked");
      }
    };
  }
});

window.generateExportHTML = generateExportHTML;
