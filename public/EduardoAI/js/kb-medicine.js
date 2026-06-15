/* kb-medicine.js — Eduardo.AI Medical Knowledge Base v2026.03.23
   ICD-10-CM 2022: 72,748 codes.

   PERFORMANCE STRATEGY:
   1. Common codes answered instantly from curated ICD_DETAIL map (no fetch needed).
   2. Full JSON (icd10cm_2022_compact.json — flat {code:desc} object, ~6 MB)
      loaded once, stored in localStorage under key "icd10_v2022".
   3. On subsequent page loads the map is read from localStorage synchronously —
      zero network round-trip, ready before the first user keypress.
   4. If localStorage is unavailable / stale, falls back to fetch().

   Compact JSON format: {"A000":"Cholera due to...","A001":"..."}
   (No array wrapper, no "code"/"description" keys — saves ~4 MB vs original)
*/
(function(W) {
  'use strict';

  /* ═══════════════════════════════════════════════════════════
     TRANSLATION ENGINE  (unchanged from original)
  ═══════════════════════════════════════════════════════════ */
  var TRANS = [
    [/\binitial encounter for open fracture type I or II\b/gi,'encontro inicial para fratura exposta tipo I ou II','encuentro inicial para fractura expuesta tipo I o II'],
    [/\binitial encounter for open fracture type IIIA, IIIB, or IIIC\b/gi,'encontro inicial para fratura exposta tipo IIIA, IIIB ou IIIC','encuentro inicial para fractura expuesta tipo IIIA, IIIB o IIIC'],
    [/\binitial encounter for open fracture\b/gi,'encontro inicial para fratura exposta','encuentro inicial para fractura expuesta'],
    [/\binitial encounter for closed fracture\b/gi,'encontro inicial para fratura fechada','encuentro inicial para fractura cerrada'],
    [/\binitial encounter\b/gi,'encontro inicial','encuentro inicial'],
    [/\bsubsequent encounter for fracture with routine healing\b/gi,'encontro subsequente para fratura com consolidação normal','encuentro subsecuente para fractura con curación rutinaria'],
    [/\bsubsequent encounter for fracture with delayed healing\b/gi,'encontro subsequente para fratura com consolidação retardada','encuentro subsecuente para fractura con curación demorada'],
    [/\bsubsequent encounter for fracture with nonunion\b/gi,'encontro subsequente para fratura com não-união','encuentro subsecuente para fractura con no-unión'],
    [/\bsubsequent encounter for fracture with malunion\b/gi,'encontro subsequente para fratura com consolidação viciosa','encuentro subsecuente para fractura con mala unión'],
    [/\bsubsequent encounter\b/gi,'encontro subsequente','encuentro subsecuente'],
    [/\bencounter for examination of blood pressure with abnormal findings\b/gi,'consulta para exame de pressão arterial com achados anormais','consulta para examen de presión arterial con hallazgos anormales'],
    [/\bencounter for examination of blood pressure without abnormal findings\b/gi,'consulta para exame de pressão arterial sem achados anormais','consulta para examen de presión arterial sin hallazgos anormales'],
    [/\bencounter for\b/gi,'consulta para','consulta para'],
    [/\bsequela\b/gi,'sequela','secuela'],
    [/\bdisplaced fracture\b/gi,'fratura desviada','fractura desplazada'],
    [/\bnondisplaced fracture\b/gi,'fratura sem desvio','fractura no desplazada'],
    [/\bstress fracture\b/gi,'fratura por estresse','fractura por estrés'],
    [/\bpathological fracture\b/gi,'fratura patológica','fractura patológica'],
    [/\bcompression fracture\b/gi,'fratura por compressão','fractura por compresión'],
    [/\bavulsion fracture\b/gi,'fratura por avulsão','fractura por avulsión'],
    [/\bfracture of shaft\b/gi,'fratura da diáfise','fractura de la diáfisis'],
    [/\bfracture of neck\b/gi,'fratura do colo','fractura del cuello'],
    [/\bfracture of head\b/gi,'fratura da cabeça','fractura de la cabeza'],
    [/\bfracture of base\b/gi,'fratura da base','fractura de la base'],
    [/\bfracture of body\b/gi,'fratura do corpo','fractura del cuerpo'],
    [/\bfracture\b/gi,'fratura','fractura'],
    [/\bmalunion\b/gi,'consolidação viciosa','mala unión'],
    [/\bnonunion\b/gi,'não-união','no-unión'],
    [/\btype 1 diabetes mellitus\b/gi,'diabetes mellitus tipo 1','diabetes mellitus tipo 1'],
    [/\btype 2 diabetes mellitus\b/gi,'diabetes mellitus tipo 2','diabetes mellitus tipo 2'],
    [/\bother specified diabetes mellitus\b/gi,'diabetes mellitus especificado','diabetes mellitus especificado'],
    [/\bdiabetes mellitus\b/gi,'diabetes mellitus','diabetes mellitus'],
    [/\bdiabetic retinopathy\b/gi,'retinopatia diabética','retinopatía diabética'],
    [/\bdiabetic macular edema\b/gi,'edema macular diabético','edema macular diabético'],
    [/\bdiabetic nephropathy\b/gi,'nefropatia diabética','nefropatía diabética'],
    [/\bdiabetic neuropathy\b/gi,'neuropatia diabética','neuropatía diabética'],
    [/\bdiabetic ketoacidosis\b/gi,'cetoacidose diabética','cetoacidosis diabética'],
    [/\bhypoglycemia\b/gi,'hipoglicemia','hipoglucemia'],
    [/\bhyperglycemia\b/gi,'hiperglicemia','hiperglucemia'],
    [/\bST elevation \(STEMI\) myocardial infarction\b/gi,'infarto do miocárdio com supradesnivelamento de ST (IAMCST)','infarto de miocardio con elevación del ST (IAMCST)'],
    [/\bnon-ST elevation \(NSTEMI\) myocardial infarction\b/gi,'infarto do miocárdio sem supradesnivelamento de ST (IAMSST)','infarto de miocardio sin elevación del ST (IAMSST)'],
    [/\bmyocardial infarction\b/gi,'infarto do miocárdio','infarto de miocardio'],
    [/\bessential \(primary\) hypertension\b/gi,'hipertensão arterial essencial (primária)','hipertensión arterial esencial (primaria)'],
    [/\bheart failure\b/gi,'insuficiência cardíaca','insuficiencia cardíaca'],
    [/\batrial fibrillation\b/gi,'fibrilação atrial','fibrilación auricular'],
    [/\bcoronary artery disease\b/gi,'doença arterial coronariana','enfermedad arterial coronaria'],
    [/\bcardiac arrest\b/gi,'parada cardíaca','paro cardíaco'],
    [/\bdeep vein thrombosis\b/gi,'trombose venosa profunda','trombosis venosa profunda'],
    [/\bpulmonary embolism\b/gi,'embolia pulmonar','embolia pulmonar'],
    [/\bischemic stroke\b/gi,'acidente vascular cerebral isquêmico','accidente cerebrovascular isquémico'],
    [/\bhypertension\b/gi,'hipertensão','hipertensión'],
    [/\bchronic obstructive pulmonary disease\b/gi,'doença pulmonar obstrutiva crônica (DPOC)','enfermedad pulmonar obstructiva crónica (EPOC)'],
    [/\basthma\b/gi,'asma','asma'],
    [/\bpneumonia\b/gi,'pneumonia','neumonía'],
    [/\brespiratory failure\b/gi,'insuficiência respiratória','insuficiencia respiratoria'],
    [/\bschizophrenia\b/gi,'esquizofrenia','esquizofrenia'],
    [/\bbipolar disorder\b/gi,'transtorno bipolar','trastorno bipolar'],
    [/\bmajor depressive disorder\b/gi,'transtorno depressivo maior','trastorno depresivo mayor'],
    [/\bdepressive disorder\b/gi,'transtorno depressivo','trastorno depresivo'],
    [/\banxiety disorder\b/gi,'transtorno de ansiedade','trastorno de ansiedad'],
    [/\bpost-traumatic stress disorder\b/gi,'transtorno de estresse pós-traumático (TEPT)','trastorno de estrés postraumático (TEPT)'],
    [/\bdementia\b/gi,'demência','demencia'],
    [/\bepsy\b/gi,'epilepsia','epilepsia'],
    [/\bmigraine\b/gi,'enxaqueca','migraña'],
    [/\brheumatoid arthritis\b/gi,'artrite reumatoide','artritis reumatoide'],
    [/\bosteoarthritis\b/gi,'osteoartrite','osteoartritis'],
    [/\bosteoporosis\b/gi,'osteoporose','osteoporosis'],
    [/\bgastroesophageal reflux disease\b/gi,'doença do refluxo gastroesofágico (DRGE)','enfermedad por reflujo gastroesofágico (ERGE)'],
    [/\bpeptic ulcer\b/gi,'úlcera péptica','úlcera péptica'],
    [/\bchronic kidney disease\b/gi,'doença renal crônica','enfermedad renal crónica'],
    [/\burinary tract infection\b/gi,'infecção do trato urinário','infección del tracto urinario'],
    [/\bmalignant neoplasm\b/gi,'neoplasia maligna','neoplasia maligna'],
    [/\bhypothyroidism\b/gi,'hipotireoidismo','hipotiroidismo'],
    [/\bhyperthyroidism\b/gi,'hipertireoidismo','hipertiroidismo'],
    [/\bobesity\b/gi,'obesidade','obesidad'],
    [/\bdiabetes mellitus\b/gi,'diabetes mellitus','diabetes mellitus'],
    [/\bfemur\b/gi,'fêmur','fémur'],
    [/\btibia\b/gi,'tíbia','tibia'],
    [/\bhumerus\b/gi,'úmero','húmero'],
    [/\bradius\b/gi,'rádio','radio'],
    [/\blumbar vertebra\b/gi,'vértebra lombar','vértebra lumbar'],
    [/\bthoracic vertebra\b/gi,'vértebra torácica','vértebra torácica'],
    [/\bcervical vertebra\b/gi,'vértebra cervical','vértebra cervical'],
    [/\bright hand\b/gi,'mão direita','mano derecha'],
    [/\bleft hand\b/gi,'mão esquerda','mano izquierda'],
    [/\bright leg\b/gi,'perna direita','pierna derecha'],
    [/\bleft leg\b/gi,'perna esquerda','pierna izquierda'],
    [/\bright knee\b/gi,'joelho direito','rodilla derecha'],
    [/\bleft knee\b/gi,'joelho esquerdo','rodilla izquierda'],
    [/\bright hip\b/gi,'quadril direito','cadera derecha'],
    [/\bleft hip\b/gi,'quadril esquerdo','cadera izquierda'],
    [/\bright shoulder\b/gi,'ombro direito','hombro derecho'],
    [/\bleft shoulder\b/gi,'ombro esquerdo','hombro izquierdo'],
    [/\bright eye\b/gi,'olho direito','ojo derecho'],
    [/\bleft eye\b/gi,'olho esquerdo','ojo izquierdo'],
    [/\bcataract\b/gi,'catarata','catarata'],
    [/\bglaucoma\b/gi,'glaucoma','glaucoma'],
    [/\binfection\b/gi,'infecção','infección'],
    [/\bpain\b/gi,'dor','dolor'],
    [/\bfever\b/gi,'febre','fiebre'],
    [/\bedema\b/gi,'edema','edema'],
    [/\bhemorrhage\b/gi,'hemorragia','hemorragia'],
    [/\bthrombosis\b/gi,'trombose','trombosis'],
    [/\binflammation\b/gi,'inflamação','inflamación'],
    [/\bnecrosis\b/gi,'necrose','necrosis'],
    [/\bchronic\b/gi,'crônico','crónico'],
    [/\bacute\b/gi,'agudo','agudo'],
    [/\bsevere\b/gi,'grave','grave'],
    [/\bmild\b/gi,'leve','leve'],
    [/\bmoderate\b/gi,'moderado','moderado'],
    [/\bbilateral\b/gi,'bilateral','bilateral'],
    [/\bunilateral\b/gi,'unilateral','unilateral'],
    [/\bsyndrome\b/gi,'síndrome','síndrome'],
    [/\bdisorder\b/gi,'transtorno','trastorno'],
    [/\bdisease\b/gi,'doença','enfermedad'],
    [/\bcomplication\b/gi,'complicação','complicación'],
    [/\binsufficiency\b/gi,'insuficiência','insuficiencia'],
    [/\bdeficiency\b/gi,'deficiência','deficiencia'],
    [/\bstenosis\b/gi,'estenose','estenosis'],
    [/\brupture\b/gi,'ruptura','ruptura'],
    [/\bulcer\b/gi,'úlcera','úlcera'],
    [/\btumor\b/gi,'tumor','tumor'],
    [/\bsclerosis\b/gi,'esclerose','esclerosis'],
    [/\bparalysis\b/gi,'paralisia','parálisis'],
    [/\ballergy\b/gi,'alergia','alergia'],
    [/\bautoimmune\b/gi,'autoimune','autoinmune'],
    [/\bsurgery\b/gi,'cirurgia','cirugía'],
    [/\btherapy\b/gi,'terapia','terapia'],
    [/\bdiagnosis\b/gi,'diagnóstico','diagnóstico'],
    [/\bsymptom\b/gi,'sintoma','síntoma'],
    [/\bright\b/gi,'direito','derecho'],
    [/\bleft\b/gi,'esquerdo','izquierdo'],
    [/\bunspecified\b/gi,'não especificado','no especificado'],
    [/\bproximal\b/gi,'proximal','proximal'],
    [/\bdistal\b/gi,'distal','distal'],
    [/\banterior\b/gi,'anterior','anterior'],
    [/\bposterior\b/gi,'posterior','posterior'],
    [/\bsuperior\b/gi,'superior','superior'],
    [/\binferior\b/gi,'inferior','inferior'],
    [/\bother\b/gi,'outro','otro'],
    [/\bmultiple\b/gi,'múltiplo','múltiple'],
    [/\bprimary\b/gi,'primário','primario'],
    [/\bsecondary\b/gi,'secundário','secundario'],
    [/\bdue to\b/gi,'devido a','debido a'],
    [/\bwithout\b/gi,'sem','sin'],
    [/\bwith\b/gi,'com','con'],
    [/\band\b/gi,'e','y'],
    [/\bor\b/gi,'ou','o'],
    [/\bof\b/gi,'de','de'],
    [/\bfor\b/gi,'para','para'],
  ];

  function translateDesc(en, targetLang) {
    if (!en || targetLang === 'en') return en;
    var idx = (targetLang === 'es') ? 2 : 1;
    var result = en;
    for (var i = 0; i < TRANS.length; i++) {
      result = result.replace(TRANS[i][0], TRANS[i][idx]);
    }
    return result;
  }

  /* ═══════════════════════════════════════════════════════════
     CODE NORMALIZATION
  ═══════════════════════════════════════════════════════════ */
  function normalizeCode(raw) {
    return String(raw).trim().toUpperCase().replace(/[\s.]/g, '');
  }

  /* ═══════════════════════════════════════════════════════════
     CURATED DETAIL MAP  (instant answers — no fetch needed)
  ═══════════════════════════════════════════════════════════ */
  var ICD_DETAIL = {
    'F20':{ pt:{label:'Esquizofrenia',detail:'Transtorno psicótico crônico: delírios, alucinações, pensamento desorganizado, embotamento afetivo. Início típico: 15–35 anos. Hipótese dopaminérgica. Tratamento: antipsicóticos (haloperidol, risperidona, olanzapina, clozapina para refratários) + reabilitação psicossocial. Prevalência ~1% mundial.'},
             en:{label:'Schizophrenia',detail:'Chronic psychotic disorder: delusions, hallucinations, disorganized thinking, flat affect. Typical onset: 15–35 years. Dopamine hypothesis. Treatment: antipsychotics (haloperidol, risperidone, olanzapine, clozapine for refractory) + psychosocial rehabilitation. ~1% worldwide prevalence.'},
             es:{label:'Esquizofrenia',detail:'Trastorno psicótico crónico: delirios, alucinaciones, pensamiento desorganizado. Inicio: 15–35 años. Tratamiento: antipsicóticos + rehabilitación psicosocial. Prevalencia ~1%.'}},
    'F31':{ pt:{label:'Transtorno bipolar',detail:'Episódios alternantes de mania e depressão. Tipo I: mania plena; Tipo II: hipomania+depressão. Tratamento: lítio (reduz suicídio), valproato, lamotrigina, antipsicóticos atípicos (quetiapina). Manutenção a longo prazo é essencial.'},
             en:{label:'Bipolar disorder',detail:'Alternating mania and depression. Type I: full mania; Type II: hypomania+depression. Treatment: lithium (reduces suicide), valproate, lamotrigine, atypical antipsychotics (quetiapine). Long-term maintenance essential.'},
             es:{label:'Trastorno bipolar',detail:'Alternancia entre manía y depresión. Tratamiento: litio, valproato, lamotrigina, antipsicóticos atípicos. Mantenimiento a largo plazo esencial.'}},
    'F32':{ pt:{label:'Episódio depressivo',detail:'Humor deprimido, anedonia, fadiga, alterações de sono/apetite ≥2 semanas. Tratamento: ISRS (fluoxetina, sertralina, escitalopram), ISRN (venlafaxina, duloxetina), TCC, para refratários: ECT, esketamina nasal.'},
             en:{label:'Depressive episode',detail:'Depressed mood, anhedonia, fatigue, sleep/appetite changes ≥2 weeks. Treatment: SSRIs (fluoxetine, sertraline, escitalopram), SNRIs (venlafaxine, duloxetine), CBT, for refractory: ECT, nasal esketamine.'},
             es:{label:'Episodio depresivo',detail:'Humor deprimido, anhedonia, fatiga ≥2 semanas. Tratamiento: ISRS (fluoxetina, sertralina), IRSN (venlafaxina), TCC, ECT en refractarios.'}},
    'I10':{ pt:{label:'Hipertensão arterial essencial',detail:'PA ≥130/80 mmHg. 1,28 bilhões de adultos. Principal causa de AVC e IAM. Geralmente assintomática. Tratamento: estilo de vida → IECA/BRA + tiazídico + BCC → espironolactona + beta-bloqueador. Meta <130/80.'},
             en:{label:'Essential hypertension',detail:'BP ≥130/80 mmHg. 1.28 billion adults. #1 cause of stroke and MI. Usually asymptomatic. Treatment ladder: lifestyle → ACE inhibitor/ARB + thiazide + CCB → spironolactone + beta-blocker. Target <130/80.'},
             es:{label:'Hipertensión arterial esencial',detail:'PA ≥130/80 mmHg. 1.280 millones de adultos. Principal causa de ACV e IAM. Tratamiento: IECA/ARA2 + tiazida + BCC. Meta <130/80.'}},
    'E11':{ pt:{label:'Diabetes tipo 2',detail:'Resistência insulínica + falência progressiva de células β. Diagnóstico: glicemia jejum ≥126 mg/dL ×2, HbA1c ≥6,5%. Tratamento: metformina (1ª linha) + SGLT2i (dapagliflozina) + GLP-1RA (semaglutida). Complicações: retinopatia, nefropatia, neuropatia, IAM, AVC.'},
             en:{label:'Type 2 diabetes',detail:'Insulin resistance + progressive β-cell failure. Diagnosis: fasting glucose ≥126 mg/dL ×2, HbA1c ≥6.5%. Treatment: metformin (1st line) + SGLT2i (dapagliflozin) + GLP-1RA (semaglutide). Complications: retinopathy, nephropathy, neuropathy, MI, stroke.'},
             es:{label:'Diabetes tipo 2',detail:'Resistencia insulínica + falla progresiva de células β. Tratamiento: metformina + SGLT2i (dapagliflozina) + GLP-1RA (semaglutida). Complicaciones: retinopatía, nefropatía, neuropatía.'}},
    'E10':{ pt:{label:'Diabetes tipo 1',detail:'Destruição autoimune de células β pancreáticas. Diagnóstico: glicemia ≥126 mg/dL ou HbA1c ≥6,5%. Tratamento: insulina basal + bolus (esquema intensificado). Monitorização contínua de glicose (CGM). Complicações: retinopatia, nefropatia, neuropatia, CAD.'},
             en:{label:'Type 1 diabetes',detail:'Autoimmune destruction of pancreatic β-cells. Treatment: basal + bolus insulin (intensified regimen). Continuous glucose monitoring (CGM). Complications: retinopathy, nephropathy, neuropathy, DKA.'},
             es:{label:'Diabetes tipo 1',detail:'Destrucción autoinmune de células β. Tratamiento: insulina basal + bolo. Complicaciones: retinopatía, nefropatía, neuropatía, CAD.'}},
    'J44':{ pt:{label:'DPOC',detail:'Obstrução irreversível do fluxo aéreo. Causa: tabagismo (85%). VEF₁/CVF <0,70. Tratamento estável: cessação tabágica, broncodilatadores (LAMA>LABA), reabilitação pulmonar, O₂ domiciliar. Exacerbação: corticoide + broncodilatador + ATB se infecção.'},
             en:{label:'COPD',detail:'Irreversible airflow obstruction. Cause: smoking (85%). FEV₁/FVC <0.70. Stable treatment: smoking cessation, bronchodilators (LAMA>LABA), pulmonary rehabilitation, home O₂. Exacerbation: systemic corticosteroid + bronchodilator + antibiotic if infection.'},
             es:{label:'EPOC',detail:'Obstrucción irreversible. Causa: tabaquismo (85%). FEV₁/FVC <0,70. Tratamiento: cese tabáquico, LAMA, LABA, rehabilitación pulmonar.'}},
    'I50':{ pt:{label:'Insuficiência cardíaca',detail:'IC sistólica: FEVE<40%. IC diastólica: FEVE≥50%. Sintomas: dispneia, ortopneia, edema MMII, BNP elevado. Tratamento FEVEr (4 pilares): IECA/sacubitril-valsartana + betabloqueador + espironolactona + SGLT2i (dapagliflozina).'},
             en:{label:'Heart failure',detail:'Systolic HF: EF<40%. Diastolic HF: EF≥50%. Symptoms: exertional→resting dyspnea, orthopnea, lower limb edema, elevated BNP/NT-proBNP. HFrEF treatment (4 pillars): ACE inhibitor/sacubitril-valsartan + beta-blocker + spironolactone + SGLT2i (dapagliflozin).'},
             es:{label:'Insuficiencia cardíaca',detail:'IC sistólica: FEVI<40%. Síntomas: disnea, ortopnea, edema. Tratamiento: IECA/sacubitril-valsartán + betabloqueador + espironolactona + SGLT2i.'}},
    'I21':{ pt:{label:'Infarto agudo do miocárdio (IAMCST)',detail:'Oclusão coronária total. ECG: supradesnivelamento ST ≥1 mm em ≥2 derivações contíguas. Biomarcadores: troponina ultrassensível. Tratamento: cateterismo primário <90 min + AAS + ticagrelor/clopidogrel + anticoagulante.'},
             en:{label:'Acute myocardial infarction (STEMI)',detail:'Total coronary occlusion. ECG: ST elevation ≥1mm in ≥2 contiguous leads. Biomarkers: high-sensitivity troponin. Treatment: primary PCI <90 min + ASA + ticagrelor/clopidogrel + anticoagulant.'},
             es:{label:'Infarto agudo de miocardio (IAMCST)',detail:'Oclusión coronaria total. ECG: elevación ST ≥1 mm. Tratamiento: ATC primaria <90 min + AAS + ticagrelor/clopidogrel + anticoagulante.'}},
    'J45':{ pt:{label:'Asma',detail:'Inflamação crônica das vias aéreas: episódios recorrentes de dispneia, sibilos, tosse. Espirometria: VEF₁/CVF baixo com reversibilidade ≥12%. Tratamento controlador: CI ± LABA. Crise: SABA (salbutamol) + corticoide sistêmico.'},
             en:{label:'Asthma',detail:'Chronic airway inflammation: recurrent dyspnea, wheezing, cough. Spirometry: low FEV₁/FVC with ≥12% reversibility. Controller treatment: ICS ± LABA. Acute attack: SABA (salbutamol) + systemic corticosteroid.'},
             es:{label:'Asma',detail:'Inflamación crónica de vías aéreas. Espirometría: VEF₁/CVF bajo con reversibilidad ≥12%. Controlador: CI ± LABA. Crisis: SABA + corticoide sistémico.'}},
    'N18':{ pt:{label:'Doença renal crônica',detail:'TFG <60 mL/min/1,73m² por >3 meses. Estágios G1–G5 (G5=diálise). Causas: DM (40%), HAS (25%), glomerulonefrites. Tratamento: controle da causa base + IECA/BRA + SGLT2i + dieta hipoproteica. Diálise quando TFG <10–15.'},
             en:{label:'Chronic kidney disease',detail:'GFR <60 mL/min/1.73m² for >3 months. Stages G1–G5 (G5=dialysis). Causes: DM (40%), hypertension (25%), glomerulonephritis. Treatment: treat cause + ACE inhibitor/ARB + SGLT2i + low-protein diet.'},
             es:{label:'Enfermedad renal crónica',detail:'TFG <60 mL/min/1,73m² por >3 meses. Causas: DM (40%), HTA (25%). Tratamiento: IECA/ARA2 + SGLT2i + dieta hipoproteica. Diálisis cuando TFG <10–15.'}},
    'B20':{ pt:{label:'HIV/SIDA',detail:'Retrovírus que destrói linfócitos TCD4+. CD4+ <200: SIDA. TARV: TDF+3TC+DTG — carga viral suprimida em >95%. PrEP: TDF/FTC diário (>99%). PEP: profilaxia pós-exposição em <72h.'},
             en:{label:'HIV/AIDS',detail:'Retrovirus destroying TCD4+ lymphocytes. CD4+ <200: AIDS. ART: TDF+3TC+DTG regimen — viral load suppressed in >95%. PrEP: daily TDF/FTC (>99% efficacy). PEP: post-exposure prophylaxis within 72h.'},
             es:{label:'VIH/SIDA',detail:'Retrovirus que destruye TCD4+. CD4+ <200: SIDA. TAR: TDF+3TC+DTG suprime carga viral en >95%. PrEP: TDF/FTC diario (>99%).'}},
    'A41':{ pt:{label:'Sepse',detail:'Disfunção orgânica ameaçadora à vida causada por resposta desregulada à infecção. Critérios qSOFA: FR≥22, confusão, PA sistólica≤100. Bundle "1 hora": hemoculturas, lactato, antibióticos, fluidos 30mL/kg. Mortalidade: 15–30%.'},
             en:{label:'Sepsis',detail:'Life-threatening organ dysfunction caused by dysregulated host response to infection. qSOFA criteria: RR≥22, altered mentation, SBP≤100. 1-hour bundle: blood cultures, lactate, antibiotics, 30mL/kg fluids. Mortality: 15–30%.'},
             es:{label:'Sepsis',detail:'Disfunción orgánica potencialmente mortal por respuesta desregulada a infección. qSOFA: FR≥22, confusión, PAS≤100. Bundle 1 hora: hemocultivos, lactato, antibióticos, fluidos 30mL/kg.'}},
    'G20':{ pt:{label:'Doença de Parkinson',detail:'Degeneração dopaminérgica na substância negra. Tríade: tremor de repouso, rigidez, bradicinesia. Tratamento: levodopa/carbidopa (padrão-ouro), agonistas dopaminérgicos (pramipexol), IMAO-B (selegilina). DBS para refratários.'},
             en:{label:"Parkinson's disease",detail:'Dopaminergic degeneration in substantia nigra. Triad: resting tremor, rigidity, bradykinesia. Treatment: levodopa/carbidopa (gold standard), dopamine agonists (pramipexole), MAO-B inhibitors (selegiline). DBS for refractory cases.'},
             es:{label:'Enfermedad de Parkinson',detail:'Degeneración dopaminérgica en sustancia negra. Tríada: temblor de reposo, rigidez, bradicinesia. Tratamiento: levodopa/carbidopa, agonistas dopaminérgicos, IMAOs-B. DBS en refractarios.'}},
    'G40':{ pt:{label:'Epilepsia',detail:'Crises epilépticas recorrentes não provocadas. Classificação: focal (consciência preservada ou prejudicada), generalizada (ausência, tônico-clônica, mioclônica). Tratamento: valproato, lamotrigina, levetiracetam, carbamazepina. Status epilepticus: benzodiazepínico IV.'},
             en:{label:'Epilepsy',detail:'Recurrent unprovoked seizures. Classification: focal (aware or impaired awareness), generalized (absence, tonic-clonic, myoclonic). Treatment: valproate, lamotrigine, levetiracetam, carbamazepine. Status epilepticus: IV benzodiazepine.'},
             es:{label:'Epilepsia',detail:'Crisis epilépticas recurrentes no provocadas. Clasificación: focal, generalizada (ausencia, tónico-clónica). Tratamiento: valproato, lamotrigina, levetiracetam. Status epilepticus: BZD IV.'}},
    'C34':{ pt:{label:'Câncer de pulmão',detail:'Tipos: células não pequenas (CPNPC — adenocarcinoma, escamoso, grandes células) 85% e células pequenas (CPPC) 15%. Tabagismo: causa em 85%. Triagem: TC de baixa dose (tabagistas 50–80 anos, ≥20 maços-ano). Tratamento: ressecção + quimioterapia ± imunoterapia (pembrolizumabe).'},
             en:{label:'Lung cancer',detail:'Types: non-small cell (NSCLC — adenocarcinoma, squamous, large cell) 85% and small cell (SCLC) 15%. Smoking: cause in 85%. Screening: low-dose CT (smokers 50–80 years, ≥20 pack-years). Treatment: resection + chemotherapy ± immunotherapy (pembrolizumab).'},
             es:{label:'Cáncer de pulmón',detail:'Tipos: no células pequeñas (CPNCP) 85% y células pequeñas (CPCP) 15%. Tabaquismo: causa en 85%. Tamizaje: TC de baja dosis. Tratamiento: resección + quimioterapia ± inmunoterapia (pembrolizumab).'}},
  };

  /* ═══════════════════════════════════════════════════════════
     ICD DATA STORE  —  localStorage cache + fetch fallback
  ═══════════════════════════════════════════════════════════ */
  var LS_KEY  = 'icd10_v2022';          /* localStorage key         */
  var LS_VER  = 'icd10_v2022_version';  /* version/etag key         */
  var LS_VER_VAL = '2022.1';            /* bump this to force refresh */

  var _icdMap    = null;      /* {CODE: 'description', ...}  */
  var _loadState = 'idle';    /* idle | loading | ready | error */
  var _loadQueue = [];

  /* JSON URL — compact flat object instead of array, ~6 MB */
  var JSON_URL = (function() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || '';
      if (src.indexOf('kb-medicine') >= 0) {
        return src.replace(/kb-medicine\.js[^/]*$/, '') + 'icd10cm_2022_compact.json';
      }
    }
    return 'icd10cm_2022_compact.json';
  }());

  /* ── Try localStorage first (synchronous, instant) ── */
  function tryLoadFromStorage() {
    try {
      if (localStorage.getItem(LS_VER) !== LS_VER_VAL) return false;
      var raw = localStorage.getItem(LS_KEY);
      if (!raw) return false;
      var t0 = Date.now();
      _icdMap = JSON.parse(raw);
      console.log('[ICD] Loaded from localStorage in ' + (Date.now()-t0) + 'ms (' + Object.keys(_icdMap).length + ' codes)');
      _loadState = 'ready';
      return true;
    } catch(e) {
      return false;
    }
  }

  /* ── Fetch and cache ── */
  function fetchAndCache(callback) {
    _loadState = 'loading';
    var t0 = Date.now();

    /* Use fetch() with a cache-friendly request (no cache-bust on the JSON itself
       so the browser HTTP cache / CDN can serve it fast on 2nd visit before LS warms up) */
    if (typeof fetch !== 'undefined') {
      fetch(JSON_URL)
        .then(function(r) {
          if (!r.ok) throw new Error('HTTP ' + r.status);
          return r.json();
        })
        .then(function(data) {
          _icdMap = data; /* already a flat object */
          _loadState = 'ready';
          console.log('[ICD] Fetched in ' + (Date.now()-t0) + 'ms (' + Object.keys(_icdMap).length + ' codes)');
          /* Cache to localStorage async (don't block callback) */
          setTimeout(function() {
            try {
              localStorage.setItem(LS_KEY, JSON.stringify(_icdMap));
              localStorage.setItem(LS_VER, LS_VER_VAL);
              console.log('[ICD] Saved to localStorage');
            } catch(e) {
              console.warn('[ICD] localStorage save failed:', e.message);
            }
          }, 0);
          for (var i = 0; i < _loadQueue.length; i++) _loadQueue[i](true);
          _loadQueue = [];
          callback(true);
        })
        .catch(function(e) {
          console.error('[ICD] fetch failed:', e);
          _loadState = 'error';
          for (var i = 0; i < _loadQueue.length; i++) _loadQueue[i](false);
          _loadQueue = [];
          callback(false);
        });
    } else {
      /* XHR fallback */
      var xhr = new XMLHttpRequest();
      xhr.open('GET', JSON_URL, true);
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            _icdMap = JSON.parse(xhr.responseText);
            _loadState = 'ready';
            console.log('[ICD] XHR loaded in ' + (Date.now()-t0) + 'ms');
            try {
              localStorage.setItem(LS_KEY, xhr.responseText);
              localStorage.setItem(LS_VER, LS_VER_VAL);
            } catch(e2) {}
            for (var i = 0; i < _loadQueue.length; i++) _loadQueue[i](true);
            _loadQueue = [];
            callback(true);
          } catch(e) {
            _loadState = 'error';
            for (var i = 0; i < _loadQueue.length; i++) _loadQueue[i](false);
            _loadQueue = [];
            callback(false);
          }
        } else {
          _loadState = 'error';
          for (var i = 0; i < _loadQueue.length; i++) _loadQueue[i](false);
          _loadQueue = [];
          callback(false);
        }
      };
      xhr.send();
    }
  }

  function loadICD(callback) {
    if (_loadState === 'ready') { callback(true); return; }
    if (_loadState === 'error') { callback(false); return; }
    if (_loadState === 'loading') { _loadQueue.push(callback); return; }
    /* idle — try localStorage first */
    if (tryLoadFromStorage()) { callback(true); return; }
    /* need to fetch */
    _loadQueue.push(callback);
    fetchAndCache(function(){});
  }

  /* Kick off background load immediately on script execution */
  (function() {
    if (tryLoadFromStorage()) return; /* already warm */
    /* Start fetching in background right away */
    if (typeof document !== 'undefined') {
      var kick = function() { if (_loadState === 'idle') fetchAndCache(function(){}); };
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', kick);
      } else {
        kick();
      }
    }
  }());

  /* ═══════════════════════════════════════════════════════════
     LOOKUP  —  curated map first, then full JSON
  ═══════════════════════════════════════════════════════════ */
  function lookupFromJSON(code, lc) {
    if (!_icdMap) return null;

    /* Exact match */
    if (_icdMap[code]) {
      return { label: translateDesc(_icdMap[code], lc), detail: null };
    }

    /* Prefix match */
    var matches = [];
    var keys = Object.keys(_icdMap);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i].indexOf(code) === 0) {
        matches.push({ code: keys[i], desc: _icdMap[keys[i]] });
      }
    }
    if (matches.length === 0) return null;
    if (matches.length === 1) {
      return { label: translateDesc(matches[0].desc, lc), detail: null };
    }

    var lines = [];
    var limit = Math.min(matches.length, 15);
    for (var j = 0; j < limit; j++) {
      lines.push(matches[j].code + ' — ' + translateDesc(matches[j].desc, lc));
    }
    if (matches.length > 15) {
      lines.push('... (' + (matches.length - 15) + (lc === 'pt' ? ' mais' : lc === 'es' ? ' más' : ' more') + ')');
    }
    var heading = lc === 'pt' ? 'Subcódigos para ' + code + ':' :
                  lc === 'es' ? 'Subcódigos para ' + code + ':' :
                  'Subcodes for ' + code + ':';
    return { label: heading, detail: lines.join('\n') };
  }

  W.lookupICDCode = function(rawCode, lang) {
    var lc = lang || 'pt';
    var code = normalizeCode(rawCode);
    var base = code.slice(0, 3);

    /* 1. Curated detail — instant, no JSON needed */
    if (ICD_DETAIL[base]) {
      var d = ICD_DETAIL[base][lc] || ICD_DETAIL[base]['pt'];
      if (d) return { label: d.label, detail: d.detail };
    }

    /* 2. Full JSON map */
    return lookupFromJSON(code, lc);
  };

  /* ═══════════════════════════════════════════════════════════
     ASYNC LOOKUP  —  used by chat.js
     Returns a synchronous string AND calls deliverFn when ready.
     For curated codes: answers instantly (no "loading" message).
     For full-JSON codes: shows loading only if map not warm yet.
  ═══════════════════════════════════════════════════════════ */
  W.icdReady   = function() { return _loadState === 'ready'; };
  W.icdLoading = function() { return _loadState === 'loading'; };

  function buildAnswer(rawCode, lc, r) {
    var prefix = lc === 'pt' ? 'CID-10: ' : lc === 'es' ? 'CIE-10: ' : 'ICD-10: ';
    var txt = prefix + normalizeCode(rawCode) + ' — ' + r.label;
    if (r.detail) txt += '\n\n' + r.detail;
    txt += '\n\n⚠ ' + (lc === 'pt' ? 'Informação educacional. Consulte um profissional de saúde.' :
                       lc === 'es' ? 'Solo educativo. Consulte a un profesional de salud.' :
                                     'Educational only. Consult a healthcare professional.');
    return txt;
  }

  W.__icdLookupAsync = function(rawCode, lang, deliverFn) {
    var lc = lang || 'pt';
    var code = normalizeCode(rawCode);
    var base = code.slice(0, 3);

    /* Case 1: curated code — answer immediately, no loading message */
    if (ICD_DETAIL[base]) {
      var d = ICD_DETAIL[base][lc] || ICD_DETAIL[base]['pt'];
      if (d) {
        var ans = buildAnswer(rawCode, lc, { label: d.label, detail: d.detail });
        return ans; /* synchronous — chat.js gets it right away */
      }
    }

    /* Case 2: full JSON already loaded */
    if (_loadState === 'ready') {
      var r = lookupFromJSON(code, lc);
      if (!r) {
        var nf = lc === 'pt' ? 'Código não encontrado na base CID-10 2022.' :
                 lc === 'es' ? 'Código no encontrado en la base CIE-10 2022.' :
                               'Code not found in ICD-10 2022 database.';
        return nf;
      }
      return buildAnswer(rawCode, lc, r);
    }

    /* Case 3: JSON still loading — show brief loading message, deliver when ready */
    var loading = lc === 'pt' ? '⏳ Consultando CID-10…' :
                  lc === 'es' ? '⏳ Consultando CIE-10…' :
                                '⏳ Looking up ICD-10…';

    loadICD(function(ok) {
      if (!ok) {
        var err = lc === 'pt' ? '❌ Falha ao carregar dados CID-10. Verifique: https://icd.who.int' :
                  lc === 'es' ? '❌ Error al cargar datos CIE-10. Consulte: https://icd.who.int' :
                                '❌ Failed to load ICD-10 data. See: https://icd.who.int';
        if (deliverFn) deliverFn(err);
        return;
      }
      var r2 = lookupFromJSON(code, lc);
      if (!r2) {
        var nf2 = lc === 'pt' ? 'Código não encontrado na base CID-10 2022.' :
                  lc === 'es' ? 'Código no encontrado en la base CIE-10 2022.' :
                                'Code not found in ICD-10 2022 database.';
        if (deliverFn) deliverFn(nf2);
        return;
      }
      if (deliverFn) deliverFn(buildAnswer(rawCode, lc, r2));
    });

    return loading;
  };

  /* ═══════════════════════════════════════════════════════════
     KNOWLEDGE BASE PLUGIN
  ═══════════════════════════════════════════════════════════ */
  if (!W.EduardoKB) W.EduardoKB = [];
  W.EduardoKB.push({
    id: 'medicine',
    priority: 8,
    lang: {
      pt: {
        'cid10': 'CID-10 (Classificação Internacional de Doenças, 10ª revisão, OMS). Base completa com 72.748 códigos. Estrutura: letra (capítulo) + 2 dígitos + subdivisão. Exemplos: A-B infecciosas, C-D neoplasias, E endócrinas, F mentais, G neurológicas, I cardiovasculares, J respiratórias, K digestivas, M osteomusculares, N geniturinárias. Digite qualquer código (ex: F20, I21, E11, J45) para consulta.',
        'sinais_vitais': 'PA normal: <120/80 mmHg. FC: 60-100 bpm. FR: 12-20 irpm. SpO₂: ≥95%. Temperatura: 36-37,5°C (febre >37,8°C). Glasgow: 15=normal, ≤8=grave.',
        'emergencias': 'PCR: RCP 30:2 + DEA. Anafilaxia: adrenalina IM 0,5mg. Sepse: hemoculturas + ATB + fluidos 30mL/kg. AVC: alteplase IV até 4,5h. CAD: insulina IV + hidratação. IAMCSST: cateterismo primário <90min.',
        'vacinas': 'Vacinas NÃO causam autismo (estudo Wakefield 1998 foi fraudulento e retratado). Tipos: vivas atenuadas (MMR, varicela), inativadas (influenza, hep A), subunidades (HBV, HPV), mRNA (COVID-19).',
        'obesidade': 'IMC ≥25 sobrepeso, ≥30 obeso, ≥40 obeso mórbido. Farmacoterapia: semaglutida (GLP-1RA) -15%, tirzepatida -22,5%. Cirurgia: bypass -30%, sleeve -25%.',
      },
      en: {
        'icd10': 'ICD-10 (International Classification of Diseases, 10th revision, WHO). Full database with 72,748 codes. Type any code (e.g. F20, I21, E11, J45) for instant lookup.',
        'vital_signs': 'Normal BP: <120/80 mmHg. HR: 60-100 bpm. RR: 12-20 breaths/min. SpO₂: ≥95%. Temperature: 36-37.5°C (fever >37.8°C).',
        'emergency_medicine': 'Cardiac arrest: CPR 30:2 + AED. Anaphylaxis: epinephrine IM 0.5mg. STEMI: primary PCI <90min. Ischemic stroke: alteplase IV up to 4.5h. DKA: IV insulin + fluids. Sepsis: blood cultures + antibiotics + 30mL/kg crystalloids.',
        'vaccination': 'Vaccines do NOT cause autism (Wakefield 1998 was fraudulent and retracted). Types: live-attenuated (MMR, varicella), inactivated (influenza, hep A), subunit (HBV, HPV), mRNA (COVID-19).',
      },
      es: {
        'cie10': 'CIE-10 (Clasificación Internacional de Enfermedades, 10ª revisión, OMS). Base completa con 72.748 códigos. Escriba cualquier código (ej: F20, I21, E11, J45) para consultar.',
        'signos_vitales': 'PA normal: <120/80 mmHg. FC: 60-100 lpm. FR: 12-20 rpm. SpO₂: ≥95%. Temperatura: 36-37,5°C (fiebre >37,8°C).',
        'emergencias': 'PCR: RCP 30:2 + DEA. Anafilaxia: adrenalina IM 0,5mg. IAMCEST: angioplastia primaria <90min. ACV isquémico: alteplasa IV hasta 4,5h. CAD: insulina IV + hidratación.',
        'vacunas': 'Las vacunas NO causan autismo (estudio Wakefield fraudulento y retractado). Tipos: viva atenuada (SRP, varicela), inactivada (influenza), subunidades (HBV, VPH), ARNm (COVID-19).',
      }
    }
  });

}(window));
