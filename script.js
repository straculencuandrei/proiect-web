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
  // Chatbox Form Submission (REMOVED)
  // ============================================================
  // Chatbox functionality removed - feature discontinued

  
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
});
