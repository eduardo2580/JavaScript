/* kb-direito-brasil.js — Eduardo.AI Brazilian Law Knowledge Base v2026.03.20
   Covers: Constituição Federal 1988, Código Penal, CPP, Código Civil,
   CDC, CLT, ECA, CTB, Lei Maria da Penha, LGPD, Lei de Drogas,
   Código Tributário, Código de Processo Civil e muito mais.
   PT / EN / ES trilingual.
   Educational only. Not a substitute for professional legal advice.
   Não substitui consulta a advogado.
*/
(function(W) {
  'use strict';
  if (!W.EduardoKB) W.EduardoKB = [];
  W.EduardoKB.push({
    id: 'direito_brasil',
    priority: 7,
    lang: {

/* ════════════════════════════════════════════════════════════════════
   PORTUGUÊS
════════════════════════════════════════════════════════════════════ */
pt: {

/* ── CONSTITUIÇÃO FEDERAL ── */
'constituicao_federal': 'Constituição Federal de 1988 ("Constituição Cidadã"): lei máxima do Brasil, promulgada em 5/10/1988. Estrutura: Preâmbulo + 9 Títulos + ADCT. Princípios fundamentais (Art. 1º): soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa, pluralismo político. Poderes: Executivo, Legislativo e Judiciário (independentes e harmônicos). Objetivos (Art. 3º): construir sociedade livre, justa e solidária; erradicar pobreza; reduzir desigualdades; promover bem de todos sem discriminações. Pode ser emendada por PEC com 3/5 dos votos em 2 turnos em cada Casa. Cláusulas pétreas (Art. 60 §4º): forma federativa, voto direto secreto universal periódico, separação dos Poderes, direitos e garantias individuais. 250+ artigos mais ADCT.',

'direitos_fundamentais': 'Direitos fundamentais — CF/88 Art. 5º (78 incisos): igualdade perante a lei (homens e mulheres); inviolabilidade de vida, liberdade, igualdade, segurança e propriedade; ninguém obrigado a fazer ou deixar de fazer senão em virtude de lei; liberdade de pensamento (vedado anonimato); liberdade de consciência e crença; inviolabilidade da intimidade, vida privada, honra e imagem; inviolabilidade do domicílio (salvo flagrante, desastre, socorro ou mandado judicial diurno); sigilo de correspondências e comunicações; livre exercício de qualquer trabalho; liberdade de reunião pacífica; liberdade de associação; propriedade (função social); vedação à tortura e tratamento desumano; proibição de pena de morte (salvo guerra declarada), de caráter perpétuo, de trabalhos forçados, de banimento e cruéis; presunção de inocência; contraditório e ampla defesa; habeas corpus, mandado de segurança, mandado de injunção, habeas data, ação popular.',

'habeas_corpus': 'Habeas corpus (HC): remédio constitucional (CF Art. 5º LXVIII) que protege a liberdade de locomoção. Cabe quando alguém sofre ou se acha ameaçado de sofrer violência ou coação em sua liberdade de locomoção por ilegalidade ou abuso de poder. Preventivo (salvo-conduto): ameaça de prisão ilegal. Liberatório: prisão já efetivada. Pode ser impetrado por qualquer pessoa, em favor próprio ou alheio, sem advogado. Julgado pelo TJ (estadual) ou STJ/STF (federal). Gratuito e sem formalidades rígidas. Não cabe em punição disciplinar militar.',

'mandado_de_seguranca': 'Mandado de segurança (MS): protege direito líquido e certo não amparado por HC ou HD, violado ou ameaçado por ato de autoridade pública ou pessoa jurídica no exercício de atribuição pública (CF Art. 5º LXIX). Individual ou coletivo (partido político, sindicato, associação com +1 ano). Prazo: 120 dias do ato lesivo. Exige advogado. Lei 12.016/2009. Não cabe contra lei em tese, contra decisão judicial com recurso previsto, nem em substituição a ação de cobrança.',

'acao_popular': 'Ação popular (CF Art. 5º LXXIII): qualquer cidadão (portador de título de eleitor) pode anular ato lesivo ao patrimônio público, à moralidade administrativa, ao meio ambiente e ao patrimônio histórico e cultural. Isento de custas e ônus de sucumbência, salvo má-fé. Lei 4.717/1965.',

'habeas_data': 'Habeas data (HD): garante ao cidadão (CF Art. 5º LXXII) acesso a informações sobre si constantes de bancos de dados de entidades governamentais ou de caráter público; e a retificação desses dados. Pressupõe negativa administrativa prévia. Lei 9.507/1997.',

'organizacao_estado': 'Organização do Estado (CF Título III): União, Estados, DF e Municípios — todos autônomos. Competências: exclusivas da União (Art. 21 — emitir moeda, declarar guerra, serviço postal), privativas da União (Art. 22), concorrentes União+Estados+DF (Art. 24), comuns (Art. 23). Municípios: assuntos de interesse local, suplementar legislação federal/estadual. DF: acumula competências estaduais e municipais. Sistema federativo é cláusula pétrea.',

'poder_executivo': 'Poder Executivo Federal: Presidente da República — chefe de Estado e de Governo. Eleição: 2 turnos, maioria absoluta. Mandato: 4 anos, reelegível uma vez. Ministros de Estado: nomeados livremente pelo PR. Vice-Presidente. Presidente pode ser destituído por crime de responsabilidade (impeachment) por 2/3 da Câmara + julgamento pelo Senado. STF julga PR por crimes comuns.',

'poder_legislativo': 'Poder Legislativo Federal: Congresso Nacional bicameral — Câmara dos Deputados (513 deputados, 4 anos, proporcional por estado) + Senado Federal (81 senadores, 8 anos, 3 por estado, maioria simples). Funções: legislar, fiscalizar, orçamento. CPI: comissão parlamentar de inquérito. Aprovação de leis: maioria simples (ordinária), maioria absoluta (complementar), 3/5 em 2 turnos (emenda constitucional).',

'poder_judiciario': 'Poder Judiciário (CF Art. 92): STF (11 ministros, guarda da CF, controle concentrado ADI/ADC/ADPF), STJ (33 ministros, uniformização direito federal), TST (trabalhista), TSE (eleitoral), STM (militar), TRFs (federal regional), TJs (estaduais), TRTs, TREs, Juízes federais e estaduais. CNJ: controle administrativo do judiciário. Magistratura: vitaliciedade, inamovibilidade, irredutibilidade de subsídios.',

'ministerio_publico': 'Ministério Público (CF Art. 127): instituição permanente essencial à justiça. Função: defesa da ordem jurídica, regime democrático, interesses sociais e individuais indisponíveis. MPU (MPF, MPT, MPM, MPDFT) + MPs estaduais. Princípios: unidade, indivisibilidade, independência funcional. Promotorias de Justiça: ação penal pública, fiscalização de leis, tutela coletiva (ACP). Procurador-Geral da República: chefia do MPF.',

'sus_educacao': 'Direitos sociais (CF Art. 6º): educação, saúde, alimentação, trabalho, moradia, transporte, lazer, segurança, previdência social, proteção à maternidade e infância, assistência aos desamparados. SUS: saúde como direito de todos e dever do Estado (Art. 196). Educação: básica obrigatória e gratuita dos 4 aos 17 anos (Art. 208). FUNDEB: fundo para educação básica. Piso salarial do professor (Lei 11.738/2008).',

'tributacao_cf': 'Sistema Tributário Nacional (CF Arts. 145–162): tributos — impostos, taxas, contribuições de melhoria, empréstimos compulsórios, contribuições especiais. Limitações ao poder de tributar: legalidade (nenhum tributo sem lei), anterioridade (ano seguinte + 90 dias), irretroatividade, não-confisco, igualdade tributária. Imunidades: templos, partidos, sindicatos, entidades educacionais/assistenciais sem fins lucrativos, livros/jornais/periódicos.',

/* ── CÓDIGO PENAL ── */
'codigo_penal': 'Código Penal (Decreto-Lei 2.848/1940, amplamente reformado): divide-se em Parte Geral (crimes, penas, aplicação) e Parte Especial (tipos penais). Princípios: legalidade (nullum crimen sine lege), anterioridade, irretroatividade in malam partem, culpabilidade, proporcionalidade, humanidade das penas. Penas: privativas de liberdade (reclusão e detenção), restritivas de direitos, multa. Prescrição: extingue punibilidade pelo decurso do tempo.',

'crimes_contra_vida': 'Crimes contra a vida (CP Art. 121–128): homicídio simples (Art. 121 — reclusão 6–20 anos), qualificado (12–30 anos): motivo torpe, fútil, meio cruel, emboscada, feminicídio (+1/3 a +1/2). Homicídio culposo (3–3 anos + penas extras se direção de veículo). Induzimento/instigação ao suicídio (2–6 anos). Infanticídio (Art. 123: 2–6 anos — estado puerperal). Aborto: provocado pela gestante (1–3 anos), por terceiro sem consentimento (3–10 anos). Aborto legal: risco à vida da mãe, gravidez por estupro, anencéfalo (STF).',

'lesao_corporal': 'Lesão corporal (CP Art. 129): leve (detenção 3m–1a), grave (reclusão 1–5a — perigo de vida, debilidade permanente de membro/sentido/função, aceleração de parto), gravíssima (reclusão 2–8a — incapacidade permanente para trabalho, enfermidade incurável, perda ou inutilização de membro, deformidade permanente, aborto), seguida de morte (reclusão 4–12a). Lesão dolosa em contexto doméstico (Lei Maria da Penha): pena mínima aumentada.',

'crimes_patrimonio': 'Crimes contra o patrimônio: furto simples (Art. 155 — reclusão 1–4a), qualificado (2–8a: destreza, fraude, escalada, rompimento de obstáculo, abuso de confiança, veículo automotor). Roubo (Art. 157 — reclusão 4–10a); latrocínio (Art. 157 §3º — reclusão 20–30a, hediondo). Extorsão (Art. 158 — 4–10a); extorsão mediante sequestro (Art. 159 — 8–15a, hediondo). Estelionato (Art. 171 — reclusão 1–5a; eletrônico: sem redução). Apropriação indébita (Art. 168 — 1–4a). Receptação (Art. 180 — 1–4a; qualificada 3–8a).',

'crimes_sexuais': 'Crimes contra a dignidade sexual: estupro (Art. 213 CP — reclusão 6–10a; qualificado se lesão grave 8–12a, morte 12–30a, vítima menor 14a 8–12a). Estupro de vulnerável (Art. 217-A — reclusão 8–15a; se menor de 14a, deficiente, enfermo). Importunação sexual (Art. 215-A — reclusão 1–5a). Registro não autorizado de intimidade sexual (Art. 216-B). Divulgação de cenas íntimas sem consentimento — "pornografia de vingança" (Lei 13.772/2018 + Art. 216-B). Todos hediondos (Lei 8.072/1990).',

'crimes_hediondos': 'Crimes hediondos (Lei 8.072/1990): homicídio qualificado, latrocínio, extorsão mediante sequestro, estupro, estupro de vulnerável, epidemia com morte, falsificação de remédios, genocídio, terrorismo, tortura, tráfico de drogas. Regime inicialmente fechado (mas STF flexibilizou). Progressão: após 2/5 da pena (primário) ou 3/5 (reincidente). Vedados: anistia, graça, indulto, fiança, liberdade provisória sem fiança.',

'legítima_defesa': 'Excludentes de ilicitude (CP Art. 23): estado de necessidade (Art. 24 — perigo atual, não provocado, inevitável de outro modo, proporcional), legítima defesa (Art. 25 — agressão injusta, atual ou iminente, moderada, para defesa de direito próprio ou alheio), estrito cumprimento do dever legal, exercício regular de direito. Excesso punível (doloso ou culposo). Legítima defesa putativa: erro de tipo permissivo.',

'tipicidade_culpabilidade': 'Teoria do crime: fato típico (conduta + resultado + nexo causal + tipicidade), ilícito (sem excludentes) e culpável (imputabilidade + potencial consciência da ilicitude + exigibilidade de conduta diversa). Dolo: vontade + consciência de resultado (direto) ou assunção do risco (eventual). Culpa: imprudência, negligência, imperícia. Imputabilidade: plena (+18a e sem doença mental); semi-imputabilidade (Art. 26 §único); inimputabilidade (Art. 26 — doença mental ou desenvolvimento incompleto/retardado).',

'prescricao_penal': 'Prescrição penal (CP Arts. 107–119): extingue a punibilidade. Prazos (pela pena máxima): 3 anos (pena ≤1a), 8 anos (pena 1–2a), 12 anos (pena 2–4a), 16 anos (pena 4–8a), 20 anos (pena 8–12a), 24 anos (pena +12a). Prescrição retroativa (pela pena aplicada, entre marcos). Causas interruptivas: recebimento da denúncia, pronúncia, condenação, reincidência. Imprescritíveis: racismo (CF Art. 5º XLII) e ação de grupos armados contra o Estado (Art. 5º XLIV).',

'penas_substituicao': 'Substituição de pena (CP Art. 44): penas restritivas de direitos substituem privativas de liberdade se pena ≤4 anos (não violento) ou ≤2 anos (violento/grave ameaça), réu não reincidente, suficiência para reprovação. Tipos: prestação pecuniária, perda de bens, prestação de serviços à comunidade, interdição temporária de direitos, limitação de fim de semana. Suspensão condicional da pena (sursis): pena ≤2 anos, não reincidente, condições.',

'execucao_penal': 'Execução Penal (Lei 7.210/1984 — LEP): regula cumprimento das penas. Regimes: fechado (pena superior a 8 anos ou reincidente superior a 4 anos), semiaberto (4–8 anos não reincidente), aberto (até 4 anos não reincidente). Progressão: cumprido 1/6 (primário) ou 1/4 (hediondo primário) ou 2/5 (hediondo primário) ou 3/5 (hediondo reincidente). Remição: 1 dia de pena por 3 de trabalho ou 12h de estudo em 3 dias. Livramento condicional: 1/3 (primário) ou 1/2 (reincidente).',

/* ── CÓDIGO DE PROCESSO PENAL ── */
'cpp': 'Código de Processo Penal (Decreto-Lei 3.689/1941, amplamente reformado): regula a persecução penal — inquérito policial, ação penal, instrução, julgamento, recursos, execução. Princípios: devido processo legal, contraditório, ampla defesa, presunção de inocência, publicidade, imparcialidade do juiz. Inquérito policial: sigiloso, inquisitório, dispensável para ação penal. Ação penal pública (MP) ou privada (ofendido). Nulidades absolutas x relativas.',

'prisoes_cautelares': 'Prisões cautelares (CPP reformado): prisão em flagrante (Art. 302 — flagrante próprio, impróprio, presumido, obrigatório), preventiva (Art. 311–313 — garantia da ordem pública, conveniência da instrução, assegurar aplicação da lei, crime doloso com pena >4a ou reincidente/contra vítima vulnerável), temporária (Lei 7.960/1989 — 5 dias prorrogáveis por mais 5; hediondos: 30+30 dias). Audiência de custódia: apresentação ao juiz em 24h (Res. CNJ 213/2015). Fiança: autoridade policial (até 4 anos) ou juiz.',

'habeas_corpus_cpp': 'Habeas corpus no CPP: pode ser impetrado por qualquer pessoa, sem advogado; por escrito ou verbal; cabe em qualquer fase. Julgado pelo juiz de 1º grau (quando a coação for de autoridade não judiciária), TJ/TRF (quando do juiz de 1º grau), STJ (quando do TJ/TRF), STF (quando do STJ ou envolver direito fundamental). Trancamento de inquérito: quando atipicidade manifesta, causa extintiva da punibilidade ou ausência de justa causa.',

'juizado_especial_criminal': 'Juizado Especial Criminal (Lei 9.099/1995 + Lei 10.259/2001): infrações penais de menor potencial ofensivo (pena máxima ≤2 anos). Institutos despenalizadores: composição civil dos danos, transação penal (proposta de penas restritivas/multa sem processo), suspensão condicional do processo (Art. 89 — pena mínima ≤1 ano, condições por 2–4 anos). Procedimento sumaríssimo: oralidade, informalidade, celeridade.',

'tribunal_do_juri': 'Tribunal do Júri (CF Art. 5º XXXVIII + CPP Art. 406–497): crimes dolosos contra a vida (homicídio doloso, feminicídio, infanticídio, induzimento ao suicídio, aborto). Garantias: plenitude de defesa, sigilo das votações, soberania dos veredictos. Composição: 7 jurados (deve haver ao menos 15 sorteados), voto secreto, maioria simples (4×3). Quesitação: culpado? materialidade? autoria? tese defensiva? Absolvição imotivada possível (soberania).',

/* ── CÓDIGO CIVIL ── */
'codigo_civil': 'Código Civil (Lei 10.406/2002): regula relações privadas. Estrutura: Parte Geral (pessoas, bens, fatos jurídicos) + Parte Especial (obrigações, contratos, responsabilidade civil, família, sucessões, empresa). Princípios: socialidade, eticidade, operabilidade. Pessoas: físicas (desde nascimento com vida, personalidade pode ser anterior ao nascimento) e jurídicas (associações, sociedades, fundações). Capacidade: plena (+18a) ou relativa (16–18a: assistida). Absolutamente incapazes: menores de 16 anos.',

'contratos_cc': 'Contratos (CC Art. 421–853): função social do contrato limita autonomia privada. Princípios: boa-fé objetiva (lealdade, informação, cuidado), função social, probidade. Formação: proposta + aceitação. Vícios do consentimento: erro, dolo, coação, estado de perigo, lesão. Contratos típicos: compra e venda, doação, locação, empréstimo (mútuo/comodato), prestação de serviços, empreitada, mandato, fiança, seguro. Resolução por onerosidade excessiva (teoria da imprevisão/revisão).',

'responsabilidade_civil': 'Responsabilidade civil (CC Art. 186–188 e 927–954): dever de reparar dano causado por ato ilícito. Elementos: conduta (ação/omissão), dano (material ou moral), nexo causal, culpa (subjetiva — regra) ou sem culpa (objetiva — risco da atividade, parágrafo único Art. 927). Dano moral: abalo a direitos da personalidade (honra, imagem, privacidade); indenizável independentemente de dano material. Dano estético, dano por ricochete. Estado responde objetivamente (CF Art. 37 §6º).',

'familia_cc': 'Direito de Família (CC Arts. 1.511–1.783): casamento — ato formal, gratuito, laico; dissolve-se por divórcio (EC 66/2010 — sem prazo mínimo, sem causa justificada). União estável: relação pública, contínua, duradoura com objetivo de constituir família (reconhecida CF Art. 226 §3º; inclui casais homoafetivos — STF 2011 + Res. CNJ 175/2013). Regime de bens: comunhão parcial (regra), comunhão universal, separação total, participação final nos aquestos. Alimentos: necessidade x possibilidade; execução especial (prisão civil até 3 meses).',

'sucessoes_cc': 'Direito das Sucessões (CC Arts. 1.784–2.027): abertura da sucessão com a morte. Herança: inventário (60 dias da abertura — judicial ou extrajudicial se todos maiores e capazes). Ordem de vocação hereditária (Art. 1.829): 1º descendentes + cônjuge, 2º ascendentes + cônjuge, 3º cônjuge sozinho, 4º colaterais até 4º grau. Testamento: público (tabelião), cerrado, particular. Herdeiros necessários (descendentes, ascendentes, cônjuge): garantem metade da herança (legítima). Usufruto vidual extinto com novo matrimônio.',

/* ── CÓDIGO DE DEFESA DO CONSUMIDOR ── */
'cdc': 'Código de Defesa do Consumidor (Lei 8.078/1990): relação de consumo — fornecedor (pessoa física ou jurídica que desenvolve atividade de produção, montagem, criação, construção, transformação, importação, exportação, distribuição ou comercialização de produtos ou serviços) x consumidor (pessoa física ou jurídica que adquire como destinatário final). Princípios: vulnerabilidade do consumidor, boa-fé, transparência, equilíbrio contratual.',

'direitos_consumidor': 'Direitos básicos do consumidor (CDC Art. 6º): proteção à vida e saúde, educação e liberdade de escolha, informação adequada e clara, proteção contra publicidade enganosa/abusiva, proteção contratual, prevenção e reparação de danos (patrimonial e moral), acesso à justiça e facilitação da defesa (inversão do ônus da prova), adequada e eficaz prestação dos serviços públicos.',

'garantia_cdc': 'Garantias e prazos (CDC): Garantia legal — vícios aparentes: 30 dias (não duráveis) ou 90 dias (duráveis); vícios ocultos: mesmos prazos contados do momento em que aparece o vício. Garantia contratual: adicional à legal. Opções do consumidor após prazo sem solução: substituição do produto, restituição da quantia paga (corrigida) ou abatimento proporcional do preço. Prazo prescricional: 5 anos (ação de reparação de dano). Recall: obrigatório quando produto apresenta nocividade ou periculosidade.',

'pratica_abusiva_cdc': 'Práticas abusivas (CDC Art. 39): venda casada proibida; recusar atendimento à demanda do consumidor; enviar produto/serviço sem solicitação; publicidade enganosa (falsa) e abusiva (discriminatória, que explore medo/superstição, dirija-se à criança); cobrança de dívida com ameaça, constrangimento ou ridículo; elevar sem justa causa preços de produtos; recusar contrato escrito. Contratos de adesão: cláusulas abusivas são nulas de pleno direito (Art. 51).',

'direito_arrependimento': 'Direito de arrependimento (CDC Art. 49): compras fora do estabelecimento comercial (internet, telefone, domicílio) — prazo de 7 dias corridos a partir da assinatura ou recebimento do produto/serviço. Devolução integral, sem ônus para o consumidor. Não se aplica a compras feitas na loja física.',

'procon_cdc': 'Defesa administrativa do consumidor: PROCON (estadual/municipal) — reclamações, investigações, multas. SENACON (federal). Plataforma consumidor.gov.br (resolução online). SINDEC: sistema nacional de dados. Ação civil pública: MP, Defensoria, associações podem propor em favor de consumidores. Small claims: JEC para causas ≤40 salários mínimos (sem advogado até 20 SM).',

/* ── CLT / DIREITO DO TRABALHO ── */
'clt': 'Consolidação das Leis do Trabalho (Decreto-Lei 5.452/1943, reformada pela Lei 13.467/2017 — Reforma Trabalhista): regula relações de emprego. Requisitos do vínculo empregatício (Art. 3º): pessoalidade, não-eventualidade (habitualidade), onerosidade e subordinação. Empregado x autônomo (sem subordinação). Empregado doméstico: LC 150/2015. Trabalhador intermitente: Lei 13.467/2017.',

'jornada_trabalho': 'Jornada de trabalho (CF Art. 7º XIII-XIV + CLT): 8 horas diárias e 44 horas semanais (regra); 6 horas para turnos ininterruptos de revezamento. Hora extra: acréscimo mínimo de 50% (CF) ou 100% (noturna e domingos/feriados por convenção). Banco de horas: compensação por acordo individual (prazo 6 meses) ou coletivo (12 meses). Teletrabalho (home office): regulado Arts. 75-A a 75-E CLT (controle de jornada facultativo por acordo). Intervalos: 1–2h para jornada superior a 6h; 15min para 4–6h.',

'ferias_clt': 'Férias (CLT Art. 129–153): após 12 meses de trabalho (período aquisitivo), 30 dias de férias (se faltas ≤5 dias); 24 dias (6–14 faltas); 18 dias (15–23 faltas); 12 dias (24–32 faltas). Acréscimo de 1/3. Fracionamento: até 3 períodos (um de ao menos 14 dias) por acordo. Férias coletivas: dois períodos, ao menos 10 dias cada. Abono de 1/3 pode ser convertido em dinheiro (1/3 de 1/3). Vencidas geram dobro.',

'rescisao_clt': 'Rescisão do contrato de trabalho: sem justa causa pelo empregador — aviso prévio (30 dias + 3 por ano de serviço, máximo 90 dias), FGTS (3,2% acumulado por rescisão imotivada + 40% sobre saldo), 13º proporcional, férias vencidas+proporcionais+1/3, seguro-desemprego. Justa causa (Art. 482): improbidade, incontinência, negociação habitual, condenação criminal, desídia, embriaguez, violação de segredo, indisciplina/insubordinação, abandono de emprego (+30 dias sem justificativa), ato lesivo, jogos proibidos, ofensas. Pedido de demissão: aviso prévio, sem FGTS, sem seguro-desemprego.',

'fgts': 'FGTS (Fundo de Garantia do Tempo de Serviço — Lei 8.036/1990): depósito mensal de 8% do salário bruto pelo empregador (2% para aprendiz). Saque: dispensa sem justa causa (+ multa 40%), aposentadoria, morte, doença grave, habitação (SFH), calamidade, crise (saque emergencial). Conta vinculada à CAIXA ECONÔMICA. Rendimento: TJLP + 3% a.a. (abaixo da inflação histórica).',

'13o_salario': '13º salário (gratificação natalina — Lei 4.090/1962): pago em duas parcelas (até 30/11 e até 20/12) ou em uma até 20/12. Valor: 1/12 da remuneração por mês trabalhado no ano (fração ≥15 dias conta). Incide INSS e IR. Proporcional na rescisão (sem justa causa ou por justa causa do empregador). Base: última remuneração de novembro.',

'seguro_desemprego': 'Seguro-desemprego (Lei 7.998/1990): trabalhador dispensado sem justa causa. Número de parcelas: 3 (6–11 meses), 4 (12–23 meses), 5 (≥24 meses de trabalho nos 36 meses anteriores). Valores: primeiros R$ 2.041,45 (100%), próximos 50% (entre 1ª faixa e 3× o piso), acima: fixo. Não pode ter renda própria; não pode estar recebendo benefício previdenciário. Requerimento: 7–120 dias após dispensa.',

'negociacao_coletiva': 'Negociação coletiva pós-Reforma Trabalhista (Lei 13.467/2017): prevalece sobre lei (negociado sobre legislado) em itens como: banco de horas, jornada 12×36, intervalo intrajornada (mínimo 30min), plano de cargos, prêmios, home office, remuneração por produtividade. Limitações: não pode reduzir normas de saúde/segurança, 13º, férias+1/3, FGTS, salário mínimo, horas extras mínimo CF, aviso prévio mínimo.',

'justica_trabalho': 'Justiça do Trabalho (CF Art. 111–117): Varas do Trabalho → TRT (24 regionais) → TST. Competência: relações de trabalho (não apenas empregos), acidentes de trabalho, ações de dano moral decorrentes, ação de greve, execução das contribuições previdenciárias. Reclamação trabalhista (Reclamatória): prazo prescricional 2 anos após extinção do contrato e 5 anos durante o contrato (Art. 7º XXIX CF). JCJ extinto; hoje: Vara do Trabalho singular.',

/* ── ECA ── */
'eca': 'Estatuto da Criança e do Adolescente (Lei 8.069/1990): criança (0–11a) e adolescente (12–17a). Doutrina da proteção integral. Direitos: vida, saúde, alimentação, educação, esporte, lazer, profissionalização, cultura, dignidade, respeito, liberdade, convivência familiar e comunitária. Conselho Tutelar: defende direitos. Medidas socioeducativas (adolescente infrator): advertência, obrigação de reparar o dano, prestação de serviços à comunidade, liberdade assistida, semiliberdade, internação (máximo 3 anos).',

'crianca_trabalho_eca': 'Trabalho infantil (ECA + CF Art. 7º XXXIII): proibido abaixo de 16 anos (exceto aprendiz a partir de 14 anos). Proibido trabalho noturno, perigoso ou insalubre para menores de 18 anos. Aprendizagem (Lei 10.097/2000): 14–24 anos (até 29 para PCD), contrato especial, 2 anos máximo, salário mínimo hora. Empresas obrigadas a contratar aprendizes (5%–15% dos empregados com funções que exijam formação profissional).',

'adocao_eca': 'Adoção (ECA Arts. 39–52): medida excepcional e irrevogável. Cadastro nacional de adoção (CNA). Adotante: +18 anos, diferença mínima de 16 anos. Estágio de convivência: mínimo 90 dias. Adoção unilateral, conjunta (casados/união estável). Adoção internacional: regras Convenção de Haia. Guarda, tutela e adoção são gradações de vínculos.',

/* ── CTB ── */
'ctb': 'Código de Trânsito Brasileiro (Lei 9.503/1997): regula veículos, motoristas e vias públicas. DENATRAN/SENATRAN, DETRAN (estadual), DER, DPVAT (extinto 2020). CNH: categorias A, B, AB, C, D, E. PPD → CNH definitiva após 1 ano sem infração. Suspensão: 20 pontos em 12 meses (infrator primário) ou 30 em 12 meses. Cassação: reincidência na suspensão.',

'alcool_volante': 'Embriaguez ao volante (CTB Art. 306): crime — dirigir com concentração de álcool por litro de sangue igual ou superior a 6 decigramas (ou 0,3mg/l ar alveolar). Pena: detenção de 6 meses a 3 anos + multa + suspensão ou proibição de obter a habilitação. Lei Seca: tolerância zero — bafômetro ≥0,05mg/l: infração gravíssima (7 pontos + multa R$ 2.934,70 + suspensão 12 meses). Recusa ao teste: multa igual + suspensão.',

'crimes_transito': 'Crimes de trânsito (CTB Art. 302–312): homicídio culposo (Art. 302 — detenção 2–4 anos; qualificado: embriagado 5–8 anos), lesão culposa (Art. 303 — detenção 6m–2a; qualificado: embriagado 2–5 anos), omissão de socorro (Art. 304), fuga do local (Art. 305 — detenção 6m–3a), direção sem habilitação (Art. 309 — detenção 6m–1a), entrega a pessoa inabilitada (Art. 310), participação em racha (Art. 308 — detenção 6m–3a; se morte: 5–10 anos).',

/* ── LEI MARIA DA PENHA ── */
'lei_maria_da_penha': 'Lei Maria da Penha (Lei 11.340/2006): coíbe violência doméstica e familiar contra a mulher (CF Art. 226 §8º). Formas de violência: física, psicológica, sexual, patrimonial, moral. Âmbito: vínculo familiar, doméstico ou afetivo (não requer coabitação). Medidas protetivas de urgência: afastamento do agressor, proibição de aproximação (distância mínima), suspensão de visitas, alimentos, monitoramento eletrônico (tornozeleira). Pena mínima aumentada. Renúncia da vítima: não extingue punibilidade (Súmula 542 STJ). Competência exclusiva dos Juizados de Violência Doméstica.',

'feminicidio': 'Feminicídio (CP Art. 121 §2º VI + §2ºA + §7º — Lei 13.104/2015): homicídio doloso praticado contra a mulher por razões da condição de sexo feminino (violência doméstica/familiar; menosprezo ou discriminação à condição de mulher). Crime hediondo. Pena: 12–30 anos. Majorantes (+1/3 a +1/2): durante gestação/puerpério, vítima menor de 14/maior de 60 anos, na presença de descendente/ascendente, descumprimento de medida protetiva.',

/* ── LGPD ── */
'lgpd': 'Lei Geral de Proteção de Dados (Lei 13.709/2018, em vigor desde set/2020): regula tratamento de dados pessoais por pessoa natural ou jurídica (direito público ou privado). Dados pessoais: qualquer informação que identifique ou possa identificar a pessoa. Dados sensíveis: origem racial/étnica, convicção religiosa, opinião política, saúde, genética, biometria, vida sexual. Não se aplica: uso pessoal/doméstico, fins jornalísticos/artísticos/acadêmicos, segurança pública/defesa.',

'direitos_lgpd': 'Direitos do titular (LGPD Art. 18): confirmação da existência de tratamento; acesso aos dados; correção; anonimização/bloqueio/eliminação de desnecessários; portabilidade; eliminação dos tratados com consentimento; informação sobre com quem foram compartilhados; revogação do consentimento. ANPD (Autoridade Nacional de Proteção de Dados): fiscaliza e aplica sanções (advertência, multa até 2% do faturamento, R$ 50M/infração). Encarregado (DPO) obrigatório para controladores.',

'bases_legais_lgpd': 'Bases legais para tratamento (LGPD Art. 7º): consentimento do titular; cumprimento de obrigação legal; execução de políticas públicas; estudos por órgão de pesquisa; execução de contrato; exercício regular de direitos; proteção da vida; tutela da saúde; interesse legítimo do controlador; proteção ao crédito. Consentimento: livre, informado, inequívoco, específico. Pode ser revogado a qualquer momento.',

/* ── LEI DE DROGAS ── */
'lei_drogas': 'Lei de Drogas (Lei 11.343/2006): distingue usuário de traficante. Porte para uso pessoal (Art. 28): não há pena privativa de liberdade — penas: advertência, prestação de serviços à comunidade, medida educativa. Critérios para distinção usuário/traficante: quantidade, local, condições, antecedentes, circunstâncias. Tráfico (Art. 33): reclusão 5–15 anos + multa. Tráfico privilegiado (§4º): réu primário, bons antecedentes, não integra organização criminosa, sem violência — redução de 1/6 a 2/3 (STF: não é hediondo). Associação para o tráfico (Art. 35): 3–10 anos. Financiamento (Art. 36): 8–20 anos.',

/* ── CÓDIGO TRIBUTÁRIO ── */
'ctn': 'Código Tributário Nacional (Lei 5.172/1966 — status de LC): normas gerais de direito tributário. Conceito de tributo (Art. 3º): prestação pecuniária compulsória, em moeda, que não constitua sanção de ato ilícito, instituída em lei e cobrada mediante atividade administrativa plenamente vinculada. Espécies: impostos, taxas, contribuições de melhoria. Obrigação tributária: principal (pagar) e acessória (declarar). Crédito tributário: nasce com lançamento. Extinção: pagamento, compensação, transação, remissão, decadência, prescrição.',

'principais_impostos': 'Principais impostos brasileiros: Federais — IR (Imposto de Renda: PF — progressivo até 27,5%; PJ — IRPJ + CSLL), IPI (produtos industrializados), IOF (operações financeiras), II/IE (importação/exportação), ITR (territorial rural). Estaduais — ICMS (circulação de mercadorias e serviços: alíquota 7–25%), IPVA (veículos: estados fixam 2–4%), ITCMD (transmissão causa mortis e doação: até 8%). Municipais — ISS (serviços: 2–5%), IPTU (propriedade urbana), ITBI (transmissão imóvel inter-vivos: 2–3%).',

'simples_nacional': 'Simples Nacional (LC 123/2006): regime tributário unificado para ME (faturamento até R$ 360 mil/ano) e EPP (até R$ 4,8M/ano). Reúne 8 tributos em uma guia (DAS): IRPJ, CSLL, PIS, COFINS, CPP, IPI/ISS/ICMS conforme setor. Alíquotas: Anexo I (comércio) 4%–19%; II (indústria) 4,5%–30%; III (serviços com fator R) 6%–33%; IV (serviços sem CPP) 4,5%–33%; V (serviços) 15,5%–30%. MEI: faturamento até R$ 81 mil/ano, contribuição fixa mensal (~R$ 70).',

/* ── CÓDIGO DE PROCESSO CIVIL ── */
'cpc': 'Código de Processo Civil (Lei 13.105/2015 — NCPC): regula processo civil. Princípios: contraditório e ampla defesa, boa-fé processual, cooperação, duração razoável, publicidade, fundamentação das decisões, proporcionalidade e razoabilidade. Partes: autor, réu, juiz. Petição inicial → citação → contestação (15 dias úteis) → réplica → provas → sentença → recurso (apelação 15 dias úteis). Conciliação e mediação obrigatórias (salvo exceções).',

'tutela_urgencia': 'Tutelas de urgência (CPC Art. 294–311): tutela cautelar (preservar direito, não há julgamento de mérito) e tutela antecipada (antecipa efeitos práticos da sentença). Requisitos: probabilidade do direito + perigo de dano ou risco ao resultado útil do processo. Tutela de evidência: probabilidade alta + abuso do direito de defesa (sem necessidade de urgência). Liminar: decisão monocrática provisória que antecede citação.',

'prescricao_civil': 'Prescrição civil (CC Arts. 205–206): extinção da pretensão pelo decurso do tempo. Prazo geral: 10 anos (Art. 205). Prazos especiais (Art. 206): 1 ano (seguro, hospedeiro, protesto de títulos), 2 anos (alimentos), 3 anos (reparação de danos, enriquecimento sem causa, renda, alugueis, honorários), 4 anos (tutela), 5 anos (dívida líquida, profissionais liberais). Decadência: extinção do próprio direito. Causas suspensivas e interruptivas da prescrição.',

'recursos_cpc': 'Recursos no CPC: apelação (sentença — TJ/TRF, 15 dias), agravo de instrumento (decisão interlocutória de rol taxativo, 15 dias), embargos de declaração (omissão/obscuridade/contradição, 5 dias — prequestionamento), recurso ordinário (habeas corpus/mandado de segurança de TJ/TRF para STJ/STF), recurso especial (STJ — violação de lei federal), recurso extraordinário (STF — questão constitucional). Reclamação: preserva competência ou autoridade do STJ/STF.',

/* ── LEGISLAÇÃO AMBIENTAL ── */
'lei_ambiental': 'Direito Ambiental Brasileiro: CF Art. 225 — direito ao meio ambiente ecologicamente equilibrado. Lei da Política Nacional do Meio Ambiente (Lei 6.938/1981) — SISNAMA, CONAMA, IBAMA, licenciamento ambiental. Lei da Mata Atlântica (Lei 11.428/2006). Lei do SNUC (Lei 9.985/2000) — unidades de conservação. Código Florestal (Lei 12.651/2012) — Área de Preservação Permanente (APP), Reserva Legal, Cadastro Ambiental Rural (CAR). Licença Ambiental: prévia, de instalação, de operação.',

'crimes_ambientais': 'Crimes ambientais (Lei 9.605/1998): crimes contra fauna (matar, perseguir, caçar, apanhar espécime silvestre — detenção 6m–1a), flora (destruir floresta de preservação permanente — detenção 1–3a), poluição (causar poluição em níveis prejudiciais — reclusão 1–4a; poluição hídrica grave: 1–5a). Pessoa jurídica pode cometer crime ambiental e ser responsabilizada penalmente. Responsabilidade civil ambiental: objetiva (Lei 6.938/1981 Art. 14 §1º) — independe de culpa.',

/* ── LEI ANTITRUSTE / CONCORRÊNCIA ── */
'cade': 'Defesa da Concorrência (Lei 12.529/2011 — SBDC): CADE (Conselho Administrativo de Defesa Econômica) — Tribunal, Superintendência-Geral, DEE. Infrações: cartel (fixação de preços, divisão de mercado, licitação conluiada — multa 0,1–20% do faturamento + criminal), abuso de posição dominante, dumping. Atos de concentração (fusões/aquisições): notificação obrigatória se partes faturam R$ 750M e R$ 75M. Programa de leniência: imunidade/redução de pena para primeiro a confessar.',

/* ── LEI DE IMPROBIDADE / ANTICORRUPÇÃO ── */
'improbidade': 'Lei de Improbidade Administrativa (Lei 8.429/1992, reformada Lei 14.230/2021): atos de agentes públicos que causem enriquecimento ilícito (Art. 9), lesão ao erário (Art. 10), concessão indevida de vantagem (Art. 10-A) ou violação dos princípios da Administração (Art. 11 — HOJE DOLOSO). Sanções: perda dos bens/valores acrescidos ilicitamente, ressarcimento integral, multa (24× remuneração), suspensão de direitos políticos (3–14 anos), proibição de contratar. Prazo prescricional: 8 anos. PESSOA JURÍDICA não mais sujeita à LIA.',

'lei_anticorrupcao': 'Lei Anticorrupção (Lei 12.846/2013): responsabilidade objetiva de pessoas jurídicas por atos contra administração pública nacional ou estrangeira (corrupção, fraude em licitação, obstrução de investigação, lavagem de dinheiro). Sanções administrativas: multa 0,1–20% do faturamento bruto, publicação extraordinária da decisão condenatória. Programa de compliance (Art. 7º): atenua sanções. Acordo de leniência: isenção ou redução de sanções para quem colaborar.',

/* ── LEI DE LICITAÇÕES ── */
'licitacoes': 'Nova Lei de Licitações (Lei 14.133/2021 — substitui Lei 8.666/1993): modalidades — pregão (bens/serviços comuns), concorrência (obras/serviços especiais/concessão), concurso (trabalho técnico/artístico), leilão (bens móveis/imóveis), diálogo competitivo (soluções inovadoras). Critérios: menor preço, maior desconto, melhor técnica/técnica e preço, maior lance. RDC absorvido. Dispensa e inexigibilidade mantidas. Compliance e gestão de riscos obrigatórios.',

/* ── ESTATUTO DA OAB ── */
'oab': 'Advocacia (Lei 8.906/1994 — EOAB): OAB — Conselho Federal, Conselhos Seccionais, Subseções. Advogado: indispensável à administração da justiça (CF Art. 133). Prerrogativas: contato pessoal com cliente preso, inviolabilidade do escritório/instrumentos de trabalho, sigilo profissional, uso de togas, prazo em dobro no processo (estatutário). Honorários: contratuais, sucumbenciais (CPC — honorários mínimos de 10%–20%) ou fixados pela tabela OAB. Exame de Ordem: obrigatório para exercício. Infrações disciplinares: advertência, censura, suspensão, exclusão.',

/* ── DIREITO ELEITORAL ── */
'direito_eleitoral': 'Direito Eleitoral: Código Eleitoral (Lei 4.737/1965), Lei das Eleições (Lei 9.504/1997), Lei dos Partidos Políticos (Lei 9.096/1995), Lei da Ficha Limpa (LC 135/2010). TSE: jurisdição máxima. Sufrágio universal: obrigatório 18–70 anos, facultativo 16–17a e >70a. Fidelidade partidária. Inelegibilidades: condenação por órgão colegiado (Ficha Limpa — 8 anos), desincompatibilização, captação ilícita de sufrágio, abuso de poder. Financiamento: Fundo Eleitoral (público), proibição de doações empresariais (STF 2015).',

/* ── PREVIDÊNCIA SOCIAL ── */
'previdencia': 'Previdência Social (CF Arts. 201–202 + Lei 8.213/1991 + EC 103/2019 — Reforma da Previdência): RGPS (Regime Geral — INSS) cobre empregados, autônomos, domésticos. Benefícios: aposentadoria por idade (62F/65M + 15/20a contribuição mínima), por incapacidade permanente (antiga invalidez), por tempo de contribuição (extinta EC 103), auxílio por incapacidade temporária (antigo auxílio-doença, INSS: 91% do salário de benefício, carência 12 contribuições), salário-maternidade (120 dias, carência 10 contribuições para contribuinte individual), pensão por morte, auxílio-acidente. Teto RGPS: R$ 7.786,02 (2024). RPPS: servidores públicos.',

/* ── HABEAS CORPUS / REMÉDIOS CONSTITUCIONAIS RESUMO ── */
'remedios_constitucionais': 'Remédios constitucionais: Habeas corpus (HC) — liberdade de locomoção; Mandado de segurança (MS) — direito líquido e certo, não amparado por HC/HD; Mandado de injunção (MI) — falta de norma regulamentadora que torne inviável exercício de direito constitucional (STF pode suprir omissão); Habeas data (HD) — acesso/retificação de dados pessoais em bancos governamentais; Ação popular (AP) — cidadão anula ato lesivo ao patrimônio público/moralidade/meio ambiente; Ação civil pública (ACP — Lei 7.347/1985) — tutela de interesses difusos, coletivos e individuais homogêneos.',

/* ── DIREITO PENAL ECONÔMICO ── */
'crime_lavagem': 'Lavagem de dinheiro (Lei 9.613/1998 — reformada Lei 12.683/2012): ocultar ou dissimular natureza, origem, localização, disposição, movimentação ou propriedade de bens provenientes de qualquer infração penal. Pena: reclusão 3–10 anos + multa. Fases: colocação (introdução no sistema financeiro), estratificação (ocultação da origem), integração (retorno ao patrimônio "limpo"). Acordo de colaboração premiada: redução de até 2/3 da pena. COAF (hoje UIF): inteligência financeira.',

'crime_estelionato': 'Estelionato (CP Art. 171): obter vantagem ilícita em prejuízo alheio, induzindo ou mantendo alguém em erro, por meio fraudulento. Pena: reclusão 1–5 anos + multa. Figuras equiparadas: abuso de incapaz, fraude no pagamento, fraude para recebimento de seguro, fraude em contratos. Estelionato eletrônico/digital (§2ºA): crime praticado mediante utilização de informação fornecida pela vítima ou por terceiro induzido a erro por meio de redes sociais, contatos telefônicos ou envio de correio eletrônico fraudulento.',

/* ── NORMAS TRABALHISTAS ESPECIAIS ── */
'acidente_trabalho': 'Acidente de trabalho e doenças ocupacionais (Lei 8.213/1991 Art. 19–23): acidente típico, acidente de trajeto (in itinere), doença profissional (inerente à atividade) e doença do trabalho (adquirida ou desencadeada). CAT: Comunicação de Acidente de Trabalho (emitida pelo empregador até 1º dia útil seguinte; morte = imediato). Direitos: estabilidade de 12 meses após alta do INSS (Art. 118), FGTS, auxílio por incapacidade temporária (B91/B31), aposentadoria por incapacidade permanente. Nexo técnico epidemiológico (NTEP).',

'assedio_moral': 'Assédio moral no trabalho: exposição prolongada e repetitiva a condutas humilhantes, vexatórias, que causem dano à dignidade do trabalhador. Não está tipificado como crime federal (projetos em tramitação), mas gera: rescisão indireta (Art. 483 CLT), indenização por dano moral (responsabilidade subjetiva do empregador). Lei municipal/estadual tipifica em alguns estados (SP, RJ). Assédio sexual (CP Art. 216-A): constranger alguém com o intuito de obter vantagem ou favorecimento sexual, prevalecendo-se de condição de superior hierárquico ou ascendência — detenção 1–2 anos.',

/* ── DIREITO DIGITAL ── */
'marco_civil_internet': 'Marco Civil da Internet (Lei 12.965/2014): direitos e deveres de usuários e provedores na internet. Princípios: neutralidade de rede (tratamento isonômico dos pacotes), privacidade, liberdade de expressão. Guarda de registros de acesso: provedores de aplicações por 6 meses, provedores de conexão por 1 ano. Responsabilidade civil de provedores: isentos por conteúdo de terceiros, salvo descumprimento de ordem judicial de remoção. Fake news: sem lei específica ainda (discussão PL 2630/2020).',

'lgpd_resumo': 'LGPD (Lei 13.709/2018): protege dados pessoais. Controlador: decide o tratamento. Operador: realiza em nome do controlador. Titular: a pessoa a quem pertencem os dados. ANPD: autoridade fiscalizadora. Multa máxima: 2% do faturamento ou R$ 50M por infração. Bases legais: 10 hipóteses (consentimento, obrigação legal, contrato, legítimo interesse etc.). Dados sensíveis: tratamento mais restrito. Violação de dados (breach): notificação à ANPD e ao titular em prazo razoável.',

/* ── LEIS ESPECIAIS ── */
'estatuto_desarmamento': 'Estatuto do Desarmamento (Lei 10.826/2003 + Dec. 9.685/2019): posse de arma de fogo em casa ou trabalho — registro no SINARM (Exército/PF). Porte: apenas para atividades específicas (forças de segurança, atiradores desportivos, colecionadores, vigilantes). Porte ilegal (Art. 14): detenção 2–4 anos. Posse irregular (Art. 12): detenção 1–3 anos. Comércio ilegal (Art. 17): reclusão 4–8 anos. Tráfico internacional (Art. 18): reclusão 8–16 anos. Crimes hediondos se envolvem milícia.',

'racismo_injuria_racial': 'Racismo (Lei 7.716/1989): praticar, induzir ou incitar discriminação ou preconceito de raça, cor, etnia, religião ou procedência nacional. Imprescritível e inafiançável (CF Art. 5º XLII). Crimes: recusar emprego/alojamento/serviço (2–5 anos), impedir acesso a escola/estabelecimento (3–5 anos), praticar, induzir ou incitar (2–5 anos). Injúria racial (CP Art. 140 §3º — reformado Lei 14.532/2023): agora equiparada a racismo, imprescritível. Discurso de ódio: STF entende que não é liberdade de expressão.',

'lei_anticrime': 'Pacote Anticrime (Lei 13.964/2019): introduziu o juiz das garantias (STF suspendeu), plea bargain (ANPP — acordo de não persecução penal: crime sem violência/grave ameaça, pena mínima <4 anos, réu primário, confissão, reparação do dano, condições por 1–4 anos), aperfeiçoou colaboração premiada, aumentou penas de crimes hediondos, vedou progressão de regime para condenados por crimes hediondos com resultado morte antes de 40 anos de reclusão.',

'anpp': 'Acordo de Não Persecução Penal (ANPP — CPP Art. 28-A, Lei 13.964/2019): MP propõe ao investigado que confessou crime sem violência ou grave ameaça, com pena mínima inferior a 4 anos. Condições: reparar o dano, renunciar a bens, prestar serviços à comunidade, pagar prestação pecuniária, cumprir outra condição. Prazo: 1–4 anos. Cumprido: extinção da punibilidade. Não é condenação. Diferente da transação penal (Jecrim) e da suspensão condicional do processo.',

'lei_de_falencias': 'Lei de Falências e Recuperação de Empresas (Lei 11.101/2005, reformada Lei 14.112/2020): recuperação judicial (devedor em crise com atividade exercida há 2+ anos — plano de 2 anos prorrogável); recuperação extrajudicial (negociação com credores sem intervenção judicial para homologação); falência (incapacidade de cumprir obrigações — liquidação do ativo para pagar passivo). Ordem de pagamento na falência: trabalhistas (150 SM/credor) e acidentários → garantias reais (até valor do bem) → tributários → quirografários → subordinados.',

'lei_inquilinato': 'Lei do Inquilinato (Lei 8.245/1991): regula locação de imóveis urbanos. Prazo determinado ou indeterminado. Garantias: caução (3 meses antecipados), fiança, seguro-fiança, cessão fiduciária. Despejo: falta de pagamento (ação de despejo — prazo para emenda da mora: 15 dias); término do contrato; retomada para uso próprio. Preferência do locatário: na venda do imóvel (Art. 27) — notificação com prazo de 30 dias. Locação por temporada: até 90 dias. Reajuste: pelo IGPM ou IPCA + livre negociação.',

'codigo_florestal': 'Código Florestal (Lei 12.651/2012): Área de Preservação Permanente (APP) — faixas ao longo de rios (30m para rios <10m; 500m para rios >600m), ao redor de nascentes (50m), em topos de morros, encostas. Reserva Legal (RL): 80% na Amazônia, 35% no Cerrado na Amazônia Legal, 20% no restante. CAR — Cadastro Ambiental Rural: registro obrigatório on-line de todos os imóveis rurais. Servidão ambiental: proprietário renuncia a usar além da RL. Pagamento por Serviços Ambientais (PSA).',

'direito_autoral': 'Direito Autoral (Lei 9.610/1998): protege criações intelectuais originais (obras literárias, artísticas, científicas). Direitos morais: perpétuos, inalienáveis (paternidade, integridade, publicação). Direitos patrimoniais: 70 anos após morte do autor. Domínio público após 70 anos. Licença Creative Commons: amplia uso. Plágio: atribuição indevida de autoria. Software: Lei 9.609/1998 (50 anos de proteção). ECAD: arrecada direitos autorais de músicas executadas publicamente. Pirataria: crime (Art. 184 CP — detenção 3m–1a; com intenção lucrativa: reclusão 2–4a).',

'codigo_de_etica_medica': 'Conselho Federal de Medicina (CFM) — Código de Ética Médica (Res. CFM 2.217/2018): princípios fundamentais — medicina como profissão a serviço da saúde do ser humano e da coletividade. Vedações principais: discriminar pacientes, abandonar paciente em emergência, descumprir sigilo médico (exceto doenças de notificação compulsória), realizar procedimentos sem consentimento informado, publicidade enganosa, emissão de documentos falsos. CRM: conselho estadual fiscaliza. Sigilo médico: dever ético e legal (salvo exceções legais).',

/* ── DIREITO PREVIDENCIÁRIO ESPECIAL ── */
'bpc_loas': 'BPC/LOAS (Benefício de Prestação Continuada — Lei 8.742/1993): garantido ao idoso ≥65 anos e à pessoa com deficiência que comprovem não ter meios de prover própria manutenção ou tê-la provida pela família. Renda per capita familiar ≤1/4 do salário mínimo (regra geral; STF flexibilizou). Valor: 1 salário mínimo. Não contributivo — não gera direito a 13º nem pensão por morte para dependentes. Diferente da aposentadoria do INSS.',

/* ── RESUMO JUDICIAL ── */
'instancias_judiciario': 'Instâncias do Judiciário brasileiro: 1ª instância — Juízes (varas cíveis, criminais, federais, do trabalho, eleitorais). 2ª instância — Tribunais (TJ estaduais, TRFs, TRTs, TREs). Superior — STJ (uniformizar direito federal infraconstitucional), TST (trabalhista), TSE (eleitoral), STM (militar). Supremo — STF (guarda da CF, controle concentrado e difuso). Súmula vinculante: edita o STF; vincula todos os órgãos do Judiciário e Administração Pública. Reclamação ao STF: para preservar competência ou autoridade das decisões.',

'controle_constitucionalidade': 'Controle de constitucionalidade: Difuso (qualquer juiz/tribunal — caso concreto — via de exceção) e Concentrado (STF — ação direta). ADI (Ação Direta de Inconstitucionalidade): lei/ato normativo federal ou estadual inconstitucional. ADC (Ação Declaratória de Constitucionalidade): confirma constitucionalidade. ADPF (Arguição de Descumprimento de Preceito Fundamental): violação de preceito fundamental. ADO (Ação Direta de Inconstitucionalidade por Omissão). Legitimados ativos (Art. 103 CF): PR, mesas, governadores, OAB, partidos, confederações, entidades de classe.',

},

/* ════════════════════════════════════════════════════════════════════
   ENGLISH
════════════════════════════════════════════════════════════════════ */
en: {

'brazil_constitution': 'Brazilian Federal Constitution (1988 — "Citizen Constitution"): supreme law of Brazil, promulgated October 5, 1988. Key principles (Art. 1): sovereignty, citizenship, human dignity, social values of work and free enterprise, political pluralism. Three branches: Executive, Legislative, Judicial — independent and harmonious. Unamendable clauses (Art. 60 §4): federalism, universal direct secret ballot, separation of powers, individual rights and guarantees.',

'brazil_fundamental_rights': 'Fundamental rights (Art. 5 — 78 items): equality before the law; inviolability of life, liberty, equality, security and property; freedom of thought, conscience, belief; privacy and family life inviolability; home inviolability (except flagrante, disaster or judicial warrant); habeas corpus; right to silence; presumption of innocence; due process and broad defense; prohibition of death penalty (except declared war), life imprisonment, forced labor, banishment, cruel punishments.',

'brazil_penal_code': 'Brazilian Penal Code (Decree-Law 2,848/1940): divides into General Part (crimes, penalties, rules) and Special Part (offenses). Key principles: legality (no crime without prior law), culpability, proportionality. Penalties: imprisonment (reclusão/detenção), restriction of rights, fines. Murder (Art. 121): 6–20 years; qualified (motive, method, feminicide): 12–30 years. Theft (Art. 155): 1–4 years; qualified: 2–8 years. Robbery (Art. 157): 4–10 years; latrocínio (robbery resulting in death, heinous): 20–30 years.',

'brazil_consumer_code': 'Consumer Defense Code (Law 8,078/1990 — CDC): protects consumers in supply relationships. Basic rights: safety, information, freedom of choice, protection against misleading advertising, contractual protection, damage reparation, access to justice. Warranty: 30 days (non-durable goods) or 90 days (durable goods) for apparent defects. Right of withdrawal: 7 days for off-premises contracts (internet, phone, home sales). Abusive clauses in adhesion contracts are null and void.',

'brazil_labor_law': 'Brazilian Labor Law (CLT — Decree-Law 5,452/1943, amended by Labor Reform 2017): employment requires: personal service, habituality, remuneration and subordination. Working hours: 8h/day, 44h/week. Overtime: minimum 50% premium. FGTS: 8% monthly deposit by employer. 13th salary (Christmas bonus). Annual leave: 30 days with 1/3 premium. Dismissal without cause: advance notice + 40% FGTS penalty + unemployment insurance. Statute of limitations: 2 years after termination, 5 years during employment.',

'brazil_data_protection': 'LGPD — Brazilian Data Protection Law (Law 13,709/2018, effective September 2020): modeled after GDPR. Regulates processing of personal data by any person or legal entity in Brazil (public or private). Personal data: any information identifying or capable of identifying a person. Sensitive data: race/ethnicity, religion, political opinion, health, genetics, biometrics, sexual life. Rights: access, correction, deletion, portability, information on sharing, revocation of consent. ANPD: supervisory authority. Maximum fine: 2% of revenue, BRL 50M per infraction.',

'brazil_drug_law': 'Brazilian Drug Law (Law 11,343/2006): distinguishes users from traffickers. Personal use (Art. 28): no imprisonment — community service, warning, educational measures. Criteria for distinction: quantity, location, circumstances, prior record. Drug trafficking (Art. 33): 5–15 years imprisonment + fine. Privileged trafficking (§4): first-time offender, no criminal organization — reduction of 1/6 to 2/3 (STF ruled NOT heinous crime). Drug trafficking association (Art. 35): 3–10 years.',

'brazil_family_law': 'Brazilian Family Law (Civil Code Arts. 1,511–1,783): marriage — formal, secular; dissolved by divorce (no waiting period since EC 66/2010). Stable union: public, continuous, lasting relationship with intent to form family (recognized for same-sex couples since STF 2011). Property regimes: partial community property (default), universal community, total separation, final participation in acquired assets. Child support: calculated by need vs. ability. Inheritance: legal order — descendants + spouse → ascendants + spouse → spouse alone → collaterals up to 4th degree.',

},

/* ════════════════════════════════════════════════════════════════════
   ESPAÑOL
════════════════════════════════════════════════════════════════════ */
es: {

'constitucion_brasil': 'Constitución Federal de Brasil (1988 — "Constitución Ciudadana"): ley suprema de Brasil, promulgada el 5/10/1988. Principios fundamentales (Art. 1º): soberanía, ciudadanía, dignidad de la persona humana, valores sociales del trabajo y de la libre iniciativa, pluralismo político. Tres poderes: Ejecutivo, Legislativo, Judicial — independientes y armónicos. Cláusulas pétreas (Art. 60 §4º): forma federativa, voto directo universal secreto, separación de poderes, derechos y garantías individuales.',

'codigo_penal_brasil': 'Código Penal de Brasil (Decreto-Ley 2.848/1940): se divide en Parte General (crímenes, penas, aplicación) y Parte Especial (tipos penales). Principios: legalidad, culpabilidad, proporcionalidad. Homicidio simple (Art. 121): 6–20 años; calificado: 12–30 años. Hurto (Art. 155): 1–4 años; calificado: 2–8 años. Robo (Art. 157): 4–10 años; con muerte (latrocínio, hediondo): 20–30 años. Estafa (Art. 171): 1–5 años. Violación (Art. 213): 6–10 años; agravada: 12–30 años. Crímenes hediondos: régimen más severo.',

'cdc_brasil': 'Código de Defensa del Consumidor de Brasil (Ley 8.078/1990): derechos básicos — seguridad, información, libre elección, protección contra publicidad engañosa, protección contractual, reparación de daños, acceso a la justicia. Garantía legal: 30 días (no duraderos) o 90 días (duraderos) para vicios aparentes. Derecho de arrepentimiento: 7 días para compras fuera del establecimiento (internet, teléfono, domicilio). Cláusulas abusivas en contratos de adhesión son nulas.',

'clt_brasil': 'CLT — Consolidación de las Leyes del Trabajo de Brasil (Decreto-Ley 5.452/1943, reformado 2017): vínculo laboral requiere: personalidad, habitualidad, onerosidad y subordinación. Jornada: 8h/día, 44h/semana. Horas extra: mínimo 50% de adicional. FGTS: depósito mensual del 8% del salario. 13º salario (gratificación navideña). Vacaciones: 30 días + 1/3. Despido sin causa: preaviso + multa 40% FGTS + seguro desempleo. Prescripción: 2 años tras extinción del contrato; 5 años durante el contrato.',

'lgpd_brasil': 'LGPD — Ley General de Protección de Datos de Brasil (Ley 13.709/2018, vigente desde septiembre 2020): regula el tratamiento de datos personales. Modeled on GDPR. Derechos del titular: acceso, corrección, eliminación, portabilidad, información sobre compartición, revocación del consentimiento. ANPD: autoridad supervisora. Multa máxima: 2% de la facturación o R$ 50M por infracción. Datos sensibles (raza, religión, salud, biometría, vida sexual): tratamiento más restrictivo.',

'ley_drogas_brasil': 'Ley de Drogas de Brasil (Ley 11.343/2006): distingue usuario de traficante. Uso personal (Art. 28): no hay prisión — servicios comunitarios, advertencia, medidas educativas. Tráfico (Art. 33): 5–15 años + multa. Tráfico privilegiado (§4º): primario, sin organización criminal — reducción de 1/6 a 2/3 (STF: no es crimen hediondo). Asociación para el tráfico (Art. 35): 3–10 años.',

'derecho_familia_brasil': 'Derecho de Familia de Brasil (Código Civil Arts. 1.511–1.783): matrimonio — acto formal, laico; se disuelve por divorcio (sin plazo mínimo desde 2010). Unión estable: relación pública, continua y duradera (reconocida para parejas del mismo sexo desde 2011). Regímenes de bienes: comunidad parcial de bienes (regla), comunidad universal, separación total. Alimentos: calculados según necesidad vs. posibilidad; ejecución especial (prisión civil hasta 3 meses). Adopción: medida excepcional e irrevocable.',

},

    }
  });
}(window));
