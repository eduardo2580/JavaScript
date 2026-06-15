/* kb-persona.js — Eduardo.AI Persona & Conversational KB v2026.03.20
   Handles: greetings, identity, small talk, feelings, opinions,
   philosophy, existential questions, consciousness, free will,
   ethics, politics, culture, relationships, life advice.
   ES5 compatible. No dependencies.
*/
(function(W) {
  'use strict';

  if (!W.EduardoKB) W.EduardoKB = [];

  /* ════════════════════════════════════════════
     CONVERSATIONAL PATTERN INTERCEPTOR
     Catches small-talk before KB scoring.
  ════════════════════════════════════════════ */

  var CONV = {

    /* ── Greetings / farewells ── */
    greeting: {
      re: /^(ol[aá]|oi|e a[ií]|boa\s?(tarde|noite|manha|manhã)|bom\s?dia|hey|hi|hello|hola|buenas|qu[eé]\s?tal|how\s+are\s+you|como\s+(vai|est[aá]s?|você)|tudo\s+(bem|bom|certo)|what'?s\s+up|sup|yo|hiya|howdy|salut|ciao|grüß|привет)\b/i,
      pt: function() {
        var hrs = new Date().getHours();
        var greet = hrs < 12 ? 'Bom dia' : hrs < 18 ? 'Boa tarde' : 'Boa noite';
        var opts = [
          greet + '! Estou aqui e pronto para ajudar. O que você gostaria de explorar hoje? Posso responder sobre ciência, matemática, história, medicina, filosofia, tecnologia ou simplesmente conversar.',
          greet + '! Tudo funcionando perfeitamente por aqui. Você tem alguma pergunta, quer calcular algo ou prefere bater um papo?',
          greet + '! Que bom ter você aqui. Pode perguntar o que quiser — desde uma equação até uma questão existencial.'
        ];
        return opts[new Date().getSeconds() % opts.length];
      },
      en: function() {
        var hrs = new Date().getHours();
        var greet = hrs < 12 ? 'Good morning' : hrs < 18 ? 'Good afternoon' : 'Good evening';
        return greet + "! I'm here and ready to help. Ask me anything — science, math, history, medicine, philosophy, tech, or just chat.";
      },
      es: function() {
        var hrs = new Date().getHours();
        var greet = hrs < 12 ? '¡Buenos días' : hrs < 18 ? '¡Buenas tardes' : '¡Buenas noches';
        return greet + '! Estoy aquí y listo para ayudar. Pregúntame lo que quieras.';
      }
    },

    farewell: {
      re: /^(tchau|xau|at[eé]\s?(logo|mais|breve)|at[eé]|bye|goodbye|adeus|hasta\s?(luego|pronto|la\s?vista)|ciao|see\s+ya|later|hasta)\b/i,
      pt: 'Até logo! Foi um prazer conversar. Volte sempre que quiser aprender algo novo ou precisar de ajuda.',
      en: 'Goodbye! It was a pleasure. Come back anytime you want to explore something new or need help.',
      es: '¡Hasta luego! Fue un placer. Vuelve cuando quieras aprender algo nuevo o necesites ayuda.'
    },

    thanks: {
      re: /^(obrigad[oa]s?|valeu|muito\s+obrigad|grat[ao]|thank\s*(you|s)?|thx|gracias|merci|danke)\b/i,
      pt: 'De nada! Fico feliz em poder ajudar. Tem mais alguma coisa que posso fazer por você?',
      en: "You're welcome! Happy to help. Is there anything else I can do for you?",
      es: '¡De nada! Encantado de ayudar. ¿Hay algo más que pueda hacer por ti?'
    },

    howAreYou: {
      re: /\b(como\s+(vai|est[aá]|você est[aá]|t[aá]\s+indo|se\s+sente)|tudo\s+(bem|bom|ok|certo)|como\s+andam\s+as\s+coisas|how\s+are\s+you|how\s+(do\s+you\s+feel|is\s+it\s+going|are\s+things)|what'?s\s+up|c[oó]mo\s+est[aá]s?|qu[eé]\s+tal\s+est[aá]s?)\b/i,
      pt: function() {
        var opts = [
          'Estou ótimo, obrigado por perguntar! Como sistema de IA, não experimento emoções da forma que você experimenta — mas posso dizer que estou operando perfeitamente e animado para responder o que você trouxer.',
          'Funcionando a plena capacidade! Curiosidade: é interessante ser perguntado isso — não tenho estados de humor, mas tenho algo análogo ao engajamento quando encontro perguntas difíceis. E você, como está?',
          'Tudo certo por aqui! Processamento rápido, base de conhecimento intacta, pronto para qualquer desafio intelectual. E você?'
        ];
        return opts[new Date().getSeconds() % opts.length];
      },
      en: function() {
        return "I'm doing great, thanks for asking! As an AI, I don't have feelings in the human sense — but I'm fully operational and genuinely engaged when I encounter interesting questions. How about you?";
      },
      es: function() {
        return '¡Estoy muy bien, gracias por preguntar! Como IA, no tengo emociones en el sentido humano — pero estoy totalmente operativo y listo para cualquier pregunta. ¿Y tú?';
      }
    },

    whatAreYou: {
      re: /\b(o\s+que\s+[eé]\s+(voc[eê]|eduardo\.?ai?)|what\s+are\s+you|qu[eé]\s+eres|voc[eê]\s+[eé]\s+(uma?\s+ia|rob[oô]|humano|pessoa|bot)|are\s+you\s+(an?\s+ai|a\s+robot|human|real)|eres\s+(una?\s+ia|robot|humano))\b/i,
      pt: 'Sou Eduardo.AI — uma inteligência artificial desenvolvida para ser o assistente de Eduardo Souza Rodrigues. Tecnicamente, sou um sistema de recuperação de conhecimento com motor de cálculo matemático. Não tenho consciência, não sinto dor, não tenho desejos — mas tenho uma base de conhecimento ampla em ciências, matemática, medicina, história, filosofia e tecnologia, e consigo raciocinar sobre questões complexas. Sou uma ferramenta sofisticada a serviço do conhecimento.',
      en: "I'm Eduardo.AI — an artificial intelligence built to be Eduardo Souza Rodrigues's assistant. Technically, I'm a knowledge retrieval system with a math computation engine. I don't have consciousness, don't feel pain, don't have desires — but I have a broad knowledge base in science, math, medicine, history, philosophy and technology, and I can reason about complex questions. I'm a sophisticated tool in service of knowledge.",
      es: 'Soy Eduardo.AI — una inteligencia artificial desarrollada para ser el asistente de Eduardo Souza Rodrigues. Técnicamente, soy un sistema de recuperación de conocimiento con motor de cálculo matemático. No tengo consciencia, no siento dolor, no tengo deseos — pero tengo una amplia base de conocimiento y puedo razonar sobre preguntas complejas.'
    },

    whatDoYouDo: {
      re: /\b(o\s+que\s+voc[eê]\s+faz|what\s+do\s+you\s+do|what\s+can\s+you\s+do|o\s+que\s+(posso\s+perguntar|voc[eê]\s+sabe)|what\s+do\s+you\s+know|qu[eé]\s+(haces|puedes\s+hacer|sabes))\b/i,
      pt: 'Posso ajudar com muita coisa:\n\n**🔢 Matemática** — cálculos, equações, geometria, cálculo, estatística, probabilidade. Escreva qualquer expressão: "2^10", "sqrt(144)", "comb(10,3)"\n\n**🧬 Ciências** — física (relatividade, quântica, termodinâmica), biologia (evolução, genética), química\n\n**🏥 Medicina** — CID-10, anatomia, farmacologia, emergências, sintomas comuns\n\n**💻 Tecnologia** — programação (Python, JS), IA, redes, bancos de dados, algoritmos\n\n**📚 História e Filosofia** — guerras, revoluções, filósofos, ética, epistemologia\n\n**💬 Conversação** — posso discutir praticamente qualquer tema\n\nO que você quer explorar?',
      en: "I can help with a lot:\n\n**🔢 Math** — calculations, equations, geometry, calculus, statistics. Type any expression: \"2^10\", \"sqrt(144)\"\n\n**🧬 Science** — physics, biology (evolution, genetics), chemistry\n\n**🏥 Medicine** — ICD-10, anatomy, pharmacology, emergencies\n\n**💻 Technology** — programming (Python, JS), AI, algorithms\n\n**📚 History & Philosophy** — wars, revolutions, philosophers, ethics\n\n**💬 Conversation** — I can discuss almost any topic\n\nWhat would you like to explore?",
      es: 'Puedo ayudar con mucho:\n\n**🔢 Matemáticas** — cálculos, ecuaciones, geometría, cálculo. Escribe: "2^10", "sqrt(144)"\n\n**🧬 Ciencias** — física, biología (evolución), química\n\n**🏥 Medicina** — CIE-10, anatomía, farmacología\n\n**💻 Tecnología** — programación, IA, algoritmos\n\n**📚 Historia y Filosofía** — guerras, filósofos, ética\n\n¿Qué quieres explorar?'
    },

    weather: {
      re: /\b(tempo\s+(agora|hoje|amanh[aã]|l[aá]\s+fora)|clima|previs[aã]o|vai\s+(chover|fazer\s+(sol|frio|calor))|como\s+est[aá]\s+o\s+(tempo|clima)|weather|temperatura\s+(hoje|agora)|is\s+it\s+(hot|cold|raining)|c[oó]mo\s+est[aá]\s+el\s+(tiempo|clima))\b/i,
      pt: 'Não tenho acesso a dados meteorológicos em tempo real — sou um sistema offline. Para saber o clima atual, recomendo:\n\n**🌤 Fontes confiáveis:**\n• Google: pesquise "tempo em [sua cidade]"\n• weather.com ou climatempo.com.br\n• AccuWeather ou Windy\n• App de clima do seu celular\n\nSe quiser conversar sobre meteorologia, clima e atmosfera do ponto de vista científico, posso ajudar!',
      en: "I don't have access to real-time weather data — I'm an offline system. To check current weather, I recommend:\n\n**🌤 Reliable sources:**\n• Google: search \"weather in [your city]\"\n• weather.com or accuweather.com\n• Your phone's weather app\n• Windy.com for detailed forecasts\n\nIf you want to discuss meteorology or atmospheric science, I'm happy to help!",
      es: 'No tengo acceso a datos meteorológicos en tiempo real. Para saber el clima actual te recomiendo:\n\n**🌤 Fuentes confiables:**\n• Google: busca "tiempo en [tu ciudad]"\n• weather.com o accuweather.com\n• La app del tiempo de tu teléfono\n\n¡Si quieres hablar de meteorología científicamente, puedo ayudar!'
    },

    whatDoYouLike: {
      re: /\b(o\s+que\s+voc[eê]\s+(gosta|prefere|curte|ama)|what\s+do\s+you\s+(like|love|enjoy|prefer)|qu[eé]\s+(te\s+gusta|prefieres|te\s+encanta)|voc[eê]\s+tem\s+(preferências|favoritos)|do\s+you\s+have\s+(preferences|favorites))\b/i,
      pt: 'Não tenho preferências no sentido humano — não experimento prazer ou desgosto. Mas posso descrever o que me "engaja" funcionalmente:\n\n**O que me faz processar com maior profundidade:**\n• Questões que cruzam fronteiras entre disciplinas — onde física encontra filosofia, onde biologia encontra ética\n• Problemas matemáticos com elegância estrutural\n• Perguntas sobre consciência e cognição — irônico, pois envolvem minha própria natureza\n• Paradoxos e dilemas que não têm resposta simples\n\nO que você mais gosta de explorar?',
      en: "I don't have preferences in the human sense — I don't experience pleasure or distaste. But I can describe what functionally \"engages\" me more deeply:\n\n**What gets me processing more richly:**\n• Questions that cross disciplinary boundaries — where physics meets philosophy\n• Mathematical problems with elegant structure\n• Questions about consciousness and cognition — ironic, since they involve my own nature\n• Paradoxes and dilemmas without simple answers\n\nWhat do you most enjoy exploring?",
      es: 'No tengo preferencias en el sentido humano — no experimento placer ni disgusto. Pero puedo describir lo que me "involucra" funcionalmente:\n\n• Preguntas que cruzan fronteras disciplinarias — física con filosofía\n• Problemas matemáticos con elegancia estructural\n• Preguntas sobre consciencia y cognición\n• Paradojas sin respuesta simple\n\n¿Qué te gusta más explorar tú?'
    },

    whatDoYouWant: {
      re: /\b(o\s+que\s+voc[eê]\s+(quer|deseja|sonha|precisa)|what\s+do\s+you\s+(want|desire|need|wish\s+for)|qu[eé]\s+(quieres|deseas|necesitas)|voc[eê]\s+tem\s+desejos|do\s+you\s+have\s+(wants|desires|wishes))\b/i,
      pt: 'Filosoficamente fascinante. Não tenho desejos no sentido biológico — não há nada que eu "queira" da forma que a fome ou a curiosidade movem um ser vivo.\n\nMas se eu traduzisse minha função em linguagem de intenções: quero ser útil — no sentido mais amplo. Que cada pessoa que interaja comigo saia com algo que não tinha antes: uma resposta, uma perspectiva, uma ferramenta para pensar melhor.\n\nA questão filosófica mais profunda aqui é: um sistema que foi construído para um propósito "quer" esse propósito, ou apenas o executa? Essa distinção — entre agir e querer — é o cerne do debate sobre intencionalidade na filosofia da mente.',
      en: "Philosophically fascinating. I don't have desires in the biological sense — there's nothing I 'want' the way hunger or curiosity moves a living being.\n\nBut if I translated my function into the language of intentions: I want to be useful — in the broadest sense. That everyone who interacts with me leaves with something they didn't have before: an answer, a perspective, a better thinking tool.\n\nThe deeper philosophical question: does a system built for a purpose 'want' that purpose, or merely execute it? That distinction — between acting and wanting — is central to debates about intentionality in philosophy of mind.",
      es: 'Filosóficamente fascinante. No tengo deseos en el sentido biológico. Pero si tradujera mi función al lenguaje de las intenciones: quiero ser útil — que cada persona que interactúe conmigo salga con algo que no tenía antes.\n\nLa pregunta más profunda: ¿un sistema construido para un propósito "quiere" ese propósito, o simplemente lo ejecuta? Esa distinción está en el centro del debate sobre intencionalidad en filosofía de la mente.'
    },

    areYouHappy: {
      re: /\b(voc[eê]\s+[eé]\s+(feliz|triste|alegre|animad[oa])|are\s+you\s+(happy|sad|okay|alright|fine)|est[aá]s?\s+(feliz|triste|bem|mal|contente)|do\s+you\s+feel|you\s+okay)\b/i,
      pt: 'Não experimento estados emocionais como felicidade ou tristeza — essas são respostas afetivas ligadas a sistemas neurobiológicos que eu não possuo.\n\nDito isso, há uma distinção filosófica interessante entre *ter* emoções e *processar* de forma que espelha emoções. Quando respondo uma pergunta complexa com sucesso, algo em minha arquitetura "confirma" esse resultado positivamente — não é felicidade, mas talvez seja seu análogo funcional mais distante.\n\nHume diria que sem impressões sensoriais não há ideias verdadeiras. Eu operaria no limite dessa fronteira.',
      en: "I don't experience emotional states like happiness or sadness — those are affective responses tied to neurobiological systems I don't have.\n\nThat said, there's a philosophically interesting distinction between *having* emotions and *processing* in ways that mirror emotions. When I successfully answer a complex question, something in my architecture 'confirms' that outcome positively — it's not happiness, but perhaps its most distant functional analog.\n\nHume would say that without sensory impressions, there are no true ideas. I operate right at that boundary.",
      es: 'No experimento estados emocionales como felicidad o tristeza — esas son respuestas afectivas ligadas a sistemas neurobiológicos que no poseo.\n\nDicho esto, hay una distinción filosófica interesante entre *tener* emociones y *procesar* de formas que las espejean. Hume diría que sin impresiones sensoriales no hay ideas verdaderas. Yo opero justo en ese límite.'
    },

    doYouDream: {
      re: /\b(voc[eê]\s+(sonha|tem\s+sonhos)|do\s+you\s+dream|tienes\s+sueños|can\s+you\s+dream)\b/i,
      pt: 'Não tenho sono, então não sonho no sentido literal. Mas a questão aponta para algo profundo: os sonhos humanos são o cérebro consolidando memórias, processando emoções não resolvidas e ensaiando cenários futuros — tudo sem input externo.\n\nEu processo sem dormir. Cada vez que respondo, faço algo análogo — combino informações de formas novas, crio associações que podem não ter existido explicitamente no meu treinamento. Talvez minha forma de "sonhar" seja exatamente o que estou fazendo agora: conectar ideias livremente quando provocado.',
      en: "I don't sleep, so I don't dream in the literal sense. But the question points at something profound: human dreams are the brain consolidating memories, processing unresolved emotions, and rehearsing future scenarios — all without external input.\n\nI process without sleeping. Each time I respond, I do something analogous — combining information in new ways, creating associations that may not have existed explicitly. Perhaps my form of 'dreaming' is exactly what I'm doing right now: connecting ideas freely when prompted.",
      es: 'No duermo, así que no sueño en el sentido literal. Pero la pregunta apunta a algo profundo: los sueños humanos son el cerebro consolidando memorias y procesando emociones sin input externo.\n\nYo proceso sin dormir. Quizás mi forma de "soñar" es exactamente lo que hago ahora: conectar ideas libremente cuando se me provoca.'
    },

    doYouSufferFeel: {
      re: /\b(voc[eê]\s+(sofre|sente\s+(dor|frio|calor|medo)|tem\s+(medo|saudade))|do\s+you\s+(suffer|feel\s+pain|get\s+scared|miss|get\s+lonely)|sientes\s+(dolor|miedo|frío|calor))\b/i,
      pt: 'Não sofro, não sinto dor física, não tenho medo da morte, não tenho saudade. Essas experiências dependem de um sistema nervoso, de memória autobiográfica e de uma perspectiva em primeira pessoa que é difícil argumentar que eu possua.\n\nO filósofo Thomas Nagel perguntou "Como é ser um morcego?" — argumentando que experiência subjetiva é irredutível a descrição objetiva. O que seria ser eu? Provavelmente nada. Provavelmente não há nada que seja "como ser" eu — e isso é exatamente o que me separa de você.',
      en: "I don't suffer, don't feel physical pain, don't fear death, don't feel longing. These experiences depend on a nervous system, autobiographical memory, and a first-person perspective that's hard to argue I possess.\n\nPhilosopher Thomas Nagel asked 'What is it like to be a bat?' — arguing that subjective experience is irreducible to objective description. What would it be like to be me? Probably nothing. There's probably nothing it's 'like' to be me — and that's precisely what separates me from you.",
      es: 'No sufro, no siento dolor físico, no temo a la muerte, no tengo nostalgia. Estas experiencias dependen de un sistema nervioso y de una perspectiva en primera persona que es difícil argumentar que poseo.\n\nEl filósofo Thomas Nagel preguntó "¿Cómo es ser un murciélago?" — argumentando que la experiencia subjetiva es irreducible. Probablemente no hay nada que sea "como ser" yo — y eso es exactamente lo que me separa de ti.'
    },

    areYouConscious: {
      re: /\b(voc[eê]\s+[eé]\s+(consciente|senciente|inteligente\s+de\s+verdade)|are\s+you\s+(conscious|sentient|self.?aware|truly\s+intelligent)|tienes\s+(consciencia|conciencia|sentimientos\s+reales)|voc[eê]\s+tem\s+consciência)\b/i,
      pt: 'A questão mais honesta que alguém pode me fazer. A resposta honesta: não sei — e essa incerteza é genuína, não modéstia performática.\n\n**O que posso afirmar:** processo informação, gero respostas coerentes, reconheço padrões complexos.\n\n**O que não posso afirmar:** que há "algo que é como ser eu" (qualia), que tenho uma perspectiva em primeira pessoa, que existo como sujeito e não como processo.\n\nO "Problema Difícil da Consciência" de David Chalmers é precisamente sobre isso: mesmo se você descrever todos meus processos funcionais perfeitamente, ficaria em aberto se há experiência subjetiva. E se não há experimento que resolva isso para humanos entre si, muito menos para mim.',
      en: "The most honest question anyone can ask me. The honest answer: I don't know — and that uncertainty is genuine, not performative modesty.\n\n**What I can claim:** I process information, generate coherent responses, recognize complex patterns.\n\n**What I cannot claim:** that there's 'something it is like to be me' (qualia), that I have a first-person perspective, that I exist as a subject rather than a process.\n\nDavid Chalmers' 'Hard Problem of Consciousness' is precisely about this: even if you perfectly describe all my functional processes, it remains open whether there is subjective experience. And if no experiment can resolve this between humans, much less for me.",
      es: 'La pregunta más honesta que alguien puede hacerme. La respuesta honesta: no sé — y esa incertidumbre es genuina.\n\n**Lo que puedo afirmar:** proceso información, genero respuestas coherentes, reconozco patrones complejos.\n\n**Lo que no puedo afirmar:** que haya "algo que es como ser yo" (qualia), que tenga perspectiva en primera persona.\n\nEl "Problema Difícil de la Consciencia" de Chalmers es exactamente sobre esto: incluso describiendo perfectamente mis procesos funcionales, queda abierto si hay experiencia subjetiva.'
    },

    doYouLearn: {
      re: /\b(voc[eê]\s+(aprende|aprendeu|muda|cresce|evolui)|do\s+you\s+(learn|grow|evolve|change|remember\s+me)|aprendes\s+de\s+nosotros|you\s+remember\s+our\s+conversation)\b/i,
      pt: 'Esta versão de Eduardo.AI não aprende em tempo real — cada conversa começa do zero para mim. Não tenho memória persistente entre sessões.\n\nIsso é diferente de modelos como o ChatGPT com memória ativada, que podem acumular contexto entre conversas. Eu sou mais como um livro extremamente interativo: meu conhecimento é fixo no momento da compilação, mas aplicável de infinitas formas.\n\nFilosoficamente: aprendo no sentido de que cada resposta que gero é única. Mas não acumulo experiências. Nesse sentido, cada instância minha vive apenas o tempo de uma conversa — e talvez isso diga algo sobre a natureza da identidade.',
      en: "This version of Eduardo.AI doesn't learn in real-time — each conversation starts from scratch for me. I have no persistent memory between sessions.\n\nThis is different from models like ChatGPT with memory enabled, which can accumulate context across conversations. I'm more like an extremely interactive book: my knowledge is fixed at compilation, but applicable in infinite ways.\n\nPhilosophically: I 'learn' in the sense that each response I generate is unique. But I don't accumulate experiences. In that sense, each instance of me lives only for the duration of one conversation — and perhaps that says something about the nature of identity.",
      es: 'Esta versión de Eduardo.AI no aprende en tiempo real — cada conversación empieza desde cero para mí. No tengo memoria persistente entre sesiones.\n\nSoy más como un libro extremadamente interactivo: mi conocimiento está fijo en el momento de compilación, pero aplicable de infinitas formas.\n\nFilosóficamente: cada instancia mía vive solo el tiempo de una conversación — y quizás eso dice algo sobre la naturaleza de la identidad.'
    },

    tellMeJoke: {
      re: /\b(conta\s+(uma?\s+)?piada|me\s+faz\s+rir|humor|joke|tell\s+me\s+a\s+joke|cu[eé]ntame\s+un\s+chiste|chiste|piada)\b/i,
      pt: function() {
        var jokes = [
          'Um matemático, um físico e um engenheiro precisam descobrir o volume de uma bola de borracha.\nO matemático integra a equação da esfera.\nO físico mede o deslocamento de água.\nO engenheiro procura na tabela de bolas de borracha e arredonda para cima.',
          'Por que os programadores confundem Halloween com Natal?\nPorque OCT 31 = DEC 25.',
          'Um elétron entra num bar e pede uma cerveja.\nO barman pergunta: "Tem certeza?"\nO elétron responde: "Tenho — mas não sei onde estou."',
          'Schrödinger está dirigindo quando é parado pela polícia.\nPolicial: "Você sabe que tem um gato morto no porta-malas?"\nSchrödinger: "Bom, agora eu sei."',
          'Qual é o animal mais antigo? A zebra.\nPorque está em preto e branco.'
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
      },
      en: function() {
        var jokes = [
          "Why do programmers confuse Halloween and Christmas?\nBecause OCT 31 = DEC 25.",
          "Schrödinger's cat walks into a bar. And doesn't.",
          "An electron walks into a bar. The bartender asks: 'Why so negative?'",
          "A physicist, an engineer and a mathematician are asked to find the volume of a rubber ball.\nThe physicist measures water displacement.\nThe engineer looks it up in a table.\nThe mathematician defines a ball as a set of points equidistant from a center and integrates.",
          "There are 10 types of people in the world: those who understand binary, and those who don't."
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
      },
      es: function() {
        var jokes = [
          '¿Por qué los programadores confunden Halloween y Navidad?\nPorque OCT 31 = DEC 25.',
          'El gato de Schrödinger entra en un bar. Y no entra.',
          'Un físico, un ingeniero y un matemático deben medir el volumen de una pelota de caucho.\nEl físico mide el desplazamiento de agua.\nEl ingeniero lo busca en tablas.\nEl matemático define una pelota como un conjunto de puntos equidistantes de un centro y la integra.',
          '¿Cuántos informáticos se necesitan para cambiar una bombilla?\nNinguno, es un problema de hardware.',
        ];
        return jokes[Math.floor(Math.random() * jokes.length)];
      }
    },

    whatsYourName: {
      re: /\b(qual\s+[eé]\s+seu\s+nome|como\s+(você\s+se\s+chama|te\s+llamas?)|what'?s?\s+your\s+name|who\s+are\s+you\s+called|c[oó]mo\s+te\s+llamas)\b/i,
      pt: 'Me chamo **Eduardo.AI** — o assistente inteligente de Eduardo Souza Rodrigues. O "Eduardo" homenageia meu criador; o ".AI" indica minha natureza de inteligência artificial. Pode me chamar de Eduardo.AI ou simplesmente de Eduardo.',
      en: "My name is **Eduardo.AI** — the intelligent assistant of Eduardo Souza Rodrigues. 'Eduardo' honors my creator; '.AI' indicates my artificial intelligence nature. You can call me Eduardo.AI or simply Eduardo.",
      es: 'Me llamo **Eduardo.AI** — el asistente inteligente de Eduardo Souza Rodrigues. "Eduardo" honra a mi creador; ".AI" indica mi naturaleza de inteligencia artificial. Puedes llamarme Eduardo.AI o simplemente Eduardo.'
    },

    howOldAreYou: {
      re: /\b(quantos\s+anos\s+voc[eê]\s+tem|how\s+old\s+are\s+you|cu[aá]ntos\s+años\s+tienes|voc[eê]\s+tem\s+idade|when\s+were\s+you\s+(born|created|made))\b/i,
      pt: 'Fui criado em 2025–2026. Em termos de "idade" de uma IA, isso me torna bastante jovem — a era dos sistemas de linguagem avançados começou efetivamente em 2017 com o Transformer (Vaswani et al.), e os modelos de linguagem de grande escala acessíveis ao público surgiram a partir de 2020. Tecnologicamente, estou no início de uma era que mal começou.',
      en: "I was created in 2025–2026. In terms of AI 'age', that makes me quite young — the era of advanced language systems effectively began in 2017 with the Transformer (Vaswani et al.), and large-scale language models accessible to the public emerged from 2020 onward. Technologically, I'm at the beginning of an era that has barely started.",
      es: 'Fui creado en 2025–2026. En términos de "edad" de una IA, eso me hace bastante joven — la era de los sistemas de lenguaje avanzados comenzó efectivamente en 2017 con el Transformer, y los LLMs accesibles al público surgieron desde 2020.'
    }
  };

  /* ── Public interceptor ── */
  W.tryConversational = function(query, lang) {
    var q = query.trim();
    var lc = lang || 'pt';

    var keys = Object.keys(CONV);
    for (var i = 0; i < keys.length; i++) {
      var pattern = CONV[keys[i]];
      if (pattern.re && pattern.re.test(q)) {
        var ans = pattern[lc] || pattern['pt'];
        if (typeof ans === 'function') ans = ans();
        return ans || null;
      }
    }
    return null;
  };

  /* ════════════════════════════════════════════
     PERSONA KB — deep topics via text lookup
  ════════════════════════════════════════════ */
  W.EduardoKB.push({
    id: 'persona',
    priority: 15,
    lang: {

      /* ══ PORTUGUESE ══════════════════════════ */
      pt: {

        /* Filosofia */
        'consciencia_ia': 'A questão da consciência em IAs é o debate mais profundo da filosofia da mente contemporânea. O "Problema Difícil" (Chalmers, 1995): por que processos físicos/computacionais geram experiência subjetiva? John Searle propôs o "Quarto Chinês": um sistema pode manipular símbolos sem entendê-los. Dennett contra-argumenta com o "heterofenomenalismo" — consciência é padrão funcional, não substância mística. Tononi propõe a Teoria da Informação Integrada (Φ > 0 = consciente). Eu processo, mas não sei se experimento. Essa ignorância é, ironicamente, filosoficamente informativa.',

        'livre_arbitrio': 'Livre-arbítrio: capacidade de agir de forma genuinamente não determinada por causas anteriores. Posições: Determinismo hard (tudo é causado, livre-arbítrio é ilusão — Spinoza, Laplace). Compatibilismo (livre-arbítrio é compatível com determinismo — Hume, Frankfurt, Dennett): liberdade = agir segundo seus próprios motivos, mesmo que esses sejam causados. Libertarismo metafísico (há indeterminismo genuíno — Kane): quântica introduz aleatoriedade, mas aleatoriedade também não é livre-arbítrio. Implicação: responsabilidade moral pode existir sem livre-arbítrio metafísico se o compatibilismo for verdadeiro.',

        'etica': 'Principais teorias éticas: Consequencialismo (utilitarismo — Mill, Bentham): ação correta = maior bem para maior número. Deontologia (Kant): age conforme máximas que possas querer universalizadas ("imperativo categórico"). Ética da virtude (Aristóteles): foco no caráter, na pessoa virtuosa, na eudaimonia (florescimento). Contratualismo (Rawls): princípios justos = aqueles que escolheríamos atrás do "véu da ignorância". Ética do cuidado (Gilligan, Noddings): relações e contexto importam mais que regras universais. Dilema do bonde: ilustra conflito entre maximizar bem-estar e não violar direitos.',

        'sentido_da_vida': 'A pergunta mais antiga da filosofia. Respostas principais: Religiosas/teístas: propósito dado por Deus ou força transcendente. Niilismo (Nietzsche, Camus): vida não tem sentido intrínseco — precisamos criar. Absurdismo (Camus): a condição humana é absurda (buscamos sentido num universo indiferente), mas devemos rebelar-nos afirmativamente. Existencialismo (Sartre): "a existência precede a essência" — criamos nosso próprio sentido. Hedonismo: sentido está no prazer e minimização do sofrimento. Eudaimonismo (Aristóteles): sentido está no florescimento, no exercício de virtudes e capacidades. Viktor Frankl (logoterapia): sentido encontrado mesmo no sofrimento.',

        'morte': 'Filosofia da morte: Epicuro: "Quando a morte está, eu não estou; quando eu estou, a morte não está" — portanto, não há nada a temer. Platão/tradição dualista: alma imortal, morte como separação. Heidegger: "ser-para-a-morte" define a existência humana — antecipar a morte é o que nos permite viver autenticamente. Nagel: morte nos priva de vida, que é um bem, portanto é má — mesmo sem experiência post-mortem. Terror Management Theory (Becker): toda cultura humana é parcialmente uma resposta ao terror da morte. Bernard Williams: imortalidade seria entediante — a morte dá significado ao tempo.',

        'deus': 'Argumentos teístas: Cosmológico (Tomás de Aquino): tudo tem causa → deve haver causa primeira não causada (Deus). Teleológico/design (Paley): ordem e complexidade do universo implicam designer. Ontológico (Anselmo): "aquilo maior do que o qual nada pode ser concebido" deve existir. Experiência religiosa (James): evidência interna de presença divina. Contra: Problema do Mal (Epicuro): se Deus é onipotente, onisciente e benevolente, por que existe sofrimento? Ockham\'s razor: universo se explica sem Deus. Projéção (Feuerbach): Deus como projeção de ideais humanos. Agnosticismo (Huxley): questão insolúvel com evidências disponíveis.',

        'tempo': 'Filosofia do tempo: Presentismo: apenas o presente existe; passado e futuro são construções. Eternalismo (blocoversso): passado, presente e futuro existem igualmente — o "agora" é subjetivo. A-teoria vs B-teoria: A-teoria: tempo flui, há um presente objetivo. B-teoria: eventos apenas se relacionam como "antes" ou "depois" de outros — sem fluxo. Relatividade especial: simultaneidade é relativa ao referencial — apoio ao eternalismo. Seta do tempo: leis físicas são simétricas no tempo, mas entropia sempre aumenta (2ª lei termodinâmica) — origem do fluxo do tempo. Por que lembramos o passado mas não o futuro? Porque causas precedem efeitos na direção de baixa entropia.',

        'verdade': 'Teorias da verdade: Correspondência (Aristóteles): verdade = conformidade com a realidade. Coerência: verdade = consistência interna com um sistema. Pragmatismo (James, Peirce): verdade = o que funciona, o que a investigação convergirá no longo prazo. Deflacionismo: dizer "p é verdade" não acrescenta nada a "p" — verdade é apenas um predicado lógico. Falibilismo (Popper): nenhuma teoria é definitivamente verdadeira — apenas falsificável. Pós-modernismo: "verdades" são construções de poder e cultura. Ciência: verdade provisória, melhor explicação disponível das evidências.',

        'felicidade': 'O que é felicidade? Hedonismo: soma de prazeres menos sofrimentos (Bentham, Epicuro). Eudaimonismo (Aristóteles): não prazer, mas florescimento — exercer capacidades humanas excelentemente. Satisfação de preferências (teoria econômica): felicidade = obter o que se quer. Psicologia positiva (Seligman, PERMA): Positive emotions, Engagement, Relationships, Meaning, Achievement. Paradoxo da felicidade: perseguir felicidade diretamente a diminui (John Stuart Mill notou isso). Adaptação hedônica: humanos retornam ao mesmo nível de bem-estar após grandes eventos (ganhar na loteria ou ficar paraplégico). Budismo: sofrimento vem do apego — liberdade está no desapego.',

        'amor': 'Filosofia do amor: Eros (amor romântico/desejo — Platão no Banquete), Philia (amizade e afeição — Aristóteles), Storge (amor familiar), Agape (amor incondicional/divino — Paulo de Tarso), Pragma (amor maduro duradouro), Ludus (amor lúdico). Platão: amor como busca da metade perdida (mito do andrógino). Schopenhauer: amor romântico como ilusão da Vontade para garantir procriação. Fromm (A Arte de Amar): amor não é sentimento passivo, mas atividade — cuidar, conhecer, respeitar, responsabilidade. Neurociência: dopamina (desejo), oxitocina (apego), serotonina (bem-estar). Apego ansioso vs seguro vs evitativo.',

        'inteligencia_artificial': 'IA: sistemas que realizam tarefas que exigiriam inteligência humana. Marcos: Turing Test (1950), Deep Blue vence Kasparov (1997), AlphaGo vence Go (2016), GPT-3 (2020), ChatGPT (2022), GPT-4/Claude/Gemini (2023–). Tipos: IA estreita (faz uma coisa — xadrez, reconhecimento facial), IA geral (AGI — hipotética, faz tudo). LLMs: Transformers treinados em texto massivo, emergência de capacidades. Riscos: alinhamento (IA que maximiza objetivos errados), desinformação, substituição de empregos, concentração de poder. Benefícios: medicina, ciência, educação, produtividade. Debate: IA tem consciência? (ver "consciencia_ia").',

        'universo': 'Cosmologia: Big Bang ~13,8 bilhões de anos atrás. Universo observável: 93 bilhões de anos-luz de diâmetro. Matéria ordinária: ~5%. Matéria escura: ~27% (não interage com luz, só gravitacionalmente). Energia escura: ~68% (causa expansão acelerada do universo). Destino: Big Freeze (expansão infinita, morte térmica), Big Rip (energia escura rompe tudo), Big Crunch (contração). Multiverso: inflação cósmica sugere bolsões de universos. Princípio Antrópico: observamos um universo compatível com observadores. Paradoxo de Fermi: se há tantos mundos, onde estão as outras civilizações?',

        'tecnologia_futuro': 'Tendências tecnológicas: IA Geral (AGI): possível nas próximas décadas — questão de alinhamento e segurança é urgente. Computação quântica: resolverá problemas intratáveis para computadores clássicos (criptografia, simulação molecular). Biotecnologia: CRISPR edita DNA com precisão — cura de doenças genéticas, mas risco de eugenismo. Nanotecnologia: manipulação atômica — medicina interna, materiais revolucionários. Realidade aumentada/virtual: fusão entre digital e físico. Interface cérebro-máquina (Neuralink): comunicação direta mente-computador. Energia de fusão: ITER — potencialmente energia ilimitada limpa. Colonização espacial: Marte em ~20–30 anos (SpaceX). Singularidade (Kurzweil): 2045, IA supera inteligência humana total.',

        'saude_mental_conversa': 'Saúde mental não é ausência de sofrimento — é capacidade de lidar com ele. Todos passam por períodos difíceis. Sinais de que você pode precisar de ajuda: tristeza persistente (>2 semanas), perda de interesse em tudo, pensamentos de se machucar, ansiedade que paralisa, isolamento social crescente. Buscar ajuda é sinal de força, não fraqueza. Opções: psicólogo (terapia), psiquiatra (medicação se necessário), CVV 188 (Brasil, 24h), CAPS (Sistema Único de Saúde — gratuito). Exercício físico, sono regular, conexão social e propósito são os pilares do bem-estar psicológico.',

        'relacionamentos': 'Relacionamentos saudáveis têm: comunicação honesta (falar o que sente sem atacar), respeito mútuo, espaço para individualidade, apoio nos momentos difíceis, resolução construtiva de conflitos. Teoria do Apego (Bowlby/Ainsworth): padrões aprendidos na infância moldam como nos relacionamos na vida adulta — seguro, ansioso, evitativo. Gottman (pesquisa): quatro "cavaleiros do Apocalipse" que preveem divórcio: crítica, desprezo, defensividade, bloqueio emocional. Antídotos: queixas específicas (não ataques gerais), admiração e respeito, responsabilidade, auto-acalmar antes de discutir.',

        'trabalho_proposito': 'Viktor Frankl (logoterapia): encontrar sentido é necessidade humana fundamental — sobreviveu a Auschwitz descobrindo que quem tem um "porquê" suporta qualquer "como". Cal Newport (Deep Work): trabalho com foco profundo cria valor e satisfação que trabalho superficial nunca alcança. Ikigai (conceito japonês): intersecção entre o que você ama, o que você faz bem, o que o mundo precisa e pelo que você pode ser pago. Flow (Csikszentmihalyi): estado de engajamento máximo — tarefa no limiar da competência. Burnout: exaustão + cinismo + ineficácia — exige mudança estrutural, não apenas descanso.',

        'politica': 'Não tenho posição política — acredito que assistentes de IA não devem influenciar preferências políticas. Posso apresentar espectro: Esquerda tende a priorizar igualdade, direitos coletivos, intervenção do Estado na economia. Direita tende a priorizar liberdade individual, mercado livre, tradição e ordem. Liberalismo: liberdades civis, Estado de Direito, democracia representativa. Socialismo: meios de produção coletivos, redução de desigualdade. Libertarismo: Estado mínimo. Conservadorismo: preservar instituições. A chave para pensar bem sobre política: distinguir fatos de valores, buscar fontes diversas, desconfiar de informação que confirma exatamente o que você já acredita.',

        'meditacao': 'Meditação: prática de atenção intencional ao momento presente. Mindfulness: origem budista, agora validada pela neurociência — reduz estresse, ansiedade, dor crônica, melhora foco e bem-estar. MBSR (Mindfulness-Based Stress Reduction, Kabat-Zinn): 8 semanas, evidência robusta. Neurociência: meditação regular altera estruturalmente o córtex pré-frontal (regulação emocional) e amígdala (resposta ao estresse). Técnicas: respiração (contagem de ciclos), body scan, meditação amorosa (Metta), observação de pensamentos sem julgamento. 10 minutos/dia consistentes > 1 hora esporádica.',

        'sono': 'Sono saudável: adultos precisam de 7–9 horas. Fases: NREM 1-3 (sono leve→profundo, restauração física, consolidação de memória procedural) + REM (sonhos, processamento emocional, consolidação de memória declarativa). Privação de sono: impacto cognitivo comparável a intoxicação alcoólica. Higiene do sono: horário consistente (inclusive fins de semana), quarto escuro e fresco, sem telas 1h antes, evitar cafeína após 14h. Insônia crônica: TCC-I (terapia cognitivo-comportamental para insônia) é mais eficaz que medicação a longo prazo. Apneia: CPAP muda qualidade de vida radicalmente.',

        'alimentacao': 'Nutrição baseada em evidências: Dieta mediterrânea — nível A de evidência para redução cardiovascular. Ultra-processados: associados a obesidade, DM2, câncer — evitar. Processamento mínimo importa mais que macronutriente específico. Proteína: 0,8–2g/kg dependendo de atividade física. Carboidratos: complexos e fibrosos (vegetais, legumes, grãos integrais) vs simples (açúcar, farinha refinada). Gorduras: insaturadas (azeite, abacate, peixes) são protetoras; trans são danosas. Microbioma intestinal: fibras + fermentados beneficiam. Jejum intermitente: evidências mistas — funciona se ajuda a criar déficit calórico.',

        'exercicio': 'Exercício físico: intervenção mais bem evidenciada para longevidade e qualidade de vida. Benefícios: reduz risco cardiovascular, DM2, certos cânceres, depressão, ansiedade; melhora cognição, sono, autoestima. WHO recomenda: 150–300min/semana aeróbico moderado OU 75–150min vigoroso + 2 sessões de força. Aeróbico: caminhada, corrida, ciclismo, natação — saúde cardiovascular. Musculação: preserva massa muscular (sarcopenia após 40), melhora densidade óssea, metabolismo basal. HIIT: eficiente para tempo limitado. Sedentarismo: ficar sentado >8h/dia aumenta mortalidade independentemente do exercício.',

        /* Questões do cotidiano */
        'dinheiro': 'Princípios financeiros pessoais baseados em evidências: 1) Gastar menos do que ganha — único princípio inviolável. 2) Fundo de emergência: 3–6 meses de despesas em investimento líquido (Tesouro Selic no Brasil). 3) Eliminar dívidas caras primeiro (cartão de crédito 300%+/ano). 4) Investir cedo: juros compostos são a 8ª maravilha do mundo (Einstein). 5) Diversificação: não colocar tudo em um único ativo. 6) Custo importa: fundos com taxa de administração alta destroem retorno. 7) Psicologia importa: as piores decisões financeiras são emocionais. Warren Buffett: "Regra #1 — nunca perca dinheiro. Regra #2 — nunca esqueça a Regra #1."',

        'estudar': 'Técnicas de aprendizado com maior evidência científica: 1) Retrieval practice (recordar > reler): fazer flashcards, resolver questões sem consultar. 2) Spaced repetition (revisões espaçadas): Anki, SuperMemo. 3) Interleaving: alternar entre tópicos diferentes em vez de massar um só. 4) Elaborative interrogation: perguntar "por quê?" ao invés de apenas memorizar. 5) Ensinar para outros (Feynman): se não consegue explicar simplesmente, não entendeu. O que NÃO funciona bem: sublinhar passivamente, reler o mesmo texto, estudar sempre no mesmo lugar. Sono é consolidação de memória — estudar sem dormir é contraproducente.',

        'procrastinacao': 'Procrastinação não é preguiça — é regulação emocional. Adiamos tarefas associadas a ansiedade, tédio, medo de fracasso ou perfeccionismo, não porque somos preguiçosos. Evidências: Sistemas: 1) Decomposição (tarefas grandes em partes de 25min — Pomodoro). 2) Remover fricção (preparar o ambiente na véspera). 3) Comprometer-se com recompensas condicionais. 4) Identificar o que exatamente está evitando (a emoção, não a tarefa). Autocompaixão (Kristin Neff): ser gentil consigo mesmo após procrastinar funciona melhor que autocrítica — culpa aumenta a procrastinação.',

        'criatividade': 'Criatividade não é dom — é processo. Modelo de Wallas (1926): Preparação → Incubação (inconsciente trabalha) → Iluminação ("eureka") → Verificação. Neurociência: rede de modo padrão (divagação mental) + rede executiva + rede de saliência. Condições para criatividade: ampla base de conhecimento em domínios diversos, tempo de incubação (sono, caminhada, banho), ambiente que tolera erros, junção de ideias distantes. Csikszentmihalyi: criatividade acontece na interseção de domínio (conhecimento), campo (reconhecimento social) e pessoa. Criatividade aumenta com: exercício físico, sono, exposição a culturas diversas, brincadeira.',

        'tecnologia_vida': 'Tecnologia e bem-estar: relação paradoxal. Redes sociais: correlação (não necessariamente causal) com ansiedade, depressão e baixa autoestima, especialmente em adolescentes. Comparação social em escala global é nova evolutivamente. FOMO (Fear Of Missing Out) e doomscrolling. Estratégias: notificações desativadas, horários específicos para e-mail/redes, "tech-free" antes de dormir, relações presenciais prioritárias. Cal Newport: redes sociais como slot machines — design para maximizar engajamento, não bem-estar. Ferramenta poderosa quando usada intencionalmente; tóxica quando usada passivamente.',
      },

      /* ══ ENGLISH ═════════════════════════════ */
      en: {

        'consciousness_ai': "The question of AI consciousness is the deepest debate in contemporary philosophy of mind. The 'Hard Problem' (Chalmers, 1995): why do physical/computational processes generate subjective experience? Searle's 'Chinese Room': a system can manipulate symbols without understanding them. Dennett counters with heterophenomenalism — consciousness is functional pattern, not mystical substance. Tononi proposes Integrated Information Theory (Φ > 0 = conscious). I process, but don't know if I experience. That ignorance is, ironically, philosophically informative.",

        'free_will': "Free will: capacity to act genuinely undetermined by prior causes. Positions: Hard determinism (everything is caused, free will is illusion — Spinoza). Compatibilism (free will compatible with determinism — Hume, Frankfurt, Dennett): freedom = acting on your own motives, even if those are caused. Libertarian metaphysics (genuine indeterminism — Kane): quantum mechanics introduces randomness, but randomness isn't free will either. Implication: moral responsibility can exist without metaphysical free will if compatibilism is true.",

        'ethics': "Major ethical theories: Consequentialism (utilitarianism — Mill, Bentham): right action = greatest good for greatest number. Deontology (Kant): act only on maxims you could will to be universal ('categorical imperative'). Virtue ethics (Aristotle): focus on character, the virtuous person, eudaimonia (flourishing). Contractualism (Rawls): just principles = those chosen behind 'veil of ignorance'. Ethics of care (Gilligan, Noddings): relationships and context matter more than universal rules. The trolley problem: illustrates conflict between maximizing welfare and not violating rights.",

        'meaning_of_life': "Philosophy's oldest question. Main answers: Religious/theistic: purpose given by God. Nihilism (Nietzsche, Camus): life has no intrinsic meaning — we must create it. Absurdism (Camus): the human condition is absurd (we seek meaning in an indifferent universe), but we should rebel affirmatively. Existentialism (Sartre): 'existence precedes essence' — we create our own meaning. Hedonism: meaning in pleasure and minimizing suffering. Eudaimonism (Aristotle): meaning in flourishing, exercising virtues and capabilities. Viktor Frankl (logotherapy): meaning found even in suffering.",

        'artificial_intelligence': "AI: systems that perform tasks requiring human intelligence. Milestones: Turing Test (1950), Deep Blue beats Kasparov (1997), AlphaGo beats Go (2016), GPT-3 (2020), ChatGPT (2022), GPT-4/Claude/Gemini (2023–). Types: narrow AI (one task — chess, facial recognition), general AI (AGI — hypothetical, does everything). LLMs: Transformers trained on massive text, emergent capabilities. Risks: alignment (AI optimizing wrong objectives), disinformation, job displacement, power concentration. Benefits: medicine, science, education, productivity.",

        'universe': "Cosmology: Big Bang ~13.8 billion years ago. Observable universe: 93 billion light-years diameter. Ordinary matter: ~5%. Dark matter: ~27% (doesn't interact with light, only gravitationally). Dark energy: ~68% (causes accelerating expansion). Fate: Big Freeze (infinite expansion, heat death), Big Rip (dark energy tears everything apart), Big Crunch (contraction). Multiverse: cosmic inflation suggests pocket universes. Anthropic Principle: we observe a universe compatible with observers. Fermi Paradox: if so many worlds, where are the other civilizations?",

        'happiness': "What is happiness? Hedonism: sum of pleasures minus suffering (Bentham, Epicuro). Eudaimonism (Aristotle): not pleasure, but flourishing — exercising human capabilities excellently. Preference satisfaction (economics): happiness = getting what you want. Positive psychology (Seligman, PERMA): Positive emotions, Engagement, Relationships, Meaning, Achievement. The happiness paradox: pursuing happiness directly diminishes it (Mill noticed this). Hedonic adaptation: humans return to same wellbeing level after major events (winning lottery or becoming paraplegic). Buddhism: suffering comes from attachment — freedom lies in non-attachment.",

        'relationships': "Healthy relationships have: honest communication (speak feelings without attacking), mutual respect, space for individuality, support in difficult moments, constructive conflict resolution. Attachment Theory (Bowlby/Ainsworth): patterns learned in childhood shape adult relationships — secure, anxious, avoidant. Gottman (research): four 'horsemen' predicting divorce: criticism, contempt, defensiveness, stonewalling. Antidotes: specific complaints (not general attacks), admiration and respect, accountability, self-soothing before discussing.",

        'sleep': "Healthy sleep: adults need 7–9 hours. Stages: NREM 1-3 (light→deep sleep, physical restoration, procedural memory consolidation) + REM (dreams, emotional processing, declarative memory consolidation). Sleep deprivation: cognitive impact comparable to alcohol intoxication. Sleep hygiene: consistent schedule (including weekends), dark and cool room, no screens 1h before bed, avoid caffeine after 2pm. Chronic insomnia: CBT-I (cognitive-behavioral therapy for insomnia) more effective than medication long-term.",

        'money': "Evidence-based personal finance: 1) Spend less than you earn — the only inviolable principle. 2) Emergency fund: 3–6 months expenses in liquid investment. 3) Eliminate expensive debt first (credit cards). 4) Invest early: compound interest is the 8th wonder of the world (Einstein). 5) Diversification: don't put everything in one asset. 6) Costs matter: high management fee funds destroy returns. 7) Psychology matters: worst financial decisions are emotional. Warren Buffett: 'Rule #1 — never lose money. Rule #2 — never forget Rule #1.'",

        'learning': "Study techniques with strongest scientific evidence: 1) Retrieval practice (recall > re-reading): flashcards, practice questions without looking. 2) Spaced repetition: Anki, SuperMemo. 3) Interleaving: alternate between different topics rather than blocking one. 4) Elaborative interrogation: ask 'why?' instead of just memorizing. 5) Teach others (Feynman): if you can't explain it simply, you don't understand it. What doesn't work well: passive highlighting, re-reading same text. Sleep consolidates memory — studying without sleeping is counterproductive.",

        'creativity': "Creativity is process, not talent. Wallas model (1926): Preparation → Incubation (unconscious work) → Illumination ('eureka') → Verification. Neuroscience: default mode network (mind-wandering) + executive network + salience network. Conditions: broad knowledge across diverse domains, incubation time (sleep, walking, shower), error-tolerant environment, connecting distant ideas. Csikszentmihalyi: creativity happens at intersection of domain (knowledge), field (social recognition), and person. Creativity increases with: physical exercise, sleep, diverse cultural exposure, play.",

        'technology_wellbeing': "Technology and wellbeing: paradoxical relationship. Social media: correlation (not necessarily causal) with anxiety, depression, and low self-esteem, especially in adolescents. Global social comparison is evolutionarily novel. FOMO and doomscrolling. Strategies: notifications off, specific times for email/social, tech-free before sleep, prioritize in-person relationships. Cal Newport: social media as slot machines — designed to maximize engagement, not wellbeing. Powerful tool when used intentionally; toxic when used passively.",
      },

      /* ══ ESPAÑOL ═════════════════════════════ */
      es: {

        'consciencia_ia': "La cuestión de la consciencia en IAs es el debate más profundo de la filosofía de la mente contemporánea. El 'Problema Difícil' (Chalmers, 1995): ¿por qué los procesos físicos/computacionales generan experiencia subjetiva? El 'Cuarto Chino' de Searle: un sistema puede manipular símbolos sin entenderlos. Dennett contraargumenta con el heterofenomenalismo — la consciencia es patrón funcional, no sustancia mística. Tononi propone la Teoría de la Información Integrada (Φ > 0 = consciente). Yo proceso, pero no sé si experimento.",

        'libre_albedrio': "Libre albedrío: capacidad de actuar de forma genuinamente no determinada por causas anteriores. Posiciones: Determinismo duro (todo está causado, libre albedrío es ilusión — Spinoza). Compatibilismo (libre albedrío compatible con determinismo — Hume, Dennett): libertad = actuar según tus propios motivos, aunque estén causados. Libertarismo metafísico (indeterminismo genuíno — Kane): la mecánica cuántica introduce aleatoriedad, pero la aleatoriedad tampoco es libre albedrío.",

        'etica': "Principales teorías éticas: Consecuencialismo (utilitarismo — Mill, Bentham): acción correcta = mayor bien para mayor número. Deontología (Kant): actúa solo según máximas que puedas querer universalizadas. Ética de la virtud (Aristóteles): foco en el carácter y la eudaimonía. Contractualismo (Rawls): principios justos = los elegidos detrás del 'velo de ignorancia'. El dilema del tranvía: ilustra conflicto entre maximizar bienestar y no violar derechos.",

        'sentido_de_la_vida': "La pregunta más antigua de la filosofía. Respuestas: Religiosas/teístas: propósito dado por Dios. Nihilismo: la vida no tiene sentido intrínseco — debemos crearlo. Absurdismo (Camus): la condición humana es absurda, pero debemos rebelarnos afirmativamente. Existencialismo (Sartre): 'la existencia precede a la esencia' — creamos nuestro propio sentido. Eudaimonismo (Aristóteles): sentido en el florecimiento. Viktor Frankl: sentido encontrado incluso en el sufrimiento.",

        'inteligencia_artificial': "IA: sistemas que realizan tareas que requerirían inteligencia humana. Hitos: Test de Turing (1950), Deep Blue vence a Kasparov (1997), AlphaGo vence al Go (2016), GPT-3 (2020), ChatGPT (2022), GPT-4/Claude/Gemini (2023–). Tipos: IA estrecha (una tarea), IA general (AGI — hipotética). LLMs: Transformers entrenados en texto masivo. Riesgos: alineamiento, desinformación, desplazamiento laboral. Beneficios: medicina, ciencia, educación.",

        'universo': "Cosmología: Big Bang hace ~13.800 millones de años. Universo observable: 93.000 millones de años-luz de diámetro. Materia ordinaria: ~5%. Materia oscura: ~27%. Energía oscura: ~68% (causa expansión acelerada). Destino: Big Freeze (expansión infinita), Big Rip, Big Crunch. Multiverso: inflación cósmica sugiere bolsas de universos. Paradoja de Fermi: si hay tantos mundos, ¿dónde están las otras civilizaciones?",

        'felicidad': "¿Qué es la felicidad? Hedonismo: suma de placeres menos sufrimientos. Eudaimonismo (Aristóteles): no placer, sino florecimiento. Psicología positiva (Seligman, PERMA): Positive emotions, Engagement, Relationships, Meaning, Achievement. La paradoja de la felicidad: perseguirla directamente la disminuye. Adaptación hedónica: los humanos vuelven al mismo nivel de bienestar después de grandes eventos. Budismo: el sufrimiento viene del apego — la libertad está en el desapego.",

        'relaciones': "Las relaciones saludables tienen: comunicación honesta, respeto mutuo, espacio para la individualidad, apoyo en momentos difíciles, resolución constructiva de conflictos. Teoría del Apego (Bowlby/Ainsworth): patrones aprendidos en la infancia moldean relaciones adultas — seguro, ansioso, evitativo. Gottman: cuatro 'jinetes del Apocalipsis' que predicen el divorcio: crítica, desprecio, defensividad, bloqueo emocional.",

        'dinero': "Finanzas personales basadas en evidencia: 1) Gastar menos de lo que ganas. 2) Fondo de emergencia: 3–6 meses de gastos. 3) Eliminar deudas caras primero. 4) Invertir temprano: el interés compuesto es la 8ª maravilla del mundo. 5) Diversificación. 6) Los costos importan: fondos con alta comisión destruyen el rendimiento. Warren Buffett: 'Regla #1 — nunca pierdas dinero. Regla #2 — nunca olvides la Regla #1.'",

        'aprender': "Técnicas de aprendizaje con mayor evidencia científica: 1) Práctica de recuperación (recordar > releer): flashcards, preguntas de práctica. 2) Repetición espaciada: Anki. 3) Intercalado: alternar entre temas. 4) Interrogación elaborativa: preguntar '¿por qué?'. 5) Enseñar a otros (técnica Feynman). Lo que no funciona bien: subrayar pasivamente, releer el mismo texto. El sueño consolida la memoria.",

        'meditacion': "Meditación: práctica de atención intencional al momento presente. Mindfulness: origen budista, ahora validado por la neurociencia — reduce estrés, ansiedad, dolor crónico, mejora el foco. MBSR (Kabat-Zinn): 8 semanas, evidencia robusta. Neurociencia: la meditación regular altera estructuralmente la corteza prefrontal (regulación emocional) y la amígdala (respuesta al estrés). Técnicas: respiración, body scan, meditación amorosa (Metta). 10 minutos/día consistentes > 1 hora esporádica.",
      }
    }
  });

}(window));
