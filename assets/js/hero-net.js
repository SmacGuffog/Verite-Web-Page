/* Home hero: lightweight interactive neural-net background (vanilla canvas, no library).
   Progressive enhancement: with JavaScript off nothing draws and the hero reads as before.
   Reduced motion: draws one static frame and ignores the cursor. Pauses when the hero is
   off-screen or the tab is hidden.
   Cursor: nodes are attracted within PULL but repelled inside HOLD, so they gather in a ring
   around the pointer rather than converging on it. Touch devices get no pointer tracking.
   Resizes (including the mobile address bar) scale the existing layout; they never reshuffle it.
   Legibility: nodes are kept out of an elliptical zone measured from the headline and
   subhead, and a soft fade mutes anything still behind the copy (about 15% opacity max). */
(function () {
  var canvas = document.getElementById('hero-net');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var hero = canvas.parentNode;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var LINE = '132,162,212';   /* --blue-300 */
  var NODE = '47,86,158';     /* --accent (blue-500) */
  var LINK = 130;             /* max link distance, px */
  var PULL = 170;             /* cursor influence radius, px */
  var HOLD = 70;              /* standoff ring: inside this nodes are pushed away, so they never pile onto the cursor */
  var MAXV = 0.6;             /* speed cap, px per frame */

  var W = 0, H = 0, nodes = [], raf = 0, running = false, onScreen = true;
  var mouse = { x: -1e4, y: -1e4 };
  var zone = null;            /* keep-out ellipse behind the hero copy: {cx, cy, rx, ry} */
  var PAD = 44;               /* padding around the measured text block, px */
  var FADE = 0.85;            /* how much the fade mutes the net at the centre of the zone */

  /* Measure the headline and subhead so the keep-out zone follows the real text. */
  function measure() {
    var els = hero.querySelectorAll('h1, .lede');
    if (!els.length) { zone = null; return; }
    var c = canvas.getBoundingClientRect(), x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      if (!r.width || !r.height) continue;
      x0 = Math.min(x0, r.left - c.left); y0 = Math.min(y0, r.top - c.top);
      x1 = Math.max(x1, r.right - c.left); y1 = Math.max(y1, r.bottom - c.top);
    }
    if (x1 <= x0) { zone = null; return; }
    zone = { cx: (x0 + x1) / 2, cy: (y0 + y1) / 2, rx: (x1 - x0) / 2 + PAD, ry: (y1 - y0) / 2 + PAD };
  }
  function inZone(x, y) {
    if (!zone) return false;
    var nx = (x - zone.cx) / zone.rx, ny = (y - zone.cy) / zone.ry;
    return nx * nx + ny * ny < 1;
  }

  function size() {
    var r = hero.getBoundingClientRect();
    var oldW = W, oldH = H;
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    measure();
    if (!nodes.length) { seed(); return; }
    /* On resize (including the mobile address bar showing and hiding) keep the
       existing layout and scale it into the new size, rather than reshuffling. */
    var sx = oldW ? W / oldW : 1, sy = oldH ? H / oldH : 1;
    for (var i = 0; i < nodes.length; i++) { nodes[i].x *= sx; nodes[i].y *= sy; }
  }

  function seed() {
    var n = Math.round(Math.min(90, Math.max(36, (W * H) / 16000)));
    nodes = [];
    for (var i = 0; i < n; i++) {
      var x = Math.random() * W, y = Math.random() * H, tries = 0;
      while (inZone(x, y) && tries++ < 12) { x = Math.random() * W; y = Math.random() * H; }
      nodes.push({ x: x, y: y,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
        r: 1.6 + Math.random() * 1.8 });
    }
  }

  function step() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < PULL && d > 0.001) {           /* drawn towards the cursor, held off at the standoff ring */
        var f = d > HOLD ? 0.025 * (1 - d / PULL) : -0.05 * (1 - d / HOLD);
        n.vx += (dx / d) * f; n.vy += (dy / d) * f;
      }
      if (zone) {                            /* gentle push out of the text zone */
        var zx = (n.x - zone.cx) / zone.rx, zy = (n.y - zone.cy) / zone.ry, zr = zx * zx + zy * zy;
        if (zr < 1) {
          var zl = Math.sqrt(zr) || 0.001, zf = 0.22 * (1 - zr);
          n.vx += (zx / zl) * zf; n.vy += (zy / zl) * zf;
        }
      }
      n.vx *= 0.985; n.vy *= 0.985;          /* damping keeps things calm */
      var v = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (v > MAXV) { n.vx = n.vx / v * MAXV; n.vy = n.vy / v * MAXV; }
      if (v < 0.05) { n.vx += (Math.random() - .5) * .04; n.vy += (Math.random() - .5) * .04; }
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0) { n.x = 0; n.vx = Math.abs(n.vx); } else if (n.x > W) { n.x = W; n.vx = -Math.abs(n.vx); }
      if (n.y < 0) { n.y = 0; n.vy = Math.abs(n.vy); } else if (n.y > H) { n.y = H; n.vy = -Math.abs(n.vy); }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.lineWidth = 1;
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
        if (d2 < LINK * LINK) {
          var alpha = (1 - Math.sqrt(d2) / LINK) * 0.45;
          ctx.strokeStyle = 'rgba(' + LINE + ',' + alpha.toFixed(3) + ')';
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (var k = 0; k < nodes.length; k++) {
      var n = nodes[k];
      var mx = mouse.x - n.x, my = mouse.y - n.y, near = (mx * mx + my * my) < PULL * PULL;
      ctx.fillStyle = 'rgba(' + NODE + ',' + (near ? 0.75 : 0.5) + ')';
      ctx.beginPath(); ctx.arc(n.x, n.y, near ? n.r + 0.8 : n.r, 0, Math.PI * 2); ctx.fill();
    }
    if (zone) {                              /* soft fade: erase alpha under the copy, strongest at the centre */
      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.translate(zone.cx, zone.cy);
      ctx.scale(1, zone.ry / zone.rx);
      var g = ctx.createRadialGradient(0, 0, 0, 0, 0, zone.rx * 1.2);
      g.addColorStop(0, 'rgba(0,0,0,' + FADE + ')');
      g.addColorStop(0.7, 'rgba(0,0,0,' + (FADE * 0.8).toFixed(3) + ')');
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(0, 0, zone.rx * 1.2, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
    }
  }

  function frame() { step(); draw(); raf = requestAnimationFrame(frame); }
  function start() { if (running || reduce || !onScreen || document.hidden) return; running = true; raf = requestAnimationFrame(frame); }
  function stop() { running = false; cancelAnimationFrame(raf); }

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { size(); if (reduce) draw(); }, 150);
  });

  size();
  function remeasure() { measure(); if (reduce) draw(); }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);
  setTimeout(remeasure, 900);               /* after the headline reveal transition */
  if (reduce) { draw(); return; }           /* static frame, no loop, no cursor */

  var hoverable = !(window.matchMedia && window.matchMedia('(hover: none)').matches);
  if (hoverable) {                          /* on touch devices the net drifts on its own; a thumb is not a cursor */
    hero.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    });
    hero.addEventListener('pointerleave', function () { mouse.x = -1e4; mouse.y = -1e4; });
  }

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) start(); else stop();
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  start();
})();
