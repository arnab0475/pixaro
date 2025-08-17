// Theme Toggle Functionality for Pixaro

class ThemeManager {
  constructor() {
    this.currentTheme = this.getStoredTheme() || 'light';
    this.init();
  }

  init() {
    // Apply stored theme on page load
    this.applyTheme(this.currentTheme);
    
    // Create theme toggle button
    this.createToggleButton();
    
    // Listen for system theme changes
    this.listenForSystemThemeChanges();
  }

  getStoredTheme() {
    return localStorage.getItem('pixaro-theme');
  }

  storeTheme(theme) {
    localStorage.setItem('pixaro-theme', theme);
  }

  applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    this.storeTheme(theme);
    this.updateToggleButton();
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(newTheme);
    
    // Add a subtle animation effect
    document.body.style.transition = 'all 0.3s ease';
    setTimeout(() => {
      document.body.style.transition = '';
    }, 300);
  }

  createToggleButton() {
    // Check if button already exists
    if (document.getElementById('theme-toggle')) return;

    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle theme');
    button.title = 'Toggle dark/light mode';
    
    // Add click event
    button.addEventListener('click', () => {
      this.toggleTheme();
      
      // Add click animation
      button.style.transform = 'scale(0.9)';
      setTimeout(() => {
        button.style.transform = '';
      }, 150);
    });

    // Add to page
    document.body.appendChild(button);
    
    // Update button content
    this.updateToggleButton();
  }

  updateToggleButton() {
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    if (this.currentTheme === 'dark') {
      button.innerHTML = '<i class="fas fa-sun"></i>';
      button.title = 'Switch to light mode';
    } else {
      button.innerHTML = '<i class="fas fa-moon"></i>';
      button.title = 'Switch to dark mode';
    }
  }

  listenForSystemThemeChanges() {
    // Listen for system theme preference changes
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      mediaQuery.addEventListener('change', (e) => {
        // Only auto-switch if user hasn't manually set a preference
        if (!this.getStoredTheme()) {
          const systemTheme = e.matches ? 'dark' : 'light';
          this.applyTheme(systemTheme);
        }
      });
    }
  }

  // Method to get system preference
  getSystemTheme() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }
}

// Initialize theme manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.themeManager = new ThemeManager();
});

// Export for use in other scripts if needed
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ThemeManager;
}
