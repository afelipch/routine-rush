/*
 * Routine Rush — Ilustraciones
 * ---------------------------------------------------------------
 * Iconos SVG simples, dibujados a mano en este archivo (sin imágenes
 * externas, sin derechos de autor de terceros), que reemplazan los
 * emojis para que las acciones sean visualmente más claras y
 * consistentes en cualquier dispositivo.
 *
 * Cada icono es una silueta plana con trazo oscuro y 1-2 colores de
 * relleno, en un viewBox de 0 0 64 64, fácil de reconocer en tamaño
 * pequeño. Si una palabra no tiene ilustración aquí, el juego usa su
 * emoji (campo "icon" en data/vocabulary.js) como alternativa.
 */

(function () {
  const STROKE = "#2c2b33";

  function svg(inner) {
    return (
      '<svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true" focusable="false">' +
      inner +
      "</svg>"
    );
  }

  // ---- Piezas reutilizables ----
  function waterDrops(x, y) {
    return (
      '<path d="M' + x + " " + y + " q4 6 0 10 q-4 -4 0 -10 Z" +
      '" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<path d="M' + (x + 8) + " " + (y + 4) + " q4 6 0 10 q-4 -4 0 -10 Z" +
      '" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="2"/>'
    );
  }

  function sparkle(x, y, scale) {
    scale = scale || 1;
    return (
      '<g transform="translate(' + x + " " + y + ") scale(" + scale + ')">' +
      '<path d="M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2 Z" fill="#ffd166" stroke="' +
      STROKE +
      '" stroke-width="1.5"/></g>'
    );
  }

  function zzz(x, y) {
    return (
      '<text x="' + x + '" y="' + y + '" font-size="12" font-family="sans-serif" fill="' + STROKE + '" font-weight="bold">z z z</text>'
    );
  }

  const ILLUSTRATIONS = {
    // ============================= LE MATIN =============================
    se_reveiller: svg(
      '<circle cx="32" cy="34" r="16" fill="#fff3c4" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="28" y="12" width="8" height="8" rx="2" fill="#ff8c42" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<circle cx="17" cy="20" r="4" fill="#ffd166" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<circle cx="47" cy="20" r="4" fill="#ffd166" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="32" y1="34" x2="32" y2="24" stroke="' + STROKE + '" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="32" y1="34" x2="40" y2="34" stroke="' + STROKE + '" stroke-width="3" stroke-linecap="round"/>' +
      sparkle(50, 14, 0.8)
    ),
    se_lever: svg(
      '<rect x="10" y="44" width="30" height="8" rx="2" fill="#c9a888" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="10" y="36" width="10" height="8" rx="3" fill="#fff" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<circle cx="46" cy="26" r="7" fill="#f2c9a0" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="46" y1="33" x2="46" y2="46" stroke="' + STROKE + '" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="46" y1="38" x2="38" y2="34" stroke="' + STROKE + '" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="46" y1="46" x2="40" y2="54" stroke="' + STROKE + '" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="46" y1="46" x2="52" y2="54" stroke="' + STROKE + '" stroke-width="4" stroke-linecap="round"/>'
    ),
    faire_le_lit: svg(
      '<rect x="8" y="38" width="48" height="14" rx="3" fill="#c9a888" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="10" y="24" width="44" height="16" rx="4" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<ellipse cx="20" cy="24" rx="9" ry="6" fill="#fff" stroke="' + STROKE + '" stroke-width="3"/>' +
      sparkle(48, 16, 0.9)
    ),
    se_laver: svg(
      '<rect x="24" y="14" width="16" height="10" rx="3" fill="#a3d9a5" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="27" y="24" width="10" height="8" fill="#a3d9a5" stroke="' + STROKE + '" stroke-width="2"/>' +
      waterDrops(28, 36) +
      '<path d="M14 52 q18 10 36 0" fill="none" stroke="' + STROKE + '" stroke-width="3" stroke-linecap="round"/>'
    ),
    se_doucher: svg(
      '<path d="M20 14 h24 a4 4 0 0 1 4 4 v2 h-32 v-2 a4 4 0 0 1 4 -4 Z" fill="#c7c7c7" stroke="' +
        STROKE +
        '" stroke-width="3"/>' +
      '<line x1="18" y1="28" x2="14" y2="36" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="26" y1="28" x2="22" y2="38" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="34" y1="28" x2="30" y2="36" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="42" y1="28" x2="38" y2="38" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="50" y1="28" x2="46" y2="36" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="32" cy="48" r="8" fill="#f2c9a0" stroke="' + STROKE + '" stroke-width="3"/>'
    ),
    se_brosser_les_dents: svg(
      '<rect x="14" y="28" width="34" height="7" rx="3" fill="#fff" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="42" y="24" width="14" height="15" rx="3" fill="#ff8c42" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="18" y1="25" x2="18" y2="31" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="23" y1="25" x2="23" y2="31" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="28" y1="25" x2="28" y2="31" stroke="' + STROKE + '" stroke-width="2"/>' +
      sparkle(20, 44, 0.7)
    ),
    s_habiller: svg(
      '<path d="M22 14 L32 22 L42 14 L52 22 L46 30 L42 27 L42 52 H22 V27 L18 30 L12 22 Z" fill="#ff8c42" stroke="' +
        STROKE +
        '" stroke-width="3" stroke-linejoin="round"/>'
    ),
    se_coiffer: svg(
      '<path d="M20 40 Q18 20 32 18 Q46 20 44 40" fill="#8a5a3c" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="18" y="42" width="28" height="8" rx="2" fill="#ffd166" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="22" y1="42" x2="22" y2="50" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="27" y1="42" x2="27" y2="50" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="32" y1="42" x2="32" y2="50" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="37" y1="42" x2="37" y2="50" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="42" y1="42" x2="42" y2="50" stroke="' + STROKE + '" stroke-width="2"/>'
    ),
    prendre_le_petit_dejeuner: svg(
      '<path d="M14 26 q10 -14 20 0 q4 -2 4 4 q0 8 -12 8 q-12 0 -12 -8 q0 -4 0 -4 Z" fill="#e8b989" stroke="' +
        STROKE +
        '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M40 30 h10 a6 6 0 0 1 0 12 h-2" fill="none" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="24" y="30" width="16" height="14" rx="2" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="3"/>'
    ),
    partir_de_la_maison: svg(
      '<rect x="14" y="12" width="24" height="40" rx="2" fill="#e8b989" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<circle cx="32" cy="32" r="2.5" fill="' + STROKE + '"/>' +
      '<path d="M42 32 h14 M50 26 l6 6 l-6 6" fill="none" stroke="#7fc7ea" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
    ),

    // ============================= MA JOURNÉE =============================
    aller_a_l_ecole: svg(
      '<polygon points="32,10 54,26 10,26" fill="#ff8c42" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="14" y="26" width="36" height="26" fill="#fff3c4" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="28" y="36" width="8" height="16" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="32" y1="10" x2="32" y2="4" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<rect x="32" y="4" width="8" height="5" fill="#d64550" stroke="' + STROKE + '" stroke-width="1.5"/>'
    ),
    etudier: svg(
      '<path d="M10 20 h20 v28 h-20 Z" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<path d="M54 20 h-20 v28 h20 Z" fill="#a3d9a5" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="32" y1="20" x2="32" y2="48" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="15" y1="28" x2="25" y2="28" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="15" y1="34" x2="25" y2="34" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="39" y1="28" x2="49" y2="28" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="39" y1="34" x2="49" y2="34" stroke="' + STROKE + '" stroke-width="2"/>'
    ),
    dejeuner: svg(
      '<circle cx="30" cy="32" r="18" fill="#fff" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<circle cx="30" cy="32" r="9" fill="#fbeee0" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="52" y1="16" x2="52" y2="48" stroke="' + STROKE + '" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="48" y1="16" x2="48" y2="26" stroke="' + STROKE + '" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="56" y1="16" x2="56" y2="26" stroke="' + STROKE + '" stroke-width="2" stroke-linecap="round"/>'
    ),
    parler_avec_ses_amis: svg(
      '<path d="M8 16 h26 a4 4 0 0 1 4 4 v10 a4 4 0 0 1 -4 4 h-14 l-6 6 v-6 h-6 a4 4 0 0 1 -4 -4 v-10 a4 4 0 0 1 4 -4 Z" fill="#7fc7ea" stroke="' +
        STROKE +
        '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M56 26 h-18 a4 4 0 0 0 -4 4 v9 a4 4 0 0 0 4 4 h12 l5 5 v-5 h1 a4 4 0 0 0 4 -4 v-9 a4 4 0 0 0 -4 -4 Z" fill="#ffd166" stroke="' +
        STROKE +
        '" stroke-width="3" stroke-linejoin="round"/>'
    ),
    rentrer_a_la_maison: svg(
      '<polygon points="32,10 54,28 10,28" fill="#ff8c42" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="14" y="28" width="36" height="24" fill="#fff3c4" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<path d="M4 34 h12 M10 28 l-6 6 l6 6" fill="none" stroke="#7fc7ea" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'
    ),
    se_reposer: svg(
      '<rect x="10" y="30" width="40" height="18" rx="4" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="8" y="24" width="10" height="14" rx="3" fill="#a3d9a5" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="42" y="24" width="10" height="14" rx="3" fill="#a3d9a5" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="12" y1="48" x2="12" y2="54" stroke="' + STROKE + '" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="48" y1="48" x2="48" y2="54" stroke="' + STROKE + '" stroke-width="3" stroke-linecap="round"/>' +
      zzz(38, 18)
    ),
    faire_ses_devoirs: svg(
      '<rect x="12" y="14" width="30" height="38" rx="2" fill="#fff" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="18" y1="24" x2="36" y2="24" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<path d="M18 32 l3 3 l6 -7" fill="none" stroke="#2e9e5b" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<line x1="30" y1="34" x2="36" y2="34" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<path d="M40 44 l14 -14 l4 4 l-14 14 l-6 2 Z" fill="#ffd166" stroke="' + STROKE + '" stroke-width="2.5" stroke-linejoin="round"/>'
    ),
    diner: svg(
      '<circle cx="26" cy="34" r="16" fill="#fff" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<circle cx="26" cy="34" r="8" fill="#fbeee0" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<path d="M46 12 a10 10 0 1 0 8 16 a12 12 0 0 1 -8 -16 Z" fill="#2c2b33" stroke="' + STROKE + '" stroke-width="1"/>'
    ),
    regarder_la_television: svg(
      '<rect x="8" y="14" width="48" height="30" rx="3" fill="#4ea8de" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="12" y="18" width="40" height="22" fill="#dff1fb"/>' +
      '<line x1="32" y1="44" x2="32" y2="50" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="20" y1="50" x2="44" y2="50" stroke="' + STROKE + '" stroke-width="3" stroke-linecap="round"/>' +
      sparkle(22, 26, 0.6)
    ),
    lire: svg(
      '<path d="M32 18 C24 12 12 14 12 14 V44 C12 44 24 42 32 48 C40 42 52 44 52 44 V14 C52 14 40 12 32 18 Z" fill="#fff" stroke="' +
        STROKE +
        '" stroke-width="3" stroke-linejoin="round"/>' +
      '<line x1="32" y1="18" x2="32" y2="48" stroke="' + STROKE + '" stroke-width="2.5"/>'
    ),

    // ==================== LA CHAMBRE ET LA CUISINE ====================
    ranger_la_chambre: svg(
      '<path d="M10 28 L54 28 L48 52 H16 Z" fill="#c9a888" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="10" y="22" width="44" height="8" rx="2" fill="#e8b989" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="22" y="10" width="10" height="10" rx="2" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      '<circle cx="40" cy="14" r="5" fill="#ff8c42" stroke="' + STROKE + '" stroke-width="2.5"/>'
    ),
    nettoyer_la_table: svg(
      '<rect x="10" y="36" width="44" height="6" rx="2" fill="#c9a888" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="16" y1="42" x2="16" y2="52" stroke="' + STROKE + '" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="48" y1="42" x2="48" y2="52" stroke="' + STROKE + '" stroke-width="3" stroke-linecap="round"/>' +
      sparkle(20, 24, 1) +
      sparkle(42, 26, 0.7)
    ),
    mettre_la_table: svg(
      '<circle cx="24" cy="34" r="11" fill="#fff" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="42" y1="20" x2="42" y2="48" stroke="' + STROKE + '" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="38" y1="20" x2="38" y2="30" stroke="' + STROKE + '" stroke-width="2" stroke-linecap="round"/>' +
      '<line x1="46" y1="20" x2="46" y2="30" stroke="' + STROKE + '" stroke-width="2" stroke-linecap="round"/>' +
      '<rect x="10" y="20" width="6" height="28" rx="2" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="2.5"/>'
    ),
    debarrasser_la_table: svg(
      '<ellipse cx="32" cy="46" rx="16" ry="4" fill="#fff" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      '<ellipse cx="32" cy="36" rx="16" ry="4" fill="#fff" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      '<ellipse cx="32" cy="26" rx="16" ry="4" fill="#fff" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      '<path d="M28 16 l4 -6 l4 6" fill="none" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    ),
    faire_la_vaisselle: svg(
      '<path d="M8 30 h48 v6 a12 12 0 0 1 -12 12 h-24 a12 12 0 0 1 -12 -12 Z" fill="#c7c7c7" stroke="' +
        STROKE +
        '" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="24" cy="24" r="7" fill="#fff" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      '<rect x="34" y="18" width="10" height="8" rx="2" fill="#a3d9a5" stroke="' + STROKE + '" stroke-width="2"/>' +
      sparkle(46, 16, 0.7)
    ),
    laver_les_assiettes: svg(
      '<circle cx="30" cy="30" r="16" fill="#fff" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<circle cx="30" cy="30" r="8" fill="#fbeee0" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<rect x="44" y="38" width="12" height="9" rx="3" fill="#a3d9a5" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      waterDrops(46, 20)
    ),
    essuyer_la_table: svg(
      '<rect x="16" y="20" width="28" height="20" rx="4" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="20" y1="26" x2="40" y2="26" stroke="#fff" stroke-width="2"/>' +
      '<line x1="20" y1="32" x2="40" y2="32" stroke="#fff" stroke-width="2"/>' +
      '<path d="M46 22 a6 6 0 1 1 -4 10" fill="none" stroke="' + STROKE + '" stroke-width="2.5" stroke-linecap="round"/>'
    ),
    nettoyer_la_cuisine: svg(
      '<rect x="16" y="26" width="26" height="16" rx="3" fill="#c7c7c7" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="20" y="16" width="18" height="10" rx="2" fill="#e8b989" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      '<line x1="16" y1="46" x2="42" y2="46" stroke="' + STROKE + '" stroke-width="3" stroke-linecap="round"/>' +
      sparkle(48, 18, 0.8) +
      sparkle(50, 34, 0.6)
    ),
    ranger_les_vetements: svg(
      '<rect x="14" y="12" width="36" height="40" rx="2" fill="#e8b989" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="32" y1="12" x2="32" y2="52" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<path d="M20 20 L26 26 L20 32 L26 38" fill="none" stroke="#ff8c42" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="28" cy="32" r="1.5" fill="' + STROKE + '"/>' +
      '<circle cx="36" cy="32" r="1.5" fill="' + STROKE + '"/>'
    ),

    // ============================= LE GRAND MÉNAGE =============================
    faire_le_menage: svg(
      '<line x1="20" y1="14" x2="34" y2="46" stroke="#e8b989" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M34 46 l14 4 l-4 -16 Z" fill="#ffd166" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="42" y="30" width="12" height="16" rx="2" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="2.5"/>'
    ),
    nettoyer: svg(
      '<rect x="26" y="12" width="12" height="20" rx="3" fill="#a3d9a5" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="29" y="6" width="6" height="8" fill="#2e9e5b" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="24" y1="34" x2="18" y2="44" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="32" y1="36" x2="32" y2="46" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="40" y1="34" x2="46" y2="44" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round"/>' +
      sparkle(46, 16, 0.7)
    ),
    balayer: svg(
      '<line x1="16" y1="10" x2="36" y2="40" stroke="#e8b989" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M36 40 l16 6 l-6 -18 Z" fill="#ffd166" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<circle cx="12" cy="50" r="2" fill="' + STROKE + '"/>' +
      '<circle cx="18" cy="52" r="2" fill="' + STROKE + '"/>' +
      '<circle cx="24" cy="50" r="2" fill="' + STROKE + '"/>'
    ),
    passer_la_serpilliere: svg(
      '<line x1="30" y1="8" x2="30" y2="36" stroke="#e8b989" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M18 36 h24 l4 12 h-32 Z" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<line x1="10" y1="52" x2="54" y2="52" stroke="' + STROKE + '" stroke-width="2" stroke-dasharray="2 4"/>'
    ),
    laver_le_sol: svg(
      '<path d="M20 24 h14 v-8 a7 7 0 0 0 -14 0 Z" fill="#c7c7c7" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<path d="M14 24 h26 l-3 22 h-20 Z" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M40 30 q10 4 4 14" fill="none" stroke="#4ea8de" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="10" y1="54" x2="54" y2="54" stroke="' + STROKE + '" stroke-width="2" stroke-dasharray="2 4"/>'
    ),
    passer_l_aspirateur: svg(
      '<rect x="14" y="30" width="16" height="12" rx="2" fill="#ff8c42" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<circle cx="18" cy="46" r="4" fill="' + STROKE + '"/>' +
      '<circle cx="26" cy="46" r="4" fill="' + STROKE + '"/>' +
      '<path d="M30 34 h10 l10 -20" fill="none" stroke="' + STROKE + '" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="10" cy="34" r="4" fill="#c7c7c7" stroke="' + STROKE + '" stroke-width="2"/>'
    ),
    sortir_les_poubelles: svg(
      '<path d="M18 22 h28 l-3 30 h-22 Z" fill="#c7c7c7" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="14" y="16" width="36" height="6" rx="2" fill="#8a8a8a" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      '<line x1="26" y1="28" x2="26" y2="46" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="34" y1="28" x2="34" y2="46" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<path d="M50 34 h8 M54 30 l4 4 l-4 4" fill="none" stroke="#d64550" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
    ),
    faire_la_lessive: svg(
      '<rect x="10" y="12" width="32" height="36" rx="4" fill="#c7c7c7" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<circle cx="26" cy="32" r="11" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<circle cx="26" cy="32" r="5" fill="#dff1fb"/>' +
      '<circle cx="16" cy="18" r="2" fill="' + STROKE + '"/>' +
      '<circle cx="23" cy="18" r="2" fill="' + STROKE + '"/>'
    ),
    etendre_le_linge: svg(
      '<line x1="6" y1="18" x2="58" y2="18" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      '<path d="M22 18 v6 a10 10 0 0 0 20 0 v-6" fill="#ff8c42" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<path d="M8 18 v14 M14 18 v10" stroke="' + STROKE + '" stroke-width="2" stroke-linecap="round"/>'
    ),
    plier_le_linge: svg(
      '<rect x="14" y="34" width="36" height="8" rx="2" fill="#a3d9a5" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="14" y="24" width="36" height="8" rx="2" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="14" y="14" width="36" height="8" rx="2" fill="#ffd166" stroke="' + STROKE + '" stroke-width="3"/>'
    ),
    nettoyer_la_salle_de_bains: svg(
      '<path d="M10 32 h44 v6 a10 10 0 0 1 -10 10 h-24 a10 10 0 0 1 -10 -10 Z" fill="#dff1fb" stroke="' +
        STROKE +
        '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M14 32 v-10 a4 4 0 0 1 8 0" fill="none" stroke="' + STROKE + '" stroke-width="3"/>' +
      sparkle(44, 18, 0.8) +
      sparkle(50, 30, 0.6)
    ),
    ranger_la_maison: svg(
      '<polygon points="32,10 54,26 10,26" fill="#ff8c42" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="14" y="26" width="36" height="26" fill="#fff3c4" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<path d="M24 38 l4 4 l8 -8" fill="none" stroke="#2e9e5b" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
    ),
    un_balai: svg(
      '<line x1="24" y1="8" x2="40" y2="40" stroke="#e8b989" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M40 40 l16 8 l-8 -20 Z" fill="#ffd166" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>'
    ),
    une_serpilliere: svg(
      '<line x1="30" y1="6" x2="30" y2="30" stroke="#e8b989" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M16 30 h28 l6 20 h-40 Z" fill="#c7c7c7" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<line x1="20" y1="36" x2="24" y2="50" stroke="' + STROKE + '" stroke-width="1.5"/>' +
      '<line x1="30" y1="36" x2="30" y2="50" stroke="' + STROKE + '" stroke-width="1.5"/>' +
      '<line x1="40" y1="36" x2="36" y2="50" stroke="' + STROKE + '" stroke-width="1.5"/>'
    ),
    un_aspirateur: svg(
      '<rect x="14" y="28" width="18" height="14" rx="2" fill="#ff8c42" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<circle cx="19" cy="46" r="4" fill="' + STROKE + '"/>' +
      '<circle cx="27" cy="46" r="4" fill="' + STROKE + '"/>' +
      '<path d="M32 34 h10 l10 -20" fill="none" stroke="' + STROKE + '" stroke-width="4" stroke-linecap="round"/>'
    ),
    une_poubelle: svg(
      '<path d="M18 22 h28 l-3 30 h-22 Z" fill="#c7c7c7" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="14" y="16" width="36" height="6" rx="2" fill="#8a8a8a" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      '<line x1="26" y1="28" x2="26" y2="46" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="34" y1="28" x2="34" y2="46" stroke="' + STROKE + '" stroke-width="2"/>'
    ),
    une_eponge: svg(
      '<rect x="12" y="20" width="40" height="24" rx="8" fill="#ffd166" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<circle cx="22" cy="30" r="2" fill="' + STROKE + '"/>' +
      '<circle cx="32" cy="34" r="2" fill="' + STROKE + '"/>' +
      '<circle cx="42" cy="28" r="2" fill="' + STROKE + '"/>' +
      '<circle cx="26" cy="38" r="2" fill="' + STROKE + '"/>'
    ),
    un_seau: svg(
      '<path d="M16 22 h32 l-5 28 a4 4 0 0 1 -4 4 h-14 a4 4 0 0 1 -4 -4 Z" fill="#7fc7ea" stroke="' +
        STROKE +
        '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M18 22 a14 10 0 0 1 28 0" fill="none" stroke="' + STROKE + '" stroke-width="3"/>'
    ),
    du_savon: svg(
      '<rect x="14" y="22" width="36" height="20" rx="8" fill="#a3d9a5" stroke="' + STROKE + '" stroke-width="3"/>' +
      sparkle(46, 16, 0.7) +
      sparkle(14, 16, 0.5)
    ),
    le_linge: svg(
      '<path d="M12 44 q20 -14 40 0 q0 6 -4 6 h-32 q-4 0 -4 -6 Z" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<path d="M20 40 q4 -10 12 -2" fill="none" stroke="#fff" stroke-width="2.5"/>' +
      '<path d="M34 40 q4 -10 12 -2" fill="none" stroke="#fff" stroke-width="2.5"/>'
    ),

    // ============= EXPRESSIONS IDIOMATIQUES ET INFORMELLES =============
    faire_la_grasse_matinee: svg(
      '<rect x="10" y="38" width="40" height="10" rx="2" fill="#c9a888" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<ellipse cx="20" cy="38" rx="8" ry="5" fill="#fff" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      '<circle cx="46" cy="14" r="7" fill="#ffd166" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      zzz(30, 20)
    ),
    filer_sous_la_douche: svg(
      '<path d="M20 14 h24 a4 4 0 0 1 4 4 v2 h-32 v-2 a4 4 0 0 1 4 -4 Z" fill="#c7c7c7" stroke="' +
        STROKE +
        '" stroke-width="3"/>' +
      '<line x1="18" y1="28" x2="14" y2="36" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="26" y1="28" x2="22" y2="38" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round"/>' +
      '<line x1="34" y1="28" x2="30" y2="36" stroke="#7fc7ea" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="32" cy="48" r="8" fill="#f2c9a0" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<path d="M46 24 h8 M46 32 h10" stroke="' + STROKE + '" stroke-width="2" stroke-linecap="round"/>'
    ),
    trainer_au_lit: svg(
      '<rect x="10" y="38" width="40" height="10" rx="2" fill="#c9a888" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<rect x="10" y="30" width="40" height="10" rx="4" fill="#7fc7ea" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<ellipse cx="20" cy="30" rx="8" ry="5" fill="#fff" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      zzz(36, 16)
    ),
    donner_un_coup_de_balai: svg(
      '<line x1="18" y1="12" x2="34" y2="38" stroke="#e8b989" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M34 38 l16 6 l-6 -18 Z" fill="#ffd166" stroke="' + STROKE + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M10 24 q4 -4 8 0" fill="none" stroke="' + STROKE + '" stroke-width="2" stroke-linecap="round"/>' +
      '<path d="M6 32 q4 -4 8 0" fill="none" stroke="' + STROKE + '" stroke-width="2" stroke-linecap="round"/>'
    ),
    faire_un_brin_de_menage: svg(
      '<line x1="24" y1="16" x2="36" y2="38" stroke="#e8b989" stroke-width="3.5" stroke-linecap="round"/>' +
      '<path d="M36 38 l12 5 l-5 -14 Z" fill="#ffd166" stroke="' + STROKE + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      sparkle(18, 42, 0.7)
    ),
    etre_a_la_bourre: svg(
      '<circle cx="24" cy="18" r="6" fill="#f2c9a0" stroke="' + STROKE + '" stroke-width="3"/>' +
      '<line x1="24" y1="24" x2="24" y2="38" stroke="' + STROKE + '" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="24" y1="28" x2="34" y2="24" stroke="' + STROKE + '" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="24" y1="38" x2="16" y2="50" stroke="' + STROKE + '" stroke-width="4" stroke-linecap="round"/>' +
      '<line x1="24" y1="38" x2="34" y2="48" stroke="' + STROKE + '" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="48" cy="20" r="10" fill="#fff3c4" stroke="' + STROKE + '" stroke-width="2.5"/>' +
      '<line x1="48" y1="20" x2="48" y2="14" stroke="' + STROKE + '" stroke-width="2"/>' +
      '<line x1="48" y1="20" x2="53" y2="22" stroke="' + STROKE + '" stroke-width="2"/>'
    )
  };

  window.ILLUSTRATIONS = ILLUSTRATIONS;
})();
