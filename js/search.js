/**
 * Coşkun Yaycı - Search Module
 * Gerçek zamanlı ürün araması, vurgulama, sonuç sayısı
 */

const Search = (function() {
  'use strict';

  let searchInput = null;
  let searchResults = null;
  let originalProducts = [];
  let debounceTimer = null;

  function init(products) {
    originalProducts = products || [];
    createSearchUI();
    setupEventListeners();
  }

  function createSearchUI() {
    // Check if search container already exists
    if (document.querySelector('.search-container')) return;

    const header = document.querySelector('.site-header');
    if (!header) return;

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
      <div class="search-wrapper">
        <input 
          type="search" 
          class="search-input" 
          placeholder="🔍 Ürün ara..." 
          aria-label="Ürün ara"
          autocomplete="off"
        />
        <button class="search-clear" aria-label="Aramayı temizle" style="display:none;">✕</button>
      </div>
      <div class="search-stats" aria-live="polite"></div>
    `;

    // Insert after category
    const category = header.querySelector('.category');
    if (category) {
      category.after(searchContainer);
    } else {
      header.appendChild(searchContainer);
    }

    searchInput = searchContainer.querySelector('.search-input');
    searchResults = searchContainer.querySelector('.search-stats');
  }

  function setupEventListeners() {
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        performSearch(e.target.value);
      }, 200);
    });

    searchInput.addEventListener('focus', () => {
      searchInput.parentElement.classList.add('focused');
    });

    searchInput.addEventListener('blur', () => {
      searchInput.parentElement.classList.remove('focused');
    });

    // Clear button
    const clearBtn = document.querySelector('.search-clear');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchInput.value = '';
        clearBtn.style.display = 'none';
        performSearch('');
        searchInput.focus();
      });
    }

    // Keyboard shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchInput?.focus();
      }
      
      // Escape to clear
      if (e.key === 'Escape' && searchInput) {
        searchInput.value = '';
        performSearch('');
        searchInput.blur();
      }
    });
  }

  function performSearch(query) {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Show/hide clear button
    const clearBtn = document.querySelector('.search-clear');
    if (clearBtn) {
      clearBtn.style.display = normalizedQuery ? 'flex' : 'none';
    }

    // Track search analytics
    if (normalizedQuery && window.Analytics) {
      Analytics.track('search', { search_term: normalizedQuery });
    }

    const cards = document.querySelectorAll('.card');
    let visibleCount = 0;

    cards.forEach((card, index) => {
      const product = originalProducts[index];
      if (!product) return;

      const searchableText = `
        ${product.name} 
        ${product.desc} 
        ${product.badges?.join(' ') || ''}
        ${product.meta || ''}
      `.toLowerCase();

      const isMatch = !normalizedQuery || searchableText.includes(normalizedQuery);
      
      if (isMatch) {
        card.style.display = '';
        card.style.animation = 'none';
        card.offsetHeight; // Trigger reflow
        card.style.animation = `fadeUp 300ms ease ${visibleCount * 50}ms both`;
        
        // Highlight matching text
        if (normalizedQuery) {
          highlightText(card, normalizedQuery);
        } else {
          removeHighlight(card);
        }
        
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    // Update stats
    updateStats(visibleCount, normalizedQuery);
    
    // Dispatch search event
    window.dispatchEvent(new CustomEvent('searchCompleted', {
      detail: { query: normalizedQuery, count: visibleCount }
    }));
  }

  function highlightText(card, query) {
    const title = card.querySelector('.title');
    if (title && !title.dataset.original) {
      title.dataset.original = title.textContent;
      const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
      title.innerHTML = title.textContent.replace(regex, '<mark>$1</mark>');
    }
  }

  function removeHighlight(card) {
    const title = card.querySelector('.title');
    if (title && title.dataset.original) {
      title.textContent = title.dataset.original;
      delete title.dataset.original;
    }
  }

  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function updateStats(count, query) {
    if (!searchResults) return;
    
    if (!query) {
      searchResults.textContent = `${originalProducts.length} ürün`;
      return;
    }

    if (count === 0) {
      searchResults.textContent = 'Sonuç bulunamadı';
      searchResults.classList.add('no-results');
    } else {
      searchResults.textContent = `${count} ürün bulundu`;
      searchResults.classList.remove('no-results');
    }
  }

  // Public API
  return {
    init,
    search: performSearch,
    clear: () => performSearch('')
  };
})();

window.Search = Search;
