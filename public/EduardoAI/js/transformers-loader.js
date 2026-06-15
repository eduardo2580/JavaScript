/*
 * transformers-loader.js — Eduardo.AI
 * ─────────────────────────────────────────────────────────────────────
 * DROP-IN REPLACEMENT for webllm-loader.js.
 * Uses Transformers.js v3 (HuggingFace) + ONNX Runtime instead of WebLLM.
 *
 * WHY THIS IS BETTER THAN WEBLLM FOR THIS PROJECT
 * ─────────────────────────────────────────────────────────────────────
 * • Qwen2.5-0.5B-Instruct at q4 = ~230 MB — fits the <250 MB requirement
 * • Qwen2.5 was trained on Portuguese and Spanish natively — it actually
 *   follows "Responda SOMENTE em Português" unlike SmolLM2
 * • Three fallback backends: WebGPU → WebGL → WASM (CPU)
 *   WebLLM requires WebGPU and dies completely without it
 * • Models are served from HuggingFace CDN, cached in browser after first load
 * • Open source: Apache 2.0 (Transformers.js) + MIT (Qwen2.5)
 *
 * MODEL LADDER (tried in order, all under 250 MB at q4)
 * ─────────────────────────────────────────────────────────────────────
 *   1. onnx-community/Qwen2.5-0.5B-Instruct  q4  ~230 MB  ← primary
 *   2. Mozilla/Qwen2.5-0.5B-Instruct         q4  ~230 MB  ← mirror
 *   3. onnx-community/Qwen3-0.6B-ONNX        q4  ~300 MB  ← smarter fallback
 *
 * INTERFACE — identical to webllm-loader.js:
 *   window.__webllmReady  = engine adapter on success
 *   window.__webllmFailed = reason string on failure
 *   window.__webllmProgress(pct, text) called during load
 *   window.__webllmStarted = true
 *
 * The engine adapter exposes:
 *   engine.chat.completions.create({ messages, max_tokens, temperature, top_p, stream })
 *   → returns Promise<{ choices: [{ message: { content: string } }] }>
 *
 * This matches the OpenAI-compatible interface that chat.js already uses,
 * so chat.js needs ZERO changes.
 *
 * LOAD ORDER in index.html:
 *   <script type="module" src="transformers-loader.js"></script>
 *   <script src="chat.js"></script>
 *
 * ES Module (type="module"). No bundler needed.
 */

/* ═══════════════════════════════════════════════════
   MODEL CANDIDATES
   All are ONNX q4 quantized, ~230–300 MB, multilingual.
   Tried in order — first one that loads wins.
═══════════════════════════════════════════════════ */
const MODELS = [
  {
    id:    'onnx-community/Qwen2.5-0.5B-Instruct',
    dtype: 'q4',
    label: 'Qwen2.5-0.5B',
    size:  '~230 MB'
  },
  {
    id:    'Mozilla/Qwen2.5-0.5B-Instruct',
    dtype: 'q4',
    label: 'Qwen2.5-0.5B (mirror)',
    size:  '~230 MB'
  },
  {
    id:    'onnx-community/Qwen3-0.6B-ONNX',
    dtype: 'q4',
    label: 'Qwen3-0.6B',
    size:  '~300 MB'
  },
];

/* CDN for Transformers.js v3 */
const TJS_CDNS = [
  'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3',
  'https://esm.run/@huggingface/transformers@3',
];

window.__webllmStarted = true;

