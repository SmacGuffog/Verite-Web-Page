/* Cookie consent and the Apollo.io website tracker.
   Apollo only loads after the visitor accepts. The choice is remembered in this browser
   and can be changed with the "Cookie settings" link in the footer. With JavaScript off,
   nothing loads and no banner is shown. */
(function(){
  var KEY = 'verite-cookie-consent';   // 'accepted' or 'declined'
  var APOLLO_APP_ID = '6ad098b214972b000c03cdd6';
  var banner = null;

  function read(){ try { return window.localStorage.getItem(KEY); } catch (e) { return null; } }
  function save(v){ try { window.localStorage.setItem(KEY, v); } catch (e) {} }

  // Apollo's supplied snippet, unchanged apart from running only on consent.
  function initApollo(){
    if (window.__veriteApolloLoaded) return;
    window.__veriteApolloLoaded = true;
    var n = Math.random().toString(36).substring(7), o = document.createElement('script');
    o.src = 'https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache=' + n;
    o.async = true; o.defer = true;
    o.onload = function(){ window.trackingFunctions.onLoad({ appId: APOLLO_APP_ID }); };
    document.head.appendChild(o);
  }

  function hide(){ if (banner) { banner.remove(); banner = null; } }

  function choose(v){
    var before = read();
    save(v);
    hide();
    if (v === 'accepted') initApollo();
    // Withdrawing consent after Apollo has loaded: reload so it no longer runs on this page.
    else if (before === 'accepted' && window.__veriteApolloLoaded) window.location.reload();
  }

  function show(){
    if (banner) return;
    banner = document.createElement('div');
    banner.className = 'consent';
    banner.setAttribute('role', 'region');
    banner.setAttribute('aria-label', 'Cookie choices');
    banner.innerHTML =
      '<p class="consent__text">We\'d like to use cookies from Apollo.io to see which companies visit our website. ' +
      'They only run if you accept. <a href="/privacy/#cookies">Privacy policy</a></p>' +
      '<div class="consent__actions">' +
        '<button type="button" class="btn btn-ghost btn-sm" data-consent="declined">Decline</button>' +
        '<button type="button" class="btn btn-ghost btn-sm" data-consent="accepted">Accept</button>' +
      '</div>';
    banner.addEventListener('click', function(e){
      var b = e.target.closest ? e.target.closest('[data-consent]') : null;
      if (b) choose(b.getAttribute('data-consent'));
    });
    document.body.appendChild(banner);
  }

  // Footer "Cookie settings" link: revealed only when this script runs.
  var links = document.querySelectorAll('[data-cookie-settings]');
  Array.prototype.forEach.call(links, function(el){
    var wrap = el.closest ? el.closest('.cookie-link') : null;
    if (wrap) wrap.hidden = false;
    el.addEventListener('click', show);
  });

  var choice = read();
  if (choice === 'accepted') initApollo();
  else if (choice !== 'declined') show();
})();
