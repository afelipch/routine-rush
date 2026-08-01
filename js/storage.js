/*
 * Routine Rush — Almacenamiento local
 * ---------------------------------------------------------------
 * Toda la persistencia del juego pasa por este archivo. Se usa
 * exclusivamente localStorage del navegador. No se envía ningún
 * dato a servidores externos y no se recopila información personal.
 */

const Storage = (function () {
  const KEY = "routineRush.v1";

  function defaultState() {
    return {
      settings: {
        musicOn: true,
        sfxOn: true,
        voiceOn: true,
        instructionLang: "fr" // "fr" | "es"
      },
      teacherSettings: {
        levelsEnabled: [1, 2, 3, 4, 5],
        categories: ["matin", "journee", "maison", "menage", "objet"],
        timerEnabled: true,
        questionCount: 10,
        onlyMenage: false,
        onlyPronominaux: false
      },
      progress: {
        unlockedLevels: [1],
        levels: {
          // "1": { stars, bestScore, bestAccuracy, bestCombo, attempts }
        },
        totalXP: 0,
        totalCorrect: 0,
        totalWrong: 0
      },
      vocabState: {
        // id: { status, correctCount, wrongCount, lastSeenRound }
      }
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      // Combina con los valores por defecto por si el esquema creció.
      const def = defaultState();
      return {
        settings: Object.assign({}, def.settings, parsed.settings),
        teacherSettings: Object.assign({}, def.teacherSettings, parsed.teacherSettings),
        progress: Object.assign({}, def.progress, parsed.progress, {
          levels: Object.assign({}, def.progress.levels, parsed.progress ? parsed.progress.levels : {})
        }),
        vocabState: Object.assign({}, parsed.vocabState)
      };
    } catch (e) {
      console.warn("Routine Rush: impossible de lire la progression, réinitialisation.", e);
      return defaultState();
    }
  }

  let state = load();
  let saveTimeout = null;

  window.addEventListener("beforeunload", () => {
    if (saveTimeout) {
      clearTimeout(saveTimeout);
      persist();
    }
  });

  function persist() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Routine Rush: impossible d'enregistrer la progression.", e);
    }
  }

  function persistSoon() {
    if (saveTimeout) clearTimeout(saveTimeout);
    saveTimeout = setTimeout(persist, 150);
  }

  return {
    getState() {
      return state;
    },

    getSettings() {
      return state.settings;
    },

    updateSettings(patch) {
      state.settings = Object.assign({}, state.settings, patch);
      persistSoon();
    },

    getTeacherSettings() {
      return state.teacherSettings;
    },

    updateTeacherSettings(patch) {
      state.teacherSettings = Object.assign({}, state.teacherSettings, patch);
      persistSoon();
    },

    isLevelUnlocked(level) {
      return state.progress.unlockedLevels.indexOf(level) !== -1;
    },

    unlockLevel(level) {
      if (state.progress.unlockedLevels.indexOf(level) === -1) {
        state.progress.unlockedLevels.push(level);
        persistSoon();
      }
    },

    getLevelProgress(level) {
      return (
        state.progress.levels[level] || {
          stars: 0,
          bestScore: 0,
          bestAccuracy: 0,
          bestCombo: 0,
          attempts: 0
        }
      );
    },

    saveLevelResult(level, result) {
      const current = this.getLevelProgress(level);
      const updated = {
        stars: Math.max(current.stars, result.stars),
        bestScore: Math.max(current.bestScore, result.score),
        bestAccuracy: Math.max(current.bestAccuracy, result.accuracy),
        bestCombo: Math.max(current.bestCombo, result.bestCombo),
        attempts: current.attempts + 1
      };
      state.progress.levels[level] = updated;
      state.progress.totalXP += result.score;
      state.progress.totalCorrect += result.correctCount;
      state.progress.totalWrong += result.wrongCount;
      if (result.stars >= 1 && level < 5) {
        this.unlockLevel(level + 1);
      }
      persistSoon();
      return updated;
    },

    getTotalXP() {
      return state.progress.totalXP;
    },

    addPracticeResult(result) {
      state.progress.totalXP += result.score;
      state.progress.totalCorrect += result.correctCount;
      state.progress.totalWrong += result.wrongCount;
      persistSoon();
    },

    getGlobalStats() {
      return {
        totalCorrect: state.progress.totalCorrect,
        totalWrong: state.progress.totalWrong
      };
    },

    // ---- Dominio del vocabulario ----
    getWordState(id) {
      return (
        state.vocabState[id] || {
          status: "nouvelle", // nouvelle | en_apprentissage | a_pratiquer | maitrisee
          correctCount: 0,
          wrongCount: 0,
          distinctCorrectMoments: 0,
          lastResult: null
        }
      );
    },

    registerAnswer(id, correct) {
      const w = this.getWordState(id);
      if (correct) {
        w.correctCount += 1;
        if (w.lastResult !== "correct-same-moment") {
          w.distinctCorrectMoments += 1;
        }
        w.lastResult = "correct-same-moment";
        if (w.distinctCorrectMoments >= 3) {
          w.status = "maitrisee";
        } else if (w.distinctCorrectMoments >= 1) {
          w.status = "en_apprentissage";
        }
      } else {
        w.wrongCount += 1;
        w.lastResult = "wrong";
        w.status = w.status === "maitrisee" ? "a_pratiquer" : "a_pratiquer";
      }
      state.vocabState[id] = w;
      persistSoon();
      return w;
    },

    getAllVocabState() {
      return state.vocabState;
    },

    getMasteredCount() {
      return Object.values(state.vocabState).filter((w) => w.status === "maitrisee").length;
    },

    getWordsNeedingPractice() {
      return Object.keys(state.vocabState).filter((id) => {
        const s = state.vocabState[id];
        return s.status === "a_pratiquer" || s.status === "en_apprentissage";
      });
    },

    // ---- Borrado de progreso ----
    resetProgress() {
      state = defaultState();
      persist();
    },

    resetAll() {
      state = defaultState();
      persist();
    }
  };
})();

window.Storage = Storage;