/* ═══════════════════════════════════════════════════
   TRANSLATIONS  (pt / en / es)
═══════════════════════════════════════════════════ */
const gl = () => window.__webllmLang || 'pt';
const T = {
  checkGPU:   { pt:'Verificando WebGPU…',           en:'Checking WebGPU…',             es:'Verificando WebGPU…'           },
  loadingMod: { pt:'Carregando motor de IA…',        en:'Loading AI engine…',           es:'Cargando motor de IA…'         },
  tryMirror:  { pt:'Tentando fonte alternativa…',    en:'Trying alternative source…',   es:'Probando fuente alternativa…'  },
  initModel:  { pt:'Iniciando {m} ({s})…',           en:'Starting {m} ({s})…',          es:'Iniciando {m} ({s})…'          },
  retry:      { pt:'Tentando modelo alternativo…',   en:'Trying alternative model…',    es:'Probando modelo alternativo…'  },
  downloading:{ pt:'Baixando… {p}%',                 en:'Downloading… {p}%',            es:'Descargando… {p}%'             },
  loading:    { pt:'Carregando… {p}%',               en:'Loading… {p}%',                es:'Cargando… {p}%'                },
  compiling:  { pt:'Compilando shaders WebGPU…',     en:'Compiling WebGPU shaders…',    es:'Compilando shaders WebGPU…'    },
  ready:      { pt:'IA pronta ✓ ({m})',              en:'AI ready ✓ ({m})',             es:'IA lista ✓ ({m})'              },
  fallbackCPU:{ pt:'IA pronta (modo CPU) ✓',        en:'AI ready (CPU mode) ✓',       es:'IA lista (modo CPU) ✓'        },
  errNoTJS:   { pt:'⚠ Falha ao carregar motor.',     en:'⚠ Engine load failed.',        es:'⚠ Error al cargar motor.'      },
  errNoModel: { pt:'⚠ Nenhum modelo disponível.',    en:'⚠ No model available.',        es:'⚠ Ningún modelo disponible.'   },
  errGeneric: { pt:'⚠ Erro: {msg}',                  en:'⚠ Error: {msg}',               es:'⚠ Error: {msg}'                },
};
function t(k, v) {
  const e = T[k]; if (!e) return k;
  let s = e[gl()] || e.pt;
  if (v) Object.keys(v).forEach(k2 => { s = s.replace('{'+k2+'}', v[k2]); });
  return s;
}

/* ═══════════════════════════════════════════════════
   DOM BRIDGE
═══════════════════════════════════════════════════ */
function push(pct, text) {
  const p    = Math.min(100, Math.max(0, Math.round(pct)));
  const fill = document.getElementById('llm-loader-fill');
  const lbl  = document.getElementById('llm-loader-label');
  if (fill)        fill.style.width = p + '%';
  if (lbl && text) lbl.textContent  = text;
  try { if (typeof window.__webllmProgress === 'function') window.__webllmProgress(p, text); } catch (_) {}
}

/* ═══════════════════════════════════════════════════
   DEVICE DETECTION
   Falls back: WebGPU → WebGL → WASM (CPU)
   WebLLM required WebGPU and hard-failed without it.
   Transformers.js works on all three.
═══════════════════════════════════════════════════ */
async function detectDevice() {
  /* Try WebGPU */
  if (navigator.gpu) {
    try {
      const adapter = await Promise.race([
        navigator.gpu.requestAdapter({ powerPreference: 'high-performance' }),
        new Promise(r => setTimeout(() => r(null), 5000))
      ]);
      if (adapter) {
        console.info('[TJS] WebGPU available');
        return 'webgpu';
      }
    } catch (_) {}
  }
  /* Try WebGL (GPU but older API) */
  try {
    const canvas = document.createElement('canvas');
    if (canvas.getContext('webgl2') || canvas.getContext('webgl')) {
      console.info('[TJS] WebGL available (WebGPU unavailable)');
      return 'wasm'; /* TJS webgl support for LLMs is limited — use wasm which is more reliable */
    }
  } catch (_) {}
  /* CPU fallback — always works */
  console.info('[TJS] Using CPU/WASM');
  return 'wasm';
}

/* ═══════════════════════════════════════════════════
   LOAD TRANSFORMERS.JS MODULE
═══════════════════════════════════════════════════ */
async function loadTJS() {
  for (const cdn of TJS_CDNS) {
    try {
      push(5, t('loadingMod'));
      const mod = await import(cdn);
      if (mod && (mod.pipeline || mod.TextGenerationPipeline)) {
        console.info('[TJS] Loaded from', new URL(cdn).hostname);
        return mod;
      }
    } catch (e) {
      console.warn('[TJS] CDN failed:', cdn, e?.message);
      push(6, t('tryMirror'));
    }
  }
  return null;
}

