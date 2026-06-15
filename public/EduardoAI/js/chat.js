/* chat.js — Eduardo.AI v2026.03.21
   + NLU query parser: strips question wrappers, extracts intent
   + Smart routing: ICD inline ("o que é cid10 f20"), math word problems,
     "quem é", "quando foi", "o que é", "quanto", "como funciona"
   + Contextual math: "2 bananas menos 1 = ?"
   + ICD-10 async: loads 72,748 codes from JSON via kb-medicine.js.
   + Weather support via kb-weather.js plugin
   ES5 + full WebKit/watchOS compatible.
*/
(function(W,D){
'use strict';

var MIN_SCORE=2,TOP_N=2;
var lang='pt',busy=false,history=[],opI=0;

var $msgs=D.getElementById('messages');
var $wrap=D.getElementById('messages-wrap');
var $inp=D.getElementById('chat-input');
var $send=D.getElementById('send-btn');
var $typ=D.getElementById('typing');
var $sdot=D.getElementById('status-dot');
var $stxt=D.getElementById('status-text');
var $disc=D.getElementById('disc');
var $lbtns=D.getElementsByClassName('lang-btn');

var S={
  ph:{pt:'pergunte qualquer coisa… (ex: "o que é F20?", "quanto é 15% de 200?", "5000 a 2% ao mês por 35")',en:'ask anything… (e.g. "what is F20?", "what is diabetes?", "5000 at 2% per month for 35")',es:'pregunta cualquier cosa… (ej: "qué es F20?", "cuánto es 15% de 200?", "5000 al 2% mensual por 35")'},
  online:{pt:'online',en:'online',es:'en línea'},
  busy:{pt:'calculando…',en:'calculating…',es:'calculando…'},
  busyKB:{pt:'buscando…',en:'searching…',es:'buscando…'},
  busyICD:{pt:'consultando CID-10…',en:'looking up ICD-10…',es:'consultando CIE-10…'},
  busyWeather:{pt:'consultando o tempo…',en:'checking weather…',es:'consultando el tiempo…'},
  typing:{pt:'Eduardo.AI está digitando…',en:'Eduardo.AI is typing…',es:'Eduardo.AI está escribiendo…'},
  disc:{pt:'uso educacional · não substitui profissional',en:'educational use · not professional advice',es:'uso educativo · no sustituye al profesional'},
  nf:{pt:'Não encontrei isso ainda. Tente perguntar de outra forma.\n\n**Exemplos que funcionam:**\n"o que é diabetes?", "o que é CID-10 F20?", "quem foi Einstein?"\n"quanto é 2^10?", "15% de 300", "se tenho 5 e tiro 3, quantos ficam?"\n"5000 a 2% ao mês por 35" (cálculo de juros compostos)\n**Direito:** "o que é habeas corpus?", "CLT férias", "o que é FGTS?"\n**Medicina:** "F20", "I10", "o que é CID F32"\n**Tempo:** "tempo em curitiba", "clima no rio hoje"',en:"I couldn't find that yet. Try rephrasing.\n\n**Examples:**\n\"what is diabetes?\", \"what is F20?\", \"who was Einstein?\"\n\"what is 2^10?\", \"15% of 300\"\n\"5000 at 2% per month for 35\" (compound interest calculation)\n**Medicine:** \"F20\", \"I10\", \"what is ICD F32\"\n**Weather:** \"weather in New York\", \"weather in São Paulo\"",es:'No encontré eso aún. Intenta reformular.\n\n**Ejemplos:**\n"qué es diabetes?", "qué es F20?", "quién fue Einstein?"\n"cuánto es 2^10?", "15% de 300"\n"5000 al 2% mensual por 35" (cálculo de interés compuesto)\n**Medicina:** "F20", "I10", "qué es CIE F32"\n**Tiempo:** "tiempo en Madrid", "clima en Barcelona"'},
  hint:{pt:'Talvez você queira saber sobre: ',en:'Maybe you want to know about: ',es:'Quizás te interese: '},
  icdh:{pt:'CID-10: ',en:'ICD-10: ',es:'CIE-10: '},
  icdd:{pt:'\n\n⚠ Informação educacional. Consulte um profissional de saúde.',en:'\n\n⚠ Educational only. Consult a healthcare professional.',es:'\n\n⚠ Solo educativo. Consulte a un profesional de salud.'},
  icdm:{pt:'Código não encontrado na base CID-10 2022. Ver: https://icd.who.int',en:'Code not found in ICD-10 2022 database. See: https://icd.who.int',es:'Código no encontrado en la base CIE-10 2022. Ver: https://icd.who.int'},
  icdLoading:{pt:'⏳ Carregando base CID-10 (72.748 códigos)…',en:'⏳ Loading ICD-10 database (72,748 codes)…',es:'⏳ Cargando base CIE-10 (72.748 códigos)…'}
};
function s(k){var e=S[k];return e?(e[lang]||e.pt):'';}

var OP={
  pt:['','Sobre isso: ','','Claro: ','','Boa pergunta! '],
  en:['','About that: ','','Sure: ','','Good question! '],
  es:['','Sobre eso: ','','Claro: ','','¡Buena pregunta! ']
};
function op(){var l=OP[lang]||OP.pt,o=l[opI%l.length];opI++;return o;}

/* ═══════════════════════════════════════════════════════════
   INPUT NORMALIZATION
═══════════════════════════════════════════════════════════ */
function removeAccents(str){
  return String(str)
    .replace(/[áàãâä]/g,'a').replace(/[éèêë]/g,'e').replace(/[íìîï]/g,'i')
    .replace(/[óòõôö]/g,'o').replace(/[úùûü]/g,'u').replace(/[ç]/g,'c')
    .replace(/[ñ]/g,'n').replace(/[ý]/g,'y').replace(/[æ]/g,'ae')
    .replace(/[ø]/g,'o').replace(/[ß]/g,'ss');
}

var ABBREV=[
  [/\btb\b/g,'tambem'],[/\btbm\b/g,'tambem'],[/\bpq\b/g,'porque'],[/\bporq\b/g,'porque'],
  [/\bkd\b/g,'onde esta'],[/\bcd\b/g,'onde esta'],[/\bmto\b/g,'muito'],[/\bmt\b/g,'muito'],
  [/\bvc\b/g,'voce'],[/\bvcs\b/g,'voces'],[/\bblz\b/g,'beleza ok'],[/\bflw\b/g,'falou tchau'],
  [/\bvlw\b/g,'valeu obrigado'],[/\bmsm\b/g,'mesmo'],[/\bpfv\b/g,'por favor'],[/\bpf\b/g,'por favor'],
  [/\bobg\b/g,'obrigado'],[/\brsrs\b/g,'risos'],[/\bkkk+\b/g,'risos'],
  [/\bhj\b/g,'hoje'],[/\boq\b/g,'o que'],[/\boque\b/g,'o que'],
  [/\bu\b/g,'you'],[/\bur\b/g,'your'],[/\bidk\b/g,'i dont know'],[/\blol\b/g,'funny'],
  [/\bthx\b/g,'thanks'],[/\bthnx\b/g,'thanks'],[/\bpls\b/g,'please'],[/\bplz\b/g,'please'],
  [/\bxq\b/g,'porque'],[/\bxfa\b/g,'por favor'],[/[¿¡]/g,''],
];

var TYPOS={
  'quimica':'quimica','quimia':'quimica','matematica':'matematica','fisika':'fisica',
  'hisotria':'historia','istoria':'historia','medicinia':'medicina','medecina':'medicina',
  'psicologya':'psicologia','tecnolgia':'tecnologia','computacao':'computacao',
  'progamacao':'programacao','phython':'python','pyhton':'python','pythn':'python',
  'enxaqueca':'enxaqueca','migrena':'enxaqueca','diabetes':'diabetes','diabets':'diabetes',
  'hipertensao':'hipertensao','cancer':'cancer','canser':'cancer','kanser':'cancer',
  'alzheimer':'alzheimer','alzeimer':'alzheimer','parkinsons':'parkinson',
  'depressao':'depressao','ansiedade':'ansiedade','esquizofrenia':'esquizofrenia',
  'constituicao':'constituicao','constitucao':'constituicao',
  'habeas':'habeas','habias':'habeas',
  'previdencia':'previdencia','trabalhista':'trabalhista','tarbalhista':'trabalhista',
};

var LANG_HINTS_PT=/\b(que|como|onde|quando|porque|voce|para|com|uma|por|mais|mas|muito|nao|sim|tambem|agora|depois|antes|sempre|nunca|tenho|quem|qual|quais|quanto|quantos|quantas|ficam|ficaria|seria|posso|devo|pode|cid|lei|artigo|codigo|direito|crime|pena|imposto|saude|tempo|clima|previsao|chuva|sol)\b/i;
var LANG_HINTS_ES=/\b(que|como|donde|cuando|porque|usted|para|con|una|por|más|pero|mucho|no|si|también|ahora|después|antes|siempre|nunca|tengo|quien|cuanto|cuantos|quedan|seria|puedo|debo|puede|ley|articulo|codigo|derecho|crimen|pena|impuesto|tiempo|clima|pronostico|lluvia|sol)\b/i;
var LANG_HINTS_EN=/\b(what|how|where|when|why|you|for|with|the|and|but|very|not|yes|also|now|after|before|always|never|have|who|which|many|would|should|can|must|law|article|code|right|crime|penalty|tax|health|weather|climate|forecast|rain|sun)\b/i;

function detectLang(text){
  var t=text.toLowerCase();
  var pt=(t.match(LANG_HINTS_PT)||[]).length;
  var es=(t.match(LANG_HINTS_ES)||[]).length;
  var en=(t.match(LANG_HINTS_EN)||[]).length;
  if(pt>es&&pt>en)return 'pt';
  if(es>pt&&es>en)return 'es';
  if(en>pt&&en>es)return 'en';
  return null;
}

function normalizeInput(raw){
  var t=String(raw).trim();
  t=t.replace(/^[\s\u2000-\u206F'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~\uFE00-\uFEFF]+/,'');
  t=t.replace(/[\s\u2000-\u206F'!"#$%&()*+,\-.\/:;<=>?@\[\]^_`{|}~\uFE00-\uFEFF]+$/,'');
  t=t.toLowerCase();
  for(var i=0;i<ABBREV.length;i++){t=t.replace(ABBREV[i][0],ABBREV[i][1]);}
  t=removeAccents(t);
  t=t.replace(/(.)\1{2,}/g,'$1');
  t=t.replace(/\s+/g,' ').trim();
  var words=t.split(' ');
  for(var w=0;w<words.length;w++){if(TYPOS[words[w]])words[w]=TYPOS[words[w]];}
  return words.join(' ');
}

function norm(t){
  return normalizeInput(String(t)).replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
}
function tok(t){
  return norm(t).split(' ').filter(function(w){return w.length>2;});
}
function esc(t){
  return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
function hms(){
  var d=new Date();
  return('0'+d.getHours()).slice(-2)+':'+('0'+d.getMinutes()).slice(-2)+':'+('0'+d.getSeconds()).slice(-2);
}

/* ═══════════════════════════════════════════════════════════
   NLU QUERY PARSER
═══════════════════════════════════════════════════════════ */

var Q_PREFIXES_PT=[
  /^(?:o que [eé]|que [eé]|me (?:fala|explica|diz) (?:sobre\s+)?|pesquisa|busca|procura)\s*(?:o\s+)?(?:cid[-\s]?(?:10)?[-\s:]*|cie[-\s]?(?:10)?[-\s:]*|icd[-\s]?(?:10)?[-\s:]*)/i,
  /^(?:o que [eé]|que [eé]|o que quer dizer|o que significa|o que seria|qual [eé]|quais s[aã]o|me diz o que [eé]|voc[eê] sabe o que [eé])\s*(?:um?a?\s*|o\s*|a\s*)?/i,
  /^(?:quem (?:[eé]|foi|era|s[aã]o|eram)|me (?:fala|conta) (?:sobre\s*|de\s*)?\s*(?:o\s*|a\s*)?|fala (?:sobre\s*|de\s*))\s*/i,
  /^(?:quando (?:foi|ocorreu|aconteceu|surgiu|come[cç]ou|nasceu|morreu)|onde (?:fica|[eé]|foi))\s*(?:o\s*|a\s*)?/i,
  /^(?:como (?:funciona|[eé] feito|se faz|tratar|[eé]|posso|devo|fazer))\s*(?:o\s*|a\s*|um?a?\s*)?/i,
  /^(?:o que (?:diz|prev[eê]|fala|estabelece|determina)|qual (?:[eé] a\s*|a\s*)?(?:pena|prazo|regra|lei)|o que [eé] (?:o\s*|a\s*|os\s*|as\s*))/i,
  /^(?:me (?:fala|conta|explica|diz)|explica|conta)\s*(?:sobre\s*|de\s*|do\s*|da\s*)?/i,
  /^(?:o que|que|qual|quais|quem|quando|onde|como|por que|porque)\s+/i,
];

var Q_PREFIXES_EN=[
  /^(?:what (?:is|are|was|were|does|do)|what's|whats)\s*(?:a\s*|an\s*|the\s*)?/i,
  /^(?:who (?:is|was|were|are)|tell me about|explain|describe)\s*(?:a\s*|an\s*|the\s*)?/i,
  /^(?:when (?:did|was|were)|where (?:is|was|are))\s*(?:the\s*)?/i,
  /^(?:how (?:does|do|is|are|can|to|many|much))\s*(?:a\s*|an\s*|the\s*)?/i,
  /^(?:can you (?:tell me about|explain|describe)|do you know about|tell me about)\s*/i,
];

var Q_PREFIXES_ES=[
  /^(?:qu[eé] (?:es|son|fue|fueron|significa|quiere decir)|cu[aá]l (?:es|son))\s*(?:un?\s*|una?\s*|el\s*|la\s*|los\s*|las\s*)?/i,
  /^(?:qui[eé]n (?:es|fue|era)|qu[eé]nes son|h[aá]blame de|expl[ií]came|descr[ií]be)\s*(?:el\s*|la\s*)?/i,
  /^(?:cu[aá]ndo (?:fue|ocurri[oó])|d[oó]nde (?:est[aá]|es)|c[oó]mo (?:funciona|es|se hace))\s*(?:el\s*|la\s*)?/i,
  /^(?:me hablas de|me explicas|cu[eé]ntame sobre|sabes qu[eé] es)\s*/i,
];

var Q_TRAIL=/[?!.…,;:]+\s*$/;

/* ICD inline: "cid f20", "cid-10 e11", "icd:f32.0" */
var ICD_INLINE=/(?:cid[-\s]?(?:10)?[-\s:]*|cie[-\s]?(?:10)?[-\s:]*|icd[-\s]?(?:10)?[-\s:]*)([A-Za-z]\d{2,}(?:\.\d{1,4})?)/i;
var ICD_STANDALONE=/^([A-Za-z]\d{2,}(?:\.\d{1,4})?)$/;

/* Number word map (PT/EN/ES combined) */
var NUM_MAP={
  zero:0,um:1,uma:1,dois:2,duas:2,tres:3,quatro:4,cinco:5,seis:6,sete:7,oito:8,nove:9,
  dez:10,onze:11,doze:12,treze:13,catorze:14,quinze:15,dezesseis:16,dezessete:17,dezoito:18,dezenove:19,
  vinte:20,trinta:30,quarenta:40,cinquenta:50,sessenta:60,setenta:70,oitenta:80,noventa:90,cem:100,mil:1000,
  one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,
  eleven:11,twelve:12,thirteen:13,fourteen:14,fifteen:15,twenty:20,thirty:30,forty:40,fifty:50,hundred:100,thousand:1000,
  uno:1,dos:2,cuatro:4,siete:7,ocho:8,nueve:9,diez:10,veinte:20,cien:100,mil:1000
};

/* Operator word map per lang */
var OP_MAP_PT={mais:'+',e:'+',somado:'+',adicionado:'+',acrescido:'+',menos:'-',tirando:'-',tiro:'-',retirando:'-',subtraindo:'-',diminuindo:'-',vezes:'*',multiplicado:'*',dividido:'/',sobre:'/',elevado:'^'};
var OP_MAP_EN={plus:'+',minus:'-','take away':'-',times:'*','multiplied by':'*','divided by':'/',over:'/','to the power of':'^'};
var OP_MAP_ES={mas:'+',menos:'-',por:'*','multiplicado por':'*','dividido entre':'/',sobre:'/','elevado a':'^'};

function replaceNumWords(str){
  var t=str;
  var keys=Object.keys(NUM_MAP).sort(function(a,b){return b.length-a.length;});
  for(var i=0;i<keys.length;i++){
    t=t.replace(new RegExp('\\b'+keys[i]+'\\b','gi'),String(NUM_MAP[keys[i]]));
  }
  return t;
}

function extractWordMath(raw,lc){
  var t=normalizeInput(raw);
  t=replaceNumWords(t);
  var opMap=lc==='en'?OP_MAP_EN:lc==='es'?OP_MAP_ES:OP_MAP_PT;
  var opKeys=Object.keys(opMap).sort(function(a,b){return b.length-a.length;});
  for(var i=0;i<opKeys.length;i++){
    t=t.replace(new RegExp('\\b'+opKeys[i]+'\\b','gi'),' '+opMap[opKeys[i]]+' ');
  }
  t=t.replace(/[^0-9+\-*/^().%\s]/g,' ').replace(/\s+/g,' ').trim();
  if(!/\d/.test(t))return null;
  if(!/[+\-*/^%]/.test(t))return null;
  t=t.replace(/\s*([+\-*/^])\s*/g,'$1').replace(/^[+*/^]+/,'').replace(/[+\-*/^]+$/,'').trim();
  if(!t||t.length<2)return null;
  return t;
}

function evalWordMath(expr,lc){
  if(!expr)return null;
  try{
    var safe=expr.replace(/[^0-9+\-*/^().%\s]/g,'');
    safe=safe.replace(/\^/g,'**');
    safe=safe.replace(/(\d+(?:\.\d+)?)\s*%\s*(?:de\s+|of\s+)?(\d+(?:\.\d+)?)/gi,function(_,a,b){
      return String(parseFloat(a)*parseFloat(b)/100);
    });
    var result=Function('"use strict";return ('+safe+')')();
    if(typeof result!=='number'||!isFinite(result))return null;
    var rounded=Math.round(result*1e10)/1e10;
    var label=lc==='pt'?'Resultado':lc==='es'?'Resultado':'Result';
    return label+': **'+rounded+'**';
  }catch(e){return null;}
}

function parseQuery(rawText,lc){
  var result={core:rawText,intent:'kb',icdCode:null,mathExpr:null,originalRaw:rawText};
  var t=rawText.trim();

  var m=ICD_INLINE.exec(t);
  if(m){result.intent='icd';result.icdCode=m[1].toUpperCase();return result;}

  if(ICD_STANDALONE.test(t)){result.intent='icd';result.icdCode=t.toUpperCase();return result;}

  var prefixes=lc==='en'?Q_PREFIXES_EN:lc==='es'?Q_PREFIXES_ES:Q_PREFIXES_PT;
  var stripped=t;
  for(var i=0;i<prefixes.length;i++){
    var pm=prefixes[i].exec(stripped);
    if(pm){stripped=stripped.slice(pm[0].length).replace(Q_TRAIL,'').trim();break;}
  }
  if(stripped===t&&lc!=='pt'){
    for(var j=0;j<Q_PREFIXES_PT.length;j++){
      var pm2=Q_PREFIXES_PT[j].exec(stripped);
      if(pm2){stripped=stripped.slice(pm2[0].length).replace(Q_TRAIL,'').trim();break;}
    }
  }
  stripped=stripped.replace(/^(o |a |os |as |um |uma |el |la |los |las |a |an |the )/i,'').replace(Q_TRAIL,'').trim();

  var m2=ICD_INLINE.exec(stripped)||ICD_STANDALONE.exec(stripped);
  if(m2){result.intent='icd';result.icdCode=(m2[1]||stripped).toUpperCase();return result;}

  result.core=stripped||t;

  /* Enhanced math signal: includes financial keywords % ao mes taxa juro juros */
  var hasMathSignal=/\d|mais|menos|vezes|dividid|tirando|tiro|ficam|sobram|total\s+[eé]|plus|minus|times|divided|cuantos|quedan|%|juro|taxa|mes|mês|ano|ao\s+mes|ao\s+mês|compound|capital|montante/.test(normalizeInput(rawText));
  if(hasMathSignal){
    var wm=extractWordMath(rawText,lc);
    if(wm){result.intent='math';result.mathExpr=wm;return result;}
    
    /* Check for financial compound interest patterns: "valor a taxa% ao periodo por tempo" */
    var finPattern=/(\d+\.?\d*)\s+(?:a|de)\s+(\d+\.?\d*)%\s+(?:ao|a|por)\s+(\w+)\s+(?:por|durante|por)\s+(\d+)/i;
    var fm=finPattern.exec(rawText);
    if(fm){
      result.intent='finance';
      result.financeData={principal:parseFloat(fm[1].replace(',','.')),rate:parseFloat(fm[2]),period:fm[3],time:parseInt(fm[4],10)};
      return result;
    }
  }

  var ln=norm(result.core+' '+rawText);
  if(/\b(lei|clt|cdc|eca|ctb|cpp|cpc|ctn|lgpd|fgts|inss|habeas|mandado|improbidade|licitacao|previdencia|trabalhista|consumidor|contrato|aluguel|constituicao|codigo penal|crime|pena|artigo|paragrafo|advogado|tribunal|juiz|processo|recurso)\b/.test(ln)){result.intent='law';}
  else if(/\b(cid|doenca|sintoma|tratamento|remedio|vacina|diabetes|hipertensao|cancer|infarto|avc|asma|depressao|ansiedade|alzheimer|hiv|tuberculose|covid|cirurgia|medicamento|antibiotico|colesterol|pressao|saude|medico|hospital|exame)\b/.test(ln)){result.intent='medicine';}
  else if(/\b(juro|taxa|juros|compound|capital|montante|emprestimo|dividendo|yield|percent|roi|margin|markup)\b/.test(ln)){result.intent='finance';}

  return result;
}

/* ═══════════════════════════════════════════════════════════
   RENDER / UI
═══════════════════════════════════════════════════════════ */
function rend(text){
  if(!text)return'';
  var lks=[],PH='\x00';
  var o=String(text).replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g,function(_,u,l){
    var safe=/^(https?:|mailto:)/.test(u.trim())?u.trim():'#';
    lks.push({u:safe,l:l});return PH+(lks.length-1)+PH;
  });
  o=esc(o);
  o=o.replace(new RegExp(esc(PH)+'(\\d+)'+esc(PH),'g'),function(_,i){
    var lk=lks[parseInt(i,10)];if(!lk)return'';
    return'<a href="'+lk.u+'" target="_blank" rel="noopener">'+esc(lk.l)+'</a>';
  });
  o=o.replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
  o=o.replace(/_\(([^)]+)\)_/g,'<em>$1</em>');
  o=o.replace(/\n/g,'<br>');
  return o;
}

function line(text,role,type){
  var wrap=D.createElement('div');wrap.className='msg-line';
  var meta=D.createElement('div');meta.className='ml-meta';
  var tm=D.createElement('span');tm.className='ml-time';tm.textContent=hms();
  var who=D.createElement('span');who.className='ml-who '+(role==='user'?'you':'ai');
  who.textContent=role==='user'?(lang==='pt'?'você':lang==='es'?'tú':'you'):'ai';
  meta.appendChild(tm);meta.appendChild(who);
  var body=D.createElement('div');
  var isICD=type&&type.indexOf('icd:')===0;
  var isMath=type==='math';
  var isWeather=type==='weather';
  body.className='ml-body '+(role==='user'?'you':role==='sys'?'sys':isICD?'icd':isMath?'math':isWeather?'weather':'ai');
  if(role==='user'||role==='sys'){body.textContent=text;}
  else{body.innerHTML=rend(text);}
  wrap.appendChild(meta);wrap.appendChild(body);
  if($msgs)$msgs.appendChild(wrap);
  var entry=null;
  if(role==='bot'){entry={wrap:wrap,body:body,who:who,type:type||'kb',origQ:null};history.push(entry);}
  scroll();
  return entry;
}

function divider(t){
  var el=D.createElement('div');el.className='msg-div';el.textContent=t||'';
  if($msgs)$msgs.appendChild(el);scroll();
}
function scroll(){
  if(!$wrap)return;
  if(W.requestAnimationFrame){W.requestAnimationFrame(function(){$wrap.scrollTop=$wrap.scrollHeight;});}
  else{$wrap.scrollTop=$wrap.scrollHeight;}
}
function showTyping(mode){
  if($typ){$typ.setAttribute('aria-label',s('typing'));$typ.className='on';}
  if($sdot)$sdot.className='busy';
  var txt = s('busyKB');
  if(mode==='math') txt = s('busy');
  else if(mode==='icd') txt = s('busyICD');
  else if(mode==='weather') txt = s('busyWeather');
  if($stxt)$stxt.textContent = txt;
  scroll();
}
function hideTyping(){
  if($typ)$typ.className='';if($sdot)$sdot.className='';if($stxt)$stxt.textContent=s('online');
}

/* ── IDENTITY ── */
var IDR=[
  /^(ol[aá]?|oi|eai|eaí|hey|hi|hello|hola|buenas|bom\s?dia|boa\s?tarde|boa\s?noite|howdy|sup|yo)[\s!?]*$/i,
  /\b(quem [eé] voc[eê]|who are you|qui[eé]n eres|o que [eé] (?:o )?eduardo(?:\.?ai?)?|what is eduardo|what can you do|o que voce faz|o que você faz)\b/i,
  /^eduardo(\.?ai?)?[\s!?]*$/i,
  /\b(se apresente|introduce yourself|preséntate|me apresenta)\b/i,
];
function isID(t){var n=norm(t);for(var i=0;i<IDR.length;i++)if(IDR[i].test(n)||IDR[i].test(t))return true;return false;}
function idAns(){
  var id=W.IDENTITY;
  if(id&&id.greeting&&id.greeting[lang])return id.greeting[lang];
  var nm=(id&&id.name)||'Eduardo Souza Rodrigues';
  return({
    pt:'Olá! Sou **Eduardo.AI**, assistente de '+nm+'.\n\nPosso responder perguntas complexas como:\n• "o que é diabetes?" / "o que é CID-10 F20?"\n• "quem foi Einstein?" / "quando foi a Revolução Francesa?"\n• "quanto é 15% de 200?" / "se tenho 5 bananas e tiro 2, quantos ficam?"\n• "o que é habeas corpus?" / "o que é FGTS?" / "o que é CLT?"\n• "tempo em São Paulo hoje?" / "previsão do tempo em Curitiba"\n\n**Tópicos:** medicina, direito brasileiro, história, ciências, tecnologia, matemática, tempo/clima.',
    en:"Hi! I'm **Eduardo.AI**, "+nm+"'s assistant.\n\nI understand complex questions like:\n• \"what is diabetes?\" / \"what is ICD-10 F20?\"\n• \"who was Einstein?\" / \"when was the French Revolution?\"\n• \"what is 15% of 200?\" / \"I have 5 and take away 2, how many left?\"\n• \"weather in São Paulo today?\"\n\n**Topics:** medicine, Brazilian law, history, science, technology, math, weather.",
    es:'¡Hola! Soy **Eduardo.AI**, asistente de '+nm+'.\n\nEntiendo preguntas complejas como:\n• "¿qué es la diabetes?" / "¿qué es CIE-10 F20?"\n• "¿quién fue Einstein?" / "¿cuándo fue la Revolución Francesa?"\n• "¿cuánto es el 15% de 200?"\n• "¿qué tiempo hace en São Paulo hoy?"\n\n**Temas:** medicina, derecho brasileño, historia, ciencias, tecnología, matemáticas, tiempo.'
  })[lang]||'';
}

/* ── ICD ── */
var ICDR=/^([A-Za-z]\d{2,}(\.\d{1,4})?)$/;
function icdCode(t){var x=t.trim();return ICDR.test(x)?x.toUpperCase():null;}
function icdAns(code){
  if(typeof W.lookupICDCode!=='function')return null;
  var r=W.lookupICDCode(code,lang);
  if(!r)return s('icdh')+code+'\n\n'+s('icdm');
  var txt=s('icdh')+code+' — '+r.label;
  if(r.detail)txt+='\n\n'+r.detail;
  txt+=s('icdd');
  return txt;
}

/* ═══════════════════════════════════════════════════════════
   KB ENGINE — multi-pass scoring
═══════════════════════════════════════════════════════════ */
function buildKB(lc){
  var kb={};
  var plugs=W.EduardoKB;
  if(plugs&&plugs.length){
    var sorted=plugs.slice().sort(function(a,b){return(b.priority||0)-(a.priority||0);});
    for(var p=0;p<sorted.length;p++){
      var ld=sorted[p].lang;if(!ld)continue;
      var en=ld[lc]||ld['pt'];if(!en)continue;
      var ks=Object.keys(en);
      for(var k=0;k<ks.length;k++)if(!kb[ks[k]])kb[ks[k]]=en[ks[k]];
    }
  }
  var ac=W.ANSWER_CACHE&&W.ANSWER_CACHE[lc];
  if(ac){var aks=Object.keys(ac);for(var i=0;i<aks.length;i++)if(aks[i]!=='unknown'&&aks[i]!=='default'&&!kb[aks[i]])kb[aks[i]]=ac[aks[i]];}
  return kb;
}

function scoreAll(rawQ,lc){
  var kb=buildKB(lc);
  var qNorm=norm(rawQ);
  var qTok=tok(rawQ);
  if(!qNorm||!qTok.length)return[];
  var sc=[],ks=Object.keys(kb);
  for(var i=0;i<ks.length;i++){
    var key=ks[i];
    var ans=kb[key];
    if(!ans||typeof ans!=='string'||ans.length<8)continue;
    var kNorm=norm(key.replace(/_/g,' '));
    var aNorm=norm(ans.replace(/\[\[[^\]|]+\|([^\]]+)\]\]/g,'$1').replace(/\*\*([^*]+)\*\*/g,'$1').replace(/\n/g,' '));
    var score=0;
    if(kNorm===qNorm)            score+=24;
    if(kNorm.indexOf(qNorm)>=0)  score+=16;
    if(aNorm.indexOf(qNorm)>=0)  score+=10;
    var allInKey=true,allInAns=true;
    for(var w=0;w<qTok.length;w++){
      var nw=norm(qTok[w]);
      if(kNorm.indexOf(nw)<0)allInKey=false;
      if(aNorm.indexOf(nw)<0)allInAns=false;
    }
    if(qTok.length>0){if(allInKey)score+=12;else if(allInAns)score+=5;}
    for(var w2=0;w2<qTok.length;w2++){
      var qw=norm(qTok[w2]);
      if(qw.length<3)continue;
      if(kNorm.indexOf(qw)>=0)        score+=5;
      else if(aNorm.indexOf(qw)>=0)   score+=1.5;
      if(qw.length>=5){
        var st=qw.slice(0,5);
        if(kNorm.indexOf(st)>=0)      score+=3;
        else if(aNorm.indexOf(st)>=0) score+=0.5;
      }else if(qw.length>=4){
        var st4=qw.slice(0,4);
        if(kNorm.indexOf(st4)>=0)     score+=2;
      }
    }
    if(score>=MIN_SCORE)sc.push({key:key,answer:ans,score:score});
  }
  sc.sort(function(a,b){return b.score-a.score;});
  return sc;
}

function reply(rawQ,core,lc){
  var candidates=[];
  function absorb(list){for(var i=0;i<list.length;i++)candidates.push(list[i]);}

  absorb(scoreAll(rawQ,lc));
  if(core&&core!==rawQ&&core.length>1)absorb(scoreAll(core,lc));
  var tokens=tok(core||rawQ);
  for(var t=0;t<Math.min(tokens.length,6);t++){
    if(tokens[t].length>=3)absorb(scoreAll(tokens[t],lc));
  }
  var alts=['pt','en','es'].filter(function(l){return l!==lc;});
  for(var ai=0;ai<alts.length;ai++)absorb(scoreAll(core||rawQ,alts[ai]));

  if(!candidates.length)return null;

  var seen={},dedup=[];
  for(var i=0;i<candidates.length;i++){
    var c=candidates[i];
    if(!seen[c.key]||seen[c.key].score<c.score){seen[c.key]=c;dedup.push(c);}
  }
  var final=[];
  var keys2=Object.keys(seen);
  for(var k=0;k<keys2.length;k++)final.push(seen[keys2[k]]);
  final.sort(function(a,b){return b.score-a.score;});

  var top=final.slice(0,TOP_N);
  if(top.length>1&&top[0].score>top[1].score*1.8)top=[top[0]];
  var parts=[];
  for(var p=0;p<top.length;p++)parts.push(top[p].answer.replace(/\n{3,}/g,'\n\n').trim());
  return op()+parts.join('\n\n—\n\n');
}

function fallback(rawQ,core,lc){
  var kb=buildKB(lc);
  var qt=tok(core||rawQ);
  var hints=[],ks=Object.keys(kb);
  for(var i=0;i<ks.length&&hints.length<5;i++){
    var kl=norm(ks[i].replace(/_/g,' '));
    for(var w=0;w<qt.length;w++){
      var nw=norm(qt[w]);
      if(nw.length<3)continue;
      if(kl.indexOf(nw)>=0||(nw.length>=4&&kl.indexOf(nw.slice(0,4))>=0)){
        hints.push('**'+ks[i].replace(/_/g,' ')+'**');break;
      }
    }
  }
  if(hints.length)return s('hint')+hints.join(', ')+'.';
  return s('nf');
}

/* ── RETRANSLATE ── */
function retrans(nl){
  for(var i=0;i<history.length;i++){
    var e=history[i];if(!e||!e.body)continue;
    if(e.who)e.who.textContent='ai';
    var t=e.type||'kb',txt=null;
    if(t==='identity'||t==='greeting')txt=(W.GREETINGS&&W.GREETINGS[nl])||idAns();
    else if(t&&t.indexOf('icd:')===0)txt=icdAns(t.slice(4));
    else if(t==='math'&&e.origQ){
      txt=W.tryMathEval?W.tryMathEval(e.origQ,nl):null;
      if(!txt&&e.mathResult)txt=e.mathResult;
    }else if(e.origQ){
      var pq=parseQuery(e.origQ,nl);
      txt=reply(e.origQ,pq.core,nl)||fallback(e.origQ,pq.core,nl);
    }
    if(txt)e.body.innerHTML=rend(txt);
  }
}

/* ── LANGUAGE ── */
function applyLang(l){
  var prev=lang;lang=l;
  for(var i=0;i<$lbtns.length;i++){
    var b=$lbtns[i];
    b.className=b.getAttribute('data-lang')===l?'lang-btn active':'lang-btn';
  }
  if($inp)$inp.placeholder=s('ph');
  if($disc)$disc.textContent=s('disc');
  if($stxt)$stxt.textContent=s('online');
  if(l!==prev)retrans(l);
}
for(var li=0;li<$lbtns.length;li++){
  (function(b){b.addEventListener('click',function(){applyLang(b.getAttribute('data-lang')||'pt');},false);}($lbtns[li]));
}

/* ═══════════════════════════════════════════════════════════
   SEND — main dispatch with NLU pipeline
═══════════════════════════════════════════════════════════ */
function send(){
  if(busy||!$inp)return;
  var rawText=$inp.value.trim();
  if(!rawText)return;

  var al=lang;
  $inp.value='';
  busy=true;
  if($send)$send.disabled=true;
  line(rawText,'user','user');

  /* Auto-detect language */
  var detected=detectLang(rawText);
  if(detected&&detected!==al)al=detected;

  /* Weather plugin — after user message is shown and language is detected */
  var weatherHandled = false;
  if(W.EduardoKB){
    for(var i=0;i<W.EduardoKB.length;i++){
      var plugin = W.EduardoKB[i];
      if(plugin.id==='weather' && typeof plugin.try==='function'){
        weatherHandled = plugin.try(rawText, al, function(answer){
          if(answer){
            showTyping('weather');
            setTimeout(function(){
              hideTyping();
              deliver(answer,'weather',rawText);
            },600); // realistic delay
          }
        });
        if(weatherHandled) break;
      }
    }
  }

  if(weatherHandled) return;

  /* ── NLU parse ── */
  var pq=parseQuery(rawText,al);

  /* 0a. Conversational */
  if(W.tryConversational){
    var cr=W.tryConversational(rawText,al)||W.tryConversational(pq.core,al);
    if(cr){deliver(cr,'conv',null);return;}
  }

  /* 0b. Dictionary */
  if(W.tryDictionary){
    var dr=W.tryDictionary(rawText,al)||W.tryDictionary(pq.core,al);
    if(dr){deliver(dr,'dict',null);return;}
  }

  /* 1. Identity */
  if(isID(rawText)||isID(pq.core)){deliver(idAns(),'identity',null);return;}

  /* 2. ICD — from NLU parser OR standalone code */
  var ic=pq.intent==='icd'?pq.icdCode:(icdCode(rawText.trim()));
  if(ic){
    showTyping('icd');
    if(W.__icdLookupAsync){
      var msgId='icd:'+ic;
      /* Call async lookup and capture both sync return value and async callback */
      var syncResult = W.__icdLookupAsync(ic,al,function(txt){
        /* Async callback: find message by ID and update when data arrives */
        var msgEl=D.getElementById(msgId);
        if(msgEl && msgEl.body){
          msgEl.body.innerHTML=rend(txt);
          scroll();
        }
      });
      hideTyping();busy=false;if($send)$send.disabled=false;
      /* Use sync result if it's a complete answer (not loading message) */
      if(syncResult && syncResult.indexOf('⏳') === -1){
        /* Complete answer available immediately (curated codes) */
        line(syncResult,'bot',msgId);
        scroll();
      } else {
        /* Loading message returned, callback will deliver async result */
        line(syncResult || s('icdLoading'),'bot',msgId);
      }
      return;
    }
    setTimeout(function(){
      hideTyping();
      var ir=icdAns(ic);
      deliver(ir||s('icdh')+ic+'\n\n'+s('icdm'),'icd:'+ic,null);
    },80);
    return;
  }

  /* 3. Math — word-math from NLU or tryMathEval */
  if(pq.intent==='math'&&pq.mathExpr){
    showTyping('math');
    setTimeout(function(){
      hideTyping();
      var mr=evalWordMath(pq.mathExpr,al);
      if(!mr&&W.tryMathEval){mr=W.tryMathEval(rawText,al)||W.tryMathEval(pq.mathExpr,al);}
      if(mr){var e=deliver(mr,'math',rawText);if(e){e.origQ=rawText;e.mathResult=mr;}return;}
      var kb=reply(rawText,pq.core,al)||fallback(rawText,pq.core,al);
      var e2=deliver(kb,'kb',rawText);if(e2)e2.origQ=rawText;
    },60);
    return;
  }
  if(W.tryMathEval){
    var mr2=W.tryMathEval(rawText,al)||W.tryMathEval(normalizeInput(rawText),al);
    if(mr2){
      showTyping('math');
      setTimeout(function(){
        hideTyping();
        var e=deliver(mr2,'math',rawText);if(e){e.origQ=rawText;e.mathResult=mr2;}
      },60);
      return;
    }
  }

  /* 4. Finance — compound interest, financial calculations */
  if(pq.intent==='finance'&&pq.financeData){
    showTyping('math');
    setTimeout(function(){
      hideTyping();
      var fd=pq.financeData;
      var principal=fd.principal||0;
      var rate=fd.rate||0;
      var time=fd.time||0;
      var period=(fd.period||'mes').toLowerCase();
      
      /* Convert annual rates to monthly/daily if needed */
      var monthlyRate=rate;
      if(/(ano|year)/.test(period)){monthlyRate=rate/12;}
      
      /* Compound interest: A = P(1 + r/100)^n */
      var finalAmount=principal*Math.pow(1+monthlyRate/100,time);
      var interest=finalAmount-principal;
      
      var calcLang={
        pt:function(){return'**Cálculo Financeiro**\n\nCapital: R$ '+principal.toFixed(2)+'\nTaxa: '+rate+'% ao '+period+'\nPeríodo: '+time+' meses\n\n**Resultado:**\nMontante Final: R$ '+finalAmount.toFixed(2)+'\nJuros: R$ '+interest.toFixed(2);},
        en:function(){return'**Financial Calculation**\n\nPrincipal: $'+principal.toFixed(2)+'\nRate: '+rate+'% per '+period+'\nPeriod: '+time+' months\n\n**Result:**\nFinal Amount: $'+finalAmount.toFixed(2)+'\nInterest: $'+interest.toFixed(2);},
        es:function(){return'**Cálculo Financiero**\n\nCapital: $'+principal.toFixed(2)+'\nTasa: '+rate+'% al '+period+'\nPeríodo: '+time+' meses\n\n**Resultado:**\nMonto Final: $'+finalAmount.toFixed(2)+'\nInterés: $'+interest.toFixed(2);}
      };
      
      var fr=(calcLang[al]||calcLang.pt)();
      var e=deliver(fr,'math',rawText);if(e){e.origQ=rawText;e.mathResult=fr;}
    },60);
    return;
  }

  /* 5. KB — multi-pass scoring with NLU core */
  showTyping('kb');
  setTimeout(function(){
    hideTyping();
    var r=reply(rawText,pq.core,al)||fallback(rawText,pq.core,al);
    var e=deliver(r,'kb',rawText);if(e)e.origQ=rawText;
  },160);
}

function deliver(text,type,origQ){
  hideTyping();
  var e=line(text,'bot',type);
  if(e&&origQ)e.origQ=origQ;
  busy=false;if($send)$send.disabled=false;
  return e;
}

/* ── INPUT EVENTS ── */
if($inp){
  $inp.addEventListener('keydown',function(e){
    var k=e.key||e.keyCode;
    if((k==='Enter'||k===13)&&!e.shiftKey){if(e.preventDefault)e.preventDefault();send();}
  },false);
  $inp.addEventListener('input',function(){if($send)$send.disabled=!$inp.value.trim();},false);
}
if($send)$send.addEventListener('click',function(){send();},false);
D.addEventListener('keydown',function(e){
  if((e.ctrlKey||e.metaKey)&&(e.key==='l'||e.key==='L'||e.keyCode===76)){
    if($msgs)$msgs.innerHTML='';history=[];divider('cleared');
  }
},false);

/* ── GREETING ── */
function greet(){
  var day=new Date().toLocaleDateString(lang==='en'?'en-US':lang==='es'?'es-ES':'pt-BR',{weekday:'long',year:'numeric',month:'long',day:'numeric'});
  divider(day);
  var gt=(W.GREETINGS&&W.GREETINGS[lang])||idAns();
  var e=line(gt,'bot','greeting');if(e)e.type='greeting';
}

/* ── iOS VIEWPORT ── */
function fixVP(){
  var vp=W.visualViewport,h=vp?Math.round(vp.height):W.innerHeight;
  var app=D.getElementById('app');if(app)app.style.height=h+'px';scroll();
}
if(W.visualViewport){W.visualViewport.addEventListener('resize',fixVP,{passive:true});W.visualViewport.addEventListener('scroll',fixVP,{passive:true});}
else{W.addEventListener('resize',fixVP,{passive:true});}

/* ── BOOT ── */
function boot(){
  applyLang('pt');if($inp)$inp.disabled=false;greet();
  setTimeout(function(){if(!('ontouchstart' in W)&&$inp)$inp.focus();},350);
}
if(D.readyState==='loading')D.addEventListener('DOMContentLoaded',boot,false);
else boot();

W.chatSend=send;

}(window,document));