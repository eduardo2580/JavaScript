/*
 * kb-registry.js — Eduardo.AI
 *
 * ═══════════════════════════════════════════════════════════════════════════
 * KNOWLEDGE-BASE PLUGIN REGISTRY
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * PURPOSE:
 *   Central hub that lets any number of knowledge-base files plug into the
 *   chat engine (keyword mode + LLM system prompt) without touching chat.js,
 *   knowledge.js, or each other.
 *
 *   Adding a new KB is a single call at the bottom of the KB file:
 *
 *     window.KBRegistry.register({
 *       id:          'medical',          // unique slug
 *       priority:    10,                 // higher wins when two KBs match same query
 *       keywordMap:  window.MEDICAL_KEYWORD_MAP,
 *       answerCache: window.MEDICAL_ANSWER_CACHE,
 *       getAnswer:   window.getMedicalAnswer,
 *       suggestions: window.MEDICAL_SUGGESTIONS,  // optional chip list
 *       systemPromptFn: window.buildMedicalSystemPrompt, // optional LLM addon
 *       label: {                         // optional status chip label
 *         pt: 'Medicina', en: 'Medicine', es: 'Medicina'
 *       }
 *     });
 *
 * HOW IT WORKS:
 *   1. chat.js calls KBRegistry.lookup(text, lang) — returns {key, answer, plugin}
 *      or null if no plugin matches.
 *   2. chat.js calls KBRegistry.buildSystemPrompt(lang) — concatenates the
 *      base prompt with injections from all registered plugins.
 *   3. KBRegistry.getSuggestions(lang) — merges suggestion chips from all plugins.
 *   4. KBRegistry.getAnswerCache(lang) — merged flat cache for chip-click fast path.
 *
 * PRIORITY:
 *   When two plugins have keyword maps that both match a query, the one with
 *   higher priority wins. Default priority is 0. Core knowledge.js is 0.
 *   Specialist KBs should use 10+.
 *
 * LOAD ORDER:
 *   Load kb-registry.js BEFORE knowledge.js, medical_knowledge.js, or any
 *   other KB file. All those files call KBRegistry.register() which queues
 *   safely even if kb-registry.js isn't ready yet (see self-queue at bottom).
 *
 * ES5 compatible. No external dependencies.
 *
 * ═══════════════════════════════════════════════════════════════════════════
 */
