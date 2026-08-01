/*
 * Routine Rush — Interfaz de usuario
 * ---------------------------------------------------------------
 * Se encarga de renderizar las pantallas y de conectar los eventos
 * del DOM con el motor de juego (js/game.js). No contiene reglas
 * de puntuación: solo llama a las funciones expuestas por Game.
 */

const UI = (function () {
  const FEEDBACK = {
    correct: ["Très bien !", "Bravo !", "Bonne réponse !", "Excellent !", "Tu as réussi !"],
    incorrect: ["Essaie encore.", "Presque !", "Regarde bien l'image.", "Écoute encore une fois."]
  };

  let els = {};
  let selection = null; // respuesta seleccionada / escrita actualmente
  let sequenceOrder = [];
  let dragPlacements = {};
  let dragSelectedItem = null;
  let multiSelectDone = new Set();
  let routineSelections = {};
  let matchingSelectedLeft = null;
  let currentTeacherMode = false;
  let speedTimer = null;
  let pendingAutoAdvance = null;

  function $(id) {
    return document.getElementById(id);
  }

  // Devuelve una ilustración SVG (más clara y consistente que un emoji)
  // cuando existe una para esta palabra; si no, usa el emoji como
  // alternativa segura. El SVG se envuelve para heredar el tamaño del
  // texto que lo rodea.
  function iconMarkup(wordId, fallbackEmoji) {
    const svgContent = wordId && window.ILLUSTRATIONS ? window.ILLUSTRATIONS[wordId] : null;
    if (svgContent) {
      return '<span class="illustration" aria-hidden="true">' + svgContent + "</span>";
    }
    return '<span class="illustration illustration--emoji" aria-hidden="true">' + (fallbackEmoji || "❓") + "</span>";
  }

  function cacheEls() {
    [
      "audio-warning", "btn-close-audio-warning",
      "screen-start", "btn-play", "btn-continue", "btn-settings", "btn-teacher-mode",
      "select-instruction-lang", "btn-erase-progress",
      "screen-map", "btn-map-back", "btn-map-settings", "map-xp-rank", "house-scene", "level-grid",
      "screen-game", "btn-pause", "game-level-title", "progress-bar", "progress-bar-fill",
      "hud-score", "hud-combo", "challenge-instruction", "btn-translate", "instruction-translation",
      "btn-play-audio", "challenge-body", "feedback-panel", "btn-hint", "btn-submit", "btn-next",
      "screen-results", "results-stars", "results-stars-text", "results-score", "results-accuracy",
      "results-combo", "results-mastered", "results-practice", "btn-replay", "btn-next-level", "btn-back-to-map",
      "modal-settings", "toggle-sfx", "toggle-voice", "toggle-textsize", "btn-close-settings",
      "modal-pause", "btn-resume", "btn-pause-settings", "btn-pause-quit",
      "modal-confirm-reset", "btn-cancel-reset", "btn-confirm-reset",
      "modal-teacher", "teacher-levels", "teacher-categories", "teacher-timer", "teacher-question-count",
      "teacher-only-menage", "teacher-only-pronominaux", "teacher-mastered-summary", "teacher-practice-summary",
      "btn-teacher-reset", "btn-teacher-start", "btn-teacher-close",
      "sr-announcer"
    ].forEach((id) => (els[id.replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = $(id)));
  }

  function announce(text) {
    if (els.srAnnouncer) els.srAnnouncer.textContent = text;
  }

  function showScreen(name) {
    document.querySelectorAll(".screen").forEach((s) => s.classList.remove("screen--active"));
    $(name).classList.add("screen--active");
    window.scrollTo(0, 0);
  }

  function openModal(id) {
    $(id).hidden = false;
    const focusable = $(id).querySelector("button, input, select");
    if (focusable) focusable.focus();
  }
  function closeModal(id) {
    $(id).hidden = true;
  }

  // ---------------------------------------------------------------
  // Pantalla inicial
  // ---------------------------------------------------------------
  function renderStart() {
    const settings = Storage.getSettings();
    els.selectInstructionLang.value = settings.instructionLang;
    const unlocked = Storage.getState().progress.unlockedLevels;
    els.btnContinue.disabled = false;
  }

  // ---------------------------------------------------------------
  // Mapa de niveles
  // ---------------------------------------------------------------
  function renderMap() {
    const rank = Game.getXPRank(Storage.getTotalXP());
    els.mapXpRank.textContent = "⭐ " + rank.title + " (" + Storage.getTotalXP() + " XP)";
    els.levelGrid.innerHTML = "";
    Game.LEVELS.forEach((lvl) => {
      const unlocked = Storage.isLevelUnlocked(lvl.id);
      const prog = Storage.getLevelProgress(lvl.id);
      const card = document.createElement("button");
      card.type = "button";
      card.className = "level-card" + (unlocked ? "" : " level-card--locked");
      card.setAttribute("role", "listitem");
      card.disabled = !unlocked;
      card.setAttribute(
        "aria-label",
        lvl.titleFr +
          (unlocked ? ", disponible" : ", verrouillé") +
          ", " +
          prog.stars +
          (prog.stars === 1 ? " étoile" : " étoiles")
      );
      const masteredPct = vocabMasteryPercentForLevel(lvl.id);
      card.innerHTML =
        '<div class="level-card-top"><span aria-hidden="true">' +
        lvl.icon +
        '</span><span class="level-status ' +
        (unlocked ? "level-status--available" : "level-status--locked") +
        '">' +
        (unlocked ? "Disponible" : "🔒 Verrouillé") +
        "</span></div>" +
        "<h3>Niveau " +
        lvl.id +
        " — " +
        lvl.titleFr +
        "</h3>" +
        '<p class="level-meta">' +
        lvl.subtitleFr +
        "</p>" +
        '<div class="level-stars" aria-hidden="true">' +
        starString(prog.stars) +
        "</div>" +
        '<p class="level-meta">Meilleur score : ' +
        prog.bestScore +
        " pts</p>" +
        '<p class="level-meta">Vocabulaire maîtrisé : ' +
        masteredPct +
        " %</p>";
      if (unlocked) {
        card.addEventListener("click", () => startLevelFlow(lvl.id));
      }
      els.levelGrid.appendChild(card);
    });
    renderHouseScene();
  }

  function vocabMasteryPercentForLevel(level) {
    const words = VOCABULARY.filter((w) => w.level === level);
    if (words.length === 0) return 0;
    const states = Storage.getAllVocabState();
    const mastered = words.filter((w) => states[w.id] && states[w.id].status === "maitrisee").length;
    return Math.round((mastered / words.length) * 100);
  }

  function starString(n) {
    return "⭐".repeat(n) + "☆".repeat(3 - n) + (n > 0 ? " (" + n + "/3)" : " (0/3)");
  }

  function renderHouseScene() {
    const stages = ["🌅", "🏫", "🛏️", "🧹", "🌟"];
    els.houseScene.innerHTML = "";
    Game.LEVELS.forEach((lvl) => {
      const prog = Storage.getLevelProgress(lvl.id);
      const span = document.createElement("span");
      span.textContent = prog.stars > 0 ? lvl.icon : "🔒";
      span.style.opacity = prog.stars > 0 ? "1" : "0.4";
      els.houseScene.appendChild(span);
    });
  }

  // ---------------------------------------------------------------
  // Flujo de nivel
  // ---------------------------------------------------------------
  function startLevelFlow(levelNumber) {
    AudioModule.ensureContext();
    const challenge = Game.startLevel(levelNumber);
    currentTeacherMode = false;
    showScreen("screen-game");
    const lvl = Game.LEVELS.find((l) => l.id === levelNumber);
    els.gameLevelTitle.textContent = "Niveau " + levelNumber + " — " + lvl.titleFr;
    renderCurrentChallenge();
  }

  function startCustomFlow(teacherSettings) {
    AudioModule.ensureContext();
    Game.startCustomPractice(teacherSettings);
    currentTeacherMode = true;
    showScreen("screen-game");
    els.gameLevelTitle.textContent = "Pratique personnalisée";
    renderCurrentChallenge();
  }

  function updateHud() {
    const s = Game.getSessionState();
    if (!s) return;
    els.hudScore.textContent = s.score + " pts";
    els.hudCombo.textContent = s.comboMultiplier > 1 ? "🔥 Combo x" + s.comboMultiplier : "";
    const pct = Math.round((s.currentIndex / s.total) * 100);
    els.progressBarFill.style.width = pct + "%";
    els.progressBar.setAttribute("aria-valuenow", String(pct));
  }

  function currentPrimaryWord(challenge) {
    const wid = challenge.data.wordId || (challenge.wordIds && challenge.wordIds[0]);
    return wid ? Game.byId(wid) : null;
  }

  function renderCurrentChallenge() {
    clearSpeedTimer();
    const challenge = Game.getCurrentChallenge();
    if (!challenge) {
      finishCurrentLevel();
      return;
    }
    selection = null;
    sequenceOrder = [];
    dragPlacements = {};
    dragSelectedItem = null;
    multiSelectDone = new Set();
    routineSelections = {};
    matchingSelectedLeft = null;

    updateHud();
    els.feedbackPanel.hidden = true;
    els.feedbackPanel.className = "feedback-panel";
    els.btnNext.hidden = true;
    els.btnSubmit.hidden = false;
    els.btnSubmit.disabled = false;
    els.btnHint.disabled = false;
    els.instructionTranslation.hidden = Storage.getSettings().instructionLang !== "es";
    els.btnTranslate.setAttribute("aria-pressed", Storage.getSettings().instructionLang === "es" ? "true" : "false");

    const instr = challenge.instruction;
    let instrFr = instr.fr;
    if (challenge.speedRound) {
      instrFr += " (" + challenge.missionIndex + "/" + challenge.missionTotal + ")";
    }
    els.challengeInstruction.textContent = instrFr;
    els.instructionTranslation.textContent = instr.es;

    els.challengeBody.innerHTML = "";
    els.challengeBody.appendChild(renderChallengeBody(challenge));

    if (challenge.speedRound) {
      startSpeedTimer(challenge);
    }
  }

  function renderChallengeBody(challenge) {
    const wrap = document.createElement("div");
    switch (challenge.type) {
      case "image-word":
        wrap.appendChild(buildIcon(challenge.data.wordId, challenge.data.icon));
        wrap.appendChild(buildOptionsGrid(challenge.data.options, (val, btn) => selectSimple(val, btn)));
        break;
      case "listen-image":
        wrap.appendChild(buildListenPrompt(challenge.data.audioText));
        wrap.appendChild(buildIconOptionsGrid(challenge.data.options, (id, btn) => selectSimple(id, btn)));
        AudioModule.speak(challenge.data.audioText);
        break;
      case "situation-choice": {
        const p = document.createElement("p");
        p.className = "fill-blank-sentence";
        p.textContent = challenge.data.situationFr;
        wrap.appendChild(p);
        wrap.appendChild(buildOptionsGridById(challenge.data.options, (id, btn) => selectSimple(id, btn)));
        break;
      }
      case "fill-blank":
      case "write-verb":
        wrap.appendChild(buildFillBlank(challenge));
        break;
      case "what-need": {
        const p = document.createElement("p");
        p.className = "fill-blank-sentence";
        p.textContent = challenge.data.prompt;
        wrap.appendChild(buildIcon(challenge.data.wordId, challenge.data.icon));
        wrap.appendChild(p);
        wrap.appendChild(buildIconOptionsGrid(challenge.data.options, (id, btn) => selectSimple(id, btn)));
        break;
      }
      case "find-error": {
        const p = document.createElement("p");
        p.className = "fill-blank-sentence";
        p.textContent = challenge.data.situationFr;
        wrap.appendChild(p);
        wrap.appendChild(buildOptionsGridById(challenge.data.options, (id, btn) => selectSimple(id, btn)));
        break;
      }
      case "sequence":
      case "final-sequence":
      case "final-timeline":
        wrap.appendChild(buildSequence(challenge));
        break;
      case "drag-drop":
        wrap.appendChild(buildDragDrop(challenge));
        break;
      case "final-room":
        wrap.appendChild(buildFinalRoom(challenge));
        break;
      case "final-cleaning":
        wrap.appendChild(buildFinalCleaning(challenge));
        break;
      case "final-routine":
        wrap.appendChild(buildFinalRoutine(challenge));
        break;
      case "matching":
        wrap.appendChild(buildMatching(challenge));
        break;
      default:
        wrap.textContent = "Type de défi inconnu.";
    }
    return wrap;
  }

  function buildIcon(wordId, fallbackEmoji) {
    const div = document.createElement("div");
    div.className = "big-icon";
    div.setAttribute("aria-hidden", "true");
    div.innerHTML = iconMarkup(wordId, fallbackEmoji);
    return div;
  }

  function buildListenPrompt(text) {
    const div = document.createElement("div");
    div.style.textAlign = "center";
    div.style.marginBottom = "1rem";
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn--secondary btn--large";
    btn.innerHTML = "🔊 Écouter";
    btn.setAttribute("aria-label", "Écouter le mot");
    btn.addEventListener("click", () => AudioModule.speak(text));
    div.appendChild(btn);
    return div;
  }

  function buildOptionsGrid(options, onPick) {
    const grid = document.createElement("div");
    grid.className = "options-grid";
    grid.setAttribute("role", "group");
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.setAttribute("aria-pressed", "false");
      btn.textContent = opt;
      btn.addEventListener("click", () => {
        grid.querySelectorAll(".option-btn").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        onPick(opt, btn);
      });
      grid.appendChild(btn);
    });
    return grid;
  }

  function buildOptionsGridById(options, onPick) {
    const grid = document.createElement("div");
    grid.className = "options-grid";
    grid.setAttribute("role", "group");
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.setAttribute("aria-pressed", "false");
      btn.innerHTML =
        '<span class="option-icon">' + iconMarkup(opt.id, opt.icon) + "</span><span>" + opt.label + "</span>";
      btn.addEventListener("click", () => {
        grid.querySelectorAll(".option-btn").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        onPick(opt.id, btn);
      });
      grid.appendChild(btn);
    });
    return grid;
  }

  function buildIconOptionsGrid(options, onPick) {
    const grid = document.createElement("div");
    grid.className = "options-grid";
    grid.setAttribute("role", "group");
    options.forEach((opt) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", opt.label);
      btn.innerHTML = '<span class="option-icon">' + iconMarkup(opt.id, opt.icon) + "</span><span>" + opt.label + "</span>";
      btn.addEventListener("click", () => {
        grid.querySelectorAll(".option-btn").forEach((b) => b.setAttribute("aria-pressed", "false"));
        btn.setAttribute("aria-pressed", "true");
        onPick(opt.id, btn);
      });
      grid.appendChild(btn);
    });
    return grid;
  }

  function selectSimple(value, btnEl) {
    selection = value;
  }

  function buildFillBlank(challenge) {
    const div = document.createElement("div");
    if (challenge.type === "fill-blank") {
      const p = document.createElement("p");
      p.className = "fill-blank-sentence";
      p.textContent = challenge.data.sentence;
      div.appendChild(p);
    } else {
      div.appendChild(buildIcon(challenge.data.wordId, challenge.data.icon));
    }
    const input = document.createElement("input");
    input.type = "text";
    input.className = "fill-blank-input";
    input.id = "typed-answer";
    input.setAttribute("aria-label", "Ta réponse");
    input.autocomplete = "off";
    input.addEventListener("input", (e) => {
      selection = e.target.value;
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        els.btnSubmit.click();
      }
    });
    div.appendChild(input);
    setTimeout(() => input.focus(), 30);
    return div;
  }

  function buildSequence(challenge) {
    const div = document.createElement("div");
    const list = document.createElement("ol");
    list.className = "sequence-list";
    const pool = document.createElement("div");
    pool.className = "sequence-pool";

    function refresh() {
      list.innerHTML = "";
      sequenceOrder.forEach((id, i) => {
        const item = challenge.data.items.find((it) => it.id === id);
        const li = document.createElement("li");
        li.className = "sequence-item";
        li.innerHTML =
          '<span class="seq-index" aria-hidden="true">' +
          (i + 1) +
          "</span><span>" +
          iconMarkup(item.id, item.icon) +
          " " +
          item.label +
          "</span>";
        const controls = document.createElement("span");
        controls.className = "sequence-item-controls";
        const removeBtn = document.createElement("button");
        removeBtn.type = "button";
        removeBtn.textContent = "✕ Retirer";
        removeBtn.setAttribute("aria-label", "Retirer " + item.label);
        removeBtn.addEventListener("click", () => {
          sequenceOrder = sequenceOrder.filter((x) => x !== id);
          refresh();
        });
        controls.appendChild(removeBtn);
        li.appendChild(controls);
        list.appendChild(li);
      });
      pool.innerHTML = "";
      challenge.data.items
        .filter((it) => sequenceOrder.indexOf(it.id) === -1)
        .forEach((it) => {
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "sequence-pool-item";
          btn.innerHTML = iconMarkup(it.id, it.icon) + " " + it.label;
          btn.addEventListener("click", () => {
            sequenceOrder.push(it.id);
            refresh();
          });
          pool.appendChild(btn);
        });
      selection = sequenceOrder.slice();
    }
    refresh();
    div.appendChild(list);
    const hint = document.createElement("p");
    hint.className = "es-note";
    hint.textContent = "Clique sur les actions ci-dessous pour les ajouter dans l'ordre.";
    div.appendChild(hint);
    div.appendChild(pool);
    return div;
  }

  function buildDragDrop(challenge) {
    const wrap = document.createElement("div");
    wrap.className = "dragdrop-wrap";
    const itemsCol = document.createElement("div");
    itemsCol.className = "dragdrop-items";
    const targetsCol = document.createElement("div");
    targetsCol.className = "dragdrop-targets";

    function refresh() {
      itemsCol.innerHTML = "";
      challenge.data.items.forEach((it) => {
        const placed = !!dragPlacements[it.id];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "drag-item" + (placed ? " is-placed" : "");
        btn.draggable = !placed;
        btn.setAttribute("aria-pressed", dragSelectedItem === it.id ? "true" : "false");
        btn.disabled = placed;
        btn.innerHTML = iconMarkup(it.id, it.icon) + "<span>" + it.label + "</span>";
        btn.addEventListener("click", () => {
          dragSelectedItem = dragSelectedItem === it.id ? null : it.id;
          refresh();
        });
        btn.addEventListener("dragstart", (e) => {
          e.dataTransfer.setData("text/plain", it.id);
        });
        itemsCol.appendChild(btn);
      });

      targetsCol.innerHTML = "";
      challenge.data.targets.forEach((t) => {
        const box = document.createElement("div");
        box.className = "drop-target";
        box.innerHTML = "<h4>" + t.icon + " " + t.label + "</h4>";
        const itemsWrap = document.createElement("div");
        itemsWrap.className = "drop-target-items";
        Object.keys(dragPlacements).forEach((itemId) => {
          if (dragPlacements[itemId] !== t.id) return;
          const it = challenge.data.items.find((x) => x.id === itemId);
          const chip = document.createElement("span");
          chip.className = "placed-chip";
          chip.innerHTML = iconMarkup(it.id, it.icon) + " " + it.label;
          itemsWrap.appendChild(chip);
        });
        box.appendChild(itemsWrap);
        box.addEventListener("click", () => {
          if (dragSelectedItem) {
            dragPlacements[dragSelectedItem] = t.id;
            dragSelectedItem = null;
            refresh();
          }
        });
        box.addEventListener("dragover", (e) => {
          e.preventDefault();
          box.classList.add("drag-over");
        });
        box.addEventListener("dragleave", () => box.classList.remove("drag-over"));
        box.addEventListener("drop", (e) => {
          e.preventDefault();
          box.classList.remove("drag-over");
          const itemId = e.dataTransfer.getData("text/plain");
          if (itemId) {
            dragPlacements[itemId] = t.id;
            refresh();
          }
        });
        targetsCol.appendChild(box);
      });
      selection = Object.assign({}, dragPlacements);
    }
    refresh();
    wrap.appendChild(itemsCol);
    wrap.appendChild(targetsCol);
    const note = document.createElement("p");
    note.className = "es-note";
    note.style.width = "100%";
    note.textContent =
      "Clique sur un mot puis sur la bonne zone (ou fais un glisser-déposer avec la souris).";
    wrap.appendChild(note);
    return wrap;
  }

  function buildFinalRoom(challenge) {
    const div = document.createElement("div");
    const preview = document.createElement("div");
    preview.className = "room-preview";
    preview.id = "room-preview";
    preview.setAttribute("aria-live", "polite");
    preview.textContent = "🧸🧦📚 (chambre en désordre)";
    div.appendChild(preview);

    const grid = document.createElement("div");
    grid.className = "multi-select-grid";
    challenge.data.actions.forEach((action) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.innerHTML =
        '<span class="option-icon">' + iconMarkup(action.id, action.icon) + "</span><span>" + action.label + "</span>";
      btn.addEventListener("click", () => {
        if (multiSelectDone.has(action.id)) return;
        if (challenge.data.correctIds.indexOf(action.id) !== -1) {
          multiSelectDone.add(action.id);
          btn.classList.add("is-correct");
          btn.disabled = true;
          const pts = Game.awardMicroPoint(action.id, 25);
          AudioModule.sfxCorrect();
          updateHud();
          const wordsFound = multiSelectDone.size;
          preview.textContent = "✨ ".repeat(wordsFound) + " Chambre rangée à " + Math.round((wordsFound / challenge.data.correctIds.length) * 100) + " % (+" + pts + " pts)";
          if (multiSelectDone.size === challenge.data.correctIds.length) {
            preview.textContent = "🛏️✨👕✨ Chambre parfaitement rangée !";
            completeMultiSelectChallenge(challenge);
          }
        } else {
          btn.classList.add("is-incorrect");
          AudioModule.sfxWrong();
          setTimeout(() => btn.classList.remove("is-incorrect"), 500);
        }
      });
      grid.appendChild(btn);
    });
    div.appendChild(grid);
    els.btnSubmit.hidden = true;
    return div;
  }

  function buildFinalCleaning(challenge) {
    const div = document.createElement("div");
    const startTime = Date.now();
    const timerEnabled = Storage.getTeacherSettings().timerEnabled;
    const preview = document.createElement("div");
    preview.className = "room-preview";
    preview.setAttribute("aria-live", "polite");
    preview.textContent = timerEnabled
      ? "🏚️ La maison a besoin d'un grand ménage avant la visite ! ⏱️ Sois rapide pour un bonus."
      : "🏚️ La maison a besoin d'un grand ménage avant la visite !";
    div.appendChild(preview);

    const grid = document.createElement("div");
    grid.className = "multi-select-grid";
    challenge.data.actions.forEach((action) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "option-btn";
      btn.innerHTML =
        '<span class="option-icon">' + iconMarkup(action.id, action.icon) + "</span><span>" + action.label + "</span>";
      btn.addEventListener("click", () => {
        if (multiSelectDone.has(action.id)) return;
        multiSelectDone.add(action.id);
        btn.classList.add("is-correct");
        btn.disabled = true;
        const pts = Game.awardMicroPoint(action.id, 35);
        AudioModule.sfxCorrect();
        updateHud();
        preview.textContent =
          "🏡 Progression : " +
          multiSelectDone.size +
          " / " +
          challenge.data.requiredIds.length +
          " tâches terminées (+" +
          pts +
          " pts)";
        if (multiSelectDone.size === challenge.data.requiredIds.length) {
          let bonusMsg = "";
          if (timerEnabled && Date.now() - startTime < 40000) {
            const bonus = Game.awardMicroPoint(null, 50);
            bonusMsg = " ⏱️ Bonus rapidité : +" + bonus + " pts !";
          }
          preview.textContent = "🏡✨ La maison est prête pour la visite !" + bonusMsg;
          completeMultiSelectChallenge(challenge);
        }
      });
      grid.appendChild(btn);
    });
    div.appendChild(grid);
    els.btnSubmit.hidden = true;
    return div;
  }

  function completeMultiSelectChallenge(challenge) {
    AudioModule.sfxStar();
    const res = Game.submitAnswer(challenge, true, { skipBasePoints: true, skipWordRegistration: true });
    updateHud();
    showFeedbackBlock(true, null, res);
    els.btnNext.hidden = false;
    els.btnSubmit.hidden = true;
  }

  function buildFinalRoutine(challenge) {
    const div = document.createElement("div");
    challenge.data.groups.forEach((group) => {
      routineSelections[group.key] = [];
      const section = document.createElement("div");
      section.className = "teacher-section";
      const h = document.createElement("h3");
      h.textContent = group.label + " (choisis " + group.count + ")";
      section.appendChild(h);
      const chipGroup = document.createElement("div");
      chipGroup.className = "chip-group";
      group.pool.forEach((item) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "chip";
        chip.setAttribute("aria-pressed", "false");
        chip.innerHTML = iconMarkup(item.id, item.icon) + " " + item.label;
        chip.addEventListener("click", () => {
          const list = routineSelections[group.key];
          const idx = list.indexOf(item.id);
          if (idx !== -1) {
            list.splice(idx, 1);
            chip.setAttribute("aria-pressed", "false");
          } else {
            if (list.length >= group.count) return;
            list.push(item.id);
            chip.setAttribute("aria-pressed", "true");
          }
          selection = routineSelections;
        });
        chipGroup.appendChild(chip);
      });
      section.appendChild(chipGroup);
      div.appendChild(section);
    });
    return div;
  }

  function buildMatching(challenge) {
    const wrap = document.createElement("div");
    wrap.className = "dragdrop-wrap";
    const leftCol = document.createElement("div");
    leftCol.className = "dragdrop-items";
    const rightCol = document.createElement("div");
    rightCol.className = "dragdrop-items";

    const note = document.createElement("p");
    note.className = "es-note";
    note.style.width = "100%";
    note.textContent = "Clique sur un verbe à gauche, puis sur son image à droite.";
    wrap.appendChild(note);

    function refresh() {
      leftCol.innerHTML = "";
      challenge.data.left.forEach((item) => {
        const done = multiSelectDone.has(item.id);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "drag-item" + (done ? " is-placed" : "");
        btn.disabled = done;
        btn.setAttribute("aria-pressed", matchingSelectedLeft === item.id ? "true" : "false");
        btn.textContent = item.label;
        btn.addEventListener("click", () => {
          matchingSelectedLeft = matchingSelectedLeft === item.id ? null : item.id;
          refresh();
        });
        leftCol.appendChild(btn);
      });
      rightCol.innerHTML = "";
      challenge.data.right.forEach((item) => {
        const done = multiSelectDone.has(item.id);
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "drag-item" + (done ? " is-placed" : "");
        btn.disabled = done;
        btn.innerHTML = iconMarkup(item.id, item.icon);
        btn.setAttribute("aria-label", "Image");
        btn.addEventListener("click", () => {
          if (!matchingSelectedLeft) return;
          const correctRightId = challenge.data.correctMap[matchingSelectedLeft];
          if (correctRightId === item.id) {
            // El id de izquierda y derecha es la misma palabra: basta con
            // marcarlo una vez para que ambas columnas lo reconozcan.
            multiSelectDone.add(matchingSelectedLeft);
            const pts = Game.awardMicroPoint(matchingSelectedLeft, 30);
            AudioModule.sfxCorrect();
            updateHud();
            showTransientMessage("Bien joué ! +" + pts + " points.");
            matchingSelectedLeft = null;
            refresh();
            const totalPairs = challenge.data.left.length;
            if (multiSelectDone.size >= totalPairs) {
              completeMultiSelectChallenge(challenge);
            }
          } else {
            AudioModule.sfxWrong();
            btn.classList.add("is-incorrect");
            setTimeout(() => btn.classList.remove("is-incorrect"), 400);
          }
        });
        rightCol.appendChild(btn);
      });
    }
    refresh();
    wrap.appendChild(leftCol);
    wrap.appendChild(rightCol);
    els.btnSubmit.hidden = true;
    return wrap;
  }

  // ---------------------------------------------------------------
  // Pistas
  // ---------------------------------------------------------------
  function handleHint() {
    const challenge = Game.getCurrentChallenge();
    if (!challenge) return;
    const result = Game.useHint(challenge);
    let box = els.challengeBody.querySelector(".hint-box");
    if (!box) {
      box = document.createElement("div");
      box.className = "hint-box";
      els.challengeBody.appendChild(box);
    }
    if (result.type === "letter") {
      box.textContent = "💡 Indice : « " + result.content + " » (les lettres manquantes sont cachées).";
    } else if (result.type === "audio") {
      box.innerHTML =
        "💡 Indice : écoute le mot, puis regarde la phrase — <em>" +
        (result.sentence || "") +
        "</em>";
      AudioModule.speak(result.content);
    } else if (result.type === "translation") {
      box.textContent =
        "💡 Indice (traduction) : « " +
        result.content +
        " »" +
        (result.category ? " — catégorie : " + result.category : "");
    } else if (result.type === "reduce") {
      box.textContent = "💡 Indice : il ne reste que deux options possibles.";
      // Re-renderiza las opciones reducidas
      const grid = els.challengeBody.querySelector(".options-grid");
      if (grid && result.content) {
        grid.innerHTML = "";
        result.content.forEach((opt) => {
          const isObj = typeof opt === "object";
          const btn = document.createElement("button");
          btn.type = "button";
          btn.className = "option-btn";
          btn.setAttribute("aria-pressed", "false");
          if (isObj) {
            btn.innerHTML =
              '<span class="option-icon">' + iconMarkup(opt.id, opt.icon) + "</span><span>" + opt.label + "</span>";
          } else {
            btn.textContent = opt;
          }
          btn.addEventListener("click", () => {
            grid.querySelectorAll(".option-btn").forEach((b) => b.setAttribute("aria-pressed", "false"));
            btn.setAttribute("aria-pressed", "true");
            selection = isObj ? opt.id : opt;
          });
          grid.appendChild(btn);
        });
      }
    } else {
      box.textContent = "Plus d'indices disponibles pour cette question.";
    }
    if (result.stage >= 4) els.btnHint.disabled = true;
  }

  // ---------------------------------------------------------------
  // Envío de respuestas
  // ---------------------------------------------------------------
  function evaluateAnswer(challenge) {
    switch (challenge.type) {
      case "image-word":
        return { correct: selection === challenge.data.correctAnswer };
      case "listen-image":
      case "what-need":
      case "find-error":
      case "situation-choice":
        return { correct: selection === challenge.data.correctId };
      case "fill-blank":
      case "write-verb": {
        if (!selection) return { correct: false };
        const check = Game.checkTypedAnswer(selection, challenge.data.acceptedAnswers);
        return { correct: check.correct, accentIssue: check.accentIssue, correctForm: check.correctForm };
      }
      case "sequence":
      case "final-sequence":
      case "final-timeline": {
        const orders = challenge.data.correctOrders;
        const arr = sequenceOrder;
        const ok = orders.some((order) => order.length === arr.length && order.every((id, i) => id === arr[i]));
        return { correct: ok };
      }
      case "drag-drop": {
        const map = challenge.data.correctMap;
        const ids = Object.keys(map);
        const allPlaced = ids.every((id) => dragPlacements[id]);
        const ok = allPlaced && ids.every((id) => dragPlacements[id] === map[id]);
        return { correct: ok };
      }
      case "final-routine": {
        const ok = challenge.data.groups.every((g) => routineSelections[g.key].length === g.count);
        return { correct: ok, isRoutine: true };
      }
      default:
        return { correct: false };
    }
  }

  function handleSubmit() {
    const challenge = Game.getCurrentChallenge();
    if (!challenge) return;

    if (challenge.type === "final-routine") {
      const evalRes = evaluateAnswer(challenge);
      if (!evalRes.correct) {
        showTransientMessage("Choisis le bon nombre d'actions dans chaque catégorie avant de continuer.");
        return;
      }
      const text = buildRoutineText(challenge);
      const wordIds = Object.values(routineSelections).reduce((a, b) => a.concat(b), []);
      const res = Game.submitAnswer(Object.assign({}, challenge, { wordIds }), true, {});
      updateHud();
      showRoutineResult(text, res);
      return;
    }

    const evalRes = evaluateAnswer(challenge);
    handleAnswerResult(challenge, evalRes);
  }

  function handleAnswerResult(challenge, evalRes) {
    const isRepeatAttempt = Game.getSessionState().attempt > 1;
    const res = Game.submitAnswer(challenge, evalRes.correct, { isRepeatAttempt });
    updateHud();

    if (evalRes.correct) {
      markOptionsCorrectness(challenge, true);
      AudioModule.sfxCorrect();
      if (res.milestoneBonus) AudioModule.sfxCombo();
      showFeedbackBlock(true, evalRes, res);
      const word = currentPrimaryWord(challenge);
      if (word) AudioModule.speak(word.infinitive);
      els.btnSubmit.hidden = true;
      els.btnNext.hidden = false;
      els.btnNext.focus();
    } else {
      AudioModule.sfxWrong();
      const attempt = Game.getSessionState().attempt;
      if (attempt <= 2) {
        markOptionsCorrectness(challenge, false);
        showFeedbackBlock(false, evalRes, res, false);
      } else {
        // Se revela la respuesta tras dos intentos para no bloquear al estudiante.
        markOptionsCorrectness(challenge, false, true);
        showFeedbackBlock(false, evalRes, res, true);
        const word = currentPrimaryWord(challenge);
        if (word) AudioModule.speak(word.infinitive);
        els.btnSubmit.hidden = true;
        els.btnNext.hidden = false;
        els.btnNext.focus();
      }
    }

    if (challenge.speedRound) {
      clearSpeedTimer();
      els.btnSubmit.hidden = true;
      els.btnNext.hidden = false;
    }
  }

  function markOptionsCorrectness(challenge, correct, reveal) {
    const grid = els.challengeBody.querySelector(".options-grid");
    if (!grid) return;
    const buttons = grid.querySelectorAll(".option-btn");
    buttons.forEach((b) => (b.disabled = true));
    const selectedBtn = grid.querySelector('.option-btn[aria-pressed="true"]');
    if (selectedBtn) selectedBtn.classList.add(correct ? "is-correct" : "is-incorrect");
    if (!correct && reveal) {
      buttons.forEach((b) => {
        // marca la correcta si podemos identificarla por texto
      });
    }
    if (!correct && !reveal) {
      buttons.forEach((b) => (b.disabled = false));
      if (selectedBtn) selectedBtn.setAttribute("aria-pressed", "false");
    }
  }

  function showFeedbackBlock(correct, evalRes, res, revealedAnswer) {
    const challenge = Game.getCurrentChallenge();
    const word = currentPrimaryWord(challenge);
    els.feedbackPanel.hidden = false;
    els.feedbackPanel.className = "feedback-panel feedback-panel--" + (correct ? "correct" : "incorrect");
    let html = "";
    if (correct) {
      const phrase = FEEDBACK.correct[Math.floor(Math.random() * FEEDBACK.correct.length)];
      if (evalRes && evalRes.accentIssue) {
        html += "<p>" + phrase + " Attention aux accents : <strong>" + evalRes.correctForm + "</strong></p>";
      } else {
        html += "<p>" + phrase + "</p>";
      }
      if (word) html += "<p>" + word.example + "</p>";
      let pointsLine = "+" + res.pointsEarned + " points";
      if (res.milestoneBonus) pointsLine += " (+" + res.milestoneBonus + " bonus série de 5 !)";
      if (res.comboMultiplier > 1) pointsLine += " · Combo x" + res.comboMultiplier;
      html += "<p>" + pointsLine + "</p>";
      announce(phrase);
    } else {
      const phrase = FEEDBACK.incorrect[Math.floor(Math.random() * FEEDBACK.incorrect.length)];
      html += "<p>" + phrase + "</p>";
      if (revealedAnswer && word) {
        html +=
          "<p>Voici la bonne réponse : <strong>" +
          word.infinitive +
          "</strong> (" +
          word.translation +
          ")</p><p>" +
          word.example +
          "</p>";
      }
      announce(phrase);
    }
    els.feedbackPanel.innerHTML = html;
  }

  function showTransientMessage(text) {
    els.feedbackPanel.hidden = false;
    els.feedbackPanel.className = "feedback-panel";
    els.feedbackPanel.innerHTML = "<p>" + text + "</p>";
  }

  function buildRoutineText(challenge) {
    const parts = [];
    challenge.data.groups.forEach((g) => {
      routineSelections[g.key].forEach((id) => {
        const w = Game.byId(id);
        parts.push(w.firstPerson.charAt(0).toUpperCase() + w.firstPerson.slice(1));
      });
    });
    return parts.join(". ") + ".";
  }

  function showRoutineResult(text, res) {
    els.feedbackPanel.hidden = false;
    els.feedbackPanel.className = "feedback-panel feedback-panel--correct";
    els.feedbackPanel.innerHTML =
      "<p>Bravo ! Voici ta journée parfaite :</p><p><em>" + text + "</em></p><p>+" + res.pointsEarned + " points</p>";
    AudioModule.speak(text);
    AudioModule.sfxStar();
    els.btnSubmit.hidden = true;
    els.btnNext.hidden = false;
    els.btnNext.focus();
  }

  // ---------------------------------------------------------------
  // Misión rápida (temporizador visual, no bloqueante)
  // ---------------------------------------------------------------
  function startSpeedTimer(challenge) {
    let box = els.challengeBody.querySelector(".hint-box");
    const bar = document.createElement("div");
    bar.className = "progress-bar";
    bar.style.marginTop = "1rem";
    const fill = document.createElement("div");
    fill.className = "progress-bar-fill";
    fill.style.width = "100%";
    fill.style.transition = "width " + challenge.timeLimit + "s linear";
    bar.appendChild(fill);
    els.challengeBody.appendChild(bar);
    requestAnimationFrame(() => {
      fill.style.width = "0%";
    });
    speedTimer = setTimeout(() => {
      if (!selection) {
        handleAnswerResult(challenge, { correct: false });
      }
    }, challenge.timeLimit * 1000);
  }

  function clearSpeedTimer() {
    if (speedTimer) {
      clearTimeout(speedTimer);
      speedTimer = null;
    }
  }

  // ---------------------------------------------------------------
  // Avance / finalización
  // ---------------------------------------------------------------
  function handleNext() {
    Game.goToNextChallenge();
    renderCurrentChallenge();
  }

  function finishCurrentLevel() {
    const result = Game.finishLevel();
    renderResults(result);
    showScreen("screen-results");
  }

  function renderResults(result) {
    els.resultsStars.textContent = "⭐".repeat(result.stars) + "☆".repeat(3 - result.stars);
    els.resultsStarsText.textContent =
      result.stars + " / 3 étoiles — Précision : " + result.accuracy + " %";
    els.resultsScore.textContent = result.score;
    els.resultsAccuracy.textContent = result.accuracy + " %";
    els.resultsCombo.textContent = "x" + result.bestCombo;
    els.resultsMastered.textContent = result.masteredWords;

    if (result.practiceWords.length) {
      els.resultsPractice.innerHTML =
        "<strong>Mots à pratiquer :</strong> " +
        result.practiceWords.map((w) => w.icon + " " + w.infinitive).join(", ");
    } else {
      els.resultsPractice.innerHTML = "<strong>Bravo, aucun mot à revoir pour l'instant !</strong>";
    }

    els.btnNextLevel.hidden = result.isCustom || result.level >= 5 || result.stars === 0;
    els.btnNextLevel.dataset.nextLevel = result.isCustom ? "" : String(Number(result.level) + 1);
    els.btnReplay.dataset.level = String(result.level);
  }

  // ---------------------------------------------------------------
  // Modo profesor
  // ---------------------------------------------------------------
  function renderTeacherPanel() {
    const ts = Storage.getTeacherSettings();
    els.teacherLevels.innerHTML = "";
    [1, 2, 3, 4, 5].forEach((lvl) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = "Niveau " + lvl;
      chip.setAttribute("aria-pressed", ts.levelsEnabled.indexOf(lvl) !== -1 ? "true" : "false");
      chip.addEventListener("click", () => {
        const enabled = ts.levelsEnabled.indexOf(lvl) !== -1;
        if (enabled) ts.levelsEnabled = ts.levelsEnabled.filter((l) => l !== lvl);
        else ts.levelsEnabled.push(lvl);
        chip.setAttribute("aria-pressed", String(!enabled));
        Storage.updateTeacherSettings({ levelsEnabled: ts.levelsEnabled });
      });
      els.teacherLevels.appendChild(chip);
    });

    const catLabels = {
      matin: "Matin",
      journee: "Journée",
      maison: "Chambre/Cuisine",
      menage: "Ménage",
      objet: "Objets",
      idiomatique: "Expressions"
    };
    els.teacherCategories.innerHTML = "";
    Object.keys(catLabels).forEach((cat) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip";
      chip.textContent = catLabels[cat];
      chip.setAttribute("aria-pressed", ts.categories.indexOf(cat) !== -1 ? "true" : "false");
      chip.addEventListener("click", () => {
        const enabled = ts.categories.indexOf(cat) !== -1;
        if (enabled) ts.categories = ts.categories.filter((c) => c !== cat);
        else ts.categories.push(cat);
        chip.setAttribute("aria-pressed", String(!enabled));
        Storage.updateTeacherSettings({ categories: ts.categories });
      });
      els.teacherCategories.appendChild(chip);
    });

    els.teacherTimer.checked = ts.timerEnabled;
    els.teacherQuestionCount.value = ts.questionCount;
    els.teacherOnlyMenage.checked = ts.onlyMenage;
    els.teacherOnlyPronominaux.checked = ts.onlyPronominaux;

    els.teacherMasteredSummary.textContent = "Mots maîtrisés : " + Storage.getMasteredCount() + " / " + VOCABULARY.length;
    els.teacherPracticeSummary.textContent = "Mots à pratiquer : " + Storage.getWordsNeedingPractice().length;
  }

  // ---------------------------------------------------------------
  // Configuración
  // ---------------------------------------------------------------
  function renderSettingsModal() {
    const s = Storage.getSettings();
    els.toggleSfx.checked = s.sfxOn;
    els.toggleVoice.checked = s.voiceOn;
    els.toggleTextsize.checked = document.documentElement.getAttribute("data-textsize") === "large";
  }

  function showAudioWarning(noFrenchVoice) {
    els.audioWarning.hidden = false;
    els.audioWarning.querySelector("span").textContent = noFrenchVoice
      ? "⚠️ Aucune voix française n'a été trouvée sur cet appareil. Le jeu continue de fonctionner sans prononciation audio."
      : "⚠️ La synthèse vocale n'est pas disponible sur ce navigateur. Le jeu continue de fonctionner normalement.";
  }

  // ---------------------------------------------------------------
  // Eventos
  // ---------------------------------------------------------------
  function bindEvents() {
    els.btnPlay.addEventListener("click", () => {
      showScreen("screen-map");
      renderMap();
    });
    els.btnContinue.addEventListener("click", () => {
      const unlocked = Storage.getState().progress.unlockedLevels;
      const target = Math.max(...unlocked);
      startLevelFlow(target);
    });
    els.btnSettings.addEventListener("click", () => {
      renderSettingsModal();
      openModal("modal-settings");
    });
    els.btnMapSettings.addEventListener("click", () => {
      renderSettingsModal();
      openModal("modal-settings");
    });
    els.btnTeacherMode.addEventListener("click", () => {
      renderTeacherPanel();
      openModal("modal-teacher");
    });
    els.selectInstructionLang.addEventListener("change", (e) => {
      Storage.updateSettings({ instructionLang: e.target.value });
    });
    els.btnEraseProgress.addEventListener("click", () => openModal("modal-confirm-reset"));
    els.btnCancelReset.addEventListener("click", () => closeModal("modal-confirm-reset"));
    els.btnConfirmReset.addEventListener("click", () => {
      Storage.resetProgress();
      closeModal("modal-confirm-reset");
      showScreen("screen-start");
      renderStart();
      announce("La progression a été effacée.");
    });

    els.btnMapBack.addEventListener("click", () => {
      showScreen("screen-start");
      renderStart();
    });

    els.btnPause.addEventListener("click", () => openModal("modal-pause"));
    els.btnResume.addEventListener("click", () => closeModal("modal-pause"));
    els.btnPauseSettings.addEventListener("click", () => {
      renderSettingsModal();
      openModal("modal-settings");
    });
    els.btnPauseQuit.addEventListener("click", () => {
      closeModal("modal-pause");
      clearSpeedTimer();
      showScreen("screen-map");
      renderMap();
    });

    els.btnCloseSettings.addEventListener("click", () => closeModal("modal-settings"));
    els.toggleSfx.addEventListener("change", (e) => AudioModule.setSfxEnabled(e.target.checked));
    els.toggleVoice.addEventListener("change", (e) => AudioModule.setVoiceEnabled(e.target.checked));
    els.toggleTextsize.addEventListener("change", (e) => {
      document.documentElement.setAttribute("data-textsize", e.target.checked ? "large" : "normal");
    });

    els.btnHint.addEventListener("click", handleHint);
    els.btnSubmit.addEventListener("click", handleSubmit);
    els.btnNext.addEventListener("click", handleNext);
    els.btnTranslate.addEventListener("click", () => {
      const nowHidden = !els.instructionTranslation.hidden;
      els.instructionTranslation.hidden = nowHidden;
      els.btnTranslate.setAttribute("aria-pressed", String(!nowHidden));
    });
    els.btnPlayAudio.addEventListener("click", () => {
      const challenge = Game.getCurrentChallenge();
      if (!challenge) return;
      const word = currentPrimaryWord(challenge);
      AudioModule.speak(word ? word.infinitive : els.challengeInstruction.textContent);
    });

    els.btnReplay.addEventListener("click", () => {
      const level = els.btnReplay.dataset.level;
      if (level === "custom") {
        startCustomFlow(Storage.getTeacherSettings());
      } else {
        startLevelFlow(Number(level));
      }
    });
    els.btnNextLevel.addEventListener("click", () => {
      const next = Number(els.btnNextLevel.dataset.nextLevel);
      if (next) startLevelFlow(next);
    });
    els.btnBackToMap.addEventListener("click", () => {
      showScreen("screen-map");
      renderMap();
    });

    els.btnTeacherClose.addEventListener("click", () => closeModal("modal-teacher"));
    els.btnTeacherReset.addEventListener("click", () => openModal("modal-confirm-reset"));
    els.teacherTimer.addEventListener("change", (e) => Storage.updateTeacherSettings({ timerEnabled: e.target.checked }));
    els.teacherQuestionCount.addEventListener("change", (e) => {
      const v = Math.max(8, Math.min(12, Number(e.target.value) || 9));
      e.target.value = v;
      Storage.updateTeacherSettings({ questionCount: v });
    });
    els.teacherOnlyMenage.addEventListener("change", (e) => Storage.updateTeacherSettings({ onlyMenage: e.target.checked }));
    els.teacherOnlyPronominaux.addEventListener("change", (e) =>
      Storage.updateTeacherSettings({ onlyPronominaux: e.target.checked })
    );
    els.btnTeacherStart.addEventListener("click", () => {
      closeModal("modal-teacher");
      startCustomFlow(Storage.getTeacherSettings());
    });

    els.btnCloseAudioWarning.addEventListener("click", () => {
      els.audioWarning.hidden = true;
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        ["modal-settings", "modal-pause", "modal-confirm-reset", "modal-teacher"].forEach((id) => {
          if (!$(id).hidden) closeModal(id);
        });
      }
    });
  }

  function init() {
    cacheEls();
    bindEvents();
    const settings = Storage.getSettings();
    document.documentElement.setAttribute("data-textsize", "normal");
    renderStart();
    showScreen("screen-start");
  }

  return { init, showScreen, renderMap, renderStart, showAudioWarning };
})();

window.UI = UI;
