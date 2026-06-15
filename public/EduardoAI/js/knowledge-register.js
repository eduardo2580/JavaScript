/*
 * knowledge-register.js — Eduardo.AI
 *
 * Self-registration patch for knowledge.js.
 * APPEND this block to the bottom of knowledge.js  (or load as a separate
 * script immediately after knowledge.js in index.html).
 *
 * Registers the core Eduardo / tech KB as a plugin in KBRegistry so that
 * chat.js can route through the registry for ALL knowledge sources.
 *
 * Priority 0 = base KB.  Specialist KBs use priority 10+.
 *
 * ES5 compatible. No dependencies beyond knowledge.js and kb-registry.js.
 */
(function (win) {
  'use strict';

  function doRegister() {
    if (!win.KBRegistry) {
      win.console && win.console.warn('[knowledge] KBRegistry not found — retrying in 50ms');
      setTimeout(doRegister, 50);
      return;
    }

    win.KBRegistry.register({
      id:       'core',
      priority: 0,

      /* ── Keyword routing ── */
      keywordMap: win.KEYWORD_MAP,

      /* ── Answer resolution ── */
      answerCache: win.ANSWER_CACHE,
      getAnswer: function (key, lang) {
        /* Try ANSWER_CACHE first (synchronous, always populated) */
        var cache = win.ANSWER_CACHE && win.ANSWER_CACHE[lang];
        if (cache && cache[key]) return cache[key];
        /* Fall back to getAnswer() which queries _A then _GK */
        if (typeof win.getAnswer === 'function') return win.getAnswer(key, lang);
        return null;
      },

      /* ── Suggestion chips ── */
      suggestions: win.SUGGESTIONS,

      /* ── LLM system prompt ── */
      systemPromptFn: win.buildSystemPrompt || null,

      /* ── Display label (optional, shown in status area) ── */
      label: { pt: 'Eduardo + Tech', en: 'Eduardo + Tech', es: 'Eduardo + Tech' }
    });
  }

  /* Boot: if DOM is already parsed, register now; else wait. */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doRegister, false);
  } else {
    doRegister();
  }

}(window));
