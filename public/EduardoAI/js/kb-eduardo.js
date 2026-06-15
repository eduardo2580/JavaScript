/* kb-eduardo.js — Eduardo.AI Portfolio Knowledge Base v2026.03.20
   Converted from knowledge.json — full PT/EN/ES coverage.
   Contains: bio, portfolio, projects, tech stack, certifications,
   experience, education, awards, contact, career advice.
   Priority 20 (highest) — Eduardo-specific answers always win.
   ES5 compatible. No dependencies.
*/
(function(W) {
  'use strict';

  /* ════════════════════════════════════════════
     IDENTITY + GREETINGS (replaces kb-core identity)
  ════════════════════════════════════════════ */
  W.IDENTITY = {
    name: 'Eduardo Souza Rodrigues',
    greeting: {
      pt: 'Olá! Sou Eduardo.AI, o assistente inteligente de Eduardo Souza Rodrigues — desenvolvedor nascido em 2005 em Campinas, SP. Posso responder sobre Eduardo, seus projetos, habilidades e certificações, além de tecnologia, ciência, matemática, medicina e muito mais. Como posso ajudar?',
      en: "Hi! I'm Eduardo.AI, the intelligent assistant of Eduardo Souza Rodrigues — a developer born in 2005 in Campinas, SP, Brazil. I can answer about Eduardo, his projects, skills and certifications, as well as technology, science, math, medicine and more. How can I help?",
      es: '¡Hola! Soy Eduardo.AI, el asistente inteligente de Eduardo Souza Rodrigues — desarrollador nacido en 2005 en Campinas, SP, Brasil. Puedo responder sobre Eduardo, sus proyectos, habilidades y certificaciones, además de tecnología, ciencia, matemáticas, medicina y más. ¿En qué puedo ayudarte?'
    }
  };

  W.GREETINGS = {
    pt: W.IDENTITY.greeting.pt,
    en: W.IDENTITY.greeting.en,
    es: W.IDENTITY.greeting.es
  };

  /* ════════════════════════════════════════════
     MAIN KB PLUGIN
  ════════════════════════════════════════════ */
  if (!W.EduardoKB) W.EduardoKB = [];

  W.EduardoKB.push({
    id: 'eduardo',
    priority: 20,
    lang: {

      /* ══ PORTUGUÊS ══════════════════════════ */
      pt: {

        /* ── Quem é Eduardo ── */
        'quem_e_eduardo': 'Eduardo Souza Rodrigues é um Desenvolvedor Junior nascido em 2005, em Campinas, SP, Brasil. Formado no Ensino Médio Técnico em Informática pelo SENAC Registro, atualmente cursa Análise e Desenvolvimento de Sistemas na Universidade São Francisco (USF). É apaixonado por criar soluções digitais que melhoram a vida das pessoas e promovem o desenvolvimento sustentável. Desde a infância tem experiência prática com software e hardware, incluindo Unity, Arduino IDE e Construct 3.',

        'sobre_eduardo': 'Eduardo Souza Rodrigues — Desenvolvedor Junior, 2005, Campinas, SP. Stack principal: HTML5, CSS3, JavaScript, C#, SQL, Node.js, Unity, ServiceNow. Formação: SENAC (Técnico em Informática) + USF (ADS, em andamento). Premiações: Projeto do Ano Letivo em Impacto Social — SENAC 2023. Certificações: Universidade de Michigan (Web Design), ServiceNow (Shark + Cask), Alura, Fundação Bradesco.',

        'eduardo_desenvolvedor': 'Eduardo é um desenvolvedor júnior com experiência em desenvolvimento web (HTML5, CSS3, JavaScript), scripting C# para Unity, SQL e plataforma ServiceNow. Participou de bootcamps intensivos (Shark in ServiceNow edições 4 e 8, Cask Camp 20h) e imersões da Alura (Back-End, Google Gemini, Agentes de IA). Possui visão de impacto social e sustentabilidade nas soluções que desenvolve.',

        /* ── Portfólio / contato ── */
        'portfolio': 'O portfólio de Eduardo está disponível em **[[https://eduardo2580.github.io/|eduardo2580.github.io]]** e apresenta seus projetos de desenvolvimento web, jogos e código aberto. GitHub: **[[https://github.com/eduardo2580|github.com/eduardo2580]]** (projetos mais recentes). LinkedIn: **[[https://www.linkedin.com/in/eduardo-souza-rodrigues|linkedin.com/in/eduardo-souza-rodrigues]]**.',

        'contato': 'Como entrar em contato com Eduardo:\n\n**GitHub:** [[https://github.com/eduardo2580|github.com/eduardo2580]]\n**LinkedIn:** [[https://www.linkedin.com/in/eduardo-souza-rodrigues|linkedin.com/in/eduardo-souza-rodrigues]]\n**Portfólio:** [[https://eduardo2580.github.io/|eduardo2580.github.io]]\n**ORCID:** [[https://orcid.org/0009-0001-7877-2153|0009-0001-7877-2153]]\n**Lattes:** [[https://lattes.cnpq.br/2487835899987366|lattes.cnpq.br]]',

        'github': 'GitHub de Eduardo: **[[https://github.com/eduardo2580|github.com/eduardo2580]]** — contém seus projetos mais recentes, incluindo Campo Minado (2026), contribuições open-source e código das imersões da Alura. Perfil ativo com repositórios de desenvolvimento web, jogos e experimentos com IA.',

        'linkedin': 'LinkedIn de Eduardo: **[[https://www.linkedin.com/in/eduardo-souza-rodrigues|linkedin.com/in/eduardo-souza-rodrigues]]** — perfil profissional com histórico de experiências, certificações e projetos. Ideal para contato profissional e oportunidades de trabalho.',

        'redes_sociais': 'Eduardo está presente em:\n• **GitHub:** [[https://github.com/eduardo2580|github.com/eduardo2580]]\n• **LinkedIn:** [[https://www.linkedin.com/in/eduardo-souza-rodrigues|linkedin.com/in/eduardo-souza-rodrigues]]\n• **Portfólio:** [[https://eduardo2580.github.io/|eduardo2580.github.io]]\n• **Fediverso** (rede social federada)\n• **ORCID:** [[https://orcid.org/0009-0001-7877-2153|orcid.org]]\n• **Lattes:** [[https://lattes.cnpq.br/2487835899987366|cnpq.br]]',

        /* ── Projetos ── */
        'projetos': 'Projetos de Eduardo Souza Rodrigues:\n\n**Campo Minado (2026)** — programa de Minesweeper desenvolvido em 2026, disponível no GitHub.\n\n**Jovem Aprendiz — ETAPA (2024)** — construiu jogos com Construct 3, realizou cadastramento e organizou planilhas.\n\n**O Futuro do Trabalho (2023)** — projeto acadêmico no SENAC premiado como Melhor Projeto de Impacto Social.\n\n**Imersões Alura** — projetos das imersões Back-End Dev, Google Gemini e Agentes de IA.\n\nPortfólio completo: [[https://eduardo2580.github.io/|eduardo2580.github.io]]',

        'campo_minado': 'Campo Minado é um programa de Minesweeper desenvolvido por Eduardo em 2026. Disponível no GitHub em [[https://github.com/eduardo2580|github.com/eduardo2580]]. Demonstra suas habilidades em lógica de programação e desenvolvimento de aplicações.',

        'futuro_do_trabalho': 'O Futuro do Trabalho foi o projeto acadêmico desenvolvido por Eduardo no SENAC em 2023. O projeto foi premiado com o **Prêmio SENAC de Projeto do Ano Letivo na categoria Impacto Social**, destacando-se pela análise das transformações no mercado de trabalho e propostas de soluções tecnológicas com impacto social positivo.',

        'jovem_aprendiz': 'Como Jovem Aprendiz na ETAPA Ensino e Cultura Ltda. (2024), Eduardo construiu jogos utilizando a plataforma Construct 3, realizou cadastramento de jogos e organizou planilhas. Essa experiência aprimorou suas habilidades práticas em desenvolvimento de jogos e gestão de dados.',

        /* ── Tecnologias ── */
        'tecnologias': 'Stack tecnológico de Eduardo:\n\n**Frontend:** HTML5, CSS3, JavaScript, Design Responsivo, GitHub Pages\n\n**Backend & Plataformas:** C#, SQL, Node.js, ServiceNow, Windows Forms\n\n**Ferramentas:** Git, Visual Studio, Oracle VirtualBox, Microsoft 365, Android Studio\n\n**Outros:** Unity (jogos), Arduino IDE, Construct 3, fundamentos de Cibersegurança',

        'stack_tecnico': 'Eduardo domina: HTML5, CSS3, JavaScript (certificado Universidade de Michigan), C# (Unity e .NET), SQL, Node.js, ServiceNow (certificações Shark + Cask), Git/GitHub, Android Studio, Unity 3D, Construct 3, Arduino IDE. Tem familiaridade com Visual Studio, Oracle VirtualBox e Microsoft 365.',

        /* ── Habilidades específicas ── */
        'habilidades_web': 'Desenvolvimento Web de Eduardo: HTML5, CSS3 com design responsivo, JavaScript interativo — tudo certificado pela Universidade de Michigan no programa Web Design for Everybody (2023). Seus projetos web incluem GitHub Pages e design responsivo com boas práticas de acessibilidade e SEO.',

        'habilidades_jogos': 'Desenvolvimento de jogos: Eduardo usa **Unity com C#** para jogos 2D/3D e **Construct 3** para jogos sem código ou com JavaScript leve. Experiência desde a infância com Unity. Como Jovem Aprendiz na ETAPA construiu jogos com Construct 3.',

        'habilidades_ia': 'Eduardo em IA: participou das **Imersões Dev da Alura** — Back-End Dev, Dev com Google Gemini (2024) e Agentes de IA Google (2026). Completou "Introduction to Generative AI" pelo ServiceNow Learning (2024). Tem conhecimento prático de integração com APIs de IA generativa e criação de agentes.',

        'servicenow': 'Eduardo e ServiceNow: completou o **Bootcamp Shark in ServiceNow edições 4 e 8** (Aoop Shark Academy, 2023), o **Cask Camp — The Ultimate ServiceNow Bootcamp** (Ondaro Brasil, 2024, 20h) e "Introduction to Generative AI" no ServiceNow Learning (2024). Tem conhecimento em GlideRecord, GlideSystem, Flow Designer e fundamentos de ITSM.',

        'android_dev': 'Eduardo e Android: possui certificação em **Desenvolvendo Aplicações Mobile com Android Studio** (Fundação Bradesco, 2026, 15h). Conhecimento em Android Studio, Kotlin e desenvolvimento de aplicativos móveis. LinkedIn: [[https://www.linkedin.com/in/eduardo-souza-rodrigues|ver perfil]].',

        /* ── Formação ── */
        'formacao': 'Formação de Eduardo Souza Rodrigues:\n\n**Análise e Desenvolvimento de Sistemas** — Universidade São Francisco (USF), 2024–presente (em andamento)\n\n**Ensino Médio Técnico em Informática** — SENAC Registro, SP, 2022–2023\n\n**Web Design for Everybody** — Universidade de Michigan, 2023 (HTML5, CSS3, JavaScript, Design Responsivo)\n\n**Cursos complementares:** Alura, Fundação Bradesco, Ondaro (Cask), ServiceNow Learning',

        'usf': 'Eduardo cursa **Análise e Desenvolvimento de Sistemas** na Universidade São Francisco (USF) desde 2024. Participa ativamente de eventos acadêmicos sobre cibersegurança, escrita acadêmica e vivências internacionais. O curso combina fundamentos de ciência da computação com desenvolvimento prático de sistemas.',

        'senac': 'Eduardo concluiu o **Ensino Médio Técnico em Informática pelo SENAC Registro, SP (2022–2023)**. Durante o curso, desenvolveu o projeto "O Futuro do Trabalho" — premiado como Melhor Projeto de Impacto Social (Prêmio SENAC de Projeto do Ano Letivo 2023). Também obteve o certificado de **Assistente de Suporte e Manutenção de Computadores (272h)**.',

        'universidade_michigan': 'Eduardo concluiu a **Especialização Web Design for Everybody** pela Universidade de Michigan (2023) no Coursera. Certificações obtidas: Introduction to HTML5, Introduction to CSS3, Interactivity with JavaScript, Advanced Styling with Responsive Design e Web Design for Everybody Capstone. Certificação internacional que valida suas habilidades em desenvolvimento web front-end.',

        /* ── Certificações ── */
        'certificacoes': 'Certificações de Eduardo Souza Rodrigues:\n\n**Universidade de Michigan (2023):**\n• Web Design for Everybody Capstone\n• Advanced Styling with Responsive Design\n• Interactivity with JavaScript\n• Introduction to HTML5 & CSS3\n\n**ServiceNow:**\n• Bootcamp Shark #8 — Aoop Shark Academy (2023)\n• Cask Camp Ultimate ServiceNow Bootcamp — Ondaro Brasil (2024, 20h)\n• Introduction to Generative AI — ServiceNow Learning (2024)\n\n**Alura (2024–2026):**\n• Imersão Dev Back-End\n• Imersão Dev com Google Gemini\n• Imersão Dev Agentes de IA Google\n\n**Fundação Bradesco:**\n• Desenvolvendo Apps Mobile com Android Studio (2026, 15h)\n• Fundamentos de TI: Hardware e Software (2024, 7h)\n• Introdução à POO (2024, 5h)\n\n**SENAC:**\n• Assistente de Suporte e Manutenção de Computadores (2022, 272h)',

        /* ── Experiência / prêmios ── */
        'experiencia': 'Experiência profissional e acadêmica de Eduardo:\n\n**Jovem Aprendiz — ETAPA Ensino e Cultura Ltda. (2024):** construiu jogos com Construct 3, cadastramento e planilhas.\n\n**Prêmio SENAC — Impacto Social (2023):** projeto "O Futuro do Trabalho".\n\n**Bootcamps ServiceNow:** Shark edições 4 e 8 + Cask Camp (20h).\n\n**Imersões Alura:** Back-End, Google Gemini, Agentes de IA.\n\n**Eventos USF:** cibersegurança, escrita acadêmica, vivências internacionais.',

        'premio_senac': 'Eduardo conquistou o **Prêmio SENAC de Projeto do Ano Letivo na categoria Impacto Social (2023)** pelo projeto acadêmico "O Futuro do Trabalho". O projeto analisou as transformações do mercado de trabalho na era digital e propôs soluções tecnológicas com impacto social positivo — destacando-se entre todos os projetos do ano.',

        /* ── Idiomas ── */
        'idiomas': 'Idiomas de Eduardo:\n\n**Português:** Nativo — compreende, fala, lê e escreve com fluência.\n\n**Inglês:** Intermediário — lê e compreende bem, fala e escreve de forma razoável. (Estudos e certificações em inglês pela Universidade de Michigan)\n\n**Espanhol:** Básico — compreende razoavelmente, fala, lê e escreve de forma limitada.',

        /* ── Habilidades interpessoais ── */
        'soft_skills': 'Habilidades interpessoais de Eduardo: resolução de problemas, trabalho em equipe, comunicação, mindset de impacto social, sustentabilidade e aprendizado contínuo. Demonstradas no projeto premiado "O Futuro do Trabalho" e nas experiências como Jovem Aprendiz e bootcamps intensivos.',

        /* ── Carreira / dicas ── */
        'carreira_tech': 'Trilhas de carreira em tecnologia: **Frontend** (React/Vue/CSS), **Backend** (Node/Python/Java/Go), **Full Stack**, **DevOps/SRE** (cloud/Docker/K8s), **Data Science/ML**, **Cibersegurança**, **Mobile** (Android/iOS/Flutter), **Game Dev** (Unity/Unreal).\n\nPara se destacar: portfólio GitHub com projetos reais, contribuições open-source, posts técnicos, LinkedIn ativo.\n\nO mercado de TI no Brasil cresce ~15%/ano com escassez crônica de devs qualificados.',

        /* ── Tecnologias gerais mantidas do JSON ── */
        'react': 'React é uma biblioteca JavaScript para construir interfaces de usuário criada pelo Facebook (Meta) em 2013 — o framework frontend mais popular. Conceitos centrais: componentes (blocos de UI reutilizáveis), JSX, Virtual DOM (reconciliação eficiente), fluxo de dados unidirecional. React Hooks (v16.8, 2019): useState, useEffect, useContext, useMemo, useCallback. Ecossistema: Next.js (SSR/SSG), Remix, React Native (mobile), React Server Components. Estado: Redux Toolkit, Zustand, TanStack Query.',

        'nodejs': 'Node.js é um runtime JavaScript construído sobre o motor V8 do Chrome, criado por Ryan Dahl em 2009. O event loop não-bloqueante lida com milhares de conexões simultâneas eficientemente. O npm hospeda mais de 2 milhões de pacotes. Frameworks: Express.js (minimalista), Fastify (alto desempenho), NestJS (arquitetura opinativa). Alternativas: Deno (TypeScript nativo, seguro por padrão) e Bun (ultra-rápido, bundler integrado, 2023).',

        'sql': 'SQL (Structured Query Language) é a linguagem padrão para bancos de dados relacionais (IBM, anos 1970). Comandos fundamentais: SELECT, INSERT, UPDATE, DELETE, CREATE TABLE, ALTER TABLE. JOINs: INNER JOIN (linhas coincidentes), LEFT JOIN (todas da esquerda), RIGHT JOIN, FULL OUTER JOIN. SQL avançado: Window Functions (ROW_NUMBER, RANK, LAG, LEAD, PARTITION BY). SGBDs: PostgreSQL (open source), MySQL/MariaDB (web), SQLite (embutido), SQL Server, Oracle.',

        'git': 'Git é um sistema de controle de versão distribuído criado por Linus Torvalds em 2005 para o kernel Linux. Fluxo básico: git init → git add → git commit → git push. Branches: git checkout -b, git merge, git rebase. GitHub (Microsoft) hospeda 100+ milhões de repositórios; GitLab e Bitbucket são alternativas com CI/CD. Conventional Commits: feat:, fix:, docs:, refactor:, test:. Git avançado: git stash, git cherry-pick, git bisect, git rebase -i.',

        'poo': 'Programação Orientada a Objetos (POO): os 4 pilares são Encapsulamento (ocultar estado interno), Herança (estender classes pai), Polimorfismo (uma interface, múltiplas implementações) e Abstração (expor apenas o necessário). Princípios SOLID: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion. Padrões de projeto: Singleton, Factory, Builder (criacionais); Adapter, Decorator (estruturais); Observer, Strategy, Command (comportamentais).',

        'docker': 'Docker é uma plataforma de conteinerização (2013) que empacota aplicações com todas as dependências em contêineres portáteis. Conceitos: Imagem (template Dockerfile), Contêiner (instância em execução), Registry (Docker Hub), Volume (armazenamento persistente). Docker Compose orquestra apps multi-contêiner localmente. Kubernetes (K8s): orquestração em produção — auto-scaling, deployments contínuos, health checks, service discovery.',

        'cloud': 'Computação em nuvem: os três grandes provedores são AWS (Amazon, ~31%), Microsoft Azure (~24%) e Google Cloud Platform (~12%). Modelos: IaaS (VMs), PaaS (runtimes gerenciados), SaaS (software como serviço), FaaS/Serverless (Lambda). Conceitos: auto-scaling, load balancing, CDN, VPC, IAM. DevOps essencial: Docker, Kubernetes, Terraform (IaC), CI/CD (GitHub Actions).',

        'cybersecurity_dev': 'Cibersegurança para devs: Eduardo tem fundamentos de cibersegurança (SENAC). OWASP Top 10 vulnerabilidades web: Injeção, Autenticação Quebrada, XSS, Controle de Acesso Quebrado, Configuração Incorreta de Segurança. Boas práticas: sanitizar inputs, consultas parametrizadas (previne SQL injection), senhas com bcrypt/Argon2, HTTPS/TLS obrigatório, MFA. Headers essenciais: CSP, HSTS, X-Frame-Options.',

        'unity_dev': 'Unity e Eduardo: Eduardo usa Unity com C# desde a infância — Unity é a principal linguagem de scripting da engine. Conceitos: GameObject (objeto de cena), Component (comportamento), Transform (posição/rotação/escala), MonoBehaviour (classe base dos scripts). Ciclo de vida: Awake(), Start(), Update() (todo frame), FixedUpdate() (física), LateUpdate(). Jogos em Unity: Pokémon GO, Cuphead, Hollow Knight, Hearthstone.',

        'opensource': 'Software de código aberto: código-fonte público para uso, estudo, modificação e distribuição. Licenças: MIT (permissiva), Apache 2.0 (permissiva + patentes), GPL v3 (copyleft forte), LGPL (copyleft fraco). Projetos que movem o mundo: Linux, Git, PostgreSQL, Node.js, Python, VS Code, Kubernetes, React. Eduardo mantém projetos open-source no [[https://github.com/eduardo2580|GitHub]]. Contribuir: issues "good first issue" → fork → Pull Request.',

        'algoritmos_cs': 'Algoritmos e Estruturas de Dados: Big-O — O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ). Estruturas essenciais: Array O(1) acesso, Hash Table O(1) médio, Binary Tree O(log n). Ordenação: QuickSort O(n log n) médio, MergeSort O(n log n) estável, TimSort (Python/Java). Grafos: BFS (caminho mais curto sem pesos), DFS, Dijkstra (pesos), A* (heurístico). Paradigmas: Dividir e Conquistar, Programação Dinâmica, Greedy, Backtracking.',

        'historia_computacao': '1843: Ada Lovelace — primeiro algoritmo. 1936: Turing — fundamentos da computação. 1945: ENIAC. 1947: Transistor (Bell Labs). 1969: ARPANET + Unix. 1971: Intel 4004. 1981: IBM PC. 1991: World Wide Web (Berners-Lee) + Linux (Torvalds). 1995: Java, JavaScript, PHP. 2007: iPhone. 2012: AlexNet (deep learning). 2017: Transformers. 2022: ChatGPT. 2023–2025: Agentes de IA autônomos.',
      },

      /* ══ ENGLISH ══════════════════════════ */
      en: {

        'who_is_eduardo': "Eduardo Souza Rodrigues is a Junior Developer born in 2005 in Campinas, SP, Brazil. He graduated from the Technical High School in Computer Science at SENAC and is currently pursuing a degree in Systems Analysis and Development at São Francisco University (USF). He is passionate about creating digital solutions that improve people's lives and promote sustainable development. Since childhood he has had hands-on experience with Unity, Arduino IDE, and Construct 3.",

        'about_eduardo': 'Eduardo Souza Rodrigues — Junior Developer, born 2005, Campinas, SP. Main stack: HTML5, CSS3, JavaScript, C#, SQL, Node.js, Unity, ServiceNow. Education: SENAC (Technical IT) + USF (Systems Analysis, in progress). Awards: SENAC Project of the Year in Social Impact — 2023. Certifications: University of Michigan (Web Design), ServiceNow (Shark + Cask), Alura, Fundação Bradesco.',

        'portfolio': 'Eduardo\'s portfolio is available at **[[https://eduardo2580.github.io/|eduardo2580.github.io]]** — showcasing web development, game development, and open-source projects. GitHub: **[[https://github.com/eduardo2580|github.com/eduardo2580]]**. LinkedIn: **[[https://www.linkedin.com/in/eduardo-souza-rodrigues|linkedin.com/in/eduardo-souza-rodrigues]]**.',

        'contact': "How to reach Eduardo:\n\n**GitHub:** [[https://github.com/eduardo2580|github.com/eduardo2580]]\n**LinkedIn:** [[https://www.linkedin.com/in/eduardo-souza-rodrigues|linkedin.com/in/eduardo-souza-rodrigues]]\n**Portfolio:** [[https://eduardo2580.github.io/|eduardo2580.github.io]]\n**ORCID:** [[https://orcid.org/0009-0001-7877-2153|0009-0001-7877-2153]]\n**Lattes CV:** [[https://lattes.cnpq.br/2487835899987366|lattes.cnpq.br]]",

        'projects': "Eduardo's projects:\n\n**Minesweeper/Campo Minado (2026)** — computer program available on GitHub.\n\n**Young Apprentice — ETAPA (2024)** — built games with Construct 3, managed game registration and spreadsheets.\n\n**The Future of Work (2023)** — academic project at SENAC, awarded Best Social Impact Project.\n\n**Alura Immersions** — Back-End Dev, Google Gemini, AI Agents.\n\nFull portfolio: [[https://eduardo2580.github.io/|eduardo2580.github.io]]",

        'technologies': "Eduardo's tech stack:\n\n**Frontend:** HTML5, CSS3, JavaScript, Responsive Design, GitHub Pages\n\n**Backend & Platforms:** C#, SQL, Node.js, ServiceNow, Windows Forms\n\n**Tools:** Git, Visual Studio, Oracle VirtualBox, Microsoft 365, Android Studio\n\n**Other:** Unity (games), Arduino IDE, Construct 3, Cybersecurity fundamentals",

        'education': "Eduardo's education:\n\n**Systems Analysis and Development** — São Francisco University (USF), 2024–present\n\n**Technical High School in Computer Science** — SENAC Registro, SP, 2022–2023\n\n**Web Design for Everybody** — University of Michigan, 2023 (HTML5, CSS3, JavaScript, Responsive Design)\n\n**Additional courses:** Alura, Fundação Bradesco, Ondaro (Cask), ServiceNow Learning",

        'certifications': "Eduardo's certifications:\n\n**University of Michigan (2023):**\n• Web Design for Everybody Capstone\n• Advanced Styling with Responsive Design\n• Interactivity with JavaScript\n• Introduction to HTML5 & CSS3\n\n**ServiceNow:**\n• Shark Bootcamp #8 — Aoop Shark Academy (2023)\n• Cask Camp Ultimate ServiceNow Bootcamp — Ondaro Brasil (2024, 20h)\n• Introduction to Generative AI (2024)\n\n**Alura (2024–2026):**\n• Back-End Dev Immersion\n• Dev Immersion with Google Gemini\n• AI Agents Google Dev Immersion\n\n**Fundação Bradesco:**\n• Mobile Apps with Android Studio (2026, 15h)\n• IT Fundamentals: Hardware & Software (2024, 7h)\n• Introduction to OOP (2024, 5h)\n\n**SENAC:**\n• Computer Support and Maintenance Assistant (2022, 272h)",

        'experience': "Eduardo's experience:\n\n**Young Apprentice — ETAPA (2024):** built games with Construct 3, managed game registration, organized spreadsheets.\n\n**SENAC Award — Social Impact (2023):** project 'The Future of Work'.\n\n**ServiceNow Bootcamps:** Shark editions 4 & 8 + Cask Camp (20h).\n\n**Alura Immersions:** Back-End, Google Gemini, AI Agents.",

        'award_senac': "Eduardo won the **SENAC Project of the Year Award in Social Impact (2023)** for the academic project 'The Future of Work'. The project analyzed digital-age workplace transformations and proposed technology solutions with positive social impact — standing out among all projects of the year.",

        'languages_spoken': "Eduardo's languages:\n\n**Portuguese:** Native — reads, writes, speaks, and understands fluently.\n\n**English:** Intermediate — reads and understands well, speaks and writes reasonably. (Studies and certifications in English at University of Michigan)\n\n**Spanish:** Basic — understands reasonably, limited speaking, reading, and writing.",

        'servicenow': "Eduardo and ServiceNow: completed **Shark in ServiceNow Bootcamps editions 4 & 8** (Aoop Shark Academy, 2023), **Cask Camp — The Ultimate ServiceNow Bootcamp** (Ondaro Brasil, 2024, 20h), and Introduction to Generative AI (ServiceNow Learning, 2024). Knowledge in GlideRecord, GlideSystem, Flow Designer, and ITSM fundamentals.",

        'android': "Eduardo and Android: holds certification in **Developing Mobile Applications with Android Studio** (Fundação Bradesco, 2026, 15h). Knowledge in Android Studio, Kotlin, and mobile app development.",

        'unity': "Eduardo and Unity: has used Unity with C# since childhood. Unity is the engine's primary scripting language. Core concepts: GameObject (scene object), Component (behavior), Transform (position/rotation/scale), MonoBehaviour (script base class). Lifecycle: Awake(), Start(), Update() (every frame), FixedUpdate() (physics), LateUpdate(). Notable Unity games: Pokémon GO, Cuphead, Hollow Knight, Hearthstone.",

        'github_profile': "Eduardo's GitHub: **[[https://github.com/eduardo2580|github.com/eduardo2580]]** — contains his latest projects including Minesweeper (2026), open-source contributions, and Alura immersion code. Active profile with web development, game development, and AI experiment repositories.",
      },

      /* ══ ESPAÑOL ══════════════════════════ */
      es: {

        'quien_es_eduardo': 'Eduardo Souza Rodrigues es un Desarrollador Junior nacido en 2005 en Campinas, SP, Brasil. Se graduó en la Escuela Técnica de Informática del SENAC y actualmente cursa Análisis de Sistemas y Desarrollo en la Universidad São Francisco (USF). Es apasionado por crear soluciones digitales que mejoran la vida de las personas y promueven el desarrollo sostenible. Desde la infancia tiene experiencia práctica con Unity, Arduino IDE y Construct 3.',

        'sobre_eduardo': 'Eduardo Souza Rodrigues — Desarrollador Junior, nacido en 2005, Campinas, SP. Stack principal: HTML5, CSS3, JavaScript, C#, SQL, Node.js, Unity, ServiceNow. Formación: SENAC (Técnico en Informática) + USF (ADS, en curso). Premio: Proyecto del Año en Impacto Social — SENAC 2023. Certificaciones: Universidad de Michigan, ServiceNow (Shark + Cask), Alura, Fundação Bradesco.',

        'portafolio': 'El portafolio de Eduardo está en **[[https://eduardo2580.github.io/|eduardo2580.github.io]]** — muestra proyectos de web, juegos y código abierto. GitHub: **[[https://github.com/eduardo2580|github.com/eduardo2580]]**. LinkedIn: **[[https://www.linkedin.com/in/eduardo-souza-rodrigues|linkedin.com/in/eduardo-souza-rodrigues]]**.',

        'contacto': 'Cómo contactar a Eduardo:\n\n**GitHub:** [[https://github.com/eduardo2580|github.com/eduardo2580]]\n**LinkedIn:** [[https://www.linkedin.com/in/eduardo-souza-rodrigues|linkedin.com/in/eduardo-souza-rodrigues]]\n**Portafolio:** [[https://eduardo2580.github.io/|eduardo2580.github.io]]\n**ORCID:** [[https://orcid.org/0009-0001-7877-2153|0009-0001-7877-2153]]\n**Lattes:** [[https://lattes.cnpq.br/2487835899987366|lattes.cnpq.br]]',

        'proyectos': 'Proyectos de Eduardo:\n\n**Campo Minado/Buscaminas (2026)** — programa disponible en GitHub.\n\n**Joven Aprendiz — ETAPA (2024)** — construyó juegos con Construct 3, gestionó registros y planillas.\n\n**El Futuro del Trabajo (2023)** — proyecto académico SENAC, premiado como Mejor Proyecto de Impacto Social.\n\n**Inmersiones Alura** — Back-End, Google Gemini, Agentes de IA.\n\nPortafolio completo: [[https://eduardo2580.github.io/|eduardo2580.github.io]]',

        'tecnologias': 'Stack tecnológico de Eduardo:\n\n**Frontend:** HTML5, CSS3, JavaScript, Diseño Responsivo, GitHub Pages\n\n**Backend y Plataformas:** C#, SQL, Node.js, ServiceNow, Windows Forms\n\n**Herramientas:** Git, Visual Studio, Oracle VirtualBox, Microsoft 365, Android Studio\n\n**Otros:** Unity (juegos), Arduino IDE, Construct 3, fundamentos de Ciberseguridad',

        'formacion': 'Formación de Eduardo:\n\n**Análisis de Sistemas y Desarrollo** — USF, 2024–presente\n\n**Bachillerato Técnico en Informática** — SENAC Registro, SP, 2022–2023\n\n**Web Design for Everybody** — Universidad de Michigan, 2023\n\n**Cursos adicionales:** Alura, Fundação Bradesco, Ondaro (Cask), ServiceNow Learning',

        'certificaciones': 'Certificaciones de Eduardo:\n\n**Universidad de Michigan (2023):**\n• Web Design for Everybody Capstone\n• Advanced Styling with Responsive Design\n• Interactivity with JavaScript\n• Introduction to HTML5 & CSS3\n\n**ServiceNow:** Shark #8 (2023) + Cask Camp (2024, 20h) + Generative AI\n\n**Alura:** Back-End, Google Gemini, Agentes de IA\n\n**Fundação Bradesco:** Android Studio (15h), Fundamentos TI, POO\n\n**SENAC:** Soporte y Mantenimiento (272h)',

        'premio': "Eduardo ganó el **Premio SENAC al Proyecto del Año en Impacto Social (2023)** por el proyecto 'El Futuro del Trabajo'. El proyecto analizó las transformaciones del mercado laboral en la era digital y propuso soluciones tecnológicas con impacto social positivo.",

        'idiomas': 'Idiomas de Eduardo:\n\n**Portugués:** Nativo — comprende, habla, lee y escribe con fluidez.\n\n**Inglés:** Intermedio — lee y comprende bien, habla y escribe razonablemente.\n\n**Español:** Básico — comprende razonablemente, habla, lee y escribe de forma limitada.',

        'servicenow': 'Eduardo y ServiceNow: completó los **Bootcamps Shark in ServiceNow ediciones 4 y 8** (2023), **Cask Camp Ultimate** (2024, 20h) e Introduction to Generative AI (ServiceNow Learning, 2024). Conocimiento en GlideRecord, GlideSystem, Flow Designer y fundamentos de ITSM.',
      }
    }
  });

}(window));
