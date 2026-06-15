# Eduardo.AI — How to add a new Knowledge Base

Adding a new KB is **one call** at the bottom of your new `*_knowledge.js` file.
No edits to `chat.js`, `knowledge.js`, or any other existing file required.

---

## Load order in `index.html`

```html
<!-- 1. Polyfills (must be first) -->
<script src="compat.js"></script>

<!-- 2. Registry (must be before any KB file) -->
<script src="kb-registry.js"></script>

<!-- 3. Core KB -->
<script src="knowledge.js"></script>
<script src="knowledge-register.js"></script>   <!-- registers 'core' plugin -->

<!-- 4. Specialist KBs (any order, any number) -->
<script src="medical_knowledge.js"></script>     <!-- registers 'medical' plugin -->
<!-- <script src="law_knowledge.js"></script>    registers 'law' plugin -->
<!-- <script src="finance_knowledge.js"></script> registers 'finance' plugin -->

<!-- 5. App scripts (after all KBs) -->
<script src="db.js"></script>
<script src="chat.js"></script>
<!-- … rest of scripts … -->
```

---

## Minimal KB file template

Copy this template, fill in your data, and save it as `my_topic_knowledge.js`.

```javascript
/*
 * my_topic_knowledge.js — Eduardo.AI
 * Replace MY_TOPIC with your domain (e.g. law, finance, science…)
 */

/* ── 1. Keyword map (one regex per topic key, three languages) ── */
window.MY_TOPIC_KEYWORD_MAP = {
  pt: {
    topic_a: /\bpalavra\b|\boutro termo\b/i,
    topic_b: /\boutro assunto\b/i
  },
  en: {
    topic_a: /\bword\b|\bother term\b/i,
    topic_b: /\bother topic\b/i
  },
  es: {
    topic_a: /\bpalabra\b|\botro término\b/i,
    topic_b: /\botro tema\b/i
  }
};

/* ── 2. Answer content ── */
var _MY_TOPIC_GK = {
  topic_a: {
    pt: '**Título PT** ...',
    en: '**Title EN** ...',
    es: '**Título ES** ...'
  },
  topic_b: {
    pt: '**PT** ...',
    en: '**EN** ...',
    es: '**ES** ...'
  }
};

/* ── 3. Public getAnswer ── */
window.getMyTopicAnswer = function (key, lang) {
  var entry = _MY_TOPIC_GK[key];
  if (!entry) return null;
  return entry[lang] || entry.pt || null;
};

/* ── 4. Suggestion chips ── */
window.MY_TOPIC_SUGGESTIONS = {
  pt: [
    { label: 'Assunto A', key: 'topic_a' },
    { label: 'Assunto B', key: 'topic_b' }
  ],
  en: [
    { label: 'Topic A', key: 'topic_a' },
    { label: 'Topic B', key: 'topic_b' }
  ],
  es: [
    { label: 'Tema A', key: 'topic_a' },
    { label: 'Tema B', key: 'topic_b' }
  ]
};

/* ── 5. Answer cache (pre-warm for instant chip responses) ── */
window.MY_TOPIC_ANSWER_CACHE = (function () {
  var cache = { pt: {}, en: {}, es: {} };
  var langs = ['pt', 'en', 'es'];
  var keys  = Object.keys(_MY_TOPIC_GK);
  for (var li = 0; li < langs.length; li++) {
    for (var ki = 0; ki < keys.length; ki++) {
      cache[langs[li]][keys[ki]] = window.getMyTopicAnswer(keys[ki], langs[li]);
    }
  }
  return cache;
}());

/* ── 6. (Optional) LLM system-prompt injection ── */
window.buildMyTopicSystemPrompt = function (lang) {
  var intros = {
    pt: 'Você também tem conhecimento em MY_TOPIC. Use-o quando relevante.',
    en: 'You also have expertise in MY_TOPIC. Use it when relevant.',
    es: 'También tienes conocimiento en MY_TOPIC. Úsalo cuando sea relevante.'
  };
  return intros[lang] || intros.pt;
};

/* ── 7. REGISTER — this is the only required call ── */
(function registerMyTopicKB() {

  function doRegister() {
    if (!window.KBRegistry) {
      setTimeout(doRegister, 50);   // wait for kb-registry.js
      return;
    }
    window.KBRegistry.register({
      id:             'my_topic',   // unique slug — change this
      priority:       10,           // 0 = core, 10+ = specialist

      keywordMap:     window.MY_TOPIC_KEYWORD_MAP,
      answerCache:    window.MY_TOPIC_ANSWER_CACHE,
      getAnswer:      window.getMyTopicAnswer,
      suggestions:    window.MY_TOPIC_SUGGESTIONS,
      systemPromptFn: window.buildMyTopicSystemPrompt,  // optional

      label: { pt: 'Meu Tópico', en: 'My Topic', es: 'Mi Tema' }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', doRegister, false);
  } else {
    doRegister();
  }
}());
```

---

## Plugin descriptor reference

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | ✅ | Unique slug. Used for dedup and `unregister()`. |
| `keywordMap` | `object` | ✅ | `{ pt: { key: /regex/ }, en: {…}, es: {…} }` |
| `getAnswer` | `function(key, lang)` | ✅ | Returns answer string or `null`. |
| `priority` | `number` | — | Higher wins on collision. Default `0`. Core is `0`, specialist `10+`. |
| `answerCache` | `object` | — | `{ pt: { key: answer }, … }` Pre-warmed for chip fast-path. |
| `suggestions` | `object` | — | `{ pt: [{label, key}], … }` Chip buttons shown in toolbar. |
| `systemPromptFn` | `function(lang)` | — | Returns a string appended to the LLM system prompt. |
| `label` | `object` | — | `{ pt, en, es }` Human-readable name shown in status UI. |

---

## KBRegistry public API

```javascript
// Register a plugin
window.KBRegistry.register(pluginDescriptor);

// Unregister by id (useful for dev/testing)
window.KBRegistry.unregister('my_topic');

// Free-text lookup — returns { key, answer, plugin } or null
window.KBRegistry.lookup('what is diabetes', 'en');

// Get answer by key from any registered plugin
window.KBRegistry.getAnswer('cardiovascular', 'pt');

// Merged suggestion chips from all plugins (used by chat.js)
window.KBRegistry.getSuggestions('pt');

// Merged answer cache from all plugins (used by chip fast-path)
window.KBRegistry.getAnswerCache('en');

// Merged LLM system prompt from all plugins
window.KBRegistry.buildSystemPrompt('pt');

// List all registered plugins
window.KBRegistry.list();
// → [{ id, priority, label }, …]
```

---

## Checklist for a new KB

- [ ] Create `my_topic_knowledge.js` from the template above
- [ ] Define `MY_TOPIC_KEYWORD_MAP` with regexes for all three languages
- [ ] Populate `_MY_TOPIC_GK` with rich answer content
- [ ] Expose `getMyTopicAnswer(key, lang)`
- [ ] (Optional) add `MY_TOPIC_SUGGESTIONS` for chip buttons
- [ ] (Optional) add `MY_TOPIC_ANSWER_CACHE` for instant chip replies
- [ ] (Optional) add `buildMyTopicSystemPrompt(lang)` for LLM context
- [ ] Call `KBRegistry.register({…})` at the bottom
- [ ] Add `<script src="my_topic_knowledge.js"></script>` **after** `kb-registry.js` in `index.html`
- [ ] Done — no other file needs to change ✅
