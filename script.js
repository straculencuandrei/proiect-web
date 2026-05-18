/* ==========================================================================
   INTERACTIVE LOGIC & EFFECTS FOR WALLIEZ WEBSITE
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('interactive-container');
  const wrapper = document.getElementById('animation-wrapper');
  const title = document.getElementById('brand-title');
  const bubble = document.getElementById('speech-bubble');
  const bubbleText = bubble.querySelector('span');

  // Background blobs
  const blobPurple = document.querySelector('.blob-purple');
  const blobBlue = document.querySelector('.blob-blue');
  const blobCoral = document.querySelector('.blob-coral');

  // Cat Eyes for tracking
  const eyesGroup = document.getElementById('cat-eyes-group');
  const eyeLeft = document.getElementById('cat-eye-left');
  const eyeRight = document.getElementById('cat-eye-right');

  // Cozy cat expressions
  const catExpressions = [
    'prr?', 
    'purr...', 
    'meow! ♥', 
    'mew!', 
    '😺', 
    'cozy~', 
    'walliez!', 
    '*blink*'
  ];

  let isBubbleActive = false;
  let bubbleTimeout;

  /* ==========================================================================
     1. PARALLAX EFFECT & EYE TRACKING ON MOUSEMOVE
     ========================================================================== */
  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Normalize coordinates around center (-1 to 1)
    const mouseX = (clientX - width / 2) / (width / 2);
    const mouseY = (clientY - height / 2) / (height / 2);

    // Parallax: Shift elements in different depths/directions
    // Title moves in opposite direction of mouse for extreme depth
    if (title) {
      const titleX = -50 + (mouseX * -15); // Offset from center -50%
      const titleY = -60 + (mouseY * -15); // Offset from center -60%
      title.style.transform = `translate(${titleX}%, ${titleY}%)`;
    }

    // Card moves subtly with the mouse
    if (wrapper) {
      const cardX = mouseX * 12;
      const cardY = mouseY * 12;
      const rotateX = -mouseY * 6; // Add subtle 3D tilt
      const rotateY = mouseX * 6;
      wrapper.style.transform = `translate(${cardX}px, ${cardY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    }

    // Background blobs move very slowly
    if (blobPurple) blobPurple.style.transform = `translate(${mouseX * 40}px, ${mouseY * 40}px)`;
    if (blobBlue) blobBlue.style.transform = `translate(${mouseX * -50}px, ${mouseY * -50}px)`;
    if (blobCoral) blobCoral.style.transform = `translate(-50%, -50%) translate(${mouseX * 20}px, ${mouseY * 20}px)`;

    // Cat Eye Tracking
    // We calculate vectors from the eyes group default position to the mouse cursor
    // SVG coordinates center around 280, 240
    if (eyesGroup && wrapper) {
      const cardRect = wrapper.getBoundingClientRect();
      // Center of cat's head in screen pixels
      const headX = cardRect.left + (cardRect.width * (280 / 600));
      const headY = cardRect.top + (cardRect.height * (236 / 600));

      const dx = clientX - headX;
      const dy = clientY - headY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Max eye translation: 5px in SVG space
      const maxTranslate = 5;
      let tx = 0;
      let ty = 0;

      if (distance > 0) {
        // Shift eyes toward the mouse cursor proportionally
        const ratio = Math.min(distance / 200, 1) * maxTranslate;
        tx = (dx / distance) * ratio;
        ty = (dy / distance) * ratio;
      }

      // Apply transform to eyes group
      eyesGroup.style.transform = `translate(${tx}px, ${ty}px)`;
    }
  });

  // Reset positions when mouse leaves the viewport
  document.addEventListener('mouseleave', () => {
    if (title) title.style.transform = 'translate(-50%, -60%)';
    if (wrapper) wrapper.style.transform = 'translate(0px, 0px) rotateX(0deg) rotateY(0deg)';
    if (eyesGroup) eyesGroup.style.transform = 'translate(0px, 0px)';
  });

  /* ==========================================================================
     2. brand HOVER GLOW CONNECTION
     ========================================================================== */
  if (wrapper && title) {
    wrapper.addEventListener('mouseenter', () => {
      title.classList.add('glowing');
    });

    wrapper.addEventListener('mouseleave', () => {
      title.classList.remove('glowing');
    });
  }

  /* ==========================================================================
     3. INTERACTIVE CLICK MEOWS
     ========================================================================== */
  if (wrapper) {
    wrapper.addEventListener('click', (e) => {
      // Pick random cute word
      const randomIndex = Math.floor(Math.random() * catExpressions.length);
      const chosenWord = catExpressions[randomIndex];

      // Update and show bubble
      showSpeechBubble(chosenWord);

      // Cute animation trigger: make the cat's eyes shiver/widen on click
      triggerEyeWink();
    });
  }

  function showSpeechBubble(text) {
    if (isBubbleActive) {
      clearTimeout(bubbleTimeout);
    }

    bubbleText.textContent = text;
    bubble.classList.add('active');
    isBubbleActive = true;

    // Auto dismiss after 1.5 seconds
    bubbleTimeout = setTimeout(() => {
      bubble.classList.remove('active');
      isBubbleActive = false;
    }, 1500);
  }

  function triggerEyeWink() {
    if (eyeLeft && eyeRight) {
      // Temporarily add class for a cute wink or scale
      eyeLeft.style.transition = 'transform 0.1s ease';
      eyeRight.style.transition = 'transform 0.1s ease';
      
      // Make them wink!
      eyeLeft.style.transform = 'scaleY(0.1)';
      
      setTimeout(() => {
        eyeLeft.style.transform = 'scaleY(1)';
        eyeLeft.style.transition = '';
        eyeRight.style.transition = '';
      }, 200);
    }
  }
});
