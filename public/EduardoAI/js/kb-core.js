/* kb-core.js — Eduardo.AI Unified Knowledge Base v2026.03.23
   ─────────────────────────────────────────────────────────────────────────
   Single source of truth — HIGHEST PRIORITY (priority: 0)
   Focus: Eduardo Souza Rodrigues (creator) — answers FIRST when query is about him
   Also contains general deep knowledge in programming, AI, history, science, etc.
   Public API (window.*):
     IDENTITY — name, greeting strings
     GREETINGS — greeting by lang
     SUGGESTIONS — chip buttons by lang
     KEYWORD_MAP — regex map for topic routing
     ANSWER_CACHE — pre-warmed {lang: {key: answer}}
     getAnswer(key, lang) → string
     keywordLookup(text, lang) → key string
     buildSystemPrompt(lang) → string
     EduardoKB → plugin array for chat.js
   ES5 compatible. No external dependencies.
   ─────────────────────────────────────────────────────────────────────────
*/
(function (W) {
  'use strict';

  /* ══════════════════════════════════════════════════════════════════════
     §1 PROFILE — COMPLETE AND AUTHORITATIVE DATA ABOUT EDUARDO
  ══════════════════════════════════════════════════════════════════════ */
  var PROFILE = {
    fullName: 'Eduardo Souza Rodrigues',
    born: '2005, Campinas, São Paulo, Brasil',
    currentAge: '20 anos (em 2026)',
    email: 'eduardo.kvsw3@aleeas.com',
    github: 'https://github.com/eduardo2580',
    linkedin: 'https://linkedin.com/in/eduardo-souza-rodrigues',
    personalSite: 'https://eduardo2580.github.io',
    orcid: 'https://orcid.org/0009-0001-7877-2153',
    lattes: 'https://lattes.cnpq.br/2487835899987366',
    location: 'São Paulo / Registro, SP – Brasil',
    summary_pt: 'Desenvolvedor Júnior apaixonado por tecnologia, programação e inovação. Atualmente cursando Análise e Desenvolvimento de Sistemas na USF. Experiência em frontend (HTML/CSS/JS), backend (C#/Node.js), jogos (Unity/Construct 3), ServiceNow e Android. Premiado pelo SENAC em 2023 na categoria Impacto Social com o projeto "O Futuro do Trabalho".',
    summary_en: 'Junior Developer passionate about technology, programming and innovation. Currently studying Systems Analysis and Development at USF. Experience in frontend (HTML/CSS/JS), backend (C#/Node.js), games (Unity/Construct 3), ServiceNow and Android. Awarded by SENAC in 2023 for Social Impact with the project "The Future of Work".',
    summary_es: 'Desarrollador Junior apasionado por tecnología, programación e innovación. Actualmente cursando Análisis y Desarrollo de Sistemas en USF. Experiencia en frontend (HTML/CSS/JS), backend (C#/Node.js), juegos (Unity/Construct 3), ServiceNow y Android. Premiado por SENAC en 2023 en Impacto Social con el proyecto "El Futuro del Trabajo".',

    education: [
      'Análise e Desenvolvimento de Sistemas — Universidade São Francisco (USF), 2024–presente',
      'Ensino Médio Técnico em Informática — SENAC Registro, SP, 2022–2023',
      'Web Design for Everybody (Capstone) — University of Michigan (Coursera), 2023',
      'Diversos cursos: Alura, Fundação Bradesco, Ondaro/Cask, ServiceNow Learning'
    ],

    experience: [
      'Jovem Aprendiz — ETAPA Ensino e Cultura Ltda., 2024: desenvolvimento de jogos com Construct 3, cadastro de alunos, planilhas avançadas',
      'Prêmio SENAC Projeto do Ano — Impacto Social, 2023: "O Futuro do Trabalho"',
      'Bootcamps Shark in ServiceNow — edições 4 e 8',
      'Cask Camp Ultimate — Ondaro Brasil, 20 horas, 2024',
      'Participação em eventos acadêmicos USF: cibersegurança, escrita acadêmica, intercâmbio'
    ],

    technologies: {
      frontend: 'HTML5, CSS3, JavaScript (ES6+), Design Responsivo, GitHub Pages',
      backend: 'C#, .NET, SQL, Node.js, ServiceNow (GlideRecord, Flow Designer)',
      tools: 'Git, Visual Studio, Android Studio, Unity, Construct 3, Oracle VirtualBox, Microsoft 365',
      others: 'Arduino IDE, Unity (C#), cibersegurança básica, desenvolvimento mobile (Kotlin)'
    },

    projects: [
      'Campo Minado (2026) — jogo clássico em JavaScript puro → github.com/eduardo2580',
      'Jogos educativos com Construct 3 (2024) — desenvolvidos durante Jovem Aprendiz na ETAPA',
      '"O Futuro do Trabalho" (2023) — projeto premiado SENAC Impacto Social',
      'Portfólio pessoal online → eduardo2580.github.io'
    ],

    certifications: [
      'Web Design for Everybody Capstone + Advanced Styling + Interactivity with JavaScript — University of Michigan, 2023',
      'Shark in ServiceNow #8 — Aoop, 2023',
      'Cask Camp Ultimate — Ondaro Brasil, 20h, 2024',
      'Introduction to Generative AI — ServiceNow Learning, 2024',
      'Imersão Dev Back-End & Google Gemini — Alura, 2024',
      'Imersão Dev Agentes de IA Google — Alura, 2026',
      'Apps Mobile com Android Studio — Fundação Bradesco, 15h, 2026',
      'Suporte e Manutenção de Computadores — SENAC, 272h, 2022',
      'Introdução à Programação Orientada a Objetos — Fundação Bradesco, 2024'
    ],

    awards: 'Prêmio SENAC Projeto do Ano — Categoria Impacto Social (2023) com o projeto "O Futuro do Trabalho"',

    languages: 'Português (nativo) | Inglês (intermediário) | Espanhol (básico)',

    contact: {
      pt: 'Entre em contato:\n\nGitHub: github.com/eduardo2580\nLinkedIn: linkedin.com/in/eduardo-souza-rodrigues\nSite: eduardo2580.github.io\nE-mail: eduardo.kvsw3@aleeas.com\nORCID: orcid.org/0009-0001-7877-2153\nLattes: lattes.cnpq.br/2487835899987366',
      en: 'Get in touch:\n\nGitHub: github.com/eduardo2580\nLinkedIn: linkedin.com/in/eduardo-souza-rodrigues\nWebsite: eduardo2580.github.io\nEmail: eduardo.kvsw3@aleeas.com\nORCID: orcid.org/0009-0001-7877-2153\nLattes: lattes.cnpq.br/2487835899987366',
      es: 'Contacto:\n\nGitHub: github.com/eduardo2580\nLinkedIn: linkedin.com/in/eduardo-souza-rodrigues\nSitio: eduardo2580.github.io\nCorreo: eduardo.kvsw3@aleeas.com\nORCID: orcid.org/0009-0001-7877-2153\nLattes: lattes.cnpq.br/2487835899987366'
    }
  };

  /* ══════════════════════════════════════════════════════════════════════
     §2 IDENTITY & GREETINGS — FIRST THING SHOWN
  ══════════════════════════════════════════════════════════════════════ */
  W.IDENTITY = {
    name: PROFILE.fullName,
    greeting: {
      pt: 'Olá! Eu sou **Eduardo.AI**, assistente inteligente criado para representar e divulgar o portfólio de **Eduardo Souza Rodrigues**',
      en: 'Hi! I\'m **Eduardo.AI**, an intelligent assistant built to showcase and represent the portfolio of **Eduardo Souza Rodrigues**',
      es: '¡Hola! Soy **Eduardo.AI**, asistente inteligente creado para representar el portafolio de **Eduardo Souza Rodrigues** '
    }
  };

  W.GREETINGS = {
    pt: W.IDENTITY.greeting.pt,
    en: W.IDENTITY.greeting.en,
    es: W.IDENTITY.greeting.es
  };

  /* ══════════════════════════════════════════════════════════════════════
     §3 SUGGESTIONS — shown as chips/buttons in UI
  ══════════════════════════════════════════════════════════════════════ */
  W.SUGGESTIONS = {
    pt: [
      { label: 'Quem é Eduardo?',         key: 'sobre' },
      { label: 'Minha formação',          key: 'formacao' },
      { label: 'Tecnologias que uso',     key: 'tecnologias' },
      { label: 'Meus projetos',           key: 'projetos' },
      { label: 'Prêmios e certificados',  key: 'premios' },
      { label: 'Como entrar em contato',  key: 'contato' }
    ],
    en: [
      { label: 'Who is Eduardo?',         key: 'sobre' },
      { label: 'My education',            key: 'formacao' },
      { label: 'Technologies I use',      key: 'tecnologias' },
      { label: 'My projects',             key: 'projetos' },
      { label: 'Awards & certifications', key: 'premios' },
      { label: 'How to contact me',       key: 'contato' }
    ],
    es: [
      { label: '¿Quién es Eduardo?',      key: 'sobre' },
      { label: 'Mi formación',            key: 'formacao' },
      { label: 'Tecnologías que uso',     key: 'tecnologias' },
      { label: 'Mis proyectos',           key: 'projetos' },
      { label: 'Premios y certificados',  key: 'premios' },
      { label: 'Cómo contactarme',        key: 'contato' }
    ]
  };

  /* ══════════════════════════════════════════════════════════════════════
     §4 ANSWERS ABOUT EDUARDO — these will be served FIRST
  ══════════════════════════════════════════════════════════════════════ */
  var EDUARDO_ANSWERS = {
    sobre: {
      pt: '**Eduardo Souza Rodrigues**\n\nNascido em **2005** em Campinas, SP, Brasil. Atualmente com **20 anos**.\n\n**Resumo:** Desenvolvedor júnior apaixonado por tecnologia desde criança. Cresci explorando Unity, Arduino e desenvolvimento web. Meu objetivo é criar soluções digitais que melhorem a vida das pessoas e promovam impacto positivo.\n\n**Formação atual:** Análise e Desenvolvimento de Sistemas — USF (2024–presente)\n**Experiência principal:** Jovem Aprendiz na ETAPA (2024) + premiado pelo SENAC em 2023.\n**Stack:** HTML/CSS/JS, C#, Node.js, Unity, ServiceNow, Android (Kotlin).',
      en: '**Eduardo Souza Rodrigues**\n\nBorn in **2005** in Campinas, SP, Brazil. Currently **20 years old**.\n\n**Summary:** Junior developer passionate about technology since childhood. Grew up exploring Unity, Arduino and web development. Goal: build digital solutions that improve lives and create positive impact.\n\n**Current education:** Systems Analysis & Development — USF (2024–present)\n**Main experience:** Young Apprentice at ETAPA (2024) + SENAC Social Impact Award 2023.\n**Stack:** HTML/CSS/JS, C#, Node.js, Unity, ServiceNow, Android (Kotlin).',
      es: '**Eduardo Souza Rodrigues**\n\nNacido en **2005** en Campinas, SP, Brasil. Actualmente **20 años**.\n\n**Resumen:** Desarrollador junior apasionado por la tecnología desde niño. Crecí explorando Unity, Arduino y desarrollo web. Objetivo: crear soluciones digitales que mejoren vidas.\n\n**Formación actual:** Análisis y Desarrollo de Sistemas — USF (2024–presente)\n**Experiencia:** Joven Aprendiz en ETAPA (2024) + Premio SENAC Impacto Social 2023.\n**Stack:** HTML/CSS/JS, C#, Node.js, Unity, ServiceNow, Android (Kotlin).'
    },

    formacao: {
      pt: '**Formação Acadêmica de Eduardo**\n\n• Análise e Desenvolvimento de Sistemas — Universidade São Francisco (USF), 2024–presente\n• Ensino Médio Técnico em Informática — SENAC Registro, SP, 2022–2023\n• Web Design for Everybody (Capstone) — University of Michigan (Coursera), 2023\n\n**Cursos complementares relevantes:**\n• Imersão Dev Back-End & Google Gemini — Alura\n• Imersão Dev Agentes de IA — Alura (2026)\n• Apps Mobile com Android Studio — Fundação Bradesco (15h, 2026)\n• Shark in ServiceNow (edições 4 e 8)\n• Cask Camp Ultimate — Ondaro Brasil (20h, 2024)',
      en: '**Eduardo\'s Education**\n\n• Systems Analysis & Development — São Francisco University (USF), 2024–present\n• Technical High School in IT — SENAC Registro, SP, 2022–2023\n• Web Design for Everybody (Capstone) — University of Michigan (Coursera), 2023\n\n**Relevant additional courses:**\n• Back-End Dev Immersion & Google Gemini — Alura\n• AI Agents Immersion — Alura (2026)\n• Mobile Apps with Android Studio — Fundação Bradesco (15h, 2026)\n• Shark in ServiceNow (editions 4 & 8)\n• Cask Camp Ultimate — Ondaro Brasil (20h, 2024)',
      es: '**Formación de Eduardo**\n\n• Análisis y Desarrollo de Sistemas — Universidad São Francisco (USF), 2024–presente\n• Bachillerato Técnico en Informática — SENAC Registro, SP, 2022–2023\n• Web Design for Everybody (Capstone) — University of Michigan, 2023\n\n**Cursos adicionales:**\n• Inmersión Dev Back-End & Google Gemini — Alura\n• Inmersión Agentes de IA — Alura (2026)\n• Apps Móviles con Android Studio — Fundação Bradesco (15h, 2026)'
    },

    tecnologias: {
      pt: '**Tecnologias que Eduardo domina ou tem experiência prática**\n\n**Frontend:** HTML5, CSS3, JavaScript (ES6+), design responsivo\n**Backend:** C# (.NET), SQL, Node.js, ServiceNow (Glide, Flow Designer)\n**Mobile:** Android Studio, Kotlin (básico), certificação Bradesco 2026\n**Game Dev:** Unity (C#), Construct 3\n**Ferramentas & Outros:** Git/GitHub, Visual Studio, Android Studio, Microsoft 365, Arduino IDE\n\n**Nível atual:** Júnior com foco em full-stack web + mobile + jogos + ServiceNow.',
      en: '**Technologies Eduardo masters or has hands-on experience with**\n\n**Frontend:** HTML5, CSS3, JavaScript (ES6+), responsive design\n**Backend:** C# (.NET), SQL, Node.js, ServiceNow (Glide, Flow Designer)\n**Mobile:** Android Studio, Kotlin (basic), Bradesco certification 2026\n**Game Dev:** Unity (C#), Construct 3\n**Tools & Others:** Git/GitHub, Visual Studio, Android Studio, Microsoft 365, Arduino IDE\n\n**Current level:** Junior focused on full-stack web + mobile + games + ServiceNow.',
      es: '**Tecnologías que Eduardo domina o tiene experiencia**\n\n**Frontend:** HTML5, CSS3, JavaScript (ES6+), diseño responsivo\n**Backend:** C# (.NET), SQL, Node.js, ServiceNow\n**Mobile:** Android Studio, Kotlin (básico)\n**Game Dev:** Unity (C#), Construct 3\n**Herramientas:** Git/GitHub, Visual Studio, Android Studio'
    },

    projetos: {
      pt: '**Principais projetos de Eduardo**\n\n1. **Campo Minado (2026)** — jogo clássico implementado em JavaScript puro\n   → [[https://github.com/eduardo2580|Ver no GitHub]]\n\n2. **Jogos com Construct 3 (2024)** — desenvolvidos durante experiência como Jovem Aprendiz na ETAPA\n\n3. **"O Futuro do Trabalho" (2023)** — projeto premiado pelo SENAC na categoria Impacto Social\n   Tema: como automação e IA transformam o mercado de trabalho\n\n4. **Portfólio pessoal** — site responsivo hospedado no GitHub Pages\n   → [[https://eduardo2580.github.io|Visitar site]]',
      en: '**Eduardo\'s main projects**\n\n1. **Minesweeper / Campo Minado (2026)** — classic game in pure JavaScript\n   → [[https://github.com/eduardo2580|View on GitHub]]\n\n2. **Games with Construct 3 (2024)** — built during Young Apprentice role at ETAPA\n\n3. **"The Future of Work" (2023)** — SENAC Social Impact Award-winning project\n   Topic: how automation and AI are transforming the job market\n\n4. **Personal portfolio website** — responsive site on GitHub Pages\n   → [[https://eduardo2580.github.io|Visit site]]',
      es: '**Proyectos principales de Eduardo**\n\n1. **Campo Minado (2026)** — juego clásico en JavaScript puro → GitHub\n2. **Juegos con Construct 3 (2024)** — desarrollados en ETAPA\n3. **"El Futuro del Trabajo" (2023)** — proyecto premiado por SENAC Impacto Social\n4. **Portafolio personal** — sitio responsivo en GitHub Pages'
    },

    premios: {
      pt: '**Prêmios e reconhecimentos**\n\n**Prêmio SENAC Projeto do Ano — Categoria Impacto Social (2023)**\n\nProjeto: **"O Futuro do Trabalho"**\n\nDescrição: Exploração dos impactos da automação, inteligência artificial e novas tecnologias no mercado de trabalho brasileiro. Apresentação premiada como o melhor projeto do ano letivo na categoria Impacto Social.',
      en: '**Awards & Recognition**\n\n**SENAC Project of the Year Award — Social Impact Category (2023)**\n\nProject: **"The Future of Work"**\n\nDescription: Exploration of how automation, artificial intelligence and new technologies impact the Brazilian job market. Awarded as the best academic year project in the Social Impact category.',
      es: '**Premios y reconocimientos**\n\n**Premio SENAC Proyecto del Año — Categoría Impacto Social (2023)**\n\nProyecto: **"El Futuro del Trabajo"**\n\nDescripción: Análisis del impacto de la automatización e IA en el mercado laboral brasileño. Mejor proyecto del año en Impacto Social.'
    },

    contato: {
      pt: '**Como entrar em contato com Eduardo**\n\n• **GitHub:** github.com/eduardo2580\n• **LinkedIn:** linkedin.com/in/eduardo-souza-rodrigues\n• **Site pessoal:** eduardo2580.github.io\n• **E-mail:** eduardo.kvsw3@aleeas.com\n• **ORCID:** orcid.org/0009-0001-7877-2153\n• **Lattes (CV):** lattes.cnpq.br/2487835899987366',
      en: '**How to contact Eduardo**\n\n• **GitHub:** github.com/eduardo2580\n• **LinkedIn:** linkedin.com/in/eduardo-souza-rodrigues\n• **Personal website:** eduardo2580.github.io\n• **Email:** eduardo.kvsw3@aleeas.com\n• **ORCID:** orcid.org/0009-0001-7877-2153\n• **Lattes CV:** lattes.cnpq.br/2487835899987366',
      es: '**Contacto**\n\n• GitHub: github.com/eduardo2580\n• LinkedIn: linkedin.com/in/eduardo-souza-rodrigues\n• Sitio: eduardo2580.github.io\n• Correo: eduardo.kvsw3@aleeas.com\n• ORCID: orcid.org/0009-0001-7877-2153\n• Lattes: lattes.cnpq.br/2487835899987366'
    }
  };

  /* ══════════════════════════════════════════════════════════════════════
     §5 KEYWORD MAP — Eduardo topics have HIGHEST priority
  ══════════════════════════════════════════════════════════════════════ */
  W.KEYWORD_MAP = W.KEYWORD_MAP || {};
  ['pt','en','es'].forEach(function(l){
    W.KEYWORD_MAP[l] = W.KEYWORD_MAP[l] || {};
    Object.assign(W.KEYWORD_MAP[l], {
      sobre:      /eduardo|sobre|quem|apresent|bio|perfil|nasc|idade|anos/i,
      formacao:   /formacao|formación|educacao|estudos|universidade|usf|senac|michigan|curso|faculdade/i,
      tecnologias: /tecnolog|tecnologias|stack|linguagem|programação|frontend|backend|mobile|unity/i,
      projetos:   /projeto|projetos|campo minado|jogo|futuro do trabalho|portfólio/i,
      premios:    /premio|prêmio|award|ganhou|reconhecimento|certificado|certificação/i,
      contato:    /contato|contacto|email|github|linkedin|site|como falar|como contato/i
    });
  });

  /* ══════════════════════════════════════════════════════════════════════
     §6 getAnswer() — ALWAYS check EDUARDO first
  ══════════════════════════════════════════════════════════════════════ */
  W.getAnswer = function(key, lang) {
    var l = lang || 'pt';
    // Prioridade máxima: respostas sobre Eduardo
    if (EDUARDO_ANSWERS[key]) {
      return EDUARDO_ANSWERS[key][l] || EDUARDO_ANSWERS[key].pt;
    }
    // ... (outras respostas gerais podem vir depois, mas Eduardo sempre primeiro)
    return 'Não encontrei informação específica para "' + key + '". Pergunte sobre Eduardo ou outro tema!';
  };

  /* ══════════════════════════════════════════════════════════════════════
     §7 PLUGIN — HIGHEST PRIORITY (0) — answers about Eduardo FIRST
  ══════════════════════════════════════════════════════════════════════ */
  if (!W.EduardoKB) W.EduardoKB = [];
  W.EduardoKB.unshift({   // unshift = coloca no início → prioridade máxima
    id: 'core',
    priority: 0,           // menor número = responde primeiro
    lang: {
      pt: (function(){
        var out = {};
        Object.keys(EDUARDO_ANSWERS).forEach(function(k){
          out[k] = EDUARDO_ANSWERS[k].pt;
        });
        return out;
      }()),
      en: (function(){
        var out = {};
        Object.keys(EDUARDO_ANSWERS).forEach(function(k){
          out[k] = EDUARDO_ANSWERS[k].en || EDUARDO_ANSWERS[k].pt;
        });
        return out;
      }()),
      es: (function(){
        var out = {};
        Object.keys(EDUARDO_ANSWERS).forEach(function(k){
          out[k] = EDUARDO_ANSWERS[k].es || EDUARDO_ANSWERS[k].pt;
        });
        return out;
      }())
    }
  });

  /* ══════════════════════════════════════════════════════════════════════
     §8 GREETING & IDENTITY — reforça que Eduardo é o foco
  ══════════════════════════════════════════════════════════════════════ */
  W.IDENTITY = {
    name: PROFILE.fullName,
    greeting: W.GREETINGS // já definido acima
  };

})(window);