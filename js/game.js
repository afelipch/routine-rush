/*
 * Routine Rush — Moteur de jeu
 * ---------------------------------------------------------------
 * Contiene la lógica del juego: niveles, generación de retos,
 * puntuación, combos, pistas y dominio del vocabulario.
 * No manipula el DOM directamente (eso es tarea de js/ui.js).
 */

const Game = (function () {
  // ---------------------------------------------------------------
  // Utilidades
  // ---------------------------------------------------------------
  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function sample(arr, n) {
    return shuffle(arr).slice(0, Math.min(n, arr.length));
  }

  function choose(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function byId(id) {
    return VOCABULARY.find((w) => w.id === id);
  }

  function byLevel(level) {
    return VOCABULARY.filter((w) => w.level === level);
  }

  function normalize(s) {
    return s
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[’‘`´]/g, "'")
      .replace(/\.$/, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  const ACCENT_MAP = {
    à: "a", â: "a", ä: "a", á: "a", ã: "a",
    ç: "c",
    è: "e", é: "e", ê: "e", ë: "e",
    ì: "i", í: "i", î: "i", ï: "i",
    ò: "o", ó: "o", ô: "o", ö: "o", õ: "o",
    ù: "u", ú: "u", û: "u", ü: "u",
    ñ: "n",
    œ: "oe", æ: "ae"
  };

  function stripAccents(s) {
    return s
      .split("")
      .map((ch) => ACCENT_MAP[ch] || ch)
      .join("");
  }

  function checkTypedAnswer(userInput, acceptedList) {
    const norm = normalize(userInput);
    if (!norm) return { correct: false, accentIssue: false };
    for (const accepted of acceptedList) {
      if (norm === normalize(accepted)) {
        return { correct: true, accentIssue: false, correctForm: accepted };
      }
    }
    for (const accepted of acceptedList) {
      if (stripAccents(norm) === stripAccents(normalize(accepted))) {
        return { correct: true, accentIssue: true, correctForm: accepted };
      }
    }
    return { correct: false, accentIssue: false };
  }

  // ---------------------------------------------------------------
  // Mapas temáticos (decisiones pedagógicas documentadas en README)
  // ---------------------------------------------------------------
  const ACTION_TO_OBJECT = {
    balayer: "un_balai",
    faire_le_menage: "un_balai",
    passer_la_serpilliere: "une_serpilliere",
    laver_le_sol: "une_serpilliere",
    passer_l_aspirateur: "un_aspirateur",
    sortir_les_poubelles: "une_poubelle",
    faire_la_vaisselle: "une_eponge",
    laver_les_assiettes: "une_eponge",
    nettoyer_la_table: "une_eponge",
    nettoyer_la_cuisine: "une_eponge",
    nettoyer_la_salle_de_bains: "du_savon",
    se_laver: "du_savon",
    faire_la_lessive: "le_linge",
    etendre_le_linge: "le_linge",
    plier_le_linge: "le_linge"
  };

  const ROOM_MAP = {
    ranger_la_chambre: "chambre",
    faire_le_lit: "chambre",
    ranger_les_vetements: "chambre",
    nettoyer_la_table: "cuisine",
    mettre_la_table: "cuisine",
    debarrasser_la_table: "cuisine",
    faire_la_vaisselle: "cuisine",
    laver_les_assiettes: "cuisine",
    essuyer_la_table: "cuisine",
    nettoyer_la_cuisine: "cuisine"
  };

  // Todos los escenarios siguen el mismo patrón claro y sin ambigüedad:
  // "usa la herramienta X para hacer Y" (X no sirve para Y). Esto evita
  // construcciones extrañas de tipo "hace A para hacer B" que pueden
  // resultar confusas o sin sentido lógico.
  const FIND_ERROR_SCENARIOS = [
    {
      id: "err1",
      situationFr: "Une personne utilise un aspirateur pour laver les assiettes.",
      situationEs: "Una persona usa una aspiradora para lavar los platos.",
      correctId: "faire_la_vaisselle",
      optionIds: ["faire_la_vaisselle", "passer_l_aspirateur", "plier_le_linge", "lire"]
    },
    {
      id: "err2",
      situationFr: "Une personne utilise un balai pour se brosser les dents.",
      situationEs: "Una persona usa una escoba para cepillarse los dientes.",
      correctId: "se_brosser_les_dents",
      optionIds: ["se_brosser_les_dents", "balayer", "faire_le_lit", "diner"]
    },
    {
      id: "err3",
      situationFr: "Une personne utilise du savon pour balayer le sol.",
      situationEs: "Una persona usa jabón para barrer el suelo.",
      correctId: "balayer",
      optionIds: ["balayer", "se_laver", "lire", "etudier"]
    },
    {
      id: "err4",
      situationFr: "Une personne utilise un aspirateur pour faire la lessive.",
      situationEs: "Una persona usa una aspiradora para lavar la ropa.",
      correctId: "faire_la_lessive",
      optionIds: ["faire_la_lessive", "passer_l_aspirateur", "lire", "se_coiffer"]
    },
    {
      id: "err5",
      situationFr: "Une personne utilise une poubelle pour nettoyer la salle de bains.",
      situationEs: "Una persona usa un bote de basura para limpiar el baño.",
      correctId: "nettoyer_la_salle_de_bains",
      optionIds: ["nettoyer_la_salle_de_bains", "sortir_les_poubelles", "dejeuner", "diner"]
    },
    {
      id: "err6",
      situationFr: "Une personne utilise une éponge pour faire le lit.",
      situationEs: "Una persona usa una esponja para hacer la cama.",
      correctId: "faire_le_lit",
      optionIds: ["faire_le_lit", "faire_la_vaisselle", "se_reposer", "diner"]
    }
  ];

  // Escenarios contextuales para "situation-choice": describen una
  // situación con pistas claras (sin nombrar el verbo objetivo) para que
  // el estudiante razone la acción correcta, evitando la ambigüedad de
  // reutilizar la misma frase de ejemplo que ya contiene la respuesta.
  const SITUATIONS = [
    {
      id: "sit1",
      situationFr: "Il est sept heures et le réveil sonne très fort.",
      situationEs: "Son las siete y la alarma suena muy fuerte.",
      correctId: "se_reveiller",
      optionIds: ["se_reveiller", "se_lever", "se_doucher", "prendre_le_petit_dejeuner"]
    },
    {
      id: "sit2",
      situationFr: "Tu es réveillé, mais tu es encore couché dans le lit.",
      situationEs: "Ya despertaste, pero sigues acostado en la cama.",
      correctId: "se_lever",
      optionIds: ["se_lever", "se_reveiller", "faire_le_lit", "s_habiller"]
    },
    {
      id: "sit3",
      situationFr: "Tu viens de te lever et tu as très faim.",
      situationEs: "Acabas de levantarte y tienes mucha hambre.",
      correctId: "prendre_le_petit_dejeuner",
      optionIds: ["prendre_le_petit_dejeuner", "dejeuner", "diner", "se_laver"]
    },
    {
      id: "sit4",
      situationFr: "Il est midi et tu as très faim.",
      situationEs: "Es mediodía y tienes mucha hambre.",
      correctId: "dejeuner",
      optionIds: ["dejeuner", "diner", "prendre_le_petit_dejeuner", "se_reposer"]
    },
    {
      id: "sit5",
      situationFr: "Les cours sont finis et tu prends le bus pour rentrer chez toi.",
      situationEs: "Las clases terminaron y tomas el autobús para volver a casa.",
      correctId: "rentrer_a_la_maison",
      optionIds: ["rentrer_a_la_maison", "aller_a_l_ecole", "partir_de_la_maison", "se_reposer"]
    },
    {
      id: "sit6",
      situationFr: "Tu as un examen de français demain matin.",
      situationEs: "Tienes un examen de francés mañana por la mañana.",
      correctId: "etudier",
      optionIds: ["etudier", "lire", "faire_ses_devoirs", "se_reposer"]
    },
    {
      id: "sit7",
      situationFr: "Le sol de la cuisine est couvert de miettes de pain.",
      situationEs: "El suelo de la cocina está cubierto de migas de pan.",
      correctId: "balayer",
      optionIds: ["balayer", "passer_l_aspirateur", "faire_la_vaisselle", "faire_la_lessive"]
    },
    {
      id: "sit8",
      situationFr: "La poubelle de la cuisine est pleine et elle sent mauvais.",
      situationEs: "El bote de basura de la cocina está lleno y huele mal.",
      correctId: "sortir_les_poubelles",
      optionIds: ["sortir_les_poubelles", "faire_la_lessive", "nettoyer_la_cuisine", "ranger_la_maison"]
    },
    {
      id: "sit9",
      situationFr: "Il y a beaucoup de poussière sur le tapis du salon.",
      situationEs: "Hay mucho polvo en la alfombra del salón.",
      correctId: "passer_l_aspirateur",
      optionIds: ["passer_l_aspirateur", "balayer", "nettoyer_la_salle_de_bains", "faire_la_lessive"]
    },
    {
      id: "sit10",
      situationFr: "Le linge est encore mouillé après le lavage.",
      situationEs: "La ropa todavía está mojada después del lavado.",
      correctId: "etendre_le_linge",
      optionIds: ["etendre_le_linge", "plier_le_linge", "faire_la_lessive", "laver_le_sol"]
    },
    {
      id: "sit11",
      situationFr: "Après le repas, il y a des assiettes sales dans l'évier.",
      situationEs: "Después de la comida, hay platos sucios en el fregadero.",
      correctId: "faire_la_vaisselle",
      optionIds: ["faire_la_vaisselle", "debarrasser_la_table", "mettre_la_table", "essuyer_la_table"]
    },
    {
      id: "sit12",
      situationFr: "Ta chambre est en désordre : des vêtements et des livres traînent partout.",
      situationEs: "Tu habitación está desordenada: ropa y libros por todas partes.",
      correctId: "ranger_la_chambre",
      optionIds: ["ranger_la_chambre", "faire_le_lit", "ranger_les_vetements", "nettoyer_la_table"]
    },
    {
      id: "sit13",
      situationFr: "Tu viens de te réveiller et le lit est encore défait.",
      situationEs: "Acabas de despertarte y la cama todavía está deshecha.",
      correctId: "faire_le_lit",
      optionIds: ["faire_le_lit", "se_lever", "ranger_la_chambre", "se_laver"]
    },
    {
      id: "sit14",
      situationFr: "C'est la récréation et tu retrouves tes camarades dans la cour.",
      situationEs: "Es el recreo y te reúnes con tus compañeros en el patio.",
      correctId: "parler_avec_ses_amis",
      optionIds: ["parler_avec_ses_amis", "etudier", "se_reposer", "dejeuner"]
    },
    {
      id: "sit15",
      situationFr: "Le professeur a donné beaucoup d'exercices pour demain.",
      situationEs: "El profesor dejó muchos ejercicios para mañana.",
      correctId: "faire_ses_devoirs",
      optionIds: ["faire_ses_devoirs", "etudier", "lire", "se_reposer"]
    },
    {
      id: "sit16",
      situationFr: "Il est vingt heures et toute la famille est à table, le repas est prêt.",
      situationEs: "Son las ocho de la noche y toda la familia está en la mesa, la comida está lista.",
      correctId: "diner",
      optionIds: ["diner", "dejeuner", "prendre_le_petit_dejeuner", "mettre_la_table"]
    }
  ];

  const INSTRUCTIONS = {
    "image-word": { fr: "Choisis la bonne réponse.", es: "Elige la respuesta correcta." },
    "listen-image": { fr: "Écoute et sélectionne l'image.", es: "Escucha y selecciona la imagen." },
    "situation-choice": { fr: "Choisis la bonne réponse.", es: "Elige la respuesta correcta." },
    "fill-blank": { fr: "Complète la phrase.", es: "Completa la frase." },
    "write-verb": { fr: "Écris le verbe.", es: "Escribe el verbo." },
    "sequence": { fr: "Mets les actions dans l'ordre.", es: "Ordena las acciones." },
    "drag-drop": { fr: "Associe le verbe et l'image.", es: "Relaciona el verbo con la imagen." },
    "what-need": { fr: "Choisis l'objet dont tu as besoin.", es: "Elige el objeto que necesitas." },
    "find-error": { fr: "Trouve l'erreur.", es: "Encuentra el error." },
    "matching": { fr: "Relie chaque verbe à la bonne image.", es: "Relaciona cada verbo con la imagen correcta." },
    "quick-mission": { fr: "Sélectionne vite le bon verbe !", es: "¡Selecciona rápido el verbo correcto!" },
    "final-sequence": { fr: "Remets la matinée dans l'ordre.", es: "Ordena la mañana." },
    "final-timeline": { fr: "Construis la journée dans l'ordre.", es: "Construye el día en orden." },
    "final-room": { fr: "Range la chambre : choisis les bonnes actions.", es: "Ordena la habitación: elige las acciones correctas." },
    "final-cleaning": { fr: "Prépare la maison avant la visite !", es: "¡Prepara la casa antes de la visita!" },
    "final-routine": { fr: "Construis ta journée parfaite.", es: "Construye tu día perfecto." }
  };

  // ---------------------------------------------------------------
  // Metadatos de niveles
  // ---------------------------------------------------------------
  const LEVELS = [
    {
      id: 1,
      titleFr: "Le matin",
      titleEs: "La mañana",
      subtitleFr: "La routine du matin",
      subtitleEs: "La rutina de la mañana",
      icon: "🌅",
      houseZone: "chambre-matin"
    },
    {
      id: 2,
      titleFr: "Ma journée",
      titleEs: "Mi día",
      subtitleFr: "Les activités de la journée",
      subtitleEs: "Las actividades del día",
      icon: "🏫",
      houseZone: "ecole"
    },
    {
      id: 3,
      titleFr: "La chambre et la cuisine",
      titleEs: "El dormitorio y la cocina",
      subtitleFr: "Ranger et nettoyer",
      subtitleEs: "Ordenar y limpiar",
      icon: "🧸",
      houseZone: "chambre-cuisine"
    },
    {
      id: 4,
      titleFr: "Le grand ménage",
      titleEs: "La gran limpieza",
      subtitleFr: "Le grand ménage de la maison",
      subtitleEs: "La limpieza general de la casa",
      icon: "🧹",
      houseZone: "menage"
    },
    {
      id: 5,
      titleFr: "Ma journée parfaite",
      titleEs: "Mi día perfecto",
      subtitleFr: "Révision générale",
      subtitleEs: "Repaso general",
      icon: "🌟",
      houseZone: "parfaite"
    }
  ];

  // ---------------------------------------------------------------
  // Generadores de retos
  // ---------------------------------------------------------------
  function genImageWord(word) {
    const options = shuffle([word.infinitive, ...word.distractors]);
    return {
      type: "image-word",
      wordIds: [word.id],
      instruction: INSTRUCTIONS["image-word"],
      data: { icon: word.icon, options, correctAnswer: word.infinitive, wordId: word.id }
    };
  }

  function genListenImage(word, pool) {
    const others = pool.filter((w) => w.id !== word.id);
    const distractorWords = sample(others, 3);
    const options = shuffle([
      { id: word.id, icon: word.icon, label: word.infinitive },
      ...distractorWords.map((w) => ({ id: w.id, icon: w.icon, label: w.infinitive }))
    ]);
    return {
      type: "listen-image",
      wordIds: [word.id],
      instruction: INSTRUCTIONS["listen-image"],
      data: { audioText: word.infinitive, options, correctId: word.id, wordId: word.id }
    };
  }

  function genSituationChoice(pool) {
    const eligible = pool
      ? SITUATIONS.filter((s) => pool.some((w) => w.id === s.correctId))
      : SITUATIONS;
    const scenario = choose(eligible.length ? eligible : SITUATIONS);
    const options = shuffle(
      scenario.optionIds.map((id) => {
        const w = byId(id);
        return { id, label: w ? w.infinitive : id, icon: w ? w.icon : "❓" };
      })
    );
    return {
      type: "situation-choice",
      wordIds: [scenario.correctId],
      instruction: INSTRUCTIONS["situation-choice"],
      data: {
        situationFr: scenario.situationFr,
        situationEs: scenario.situationEs,
        options,
        correctId: scenario.correctId,
        wordId: scenario.correctId
      }
    };
  }

  function genMatching(words) {
    // Reto de relacionar pares (verbo ↔ icono). Sin ambigüedad: cada
    // elemento tiene una única pareja correcta.
    const pairs = words.map((w) => ({ wordId: w.id, label: w.infinitive, icon: w.icon }));
    return {
      type: "matching",
      wordIds: words.map((w) => w.id),
      instruction: INSTRUCTIONS["matching"],
      data: {
        left: shuffle(pairs.map((p) => ({ id: p.wordId, label: p.label }))),
        right: shuffle(pairs.map((p) => ({ id: p.wordId, icon: p.icon }))),
        correctMap: pairs.reduce((acc, p) => {
          acc[p.wordId] = p.wordId;
          return acc;
        }, {})
      }
    };
  }

  function genFillBlank(word) {
    const fp = word.firstPerson;
    const strippedFp = fp.replace(/^j[e']\s*/i, "").trim();
    const idx = word.example.toLowerCase().indexOf(fp.toLowerCase());
    let sentence = word.example;
    if (idx !== -1) {
      sentence = word.example.slice(0, idx) + "______" + word.example.slice(idx + fp.length);
    } else {
      sentence = word.example.replace(word.infinitive, "______");
    }
    const accepted = new Set([strippedFp, word.infinitive]);
    word.acceptedAnswers.forEach((a) => {
      accepted.add(a.replace(/^j[e']\s*/i, "").trim());
      accepted.add(a);
    });
    return {
      type: "fill-blank",
      wordIds: [word.id],
      instruction: INSTRUCTIONS["fill-blank"],
      data: {
        sentence,
        icon: word.icon,
        acceptedAnswers: Array.from(accepted).filter(Boolean),
        displayAnswer: strippedFp,
        hintLetter: strippedFp.charAt(0),
        wordId: word.id
      }
    };
  }

  function genWriteVerb(word) {
    const accepted = new Set([word.infinitive, word.firstPerson, ...word.acceptedAnswers]);
    return {
      type: "write-verb",
      wordIds: [word.id],
      instruction: INSTRUCTIONS["write-verb"],
      data: {
        icon: word.icon,
        acceptedAnswers: Array.from(accepted),
        displayAnswer: word.infinitive,
        hintLetter: word.infinitive.charAt(0),
        wordId: word.id
      }
    };
  }

  function genWhatNeed(word) {
    const objectId = ACTION_TO_OBJECT[word.id];
    if (!objectId) return null;
    const correctObj = byId(objectId);
    const objectPool = VOCABULARY.filter((w) => w.category === "objet" && w.id !== objectId);
    const distractors = sample(objectPool, 3);
    const options = shuffle([
      { id: correctObj.id, icon: correctObj.icon, label: correctObj.infinitive },
      ...distractors.map((w) => ({ id: w.id, icon: w.icon, label: w.infinitive }))
    ]);
    return {
      type: "what-need",
      wordIds: [word.id, correctObj.id],
      instruction: INSTRUCTIONS["what-need"],
      data: {
        prompt: "Je veux " + word.infinitive + ".",
        icon: word.icon,
        options,
        correctId: correctObj.id,
        wordId: word.id
      }
    };
  }

  function genFindError(pool) {
    const eligible = pool
      ? FIND_ERROR_SCENARIOS.filter((s) => pool.some((w) => w.id === s.correctId))
      : FIND_ERROR_SCENARIOS;
    const scenario = choose(eligible.length ? eligible : FIND_ERROR_SCENARIOS);
    const options = shuffle(
      scenario.optionIds.map((id) => {
        const w = byId(id);
        return { id, label: w ? w.infinitive : id, icon: w ? w.icon : "❓" };
      })
    );
    return {
      type: "find-error",
      wordIds: [scenario.correctId],
      instruction: INSTRUCTIONS["find-error"],
      data: {
        situationFr: scenario.situationFr,
        situationEs: scenario.situationEs,
        options,
        correctId: scenario.correctId,
        wordId: scenario.correctId
      }
    };
  }

  function genDragDrop(pairs, targets, instructionKey) {
    // pairs: [{wordId, targetId}]
    return {
      type: "drag-drop",
      wordIds: pairs.map((p) => p.wordId),
      instruction: INSTRUCTIONS[instructionKey || "drag-drop"],
      data: {
        items: shuffle(
          pairs.map((p) => {
            const w = byId(p.wordId);
            return { id: w.id, label: w.infinitive, icon: w.icon };
          })
        ),
        targets,
        correctMap: pairs.reduce((acc, p) => {
          acc[p.wordId] = p.targetId;
          return acc;
        }, {})
      }
    };
  }

  function genQuickMission(pool, n) {
    const words = sample(pool, n);
    const groupId = "mission-" + Math.random().toString(36).slice(2, 8);
    return words.map((w, i) => ({
      type: "image-word",
      wordIds: [w.id],
      instruction: INSTRUCTIONS["quick-mission"],
      speedRound: true,
      missionGroupId: groupId,
      missionIndex: i + 1,
      missionTotal: words.length,
      timeLimit: 6,
      data: { icon: w.icon, options: shuffle([w.infinitive, ...w.distractors]), correctAnswer: w.infinitive, wordId: w.id }
    }));
  }

  // ---------------------------------------------------------------
  // Constructores por nivel
  // ---------------------------------------------------------------
  function buildLevel1() {
    const pool = byLevel(1);
    const words = shuffle(pool);
    const types = ["image-word", "listen-image", "fill-blank"];
    const challenges = [];
    for (let i = 0; i < 8; i++) {
      const w = words[i % words.length];
      const t = types[i % types.length];
      challenges.push(t === "image-word" ? genImageWord(w) : t === "listen-image" ? genListenImage(w, pool) : genFillBlank(w));
    }
    // Reto final : relacionar los 10 verbes de la matinée avec leur icône
    // (reto de matching, sans ambiguïté — remplace l'ancien exercice
    // d'ordre chronologique, jugé trop subjectif).
    challenges.push(genMatching(pool));
    return challenges;
  }

  function buildLevel2() {
    const pool = byLevel(2);
    const words = shuffle(pool);
    const challenges = [];
    const types = ["image-word", "listen-image", "situation-choice", "fill-blank"];
    for (let i = 0; i < 8; i++) {
      const w = words[i % words.length];
      const t = types[i % types.length];
      if (t === "image-word") challenges.push(genImageWord(w));
      else if (t === "listen-image") challenges.push(genListenImage(w, pool));
      else if (t === "situation-choice") challenges.push(genSituationChoice(pool));
      else challenges.push(genFillBlank(w));
    }
    const timelineIds = [
      "se_reveiller",
      "se_laver",
      "prendre_le_petit_dejeuner",
      "aller_a_l_ecole",
      "etudier",
      "dejeuner",
      "rentrer_a_la_maison",
      "faire_ses_devoirs",
      "diner"
    ];
    // Se aceptan dos órdenes válidas: lavarse y desayunar pueden
    // intercambiarse (ambos ocurren "por la mañana, antes de la escuela")
    // sin que eso sea un error real, para evitar exigir una precisión
    // arbitraria que el propio horario no impone.
    const timelineAlt = timelineIds.slice();
    [timelineAlt[1], timelineAlt[2]] = [timelineAlt[2], timelineAlt[1]];
    challenges.push({
      type: "final-timeline",
      wordIds: timelineIds,
      instruction: INSTRUCTIONS["final-timeline"],
      data: {
        items: shuffle(timelineIds.map((id) => ({ id, label: byId(id).infinitive, icon: byId(id).icon }))),
        correctOrders: [timelineIds, timelineAlt]
      }
    });
    return challenges;
  }

  function buildLevel3() {
    const pool = byLevel(3).concat([byId("faire_le_lit")]);
    const words = shuffle(pool);
    const challenges = [];
    challenges.push(
      genDragDrop(
        [
          { wordId: "ranger_la_chambre", targetId: "chambre" },
          { wordId: "faire_le_lit", targetId: "chambre" },
          { wordId: "mettre_la_table", targetId: "cuisine" },
          { wordId: "faire_la_vaisselle", targetId: "cuisine" }
        ],
        [
          { id: "chambre", label: "La chambre", icon: "🛏️" },
          { id: "cuisine", label: "La cuisine", icon: "🍳" }
        ]
      )
    );
    challenges.push(
      genDragDrop(
        [
          { wordId: "ranger_les_vetements", targetId: "chambre" },
          { wordId: "nettoyer_la_table", targetId: "cuisine" },
          { wordId: "debarrasser_la_table", targetId: "cuisine" },
          { wordId: "essuyer_la_table", targetId: "cuisine" }
        ],
        [
          { id: "chambre", label: "La chambre", icon: "🛏️" },
          { id: "cuisine", label: "La cuisine", icon: "🍳" }
        ]
      )
    );
    const types = ["image-word", "fill-blank", "find-error"];
    for (let i = 0; i < 6; i++) {
      const w = words[i % words.length];
      const t = types[i % types.length];
      if (t === "find-error") challenges.push(genFindError());
      else if (t === "fill-blank") challenges.push(genFillBlank(w));
      else challenges.push(genImageWord(w));
    }
    const roomActionIds = ["ranger_les_vetements", "faire_le_lit", "nettoyer_la_table", "ranger_la_chambre"];
    const decoyIds = ["regarder_la_television", "dejeuner"];
    challenges.push({
      type: "final-room",
      wordIds: roomActionIds,
      instruction: INSTRUCTIONS["final-room"],
      data: {
        actions: shuffle(
          roomActionIds
            .concat(decoyIds)
            .map((id) => ({ id, label: byId(id).infinitive, icon: byId(id).icon }))
        ),
        correctIds: roomActionIds
      }
    });
    return challenges;
  }

  function buildLevel4() {
    const verbPool = VOCABULARY.filter((w) => w.level === 4 && w.category === "menage");
    const words = shuffle(verbPool);
    const challenges = [];
    const types = ["what-need", "write-verb", "fill-blank", "find-error", "image-word"];
    for (let i = 0; i < 9; i++) {
      const w = words[i % words.length];
      const t = types[i % types.length];
      let c = null;
      if (t === "what-need") c = genWhatNeed(w);
      if (!c && t === "write-verb") c = genWriteVerb(w);
      if (!c && t === "fill-blank") c = genFillBlank(w);
      if (!c && t === "find-error") c = genFindError();
      if (!c) c = genImageWord(w);
      challenges.push(c);
    }
    const missionIds = [
      "balayer",
      "passer_l_aspirateur",
      "sortir_les_poubelles",
      "faire_la_vaisselle",
      "nettoyer_la_salle_de_bains",
      "ranger_la_maison"
    ];
    challenges.push({
      type: "final-cleaning",
      wordIds: missionIds,
      instruction: INSTRUCTIONS["final-cleaning"],
      data: {
        actions: shuffle(missionIds.map((id) => ({ id, label: byId(id).infinitive, icon: byId(id).icon }))),
        requiredIds: missionIds
      }
    });
    return challenges;
  }

  function buildLevel5() {
    const pool = VOCABULARY.filter((w) => w.category !== "objet");
    const words = shuffle(pool);
    const challenges = [];
    const types = ["listen-image", "write-verb", "image-word", "situation-choice", "find-error"];
    for (let i = 0; i < 6; i++) {
      const w = words[i % words.length];
      const t = types[i % types.length];
      if (t === "listen-image") challenges.push(genListenImage(w, pool));
      else if (t === "write-verb") challenges.push(genWriteVerb(w));
      else if (t === "situation-choice") challenges.push(genSituationChoice(pool));
      else if (t === "find-error") challenges.push(genFindError(pool));
      else challenges.push(genImageWord(w));
    }
    challenges.push(...genQuickMission(pool, 3));
    challenges.push({
      type: "final-routine",
      wordIds: [],
      instruction: INSTRUCTIONS["final-routine"],
      data: {
        groups: [
          { key: "matin", label: "Le matin", count: 2, pool: byLevel(1).map((w) => ({ id: w.id, label: w.infinitive, icon: w.icon })) },
          { key: "journee", label: "La journée", count: 2, pool: byLevel(2).map((w) => ({ id: w.id, label: w.infinitive, icon: w.icon })) },
          {
            key: "menage",
            label: "Les tâches ménagères",
            count: 3,
            pool: VOCABULARY.filter((w) => w.level === 3 || w.level === 4)
              .filter((w) => w.category !== "objet")
              .map((w) => ({ id: w.id, label: w.infinitive, icon: w.icon }))
          },
          {
            key: "soir",
            label: "Le soir",
            count: 2,
            pool: ["diner", "regarder_la_television", "lire", "se_reposer"].map((id) => ({
              id,
              label: byId(id).infinitive,
              icon: byId(id).icon
            }))
          }
        ]
      }
    });
    return challenges;
  }

  const BUILDERS = { 1: buildLevel1, 2: buildLevel2, 3: buildLevel3, 4: buildLevel4, 5: buildLevel5 };

  function buildCustomChallenges(teacherSettings) {
    let pool = VOCABULARY.filter(
      (w) => teacherSettings.levelsEnabled.indexOf(w.level) !== -1 && teacherSettings.categories.indexOf(w.category) !== -1
    );
    if (teacherSettings.onlyMenage) pool = pool.filter((w) => w.category === "menage" || w.category === "objet");
    if (teacherSettings.onlyPronominaux) pool = pool.filter((w) => /^(se |s')/i.test(w.infinitive));
    if (pool.length < 4) pool = VOCABULARY.slice();
    const count = Math.max(6, Math.min(12, teacherSettings.questionCount || 9));
    const words = shuffle(pool);
    const hasFindErrorMatch = FIND_ERROR_SCENARIOS.some((s) => pool.some((w) => w.id === s.correctId));
    const types = ["image-word", "listen-image", "fill-blank", "situation-choice"];
    if (hasFindErrorMatch) types.push("find-error");
    const challenges = [];
    for (let i = 0; i < count; i++) {
      const w = words[i % words.length];
      const t = types[i % types.length];
      if (t === "listen-image") challenges.push(genListenImage(w, pool));
      else if (t === "fill-blank") challenges.push(genFillBlank(w));
      else if (t === "situation-choice") challenges.push(genSituationChoice(pool));
      else if (t === "find-error") challenges.push(genFindError(pool));
      else challenges.push(genImageWord(w));
    }
    return challenges;
  }

  // ---------------------------------------------------------------
  // Sesión de juego
  // ---------------------------------------------------------------
  let session = null;

  function startLevel(levelNumber) {
    const challenges = BUILDERS[levelNumber]();
    session = createSession(levelNumber, challenges);
    return getCurrentChallenge();
  }

  function startCustomPractice(teacherSettings) {
    const challenges = buildCustomChallenges(teacherSettings);
    session = createSession("custom", challenges);
    return getCurrentChallenge();
  }

  function createSession(levelIdentifier, challenges) {
    return {
      level: levelIdentifier,
      queue: challenges,
      insertions: [], // {afterIndex, challenge}
      currentIndex: 0,
      score: 0,
      consecutiveCorrect: 0,
      comboMultiplier: 1,
      bestCombo: 1,
      currentAttempt: 1,
      currentHintStage: 0,
      hintUsedThisChallenge: false,
      uniqueTotal: challenges.length,
      firstAttemptCorrectCount: 0,
      correctCount: 0,
      wrongCount: 0,
      levelHadAnyError: false,
      mistakeIds: new Set(),
      quickMissionIndex: 0,
      paused: false,
      finished: false
    };
  }

  function getCurrentChallenge() {
    if (!session) return null;
    if (session.currentIndex >= session.queue.length) return null;
    return session.queue[session.currentIndex];
  }

  function getSessionState() {
    if (!session) return null;
    return {
      level: session.level,
      score: session.score,
      comboMultiplier: session.comboMultiplier,
      consecutiveCorrect: session.consecutiveCorrect,
      currentIndex: session.currentIndex,
      total: session.queue.length,
      attempt: session.currentAttempt,
      hintStage: session.currentHintStage
    };
  }

  function updateComboMultiplier() {
    if (session.consecutiveCorrect >= 8) session.comboMultiplier = 4;
    else if (session.consecutiveCorrect >= 5) session.comboMultiplier = 3;
    else if (session.consecutiveCorrect >= 3) session.comboMultiplier = 2;
    else session.comboMultiplier = 1;
    if (session.comboMultiplier > session.bestCombo) session.bestCombo = session.comboMultiplier;
  }

  function computeBasePoints() {
    if (session.hintUsedThisChallenge) return 40;
    if (session.currentAttempt === 1) return 100;
    return 60;
  }

  function registerWordResult(wordId, correct) {
    if (!wordId) return;
    window.Storage.registerAnswer(wordId, correct);
  }

  function scheduleReinsert(challenge) {
    const delay = 2 + Math.floor(Math.random() * 2); // 2 o 3 preguntas después
    const pos = Math.min(session.queue.length, session.currentIndex + delay);
    const clone = Object.assign({}, challenge, { isRepeat: true });
    session.queue.splice(pos, 0, clone);
  }

  function maskPhrase(phrase) {
    return phrase
      .split(" ")
      .map((tok) => {
        if (tok.length <= 1) return tok;
        const first = tok.charAt(0);
        const rest = tok
          .slice(1)
          .split("")
          .map((ch) => (/[a-zàâäéèêëîïôöùûüç]/i.test(ch) ? "_" : ch))
          .join("");
        return first + rest;
      })
      .join(" ");
  }

  function blankedExample(word) {
    const fp = word.firstPerson;
    const idx = word.example.toLowerCase().indexOf(fp.toLowerCase());
    if (idx !== -1) {
      return word.example.slice(0, idx) + "___" + word.example.slice(idx + fp.length);
    }
    return word.example.replace(word.infinitive, "___");
  }

  const CATEGORY_LABELS_ES = {
    matin: "rutina de la mañana",
    journee: "actividades del día",
    maison: "habitación o cocina",
    menage: "tarea doméstica / limpieza",
    objet: "objeto para limpiar",
    idiomatique: "expresión coloquial"
  };

  function useHint(challenge) {
    if (session.currentHintStage >= 4) return { stage: session.currentHintStage, done: true };
    session.currentHintStage += 1;
    session.hintUsedThisChallenge = true;
    const wordId = challenge.data.wordId || (challenge.wordIds && challenge.wordIds[0]);
    const word = wordId ? byId(wordId) : null;
    const result = { stage: session.currentHintStage };
    if (session.currentHintStage === 1) {
      result.type = "letter";
      const target = challenge.data.displayAnswer || (word ? word.infinitive : "?");
      result.content = maskPhrase(target);
    } else if (session.currentHintStage === 2) {
      result.type = "audio";
      result.content = word ? word.infinitive : "";
      result.sentence = word ? blankedExample(word) : "";
    } else if (session.currentHintStage === 3) {
      result.type = "translation";
      result.content = word ? word.translation : "";
      result.category = word ? CATEGORY_LABELS_ES[word.category] || "" : "";
    } else if (session.currentHintStage === 4) {
      result.type = "reduce";
      if (challenge.data.options && challenge.data.options.length > 2) {
        const correctVal =
          challenge.data.correctAnswer !== undefined
            ? challenge.data.correctAnswer
            : challenge.data.correctId;
        const isObjOptions = typeof challenge.data.options[0] === "object";
        const correctOpt = isObjOptions
          ? challenge.data.options.find((o) => o.id === correctVal)
          : challenge.data.options.find((o) => o === correctVal);
        const others = isObjOptions
          ? challenge.data.options.filter((o) => o.id !== correctVal)
          : challenge.data.options.filter((o) => o !== correctVal);
        challenge.data.options = shuffle([correctOpt, choose(others)]);
      }
      result.content = challenge.data.options;
    }
    return result;
  }

  function submitAnswer(challenge, isCorrect, meta) {
    meta = meta || {};
    const wordIds = challenge.wordIds && challenge.wordIds.length ? challenge.wordIds : [challenge.data.wordId];
    let pointsEarned = 0;
    let milestoneBonus = 0;

    if (isCorrect) {
      if (!meta.skipBasePoints) {
        const base = computeBasePoints();
        pointsEarned = Math.round(base * session.comboMultiplier);
        session.score += pointsEarned;
      }
      session.consecutiveCorrect += 1;
      session.correctCount += 1;
      if (session.currentAttempt === 1 && !session.hintUsedThisChallenge && !challenge.isRepeat) {
        session.firstAttemptCorrectCount += 1;
      }
      if (session.consecutiveCorrect > 0 && session.consecutiveCorrect % 5 === 0) {
        milestoneBonus = 100;
        session.score += milestoneBonus;
      }
      updateComboMultiplier();
      if (!meta.skipWordRegistration) {
        wordIds.forEach((id) => registerWordResult(id, true));
      }
    } else {
      session.wrongCount += 1;
      session.levelHadAnyError = true;
      session.consecutiveCorrect = 0;
      session.comboMultiplier = 1;
      wordIds.forEach((id) => {
        registerWordResult(id, false);
        session.mistakeIds.add(id);
      });
      if (!meta.isRepeatAttempt) {
        scheduleReinsert(challenge);
      }
      session.currentAttempt += 1;
    }

    return {
      correct: isCorrect,
      pointsEarned,
      milestoneBonus,
      comboMultiplier: session.comboMultiplier,
      totalScore: session.score,
      attempt: session.currentAttempt
    };
  }

  function awardMicroPoint(wordId, points) {
    if (!session) return 0;
    const pts = Math.round((points || 25) * session.comboMultiplier);
    session.score += pts;
    if (wordId) registerWordResult(wordId, true);
    return pts;
  }

  function goToNextChallenge() {
    session.currentIndex += 1;
    session.currentAttempt = 1;
    session.currentHintStage = 0;
    session.hintUsedThisChallenge = false;
    return getCurrentChallenge();
  }

  function isLevelFinished() {
    return session && session.currentIndex >= session.queue.length;
  }

  function computeStars(accuracy) {
    if (accuracy >= 95) return 3;
    if (accuracy >= 85) return 2;
    if (accuracy >= 70) return 1;
    return 0;
  }

  function finishLevel() {
    const accuracy = session.uniqueTotal
      ? Math.round((session.firstAttemptCorrectCount / session.uniqueTotal) * 100)
      : 0;
    let stars = computeStars(accuracy);
    session.score += 300; // completar nivel
    if (!session.levelHadAnyError) {
      session.score += 500; // sin errores
    }
    const result = {
      level: session.level,
      isCustom: session.level === "custom",
      score: session.score,
      accuracy,
      stars,
      bestCombo: session.bestCombo,
      correctCount: session.correctCount,
      wrongCount: session.wrongCount,
      masteredWords: window.Storage.getMasteredCount(),
      practiceWords: Array.from(session.mistakeIds).map((id) => byId(id)).filter(Boolean)
    };
    if (session.level === "custom") {
      window.Storage.addPracticeResult(result);
      result.starsSaved = 0;
    } else {
      const saved = window.Storage.saveLevelResult(session.level, result);
      result.starsSaved = saved.stars;
    }
    session.finished = true;
    return result;
  }

  function getXPRank(xp) {
    if (xp >= 5000) return { title: "Maître du ménage", titleEs: "Maestro/a de la limpieza" };
    if (xp >= 2500) return { title: "Expert de la routine", titleEs: "Experto/a en la rutina" };
    if (xp >= 1000) return { title: "Explorateur de la maison", titleEs: "Explorador/a de la casa" };
    return { title: "Débutant du quotidien", titleEs: "Principiante del día a día" };
  }

  return {
    LEVELS,
    INSTRUCTIONS,
    byId,
    byLevel,
    shuffle,
    sample,
    normalize,
    checkTypedAnswer,
    startLevel,
    startCustomPractice,
    getCurrentChallenge,
    getSessionState,
    useHint,
    submitAnswer,
    awardMicroPoint,
    goToNextChallenge,
    isLevelFinished,
    finishLevel,
    getXPRank,
    getSession() {
      return session;
    }
  };
})();

window.Game = Game;
