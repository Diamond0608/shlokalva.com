(() => {
  const FIGARO_URL = "https://upload.wikimedia.org/wikipedia/commons/e/e2/Mozart%2C_The_Marriage_of_Figaro_%28overture%29.ogg";
  let soundEnabled = true;
  let figaro = null;
  let originalConnect = null;
  let soundContext = null;
  const silentGains = new WeakMap();
  let lastHoverTarget = null;

  const silenceSynthOutput = () => {
    if (originalConnect || !window.AudioNode) return;
    originalConnect = AudioNode.prototype.connect;
    AudioNode.prototype.connect = function (destination, ...args) {
      if (destination && destination.context && destination === destination.context.destination) {
        let silentGain = silentGains.get(destination.context);
        if (!silentGain) {
          silentGain = destination.context.createGain();
          silentGain.gain.value = 0;
          originalConnect.call(silentGain, destination);
          silentGains.set(destination.context, silentGain);
        }
        return originalConnect.call(this, silentGain, ...args);
      }
      return originalConnect.call(this, destination, ...args);
    };
  };

  const ensureSoundContext = () => {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    soundContext ||= new AudioContextClass();
    if (soundContext.state === "suspended") soundContext.resume().catch(() => {});
    return soundContext;
  };

  const playUiSound = (kind) => {
    if (!soundEnabled) return;
    const context = ensureSoundContext();
    if (!context) return;
    const osc = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
    osc.type = kind === "click" ? "square" : "triangle";
    osc.frequency.setValueAtTime(kind === "click" ? 620 : 420, now);
    osc.frequency.exponentialRampToValueAtTime(kind === "click" ? 980 : 610, now + (kind === "click" ? 0.055 : 0.045));
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(kind === "click" ? 0.045 : 0.022, now + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + (kind === "click" ? 0.075 : 0.055));
    osc.connect(gain).connect(context.destination);
    osc.start(now);
    osc.stop(now + 0.09);
  };

  const startMusic = () => {
    if (!figaro || !soundEnabled) return;
    figaro.play().catch(() => {});
  };

  const setupAudio = () => {
    const button = document.querySelector('.flight-nav button[aria-label="Toggle Interface Sound"]');
    if (!button || button.dataset.audioPatchBound === "true") return;

    button.dataset.audioPatchBound = "true";
    figaro = document.createElement("audio");
    figaro.src = FIGARO_URL;
    figaro.preload = "auto";
    figaro.loop = true;
    figaro.autoplay = true;
    figaro.volume = 0.22;
    figaro.setAttribute("aria-hidden", "true");
    figaro.style.display = "none";
    document.body.appendChild(figaro);

    const primeAndPlay = () => {
      if (!soundEnabled) return;
      ensureSoundContext();
      startMusic();
    };

    button.addEventListener("click", () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) primeAndPlay();
      else figaro?.pause();
    });

    startMusic();
    ["pointerdown", "keydown", "touchstart"].forEach((eventName) => {
      document.addEventListener(eventName, primeAndPlay, { passive: true });
    });

    document.addEventListener("pointerover", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const interactive = target.closest("a, button, summary, .project-card, .experience-card, .signal-grid article, .interest-grid article, .engine-panel");
      if (!interactive || interactive === lastHoverTarget) return;
      lastHoverTarget = interactive;
      playUiSound("hover");
    }, true);

    document.addEventListener("click", (event) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("a, button, summary, .photo-tile, .project-card, .engine-panel")) {
        playUiSound("click");
        primeAndPlay();
      }
    }, true);

    window.setTimeout(() => {
      silenceSynthOutput();
      startMusic();
    }, 8100);
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