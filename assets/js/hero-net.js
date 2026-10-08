/* Home hero: lightweight interactive neural-net background (vanilla canvas, no library).
   Progressive enhancement: with JavaScript off nothing draws and the hero reads as before.
   Reduced motion: draws one static frame and ignores the cursor. Pauses when the hero is
   off-screen or the tab is hidden. */
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
  var MAXV = 0.6;             /* speed cap, px per frame */

  var W = 0, H = 0, nodes = [], raf = 0, running = false, onScreen = true;
  var mouse = { x: -1e4, y: -1e4 };

  function size() {
    var r = hero.getBoundingClientRect();
    W = Math.max(1, Math.round(r.width));
    H = Math.max(1, Math.round(r.height));
    var dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    seed();
  }

  function seed() {
    var n = Math.round(Math.min(90, Math.max(36, (W * H) / 16000)));
    nodes = [];
    for (var i = 0; i < n; i++) {
      nodes.push({ x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - .5) * .3, vy: (Math.random() - .5) * .3,
        r: 1.6 + Math.random() * 1.8 });
    }
  }

  function step() {
    for (var i = 0; i < nodes.length; i++) {
      var n = nodes[i];
      var dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < PULL && d > 0.001) {           /* gentle attraction towards the cursor */
        var f = 0.025 * (1 - d / PULL);
        n.vx += (dx / d) * f; n.vy += (dy / d) * f;
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
  if (reduce) { draw(); return; }           /* static frame, no loop, no cursor */

  hero.addEventListener('pointermove', function (e) {
    var r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
  });
  hero.addEventListener('pointerleave', function () { mouse.x = -1e4; mouse.y = -1e4; });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) start(); else stop();
    }, { threshold: 0 }).observe(hero);
  }
  document.addEventListener('visibilitychange', function () { if (document.hidden) stop(); else start(); });
  start();
})();
