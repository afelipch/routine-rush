/*
 * Routine Rush — Contenu du vocabulaire
 * ---------------------------------------------------------------
 * Este archivo contiene ÚNICAMENTE el contenido pedagógico del juego.
 * No contiene datos de progreso ni de estado del jugador (eso vive en
 * localStorage, ver js/storage.js).
 *
 * Para agregar o modificar vocabulario, edite el array VOCABULARY.
 * Cada elemento debe respetar esta estructura:
 *
 * {
 *   id: "identificador-unico",
 *   infinitive: "forme infinitive",
 *   firstPerson: "je ...",
 *   translation: "traducción al español",
 *   category: "matin | journee | maison | menage | objet | idiomatique",
 *   level: 1-5,
 *   icon: "emoji",
 *   example: "Frase de ejemplo en francés.",
 *   acceptedAnswers: ["..."],
 *   distractors: ["...", "...", "..."]
 * }
 *
 * La categoría "idiomatique" agrupa expresiones informales o idiomáticas
 * relacionadas con la rutina diaria; aparecen mezcladas ocasionalmente en
 * el nivel 5 (repaso general).
 */

const VOCABULARY = [
  // ============================= NIVEAU 1 : LE MATIN =============================
  {
    id: "se_reveiller",
    infinitive: "se réveiller",
    firstPerson: "je me réveille",
    translation: "despertarse",
    category: "matin",
    level: 1,
    icon: "⏰",
    example: "Je me réveille à sept heures, quand le réveil sonne.",
    acceptedAnswers: ["se réveiller", "je me réveille"],
    distractors: ["se lever", "se doucher", "s'habiller"]
  },
  {
    id: "se_lever",
    infinitive: "se lever",
    firstPerson: "je me lève",
    translation: "levantarse",
    category: "matin",
    level: 1,
    icon: "🧍",
    example: "Je me lève tout de suite, sans traîner au lit.",
    acceptedAnswers: ["se lever", "je me lève"],
    distractors: ["se réveiller", "se doucher", "faire le lit"]
  },
  {
    id: "faire_le_lit",
    infinitive: "faire le lit",
    firstPerson: "je fais le lit",
    translation: "hacer la cama",
    category: "matin",
    level: 1,
    icon: "🛏️",
    example: "Je fais le lit chaque matin, avant de quitter ma chambre.",
    acceptedAnswers: ["faire le lit", "je fais le lit"],
    distractors: ["se lever", "s'habiller", "se laver"]
  },
  {
    id: "se_laver",
    infinitive: "se laver",
    firstPerson: "je me lave",
    translation: "lavarse",
    category: "matin",
    level: 1,
    icon: "🧼",
    example: "Je me lave les mains et le visage avant le petit déjeuner.",
    acceptedAnswers: ["se laver", "je me lave"],
    distractors: ["se doucher", "se brosser les dents", "se coiffer"]
  },
  {
    id: "se_doucher",
    infinitive: "se doucher",
    firstPerson: "je me douche",
    translation: "ducharse",
    category: "matin",
    level: 1,
    icon: "🚿",
    example: "Je me douche rapidement avant l'école, avec de l'eau chaude.",
    acceptedAnswers: ["se doucher", "je me douche"],
    distractors: ["se laver", "se brosser les dents", "s'habiller"]
  },
  {
    id: "se_brosser_les_dents",
    infinitive: "se brosser les dents",
    firstPerson: "je me brosse les dents",
    translation: "cepillarse los dientes",
    category: "matin",
    level: 1,
    icon: "🪥",
    example: "Je me brosse les dents deux fois par jour, matin et soir.",
    acceptedAnswers: ["se brosser les dents", "je me brosse les dents"],
    distractors: ["se laver", "se doucher", "se coiffer"]
  },
  {
    id: "s_habiller",
    infinitive: "s'habiller",
    firstPerson: "je m'habille",
    translation: "vestirse",
    category: "matin",
    level: 1,
    icon: "👕",
    example: "Je m'habille rapidement et je choisis des vêtements confortables.",
    acceptedAnswers: ["s'habiller", "je m'habille"],
    distractors: ["se coiffer", "faire le lit", "se doucher"]
  },
  {
    id: "se_coiffer",
    infinitive: "se coiffer",
    firstPerson: "je me coiffe",
    translation: "peinarse",
    category: "matin",
    level: 1,
    icon: "💇",
    example: "Je me coiffe devant le miroir avant de partir.",
    acceptedAnswers: ["se coiffer", "je me coiffe"],
    distractors: ["se brosser les dents", "s'habiller", "se laver"]
  },
  {
    id: "prendre_le_petit_dejeuner",
    infinitive: "prendre le petit déjeuner",
    firstPerson: "je prends le petit déjeuner",
    translation: "desayunar",
    category: "matin",
    level: 1,
    icon: "🥐",
    example: "Je prends le petit déjeuner à la cuisine avec mes parents.",
    acceptedAnswers: ["prendre le petit déjeuner", "je prends le petit déjeuner"],
    distractors: ["s'habiller", "partir de la maison", "se laver"]
  },
  {
    id: "partir_de_la_maison",
    infinitive: "partir de la maison",
    firstPerson: "je pars de la maison",
    translation: "salir de casa",
    category: "matin",
    level: 1,
    icon: "🚪",
    example: "Je pars de la maison à huit heures, avec mon sac à dos.",
    acceptedAnswers: ["partir de la maison", "je pars de la maison"],
    distractors: ["prendre le petit déjeuner", "s'habiller", "se lever"]
  },

  // ============================= NIVEAU 2 : MA JOURNÉE =============================
  {
    id: "aller_a_l_ecole",
    infinitive: "aller à l'école",
    firstPerson: "je vais à l'école",
    translation: "ir a la escuela",
    category: "journee",
    level: 2,
    icon: "🏫",
    example: "Je vais à l'école à pied avec mon petit frère.",
    acceptedAnswers: ["aller à l'école", "je vais à l'école"],
    distractors: ["rentrer à la maison", "dîner", "se coucher"]
  },
  {
    id: "etudier",
    infinitive: "étudier",
    firstPerson: "j'étudie",
    translation: "estudiar",
    category: "journee",
    level: 2,
    icon: "📚",
    example: "J'étudie le français tous les jours, même le week-end.",
    acceptedAnswers: ["étudier", "j'étudie"],
    distractors: ["se reposer", "regarder la télévision", "balayer"]
  },
  {
    id: "dejeuner",
    infinitive: "déjeuner",
    firstPerson: "je déjeune",
    translation: "almorzar",
    category: "journee",
    level: 2,
    icon: "🍽️",
    example: "Je déjeune à midi, à la cantine de l'école.",
    acceptedAnswers: ["déjeuner", "je déjeune"],
    distractors: ["dîner", "prendre le petit déjeuner", "lire"]
  },
  {
    id: "parler_avec_ses_amis",
    infinitive: "parler avec ses amis",
    firstPerson: "je parle avec mes amis",
    translation: "hablar con sus amigos",
    category: "journee",
    level: 2,
    icon: "💬",
    example: "Je parle avec mes amis à l'école, pendant la récréation.",
    acceptedAnswers: ["parler avec ses amis", "je parle avec mes amis"],
    distractors: ["faire ses devoirs", "se doucher", "plier le linge"]
  },
  {
    id: "rentrer_a_la_maison",
    infinitive: "rentrer à la maison",
    firstPerson: "je rentre à la maison",
    translation: "regresar a casa",
    category: "journee",
    level: 2,
    icon: "🏠",
    example: "Je rentre à la maison à seize heures, après les cours.",
    acceptedAnswers: ["rentrer à la maison", "je rentre à la maison"],
    distractors: ["partir de la maison", "aller à l'école", "se lever"]
  },
  {
    id: "se_reposer",
    infinitive: "se reposer",
    firstPerson: "je me repose",
    translation: "descansar",
    category: "journee",
    level: 2,
    icon: "🛋️",
    example: "Je me repose un peu après l'école, avant de faire mes devoirs.",
    acceptedAnswers: ["se reposer", "je me repose"],
    distractors: ["étudier", "faire le ménage", "sortir les poubelles"]
  },
  {
    id: "faire_ses_devoirs",
    infinitive: "faire ses devoirs",
    firstPerson: "je fais mes devoirs",
    translation: "hacer la tarea",
    category: "journee",
    level: 2,
    icon: "📝",
    example: "Je fais mes devoirs avant le dîner, dans ma chambre.",
    acceptedAnswers: ["faire ses devoirs", "je fais mes devoirs"],
    distractors: ["regarder la télévision", "se coucher", "balayer"]
  },
  {
    id: "diner",
    infinitive: "dîner",
    firstPerson: "je dîne",
    translation: "cenar",
    category: "journee",
    level: 2,
    icon: "🍲",
    example: "Je dîne avec ma famille, vers dix-neuf heures.",
    acceptedAnswers: ["dîner", "je dîne"],
    distractors: ["déjeuner", "prendre le petit déjeuner", "lire"]
  },
  {
    id: "regarder_la_television",
    infinitive: "regarder la télévision",
    firstPerson: "je regarde la télévision",
    translation: "ver televisión",
    category: "journee",
    level: 2,
    icon: "📺",
    example: "Je regarde la télévision le soir, avant de me coucher.",
    acceptedAnswers: ["regarder la télévision", "je regarde la télévision"],
    distractors: ["lire", "faire la vaisselle", "se doucher"]
  },
  {
    id: "lire",
    infinitive: "lire",
    firstPerson: "je lis",
    translation: "leer",
    category: "journee",
    level: 2,
    icon: "📖",
    example: "Je lis un livre avant de me coucher, pour me détendre.",
    acceptedAnswers: ["lire", "je lis"],
    distractors: ["regarder la télévision", "balayer", "se lever"]
  },

  // ==================== NIVEAU 3 : LA CHAMBRE ET LA CUISINE ====================
  {
    id: "ranger_la_chambre",
    infinitive: "ranger la chambre",
    firstPerson: "je range la chambre",
    translation: "ordenar la habitación",
    category: "maison",
    level: 3,
    icon: "🧸",
    example: "Je range la chambre le samedi, avant de sortir avec mes amis.",
    acceptedAnswers: ["ranger la chambre", "je range la chambre"],
    distractors: ["nettoyer la cuisine", "faire la vaisselle", "lire"]
  },
  {
    id: "nettoyer_la_table",
    infinitive: "nettoyer la table",
    firstPerson: "je nettoie la table",
    translation: "limpiar la mesa",
    category: "maison",
    level: 3,
    icon: "🧽",
    example: "Je nettoie la table après le dîner, avec une éponge.",
    acceptedAnswers: ["nettoyer la table", "je nettoie la table"],
    distractors: ["mettre la table", "ranger les vêtements", "étudier"]
  },
  {
    id: "mettre_la_table",
    infinitive: "mettre la table",
    firstPerson: "je mets la table",
    translation: "poner la mesa",
    category: "maison",
    level: 3,
    icon: "🍴",
    example: "Je mets la table avant le repas, avec les assiettes et les verres.",
    acceptedAnswers: ["mettre la table", "je mets la table"],
    distractors: ["débarrasser la table", "faire le lit", "lire"]
  },
  {
    id: "debarrasser_la_table",
    infinitive: "débarrasser la table",
    firstPerson: "je débarrasse la table",
    translation: "quitar la mesa",
    category: "maison",
    level: 3,
    icon: "📤",
    example: "Je débarrasse la table après le repas, pendant que mes parents parlent.",
    acceptedAnswers: ["débarrasser la table", "je débarrasse la table"],
    distractors: ["mettre la table", "faire la lessive", "se coiffer"]
  },
  {
    id: "faire_la_vaisselle",
    infinitive: "faire la vaisselle",
    firstPerson: "je fais la vaisselle",
    translation: "lavar los platos",
    category: "maison",
    level: 3,
    icon: "🫧",
    example: "Je fais la vaisselle après le dîner, avant de regarder la télévision.",
    acceptedAnswers: ["faire la vaisselle", "je fais la vaisselle", "laver les assiettes", "je lave les assiettes"],
    distractors: ["passer l'aspirateur", "plier le linge", "lire"]
  },
  {
    id: "laver_les_assiettes",
    infinitive: "laver les assiettes",
    firstPerson: "je lave les assiettes",
    translation: "lavar los platos",
    category: "maison",
    level: 3,
    icon: "🍽️",
    example: "Je lave les assiettes avec une éponge et de l'eau chaude.",
    acceptedAnswers: ["laver les assiettes", "je lave les assiettes", "faire la vaisselle", "je fais la vaisselle"],
    distractors: ["balayer", "faire le lit", "se doucher"]
  },
  {
    id: "essuyer_la_table",
    infinitive: "essuyer la table",
    firstPerson: "j'essuie la table",
    translation: "secar la mesa",
    category: "maison",
    level: 3,
    icon: "🧻",
    example: "J'essuie la table avec un chiffon propre, après avoir mangé.",
    acceptedAnswers: ["essuyer la table", "j'essuie la table"],
    distractors: ["nettoyer la table", "faire la lessive", "étudier"]
  },
  {
    id: "nettoyer_la_cuisine",
    infinitive: "nettoyer la cuisine",
    firstPerson: "je nettoie la cuisine",
    translation: "limpiar la cocina",
    category: "maison",
    level: 3,
    icon: "🍳",
    example: "Je nettoie la cuisine le soir, quand tout le monde a fini de manger.",
    acceptedAnswers: ["nettoyer la cuisine", "je nettoie la cuisine"],
    distractors: ["ranger la chambre", "faire le lit", "lire"]
  },
  {
    id: "ranger_les_vetements",
    infinitive: "ranger les vêtements",
    firstPerson: "je range les vêtements",
    translation: "ordenar la ropa",
    category: "maison",
    level: 3,
    icon: "👚",
    example: "Je range les vêtements dans l'armoire, après la lessive.",
    acceptedAnswers: ["ranger les vêtements", "je range les vêtements"],
    distractors: ["plier le linge", "faire la vaisselle", "se coiffer"]
  },

  // ============================= NIVEAU 4 : LE GRAND MÉNAGE =============================
  {
    id: "faire_le_menage",
    infinitive: "faire le ménage",
    firstPerson: "je fais le ménage",
    translation: "hacer la limpieza",
    category: "menage",
    level: 4,
    icon: "🧹",
    example: "Je fais le ménage le samedi matin, avant de me reposer.",
    acceptedAnswers: ["faire le ménage", "je fais le ménage"],
    distractors: ["se reposer", "lire", "regarder la télévision"]
  },
  {
    id: "nettoyer",
    infinitive: "nettoyer",
    firstPerson: "je nettoie",
    translation: "limpiar",
    category: "menage",
    level: 4,
    icon: "✨",
    example: "Je nettoie la maison de haut en bas avant les vacances.",
    acceptedAnswers: ["nettoyer", "je nettoie"],
    distractors: ["ranger", "dîner", "étudier"]
  },
  {
    id: "balayer",
    infinitive: "balayer",
    firstPerson: "je balaie",
    translation: "barrer",
    category: "menage",
    level: 4,
    icon: "🧹",
    example: "Je balaie le sol de la cuisine, parce qu'il y a des miettes.",
    acceptedAnswers: ["balayer", "je balaie"],
    distractors: ["lire", "dormir", "déjeuner"]
  },
  {
    id: "passer_la_serpilliere",
    infinitive: "passer la serpillière",
    firstPerson: "je passe la serpillière",
    translation: "trapear",
    category: "menage",
    level: 4,
    icon: "🪣",
    example: "Je passe la serpillière dans la cuisine, après avoir balayé.",
    acceptedAnswers: ["passer la serpillière", "je passe la serpillière", "laver le sol", "je lave le sol"],
    distractors: ["balayer", "plier le linge", "lire"]
  },
  {
    id: "laver_le_sol",
    infinitive: "laver le sol",
    firstPerson: "je lave le sol",
    translation: "lavar el suelo",
    category: "menage",
    level: 4,
    icon: "💦",
    example: "Le sol est sale, alors je lave le sol avec de l'eau et du savon.",
    acceptedAnswers: ["laver le sol", "je lave le sol", "passer la serpillière", "je passe la serpillière"],
    distractors: ["sortir les poubelles", "faire la lessive", "se coucher"]
  },
  {
    id: "passer_l_aspirateur",
    infinitive: "passer l'aspirateur",
    firstPerson: "je passe l'aspirateur",
    translation: "pasar la aspiradora",
    category: "menage",
    level: 4,
    icon: "🌀",
    example: "Je passe l'aspirateur dans le salon, une fois par semaine.",
    acceptedAnswers: ["passer l'aspirateur", "je passe l'aspirateur"],
    distractors: ["balayer", "faire la vaisselle", "lire"]
  },
  {
    id: "sortir_les_poubelles",
    infinitive: "sortir les poubelles",
    firstPerson: "je sors les poubelles",
    translation: "sacar la basura",
    category: "menage",
    level: 4,
    icon: "🗑️",
    example: "Je sors les poubelles le soir, avant de me coucher.",
    acceptedAnswers: ["sortir les poubelles", "je sors les poubelles", "sortir la poubelle", "je sors la poubelle"],
    distractors: ["ranger la maison", "faire la lessive", "dîner"]
  },
  {
    id: "faire_la_lessive",
    infinitive: "faire la lessive",
    firstPerson: "je fais la lessive",
    translation: "lavar la ropa",
    category: "menage",
    level: 4,
    icon: "🧺",
    example: "Je fais la lessive le dimanche, avec la machine à laver.",
    acceptedAnswers: ["faire la lessive", "je fais la lessive"],
    distractors: ["étendre le linge", "faire la vaisselle", "lire"]
  },
  {
    id: "etendre_le_linge",
    infinitive: "étendre le linge",
    firstPerson: "j'étends le linge",
    translation: "tender la ropa",
    category: "menage",
    level: 4,
    icon: "🌬️",
    example: "J'étends le linge dans le jardin, quand il fait beau.",
    acceptedAnswers: ["étendre le linge", "j'étends le linge"],
    distractors: ["plier le linge", "balayer", "étudier"]
  },
  {
    id: "plier_le_linge",
    infinitive: "plier le linge",
    firstPerson: "je plie le linge",
    translation: "doblar la ropa",
    category: "menage",
    level: 4,
    icon: "👔",
    example: "Je plie le linge sur le lit, après qu'il a séché.",
    acceptedAnswers: ["plier le linge", "je plie le linge"],
    distractors: ["étendre le linge", "faire la vaisselle", "se coucher"]
  },
  {
    id: "nettoyer_la_salle_de_bains",
    infinitive: "nettoyer la salle de bains",
    firstPerson: "je nettoie la salle de bains",
    translation: "limpiar el baño",
    category: "menage",
    level: 4,
    icon: "🛁",
    example: "Je nettoie la salle de bains avec une éponge et du savon.",
    acceptedAnswers: ["nettoyer la salle de bains", "je nettoie la salle de bains"],
    distractors: ["nettoyer la cuisine", "faire le lit", "lire"]
  },
  {
    id: "ranger_la_maison",
    infinitive: "ranger la maison",
    firstPerson: "je range la maison",
    translation: "ordenar la casa",
    category: "menage",
    level: 4,
    icon: "🏡",
    example: "Je range la maison avant la visite de mes grands-parents.",
    acceptedAnswers: ["ranger la maison", "je range la maison"],
    distractors: ["sortir les poubelles", "regarder la télévision", "se doucher"]
  },

  // ---- Objets de ménage (niveau 4) ----
  {
    id: "un_balai",
    infinitive: "un balai",
    firstPerson: "un balai",
    translation: "una escoba",
    category: "objet",
    level: 4,
    icon: "🧹",
    example: "J'utilise un balai pour balayer le sol de la cuisine.",
    acceptedAnswers: ["un balai", "balai"],
    distractors: ["une éponge", "un seau", "du savon"]
  },
  {
    id: "une_serpilliere",
    infinitive: "une serpillière",
    firstPerson: "une serpillière",
    translation: "una fregona / trapeador",
    category: "objet",
    level: 4,
    icon: "🧻",
    example: "J'utilise une serpillière pour laver le sol, après avoir balayé.",
    acceptedAnswers: ["une serpillière", "serpillière"],
    distractors: ["un balai", "une poubelle", "le linge"]
  },
  {
    id: "un_aspirateur",
    infinitive: "un aspirateur",
    firstPerson: "un aspirateur",
    translation: "una aspiradora",
    category: "objet",
    level: 4,
    icon: "🌀",
    example: "J'utilise un aspirateur pour nettoyer le tapis du salon.",
    acceptedAnswers: ["un aspirateur", "aspirateur"],
    distractors: ["un seau", "une éponge", "du savon"]
  },
  {
    id: "une_poubelle",
    infinitive: "une poubelle",
    firstPerson: "une poubelle",
    translation: "un bote de basura",
    category: "objet",
    level: 4,
    icon: "🗑️",
    example: "Je sors une poubelle pleine ; elle sent mauvais !",
    acceptedAnswers: ["une poubelle", "poubelle"],
    distractors: ["un aspirateur", "une éponge", "le linge"]
  },
  {
    id: "une_eponge",
    infinitive: "une éponge",
    firstPerson: "une éponge",
    translation: "una esponja",
    category: "objet",
    level: 4,
    icon: "🧽",
    example: "J'utilise une éponge pour faire la vaisselle.",
    acceptedAnswers: ["une éponge", "éponge"],
    distractors: ["un balai", "un seau", "une poubelle"]
  },
  {
    id: "un_seau",
    infinitive: "un seau",
    firstPerson: "un seau",
    translation: "un balde / cubo",
    category: "objet",
    level: 4,
    icon: "🪣",
    example: "Je remplis un seau d'eau pour laver le sol.",
    acceptedAnswers: ["un seau", "seau"],
    distractors: ["une éponge", "du savon", "le linge"]
  },
  {
    id: "du_savon",
    infinitive: "du savon",
    firstPerson: "du savon",
    translation: "jabón",
    category: "objet",
    level: 4,
    icon: "🧼",
    example: "J'utilise du savon pour me laver les mains avant de manger.",
    acceptedAnswers: ["du savon", "savon"],
    distractors: ["un seau", "un balai", "une poubelle"]
  },
  {
    id: "le_linge",
    infinitive: "le linge",
    firstPerson: "le linge",
    translation: "la ropa (para lavar)",
    category: "objet",
    level: 4,
    icon: "👕",
    example: "Je lave le linge le dimanche, puis je l'étends dans le jardin.",
    acceptedAnswers: ["le linge", "linge"],
    distractors: ["du savon", "une poubelle", "un balai"]
  },

  // ============= EXPRESSIONS IDIOMATIQUES ET INFORMELLES (niveau 5) =============
  {
    id: "faire_la_grasse_matinee",
    infinitive: "faire la grasse matinée",
    firstPerson: "je fais la grasse matinée",
    translation: "quedarse en la cama hasta tarde (expresión)",
    category: "idiomatique",
    level: 5,
    icon: "😴",
    example: "Le dimanche, je fais la grasse matinée jusqu'à midi.",
    acceptedAnswers: ["faire la grasse matinée", "je fais la grasse matinée"],
    distractors: ["se réveiller", "se lever", "filer sous la douche"]
  },
  {
    id: "filer_sous_la_douche",
    infinitive: "filer sous la douche",
    firstPerson: "je file sous la douche",
    translation: "irse rápido a duchar (coloquial)",
    category: "idiomatique",
    level: 5,
    icon: "🚿",
    example: "Je suis en retard : je file sous la douche et je pars tout de suite.",
    acceptedAnswers: ["filer sous la douche", "je file sous la douche"],
    distractors: ["se doucher", "traîner au lit", "faire la grasse matinée"]
  },
  {
    id: "trainer_au_lit",
    infinitive: "traîner au lit",
    firstPerson: "je traîne au lit",
    translation: "remolonear / quedarse un rato más en la cama (coloquial)",
    category: "idiomatique",
    level: 5,
    icon: "🛌",
    example: "Je n'ai pas cours aujourd'hui, alors je traîne un peu au lit.",
    acceptedAnswers: ["traîner au lit", "je traîne au lit"],
    distractors: ["se lever", "faire le lit", "se doucher"]
  },
  {
    id: "donner_un_coup_de_balai",
    infinitive: "donner un coup de balai",
    firstPerson: "je donne un coup de balai",
    translation: "pasar la escoba rápido / barrer un poco (coloquial)",
    category: "idiomatique",
    level: 5,
    icon: "🧹",
    example: "Avant que les invités arrivent, je donne un coup de balai vite fait.",
    acceptedAnswers: ["donner un coup de balai", "je donne un coup de balai"],
    distractors: ["balayer", "passer l'aspirateur", "faire un brin de ménage"]
  },
  {
    id: "faire_un_brin_de_menage",
    infinitive: "faire un brin de ménage",
    firstPerson: "je fais un brin de ménage",
    translation: "ordenar/limpiar un poco (expresión coloquial)",
    category: "idiomatique",
    level: 5,
    icon: "🧽",
    example: "Le samedi, je fais un brin de ménage avant de sortir avec mes amis.",
    acceptedAnswers: ["faire un brin de ménage", "je fais un brin de ménage"],
    distractors: ["faire le ménage", "donner un coup de balai", "ranger la maison"]
  },
  {
    id: "etre_a_la_bourre",
    infinitive: "être à la bourre",
    firstPerson: "je suis à la bourre",
    translation: "ir con mucha prisa / llegar tarde (coloquial)",
    category: "idiomatique",
    level: 5,
    icon: "⏰",
    example: "Je suis à la bourre ce matin : pas le temps de prendre le petit déjeuner !",
    acceptedAnswers: ["être à la bourre", "je suis à la bourre"],
    distractors: ["faire la grasse matinée", "traîner au lit", "se reposer"]
  }
];

// Exposición global (sin módulos ES para evitar problemas de CORS con file://)
window.VOCABULARY = VOCABULARY;
