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

  /* ==========================================================================
     4. REALISTIC CANVAS LIGHTNING GENERATOR
     ========================================================================== */
  const lightningCanvas = document.getElementById('lightning-canvas');
  if (lightningCanvas) {
    const ctx = lightningCanvas.getContext('2d');
    
    function resizeCanvas() {
      lightningCanvas.width = window.innerWidth;
      lightningCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    function triggerLightning() {
      const bolts = [];
      const numBolts = Math.floor(Math.random() * 2) + 1; // Generates 1 or 2 main bolts
      
      for(let i = 0; i < numBolts; i++) {
        bolts.push(generateBolt(
          lightningCanvas.width * (0.2 + Math.random() * 0.6), // Start X randomized across sky
          0, // Start Y
          lightningCanvas.height * (0.6 + Math.random() * 0.4) // End Y reaches bottom
        ));
      }

      let flashCount = 0;
      let maxFlashes = Math.floor(Math.random() * 3) + 2; // 2 to 4 flickering flashes per strike
      
      function flash() {
        ctx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);
        document.body.classList.remove('is-striking');
        
        if (flashCount >= maxFlashes) {
          scheduleNextLightning();
          return;
        }

        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        bolts.forEach(bolt => {
          drawBoltPath(bolt, ctx, flashCount === 0);
        });

        // Trigger CSS ambient flashes (Chrome text, forest, sky) perfectly synced with Canvas
        document.body.classList.add('is-striking');
        flashCount++;
        
        // Fast fadeout clearing
        setTimeout(() => {
          ctx.clearRect(0, 0, lightningCanvas.width, lightningCanvas.height);
          document.body.classList.remove('is-striking');
          
          // Delay before next rapid flicker
          setTimeout(flash, 50 + Math.random() * 100);
        }, 40 + Math.random() * 50);
      }
      
      flash();
    }

    function generateBolt(startX, startY, endY) {
      const segments = [];
      let x = startX;
      let y = startY;
      segments.push({x, y});

      // Generate jagged main line
      while (y < endY) {
        y += Math.random() * 25 + 10;
        x += (Math.random() - 0.5) * 60;
        segments.push({x, y});
      }

      // Generate off-shoot branches
      const branches = [];
      for (let i = 1; i < segments.length - 2; i++) {
        if (Math.random() < 0.15) {
          let bx = segments[i].x;
          let by = segments[i].y;
          const branchSegments = [{x: bx, y: by}];
          const dir = Math.random() > 0.5 ? 1 : -1;
          const branchLen = Math.floor(Math.random() * 6) + 3;
          for(let j = 0; j < branchLen; j++) {
            by += Math.random() * 20 + 5;
            bx += (Math.random() * 40) * dir;
            branchSegments.push({x: bx, y: by});
          }
          branches.push(branchSegments);
        }
      }
      return { main: segments, branches };
    }

    function drawBoltPath(bolt, ctx, isMainFlash) {
      ctx.shadowBlur = isMainFlash ? 20 : 10;
      ctx.shadowColor = 'rgba(230, 242, 255, 0.9)';
      ctx.strokeStyle = isMainFlash ? 'rgba(255, 255, 255, 0.95)' : 'rgba(230, 242, 255, 0.5)';
      
      // Draw main thick bolt
      ctx.lineWidth = isMainFlash ? 3.5 : 1.5;
      ctx.beginPath();
      ctx.moveTo(bolt.main[0].x, bolt.main[0].y);
      for(let i = 1; i < bolt.main.length; i++) {
        ctx.lineTo(bolt.main[i].x, bolt.main[i].y);
      }
      ctx.stroke();

      // Draw thinner branching lines
      ctx.lineWidth = isMainFlash ? 1.5 : 0.8;
      bolt.branches.forEach(branch => {
        ctx.beginPath();
        ctx.moveTo(branch[0].x, branch[0].y);
        for(let i = 1; i < branch.length; i++) {
          ctx.lineTo(branch[i].x, branch[i].y);
        }
        ctx.stroke();
      });
    }

    function scheduleNextLightning() {
      // Strike every 6 to 14 seconds randomly
      setTimeout(triggerLightning, 6000 + Math.random() * 8000);
    }
    
    // Start lightning storm loop
    scheduleNextLightning();
  }

});
