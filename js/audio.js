/*
 * Routine Rush — Audio
 * ---------------------------------------------------------------
 * Tres canales independientes:
 *   - pronunciation: window.speechSynthesis (voz francesa si existe)
 *   - sfx: pequeños efectos generados con WebAudio (sin archivos externos)
 *   - music: fondo ambiental muy suave generado con WebAudio
 * Todo funciona sin conexión y sin archivos de audio con derechos de autor.
 */

const AudioModule = (function () {
  let frenchVoice = null;
  let voicesReady = false;
  let warnedNoVoice = false;
  let ctx = null;
  let musicNodes = null;

  function ensureContext() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) ctx = new AC();
    }
    if (ctx && ctx.state === "suspended") {
      ctx.resume().catch(() => {});
    }
    return ctx;
  }

  function pickFrenchVoice() {
    if (!("speechSynthesis" in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;
    frenchVoice =
      voices.find((v) => v.lang && v.lang.toLowerCase().startsWith("fr")) || null;
    voicesReady = true;
  }

  if ("speechSynthesis" in window) {
    pickFrenchVoice();
    window.speechSynthesis.onvoiceschanged = pickFrenchVoice;
  }

  function speak(text, onEnd) {
    const settings = window.Storage.getSettings();
    if (!settings.voiceOn) {
      if (onEnd) onEnd();
      return { ok: true, skipped: true };
    }
    if (!("speechSynthesis" in window)) {
      if (!warnedNoVoice) {
        warnedNoVoice = true;
        UI && UI.showAudioWarning && UI.showAudioWarning();
      }
      if (onEnd) onEnd();
      return { ok: false, reason: "unsupported" };
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = "fr-FR";
      if (frenchVoice) utter.voice = frenchVoice;
      utter.rate = 0.92;
      if (onEnd) utter.onend = onEnd;
      window.speechSynthesis.speak(utter);
      if (!frenchVoice && !warnedNoVoice) {
        warnedNoVoice = true;
        UI && UI.showAudioWarning && UI.showAudioWarning(true);
      }
      return { ok: true };
    } catch (e) {
      if (onEnd) onEnd();
      return { ok: false, reason: "error" };
    }
  }

  function tone(freq, duration, type, volume) {
    const settings = window.Storage.getSettings();
    if (!settings.sfxOn) return;
    const c = ensureContext();
    if (!c) return;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type || "sine";
    osc.frequency.value = freq;
    gain.gain.value = 0;
    osc.connect(gain);
    gain.connect(c.destination);
    const now = c.currentTime;
    gain.gain.linearRampToValueAtTime(volume || 0.08, now + 0.02);
    gain.gain.linearRampToValueAtTime(0, now + duration);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  function sfxCorrect() {
    tone(523.25, 0.12, "sine", 0.09);
    setTimeout(() => tone(783.99, 0.16, "sine", 0.09), 100);
  }

  function sfxWrong() {
    tone(220, 0.18, "sawtooth", 0.06);
  }

  function sfxClick() {
    tone(400, 0.05, "square", 0.04);
  }

  function sfxStar() {
    [659.25, 783.99, 987.77].forEach((f, i) => {
      setTimeout(() => tone(f, 0.15, "sine", 0.08), i * 90);
    });
  }

  function sfxCombo() {
    tone(880, 0.1, "triangle", 0.08);
  }

  function startMusic() {
    const settings = window.Storage.getSettings();
    if (!settings.musicOn) return;
    const c = ensureContext();
    if (!c || musicNodes) return;
    const gain = c.createGain();
    gain.gain.value = 0.025;
    gain.connect(c.destination);
    const notes = [261.63, 329.63, 392.0, 329.63];
    let step = 0;
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = notes[0];
    osc.connect(gain);
    osc.start();
    const interval = setInterval(() => {
      if (!ctx) return;
      step = (step + 1) % notes.length;
      osc.frequency.linearRampToValueAtTime(notes[step], ctx.currentTime + 0.4);
    }, 1400);
    musicNodes = { osc, gain, interval };
  }

  function stopMusic() {
    if (!musicNodes) return;
    clearInterval(musicNodes.interval);
    try {
      musicNodes.osc.stop();
    } catch (e) {
      /* noop */
    }
    musicNodes = null;
  }

  function setMusicEnabled(enabled) {
    window.Storage.updateSettings({ musicOn: enabled });
    if (enabled) startMusic();
    else stopMusic();
  }

  function setSfxEnabled(enabled) {
    window.Storage.updateSettings({ sfxOn: enabled });
  }

  function setVoiceEnabled(enabled) {
    window.Storage.updateSettings({ voiceOn: enabled });
    if (!enabled && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }

  function hasFrenchVoice() {
    return !!frenchVoice;
  }

  return {
    speak,
    sfxCorrect,
    sfxWrong,
    sfxClick,
    sfxStar,
    sfxCombo,
    startMusic,
    stopMusic,
    setMusicEnabled,
    setSfxEnabled,
    setVoiceEnabled,
    hasFrenchVoice,
    ensureContext
  };
})();

window.AudioModule = AudioModule;
