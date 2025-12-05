// THIS ONE MIGHT BE SCRAPPED ANZO!!!!
(function() {
  'use strict';

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSidebarNavigation);
  } else {
    initSidebarNavigation();
  }

  function initSidebarNavigation() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const sidebar = document.querySelector('.sidebar');
    
    const contentMap = {
      'home': 'content-home',
      'games': 'content-gms',
      'apps': 'content-aps',
      'settings': 'content-settings'
    };

    sidebarLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const page = this.getAttribute('data-page');
        
        sidebarLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        hideAllContent();
        
        const contentId = contentMap[page];
        if (contentId) {
          const contentElement = document.getElementById(contentId);
          if (contentElement) {
            contentElement.style.display = 'block';
          }
        }

        try {
          sessionStorage.setItem('activePage', page);
        } catch (e) {
          console.warn('sessionStorage not available:', e);
        }

        scrollToTop();
      });
    });

    restoreActivePage();
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
          setTimeout(() => {
            activeLink.click();
          }, 100);
        }
      } else {
        const homeLink = document.querySelector('.sidebar-link[data-page="home"]');
        if (homeLink && !homeLink.classList.contains('active')) {
          homeLink.click();
        }
      }
    } catch (e) {
      console.warn('Could not restore active page:', e);
    }
  }

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

    window.addEventListener('click', function(e) {
      if (e.target.classList.contains('info-modal')) {
        e.target.style.display = 'none';
      }
    });

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

  function setupKeyboardNav() {
    document.addEventListener('keydown', function(e) {
      const activeElement = document.activeElement;
      if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
        return;
      }

      if (e.key === '1') {
        const homeLink = document.querySelector('.sidebar-link[data-page="home"]');
        if (homeLink) homeLink.click();
      }
      if (e.key === '2') {
        const gamesLink = document.querySelector('.sidebar-link[data-page="games"]');
        if (gamesLink) gamesLink.click();
      }
      if (e.key === '3') {
        const appsLink = document.querySelector('.sidebar-link[data-page="apps"]');
        if (appsLink) appsLink.click();
      }
      if (e.key === '4') {
        const settingsLink = document.querySelector('.sidebar-link[data-page="settings"]');
        if (settingsLink) settingsLink.click();
      }
    });
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

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

  setTimeout(() => {
    setupBackButtons();
    setupModals();
    setupKeyboardNav();
    setupMoonClick();
  }, 100);

  document.addEventListener('click', function(e) {
    if (e.target.closest('.sidebar-link')) {
      const link = e.target.closest('.sidebar-link');
      link.style.transform = 'scale(0.95)';
      setTimeout(() => {
        link.style.transform = '';
      }, 150);
    }
  });

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

  document.querySelectorAll('.sidebar-link').forEach(link => {
    link.addEventListener('click', function() {
      const page = this.getAttribute('data-page');
      const pageName = this.querySelector('span')?.textContent || page;
      announcePageChange(pageName);
    });
  });

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