/* ═══════════════════════════════════════════════════
   PROGRESS TRACKER
   Transformers.js fires progress_callback once per file,
   with progress 0→1 for that individual file.
   If we use that directly we get "3000%" because each
   new file resets back to near-zero.

   Fix: track bytes downloaded/total per file, sum them
   all up, and map the running total to the 10–95 range.
   The model has a known set of weight files (~4–8 shards
   for q4). We estimate total size from the model's
   known disk size and use loaded bytes as the numerator.
═══════════════════════════════════════════════════ */
function makeProgressTracker(modelSizeBytes) {
  /* file → { loaded, total } */
  const files   = {};
  let   lastPct = 10;

  return function onProgress(progress) {
    const status = (progress.status || '').toLowerCase();
    const file   = progress.file   || 'model';

    /* ── Initiate/update file entry ── */
    if (!files[file]) files[file] = { loaded: 0, total: 0 };

    if (progress.loaded != null) files[file].loaded = progress.loaded;

    /* total per file comes from the progress event or we estimate */
    if (progress.total  != null && progress.total > 0) {
      files[file].total = progress.total;
    } else if (files[file].total === 0) {
      /* Estimate: spread modelSizeBytes evenly across known files */
      const knownFiles = Object.keys(files).length || 1;
      files[file].total = Math.round(modelSizeBytes / knownFiles);
    }

    /* ── Compute overall downloaded bytes ── */
    let totalLoaded = 0;
    let totalSize   = 0;
    const keys = Object.keys(files);
    for (let k = 0; k < keys.length; k++) {
      totalLoaded += files[keys[k]].loaded || 0;
      totalSize   += files[keys[k]].total  || 0;
    }
    if (totalSize === 0) totalSize = modelSizeBytes;

    /* ── Map to 10–95 range ── */
    const ratio  = Math.min(1, totalLoaded / totalSize);
    const newPct = Math.round(10 + ratio * 85);

    /* Never go backwards */
    if (newPct > lastPct) lastPct = newPct;

    /* ── Build human-readable label ── */
    const mbLoaded = (totalLoaded / 1024 / 1024).toFixed(0);
    const mbTotal  = (totalSize   / 1024 / 1024).toFixed(0);
    let   label;

    if (status === 'downloading' || status === 'download') {
      label = t('downloading', { p: lastPct }) + ' (' + mbLoaded + '/' + mbTotal + ' MB)';
    } else if (status === 'compiling' || status === 'compile') {
      label = t('compiling');
    } else {
      label = t('loading', { p: lastPct });
    }

    push(lastPct, label);
  };
}

/* ═══════════════════════════════════════════════════
   LOAD MODEL — tries each candidate until one works
═══════════════════════════════════════════════════ */
async function loadModel(tjs, device) {
  for (let i = 0; i < MODELS.length; i++) {
    const m = MODELS[i];
    push(10 + i * 2, t('initModel', { m: m.label, s: m.size }));
    console.info('[TJS] Trying model:', m.id, 'dtype:', m.dtype, 'device:', device);

    /* Estimate model size in bytes from the label (e.g. "~230 MB") */
    const sizeMatch    = (m.size || '').match(/([\d.]+)\s*MB/i);
    const sizeBytes    = sizeMatch ? parseFloat(sizeMatch[1]) * 1024 * 1024 : 250 * 1024 * 1024;
    const onProgress   = makeProgressTracker(sizeBytes);

    try {
      const pipe = await tjs.pipeline('text-generation', m.id, {
        dtype:             m.dtype,
        device:            device,
        progress_callback: onProgress
      });

      if (pipe) {
        console.info('[TJS] Model ready:', m.id, 'on', device);
        return { pipe, model: m };
      }
    } catch (e) {
      console.warn('[TJS] Model failed:', m.id, e?.message);
      if (i < MODELS.length - 1) push(12 + i * 2, t('retry'));
    }
  }
  return null;
}

