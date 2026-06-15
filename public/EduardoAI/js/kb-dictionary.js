/* kb-dictionary.js — Eduardo.AI Dictionary & Common Words KB v2026.03.20
   Covers: fruits, vegetables, animals, materials, body parts, household,
   nature, food, colors, emotions, professions, science terms, everyday verbs,
   common questions, geography basics. PT/EN/ES with etymology & facts.
   Priority 12. ES5 compatible. No dependencies.
*/
(function(W) {
  'use strict';

  /* ════════════════════════════════════════════
     WORD LOOKUP ENGINE
     Intercepts "what is X", "o que é X", "define X", "significado de X"
     and single common words typed as queries.
  ════════════════════════════════════════════ */

  var DEFINE_RE = /^(?:o\s+que\s+[eé]|o\s+que\s+significa|what\s+is\s+(?:a\s+|an\s+|the\s+)?|define\s+|definition\s+of\s+|significa\s+|significado\s+(?:de\s+)?|qu[eé]\s+(?:es\s+|significa\s+)?|definici[oó]n\s+(?:de\s+)?)(.+)/i;

  W.tryDictionary = function(query, lang) {
    var q = query.trim();
    var lc = lang || 'pt';

    /* Try "what is X" / "o que é X" patterns */
    var m = q.match(DEFINE_RE);
    var word = m ? m[1].trim().toLowerCase() : q.toLowerCase().replace(/[?!.]+$/, '').trim();

    /* Strip articles */
    word = word.replace(/^(um |uma |o |a |the |un |una |el |la |los |las |os |as )/i, '').trim();

    var dict = W._dict;
    if (!dict) return null;

    /* Exact match */
    if (dict[word] && dict[word][lc]) return formatDef(word, dict[word], lc);

    /* Try English/PT/ES key fallbacks */
    var keys = Object.keys(dict);
    for (var i = 0; i < keys.length; i++) {
      var entry = dict[keys[i]];
      /* Check if any language variant matches the word */
      var aliases = (entry._aliases || []).concat([keys[i]]);
      for (var j = 0; j < aliases.length; j++) {
        if (aliases[j].toLowerCase() === word) {
          return formatDef(keys[i], entry, lc);
        }
      }
    }

    return null;
  };

  function formatDef(key, entry, lc) {
    var data = entry[lc] || entry['pt'];
    if (!data) return null;
    var out = '**' + (data.word || key) + '**';
    if (data.type) out += ' _(' + data.type + ')_';
    out += '\n\n' + data.def;
    if (data.fact) out += '\n\n💡 ' + data.fact;
    if (data.etymology) out += '\n\n📖 _Etimologia: ' + data.etymology + '_';
    return out;
  }

  /* ════════════════════════════════════════════
     DICTIONARY DATABASE
  ════════════════════════════════════════════ */
  W._dict = {

    /* ── FRUITS ─────────────────────────────── */
    'banana': {
      _aliases: ['banana', 'bananas'],
      pt: { word: 'Banana', type: 'substantivo, fruta', def: 'Fruta tropical alongada, de casca amarela quando madura, polpa macia e adocicada. Produzida pela bananeira (Musa spp.), planta herbácea da família Musaceae.', fact: 'O Brasil é o 5º maior produtor mundial. Rica em potássio, vitamina B6 e triptofano (precursor da serotonina). A banana que você come (Cavendish) é um clone — sem sementes.', etymology: 'Do árabe "banan" (dedo) via português colonial.' },
      en: { word: 'Banana', type: 'noun, fruit', def: 'Elongated tropical fruit with yellow skin when ripe, soft sweet flesh. Produced by the banana plant (Musa spp.), a herbaceous plant in family Musaceae.', fact: 'Rich in potassium, vitamin B6, and tryptophan (serotonin precursor). The Cavendish variety (what you eat) is a seedless clone. Technically a berry botanically.', etymology: 'From Arabic "banan" (finger) via Portuguese colonial trade.' },
      es: { word: 'Banana / Plátano', type: 'sustantivo, fruta', def: 'Fruta tropical alargada, de piel amarilla cuando está madura, pulpa suave y dulce. Producida por la bananera (Musa spp.).', fact: 'Rica en potasio, vitamina B6 y triptófano. La variedad Cavendish (la que consumes) es un clon sin semillas. Botánicamente es una baya.' }
    },

    'strawberry': {
      _aliases: ['morango', 'fresa', 'strawberry', 'morangos', 'fresas'],
      pt: { word: 'Morango', type: 'substantivo, fruta', def: 'Fruta pequena, vermelha e aromática do morangueiro (Fragaria × ananassa). Tecnicamente é um "pseudofruto" — a parte carnosa é o receptáculo floral expandido, não o ovário.', fact: 'A única fruta com sementes na parte externa (aquênios). Rico em vitamina C, antioxidantes e antocianinas. Cultivado em todo o mundo, com destaque para EUA, China e Espanha.', etymology: 'Do inglês antigo "streawberige", talvez por palha (straw) usada no cultivo.' },
      en: { word: 'Strawberry', type: 'noun, fruit', def: 'Small, red, aromatic fruit from the strawberry plant (Fragaria × ananassa). Technically an "accessory fruit" — the fleshy part is the enlarged floral receptacle, not the ovary.', fact: "The only fruit with seeds on the outside (achenes). Rich in vitamin C, antioxidants, and anthocyanins. There are ~200 tiny seeds on each berry. They're not technically a berry botanically.", etymology: 'From Old English "streawberige" — possibly from "straw" used in cultivation.' },
      es: { word: 'Fresa / Frutilla', type: 'sustantivo, fruta', def: 'Fruta pequeña, roja y aromática del fresero (Fragaria × ananassa). Técnicamente es un pseudofruto — la parte carnosa es el receptáculo floral.', fact: 'La única fruta con semillas en el exterior (aquenios). Rica en vitamina C y antioxidantes. ~200 semillas por fruta.' }
    },

    'apple': {
      _aliases: ['maçã', 'manzana', 'apple', 'maçãs', 'manzanas'],
      pt: { word: 'Maçã', type: 'substantivo, fruta', def: 'Fruta de clima temperado da macieira (Malus domestica). Casca que vai do verde ao vermelho, polpa branca e firme, sabor que varia do doce ao ácido.', fact: 'Existem mais de 7.500 variedades cultivadas. A mais consumida no Brasil é a Gala e Fuji. "An apple a day keeps the doctor away" — rica em fibras, vitamina C e polifenóis.', etymology: 'Do germânico "aplaz", palavra de origem pré-indo-europeia.' },
      en: { word: 'Apple', type: 'noun, fruit', def: 'Temperate-climate fruit from the apple tree (Malus domestica). Skin ranges from green to red, white firm flesh, flavor from sweet to tart.', fact: 'Over 7,500 cultivated varieties exist. Apples float in water because 25% of their volume is air. The largest producer is China. "Apple" in the Bible originally referred to any fruit.', etymology: 'From Proto-Germanic "aplaz", a pre-Indo-European loanword.' },
      es: { word: 'Manzana', type: 'sustantivo, fruta', def: 'Fruta de clima templado del manzano (Malus domestica). Piel de verde a roja, pulpa blanca y firme.', fact: 'Existen más de 7.500 variedades. Flotan en el agua porque el 25% de su volumen es aire. China es el mayor productor mundial.' }
    },

    'orange': {
      _aliases: ['laranja', 'naranja', 'orange'],
      pt: { word: 'Laranja', type: 'substantivo, fruta', def: 'Fruto cítrico da laranjeira (Citrus sinensis). Casca alaranjada, polpa suculenta e ácida-doce, rica em vitamina C. Híbrido antigo entre tangerina e pomelo.', fact: 'O Brasil é o maior produtor e exportador mundial de suco de laranja. O Brasil produz ~30% de toda laranja do mundo. Laranja-lima tem menos acidez; laranja-baía é sem sementes.', etymology: 'Do sânscrito "naranga" via árabe "naranj" e espanhol "naranja".' },
      en: { word: 'Orange', type: 'noun, fruit', def: 'Citrus fruit from the orange tree (Citrus sinensis). Orange skin, juicy sweet-tart flesh, rich in vitamin C. An ancient hybrid between mandarin and pomelo.', fact: "Brazil produces ~30% of the world's oranges. The color orange was named after the fruit (not vice versa). Navel oranges are seedless clones. The word appeared in English before the color name.", etymology: 'From Sanskrit "naranga" via Arabic "naranj" and Old French "orange".' },
      es: { word: 'Naranja', type: 'sustantivo, fruta', def: 'Fruto cítrico del naranjo (Citrus sinensis). Piel naranja, pulpa jugosa y dulce-ácida, rica en vitamina C. Híbrido antiguo entre mandarina y pomelo.', fact: 'Brasil produce ~30% de las naranjas mundiales. El color naranja recibió su nombre del fruto, no al revés.' }
    },

    'grape': {
      _aliases: ['uva', 'uvas', 'grape', 'grapes', 'uva'],
      pt: { word: 'Uva', type: 'substantivo, fruta', def: 'Fruta da videira (Vitis vinifera), cresce em cachos. Variedades: de mesa (consumo fresco) e viníferas (para vinho). Cores: verde/branca, vermelha/rosada, preta/azul.', fact: 'Uvas passas são uvas secas. Vinagre de vinho = aceto. O Brasil produz uva principalmente no RS (Serra Gaúcha). Resveratrol nas cascas escuras tem efeito antioxidante. Uvas são TÓXICAS para cães.', etymology: 'Do latim "uva", cognato de "úvula" (formato semelhante ao cacho).' },
      en: { word: 'Grape', type: 'noun, fruit', def: 'Fruit of the grapevine (Vitis vinifera), grows in clusters. Varieties: table grapes (fresh consumption) and wine grapes. Colors: green/white, red/pink, black/blue.', fact: 'Raisins are dried grapes. Resveratrol in dark grape skins has antioxidant effects. Grapes are TOXIC to dogs and cats. Wine has been made from grapes for at least 8,000 years.', etymology: 'From Old French "grape" (bunch of grapes), related to "grappe" (hook used to harvest).' },
      es: { word: 'Uva', type: 'sustantivo, fruta', def: 'Fruto de la vid (Vitis vinifera), crece en racimos. Variedades de mesa y viníferas. Colores: verde, roja, negra.', fact: 'Las pasas son uvas secas. El resveratrol en las pieles oscuras tiene efecto antioxidante. Las uvas son TÓXICAS para perros y gatos.' }
    },

    'mango': {
      _aliases: ['manga', 'mango'],
      pt: { word: 'Manga', type: 'substantivo, fruta', def: 'Fruta tropical da mangueira (Mangifera indica), originária do sul da Ásia. Polpa alaranjada, suculenta e doce, com caroço central grande e fibroso.', fact: 'A manga é a fruta tropical mais consumida no mundo. Rica em vitamina A (beta-caroteno), C e potássio. No Brasil as variedades Tommy Atkins, Haden e Palmer são mais comuns. Manga com leite: mito nutricional brasileiro sem base científica.', etymology: 'Do malaio "mangga" via português colonial (séc. XVI).' },
      en: { word: 'Mango', type: 'noun, fruit', def: 'Tropical fruit of the mango tree (Mangifera indica), originating from South Asia. Orange, juicy, sweet flesh with a large fibrous pit.', fact: 'The most consumed tropical fruit in the world. Rich in vitamin A (beta-carotene), C, and potassium. India produces ~40% of world supply. Mango is a member of the cashew family (Anacardiaceae).', etymology: 'From Malay "mangga" via Portuguese "manga" (16th century colonial trade).' },
      es: { word: 'Mango', type: 'sustantivo, fruta', def: 'Fruta tropical del mango (Mangifera indica), originario del sur de Asia. Pulpa anaranjada, jugosa y dulce con hueso grande.', fact: 'La fruta tropical más consumida del mundo. Rica en vitamina A, C y potasio. India produce ~40% del suministro mundial.' }
    },

    /* ── VEGETABLES ──────────────────────────── */
    'potato': {
      _aliases: ['batata', 'papa', 'potato', 'potatoes', 'batatas'],
      pt: { word: 'Batata', type: 'substantivo, tubérculo', def: 'Tubérculo da batata (Solanum tuberosum), da família das solanáceas. Cultivada para o amido armazenado no tubérculo subterrâneo. Originária dos Andes (Peru/Bolívia), domesticada há ~10.000 anos.', fact: 'O alimento mais importante da Europa por séculos. A Grande Fome da Irlanda (1845-1852) foi causada por praga na batata. Rica em potássio, vitamina C e B6. Uma batata média tem ~160 calorias.', etymology: 'Do espanhol "patata", fusão de "papa" (quéchua) e "batata" (taíno, nome do inhame doce).' },
      en: { word: 'Potato', type: 'noun, tuber', def: 'Tuber of the potato plant (Solanum tuberosum), in the nightshade family. Cultivated for the starch stored in the underground tuber. Originated in the Andes (Peru/Bolivia), domesticated ~10,000 years ago.', fact: "The 4th most important food crop in the world. The Irish Famine (1845-1852) was caused by potato blight. Rich in potassium, vitamin C, and B6. 'Couch potato' dates from 1976.", etymology: 'From Spanish "patata", a blend of "papa" (Quechua) and "batata" (Taíno name for sweet potato).' },
      es: { word: 'Papa / Patata', type: 'sustantivo, tubérculo', def: 'Tubérculo de la planta de papa (Solanum tuberosum), de la familia de las solanáceas. Originaria de los Andes, domesticada hace ~10.000 años.', fact: '4° cultivo alimentario más importante del mundo. La Gran Hambruna irlandesa (1845-1852) fue causada por una plaga en la papa. Rica en potasio y vitamina C.' }
    },

    'tomato': {
      _aliases: ['tomate', 'tomato', 'tomatoes', 'tomates'],
      pt: { word: 'Tomate', type: 'substantivo, fruta/vegetal', def: 'Fruto do tomateiro (Solanum lycopersicum). Botanicamente é uma fruta (estrutura formada pelo ovário), mas culinarmente tratado como vegetal. Vermelho quando maduro, rico em licopeno.', fact: 'O licopeno (pigmento vermelho) é um antioxidante associado à redução do risco de câncer de próstata. Tomate cozido tem mais licopeno disponível que cru. Originário das Américas, introduzido na Europa no séc. XVI. Era considerado venenoso na Europa por ser da família das solanáceas.', etymology: 'Do náuatl "tomatl" via espanhol colonial.' },
      en: { word: 'Tomato', type: 'noun, fruit/vegetable', def: 'Fruit of the tomato plant (Solanum lycopersicum). Botanically a fruit (formed from the ovary), but culinarily treated as a vegetable. Red when ripe, rich in lycopene.', fact: 'In 1893, the US Supreme Court ruled tomatoes are "vegetables" for tariff purposes. Lycopene (red pigment) is an antioxidant linked to reduced prostate cancer risk. Cooked tomatoes have more bioavailable lycopene than raw.', etymology: 'From Nahuatl "tomatl" via Spanish colonial trade (16th century).' },
      es: { word: 'Tomate', type: 'sustantivo, fruta/verdura', def: 'Fruto del tomate (Solanum lycopersicum). Botánicamente una fruta, culinariamente una verdura. Rojo cuando maduro, rico en licopeno.', fact: 'El licopeno (pigmento rojo) es un antioxidante asociado a la reducción del riesgo de cáncer de próstata. El tomate cocinado tiene más licopeno biodisponible que el crudo.' }
    },

    'carrot': {
      _aliases: ['cenoura', 'zanahoria', 'carrot', 'carrots'],
      pt: { word: 'Cenoura', type: 'substantivo, raiz', def: 'Raiz tuberosa da cenoura (Daucus carota). Tipicamente laranja (beta-caroteno), mas existe em roxo, branca e amarela. Da família Apiaceae, relacionada à salsinha e aipo.', fact: 'Rica em beta-caroteno (vitamina A), que melhora a visão — especialmente noturna. As cenouras eram originalmente roxas/brancas; as laranjas foram selecionadas na Holanda no séc. XVII em homenagem à Casa de Orange. O mito de que cenoura melhora visão além do normal é exagero — só corrige deficiência de vitamina A.', etymology: 'Do grego "karōton" via latim "carota".' },
      en: { word: 'Carrot', type: 'noun, root vegetable', def: 'Taproot of the carrot plant (Daucus carota). Typically orange (beta-carotene), but exists in purple, white, and yellow varieties. In the Apiaceae family, related to parsley and celery.', fact: 'Orange carrots were selectively bred in Holland in the 17th century in honor of the House of Orange. Originally carrots were purple and white. Beta-carotene only improves night vision if you have vitamin A deficiency — the "carrots improve vision" story was WWII British propaganda.', etymology: 'From Greek "karōton" via Latin "carota".' },
      es: { word: 'Zanahoria', type: 'sustantivo, raíz', def: 'Raíz tuberosa de la zanahoria (Daucus carota). Típicamente naranja (beta-caroteno), pero existe en violeta, blanca y amarilla.', fact: 'Las zanahorias naranjas fueron seleccionadas en Holanda en el s. XVII en honor a la Casa de Orange. El beta-caroteno mejora la visión solo si hay deficiencia de vitamina A.' }
    },

    /* ── MATERIALS / SUBSTANCES ──────────────── */
    'metal': {
      _aliases: ['metal', 'metals', 'metais'],
      pt: { word: 'Metal', type: 'substantivo, material', def: 'Elemento ou liga com propriedades características: brilho metálico, boa condutividade elétrica e térmica, maleabilidade, ductilidade. Na tabela periódica, ~80% dos elementos são metais.', fact: 'Ferro (Fe) é o metal mais usado na construção civil. Ouro (Au) não enferruja e é o metal mais maleável. Mercúrio (Hg) é o único metal líquido à temperatura ambiente. Ligas: aço (Fe+C), bronze (Cu+Sn), latão (Cu+Zn). Na Antiguidade, sete metais eram conhecidos: ouro, prata, cobre, ferro, mercúrio, estanho, chumbo.', etymology: 'Do grego "metallon" (mina, metal) via latim "metallum".' },
      en: { word: 'Metal', type: 'noun, material', def: 'Element or alloy with characteristic properties: metallic luster, good electrical and thermal conductivity, malleability, and ductility. About 80% of elements in the periodic table are metals.', fact: 'Mercury (Hg) is the only metal liquid at room temperature. Gold (Au) never rusts and is the most malleable metal. Gallium melts in your hand (melting point 29.8°C/85.6°F). Alloys: steel (Fe+C), bronze (Cu+Sn), brass (Cu+Zn).', etymology: 'From Greek "metallon" (mine, metal) via Latin "metallum".' },
      es: { word: 'Metal', type: 'sustantivo, material', def: 'Elemento o aleación con propiedades características: brillo metálico, buena conductividad eléctrica y térmica, maleabilidad y ductilidad. ~80% de los elementos de la tabla periódica son metales.', fact: 'El mercurio (Hg) es el único metal líquido a temperatura ambiente. El galio se derrite en la mano (punto de fusión 29,8°C). Aleaciones: acero (Fe+C), bronce (Cu+Sn), latón (Cu+Zn).' }
    },

    'wood': {
      _aliases: ['madeira', 'madera', 'wood', 'timber'],
      pt: { word: 'Madeira', type: 'substantivo, material', def: 'Material lenhoso obtido do tronco e galhos de árvores. Composto principalmente de celulose, hemicelulose e lignina. Material de construção, móveis e papel usado há milênios.', fact: 'A madeira mais dura do mundo é a Quebracho (Argentina). O bambu cresce até 91cm/dia — tecnicamente uma gramínea, não uma madeira. Madeira balsa é a mais leve comercialmente disponível. A Europa desmatou ~70% de suas florestas para construção naval nos sécs. XVII-XVIII.', etymology: 'Do latim "materia" (matéria, tronco de árvore) — mesma raiz de "matéria".' },
      en: { word: 'Wood', type: 'noun, material', def: 'Fibrous material from the trunk and branches of trees. Composed mainly of cellulose, hemicellulose, and lignin. Construction, furniture, and paper material used for millennia.', fact: 'The hardest wood is Quebracho (Argentina). Balsa is the lightest commercial wood. Wood is essentially a bundle of tubes (xylem) that transported water when the tree was alive. Ancient Viking ships used overlapping planks (clinker building) with no nails.', etymology: 'From Proto-Germanic "widu-" (forest, wood), related to Welsh "gwydd" (trees).' },
      es: { word: 'Madera', type: 'sustantivo, material', def: 'Material leñoso obtenido del tronco y ramas de los árboles. Compuesto de celulosa, hemicelulosa y lignina. Material de construcción, muebles y papel usado desde milenios.', fact: 'La madera más dura del mundo es el Quebracho (Argentina). El bambú crece hasta 91cm/día — técnicamente una gramínea, no una madera. La madera de balsa es la más liviana disponible comercialmente.' }
    },

    'glass': {
      _aliases: ['vidro', 'vidros', 'glass', 'verre'],
      pt: { word: 'Vidro', type: 'substantivo, material', def: 'Sólido amorfo (não cristalino) produzido principalmente pela fusão de sílica (SiO₂) com outros óxidos a altíssimas temperaturas. Transparente, frágil, impermeável e quimicamente inerte.', fact: 'O vidro não é um líquido super-lento (mito urbano) — as janelas medievais mais espessas na base foram assim fabricadas, não por fluir. Vidro pode ser reciclado infinitamente sem perda de qualidade. A obsidiana é um vidro vulcânico natural. Vidros de alta tecnologia: Gorilla Glass (celulares), fibra óptica, cristal de borossilicato (Pyrex).', etymology: 'Do latim "vitrum" (vidro, woad — planta azul), origem incerta.' },
      en: { word: 'Glass', type: 'noun, material', def: 'Amorphous (non-crystalline) solid produced mainly by melting silica (SiO₂) with other oxides at very high temperatures. Transparent, brittle, waterproof, and chemically inert.', fact: "Glass is NOT a slow-flowing liquid (urban myth) — medieval windows are thicker at the bottom because they were made that way, not from flowing. Glass can be recycled infinitely without quality loss. Obsidian is natural volcanic glass. Glass is so chemically stable it's used to store nuclear waste.", etymology: 'From Proto-Germanic "glasam", possibly related to "glow" (gleaming quality).' },
      es: { word: 'Vidrio', type: 'sustantivo, material', def: 'Sólido amorfo producido por la fusión de sílice (SiO₂) con otros óxidos. Transparente, frágil, impermeable y químicamente inerte.', fact: 'El vidrio NO es un líquido de flujo lento (mito urbano). Puede reciclarse infinitamente sin pérdida de calidad. La obsidiana es vidrio volcánico natural.' }
    },

    'iron': {
      _aliases: ['ferro', 'hierro', 'iron'],
      pt: { word: 'Ferro', type: 'substantivo, elemento/metal', def: 'Elemento químico Fe (número atômico 26). Metal de transição, cinza-prateado, magnético, maleável. O metal mais abundante na Terra por massa e o mais usado industrialmente.', fact: 'O núcleo da Terra é principalmente ferro. O sangue é vermelho pelo ferro na hemoglobina. A Torre Eiffel pesa 7.300 toneladas de ferro. Ferrugem = óxido de ferro (Fe₂O₃). Ferro meteorítico foi o primeiro ferro usado pelos humanos (~4.000 anos atrás).', etymology: 'Do latim "ferrum" — símbolo Fe e palavras como "ferragem", "ferreiro".' },
      en: { word: 'Iron', type: 'noun, element/metal', def: 'Chemical element Fe (atomic number 26). Transition metal, silver-gray, magnetic, malleable. The most abundant metal on Earth by mass and the most industrially used.', fact: "The Earth's core is mainly iron. Blood is red because of iron in hemoglobin. The Eiffel Tower weighs 7,300 tonnes of iron. Rust = iron oxide (Fe₂O₃). Meteoritic iron was the first iron used by humans (~4,000 years ago).", etymology: 'From Proto-Germanic "isarnan", possibly from Illyrian or Celtic "isarno" (holy metal).' },
      es: { word: 'Hierro', type: 'sustantivo, elemento/metal', def: 'Elemento químico Fe (número atómico 26). Metal de transición, magnético y maleable. El metal más abundante en la Tierra por masa y el más usado industrialmente.', fact: 'El núcleo de la Tierra es principalmente hierro. La sangre es roja por el hierro en la hemoglobina. La Torre Eiffel pesa 7.300 toneladas de hierro. Herrumbre = óxido de hierro (Fe₂O₃).' }
    },

    'water': {
      _aliases: ['água', 'agua', 'water'],
      pt: { word: 'Água', type: 'substantivo, substância', def: 'Composto químico H₂O — duas moléculas de hidrogênio ligadas a um oxigênio. Líquido incolor, inodoro e insípido nas condições normais. Cobre ~71% da superfície terrestre e é essencial para toda forma de vida conhecida.', fact: '97,5% da água da Terra é salgada; 2,5% doce (70% em geleiras). O corpo humano é ~60% água. Água é o único composto que existe naturalmente nos 3 estados (sólido/líquido/gasoso) na superfície terrestre. Água expande ao congelar — propriedade única que permite a existência de vida nos oceanos (o gelo flutua).', etymology: 'Do proto-germânico "watōr" — cognato do latim "unda" (onda).' },
      en: { word: 'Water', type: 'noun, substance', def: 'Chemical compound H₂O — two hydrogen atoms bonded to one oxygen. Colorless, odorless, tasteless liquid under normal conditions. Covers ~71% of Earth\'s surface and is essential to all known life.', fact: "97.5% of Earth's water is salt water; 2.5% fresh (70% in glaciers). The human body is ~60% water. Water is the only compound that naturally exists in all 3 states on Earth's surface. Ice floats — this unusual property allows life in frozen oceans.", etymology: "From Proto-Germanic 'watōr', related to Greek 'hydōr' (hydro-)." },
      es: { word: 'Agua', type: 'sustantivo, sustancia', def: 'Compuesto químico H₂O — dos átomos de hidrógeno unidos a un oxígeno. Líquido incoloro, inodoro e insípido. Cubre ~71% de la superficie terrestre y es esencial para toda forma de vida.', fact: 'El 97,5% del agua terrestre es salada; el 2,5% es dulce (70% en glaciares). El cuerpo humano es ~60% agua. El agua es el único compuesto que existe naturalmente en los 3 estados en la superficie terrestre.' }
    },

    /* ── ANIMALS ─────────────────────────────── */
    'cat': {
      _aliases: ['gato', 'gatos', 'cat', 'cats', 'felino'],
      pt: { word: 'Gato', type: 'substantivo, animal', def: 'Mamífero doméstico felino (Felis catus), da família Felidae. Carnívoro obrigatório, predador noturno. Domesticado há ~10.000 anos no Oriente Médio a partir do gato selvagem africano.', fact: 'Gatos dormem 12–16 horas por dia. Possuem 32 músculos em cada orelha. Podem girar as orelhas 180°. O ronronar ocorre em frequências de 25–150 Hz, que aceleram a cicatrização óssea. Eram sagrados no Egito Antigo (deusa Bastet). Um gato chamado Félicette foi o primeiro a ir ao espaço (1963, França).', etymology: 'Do latim tardio "cattus" (séc. V d.C.) — origem incerta, possivelmente do berbere ou nubiano.' },
      en: { word: 'Cat', type: 'noun, animal', def: 'Domestic mammal (Felis catus) of the Felidae family. Obligate carnivore, nocturnal predator. Domesticated ~10,000 years ago in the Middle East from the African wildcat.', fact: "Cats sleep 12–16 hours/day. They have 32 muscles in each ear. Purring occurs at 25–150 Hz frequencies that may accelerate bone healing. Cats can't taste sweetness. Their collarbones float freely, allowing them to squeeze through any space as wide as their head.", etymology: 'From Late Latin "cattus" (5th century) — possibly from Berber or Nubian.' },
      es: { word: 'Gato', type: 'sustantivo, animal', def: 'Mamífero doméstico felino (Felis catus). Carnívoro obligado, depredador nocturno. Domesticado hace ~10.000 años en el Oriente Medio a partir del gato montés africano.', fact: 'Los gatos duermen 12-16 horas/día. Tienen 32 músculos en cada oreja. El ronroneo ocurre a 25-150 Hz y puede acelerar la curación ósea. Los gatos no pueden saborear lo dulce.' }
    },

    'dog': {
      _aliases: ['cachorro', 'cão', 'perro', 'dog', 'dogs', 'cães', 'cachorros'],
      pt: { word: 'Cachorro / Cão', type: 'substantivo, animal', def: 'Mamífero doméstico (Canis lupus familiaris), subespécie do lobo cinzento. O primeiro animal domesticado, há 15.000–40.000 anos. Mais de 340 raças reconhecidas.', fact: 'O nariz de um cão tem 300 milhões de receptores olfativos (humanos têm 6 milhões). Podem detectar certas doenças (câncer, hipoglicemia). O coração bate 60–140 bpm. Cães "lêem" emoções humanas — área do cérebro especializada nisso. O Border Collie é considerado o mais inteligente. Cães e humanos liberaram ocitocina (hormônio do vínculo) ao se olhar nos olhos.', etymology: 'A palavra "cachorro" vem de "cachorrus" (latim medieval), origem desconhecida.' },
      en: { word: 'Dog', type: 'noun, animal', def: 'Domestic mammal (Canis lupus familiaris), subspecies of the grey wolf. The first domesticated animal, 15,000–40,000 years ago. Over 340 recognized breeds worldwide.', fact: "Dogs have 300 million olfactory receptors (humans have 6 million). They can detect certain diseases (cancer, low blood sugar). Dogs and humans release oxytocin when making eye contact. The Border Collie is considered the most intelligent breed. Dogs dream during REM sleep.", etymology: 'Origin unknown — "dog" replaced "hound" in English around the 16th century.' },
      es: { word: 'Perro', type: 'sustantivo, animal', def: 'Mamífero doméstico (Canis lupus familiaris), subespecie del lobo gris. El primer animal domesticado, hace 15.000–40.000 años. Más de 340 razas reconocidas.', fact: 'Los perros tienen 300 millones de receptores olfativos (los humanos tienen 6 millones). Pueden detectar ciertas enfermedades. Los perros y los humanos liberan oxitocina al mirarse a los ojos.' }
    },

    'bird': {
      _aliases: ['pássaro', 'ave', 'pájaro', 'bird', 'birds', 'aves'],
      pt: { word: 'Pássaro / Ave', type: 'substantivo, animal', def: 'Vertebrado da classe Aves, caracterizado por penas, bico córneo, membros anteriores modificados em asas, ossos pneumáticos (ocos) e sangue quente. ~10.000 espécies viventes.', fact: 'As aves são dinossauros — descendentes diretos dos terópodes. O avestruz é a maior ave viva (2,7m, 156kg) e corre a 70km/h mas não voa. O beija-flor pode voar para trás. O Pombo-correio foi fundamental nas guerras mundiais. O coração de uma ave bate 400–1.000 vezes por minuto.', etymology: 'Do latim "avis" — origem de aviação, aviário.' },
      en: { word: 'Bird', type: 'noun, animal', def: 'Vertebrate of class Aves, characterized by feathers, a beak, wings, hollow bones, and warm blood. ~10,000 living species.', fact: "Birds ARE dinosaurs — direct descendants of theropods. The Arctic Tern migrates ~96,000 km/year (Earth's circumference). Hummingbirds are the only birds that can fly backwards. A bird's heart beats 400–1,000 times/minute. Crows can recognize human faces and hold grudges.", etymology: 'From Old English "brid" (young bird, chick) — the modern meaning generalized over time.' },
      es: { word: 'Pájaro / Ave', type: 'sustantivo, animal', def: 'Vertebrado de la clase Aves, caracterizado por plumas, pico, alas, huesos huecos y sangre caliente. ~10.000 especies vivientes.', fact: 'Las aves SON dinosaurios — descendientes directos de los terópodos. El corazón de un ave late 400-1.000 veces/minuto. Los cuervos pueden reconocer caras humanas y guardar rencor.' }
    },

    'fish': {
      _aliases: ['peixe', 'pez', 'fish', 'peixes', 'peces'],
      pt: { word: 'Peixe', type: 'substantivo, animal', def: 'Vertebrado aquático, geralmente ectotérmico (sangue frio), com guelras para respiração, nadadeiras para locomoção e escamas. ~34.000 espécies conhecidas — mais que todos os outros vertebrados combinados.', fact: 'Peixes pulmões (Dipnoi) conseguem respirar ar e sobreviver em barro seco. O peixe-boi (Rhincodon typus) é o maior peixe vivo (18m). Peixes não "afogam" — morrem por falta de oxigênio dissolvido. O peixe-palhaço muda de sexo: o macho dominante vira fêmea.', etymology: 'Do latim "piscem" (acusativo de "piscis") — origem de Peixes (signo), piscicultura.' },
      en: { word: 'Fish', type: 'noun, animal', def: 'Aquatic vertebrate, generally ectothermic (cold-blooded), with gills, fins, and scales. ~34,000 known species — more than all other vertebrates combined.', fact: "The whale shark is the largest fish (18m). Clownfish change sex — the dominant male becomes female. Goldfish have a memory longer than 3 seconds (another urban myth debunked). The coelacanth was thought extinct for 65 million years until rediscovered in 1938.", etymology: 'From Proto-Germanic "fiskaz", related to Latin "piscis" (astronomy: Pisces).' },
      es: { word: 'Pez', type: 'sustantivo, animal', def: 'Vertebrado acuático, generalmente ectotérmico (sangre fría), con branquias, aletas y escamas. ~34.000 especies conocidas — más que todos los demás vertebrados juntos.', fact: 'El tiburón ballena es el pez más grande (18m). El pez payaso cambia de sexo — el macho dominante se vuelve hembra. Los peces dorados tienen una memoria de más de 3 segundos (mito urbano desmentido).' }
    },

    /* ── NATURE / ELEMENTS ───────────────────── */
    'fire': {
      _aliases: ['fogo', 'fuego', 'fire'],
      pt: { word: 'Fogo', type: 'substantivo, fenômeno', def: 'Reação química de oxidação rápida (combustão) que libera calor, luz e gases. Não é um estado da matéria — é um processo. Requer três componentes: combustível, comburente (O₂) e fonte de calor (triângulo do fogo).', fact: 'O fogo foi controlado pelo Homo erectus há ~1,5 milhão de anos — a maior mudança na história humana. As chamas são plasma (4° estado da matéria) apenas parcialmente. O azul é a parte mais quente da chama (>1500°C). O fogo não existe no espaço (sem gravidade, não há convecção para alimentar a chama).', etymology: 'Do proto-germânico "fōr" — cognato do grego "pyr" (pirômano, pirâmide).' },
      en: { word: 'Fire', type: 'noun, phenomenon', def: 'Rapid chemical oxidation reaction (combustion) releasing heat, light, and gases. Not a state of matter — it\'s a process. Requires three components: fuel, oxidizer (O₂), and heat source (fire triangle).', fact: 'Fire was controlled by Homo erectus ~1.5 million years ago — the most transformative event in human history. Flames are NOT plasma (mostly hot gas). Blue is the hottest part of a flame (>1,500°C). Fire cannot exist in zero gravity (no convection to feed it).', etymology: 'From Proto-Germanic "fōr", cognate with Greek "pyr" (pyro-, pyramid).' },
      es: { word: 'Fuego', type: 'sustantivo, fenómeno', def: 'Reacción química de oxidación rápida (combustión) que libera calor, luz y gases. No es un estado de la materia — es un proceso. Requiere combustible, comburente (O₂) y calor (triángulo del fuego).', fact: 'El fuego fue controlado por el Homo erectus hace ~1,5 millones de años. El azul es la parte más caliente de la llama (>1.500°C). El fuego no puede existir en gravedad cero.' }
    },

    'sun': {
      _aliases: ['sol', 'sun'],
      pt: { word: 'Sol', type: 'substantivo, astronomia', def: 'Estrela do tipo G2V no centro do Sistema Solar. Esfera de plasma com fusão nuclear no núcleo (H→He), liberando enormes quantidades de energia. Diâmetro: 1.392.000 km (109× a Terra). Massa: 99,86% de todo o Sistema Solar.', fact: 'A luz solar leva 8 min 20s para chegar à Terra. O Sol converterá 620 milhões de toneladas de hidrogênio em hélio por segundo. Em ~5 bilhões de anos se tornará uma gigante vermelha. Manchas solares são regiões mais frias (4.000°C vs 5.500°C da superfície). O Sol é mais de 4,6 bilhões de anos — na metade de sua vida.', etymology: 'Do latim "sol, solis" — origem do sistema solar, solstício, girassol.' },
      en: { word: 'Sun', type: 'noun, astronomy', def: 'G2V type star at the center of the Solar System. Plasma sphere with nuclear fusion in the core (H→He), releasing enormous energy. Diameter: 1,392,000 km (109× Earth). Mass: 99.86% of the entire Solar System.', fact: 'Sunlight takes 8 min 20s to reach Earth. The Sun converts 620 million tons of hydrogen to helium per second. In ~5 billion years it will become a red giant. Sunspots are cooler regions (4,000°C vs 5,500°C surface). The Sun is 4.6 billion years old — halfway through its life.', etymology: 'From Proto-Indo-European "sāwel" — related to Latin "sol", Greek "helios".' },
      es: { word: 'Sol', type: 'sustantivo, astronomía', def: 'Estrella tipo G2V en el centro del Sistema Solar. Esfera de plasma con fusión nuclear en el núcleo (H→He). Diámetro: 1.392.000 km (109× la Tierra). Masa: 99,86% del Sistema Solar.', fact: 'La luz solar tarda 8 min 20s en llegar a la Tierra. El Sol convierte 620 millones de toneladas de hidrógeno en helio por segundo. En ~5.000 millones de años se convertirá en una gigante roja.' }
    },

    'moon': {
      _aliases: ['lua', 'luna', 'moon'],
      pt: { word: 'Lua', type: 'substantivo, astronomia', def: 'Único satélite natural da Terra, com diâmetro de 3.474 km (~1/4 da Terra). Sem atmosfera, sem campo magnético global, sem vida. Orbita a Terra a ~384.000 km em 27,3 dias.', fact: 'A Lua se afasta da Terra ~3,8 cm por ano. O mesmo lado sempre está voltado para a Terra (rotação síncrona). Influencia as marés oceânicas. Formou-se há 4,5 bilhões de anos — provavelmente pela colisão da Terra com um objeto do tamanho de Marte (Theia). O astronauta Neil Armstrong pisou na Lua em 20/07/1969.', etymology: 'Do latim "luna" — origem de lunar, lunático (superstição de que a lua influenciava a mente).' },
      en: { word: 'Moon', type: 'noun, astronomy', def: "Earth's only natural satellite, diameter 3,474 km (~1/4 of Earth). No atmosphere, no global magnetic field, no life. Orbits Earth at ~384,000 km every 27.3 days.", fact: "The Moon recedes from Earth ~3.8 cm/year. The same side always faces Earth (synchronous rotation). Tides are caused mainly by the Moon's gravity. It formed 4.5 billion years ago from the collision of Earth with a Mars-sized object (Theia). Neil Armstrong stepped on the Moon on July 20, 1969.", etymology: 'From Proto-Germanic "mēnô", related to "month" — both track the lunar cycle.' },
      es: { word: 'Luna', type: 'sustantivo, astronomía', def: 'Único satélite natural de la Tierra, con diámetro de 3.474 km (~1/4 de la Tierra). Sin atmósfera ni vida. Orbita la Tierra a ~384.000 km cada 27,3 días.', fact: 'La Luna se aleja de la Tierra ~3,8 cm/año. El mismo lado siempre está orientado hacia la Tierra (rotación síncrona). Neil Armstrong pisó la Luna el 20/07/1969.' }
    },

    /* ── BODY PARTS ──────────────────────────── */
    'brain': {
      _aliases: ['cérebro', 'cerebro', 'brain'],
      pt: { word: 'Cérebro', type: 'substantivo, anatomia', def: 'Principal estrutura do encéfalo dos vertebrados. Centro de processamento de informações, memória, emoções, pensamento e controle motor voluntário. Pesa ~1.400g nos adultos — 2% do peso corporal mas consome 20% da energia.', fact: 'O cérebro humano tem ~86 bilhões de neurônios e ~100 trilhões de sinapses. Não tem receptores de dor (cirurgia cerebral pode ser feita com o paciente acordado). O cérebro continua a se desenvolver até os 25 anos. Mito: "usamos apenas 10% do cérebro" — falso, todas as áreas têm funções e são ativas.', etymology: 'Do latim "cerebrum" — origem de cerebral, cerebrospinal.' },
      en: { word: 'Brain', type: 'noun, anatomy', def: 'Main structure of the vertebrate encephalon. Center for information processing, memory, emotions, thought, and voluntary motor control. Weighs ~1,400g in adults — 2% of body weight but consumes 20% of energy.', fact: "The human brain has ~86 billion neurons and ~100 trillion synapses. The brain has no pain receptors (brain surgery can be done while the patient is awake). Myth: 'We only use 10% of the brain' — false, all areas are active and have functions. The brain generates about 23 watts of power.", etymology: 'From Old English "brægen", from Proto-Germanic "bragnam".' },
      es: { word: 'Cerebro', type: 'sustantivo, anatomía', def: 'Principal estructura del encéfalo de los vertebrados. Centro de procesamiento de información, memoria, emociones y control motor. Pesa ~1.400g — 2% del peso corporal pero consume el 20% de la energía.', fact: 'El cerebro humano tiene ~86.000 millones de neuronas y ~100 billones de sinapsis. No tiene receptores del dolor. Mito: "solo usamos el 10% del cerebro" — falso, todas las áreas tienen funciones.' }
    },

    'heart': {
      _aliases: ['coração', 'corazón', 'heart'],
      pt: { word: 'Coração', type: 'substantivo, anatomia', def: 'Órgão muscular oco situado no tórax (mediastino), entre os pulmões. Bomba dupla: lado direito para o pulmão (circulação pulmonar), lado esquerdo para o corpo (circulação sistêmica). 4 câmaras: 2 átrios + 2 ventrículos.', fact: 'Bate ~100.000 vezes/dia, ~35 milhões/ano, ~2,5 bilhões em uma vida. Bombeia ~5 litros de sangue por minuto. O coração pode continuar batendo fora do corpo se tiver oxigênio (por isso transplantes são possíveis). A octópode tem 3 corações.', etymology: 'Do latim "cor, cordis" — origem de cordial, acordar, córdoba.' },
      en: { word: 'Heart', type: 'noun, anatomy', def: 'Hollow muscular organ in the chest (mediastinum), between the lungs. Dual pump: right side to lungs (pulmonary circulation), left side to body (systemic circulation). 4 chambers: 2 atria + 2 ventricles.', fact: 'Beats ~100,000 times/day, ~35 million/year, ~2.5 billion in a lifetime. Pumps ~5 liters/minute. The heart can continue beating outside the body if oxygenated (why transplants work). Octopuses have 3 hearts. A broken heart is medically real: Takotsubo syndrome (stress cardiomyopathy).', etymology: 'From Proto-Germanic "hertô", from PIE "kerd-" (heart) — same root as cardiac, accord, courage.' },
      es: { word: 'Corazón', type: 'sustantivo, anatomía', def: 'Órgano muscular hueco en el tórax. Bomba doble: lado derecho para los pulmones, izquierdo para el cuerpo. 4 cámaras: 2 aurículas + 2 ventrículos.', fact: 'Late ~100.000 veces/día, ~2.500 millones en una vida. Bombea ~5 litros/minuto. El "corazón roto" es médicamente real: síndrome de Takotsubo. Los pulpos tienen 3 corazones.' }
    },

    /* ── EVERYDAY OBJECTS ────────────────────── */
    'book': {
      _aliases: ['livro', 'libro', 'book', 'livros', 'libros'],
      pt: { word: 'Livro', type: 'substantivo, objeto', def: 'Conjunto de páginas escritas, impressas ou em branco, encadernadas formando um volume. O formato moderno (codex) surgiu no séc. I d.C., substituindo o rolo de papiro.', fact: 'A Bíblia é o livro mais vendido da história (~5 bilhões de cópias). A prensa de Gutenberg (~1440) democratizou a leitura. O cheiro de livros antigos (bibliosmia) é causado por compostos orgânicos voláteis da degradação do papel. São publicados ~2 milhões de livros/ano no mundo.', etymology: 'Do proto-germânico "bōkō" (faia) — os primeiros textos germânicos eram em tábuas de faia.' },
      en: { word: 'Book', type: 'noun, object', def: 'Set of written, printed, or blank pages fastened together forming a volume. The modern format (codex) appeared in the 1st century AD, replacing the papyrus scroll.', fact: "The Bible is history's best-selling book (~5 billion copies). Gutenberg's printing press (~1440) democratized reading. The smell of old books (bibliosmia) comes from organic compounds from paper degradation. ~2 million books are published per year worldwide.", etymology: 'From Proto-Germanic "bōkō" (beech tree) — early Germanic texts were carved on beech tablets.' },
      es: { word: 'Libro', type: 'sustantivo, objeto', def: 'Conjunto de páginas escritas o impresas, encuadernadas formando un volumen. El formato moderno (códice) surgió en el s. I d.C., reemplazando al rollo de papiro.', fact: 'La Biblia es el libro más vendido de la historia (~5.000 millones de copias). La imprenta de Gutenberg (~1440) democratizó la lectura. Se publican ~2 millones de libros/año en el mundo.' }
    },

    'phone': {
      _aliases: ['celular', 'telefone', 'teléfono', 'phone', 'smartphone', 'móvel'],
      pt: { word: 'Celular / Smartphone', type: 'substantivo, tecnologia', def: 'Dispositivo eletrônico portátil que combina telefone, computador, câmera e acesso à internet em um único aparelho. O smartphone moderno surgiu com o iPhone (Apple, 2007).', fact: 'Existem mais celulares ativos no mundo (~8 bilhões) que pessoas. O processador de um smartphone moderno é mais poderoso que computadores que enviaram a Apollo 11 à Lua. A bateria de íon de lítio (padrão atual) foi desenvolvida por John Goodenough, Stanley Whittingham e Akira Yoshino (Prêmio Nobel 2019).', etymology: '"Celular" refere-se à rede celular (dividida em células geográficas). "Telefone" do grego "tele" (longe) + "phōnē" (voz).' },
      en: { word: 'Smartphone / Phone', type: 'noun, technology', def: 'Portable electronic device combining telephone, computer, camera, and internet access in one device. The modern smartphone emerged with the iPhone (Apple, 2007).', fact: 'There are more active phones (~8 billion) than people on Earth. A modern smartphone processor is more powerful than computers that sent Apollo 11 to the Moon. The lithium-ion battery was developed by Goodenough, Whittingham, and Yoshino (Nobel Prize 2019). Average screen time: 4–7 hours/day globally.', etymology: '"Phone" from Greek "tele" (far) + "phōnē" (voice). "Cell" refers to the cellular network grid.' },
      es: { word: 'Celular / Teléfono', type: 'sustantivo, tecnología', def: 'Dispositivo electrónico portátil que combina teléfono, computadora, cámara y acceso a internet. El smartphone moderno surgió con el iPhone (Apple, 2007).', fact: 'Hay más celulares activos (~8.000 millones) que personas en la Tierra. Un smartphone moderno es más potente que las computadoras que enviaron el Apolo 11 a la Luna.' }
    },

    'computer': {
      _aliases: ['computador', 'computadora', 'computer', 'computadores', 'pc'],
      pt: { word: 'Computador', type: 'substantivo, tecnologia', def: 'Máquina eletrônica capaz de receber, processar, armazenar e transmitir informações de acordo com instruções (programa). Componentes: CPU (processamento), memória RAM (temporária), armazenamento (HD/SSD), entrada/saída.', fact: 'ENIAC (1945) pesava 30 toneladas. Um iPhone moderno tem ~1 trilhão de vezes mais processamento. Lei de Moore: transistores em chips dobram a cada ~2 anos (desde 1965). O primeiro bug de computador foi uma mariposa real encontrada em relés do computador Mark II (1947, Grace Hopper).', etymology: 'Do latim "computare" (calcular) — antes de máquinas, "computer" era uma pessoa que fazia cálculos.' },
      en: { word: 'Computer', type: 'noun, technology', def: 'Electronic machine capable of receiving, processing, storing, and transmitting information according to instructions (program). Components: CPU (processing), RAM (temporary memory), storage (HDD/SSD), input/output.', fact: "ENIAC (1945) weighed 30 tonnes. A modern iPhone has ~1 trillion times more computing power. Moore's Law: transistors on chips double every ~2 years (since 1965). The first computer bug was an actual moth found in Mark II relays in 1947 (coined by Grace Hopper).", etymology: 'From Latin "computare" (to calculate). Before machines, a "computer" was a person who did calculations.' },
      es: { word: 'Computadora', type: 'sustantivo, tecnología', def: 'Máquina electrónica que recibe, procesa, almacena y transmite información según instrucciones (programa). Componentes: CPU, RAM, almacenamiento, entrada/salida.', fact: 'La ENIAC (1945) pesaba 30 toneladas. Un iPhone moderno tiene ~1 billón de veces más potencia. Ley de Moore: los transistores en chips se duplican cada ~2 años. El primer bug fue una polilla real encontrada en el Mark II (1947).' }
    },

    /* ── COLORS ──────────────────────────────── */
    'blue': {
      _aliases: ['azul', 'blue'],
      pt: { word: 'Azul', type: 'substantivo/adjetivo, cor', def: 'Cor na faixa 450–495 nm do espectro visível, entre o violeta e o verde. Percebida quando objetos absorvem comprimentos de onda mais longos e refletem os curtos.', fact: 'O céu é azul por espalhamento Rayleigh — moléculas do ar dispersam mais a luz de comprimento de onda curto (azul). O oceano é azul pela mesma razão + absorção. Muitas culturas antigas não tinham palavra para azul (Homero não descreveu o mar como azul). O índigo/anil foi uma das especiarias mais valiosas da Rota da Seda.', etymology: 'Do germânico "blao" via francês antigo "bleu". Em português, do germânico via invasões.' },
      en: { word: 'Blue', type: 'noun/adjective, color', def: 'Color in the 450–495 nm range of the visible spectrum, between violet and green. Perceived when objects absorb longer wavelengths and reflect short ones.', fact: "The sky is blue due to Rayleigh scattering — air molecules scatter shorter wavelengths (blue) more. Many ancient cultures had no word for blue (Homer never described the sea as blue). Blue is the world's most popular favorite color. The first blue pigment available to Europeans was ultramarine, made from lapis lazuli.", etymology: 'From Proto-Germanic "blēwaz" via Old French "bleu".' },
      es: { word: 'Azul', type: 'sustantivo/adjetivo, color', def: 'Color en el rango 450–495 nm del espectro visible, entre el violeta y el verde.', fact: 'El cielo es azul por dispersión de Rayleigh. Muchas culturas antiguas no tenían palabra para el azul (Homero no describió el mar como azul). El azul es el color favorito más popular del mundo.' }
    },

    /* ── EMOTIONS / ABSTRACTS ────────────────── */
    'love': {
      _aliases: ['amor', 'love', 'amar'],
      pt: { word: 'Amor', type: 'substantivo, emoção', def: 'Sentimento intenso de afeição, apego e bem-querer por outra pessoa, ser vivo ou objeto. Inclui componentes emocionais, cognitivos e comportamentais. Na neurociência, envolve dopamina, serotonina, ocitocina e vasopressina.', fact: 'Helen Fisher (antropóloga) identificou 3 sistemas cerebrais do amor: desejo (testosterona/estrogênio), atração (dopamina/noradrenalina) e apego (ocitocina/vasopressina). O coração partido existe medicamente — síndrome de Takotsubo. Em grego havia 8 tipos de amor: Eros, Philia, Storge, Agape, Ludus, Pragma, Philautia, Mania.', etymology: 'Do latim "amor" — da raiz *am- (amar), presente em amar, amigo, amável.' },
      en: { word: 'Love', type: 'noun, emotion', def: 'Intense feeling of affection, attachment, and care for another person, living being, or object. Involves emotional, cognitive, and behavioral components. In neuroscience, involves dopamine, serotonin, oxytocin, and vasopressin.', fact: 'Helen Fisher (anthropologist) identified 3 brain systems of love: lust (testosterone/estrogen), attraction (dopamine/noradrenaline), attachment (oxytocin/vasopressin). Ancient Greeks had 8 words for love: Eros, Philia, Storge, Agape, Ludus, Pragma, Philautia, Mania. "Love" and "believe" share the same Proto-Indo-European root.', etymology: 'From Proto-Germanic "lubō", from PIE "leubh-" (to care, desire).' },
      es: { word: 'Amor', type: 'sustantivo, emoción', def: 'Sentimiento intenso de afecto, apego y cariño. Implica componentes emocionales, cognitivos y conductuales. Involucra dopamina, serotonina, oxitocina y vasopresina.', fact: 'Helen Fisher identificó 3 sistemas cerebrales del amor: deseo, atracción y apego. Los griegos tenían 8 palabras para el amor: Eros, Philia, Storge, Agape, Ludus, Pragma, Philautia, Mania.' }
    },

    'happiness': {
      _aliases: ['felicidade', 'felicidad', 'happiness', 'alegria', 'alegría'],
      pt: { word: 'Felicidade', type: 'substantivo, emoção/estado', def: 'Estado de bem-estar e satisfação subjetiva. Na psicologia, distingue-se: hedônica (prazer, ausência de sofrimento) e eudaimônica (florescimento, propósito). Influenciada por fatores genéticos (~50%), circunstanciais (~10%) e voluntários (~40%).', fact: 'O Butão mede o "Produto Interno Bruto da Felicidade" como indicador nacional. Os países mais felizes: Finlândia, Dinamarca, Islândia (relatório ONU). A ciência mostra que felicidade acima de ~US$75k/ano não aumenta significativamente com mais dinheiro (Kahneman, 2010 — revisado para ~US$500k em 2021). Expressar gratidão aumenta bem-estar mensuravelmente.', etymology: 'Do latim "felicitas" — de "felix" (fértil, feliz, auspicioso).' },
      en: { word: 'Happiness', type: 'noun, emotion/state', def: 'State of subjective well-being and satisfaction. In psychology: hedonic (pleasure, absence of suffering) vs. eudaimonic (flourishing, purpose). Influenced by genetics (~50%), circumstances (~10%), and voluntary actions (~40%).', fact: 'Bhutan measures Gross National Happiness as a national indicator. The happiest countries: Finland, Denmark, Iceland (UN report). Money and happiness: significant up to ~$75k/year (Kahneman 2010) — revised higher in 2021. Gratitude expression measurably increases well-being.', etymology: 'From "hap" (luck, chance) in Old Norse "happ" — happiness originally meant good fortune.' },
      es: { word: 'Felicidad', type: 'sustantivo, emoción/estado', def: 'Estado de bienestar y satisfacción subjetiva. Hedónica (placer) vs. eudaimónica (florecimiento, propósito). Influenciada por genética (~50%), circunstancias (~10%) y acciones voluntarias (~40%).', fact: 'Bután mide el Producto Nacional Bruto de la Felicidad. Los países más felices: Finlandia, Dinamarca, Islandia. Expresar gratitud aumenta mensurablemente el bienestar.' }
    },

    /* ── COMMON SCIENCE TERMS ────────────────── */
    'atom': {
      _aliases: ['átomo', 'átom', 'atom', 'átomos', 'atoms'],
      pt: { word: 'Átomo', type: 'substantivo, física/química', def: 'Unidade básica da matéria. Composto de núcleo (prótons + nêutrons) circundado por elétrons em orbitais. O menor fragmento de um elemento que mantém suas propriedades químicas.', fact: 'Átomos são 99,9999999% espaço vazio. O raio do núcleo é ~100.000× menor que o átomo inteiro. Se o núcleo fosse do tamanho de uma laranja, o átomo seria do tamanho de um estádio. Todos os átomos de carbono no seu corpo foram forjados em estrelas (você é literalmente poeira de estrelas).', etymology: 'Do grego "atomos" (indivisível) — Demócrito (~460 a.C.) propôs que a matéria seria feita de unidades indivisíveis.' },
      en: { word: 'Atom', type: 'noun, physics/chemistry', def: 'Basic unit of matter. Composed of a nucleus (protons + neutrons) surrounded by electrons in orbitals. The smallest fragment of an element that retains its chemical properties.', fact: "Atoms are 99.9999999% empty space. If the nucleus were the size of a marble, the atom would be the size of a football stadium. All carbon atoms in your body were forged in stars (you are literally stardust — Carl Sagan). The word 'atom' is ironic — atoms ARE divisible (into protons, neutrons, electrons, and quarks).", etymology: 'From Greek "atomos" (indivisible) — Democritus (~460 BCE) proposed matter was made of indivisible units.' },
      es: { word: 'Átomo', type: 'sustantivo, física/química', def: 'Unidad básica de la materia. Compuesto por un núcleo (protones + neutrones) rodeado de electrones. El fragmento más pequeño de un elemento que conserva sus propiedades químicas.', fact: 'Los átomos son 99,9999999% espacio vacío. Si el núcleo fuera del tamaño de una canica, el átomo sería del tamaño de un estadio de fútbol. Todos los átomos de carbono de tu cuerpo fueron forjados en estrellas.' }
    },

    'energy': {
      _aliases: ['energia', 'energía', 'energy'],
      pt: { word: 'Energia', type: 'substantivo, física', def: 'Capacidade de realizar trabalho ou transferir calor. Não se cria nem se destrói, apenas se transforma (1ª lei da termodinâmica). Formas: cinética (movimento), potencial (posição), térmica, química, elétrica, nuclear, radiante.', fact: 'E=mc² (Einstein): massa e energia são equivalentes — 1 grama de matéria equivale a 90 trilhões de Joules. O Sol irradia 3,8×10²⁶ Watts. O corpo humano gasta ~2.000 kcal/dia em repouso. A maior usina de energia do mundo é a hidrelétrica de Três Gargantas (China, 22.500 MW).', etymology: 'Do grego "energeia" (atividade, operação) — de "en" (em) + "ergon" (trabalho). Aristoteles usou o termo.' },
      en: { word: 'Energy', type: 'noun, physics', def: "Capacity to do work or transfer heat. Can't be created or destroyed, only transformed (1st law of thermodynamics). Forms: kinetic (motion), potential (position), thermal, chemical, electrical, nuclear, radiant.", fact: 'E=mc² (Einstein): mass and energy are equivalent — 1 gram of matter equals 90 trillion Joules. The Sun radiates 3.8×10²⁶ Watts. The human body uses ~2,000 kcal/day at rest. The world\'s largest power plant is Three Gorges Dam, China (22,500 MW).', etymology: 'From Greek "energeia" (activity, operation) — "en" (in) + "ergon" (work). First used philosophically by Aristotle.' },
      es: { word: 'Energía', type: 'sustantivo, física', def: 'Capacidad de realizar trabajo o transferir calor. No se crea ni se destruye, solo se transforma (1ª ley de la termodinámica). Formas: cinética, potencial, térmica, química, eléctrica, nuclear, radiante.', fact: 'E=mc² (Einstein): masa y energía son equivalentes — 1 gramo de materia equivale a 90 billones de Julios. El Sol irradia 3,8×10²⁶ vatios. La mayor central eléctrica del mundo es la presa de las Tres Gargantas, China (22.500 MW).' }
    },

    /* ── FOOD & DRINK ─────────────────────────── */
    'coffee': {
      _aliases: ['café', 'coffee'],
      pt: { word: 'Café', type: 'substantivo, bebida', def: 'Bebida preparada com grãos torrados e moídos da planta Coffea. As espécies mais cultivadas são C. arabica (suave, aromática) e C. canephora (robusta, mais cafeína). Originária da Etiópia.', fact: 'Brasil é o maior produtor e exportador mundial de café há mais de 150 anos. A cafeína bloqueia receptores de adenosina (que causam sono). O café é a 2ª commodity mais negociada no mundo (depois do petróleo). Um "shot" de espresso tem menos cafeína que um copo de café filtrado. O café foi banido múltiplas vezes na história por ser "perigoso".', etymology: 'Do árabe "qahwa" via turco "kahve" — possivelmente referência ao Reino de Kaffa (Etiópia).' },
      en: { word: 'Coffee', type: 'noun, beverage', def: 'Drink made from roasted and ground beans of the Coffea plant. Main species: C. arabica (smooth, aromatic) and C. canephora (robusta, more caffeine). Originated in Ethiopia.', fact: "Brazil has been the world's largest coffee producer and exporter for 150+ years. Caffeine blocks adenosine receptors (which cause sleepiness). Coffee is the 2nd most traded commodity worldwide (after oil). An espresso shot has less caffeine than a cup of drip coffee. Coffee was banned multiple times in history as 'dangerous'.", etymology: 'From Arabic "qahwa" via Turkish "kahve" — possibly from the Kingdom of Kaffa in Ethiopia.' },
      es: { word: 'Café', type: 'sustantivo, bebida', def: 'Bebida preparada con granos tostados y molidos de la planta Coffea. Especies: C. arabica y C. canephora (robusta). Originaria de Etiopía.', fact: 'Brasil es el mayor productor y exportador mundial de café desde hace más de 150 años. La cafeína bloquea los receptores de adenosina. El café es la 2ª materia prima más negociada del mundo (después del petróleo).' }
    },

    'bread': {
      _aliases: ['pão', 'pan', 'bread'],
      pt: { word: 'Pão', type: 'substantivo, alimento', def: 'Alimento feito de farinha (geralmente de trigo), água, sal e fermento (levedura ou química), assado em forno. Um dos alimentos mais antigos — datado de 14.000 anos atrás (Natufians, Jordânia).', fact: 'O processo de fermentação do pão com levain/sourdough é uma das mais antigas biotecnologias humanas. Cada forno de sourdough tem uma microbiota única. A fatia de pão tem ~80 kcal. O pão branco tem índice glicêmico alto porque o processamento remove fibras e nutrientes da farinha integral. Glúten é uma proteína do trigo — celíacos (1% da população) não podem consumi-lo.', etymology: 'Do proto-germânico "braudam" — do verbo "brūaną" (cozer, fermentar).' },
      en: { word: 'Bread', type: 'noun, food', def: 'Food made from flour (usually wheat), water, salt, and leavening (yeast or chemical), baked in an oven. One of the oldest foods — dated to 14,000 years ago (Natufians, Jordan).', fact: "Each sourdough starter has a unique microbial ecosystem. White bread has a high glycemic index because processing removes fiber and nutrients. Gluten is a wheat protein — celiacs (1% of population) can't consume it. The Chorleywood bread process (1961) enabled mass industrial production but reduced nutritional value.", etymology: 'From Proto-Germanic "braudam" — from the verb "brūaną" (to brew, ferment).' },
      es: { word: 'Pan', type: 'sustantivo, alimento', def: 'Alimento hecho de harina (generalmente de trigo), agua, sal y levadura, horneado. Uno de los alimentos más antiguos — datado hace 14.000 años.', fact: 'Cada masa madre tiene un ecosistema microbiano único. El pan blanco tiene alto índice glucémico. El gluten es una proteína del trigo — los celíacos (1% de la población) no pueden consumirlo.' }
    },

    /* ── GEOGRAPHY ───────────────────────────── */
    'brazil': {
      _aliases: ['brasil', 'brazil'],
      pt: { word: 'Brasil', type: 'substantivo próprio, país', def: 'República Federativa do Brasil — maior país da América Latina e 5º maior do mundo em área (8.510.345 km²) e 7º em população (~215 milhões). Capital: Brasília. Idioma oficial: português. Moeda: Real (BRL).', fact: 'Brasil abriga a maior floresta tropical do mundo (Amazônia, ~60% do território). É o maior produtor de café, cana-de-açúcar, soja e laranja. O Brasil tem 12% da água doce do planeta. Mais de 60% da eletricidade é hidroelétrica. O nome vem do pau-brasil (Caesalpinia echinata), explorado pelos portugueses.', etymology: 'Do pau-brasil (árvore nativa) — possível relação com "brasa" (cor vermelha da madeira).' },
      en: { word: 'Brazil', type: 'proper noun, country', def: 'Federative Republic of Brazil — the largest country in Latin America and 5th largest in the world by area (8,510,345 km²), 7th by population (~215 million). Capital: Brasília. Official language: Portuguese. Currency: Real (BRL).', fact: 'Brazil contains the Amazon rainforest (~60% of its territory), the world\'s largest tropical forest. The world\'s largest producer of coffee, sugarcane, soybeans, and oranges. Has 12% of the world\'s fresh water. Named after brazilwood (Caesalpinia echinata), exploited by the Portuguese.', etymology: 'From "brazilwood" (native tree) — possibly related to "brasa" (ember, referring to the red color of the wood).' },
      es: { word: 'Brasil', type: 'sustantivo propio, país', def: 'República Federativa de Brasil — el país más grande de América Latina y 5° del mundo en área (8.510.345 km²), 7° en población (~215 millones). Capital: Brasilia. Idioma: portugués.', fact: 'Brasil alberga la selva amazónica (~60% de su territorio). Es el mayor productor mundial de café, caña de azúcar, soja y naranja. Tiene el 12% del agua dulce del planeta.' }
    }
  };

  /* ════════════════════════════════════════════
     KB PLUGIN (text-based fallback for scorer)
  ════════════════════════════════════════════ */
  if (!W.EduardoKB) W.EduardoKB = [];
  W.EduardoKB.push({
    id: 'dictionary',
    priority: 12,
    lang: {
      pt: {
        'dicionario': 'Eduardo.AI tem um dicionário embutido! Pergunte o significado de qualquer palavra comum: "o que é banana", "o que é metal", "o que é átomo", "o que é amor", "o que é café", "o que é DNA", "o que é computador" e muito mais. Posso explicar etimologia, fatos curiosos e definição completa.',
        'etimologia': 'Etimologia é o estudo da origem e evolução histórica das palavras. Exemplos curiosos: "salary" vem do latim "salarium" (pagamento em sal). "Denim" vem de "de Nîmes" (tecido de Nîmes, França). "Clue" vem do inglês antigo "clew" (novelo de lã — como o fio de Ariadne). "Disaster" vem do italiano "disastro" (má estrela — "astro" = estrela). Pergunte sobre a origem de qualquer palavra!',
      },
      en: {
        'dictionary': 'Eduardo.AI has a built-in dictionary! Ask the meaning of any common word: "what is banana", "what is metal", "what is atom", "what is love", "what is coffee", "what is DNA", "what is computer" and many more. I can explain etymology, fun facts, and full definitions.',
        'etymology': 'Etymology studies the origin and historical evolution of words. Fun examples: "salary" comes from Latin "salarium" (salt payment). "Denim" from "de Nîmes" (fabric from Nîmes, France). "Clue" from Old English "clew" (ball of yarn — like Ariadne\'s thread). "Disaster" from Italian "disastro" (bad star — "astro" = star). Ask about the origin of any word!',
      },
      es: {
        'diccionario': 'Eduardo.AI tiene un diccionario integrado. Pregunta el significado de cualquier palabra común: "qué es banana", "qué es metal", "qué es átomo", "qué es amor", "qué es café" y muchas más. Puedo explicar etimología, datos curiosos y definición completa.',
      }
    }
  });

}(window));
