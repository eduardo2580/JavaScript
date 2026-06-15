/*
 * glow-sync.js — Eduardo.AI
 *
 * Mirrors the .talking class from #avatar-halo onto #avatar-glow
 * so the breathing glow animation syncs with avatar.js talk state.
 *
 * avatar.js toggles #avatar-halo.talking via addClass/removeClass.
 * We observe that attribute mutation and copy it to #avatar-glow,
 * which has its own CSS animation for the talking state.
 *
 * ES5 compatible. Uses MutationObserver (supported in all modern browsers
 * and IE11+). Falls back silently if MutationObserver is unavailable.
 */
(function () {
  'use strict';

  function init() {
    var halo = document.getElementById('avatar-halo');
    var glow = document.getElementById('avatar-glow');
    if (!halo || !glow) return;

    var MO = window.MutationObserver || window.WebKitMutationObserver;
    if (!MO) return;

    new MO(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].attributeName !== 'class') continue;

        /* SVG className is SVGAnimatedString — .baseVal holds the raw string */
        var cn = typeof halo.className === 'string'
          ? halo.className
          : (halo.className.baseVal || '');

        var isTalking = cn.indexOf('talking') >= 0;

        if (glow.classList) {
          if (isTalking) {
            glow.classList.add('talking');
          } else {
            glow.classList.remove('talking');
          }
        } else {
          /* IE11 classList fallback */
          if (isTalking) {
            if (glow.className.indexOf('talking') < 0) {
              glow.className = (glow.className + ' talking').trim();
            }
          } else {
            glow.className = glow.className.replace(/\btalking\b/g, '').trim();
          }
        }
      }
    }).observe(halo, { attributes: true });
  }

  /* Boot after DOM is ready */
  if (
    document.readyState === 'complete' ||
    document.readyState === 'loaded' ||
    document.readyState === 'interactive'
  ) {
    init();
  } else if (document.addEventListener) {
    document.addEventListener('DOMContentLoaded', init, false);
  } else if (document.attachEvent) {
    document.attachEvent('onreadystatechange', function () {
      if (document.readyState === 'complete') init();
    });
  }
}());
