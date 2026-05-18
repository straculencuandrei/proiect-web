/* ==========================================================================
   MINIMALIST INTERACTIVE LOGIC FOR NECO-ARC
   ========================================================================= */

document.addEventListener('DOMContentLoaded', () => {
  const necoContainer = document.getElementById('neco-container');
  const bubble = document.getElementById('speech-bubble');
  const bubbleText = bubble.querySelector('span');

  // Cozy meows blended with signature Neco-Arc catchphrases
  const expressions = [
    'burenyuu~',
    'nyan!',
    'doridoridori~',
    'prr?',
    'purr...',
    'meow! ♥',
    'mew!',
    '😺',
    'shhh!',
    'bounce!',
    'play~',
    'kys',
    'die nigga',
    'i luv u'
  ];

  let isBubbleActive = false;
  let bubbleTimeout;

  // Add click interaction to Neco-Arc
  if (necoContainer) {
    necoContainer.addEventListener('click', () => {
      // Pick a random expression
      const randomIndex = Math.floor(Math.random() * expressions.length);
      const chosenWord = expressions[randomIndex];

      // Render and display bubble
      showSpeechBubble(chosenWord);
    });
  }

  function showSpeechBubble(text) {
    if (isBubbleActive) {
      clearTimeout(bubbleTimeout);
    }

    bubbleText.textContent = text;
    bubble.classList.add('active');
    isBubbleActive = true;

    // Fade out speech bubble after 1.5 seconds of display
    bubbleTimeout = setTimeout(() => {
      bubble.classList.remove('active');
      isBubbleActive = false;
    }, 1500);
  }
});
