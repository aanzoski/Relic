// ===== GAME STATISTICS & TRACKING SYSTEM =====
(function() {
  'use strict';

  const GameStats = {
    initialized: false,
    currentGame: null,
    startTime: null,
    trackingInterval: null,

    init() {
      if (this.initialized) return;
      console.log('📊 Initializing Game Statistics System...');
      
      // Ensure storage structures exist
      if (!localStorage.getItem('gameStats')) {
        localStorage.setItem('gameStats', JSON.stringify({}));
      }
      if (!localStorage.getItem('gameFavorites')) {
        localStorage.setItem('gameFavorites', JSON.stringify([]));
      }
      if (!localStorage.getItem('gameCategories')) {
        this.initializeDefaultCategories();
      }
      
      this.initialized = true;
      console.log('✅ Game Statistics System initialized');
    },

    initializeDefaultCategories() {
      const defaultCategories = {
        'Action': [],
        'Puzzle': [],
        'Sports': [],
        'Strategy': [],
        'Arcade': [],
        'Adventure': [],
        'Multiplayer': [],
        'Casual': []
      };
      localStorage.setItem('gameCategories', JSON.stringify(defaultCategories));
    },

    // ===== GAME TRACKING =====
    startTracking(gameUrl) {
      if (!gameUrl) return;
      
      this.stopTracking(); // Stop any existing tracking
      
      this.currentGame = gameUrl;
      this.startTime = Date.now();
      
      console.log('⏱️ Started tracking:', gameUrl);
      
      // Update play count
      const stats = this.getGameStats(gameUrl);
      stats.playCount = (stats.playCount || 0) + 1;
      stats.lastPlayed = Date.now();
      this.saveGameStats(gameUrl, stats);
      
      // Update time every second
      this.trackingInterval = setInterval(() => {
        this.updatePlayTime();
      }, 1000);
    },

    stopTracking() {
      if (this.trackingInterval) {
        clearInterval(this.trackingInterval);
        this.trackingInterval = null;
      }
      
      if (this.currentGame && this.startTime) {
        this.updatePlayTime();
        console.log('⏹️ Stopped tracking:', this.currentGame);
      }
      
      this.currentGame = null;
      this.startTime = null;
    },

    updatePlayTime() {
      if (!this.currentGame || !this.startTime) return;
      
      const sessionTime = Math.floor((Date.now() - this.startTime) / 1000);
      const stats = this.getGameStats(this.currentGame);
      stats.totalTime = (stats.totalTime || 0) + 1; // Add 1 second
      this.saveGameStats(this.currentGame, stats);
    },

    // ===== GAME STATS MANAGEMENT =====
    getGameStats(gameUrl) {
      const allStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
      return allStats[gameUrl] || {
        totalTime: 0,
        playCount: 0,
        lastPlayed: null,
        firstPlayed: Date.now()
      };
    },

    saveGameStats(gameUrl, stats) {
      const allStats = JSON.parse(localStorage.getItem('gameStats') || '{}');
      allStats[gameUrl] = stats;
      localStorage.setItem('gameStats', JSON.stringify(allStats));
    },

    getAllStats() {
      return JSON.parse(localStorage.getItem('gameStats') || '{}');
    },

    formatTime(seconds) {
      if (!seconds || seconds < 60) {
        return `${seconds || 0}s`;
      }
      const hours = Math.floor(seconds / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const secs = seconds % 60;
      
      if (hours > 0) {
        return `${hours}h ${minutes}m`;
      }
      return `${minutes}m ${secs}s`;
    },

    // ===== FAVORITES SYSTEM =====
    getFavorites() {
      return JSON.parse(localStorage.getItem('gameFavorites') || '[]');
    },

    isFavorite(gameUrl) {
      const favorites = this.getFavorites();
      return favorites.includes(gameUrl);
    },

    toggleFavorite(gameUrl) {
      let favorites = this.getFavorites();
      const index = favorites.indexOf(gameUrl);
      
      if (index > -1) {
        favorites.splice(index, 1);
        console.log('💔 Removed from favorites:', gameUrl);
      } else {
        favorites.push(gameUrl);
        console.log('⭐ Added to favorites:', gameUrl);
      }
      
      localStorage.setItem('gameFavorites', JSON.stringify(favorites));
      return !this.isFavorite(gameUrl);
    },

    // ===== CATEGORIES SYSTEM =====
    getCategories() {
      return JSON.parse(localStorage.getItem('gameCategories') || '{}');
    },

    getGameCategory(gameUrl) {
      const categories = this.getCategories();
      for (const [category, games] of Object.entries(categories)) {
        if (games.includes(gameUrl)) {
          return category;
        }
      }
      return 'Uncategorized';
    },

    addGameToCategory(gameUrl, category) {
      const categories = this.getCategories();
      if (!categories[category]) {
        categories[category] = [];
      }
      
      // Remove from other categories
      for (const cat in categories) {
        const index = categories[cat].indexOf(gameUrl);
        if (index > -1) {
          categories[cat].splice(index, 1);
        }
      }
      
      // Add to new category
      if (!categories[category].includes(gameUrl)) {
        categories[category].push(gameUrl);
      }
      
      localStorage.setItem('gameCategories', JSON.stringify(categories));
      console.log('📁 Moved to category:', category);
    },

    getGamesByCategory(category) {
      const categories = this.getCategories();
      return categories[category] || [];
    },

    // ===== SORTING & FILTERING =====
    sortGamesByTime(games) {
      const allStats = this.getAllStats();
      return [...games].sort((a, b) => {
        const timeA = allStats[a.url]?.totalTime || 0;
        const timeB = allStats[b.url]?.totalTime || 0;
        return timeB - timeA;
      });
    },

    sortGamesByPlayCount(games) {
      const allStats = this.getAllStats();
      return [...games].sort((a, b) => {
        const countA = allStats[a.url]?.playCount || 0;
        const countB = allStats[b.url]?.playCount || 0;
        return countB - countA;
      });
    },

    sortGamesByRecent(games) {
      const allStats = this.getAllStats();
      return [...games].sort((a, b) => {
        const timeA = allStats[a.url]?.lastPlayed || 0;
        const timeB = allStats[b.url]?.lastPlayed || 0;
        return timeB - timeA;
      });
    },

    // ===== UI HELPERS =====
    createFavoriteButton(gameUrl, isFavorited) {
      return `
        <button class="favorite-btn ${isFavorited ? 'favorited' : ''}" 
                onclick="event.stopPropagation(); window.GameStats.handleFavoriteClick('${gameUrl}', this)">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFavorited ? 'currentColor' : 'none'}" 
               stroke="currentColor" stroke-width="2">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </button>
      `;
    },

    handleFavoriteClick(gameUrl, buttonElement) {
      this.toggleFavorite(gameUrl);
      const isFav = this.isFavorite(gameUrl);
      
      if (isFav) {
        buttonElement.classList.add('favorited');
        buttonElement.querySelector('svg').setAttribute('fill', 'currentColor');
      } else {
        buttonElement.classList.remove('favorited');
        buttonElement.querySelector('svg').setAttribute('fill', 'none');
      }
    },

    createStatsDisplay(gameUrl, gameName) {
      const stats = this.getGameStats(gameUrl);
      const timeFormatted = this.formatTime(stats.totalTime);
      
      return `
        <div class="game-stats-tooltip">
          <div class="stat-row">
            <span class="stat-icon">⏱️</span>
            <span class="stat-label">Time Played:</span>
            <span class="stat-value">${timeFormatted}</span>
          </div>
          <div class="stat-row">
            <span class="stat-icon">🎮</span>
            <span class="stat-label">Play Count:</span>
            <span class="stat-value">${stats.playCount || 0}</span>
          </div>
          ${stats.lastPlayed ? `
            <div class="stat-row">
              <span class="stat-icon">📅</span>
              <span class="stat-label">Last Played:</span>
              <span class="stat-value">${this.formatDate(stats.lastPlayed)}</span>
            </div>
          ` : ''}
        </div>
      `;
    },

    formatDate(timestamp) {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      
      return date.toLocaleDateString();
    },

    createFilterButtons() {
      return `
        <div class="game-filters">
          <button class="filter-btn active" data-filter="all" onclick="window.filterGames('all')">
            All Games
          </button>
          <button class="filter-btn" data-filter="favorites" onclick="window.filterGames('favorites')">
            ⭐ Favorites
          </button>
          <button class="filter-btn" data-filter="most-played" onclick="window.filterGames('most-played')">
            🔥 Most Played
          </button>
          <button class="filter-btn" data-filter="recent" onclick="window.filterGames('recent')">
            🕐 Recently Played
          </button>
          <button class="filter-btn" data-filter="longest" onclick="window.filterGames('longest')">
            ⏱️ Most Time
          </button>
        </div>
      `;
    },

    // ===== RESET & MANAGEMENT =====
    resetGameStats(gameUrl) {
      const allStats = this.getAllStats();
      delete allStats[gameUrl];
      localStorage.setItem('gameStats', JSON.stringify(allStats));
      console.log('🗑️ Reset stats for:', gameUrl);
    },

    resetAllStats() {
      localStorage.setItem('gameStats', JSON.stringify({}));
      localStorage.setItem('gameFavorites', JSON.stringify([]));
      console.log('🗑️ All stats reset');
    },

    exportStats() {
      return {
        stats: this.getAllStats(),
        favorites: this.getFavorites(),
        categories: this.getCategories(),
        exportDate: new Date().toISOString()
      };
    },

    importStats(data) {
      if (data.stats) localStorage.setItem('gameStats', JSON.stringify(data.stats));
      if (data.favorites) localStorage.setItem('gameFavorites', JSON.stringify(data.favorites));
      if (data.categories) localStorage.setItem('gameCategories', JSON.stringify(data.categories));
      console.log('📥 Stats imported successfully');
    }
  };

  // Initialize on load
  GameStats.init();

  // Expose to window
  window.GameStats = GameStats;

  console.log('✅ game-stats.js loaded');
})();
