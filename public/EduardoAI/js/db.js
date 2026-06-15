/*
 * db.js — Eduardo.AI local database
 * ES5 compatible. Uses IndexedDB when available, falls back to in-memory Map.
 *
 * Two stores:
 *   "defaults"  — pre-seeded from ANSWER_CACHE (6 keys × 3 langs = 18 rows).
 *                 Never auto-deleted. Read-only after seeding.
 *   "learned"   — WebLLM answers for free-text questions.
 *                 Key: lang + ":" + normalizedQuestion
 *                 Value: { question, answer, lang, savedAt (ms timestamp) }
 *                 Auto-purged after 7 days on every db open.
 *
 * Exposes window.DB with callback-based API (no Promises needed for ES5):
 *   DB.getDefault(key, lang, cb)           cb(answer|null)
 *   DB.getLearned(question, lang, cb)      cb(answer|null)
 *   DB.saveLearned(question, lang, answer) fire-and-forget
 *   DB.purgeLearned(olderThanMs, cb)       cb(deletedCount)
 *   DB.countLearned(cb)                    cb(count)
 */
(function (win, doc) {
  'use strict';

  var DB_NAME    = 'eduardoai';
  var DB_VERSION = 1;
  var TTL_MS     = 7 * 24 * 60 * 60 * 1000; /* 7 days in milliseconds */

  /* ── Fallback in-memory store (when IndexedDB unavailable) ── */
  var memDefaults = {};
  var memLearned  = {};

  /* ── State ── */
  var idb     = null;  /* IDBDatabase instance */
  var ready   = false;
  var queue   = [];    /* ops queued before db is open */

  /* ════════════════════════════════════════════
     NORMALISE a question string into a stable key
  ════════════════════════════════════════════ */
  function normalise(text) {
    return String(text)
      .toLowerCase()
      .replace(/[^\w\sáàãâéêíóôõúüçñ]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120); /* cap length */
  }

  /* ════════════════════════════════════════════
     SEED defaults from ANSWER_CACHE
  ════════════════════════════════════════════ */
  function seedDefaults(db) {
    var cache = win.ANSWER_CACHE;
    if (!cache) return;
    var tx    = db.transaction('defaults', 'readwrite');
    var store = tx.objectStore('defaults');
    var langs = ['pt', 'en', 'es'];
    for (var li = 0; li < langs.length; li++) {
      var l = langs[li];
      if (!cache[l]) continue;
      var keys = Object.keys(cache[l]);
      for (var ki = 0; ki < keys.length; ki++) {
        var k = keys[ki];
        var id = l + ':' + k;
        store.put({ id: id, key: k, lang: l, answer: cache[l][k] });
        memDefaults[id] = cache[l][k];
      }
    }
  }

  /* ════════════════════════════════════════════
     AUTO-PURGE learned entries older than TTL
  ════════════════════════════════════════════ */
  function purgeLearned(db, olderThanMs, cb) {
    if (!db) { if (cb) cb(0); return; }
    var cutoff = Date.now() - (olderThanMs || TTL_MS);
    var tx     = db.transaction('learned', 'readwrite');
    var store  = tx.objectStore('learned');
    var idx    = store.index('savedAt');
    var range  = win.IDBKeyRange ? win.IDBKeyRange.upperBound(cutoff) : null;
    if (!range) { if (cb) cb(0); return; }

    var deleted = 0;
    var req = idx.openCursor(range);
    req.onsuccess = function (e) {
      var cursor = e.target.result;
      if (cursor) {
        /* Also remove from in-memory */
        delete memLearned[cursor.value.id];
        cursor.delete();
        deleted++;
        cursor.continue();
      } else {
        if (cb) cb(deleted);
        if (win.console) win.console.info('[DB] Purged ' + deleted + ' old learned answers');
      }
    };
    req.onerror = function () { if (cb) cb(0); };
  }

  /* ════════════════════════════════════════════
     OPEN DATABASE
  ════════════════════════════════════════════ */
  function open() {
    var idbFactory = win.indexedDB || win.webkitIndexedDB || win.mozIndexedDB || win.msIndexedDB;
    if (!idbFactory) {
      /* No IndexedDB — use in-memory only, seed defaults now */
      seedMemDefaults();
      ready = true;
      flushQueue();
      return;
    }

    var req = idbFactory.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = function (e) {
      var db = e.target.result;
      if (!db.objectStoreNames.contains('defaults')) {
        db.createObjectStore('defaults', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('learned')) {
        var ls = db.createObjectStore('learned', { keyPath: 'id' });
        ls.createIndex('savedAt', 'savedAt', { unique: false });
        ls.createIndex('lang',    'lang',    { unique: false });
      }
    };

    req.onsuccess = function (e) {
      idb = e.target.result;
      seedDefaults(idb);
      purgeLearned(idb, TTL_MS, null); /* auto-purge on open */
      /* Also seed in-memory mirror from cache */
      seedMemDefaults();
      ready = true;
      flushQueue();
    };

    req.onerror = function () {
      if (win.console) win.console.warn('[DB] IndexedDB failed, using memory fallback');
      seedMemDefaults();
      ready = true;
      flushQueue();
    };

    req.onblocked = function () {
      if (win.console) win.console.warn('[DB] IndexedDB blocked');
    };
  }

  function seedMemDefaults() {
    var cache = win.ANSWER_CACHE;
    if (!cache) return;
    var langs = ['pt', 'en', 'es'];
    for (var li = 0; li < langs.length; li++) {
      var l = langs[li];
      if (!cache[l]) continue;
      var keys = Object.keys(cache[l]);
      for (var ki = 0; ki < keys.length; ki++) {
        memDefaults[l + ':' + keys[ki]] = cache[l][keys[ki]];
      }
    }
  }

  /* ════════════════════════════════════════════
     QUEUE — holds ops that arrive before db opens
  ════════════════════════════════════════════ */
  function flushQueue() {
    while (queue.length) { queue.shift()(); }
  }

  function whenReady(fn) {
    if (ready) { fn(); } else { queue.push(fn); }
  }

  /* ════════════════════════════════════════════
     PUBLIC API
  ════════════════════════════════════════════ */

  /* getDefault(key, lang, cb) — look up a pre-seeded default answer */
  function getDefault(key, lang, cb) {
    var id = lang + ':' + key;
    /* Fast in-memory hit */
    if (memDefaults[id] !== undefined) { cb(memDefaults[id]); return; }
    whenReady(function () {
      if (!idb) { cb(null); return; }
      var req = idb.transaction('defaults', 'readonly')
                   .objectStore('defaults')
                   .get(id);
      req.onsuccess = function (e) { cb(e.target.result ? e.target.result.answer : null); };
      req.onerror   = function ()  { cb(null); };
    });
  }

  /* getLearned(question, lang, cb) — look up a cached WebLLM answer */
  function getLearned(question, lang, cb) {
    var id = lang + ':' + normalise(question);
    /* In-memory hit */
    if (memLearned[id] !== undefined) { cb(memLearned[id].answer); return; }
    whenReady(function () {
      if (!idb) { cb(null); return; }
      var req = idb.transaction('learned', 'readonly')
                   .objectStore('learned')
                   .get(id);
      req.onsuccess = function (e) {
        var row = e.target.result;
        if (row) {
          /* Warm the memory mirror */
          memLearned[id] = row;
          cb(row.answer);
        } else {
          cb(null);
        }
      };
      req.onerror = function () { cb(null); };
    });
  }

  /* saveLearned(question, lang, answer) — persist a WebLLM reply */
  function saveLearned(question, lang, answer) {
    var id  = lang + ':' + normalise(question);
    var row = { id: id, question: question, lang: lang, answer: answer, savedAt: Date.now() };
    /* Always update memory mirror */
    memLearned[id] = row;
    whenReady(function () {
      if (!idb) return;
      try {
        idb.transaction('learned', 'readwrite')
           .objectStore('learned')
           .put(row);
      } catch (e) {
        if (win.console) win.console.warn('[DB] saveLearned error:', e);
      }
    });
  }

  /* countLearned(cb) — how many learned answers are stored */
  function countLearned(cb) {
    whenReady(function () {
      if (!idb) { cb(Object.keys(memLearned).length); return; }
      var req = idb.transaction('learned', 'readonly')
                   .objectStore('learned')
                   .count();
      req.onsuccess = function (e) { cb(e.target.result || 0); };
      req.onerror   = function ()  { cb(0); };
    });
  }

  /* purgeLearned(olderThanMs, cb) — manual purge exposed for admin use */
  function purge(olderThanMs, cb) {
    whenReady(function () { purgeLearned(idb, olderThanMs || TTL_MS, cb); });
  }

  win.DB = {
    getDefault:   getDefault,
    getLearned:   getLearned,
    saveLearned:  saveLearned,
    countLearned: countLearned,
    purgeLearned: purge,
    TTL_MS:       TTL_MS
  };

  /* ── Boot: wait for ANSWER_CACHE to be set by knowledge.js ── */
  /* knowledge.js runs before db.js in script order, so ANSWER_CACHE
     is available synchronously — open immediately */
  if (doc.readyState === 'complete' || doc.readyState === 'loaded' || doc.readyState === 'interactive') {
    open();
  } else {
    if (doc.addEventListener) { doc.addEventListener('DOMContentLoaded', open, false); }
    else { win.addEventListener('load', open, false); }
  }

}(window, document));
