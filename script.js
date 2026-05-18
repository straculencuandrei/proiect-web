/* ==========================================================================
   MINIMALIST INTERACTIVE LOGIC FOR GUNS.LOL PROFILE
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  
  // DOM Elements
  const discordBtn = document.getElementById('discord-btn');
  const steamBtn = document.getElementById('steam-btn');
  const toast = document.getElementById('toast-popup');
  const toastText = toast.querySelector('span');

  const musicPlayer = document.getElementById('music-player');
  const vinylDisc = document.getElementById('vinyl-disc');
  const waveVis = document.getElementById('wave-vis');
  const trackTitle = document.getElementById('track-title');

  let toastTimeout;
  let isPlaying = false;

  /* ==========================================================================
     1. CLIPBOARD COPY & CUSTOM TOAST NOTIFICATION
     ========================================================================== */
  function showToast(message) {
    if (toastTimeout) clearTimeout(toastTimeout);
    
    toastText.textContent = message;
    toast.classList.add('active');

    // Slide out after 2.5 seconds
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 2500);
  }

  // Discord Copy Action
  if (discordBtn) {
    discordBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const discordTag = '@walliez';
      
      navigator.clipboard.writeText(discordTag)
        .then(() => {
          showToast('Copied! Discord tag copied to clipboard.');
        })
        .catch(() => {
          // Fallback if clipboard API is blocked by browser permissions
          showToast('Discord Tag: @walliez');
        });
    });
  }

  // Steam Copy Action
  if (steamBtn) {
    steamBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const steamUser = 'walliez';

      navigator.clipboard.writeText(steamUser)
        .then(() => {
          showToast('Copied! Steam username copied to clipboard.');
        })
        .catch(() => {
          showToast('Steam Username: walliez');
        });
    });
  }

  /* ==========================================================================
     2. SIMULATED MUSIC PLAYER CONTROLS
     ========================================================================== */
  if (musicPlayer && vinylDisc && waveVis && trackTitle) {
    musicPlayer.addEventListener('click', () => {
      isPlaying = !isPlaying;

      if (isPlaying) {
        // Toggle animations on
        vinylDisc.classList.add('playing');
        waveVis.classList.add('playing');
        trackTitle.textContent = 'Silent Lofi Night (Playing)';
        showToast('Now Playing: Silent Lofi Night 🎵');
      } else {
        // Toggle animations off
        vinylDisc.classList.remove('playing');
        waveVis.classList.remove('playing');
        trackTitle.textContent = 'Silent Lofi Night';
        showToast('Audio Paused ⏸️');
      }
    });
  }

  /* ==========================================================================
     3. ATMOSPHERIC SEAMLESS RAIN GENERATOR
     ========================================================================== */
  function createRain() {
    const background = document.getElementById('background-wrapper');
    if (!background) return;

    const dropCount = 70; // Dense, cozy rain density

    for (let i = 0; i < dropCount; i++) {
      const drop = document.createElement('div');
      drop.className = 'rain-drop';

      // Randomize horizontal positions, fall speeds, sizes, and opacities for depth
      const leftPos = Math.random() * 115 - 10;      // Compensates for the wind slant angle
      const fallDuration = 0.5 + Math.random() * 0.55; // Velocity
      const fallDelay = Math.random() * 2;            // Staggered delay
      const dropOpacity = 0.08 + Math.random() * 0.22; // Foreground is brighter
      const dropScale = 0.35 + Math.random() * 0.65;   // Foreground is larger/longer

      drop.style.left = `${leftPos}vw`;
      drop.style.animationDuration = `${fallDuration}s`;
      drop.style.animationDelay = `-${fallDelay}s`; // Negative delay starts drops mid-fall instantly
      drop.style.opacity = dropOpacity;
      drop.style.transform = `scale(${dropScale})`;

      background.appendChild(drop);
    }
  }

  // Initiate rainstorm fall
  createRain();

});
