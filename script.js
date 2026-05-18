/* ==========================================================================
   MINIMALIST INTERACTIVE LOGIC FOR CAT LOAF
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.getElementById('animation-wrapper');
  const bubble = document.getElementById('speech-bubble');
  const bubbleText = bubble.querySelector('span');

  // Cat Eyes for cursor tracking and winking
  const eyesGroup = document.getElementById('cat-eyes-group');
  const eyeLeft = document.getElementById('cat-eye-left');
  const eyeRight = document.getElementById('cat-eye-right');

  // Cozy minimalist expressions
  const catExpressions = [
    'prr?', 
    'purr...', 
    'meow! ♥', 
    'mew!', 
    '😺', 
    'cozy~', 
    'mew?', 
    '*blink*'
  ];

  let isBubbleActive = false;
  let bubbleTimeout;

  /* ==========================================================================
     1. SUBTLE DYNAMIC CURSOR EYE-TRACKING
     ========================================================================== */
  window.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;

    if (eyesGroup && wrapper) {
      const cardRect = wrapper.getBoundingClientRect();
      
      // Center of cat's head in screen pixels (cx=300, cy=240 in SVG coordinate space)
      const headX = cardRect.left + (cardRect.width * (300 / 600));
      const headY = cardRect.top + (cardRect.height * (240 / 600));

      const dx = clientX - headX;
      const dy = clientY - headY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Max eye group translation (5px inside the SVG boundary)
      const maxTranslate = 5;
      let tx = 0;
      let ty = 0;

      if (distance > 0) {
        // Shift eyes group toward cursor position proportionally
        const ratio = Math.min(distance / 180, 1) * maxTranslate;
        tx = (dx / distance) * ratio;
        ty = (dy / distance) * ratio;
      }

      eyesGroup.style.transform = `translate(${tx}px, ${ty}px)`;
    }
  });

  // Smoothly center the eyes when cursor leaves viewport
  document.addEventListener('mouseleave', () => {
    if (eyesGroup) {
      eyesGroup.style.transform = 'translate(0px, 0px)';
    }
  });

  /* ==========================================================================
     2. INTERACTIVE CLICK MEOWS & CUTE WINKS
     ========================================================================== */
  if (wrapper) {
    wrapper.addEventListener('click', () => {
      // Pick a random cozy word
      const randomIndex = Math.floor(Math.random() * catExpressions.length);
      const chosenWord = catExpressions[randomIndex];

      // Render and display bubble
      showSpeechBubble(chosenWord);

      // Trigger a cute double-wink animation in JavaScript
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

    // Fade out after 1.5 seconds
    bubbleTimeout = setTimeout(() => {
      bubble.classList.remove('active');
      isBubbleActive = false;
    }, 1500);
  }

  function triggerEyeWink() {
    if (eyeLeft && eyeRight) {
      // Disable default transitions temporarily for instant response
      eyeLeft.style.transition = 'transform 0.08s ease';
      eyeRight.style.transition = 'transform 0.08s ease';
      
      // Make eyes close
      eyeLeft.style.transform = 'scaleY(0.1)';
      eyeRight.style.transform = 'scaleY(0.1)';
      
      setTimeout(() => {
        // Return to normal
        eyeLeft.style.transform = 'scaleY(1)';
        eyeRight.style.transform = 'scaleY(1)';
        
        setTimeout(() => {
          eyeLeft.style.transition = '';
          eyeRight.style.transition = '';
        }, 100);
      }, 150);
    }
  }
});
