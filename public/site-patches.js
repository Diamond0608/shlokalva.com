(() => {
  const FIGARO_URL = "https://upload.wikimedia.org/wikipedia/commons/e/e2/Mozart%2C_The_Marriage_of_Figaro_%28overture%29.ogg";
  let soundEnabled = true;
  let switchedToFigaro = false;
  let handoffInProgress = false;
  let figaro = null;

  const setupAudio = () => {
    const button = document.querySelector('.flight-nav button[aria-label="Toggle Interface Sound"]');
    if (!button || button.dataset.audioPatchBound === "true") return;

    button.dataset.audioPatchBound = "true";
    figaro = document.createElement("audio");
    figaro.src = FIGARO_URL;
    figaro.preload = "auto";
    figaro.loop = true;
    figaro.setAttribute("aria-hidden", "true");
    figaro.style.display = "none";
    document.body.appendChild(figaro);

    button.addEventListener("click", () => {
      if (!handoffInProgress) soundEnabled = !soundEnabled;
      if (!figaro || !switchedToFigaro) return;
      if (soundEnabled) {
        figaro.play().catch(() => {});
      } else {
        figaro.pause();
      }
    });

    // The existing Web Audio synth plays its first 8.2-second phrase once.
    // Stop it before its second phrase begins, then hand over to the unchanged
    // Marriage of Figaro recording.
    window.setTimeout(() => {
      handoffInProgress = true;
      button.click();
      handoffInProgress = false;
      switchedToFigaro = true;

      if (soundEnabled && figaro) {
        figaro.play().catch(() => {
          // Browsers may require a user gesture for media autoplay. If so,
          // the existing sound toggle will start it on the next click.
        });
      }
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
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });

  window.addEventListener("load", setup, { once: true });
  window.setInterval(setup, 1000);
})();