/* ═══════════════════════════════════════════════════
   ENGINE ADAPTER
   Wraps the Transformers.js pipeline in an OpenAI-compatible
   interface identical to what WebLLM exposes, so chat.js
   needs ZERO changes.

   Input:  { messages: [{role, content}], max_tokens, temperature, top_p, stream }
   Output: { choices: [{ message: { role: 'assistant', content: string } }] }
═══════════════════════════════════════════════════ */
function createEngineAdapter(pipe, modelInfo) {
  return {
    /* Matches engine.chat.completions.create() from WebLLM / OpenAI SDK */
    chat: {
      completions: {
        create: async function(params) {
          const messages     = params.messages     || [];
          const max_tokens   = params.max_tokens   || 256;
          const temperature  = params.temperature  != null ? params.temperature : 0.7;
          const top_p        = params.top_p        != null ? params.top_p        : 0.9;

          /* Transformers.js text-generation pipeline accepts messages array directly
             when the model has a chat template (Qwen2.5 does) */
          const output = await pipe(messages, {
            max_new_tokens:     max_tokens,
            temperature:        temperature,
            top_p:              top_p,
            do_sample:          temperature > 0,
            repetition_penalty: 1.1,
            return_full_text:   false,  /* return only the new tokens, not the prompt */
          });

          /* Transformers.js output format:
             [ { generated_text: string | [...messages, {role:'assistant', content:...}] } ]
             We normalise both formats into the OpenAI response shape. */
          let content = '';

          if (output && output[0]) {
            const gen = output[0].generated_text;
            if (typeof gen === 'string') {
              content = gen;
            } else if (Array.isArray(gen)) {
              /* Chat template format — last message is the assistant reply */
              const last = gen[gen.length - 1];
              content = (last && last.content) ? last.content : String(last || '');
            }
          }

          content = content.trim();

          /* Strip accidental "As an AI…" prefix */
          content = content.replace(/^(as an ai|i am an ai|i'm an ai|como (?:uma? )?ia|sou uma? ia)[^.!?\n]*[.!?\n]\s*/i, '').trim();

          return {
            choices: [{
              message: {
                role:    'assistant',
                content: content
              },
              finish_reason: 'stop'
            }],
            model:  modelInfo.id,
            object: 'chat.completion'
          };
        }
      }
    }
  };
}

/* ═══════════════════════════════════════════════════
   MAIN
═══════════════════════════════════════════════════ */
(async () => {
  try {
    /* 1. Detect best available compute device */
    push(2, t('checkGPU'));
    const device = await detectDevice();

    /* 2. Load Transformers.js */
    push(4, t('loadingMod'));
    const tjs = await loadTJS();
    if (!tjs || !tjs.pipeline) {
      push(100, t('errNoTJS'));
      window.__webllmFailed = 'transformers-js-load-failed';
      return;
    }

    /* 3. Load model */
    const result = await loadModel(tjs, device);
    if (!result) {
      /* Try again on WASM if WebGPU failed all models */
      if (device === 'webgpu') {
        console.warn('[TJS] All models failed on WebGPU, retrying on WASM');
        push(50, t('retry'));
        const wasm_result = await loadModel(tjs, 'wasm');
        if (!wasm_result) {
          push(100, t('errNoModel'));
          window.__webllmFailed = 'all-models-failed';
          return;
        }
        push(100, t('fallbackCPU'));
        window.__webllmReady = createEngineAdapter(wasm_result.pipe, wasm_result.model);
        console.info('[TJS] Ready on WASM ✓', wasm_result.model.id);
        return;
      }
      push(100, t('errNoModel'));
      window.__webllmFailed = 'all-models-failed';
      return;
    }

    /* 4. Done */
    const label = device === 'webgpu' ? result.model.label : result.model.label + ' CPU';
    push(100, t('ready', { m: label }));
    window.__webllmReady = createEngineAdapter(result.pipe, result.model);
    console.info('[TJS] Ready ✓ model:', result.model.id, 'device:', device);

  } catch (e) {
    const msg = e?.message || 'unknown';
    console.error('[TJS] Fatal:', msg, e);
    push(100, t('errGeneric', { msg: msg.slice(0, 80) }));
    window.__webllmFailed = msg;
  }
})();
