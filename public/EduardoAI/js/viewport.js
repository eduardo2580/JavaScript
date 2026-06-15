/*
 * viewport.js — Eduardo.AI
 *
 * PROBLEM:
 *   Safari on iPhone/iPad has two viewport heights:
 *
 *   1. Layout viewport (window.innerHeight / 100vh / 100dvh):
 *      Includes the space under the browser chrome (address bar, tab bar).
 *      When the page first loads, Safari hides some chrome — so 100vh is
 *      actually the FULL screen height, meaning content gets hidden behind
 *      the address bar. When you scroll, chrome reappears and content
 *      gets squished. This is the classic "100vh bug".
 *
 *   2. Visual viewport (window.visualViewport.height):
 *      The actual visible rectangle at any moment — shrinks when:
 *        - Safari address bar appears
 *        - Safari tab bar appears
 *        - Software keyboard opens (the biggest one: ~300px on iPhone)
 *      This is the value we MUST use for the app height.
 *
 * SOLUTION (three layers, each a safety net for the previous):
 *
 *   Layer 1 — CSS: use 100svh ("small viewport height", Safari 15.4+)
 *     svh = the viewport height with ALL browser chrome visible.
 *     It never changes, so the app is always fully within visible bounds.
 *     Falls back to 100dvh → 100vh for older browsers.
 *
 *   Layer 2 — JS Visual Viewport API (Safari 13+, all modern browsers):
 *     Listen to visualViewport resize and scroll events.
 *     Set --vvh (visual viewport height) as a CSS custom property on <html>.
 *     #app uses height: var(--vvh, 100svh) — the var wins when JS runs.
 *     Also set --vvw for width and --vvo (offset top) for position compensation.
 *
 *   Layer 3 — window resize fallback (IE11, old Android):
 *     window.innerHeight is used as a rougher fallback when visualViewport
 *     is unavailable. Less accurate but better than nothing.
 *
 * KEYBOARD HANDLING:
 *   When the keyboard opens, visualViewport.height shrinks.
 *   We update --vvh so #app shrinks to fit.
 *   The messages area (flex:1) absorbs the height change.
 *   The input row stays pinned at the bottom of the visual viewport.
 *   We also scroll the message list to the bottom so the latest message
 *   stays visible above the keyboard.
 *
 * POSITION COMPENSATION:
 *   On some iOS versions, the visual viewport scrolls UP when the keyboard
 *   opens (the page doesn't shrink, it shifts). We detect this via
 *   visualViewport.offsetTop and apply a translateY to #app to compensate.
 *
 * ES5 compatible. No dependencies.
 */
(function (win, doc) {
  'use strict';

  var html = doc.documentElement;
  var app  = doc.getElementById('app');
  var msgs = doc.getElementById('messages-wrap');

  /* ── Apply viewport dimensions to CSS vars ── */
  function applyViewport() {
    var vp = win.visualViewport;
    var h, w, offsetTop;

    if (vp) {
      h         = Math.round(vp.height);
      w         = Math.round(vp.width);
      offsetTop = Math.round(vp.offsetTop);
    } else {
      /* Fallback: window.innerHeight changes with keyboard on Android */
      h         = win.innerHeight;
      w         = win.innerWidth;
      offsetTop = 0;
    }

    /* Set CSS custom properties on <html> so any element can use them */
    html.style.setProperty('--vvh', h + 'px');
    html.style.setProperty('--vvw', w + 'px');

    /*
     * Position compensation for iOS scroll-based keyboard handling.
     * When the keyboard opens, Safari sometimes scrolls the page up
     * by offsetTop px rather than shrinking the viewport. We move
     * #app down by that amount to keep it aligned with the visual viewport.
     */
    if (app) {
      if (offsetTop > 0) {
        app.style.position  = 'fixed';
        app.style.top       = offsetTop + 'px';
        app.style.left      = '0';
        app.style.right     = '0';
        app.style.height    = h + 'px';
        app.style.width     = w + 'px';
      } else {
        /* Normal: just set height, let flex layout do the rest */
        app.style.position  = '';
        app.style.top       = '';
        app.style.left      = '';
        app.style.right     = '';
        app.style.height    = h + 'px';
        app.style.width     = '';
      }
    }

    /* Scroll messages to bottom whenever the viewport changes */
    scrollMsgs();
  }

  /* ── Scroll the message list to the bottom ── */
  function scrollMsgs() {
    if (msgs) {
      /* rAF ensures the DOM has reflowed before we scroll */
      if (win.requestAnimationFrame) {
        win.requestAnimationFrame(function () {
          msgs.scrollTop = msgs.scrollHeight;
        });
      } else {
        msgs.scrollTop = msgs.scrollHeight;
      }
    }
  }

  /* ── Debounce to avoid thrashing during keyboard animation ── */
  var raf = null;
  function onViewportChange() {
    if (raf) win.cancelAnimationFrame(raf);
    raf = win.requestAnimationFrame
      ? win.requestAnimationFrame(applyViewport)
      : setTimeout(applyViewport, 16);
  }

  /* ── Attach Visual Viewport API listeners ── */
  function initVisualViewport() {
    var vp = win.visualViewport;
    if (!vp) return false;

    if (vp.addEventListener) {
      vp.addEventListener('resize', onViewportChange, { passive: true });
      vp.addEventListener('scroll', onViewportChange, { passive: true });
    } else if (vp.attachEvent) {
      vp.attachEvent('onresize', onViewportChange);
      vp.attachEvent('onscroll', onViewportChange);
    }

    return true;
  }

  /* ── Fallback: window resize (keyboard on Android, orientation change) ── */
  function initWindowResize() {
    if (win.addEventListener) {
      win.addEventListener('resize',           onViewportChange, { passive: true });
      win.addEventListener('orientationchange', onViewportChange, { passive: true });
    } else if (win.attachEvent) {
      win.attachEvent('onresize',            onViewportChange);
      win.attachEvent('onorientationchange', onViewportChange);
    }
  }

  /* ── Focus/blur on input — scroll to keep input visible on iOS ── */
  function initInputFocus() {
    var input = doc.getElementById('chat-input');
    if (!input) return;

    input.addEventListener('focus', function () {
      /*
       * iOS Safari delays the keyboard appearance. After the keyboard
       * is fully up, visualViewport fires resize — but we also need
       * a small timeout-based nudge for older iOS versions.
       */
      setTimeout(function () {
        applyViewport();
        scrollMsgs();
      }, 350);
    }, { passive: true });

    input.addEventListener('blur', function () {
      /* Keyboard dismissed — restore full height */
      setTimeout(applyViewport, 100);
    }, { passive: true });
  }

  /* ── Boot ── */
  function boot() {
    var hasVV = initVisualViewport();
    initWindowResize();
    initInputFocus();

    /* Apply immediately */
    applyViewport();

    if (win.console) {
      win.console.info(
        '[Viewport] Visual Viewport API:', hasVV ? 'available' : 'unavailable (using fallback)'
      );
    }
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', boot, false);
  } else {
    boot();
  }

}(window, document));