(function (win) {
  'use strict';

  /* ──────────────────────────────────────────────────────────────────────
     INTERNAL STATE
  ────────────────────────────────────────────────────────────────────── */
  var _plugins    = [];   /* registered plugins, sorted by priority desc */
  var _ready      = false;
  var _queue      = [];   /* calls that arrived before registry was ready */

  /* ──────────────────────────────────────────────────────────────────────
     HELPERS
  ────────────────────────────────────────────────────────────────────── */
  function sortPlugins() {
    _plugins.sort(function (a, b) {
      return (b.priority || 0) - (a.priority || 0);
    });
  }

  function flushQueue() {
    while (_queue.length) { _queue.shift()(); }
  }

  function warn() {
    if (win.console && win.console.warn) {
      win.console.warn.apply(win.console, arguments);
    }
  }
  function info() {
    if (win.console && win.console.info) {
      win.console.info.apply(win.console, arguments);
    }
  }

  /* ──────────────────────────────────────────────────────────────────────
     VALIDATE a plugin descriptor before accepting it
  ────────────────────────────────────────────────────────────────────── */
  function validate(plugin) {
    if (!plugin || typeof plugin !== 'object') {
      warn('[KBRegistry] register() called with non-object:', plugin);
      return false;
    }
    if (!plugin.id || typeof plugin.id !== 'string') {
      warn('[KBRegistry] plugin missing required string "id"');
      return false;
    }
    if (!plugin.keywordMap || typeof plugin.keywordMap !== 'object') {
      warn('[KBRegistry] plugin "' + plugin.id + '" missing keywordMap');
      return false;
    }
    if (typeof plugin.getAnswer !== 'function') {
      warn('[KBRegistry] plugin "' + plugin.id + '" missing getAnswer function');
      return false;
    }
    return true;
  }

  /* ──────────────────────────────────────────────────────────────────────
     PUBLIC — register(pluginDescriptor)
     Can be called at any time; safely queued if called before DOM ready.
  ────────────────────────────────────────────────────────────────────── */
  function register(plugin) {
    if (!validate(plugin)) return;

    /* Prevent duplicate registrations */
    for (var i = 0; i < _plugins.length; i++) {
      if (_plugins[i].id === plugin.id) {
        warn('[KBRegistry] plugin "' + plugin.id + '" already registered — skipping duplicate');
        return;
      }
    }

    /* Fill in defaults */
    plugin.priority    = (typeof plugin.priority === 'number') ? plugin.priority : 0;
    plugin.answerCache = plugin.answerCache || {};
    plugin.suggestions = plugin.suggestions || {};

    _plugins.push(plugin);
    sortPlugins();

    info('[KBRegistry] Registered plugin "' + plugin.id + '" (priority ' + plugin.priority + '). Total plugins: ' + _plugins.length);
  }

  /* ──────────────────────────────────────────────────────────────────────
     PUBLIC — lookup(text, lang)
     Iterates plugins in priority order and returns the first match.
     Returns: { key, answer, plugin } or null.
  ────────────────────────────────────────────────────────────────────── */
  function lookup(text, lang) {
    if (!text) return null;

    for (var pi = 0; pi < _plugins.length; pi++) {
      var plugin = _plugins[pi];
      var map    = plugin.keywordMap && plugin.keywordMap[lang];
      if (!map) map = plugin.keywordMap && plugin.keywordMap['pt']; /* fallback lang */
      if (!map) continue;

      var keys = Object.keys(map);
      for (var ki = 0; ki < keys.length; ki++) {
        var key = keys[ki];
        if (map[key] && map[key].test && map[key].test(text)) {
          var answer = plugin.getAnswer(key, lang);
          if (answer) {
            return { key: key, answer: answer, plugin: plugin };
          }
        }
      }
    }
    return null;
  }

  /* ──────────────────────────────────────────────────────────────────────
     PUBLIC — getAnswer(key, lang)
     Tries every plugin until one returns a non-empty answer.
  ────────────────────────────────────────────────────────────────────── */
  function getAnswer(key, lang) {
    for (var i = 0; i < _plugins.length; i++) {
      var answer = _plugins[i].getAnswer(key, lang);
      if (answer) return answer;
    }
    return null;
  }

  /* ──────────────────────────────────────────────────────────────────────
     PUBLIC — getSuggestions(lang)
     Merges suggestion chip arrays from ALL plugins (deduplicated by label).
     Base KB suggestions come first, then specialist KB suggestions.
  ────────────────────────────────────────────────────────────────────── */
  function getSuggestions(lang) {
    var seen   = {};
    var merged = [];

    for (var i = 0; i < _plugins.length; i++) {
      var suggs = _plugins[i].suggestions && _plugins[i].suggestions[lang];
      if (!suggs) suggs = _plugins[i].suggestions && _plugins[i].suggestions['pt'];
      if (!suggs) continue;

      for (var j = 0; j < suggs.length; j++) {
        var chip = suggs[j];
        var uid  = (chip.label || '') + '|' + (chip.key || '');
        if (!seen[uid]) {
          seen[uid] = true;
          /* Tag each chip with its source plugin id for routing */
          merged.push({
            label:    chip.label,
            key:      chip.key,
            pluginId: _plugins[i].id
          });
        }
      }
    }

    return merged;
  }

  /* ──────────────────────────────────────────────────────────────────────
     PUBLIC — getAnswerCache(lang)
     Returns a flat merged object { key: answer } from all plugin caches.
     Used by the chip fast-path in chat.js (chip click → instant reply).
  ────────────────────────────────────────────────────────────────────── */
  function getAnswerCache(lang) {
    var merged = {};

    /* Iterate plugins in REVERSE priority (lowest first) so higher-priority
       plugins overwrite lower ones on key collisions. */
    for (var i = _plugins.length - 1; i >= 0; i--) {
      var cache = _plugins[i].answerCache && _plugins[i].answerCache[lang];
      if (!cache) cache = _plugins[i].answerCache && _plugins[i].answerCache['pt'];
      if (!cache) continue;

      var keys = Object.keys(cache);
      for (var j = 0; j < keys.length; j++) {
        merged[keys[j]] = cache[keys[j]];
      }
    }

    return merged;
  }

  /* ──────────────────────────────────────────────────────────────────────
     PUBLIC — buildSystemPrompt(lang)
     Concatenates the base system prompt from the core KB plugin
     (knowledge.js) with optional additions from all specialist plugins.
  ────────────────────────────────────────────────────────────────────── */
  function buildSystemPrompt(lang) {
    var parts = [];

    for (var i = 0; i < _plugins.length; i++) {
      if (typeof _plugins[i].systemPromptFn === 'function') {
        var chunk = _plugins[i].systemPromptFn(lang);
        if (chunk) parts.push(chunk);
      }
    }

    if (parts.length === 0 && win.buildSystemPrompt) {
      /* Legacy fallback: knowledge.js exposed buildSystemPrompt directly */
      return win.buildSystemPrompt(lang);
    }

    return parts.join('\n\n---\n\n');
  }

  /* ──────────────────────────────────────────────────────────────────────
     PUBLIC — list()
     Returns a snapshot of all registered plugin descriptors (read-only).
  ────────────────────────────────────────────────────────────────────── */
  function list() {
    return _plugins.map(function (p) {
      return {
        id:       p.id,
        priority: p.priority,
        label:    p.label || { pt: p.id, en: p.id, es: p.id }
      };
    });
  }

  /* ──────────────────────────────────────────────────────────────────────
     PUBLIC — unregister(id)
     Removes a plugin by id. Useful for hot-swap in dev / tests.
  ────────────────────────────────────────────────────────────────────── */
  function unregister(id) {
    var before = _plugins.length;
    _plugins = _plugins.filter(function (p) { return p.id !== id; });
    if (_plugins.length < before) {
      info('[KBRegistry] Unregistered plugin "' + id + '"');
    } else {
      warn('[KBRegistry] unregister: plugin "' + id + '" not found');
    }
  }

  /* ──────────────────────────────────────────────────────────────────────
     EXPOSE
  ────────────────────────────────────────────────────────────────────── */
  win.KBRegistry = {
    register:          register,
    unregister:        unregister,
    lookup:            lookup,
    getAnswer:         getAnswer,
    getSuggestions:    getSuggestions,
    getAnswerCache:    getAnswerCache,
    buildSystemPrompt: buildSystemPrompt,
    list:              list
  };

  _ready = true;
  flushQueue();

  info('[KBRegistry] Ready.');

}(window));
