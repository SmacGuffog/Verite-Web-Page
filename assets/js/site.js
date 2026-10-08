/* Vérité shared scripts. Progressive enhancement only: every page renders fully without this file. */
(function(){var y=document.getElementById('footer-year');if(y){y.textContent=new Date().getFullYear();}})();

// Reveal-on-scroll (progressive enhancement; content is visible if this doesn't run)
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if (reduce || !('IntersectionObserver' in window)) { els.forEach(function(e){e.classList.add('in')}); return; }
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(en){ if(en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0, rootMargin: '0px 0px 10% 0px' });
  els.forEach(function(e){ io.observe(e); });
})();
