/* kb-history.js — Eduardo.AI History Knowledge Base v2026.03.20 */
(function(W) {
  'use strict';
  if (!W.EduardoKB) W.EduardoKB = [];
  W.EduardoKB.push({
    id: 'history',
    priority: 5,
    lang: {
      pt: {
        'guerra_fria': 'Guerra Fria (1947–1991): tensão geopolítica entre EUA (capitalismo) e URSS (comunismo) após a 2ª GM. Não houve confronto direto — "proxy wars" (Coreia, Vietnã), corrida armamentista nuclear (MAD), corrida espacial (Sputnik 1957, Apolo 11 1969). Queda do Muro de Berlim (1989) e dissolução da URSS (1991) marcam o fim.',
        'revolucao_industrial': 'Revolução Industrial (séc. XVIII–XIX): transformação de sociedades agrárias em industriais. 1ª RI: Inglaterra, 1760–1840 — máquina a vapor (Watt), têxtil mecanizada, ferrovia. 2ª RI: 1870–1914 — eletricidade, aço, petróleo, combustão interna, química. Consequências: urbanização, capitalismo industrial, surgimento do proletariado, imperialismo.',
        'colonialismo': 'Colonialismo europeu (sécs. XV–XX): potências europeias dominaram África, Ásia e Américas. Portugal e Espanha lideraram no séc. XV–XVI. "Partilha da África" (Conferência de Berlim 1884–1885) dividiu o continente entre Europa. Consequências: exploração de recursos, destruição de culturas, escravidão, fronteiras artificiais que causam conflitos até hoje.',
        'renascimento': 'Renascimento (sécs. XIV–XVII): movimento cultural e intelectual que redescobriu o classicismo greco-romano. Começou na Itália (Florença, Médici). Arte: Leonardo da Vinci, Michelangelo, Rafael. Ciência: Copérnico (heliocentrismo), Galileu, Vesalius. Humanismo: homem como centro. A imprensa de Gutenberg (~1450) acelerou a difusão.',
        'revolucao_americana': 'Revolução Americana (1775–1783): 13 colônias britânicas da América do Norte declaram independência. Causas: taxação sem representação, Iluminismo. Declaração de Independência (1776, Jefferson). Constituição dos EUA (1787) — primeira nação moderna fundada em princípios iluministas. Influenciou Revolução Francesa.',
        'nazismo': 'Nazismo (Nacional-Socialismo): ideologia totalitária de Adolf Hitler e do Partido Nazista alemão (NSDAP). Elementos: racismo pseudocientífico, antissemitismo, ultranacionalismo, Estado totalitário. Hitler chanceler em 1933, poder absoluto em 1934. Levou à 2ª GM e ao Holocausto — extermínio sistemático de ~11 milhões, sendo 6M judeus.',
        'imperialismo': 'Imperialismo (sécs. XIX–XX): expansão territorial e econômica das potências europeias e dos EUA. Motivos: matérias-primas, mercados, prestígio nacional. Ferramentas: tecnologia militar superior, medicina tropical, ferrovias. África quase totalmente colonizada até 1900. Legado: fronteiras artificiais, dependência econômica, desigualdades persistentes.',
        'brasil_historia': 'História do Brasil: Descoberta (1500, Pedro Álvares Cabral), colonização portuguesa, ciclo do pau-brasil, cana-de-açúcar, ouro (séc. XVIII) e café. Independência (1822, D. Pedro I). República (1889). Getúlio Vargas (1930–1945, 1950–1954). Ditadura Militar (1964–1985). Redemocratização, Constituição de 1988. Lula, Dilma, Temer, Bolsonaro.',
        'filosofia': 'Filosofia ocidental: pré-socráticos (Tales, Pitágoras, Heráclito) buscaram princípio do universo. Sócrates — método dialético, "conhece-te a ti mesmo". Platão — mundo das ideias, A República. Aristóteles — lógica, ética, biologia. Modernos: Descartes (dualismo, cogito), Hume (empirismo), Kant (crítica da razão pura). Contemporâneos: Nietzsche, Wittgenstein, Sartre (existencialismo), Foucault.',
      },
      en: {
        'cold_war': 'Cold War (1947–1991): geopolitical tension between USA (capitalism) and USSR (communism) after WWII. No direct conflict — proxy wars (Korea, Vietnam), nuclear arms race (MAD), space race (Sputnik 1957, Apollo 11 1969). Fall of Berlin Wall (1989) and dissolution of USSR (1991) mark its end.',
        'industrial_revolution': 'Industrial Revolution (18th–19th centuries): transformation from agrarian to industrial societies. 1st IR: England, 1760–1840 — steam engine (Watt), mechanized textiles, railways. 2nd IR: 1870–1914 — electricity, steel, oil, internal combustion, chemistry. Led to urbanization and modern capitalism.',
        'renaissance': 'Renaissance (14th–17th centuries): cultural and intellectual movement rediscovering Greco-Roman classicism. Started in Italy (Florence, Medici). Art: Leonardo da Vinci, Michelangelo, Raphael. Science: Copernicus, Galileo. Gutenberg\'s printing press (~1450) accelerated its spread.',
        'nazism': 'Nazism: totalitarian ideology of Adolf Hitler and the German Nazi Party. Elements: scientific racism, antisemitism, ultranationalism, totalitarian state. Hitler became chancellor in 1933. Led to WWII and the Holocaust — systematic extermination of ~11 million people, 6M of them Jewish.',
        'philosophy': 'Western philosophy: pre-Socratics sought the universe\'s first principle. Socrates — dialectical method. Plato — theory of ideas. Aristotle — logic, ethics, biology. Moderns: Descartes (cogito ergo sum), Hume, Kant. Contemporaries: Nietzsche, Sartre (existentialism), Foucault, Wittgenstein.',
      },
      es: {
        'guerra_fria': 'Guerra Fría (1947–1991): tensión geopolítica entre EE.UU. (capitalismo) y URSS (comunismo). Guerras proxy, carrera armamentista nuclear, carrera espacial. Caída del Muro de Berlín (1989) y disolución de la URSS (1991) marcan el fin.',
        'revolucion_industrial': 'Revolución Industrial (siglos XVIII–XIX): transformación de sociedades agrarias en industriales. 1ª RI: Inglaterra, máquina de vapor, textiles, ferrocarril. 2ª RI: electricidad, acero, petróleo, química. Consecuencias: urbanización, capitalismo industrial.',
        'nazismo': 'Nazismo: ideología totalitaria de Adolf Hitler y el Partido Nazi alemán. Racismo, antisemitismo, ultranacionalismo. Hitler canciller en 1933. Llevó a la 2ª GM y al Holocausto — exterminio sistemático de ~11 millones, 6M judíos.',
        'filosofia': 'Filosofía occidental: presocráticos, Sócrates, Platón, Aristóteles. Modernos: Descartes, Hume, Kant. Contemporáneos: Nietzsche, Sartre (existencialismo), Foucault, Wittgenstein.',
      }
    }
  });
}(window));
