(() => {
  const FIGARO_URL = "https://upload.wikimedia.org/wikipedia/commons/e/e2/Mozart%2C_The_Marriage_of_Figaro_%28overture%29.ogg";
  let soundEnabled = true;
  let figaro = null;
  let uiContext = null;
  let musicStarted = false;
  let synthFinished = false;
  let lastHoverTarget = null;
  let buttonBound = false;

  const ensureUiContext = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    uiContext ||= new AudioContextClass();
    if (uiContext.state === "suspended") uiContext.resume().catch(() => {});
    return uiContext;
  };

  const playUiSound = (kind) => {
    if (!soundEnabled) return;
    const context = ensureUiContext();
    if (!context) return;

    const osc = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    const click = kind === "click";

    osc.type = click ? "square" : "triangle";
    osc.frequency.setValueAtTime(click ? 720 : 520, now);
    osc.frequency.exponentialRampToValueAtTime(
      click ? 1250 : 980,
      now + (click ? 0.075 : 0.07)
    );

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(
      click ? 0.28 : 0.22,
      now + 0.008
    );
    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      now + (click ? 0.16 : 0.13)
    );

    // UI sounds play independently and do not duck Mozart.
    osc.connect(gain).connect(context.destination);
    osc.start(now);
    osc.stop(now + 0.18);
  };

  const startFigaro = () => {
    if (!figaro || !soundEnabled || !synthFinished || musicStarted) return;
    const attempt = figaro.play();
    if (!attempt) return;
    attempt.then(() => {
      musicStarted = true;
    }).catch(() => {
      musicStarted = false;
    });
  };

  const pauseMusic = () => {
    if (!figaro) return;
    figaro.pause();
    musicStarted = false;
  };

  const setupAudio = () => {
    if (!figaro) {
      figaro = document.createElement("audio");
      figaro.src = FIGARO_URL;
      figaro.preload = "auto";
      figaro.loop = true;
      figaro.volume = 0.22;
      figaro.setAttribute("aria-hidden", "true");
      figaro.style.display = "none";
      document.body.appendChild(figaro);
    }

    const button = document.querySelector('.flight-nav button[aria-label="Toggle Interface Sound"]');
    if (button && !buttonBound) {
      buttonBound = true;
      button.addEventListener("click", () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
          ensureUiContext();
          startFigaro();
        } else {
          pauseMusic();
        }
      });
    }

    if (!window.__portfolioAudioEventsBound) {
      window.__portfolioAudioEventsBound = true;

      // The synth track must finish first. Only then is Mozart allowed to start.
      window.addEventListener("portfolio:synth-finished", () => {
        synthFinished = true;
        startFigaro();
      });

      // These gestures only unlock audio; they do NOT start Mozart before the synth.
      const unlockAudio = () => {
        if (!soundEnabled) return;
        ensureUiContext();
        if (synthFinished) startFigaro();
      };

      window.addEventListener("wheel", unlockAudio, { passive: true });
      window.addEventListener("scroll", unlockAudio, { passive: true });
      window.addEventListener("touchmove", unlockAudio, { passive: true });
      window.addEventListener("touchstart", unlockAudio, { passive: true });
      window.addEventListener("pointerdown", unlockAudio, { passive: true });
      window.addEventListener("keydown", unlockAudio);

      document.addEventListener("pointerover", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const interactive = target.closest(
          "a, button, summary, .photo-tile, .project-card, .experience-card, .signal-grid article, .interest-grid article, .engine-panel"
        );
        if (!interactive || interactive === lastHoverTarget) return;
        lastHoverTarget = interactive;
        playUiSound("hover");
      }, true);

      document.addEventListener("pointerout", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        const interactive = target.closest(
          "a, button, summary, .photo-tile, .project-card, .experience-card, .signal-grid article, .interest-grid article, .engine-panel"
        );
        if (interactive === lastHoverTarget) lastHoverTarget = null;
      }, true);

      document.addEventListener("click", (event) => {
        const target = event.target;
        if (!(target instanceof Element)) return;
        if (target.closest("a, button, summary, .photo-tile, .project-card, .engine-panel")) {
          playUiSound("click");
        }
      }, true);
    }

    ensureUiContext();
    // Deliberately do not call startFigaro() here.
  };

  setup();
})();