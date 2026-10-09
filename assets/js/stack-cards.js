/* Stacking stage cards (Services). Progressive enhancement: without this file the cards simply stack.
   Each card sticks below the header; the next card slides over it while the covered card shrinks and dims.
   Disabled under prefers-reduced-motion, and whenever a card would not fit in the viewport (e.g. phones). */
(function(){
  var wrap = document.querySelector('.stages');
  if (!wrap) return;
  var cards = Array.prototype.slice.call(wrap.querySelectorAll('.stage'));
  if (cards.length < 2) return;
  var header = document.querySelector('header.site');
  var host = wrap.closest ? wrap.closest('section') : null;
  var reduce = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : { matches: false };
  var GAP = 28;      // space between the header and the pinned card
  var STEP = 14;     // each later card pins this much lower, so the edges of the stack show
  var LEAD = 140;    // start shrinking when the next card is this far below the pinned card
  var SCALE = 0.06;  // how much a covered card shrinks
  var DIM = 0.10;    // how much a covered card dims
  var on = false, tops = [], height = 0, ticking = false, resizeTimer;

  function clear(){
    wrap.classList.remove('stack');
    if (host) host.classList.remove('stack-host');
    cards.forEach(function(c){ c.style.minHeight = ''; c.style.top = ''; c.style.transform = ''; c.style.filter = ''; });
    on = false;
  }
  function setup(){
    clear();
    if (reduce.matches) return;
    height = Math.max.apply(null, cards.map(function(c){ return c.offsetHeight; }));
    var top0 = (header ? header.offsetHeight : 0) + GAP;
    var room = window.innerHeight - top0 - (cards.length - 1) * STEP - 24;
    if (height > room) return;  // a card would not fit on screen: leave the plain layout
    tops = cards.map(function(c, i){ return top0 + i * STEP; });
    cards.forEach(function(c, i){ c.style.minHeight = height + 'px'; c.style.top = tops[i] + 'px'; });
    wrap.classList.add('stack');
    if (host) host.classList.add('stack-host');
    on = true;
    update();
  }
  function update(){
    ticking = false;
    if (!on) return;
    for (var i = 0; i < cards.length - 1; i++){
      var top = cards[i].getBoundingClientRect().top;
      var next = cards[i + 1].getBoundingClientRect().top;
      var start = top + height + LEAD, end = tops[i + 1];
      var p = (start - next) / (start - end);
      p = Math.max(0, Math.min(1, p));
      if (p > 0){
        cards[i].style.transform = 'scale(' + (1 - SCALE * p).toFixed(4) + ')';
        cards[i].style.filter = 'brightness(' + (1 - DIM * p).toFixed(3) + ')';
      } else {
        cards[i].style.transform = '';
        cards[i].style.filter = '';
      }
    }
  }
  function onScroll(){ if (!ticking){ ticking = true; requestAnimationFrame(update); } }
  function onResize(){ clearTimeout(resizeTimer); resizeTimer = setTimeout(setup, 150); }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  if (reduce.addEventListener) reduce.addEventListener('change', setup);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(setup);
  setup();
})();
