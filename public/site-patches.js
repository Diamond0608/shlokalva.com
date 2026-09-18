(() => {
  const FIGARO_URL = "https://upload.wikimedia.org/wikipedia/commons/e/e2/Mozart%2C_The_Marriage_of_Figaro_%28overture%29.ogg";
  let soundEnabled = true;
  let figaro = null;
  let uiContext = null;
  let lastHoverTarget = null;
  let musicStarted = false;
  let musicReady = false;

  const ensureUiContext = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    uiContext ||= new AudioContextClass();
    if (uiContext.state === "suspended") uiContext.resume().catch(() => {});
    return uiContext;
  };

  const duckMusic = (duration = 150) => {
    if (!figaro || figaro.paused) return;
    const original = figaro.volume;
    figaro.volume = Math.min(original, 0.07);
    window.setTimeout(() => {
      if (figaro) figaro.volume = original;
    }, duration);
  };

  const playUiSound = (kind) => {
    if (!soundEnabled) return;
    const context = ensureUiContext();
    if (!context) return;

    duckMusic(kind === "click" ? 190 : 130);

    const osc = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    const click = kind === "click";

    osc.type = click ? "square" : "triangle";
    osc.frequency.setValueAtTime(click ? 680 : 390, now);
    osc.frequency.exponentialRampToValueAtTime(click ? 1080 : 760, now + (click ? 0.07 : 0.055));
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(click ? 0.12 : 0.065, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (click ? 0.13 : 0.09));
    osc.connect(gain).connect(context.destination);
    osc.start(now);
    osc.stop(now + 0.14);
  };

  const startMusic = () => {
    if (!figaro || !soundEnabled || musicStarted) return;
    musicStarted = true;
    figaro.play().then(() => {
      musicReady = true;
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
    const button = document.querySelector('.flight-nav button[aria-label="Toggle Interface Sound"]');
    if (!button || button.dataset.audioPatchBound === "true") return;
    button.dataset.audioPatchBound = "true";

    figaro = document.createElement("audio");
    figaro.src = FIGARO_URL;
    figaro.preload = "auto";
    figaro.loop = true;
    figaro.volume = 0.22;
    figaro.setAttribute("aria-hidden", "true");
    figaro.style.display = "none";
    document.body.appendChild(figaro);

    const triggerMusic = () => {
      if (!soundEnabled) return;
      ensureUiContext();
      startMusic();
    };

    button.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) triggerMusic();
      else pauseMusic();
    });

    figaro.addEventListener("ended", () => {
      musicStarted = false;
      startMusic();
    });

    window.addEventListener("portfolio:synth-finished", triggerMusic);
    window.addEventListener("pointerdown", triggerMusic, { passive: true });
    window.addEventListener("keydown", triggerMusic);
    window.addEventListener("touchstart", triggerMusic, { passive: true });
    window.addEventListener("wheel", triggerMusic, { passive: true });
    window.addEventListener("scroll", triggerMusic, { passive: true });
    window.addEventListener("touchmove", triggerMusic, { passive: true });

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
        triggerMusic();
      }
    }, true);

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