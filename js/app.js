/*
 * Routine Rush — Point d'entrée
 * ---------------------------------------------------------------
 * Initialise l'interface une fois le DOM chargé. Toute la logique
 * vit dans js/game.js (règles) et js/ui.js (interface).
 */
(function () {
  function boot() {
    if (!window.VOCABULARY || !window.Storage || !window.AudioModule || !window.Game || !window.UI) {
      console.error("Routine Rush : un ou plusieurs modules n'ont pas pu être chargés.");
      return;
    }
    UI.init();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
