/* ==========================================================================
   MINIMALIST REALISTIC PHYSICS ENGINE FOR BOUNCING BALL & PROFILE CAT
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const catContainer = document.getElementById('cat-container');
  const pawActive = document.getElementById('cat-paw-active');
  const ball = document.getElementById('toy-ball');
  const bubble = document.getElementById('speech-bubble');
  const bubbleText = bubble.querySelector('span');

  // Configure active paw transform center (shoulder joint in SVG space: 185, 190)
  if (pawActive) {
    pawActive.style.transformOrigin = '185px 190px';
  }

  // Cozy minimalist expressions triggered at strike impact
  const catExpressions = [
    'prr?', 
    'purr...', 
    'meow! ♥', 
    'mew!', 
    'bounce!', 
    'play~', 
    'fun!', 
    '😺'
  ];

  /* ==========================================================================
     PHYSICS ENGINE VARIABLES
     ========================================================================== */
  let state = 0;         // 0: Rest, 1: Anticipation, 2: Strike, 3: Ball Flight/Return
  let stateTime = 0;     // Timestamp when current state started
  let pawAngle = 0;      // Active paw rotation angle (degrees)

  // Ball positions & velocities
  let ballX = 0;
  let ballY = 0;
  let ballVx = 0;
  let ballVy = 0;

  // Constants
  const gravity = 0.52;
  const restitution = 0.74;     // Bounciness off floor
  const floorFriction = 0.985;  // Slowdown when rolling
  const wallRestitution = 0.8;  // Bounciness off right wall
  const ballRadius = 13;        // Half of ball width (26px)

  // Dynamically computed metrics based on screen and cat container coordinates
  let floorY = 0;       // Ground level (screen Y coordinate matching cat paws)
  let xResting = 0;     // Ball resting spot (screen X coordinate in front of cat)
  let bubbleTimeout;

  // Quad Ease functions for smooth bio-rotations
  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function easeOutQuad(t) {
    return t * (2 - t);
  }

  /* ==========================================================================
     METRIC RECALIBRATION (Responsive Bounding Tracker)
     ========================================================================== */
  function recalculateMetrics() {
    if (!catContainer) return;
    const catRect = catContainer.getBoundingClientRect();

    // In our SVG (viewBox 0 0 400 400), the resting paw tip is at cx=205, cy=352.
    // We bind the ground plane Y directly to this absolute screen coordinate.
    floorY = catRect.top + (catRect.height * (352 / 400));

    // The resting X position of the ball is placed right in front of the active paw (approx x=235).
    xResting = catRect.left + (catRect.width * (232 / 400));

    // If the ball is resting, lock its coordinates immediately to prevent floating on resize
    if (state === 0 || state === 1 || state === 2) {
      ballX = xResting;
      ballY = floorY;
      updateBallDOM();
    }
  }

  // Set initial metrics and listen to viewport shifts
  window.addEventListener('resize', recalculateMetrics);
  // Give layout rendering a tiny beat to settle before calculating bounding box
  setTimeout(recalculateMetrics, 100);

  /* ==========================================================================
     UNIFIED GAME LOOP (requestAnimationFrame)
     ========================================================================== */
  let lastTime = 0;

  function update(time) {
    if (!lastTime) lastTime = time;
    const dt = time - lastTime;
    lastTime = time;

    const timeInState = time - stateTime;

    // STATE MACHINE TRANSITIONS & CALCULATIONS
    if (state === 0) {
      // IDLE COZY RESTING STATE
      pawAngle = 0;
      ballX = xResting;
      ballY = floorY;

      // Rest for 2.2 seconds, then initiate anticipation phase
      if (timeInState > 2200) {
        state = 1;
        stateTime = time;
      }
    } 
    else if (state === 1) {
      // ANTICIPATION: Raise paw slowly backward
      const duration = 850; // 850ms draw back
      const t = Math.min(timeInState / duration, 1);
      
      // Interpolate angle from 0 to -34 degrees
      pawAngle = -34 * easeInOutQuad(t);

      ballX = xResting;
      ballY = floorY;

      if (timeInState > duration) {
        state = 2;
        stateTime = time;
      }
    } 
    else if (state === 2) {
      // THE STRIKE: Quick forward swat
      const duration = 120; // 120ms snap!
      const t = Math.min(timeInState / duration, 1);
      
      // Swipe forward from -34 to 45 degrees
      pawAngle = -34 + (45 - (-34)) * t;

      ballX = xResting;
      ballY = floorY;

      if (timeInState > duration) {
        // IMPACT COLLISION! Trigger ball launch!
        state = 3;
        stateTime = time;

        // DYNAMIC VELOCITY: Calculate vx based on window size so it always reaches the right edge!
        const widthTravel = window.innerWidth - xResting;
        // Travel velocity maps to remaining screen width with slight randomized boost
        ballVx = Math.max(widthTravel * 0.038, 12) + (Math.random() * 3);
        // Elastic upward force
        ballVy = -14 - (Math.random() * 4);

        // Display cute dialogue expression bubble next to head
        showSpeechBubble();
      }
    } 
    else if (state === 3) {
      // BALL FLIGHT PHYSICS & COGNITIVE RETRACTION
      
      // Slowly retract front leg back to resting 0 degrees over 600ms
      const retractDuration = 600;
      if (timeInState < retractDuration) {
        const t = timeInState / retractDuration;
        pawAngle = 45 * (1 - easeOutQuad(t));
      } else {
        pawAngle = 0;
      }

      // Ball kinematics updates
      ballVy += gravity;
      ballX += ballVx;
      ballY += ballVy;

      // 1. COLLISION: Floor ground bounce
      if (ballY >= floorY) {
        ballY = floorY;
        ballVy = -ballVy * restitution;
        ballVx *= floorFriction;

        // Halt micro-bounces to transition into smooth rolling
        if (Math.abs(ballVy) < 0.8) {
          ballVy = 0;
        }
      }

      // 2. COLLISION: Screen right-edge bounce
      const rightWallBound = window.innerWidth - ballRadius;
      if (ballX >= rightWallBound) {
        ballX = rightWallBound;
        ballVx = -ballVx * wallRestitution; // Invert and dampen X velocity
        
        // Add tiny vertical bounce fluctuation on impact
        if (Math.abs(ballVy) > 0) {
          ballVy += (Math.random() - 0.5) * 2;
        }
      }

      // 3. COLLISION / ROLLING RETURN PULL
      // Once the ball is rolling on the floor, apply a constant leftward roll force
      if (ballY === floorY) {
        ballVx -= 0.09; // Small leftward acceleration

        // Check if ball returned home past resting coordinates
        if (ballX <= xResting) {
          // Verify it is moving leftward before snapping home
          if (ballVx <= 0) {
            ballX = xResting;
            ballVx = 0;
            ballVy = 0;
            state = 0; // Return to idle rest loop
            stateTime = time;
          }
        }
      }
    }

    // Update coordinates in DOM
    updatePawDOM();
    updateBallDOM();

    requestAnimationFrame(update);
  }

  /* ==========================================================================
     DOM POSITION UPDATER METHODS
     ========================================================================== */
  function updatePawDOM() {
    if (pawActive) {
      pawActive.style.transform = `rotate(${pawAngle}deg)`;
    }
  }

  function updateBallDOM() {
    if (ball) {
      // Position bottom center of ball to contact point (ballX, ballY)
      ball.style.left = (ballX - ballRadius) + 'px';
      ball.style.top = (ballY - ballRadius * 2) + 'px';

      // Advanced visual spin: rotate ball SVG dynamically proportional to rolling distance!
      const spinDegrees = ballX * 2.6;
      const ballSvg = ball.querySelector('svg');
      if (ballSvg) {
        ballSvg.style.transform = `rotate(${spinDegrees}deg)`;
      }
    }
  }

  /* ==========================================================================
     RANDOMIZED EXPRESSIONS SPEECH BALLOONS
     ========================================================================== */
  function showSpeechBubble() {
    if (!bubble || !bubbleText || !catContainer) return;

    const randomIndex = Math.floor(Math.random() * catExpressions.length);
    const chosenText = catExpressions[randomIndex];

    bubbleText.textContent = chosenText;
    bubble.classList.add('active');

    // Dynamic placement aligning relative to the profile head (approx x=200, y=100 in SVG space)
    const catRect = catContainer.getBoundingClientRect();
    const headX = catRect.left + (catRect.width * (200 / 400));
    const headY = catRect.top + (catRect.height * (100 / 400));

    bubble.style.left = (headX + 25) + 'px';
    bubble.style.top = (headY - 55) + 'px';

    if (bubbleTimeout) clearTimeout(bubbleTimeout);
    bubbleTimeout = setTimeout(() => {
      bubble.classList.remove('active');
    }, 1500);
  }

  /* ==========================================================================
     INTERACTIVE YARN BALL EASTER EGG (Click Fling!)
     ========================================================================== */
  if (ball) {
    ball.addEventListener('click', (e) => {
      // Stop natural click propagation so we don't double click
      e.stopPropagation();

      // Put into flight state instantly
      state = 3;
      stateTime = performance.now();

      // Fling in random wild direction with dynamic pops!
      ballVy = -16 - (Math.random() * 5);
      ballVx = (Math.random() - 0.5) * 20; // Random left/right fling

      showSpeechBubble();
    });
  }

  // Start the frame updates
  requestAnimationFrame(update);
});
