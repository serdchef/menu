/**
 * Coşkun Yaycı - Main App Module
 * Ürün listeleme, modal yönetimi, sepet ve favori entegrasyonu
 */

(function() {
  'use strict';

  // Global state
  let currentModalProduct = null;
  let currentQuantity = 1;

  // DOM Elements
  const grid = document.getElementById('productGrid');
  const modal = document.getElementById('productModal');
  const modalClose = document.getElementById('modalClose');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  // Initialize application
  function init() {
    if (!grid) return;
    
    // Wait for products to be available
    const checkProducts = setInterval(() => {
      if (window.products && window.products.length > 0) {
        clearInterval(checkProducts);
        onProductsLoaded();
      }
    }, 50);

    // Setup event listeners
    setupModalListeners();
    setupFabListeners();
    setupQuantityListeners();
  }

  // Called when products are loaded
  function onProductsLoaded() {
    // Initialize modules
    if (window.Search) Search.init(window.products);
    if (window.Filters) Filters.init(window.products);
    if (window.Favorites) Favorites.init();
    if (window.Cart) Cart.init();
    if (window.Analytics) Analytics.init();

    // Initial render
    renderProducts(window.products);
    updateBadgeCounts();

    // Listen for cart/favorites updates
    window.addEventListener('cartUpdated', updateBadgeCounts);
    window.addEventListener('favoritesUpdated', updateBadgeCounts);
    
    // Track page view
    if (window.Analytics) {
      Analytics.track('page_view', {
        page_title: document.title,
        page_location: window.location.href
      });
    }
  }

  // Render product grid
  function renderProducts(products) {
    if (!grid) return;
    
    grid.innerHTML = '';
    grid.setAttribute('aria-busy', 'false');

    if (products.length === 0) {
      grid.innerHTML = `
        <div class="no-results-message" role="status">
          <div class="no-results-icon">🔍</div>
          <p>Ürün bulunamadı.</p>
        </div>
      `;
      return;
    }

    products.forEach((product, index) => {
      const card = createCard(product, index);
      grid.appendChild(card);
    });
  }

  // Create product card
  function createCard(product, index) {
    const el = document.createElement('article');
    el.className = 'card';
    el.tabIndex = 0;
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', `${product.name} - ${product.price}`);
    el.style.animationDelay = `${index * 40}ms`;

    const imgError = `this.onerror=null;this.src='img/pattern.png';`;

    el.innerHTML = `
      <button class="add-to-cart-btn" data-id="${product.id}" aria-label="Sepete hızlı ekle">
        🛒
      </button>
      <img class="card-img" src="${product.img}" alt="${product.name}" loading="lazy" onerror="${imgError}" width="300" height="200">
      <div class="card-body">
        <h3 class="title">${product.name}</h3>
        <div class="price">${product.price}</div>
        <div class="badges">${product.badges?.map((b, i) => 
          `<span class="badge" style="animation-delay:${i * 60}ms">${b}</span>`
        ).join('') || ''}</div>
      </div>
    `;

    // Card click opens modal
    el.addEventListener('click', (e) => {
      if (!e.target.closest('.add-to-cart-btn')) {
        openModal(product);
      }
    });

    el.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(product);
      }
    });

    // Quick add to cart
    const addBtn = el.querySelector('.add-to-cart-btn');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.Cart) {
        Cart.add(product);
      }
    });

    return el;
  }

  // Open product modal
  function openModal(product) {
    currentModalProduct = product;
    currentQuantity = 1;

    const modalImg = document.getElementById('modalImg');
    const modalTitle = document.getElementById('modalTitle');
    const modalPrice = document.getElementById('modalPrice');
    const modalDesc = document.getElementById('modalDesc');
    const modalMeta = document.getElementById('modalMeta');
    const modalBadges = document.getElementById('modalBadges');
    const qtyValue = document.getElementById('qtyValue');

    // Image error handling
    modalImg.onerror = function() {
      this.src = 'img/pattern.png';
    };

    modalImg.src = product.img;
    modalImg.alt = product.name;
    modalTitle.textContent = product.name;
    modalPrice.textContent = product.price;
    modalDesc.textContent = product.desc;
    modalMeta.textContent = product.meta || '';
    qtyValue.textContent = '1';

    // Badges
    modalBadges.innerHTML = product.badges?.map((b, i) => 
      `<span class="badge" style="animation-delay:${i * 40}ms">${b}</span>`
    ).join('') || '';

    // Nutrition info
    const nutritionInfo = document.getElementById('nutritionInfo');
    const nutritionGrid = document.getElementById('nutritionGrid');
    if (product.nutrition && nutritionInfo && nutritionGrid) {
      nutritionInfo.style.display = 'block';
      nutritionGrid.innerHTML = Object.entries(product.nutrition).map(([key, value]) => `
        <div class="nutrition-item">
          <span class="nutrition-label">${window.nutritionLabels?.[key] || key}:</span>
          <span class="nutrition-value">${value}</span>
        </div>
      `).join('');
    } else if (nutritionInfo) {
      nutritionInfo.style.display = 'none';
    }

    // Allergens
    const allergenInfo = document.getElementById('allergenInfo');
    const allergenTags = document.getElementById('allergenTags');
    if (product.allergens && product.allergens.length > 0 && allergenInfo && allergenTags) {
      allergenInfo.style.display = 'block';
      allergenTags.innerHTML = product.allergens.map(allergen => {
        const info = window.allergenInfo?.[allergen] || { icon: '⚠️', name: allergen };
        return `<span class="allergen-tag" title="${info.desc || ''}">${info.icon} ${info.name}</span>`;
      }).join('');
    } else if (allergenInfo) {
      allergenInfo.style.display = 'none';
    }

    // Update add to cart button
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) {
      addToCartBtn.textContent = '🛒 Sepete Ekle';
      addToCartBtn.onclick = () => {
        if (window.Cart) {
          for (let i = 0; i < currentQuantity; i++) {
            Cart.add(product);
          }
          closeModal();
        }
      };
    }

    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Focus management
    setTimeout(() => {
      modalClose.focus();
    }, 100);

    // Track view
    if (window.Analytics) {
      Analytics.track('view_item', {
        currency: 'TRY',
        value: parsePrice(product.price),
        items: [{
          item_id: product.id,
          item_name: product.name,
          price: parsePrice(product.price)
        }]
      });
    }
  }

  // Close modal
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    currentModalProduct = null;
    currentQuantity = 1;
  }

  // Setup modal event listeners
  function setupModalListeners() {
    if (!modal) return;

    // Close buttons
    if (modalClose) {
      modalClose.addEventListener('click', closeModal);
    }
    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', closeModal);
    }

    // Overlay click
    const overlay = modal.querySelector('.modal-overlay');
    if (overlay) {
      overlay.addEventListener('click', closeModal);
    }

    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
        closeModal();
      }
    });

    // Focus trap
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });
  }

  // Setup FAB listeners
  function setupFabListeners() {
    const fabCart = document.getElementById('fabCart');
    const fabFavorites = document.getElementById('fabFavorites');

    if (fabCart) {
      fabCart.addEventListener('click', () => {
        const message = window.Cart?.generateOrderMessage();
        if (message) {
          window.open(`https://wa.me/905325231136?text=${message}`, '_blank');
          if (window.Analytics) {
            Analytics.track('begin_checkout', {
              currency: 'TRY',
              value: Cart.getTotal(),
              items: Cart.getItems().map(item => ({
                item_id: item.id,
                item_name: item.name,
                price: item.priceValue,
                quantity: item.quantity
              }))
            });
          }
        } else {
          alert('Sepetiniz boş! Önce ürün ekleyin.');
        }
      });
    }

    if (fabFavorites) {
      fabFavorites.addEventListener('click', () => {
        if (window.Favorites) {
          Favorites.showFavoritesModal();
        }
      });
    }
  }

  // Setup quantity selector
  function setupQuantityListeners() {
    const qtyMinus = document.getElementById('qtyMinus');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyValue = document.getElementById('qtyValue');

    if (qtyMinus) {
      qtyMinus.addEventListener('click', () => {
        if (currentQuantity > 1) {
          currentQuantity--;
          qtyValue.textContent = currentQuantity;
        }
      });
    }

    if (qtyPlus) {
      qtyPlus.addEventListener('click', () => {
        if (currentQuantity < 10) {
          currentQuantity++;
          qtyValue.textContent = currentQuantity;
        }
      });
    }
  }

  // Update badge counts
  function updateBadgeCounts() {
    const cartCount = document.getElementById('cartCount');
    const favCount = document.getElementById('favCount');

    if (cartCount && window.Cart) {
      const count = Cart.getCount();
      cartCount.textContent = count;
      cartCount.style.display = count > 0 ? 'flex' : 'none';
    }

    if (favCount && window.Favorites) {
      const count = Favorites.getAll().length;
      favCount.textContent = count;
      favCount.style.display = count > 0 ? 'flex' : 'none';
    }
  }

  // Parse price helper
  function parsePrice(priceStr) {
    if (typeof priceStr === 'number') return priceStr;
    return parseFloat(priceStr.replace(/[^0-9,]/g, '').replace(',', '.')) || 0;
  }

  // Share functionality
  async function shareProduct(product) {
    const shareData = {
      title: product.name,
      text: `${product.name} - ${product.price}`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        if (window.Analytics) {
          Analytics.track('share', { method: 'native', content_type: 'product', item_id: product.id });
        }
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      // Fallback - copy to clipboard
      const text = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Ürün bilgisi kopyalandı!');
      });
    }
  }

  // Expose functions globally
  window.openModal = openModal;
  window.closeModal = closeModal;
  window.renderProducts = renderProducts;
  window.shareProduct = shareProduct;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
