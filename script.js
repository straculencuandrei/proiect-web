/* ==========================================================================
   PRIGOANA-STYLE SITE SCRIPT
   Minimalist Interactive Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ============================================================
  // Theme Toggle
  // ============================================================
  const themeToggle = document.getElementById('theme-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  function setTheme(theme) {
    if (theme === 'dark') {
      document.body.classList.add('dark-theme');
      themeToggle.textContent = 'THEME: LIGHT';
    } else {
      document.body.classList.remove('dark-theme');
      themeToggle.textContent = 'THEME: DARK';
    }
    localStorage.setItem('theme', theme);
  }
  
  // Set initial theme
  setTheme(savedTheme);
  
  // Toggle theme on button click
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = localStorage.getItem('theme') || 'light';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  }
  
  // ============================================================
  // Visitor Counter
  // ============================================================
  const visitorCountElement = document.getElementById('visitor-count');
  if (visitorCountElement) {
    let count = localStorage.getItem('visitorCount');
    count = count ? parseInt(count) + 1 : 1;
    localStorage.setItem('visitorCount', count);
    visitorCountElement.textContent = count.toLocaleString();
  }
  
  // ============================================================
  // Chatbox Form Submission
  // ============================================================
  const chatboxForm = document.getElementById('chatbox-form');
  if (chatboxForm) {
    chatboxForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form values
      const nameInput = chatboxForm.querySelector('input[type="text"]');
      const emailInput = chatboxForm.querySelector('input[type="email"]');
      const avatarInput = chatboxForm.querySelector('input[type="url"]');
      const messageInput = chatboxForm.querySelector('textarea');
      
      if (!nameInput.value.trim() || !messageInput.value.trim()) {
        alert('Please fill in required fields (Name and Message)');
        return;
      }
      
      // Create new message element
      const messagesContainer = document.querySelector('.chatbox-messages');
      const newMessage = document.createElement('div');
      newMessage.className = 'message';
      
      const now = new Date();
      const timeString = formatTime(now);
      
      newMessage.innerHTML = `
        <div class="message-header">
          <span class="message-name">${escapeHtml(nameInput.value)}</span>
          <span class="message-time">${timeString}</span>
        </div>
        <div class="message-text">${escapeHtml(messageInput.value)}</div>
      `;
      
      messagesContainer.appendChild(newMessage);
      
      // Store message in localStorage
      const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
      messages.unshift({
        name: nameInput.value,
        email: emailInput.value,
        avatar: avatarInput.value,
        message: messageInput.value,
        timestamp: now.toISOString()
      });
      
      // Keep only last 20 messages
      if (messages.length > 20) {
        messages.pop();
      }
      localStorage.setItem('chatMessages', JSON.stringify(messages));
      
      // Clear form
      chatboxForm.reset();
      
      // Show success message
      alert('Message posted!');
    });
  }
  
  // Load messages on page load
  loadChatMessages();
  
  // ============================================================
  // Helper Functions
  // ============================================================
  function formatTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 30) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  }
  
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
  
  function loadChatMessages() {
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const messagesContainer = document.querySelector('.chatbox-messages');
    
    if (!messagesContainer) return;
    
    // Remove demo messages and add stored ones
    const demoMessages = messagesContainer.querySelectorAll('.message');
    demoMessages.forEach(msg => msg.remove());
    
    messages.forEach(msg => {
      const messageEl = document.createElement('div');
      messageEl.className = 'message';
      
      const date = new Date(msg.timestamp);
      const timeString = formatTime(date);
      
      messageEl.innerHTML = `
        <div class="message-header">
          <span class="message-name">${escapeHtml(msg.name)}</span>
          <span class="message-time">${timeString}</span>
        </div>
        <div class="message-text">${escapeHtml(msg.message)}</div>
      `;
      
      messagesContainer.appendChild(messageEl);
    });
  }
});
