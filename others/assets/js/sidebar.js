// THIS ONE MIGHT BE SCRAPPED!!!!!!!!!!!!

// Sidebar Navigation Handler with Hover Expansion
(function() {
  'use strict';

  // Wait for DOM to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarNavigation);
  } else {
    initSidebarNavigation();
  }

  function initSidebarNavigation() {
    console.log('🎨 Initializing hover-expandable sidebar...');
    
    // Get all sidebar links
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sidebar = document.querySelector('.sidebar');
    
    // Content sections mapping
    const contentMap = {
      'home': 'content-home',
      'games': 'content-gms',
      'apps': 'content-aps',
      'settings': 'content-settings'
    };

    // Add click event to each sidebar link
    sidebarLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Get the page identifier
        const page = this.getAttribute('data-page');
        
        console.log('📄 Switching to page:', page);
        
        // Remove active class from all links
        sidebarLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Hide all content sections
        hideAllContent();
        
        // Show the selected content
        const contentId = contentMap[page];
        if (contentId) {
          const contentElement = document.getElementById(contentId);
          if (contentElement) {
            contentElement.style.display = 'block';
            console.log('✅ Content displayed:', contentId);
          }
        }

        // Store active page
        try {
          sessionStorage.setItem('activePage', page);
        } catch (e) {
          console.warn('sessionStorage not available:', e);
        }

        // Scroll to top
        scrollToTop();
      });
    });

    // Restore active page on load
    restoreActivePage();

    // Enhanced hover effects with console logging
    if (sidebar) {
      sidebar.addEventListener('mouseenter', function() {
        console.log('🖱️ Sidebar expanded');
      });

      sidebar.addEventListener('mouseleave', function() {
        console.log('🖱️ Sidebar collapsed');
      });
    }
  }

  function hideAllContent() {
    const contentSections = document.querySelectorAll('.content');
    contentSections.forEach(section => {
      section.style.display = 'none';
    });
  }

  function restoreActivePage() {
    try {
      const activePage = sessionStorage.getItem('activePage');
      if (activePage) {
        const activeLink = document.querySelector(`.sidebar-link[data-page="${activePage}"]`);
        if (activeLink) {
          // Simulate click to restore state
          setTimeout(() => {
            activeLink.click();
          }, 100);
        }
      } else {
        // Default to home if no active page
        const homeLink = document.querySelector('.sidebar-link[data-page="home"]');
        if (homeLink && !homeLink.classList.contains('active')) {
          homeLink.click();
        }
      }
    } catch (e) {
      console.warn('Could not restore active page:', e);
    }
  }

  // Handle back buttons
  function setupBackButtons() {
    const backButtons = [
      { id: 'backToHomeApps', target: 'home' },
      { id: 'backToHomeGame', target: 'home' }
    ];

    backButtons.forEach(btn => {
      const button = document.getElementById(btn.id);
      if (button) {
        button.addEventListener('click', function() {
          const homeLink = document.querySelector('.sidebar-link[data-page="home"]');
          if (homeLink) {
            homeLink.click();
          }
        });
      }
    });
  }

  // Modal handlers
  function setupModals() {
    const creditsBtn = document.getElementById('creditsBtn');
    const updateLogBtn = document.getElementById('updateLogBtn');
    const creditsModal = document.getElementById('creditsModal');
    const updateLogModal = document.getElementById('updateLogModal');

    if (creditsBtn && creditsModal) {
      creditsBtn.addEventListener('click', function() {
        creditsModal.style.display = 'block';
      });
    }

    if (updateLogBtn && updateLogModal) {
      updateLogBtn.addEventListener('click', function() {
        updateLogModal.style.display = 'block';
      });
    }

    // Close modal functionality
    const closeButtons = document.querySelectorAll('.info-close');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', function() {
        const modalId = this.getAttribute('data-modal');
        const modal = document.getElementById(modalId);
        if (modal) {
          modal.style.display = 'none';
        }
      });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
      if (e.target.classList.contains('info-modal')) {
        e.target.style.display = 'none';
      }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        const modals = document.querySelectorAll('.info-modal');
        modals.forEach(modal => {
          if (modal.style.display === 'block') {
            modal.style.display = 'none';
          }
        });
      }
    });
  }

  // Keyboard navigation
  function setupKeyboardNav() {
    document.addEventListener('keydown', function(e) {
      // Only work if not typing in input
      const activeElement = document.activeElement;
      if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        return;
      }

      // Press '1' for home
      if (e.key === '1') {
        const homeLink = document.querySelector('.sidebar-link[data-page="home"]');
        if (homeLink) homeLink.click();
      }
      // Press '2' for games
      if (e.key === '2') {
        const gamesLink = document.querySelector('.sidebar-link[data-page="games"]');
        if (gamesLink) gamesLink.click();
      }
      // Press '3' for apps
      if (e.key === '3') {
        const appsLink = document.querySelector('.sidebar-link[data-page="apps"]');
        if (appsLink) appsLink.click();
      }
      // Press '4' for settings
      if (e.key === '4') {
        const settingsLink = document.querySelector('.sidebar-link[data-page="settings"]');
        if (settingsLink) settingsLink.click();
      }
    });
  }

  // Smooth scroll to top
  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Moon icon click handler - goes to home
  function setupMoonClick() {
    const moonIcon = document.querySelector('.moon-icon');
    if (moonIcon) {
      moonIcon.addEventListener('click', function() {
        const homeLink = document.querySelector('.sidebar-link[data-page="home"]');
        if (homeLink) {
          homeLink.click();
        }
      });
    }
  }

  // Initialize all features
  setTimeout(() => {
    setupBackButtons();
    setupModals();
    setupKeyboardNav();
    setupMoonClick();
    console.log('✅ Sidebar fully initialized');
  }, 100);

  // Add visual feedback for active state changes
  document.addEventListener('click', function(e) {
    if (e.target.closest('.sidebar-link')) {
      const link = e.target.closest('.sidebar-link');
      link.style.transform = 'scale(0.95)';
      setTimeout(() => {
        link.style.transform = '';
      }, 150);
    }
  });

  // Enhanced accessibility: Announce page changes
  function announcePageChange(pageName) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.className = 'sr-only';
    announcement.textContent = `Navigated to ${pageName} page`;
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      announcement.remove();
    }, 1000);
  }

  // Update link clicks to include announcements
  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function() {
      const page = this.getAttribute('data-page');
      const pageName = this.querySelector('span')?.textContent || page;
      announcePageChange(pageName);
    });
  });

  // Add smooth transitions for sidebar expand/collapse
  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    let expandTimeout;
    
    sidebar.addEventListener('mouseenter', function() {
      clearTimeout(expandTimeout);
      this.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    sidebar.addEventListener('mouseleave', function() {
      expandTimeout = setTimeout(() => {
        this.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
      }, 50);
    });
  }

})();
