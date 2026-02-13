/**
 * Coşkun Yaycı - Filters Module
 * Kategori filtreleme, sıralama, görünüm seçenekleri
 */

const Filters = (function() {
  'use strict';

  let currentFilter = 'all';
  let currentSort = 'default';
  let products = [];

  const CATEGORIES = {
    'all': { label: 'Tümü', icon: '🧁' },
    'baklava': { label: 'Baklavalar', icon: '🥮' },
    'kurabiye': { label: 'Kurabiyeler', icon: '🍪' },
    'tuzlu': { label: 'Tuzlular', icon: '🥨' },
    'ozel': { label: 'Özel Ürünler', icon: '⭐' }
  };

  const SORT_OPTIONS = {
    'default': { label: 'Varsayılan', icon: '📋' },
    'price-asc': { label: 'Fiyat: Düşükten Yükseğe', icon: '⬆️' },
    'price-desc': { label: 'Fiyat: Yüksekten Düşüğe', icon: '⬇️' },
    'name-asc': { label: 'İsim: A-Z', icon: '🔤' }
  };

  function init(productsData) {
    products = productsData || [];
    createFilterUI();
    createSortUI();
    applyFilters();
  }

  function createFilterUI() {
    if (document.querySelector('.filter-container')) return;

    const main = document.querySelector('main');
    if (!main) return;

    const filterContainer = document.createElement('div');
    filterContainer.className = 'filter-container';
    filterContainer.setAttribute('role', 'tablist');
    filterContainer.setAttribute('aria-label', 'Kategori filtreleri');

    Object.entries(CATEGORIES).forEach(([key, config]) => {
      const btn = document.createElement('button');
      btn.className = `filter-btn ${key === 'all' ? 'active' : ''}`;
      btn.dataset.category = key;
      btn.setAttribute('role', 'tab');
      btn.setAttribute('aria-selected', key === 'all');
      btn.innerHTML = `${config.icon} ${config.label}`;
      
      btn.addEventListener('click', () => setFilter(key));
      filterContainer.appendChild(btn);
    });

    main.insertBefore(filterContainer, main.firstChild);
  }

  function createSortUI() {
    if (document.querySelector('.sort-container')) return;

    const filterContainer = document.querySelector('.filter-container');
    if (!filterContainer) return;

    const sortWrapper = document.createElement('div');
    sortWrapper.className = 'sort-wrapper';
    
    const select = document.createElement('select');
    select.className = 'sort-select';
    select.setAttribute('aria-label', 'Sıralama seçeneği');
    
    Object.entries(SORT_OPTIONS).forEach(([key, config]) => {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = `${config.icon} ${config.label}`;
      select.appendChild(option);
    });

    select.addEventListener('change', (e) => setSort(e.target.value));
    sortWrapper.appendChild(select);
    filterContainer.after(sortWrapper);
  }

  function setFilter(category) {
    currentFilter = category;
    
    // Update UI
    document.querySelectorAll('.filter-btn').forEach(btn => {
      const isActive = btn.dataset.category === category;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });

    // Update category text in header
    const categoryEl = document.getElementById('category');
    if (categoryEl && CATEGORIES[category]) {
      categoryEl.textContent = CATEGORIES[category].label;
    }

    // Track analytics
    if (window.Analytics) {
      Analytics.track('filter_category', { category: category });
    }

    applyFilters();
  }

  function setSort(sortType) {
    currentSort = sortType;
    
    if (window.Analytics) {
      Analytics.track('sort_products', { sort_type: sortType });
    }
    
    applyFilters();
  }

  function applyFilters() {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    let filteredProducts = [...products];

    // Apply category filter
    if (currentFilter !== 'all') {
      filteredProducts = filteredProducts.filter(p => {
        switch(currentFilter) {
          case 'baklava':
            return p.name.toLowerCase().includes('baklava') || 
                   p.name.toLowerCase().includes('midye') ||
                   p.name.toLowerCase().includes('şöbiyet') ||
                   p.name.toLowerCase().includes('dolama') ||
                   p.name.toLowerCase().includes('kadayıf');
          case 'kurabiye':
            return p.name.toLowerCase().includes('kurabiye');
          case 'tuzlu':
            return p.name.toLowerCase().includes('tuzlu') || 
                   p.name.toLowerCase().includes('börek');
          case 'ozel':
            return p.badges?.some(b => b.includes('Özel') || b.includes('Antep'));
          default:
            return true;
        }
      });
    }

    // Apply sorting
    if (currentSort !== 'default') {
      filteredProducts.sort((a, b) => {
        const priceA = parsePrice(a.price);
        const priceB = parsePrice(b.price);
        
        switch(currentSort) {
          case 'price-asc':
            return priceA - priceB;
          case 'price-desc':
            return priceB - priceA;
          case 'name-asc':
            return a.name.localeCompare(b.name, 'tr');
          default:
            return 0;
        }
      });
    }

    // Re-render grid
    renderFilteredGrid(filteredProducts);
  }

  function renderFilteredGrid(filteredProducts) {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (filteredProducts.length === 0) {
      grid.innerHTML = `
        <div class="no-results-message">
          <div class="no-results-icon">🔍</div>
          <p>Bu kategoride ürün bulunamadı.</p>
        </div>
      `;
      return;
    }

    filteredProducts.forEach((product, index) => {
      const card = createCard(product, index);
      grid.appendChild(card);
    });
  }

  function createCard(product, index) {
    const el = document.createElement('article');
    el.className = 'card';
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `${product.name} - ${product.price}`);
    el.style.animationDelay = `${index * 40}ms`;

    const imgError = `this.onerror=null;this.src='img/pattern.png';`;

    el.innerHTML = `
      <img class="card-img" src="${product.img}" alt="${product.name}" loading="lazy" onerror="${imgError}">
      <div class="card-body">
        <h3 class="title">${product.name}</h3>
        <div class="price">${product.price}</div>
        <div class="badges">${product.badges?.map((b, i) => 
          `<span class="badge" style="animation-delay:${i * 60}ms">${b}</span>`
        ).join('') || ''}</div>
        <button class="add-to-cart-btn" data-id="${product.id}" aria-label="Sepete ekle">
          🛒
        </button>
        <button class="favorite-btn ${Favorites.isFavorite(product.id) ? 'active' : ''}" data-id="${product.id}" aria-label="Favorilere ekle">
          ${Favorites.isFavorite(product.id) ? '❤️' : '🤍'}
        </button>
      </div>
    `;

    // Card click opens modal
    el.addEventListener('click', (e) => {
      if (!e.target.closest('.add-to-cart-btn') && !e.target.closest('.favorite-btn')) {
        if (window.openModal) openModal(product);
      }
    });

    // Add to cart
    const addBtn = el.querySelector('.add-to-cart-btn');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.Cart?.add(product);
      });
    }

    // Favorite toggle
    const favBtn = el.querySelector('.favorite-btn');
    if (favBtn) {
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        Favorites.toggle(product);
        const isFav = Favorites.isFavorite(product.id);
        favBtn.innerHTML = isFav ? '❤️' : '🤍';
        favBtn.classList.toggle('active', isFav);
      });
    }

    return el;
  }

  function parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    return parseFloat(priceStr.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
  }

  // Public API
  return {
    init,
    setFilter,
    setSort,
    getCurrentFilter: () => currentFilter,
    getCurrentSort: () => currentSort
  };
})();

window.Filters = Filters;
