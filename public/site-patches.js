(() => {
  const FIGARO_URL = "https://upload.wikimedia.org/wikipedia/commons/e/e2/Mozart%2C_The_Marriage_of_Figaro_%28overture%29.ogg";
  let soundEnabled = true;
  let figaro = null;
  let uiContext = null;
  let lastHoverTarget = null;
  let musicStarted = false;

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
    osc.frequency.setValueAtTime(click ? 760 : 430, now);
    osc.frequency.exponentialRampToValueAtTime(click ? 1120 : 680, now + (click ? 0.055 : 0.045));
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(click ? 0.05 : 0.026, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (click ? 0.09 : 0.065));
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start(now);
    osc.stop(now + 0.1);
  };

  const startMusic = () => {
    if (!figaro || !soundEnabled || musicStarted) return;
    musicStarted = true;
    figaro.play().catch(() => {
      musicStarted = false;
    });
  };

  const pauseMusic = () => {
    if (!figaro) return;
    figaro.pause();
    musicStarted = false;
  };

  const setupAudio = () => {
    const button = document.querySelector('.flight-nav button[aria-label="Toggle Interface Sound"]');
    if (!button || button.dataset.audioPatchBound === "true") return;

    button.dataset.audioPatchBound = "true";

    figaro = document.createElement("audio");
    figaro.src = FIGARO_URL;
    figaro.preload = "auto";
    figaro.loop = true;
    figaro.volume = 0.2;
    figaro.setAttribute("aria-hidden", "true");
    figaro.style.display = "none";
    document.body.appendChild(figaro);

    const unlockAudio = () => {
      if (!soundEnabled) return;
      ensureUiContext();
      startMusic();
    };

    button.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        ensureUiContext();
        startMusic();
      } else {
        pauseMusic();
      }
    });

    figaro.addEventListener("ended", () => {
      musicStarted = false;
      startMusic();
    });

    window.addEventListener("portfolio:synth-finished", startMusic);
    window.addEventListener("pointerdown", unlockAudio, { passive: true });
    window.addEventListener("keydown", unlockAudio);
    window.addEventListener("touchstart", unlockAudio, { passive: true });

    document.addEventListener("pointerover", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest("a, button, summary, .project-card, .experience-card, .signal-grid article, .interest-grid article, .engine-panel");
      if (!interactive || interactive === lastHoverTarget) return;
      lastHoverTarget = interactive;
      playUiSound("hover");
    }, true);

    document.addEventListener("pointerout", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest("a, button, summary, .project-card, .experience-card, .signal-grid article, .interest-grid article, .engine-panel");
      if (interactive === lastHoverTarget) lastHoverTarget = null;
    }, true);

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("a, button, summary, .photo-tile, .project-card, .engine-panel")) {
        playUiSound("click");
        unlockAudio();
      }
    }, true);

    // Try to start immediately; browsers may require the first user gesture.
    startMusic();
  };

  const patchResponsiveSignals = () => {
    document.querySelectorAll(".signal-grid img").forEach((img) => {
      img.style.height = "auto";
      img.style.width = "100%";
      img.style.maxHeight = "18rem";
      img.style.objectFit = "contain";
      img.style.objectPosition = "center";
      img.style.display = "block";
    });
  };

  const setup = () => {
    setupAudio();
    patchResponsiveSignals();
  };

  const observer = new MutationObserver(setup);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener("load", setup, { once: true });
  window.setInterval(setup, 1000);
})();